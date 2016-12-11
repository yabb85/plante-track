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
    id = Column(String(35), primary_key=True, unique=True)
    name = Column(String(50))
    mac = Column(String(16))
    description = Column(Text())
    type = Column(String(100))

    def __init__(self, name, mac, description, plant_type):
        """docstring for __init__"""
        DATA_BASE.Model.__init__(self)
        self.id = uuid4().hex
        self.name = name
        self.mac = mac
        self.description = description
        self.type = plant_type


class Stats(DATA_BASE.Model):
    """
    Interface of stats table
    """
    __tablename__ = 'stats'
    id = Column(String(35), primary_key=True, unique=True)
    id_sensor = Column(String(35), ForeignKey('sensors.id'), nullable=False)
    temperature = Column(Integer)
    humidity = Column(Integer)
    time = Column(DateTime())

    def __init__(self, id_sensor, temperature, humidity, time):
        DATA_BASE.Model.__init__(self)
        self.id = uuid4().hex
        self.id_sensor = id_sensor
        self.temperature = temperature
        self.humidity = humidity
        self.time = time


trig_ddl = DDL("""
                create trigger tr_limit_size after insert on %s
                when 15 < (select count() from %s where id_sensor=new.id_sensor)
                begin
                delete from %s where id in (select id from %s where id_sensor=new.id_sensor order by time asc limit 1);
                end;
                """ % ('stats', 'stats', 'stats', 'stats'))

event.listen(Stats.__table__, 'after_create', trig_ddl)
