#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Create an api for site
"""
from app import app
from models import sensors
from flask_restful import Resource, Api, reqparse, abort
from time import time

api = Api(app)


def abort_if_sensor_doesnt_exist(sensor_id):
    """docstring for abort_if_sensor_doesnt_exist"""
    if sensor_id not in sensors:
        abort(404, message="Sensor {} doesn't exist".format(sensor_id))

parser = reqparse.RequestParser()
parser.add_argument('id')
parser.add_argument('temp')
parser.add_argument('hum')


class Temp(Resource):
    """
    add method to see data of sensor
    """
    def get(self, sensor_id):
        """return measures for one sensor"""
        abort_if_sensor_doesnt_exist(sensor_id)
        return {sensor_id: sensors[sensor_id]}

    def delete(self, sensor_id):
        """remove one sensor"""
        abort_if_sensor_doesnt_exist(sensor_id)
        del sensors[sensor_id]
        return '', 204


class TempList(Resource):
    def get(self):
        """return list of measures for all sensors"""
        return sensors

    def post(self):
        """append measure for one sensors"""
        args = parser.parse_args()
        sensor_id = args['id']
        task = {'temp': args['temp'], 'humidity': args['hum'], 'date': time()}
        sensors[sensor_id] = task
        return sensors[sensor_id], 201

api.add_resource(Temp, '/sensors/<string:sensor_id>')
api.add_resource(TempList, '/sensors')
