#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Create an api for site
"""

from __future__ import print_function
from __future__ import unicode_literals
from flask_restful import Api
from flask_restful import Resource
from flask_restful import reqparse
from datetime import datetime
from ueki.models import DATA_BASE
from ueki.models import Sensor as db_sensor
from ueki.models import Stats as db_stats
from ueki.upload import uploaded_image
from werkzeug import datastructures

api = Api()


class Sensor(Resource):
    """
    add method to see data of sensor
    """
    def __init__(self):
        """docstring for __init__"""
        self.post_parser = reqparse.RequestParser()
        self.post_parser.add_argument('temp')
        self.post_parser.add_argument('humidity')
        self.put_parser = reqparse.RequestParser()
        self.put_parser.add_argument('name')
        self.put_parser.add_argument('mac')
        self.put_parser.add_argument('type')
        self.put_parser.add_argument('description')
        self.put_parser.add_argument('file',
                                     type=datastructures.FileStorage,
                                     location='files')

    def get(self, sensor_mac):
        """return measures for one sensor"""
        result = {}
        # sensor = db_sensor.query.filter(db_sensor.mac == sensor_mac)
        # stats_query = db_stats.query.join(sensor).add_columns(
            # db_sensor.description, db_sensor.name, db_sensor.plant_type).order_by(
                # db_stats.time)
        # print(stats_query)
        other_query = DATA_BASE.session.query(db_sensor, db_stats).filter(
            db_sensor.mac == sensor_mac).join(db_stats, db_stats.id_sensor ==
                                              db_sensor.id)
        stats = other_query.all()
        for sensor, stat in stats:
            if sensor.name in result:
                result[sensor.name]['stats'].append({
                    'temperature': stat.temperature,
                    'humidity': stat.humidity,
                    'date': stat.time.isoformat()
                })
            else:
                result[sensor.name] = {
                    'mac': sensor.mac,
                    'description': sensor.description,
                    'type': sensor.plant_type,
                    'image': sensor.image,
                    'stats': [
                        {
                            'temperature': stat.temperature,
                            'humidity': stat.humidity,
                            'date': stat.time.isoformat()
                        }
                    ]
                }
        return result

    def post(self, sensor_mac):
        """docstring for patch"""
        args = self.post_parser.parse_args()
        print(args)
        temp = args['temp']
        humidity = args['humidity']
        sensor = db_sensor.query.filter(db_sensor.mac == sensor_mac).first()
        if not sensor:
            return '', 204
        stat = db_stats(sensor.id, temp, humidity, datetime.utcnow())
        DATA_BASE.session.add(stat)
        DATA_BASE.session.commit()
        return {
            'name': sensor.name,
            'image': sensor.image,
            'temperature': temp,
            'humidity': humidity
        }

    def put(self, sensor_mac):
        """
        Update informations of sensor
        """
        args = self.put_parser.parse_args()
        name = args['name']
        description = args['description']
        plant_type = args['type']
        image = args['file']
        filename = uploaded_image.save(image)
        url = uploaded_image.url(filename)
        sensor = db_sensor.query.filter(db_sensor.mac == sensor_mac).first()
        if not sensor:
            return '', 204
        sensor.name = name
        sensor.plant_type = plant_type
        sensor.description = description
        sensor.image = url
        DATA_BASE.session.commit()

    def delete(self, sensor_mac):
        """remove one sensor"""
        return '', 204


class SensorList(Resource):
    """
    add method to see list of sensors
    """
    def __init__(self):
        """docstring for __init__"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name')
        self.parser.add_argument('mac')
        self.parser.add_argument('description')
        self.parser.add_argument('type')
        self.parser.add_argument('file',
                                 type=datastructures.FileStorage,
                                 location='files')

    def get(self):
        """return list of measures for all sensors"""
        result = {}
        sensors = db_sensor.query.all()
        for row in sensors:
            result[row.name] = {'mac': row.mac,
                                'description': row.description,
                                'type': row.plant_type,
                                'image': row.image}
        return result

    def post(self):
        """add new sensor"""
        args = self.parser.parse_args()
        name = args['name']
        mac = args['mac']
        description = args['description']
        plant_type = args['type']
        image = args['file']
        url = ''
        if image:
            filename = uploaded_image.save(image)
            url = uploaded_image.url(filename)
        sensor = db_sensor(name, mac, description, plant_type, url)
        DATA_BASE.session.add(sensor)
        DATA_BASE.session.commit()
        return {
            'id': sensor.id,
            'name': sensor.name,
            'mac': sensor.mac,
            'description': sensor.description,
            'type': sensor.plant_type,
            'image': sensor.image
        }


api.add_resource(Sensor, '/sensors/<string:sensor_mac>')
api.add_resource(SensorList, '/sensors')
