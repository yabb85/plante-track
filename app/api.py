#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Create an api for site
"""
from app import app
from app.models import sensors
from flask_restful import Resource, Api, reqparse, abort
from time import time

api = Api(app)


def abort_if_sensor_doesnt_exist(sensor_id):
    """docstring for abort_if_sensor_doesnt_exist"""
    if sensor_id not in sensors:
        abort(404, message="Sensor {} doesn't exist".format(sensor_id))


class Sensor(Resource):
    """
    add method to see data of sensor
    """
    def __init__(self):
        """docstring for __init__"""
        self.post_parser = reqparse.RequestParser()
        self.post_parser.add_argument('temp')
        self.post_parser.add_argument('humidity')

    def get(self, sensor_id):
        """return measures for one sensor"""
        return sensors.get_sensor(sensor_id)

    def post(self, sensor_id):
        """docstring for patch"""
        args = self.post_parser.parse_args()
        temp = args['temp']
        humidity = args['humidity']
        return sensors.add_measure(sensor_id, temp, humidity, time())

    def delete(self, sensor_id):
        """remove one sensor"""
        sensors.delete_sensor(sensor_id)
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
        return sensors.get_sensors()

    def post(self):
        """add new sensor"""
        args = self.parser.parse_args()
        name = args['name']
        mac = args['mac']
        description = args['description']
        plant_type = args['type']
        return sensors.add_sensor(name, mac, description, plant_type)

api.add_resource(Sensor, '/sensors/<string:sensor_id>')
api.add_resource(SensorList, '/sensors')
