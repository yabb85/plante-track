#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Create an api for site
"""

from __future__ import print_function
from flask_restful import Api
from flask_restful import Resource
from flask_restful import reqparse
from flask_restful import abort
from datetime import datetime
from app.models import DATA_BASE
from app.models import Sensor as db_sensor
from app.models import Stats as db_stats

api = Api()


def abort_if_sensor_doesnt_exist(sensor_mac):
    """docstring for abort_if_sensor_doesnt_exist"""
    if sensor_mac not in sensors:
        abort(404, message="Sensor {} doesn't exist".format(sensor_mac))


class Sensor(Resource):
    """
    add method to see data of sensor
    """
    def __init__(self):
        """docstring for __init__"""
        self.post_parser = reqparse.RequestParser()
        self.post_parser.add_argument('temp')
        self.post_parser.add_argument('humidity')

    def get(self, sensor_mac):
        """return measures for one sensor"""
        result = {}
        sensor = db_sensor.query.filter(db_sensor.mac==sensor_mac)
        stats = db_stats.query.join(sensor).add_columns(
            db_sensor.description, db_sensor.name, db_sensor.plant_type).order_by(
                db_stats.time).all()
        for stat, description, name, plant_type in stats:
            if name in result:
                result[name]['stats'].append({
                    'temperature': stat.temperature,
                    'humidity': stat.humidity,
                    'date': stat.time.isoformat()
                })
            else:
                result[name] = {
                    'mac': sensor_mac,
                    'description': description,
                    'type': plant_type,
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
        sensor = db_sensor.query.filter(db_sensor.mac==sensor_mac).first()
        if not sensor:
            return '', 204
        stat = db_stats(sensor.id, temp, humidity, datetime.utcnow())
        DATA_BASE.session.add(stat)
        DATA_BASE.session.commit()
        return {
            'name': sensor.name,
            'temperature': temp,
            'humidity': humidity
        }

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

    def get(self):
        """return list of measures for all sensors"""
        result = {}
        sensors = db_sensor.query.all()
        for row in sensors:
            result[row.name] = {'mac': row.mac,
                              'description': row.description,
                              'type': row.plant_type}
        return result

    def post(self):
        """add new sensor"""
        args = self.parser.parse_args()
        name = args['name']
        mac = args['mac']
        description = args['description']
        plant_type = args['type']
        sensor = db_sensor(name, mac, description, plant_type)
        DATA_BASE.session.add(sensor)
        DATA_BASE.session.commit()
        return {
            'id': sensor.id,
            'name': sensor.name,
            'mac': sensor.mac,
            'description': sensor.description,
            'type': sensor.plant_type
        }


api.add_resource(Sensor, '/sensors/<string:sensor_mac>')
api.add_resource(SensorList, '/sensors')
