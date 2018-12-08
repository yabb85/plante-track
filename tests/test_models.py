#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Unit tests
"""

from __future__ import unicode_literals
import pytest
import urllib2
from flask import url_for


@pytest.mark.usefixtures('live_server')
class TestLiveServer(object):
    """
    Test existing  server
    """
    def test_server_is_up_and_running(self):
        """
        send a request to local server
        """
        res = urllib2.urlopen(url_for('sensorlist', _external=True))
        assert res.code == 200


@pytest.mark.usefixtures('client_class')
class TestSuite(object):
    """
    Define test of api
    """
    mac = '01:23:45:67:89'
    name = 'test'
    description = 'description'
    plant_type = 'verte'

    def create_sensor(self):
        """
        execute a request to create a new sensor
        """
        return self.client.post(url_for('sensorlist'),
                                data=dict(name=self.name, mac=self.mac,
                                          description=self.description,
                                          plant_type=self.plant_type))

    def create_measure(self, humidity, temperature, floor_humidity):
        """
        Execute a request to add a new measure for specified sensor
        """
        return self.client.post(url_for('sensor', sensor_mac=self.mac),
                                data=dict(humidity=humidity,
                                          temperature=temperature,
                                          floor_humidity=floor_humidity))

    def test_1(self):
        """
        test index page
        """
        response = self.client.get(url_for('simple_page.index'))
        assert response.status == '200 OK'

    def test_2(self):
        """check the sensor list with empty database"""
        response = self.client.get(url_for('sensorlist'))
        assert response.status == '200 OK'
        assert response.json == {}

    def test_3(self):
        """
        Test creation of new sensor
        """
        response = self.create_sensor()
        assert response.status == '200 OK'
        assert response.json['name'] == self.name
        assert response.json['mac'] == self.mac
        assert response.json['description'] == self.description
        assert response.json['plant_type'] == self.plant_type
        assert response.json['image'] == ''
        assert response.json['id'] is not None
        response = self.client.get(url_for('sensorlist'))
        assert response.status == '200 OK'
        assert response.json == {
            self.name: {
                'description': self.description,
                'mac': self.mac,
                'plant_type': self.plant_type,
                'image': ''
            }
        }

    def test_4(self):
        """
        Test the sensor information before push measures
        """
        self.create_sensor()
        response = self.client.get(url_for('sensor', sensor_mac=self.mac))
        assert response.status == '200 OK'
        assert response.json == {
            'description': self.description,
            'mac': self.mac,
            'plant_type': self.plant_type,
            'image': '',
            'name': self.name
        }

    def test_5(self):
        """
        Test the creation of new measure for specified sensor
        """
        self.create_sensor()
        response = self.create_measure(40, 25, 150)
        assert response.status == '200 OK'
        assert response.json == {
            'name': self.name,
            'image': '',
            'temperature': '25',
            'humidity': '40',
            'floor_humidity': '150'
        }
        response = self.client.get(url_for('sensor', sensor_mac=self.mac))
        assert response.status == '200 OK'
        assert response.json['name'] == self.name
        assert response.json['description'] == self.description
        assert response.json['mac'] == self.mac
        assert response.json['plant_type'] == self.plant_type
        stats = response.json['stats']
        assert len(stats) == 1
        assert stats[0]['humidity'] == 40
        assert stats[0]['temperature'] == 25

    def test_6(self):
        """
        Test the sensor page with measure
        """
        self.create_sensor()
        self.create_measure(40, 25, 150)
        self.create_measure(41, 24, 8)
        self.create_measure(42, 23, 400)
        response = self.client.get(url_for('sensor', sensor_mac=self.mac))
        assert response.status == '200 OK'
        assert response.json['name'] == self.name
        assert response.json['description'] == self.description
        assert response.json['mac'] == self.mac
        assert response.json['plant_type'] == self.plant_type
        stats = response.json['stats']
        assert len(stats) == 3
        assert stats[0]['humidity'] == 40
        assert stats[0]['temperature'] == 25
        assert stats[1]['humidity'] == 41
        assert stats[1]['temperature'] == 24
        assert stats[2]['humidity'] == 42
        assert stats[2]['temperature'] == 23
