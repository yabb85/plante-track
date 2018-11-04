#! /usr/bin/python
# -*- coding:utf-8 -*-

from __future__ import absolute_import
from __future__ import unicode_literals
from __future__ import print_function
from datetime import datetime
# from paho.mqtt import client as mqtt
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
from json import loads as json_loads
from .models import DATA_BASE
from .models import Sensor as db_sensor
from .models import Stats as db_stats


# def on_message(client, userdata, message):
    # """
    # """
    # payload = str(message.payload.decode("utf-8"))
    # print("message received ", payload)
    # print("message topic=", message.topic)
    # data = json_loads(payload)
    # print(data)
    # sensor = db_sensor.query.filter(db_sensor.mac == message.topic).first()
    # if not sensor:
        # print('toto')
    # print(sensor)
    # stat = db_stats(sensor.id, data['temperature'], data['humidity'],
                    # data['floor_soil'], datetime.utcnow())
    # print(stat)
    # DATA_BASE.session.add(stat)
    # DATA_BASE.session.commit()


# client = mqtt.Client('ueki')
# client.on_message = on_message


mqtt = Mqtt()
socketio = SocketIO()


@socketio.on('publish')
def handle_publish(json_str):
    data = json.loads(json_str)
    print(data)
    mqtt.publish(data['topic'], data['message'])


@socketio.on('subscribe')
def handle_subscribe(json_str):
    data = json.loads(json_str)
    print(data)
    mqtt.subscribe(data['topic'])


@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    print('message', message)
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    print('message', data)
    sensor = db_sensor.query.filter(db_sensor.mac == data['topic']).first()
    if not sensor:
        print('toto')
    print(sensor)
    data = data['payload']
    stat = db_stats(sensor.id, data['temperature'], data['humidity'],
                    data['floor_soil'], datetime.utcnow())
    print(stat)
    DATA_BASE.session.add(stat)
    DATA_BASE.session.commit()


@mqtt.on_connect()
def handle_mqtt_connect(client, userdata, flags, rc):
    """
    """
    print('connect')


@mqtt.on_subscribe()
def handle_mqtt_suscribe(client, userdata, mid, granted_qos):
    """"""
    print('subscription')
