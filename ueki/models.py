#! /usr/bin/python
# -*- coding:utf-8 -*-

"""
Representation of database
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import event
from sqlalchemy import DDL
from uuid import uuid4


DATA_BASE = SQLAlchemy()


class Sensor(DATA_BASE.Model):
    """
    Interface of sensors table
    """
    __tablename__ = 'sensors'
    id = Column(String(35))
    name = Column(String(50), primary_key=True, unique=True)
    mac = Column(String(16))
    description = Column(Text())
    plant_type = Column(String(100))
    image = Column(String(200))
    limit_temperature = Column(Integer)
    limit_humidity = Column(Integer)
    limit_soil_hum = Column(Integer)

    def __init__(self, name, mac, description, plant_type, image):
        """docstring for __init__"""
        # DATA_BASE.Model.__init__(self)
        self.id = uuid4().hex
        self.name = name
        self.mac = mac
        self.description = description
        self.plant_type = plant_type
        self.image = image


class Stats(DATA_BASE.Model):
    """
    Interface of stats table
    """
    __tablename__ = 'stats'
    id_sensor = Column(String(35), ForeignKey('sensors.id'), primary_key=True)
    temperature = Column(Integer)
    humidity = Column(Integer)
    floor_humidity = Column(Integer)
    time = Column(DateTime(), primary_key=True)

    def __init__(self, id_sensor, temperature, humidity, floor_humidity, time):
        # DATA_BASE.Model.__init__(self)
        self.id = uuid4().hex
        self.id_sensor = id_sensor
        self.temperature = temperature
        self.humidity = humidity
        self.floor_humidity = floor_humidity
        self.time = time


trig_ddl = DDL("""
                create trigger tr_limit_size after insert on %s
                when 2232 < (select count() from %s where id_sensor=new.id_sensor)
                begin
                delete from %s where id in (select id from %s where id_sensor=new.id_sensor order by time asc limit 1);
                end;
                """ % ('stats', 'stats', 'stats', 'stats'))

# event.listen(Stats.__table__, 'after_create', trig_ddl)
