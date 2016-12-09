#! /usr/bin/python
# -*- coding:utf-8 -*-

"""
Connect to sqlite database
"""

import sqlite3


DATABASE = 'database.db'


class Sensors(object):
    """Collection of sensors"""
    def __init__(self, *args):
        """
        Initialize collection of sensors
        """
        self.conn_uri = 'database.db'

    def install(self):
        """
        Create database with schema.sql
        """
        with open('schema.sql', mode='r') as sql_file:
            conn = sqlite3.connect(self.conn_uri)
            conn.executescript(sql_file.read())

    def add_sensor(self, name, mac, description, plant_type):
        """
        Add new sensor in database
        """
        query = 'INSERT INTO sensors (name, mac, description, type) ' \
            'VALUES (?,?,?,?);'
        conn = sqlite3.connect(self.conn_uri)
        cursor = conn.cursor()
        cursor.execute(query, [name, mac, description, plant_type])
        conn.commit()
        cursor.execute('SELECT * FROM sensors WHERE id=?', [cursor.lastrowid])
        row = cursor.fetchone()
        conn.close()
        result = {'name': row[1],
                  'mac': row[2],
                  'description': row[3],
                  'type': row[4]}
        return result

    def get_sensors(self):
        """docstring for get_sensors"""
        result = {}
        query = 'SELECT * FROM sensors;'
        conn = sqlite3.connect(self.conn_uri)
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        for row in rows:
            print row
            result[row[1]] = {'mac': row[2],
                              'description': row[3],
                              'type': row[4]}
        conn.close()
        return result

    def get_sensor(self, sensor_name):
        """docstring for get_sensors"""
        result = {}
        query = 'SELECT * FROM sensors INNER JOIN stats ' \
            'ON sensors.id = stats.id_sensor WHERE sensors.name=?;'
        conn = sqlite3.connect(self.conn_uri)
        cursor = conn.cursor()
        cursor.execute(query, [sensor_name])
        rows = cursor.fetchall()
        for row in rows:
            print row
            if row[1] in result:
                result[row[1]]['stats'].append({
                    'temperature': row[7],
                    'humidity': row[8],
                    'date': row[9]
                })
            else:
                result[row[1]] = {
                    'mac': row[2],
                    'description': row[3],
                    'type': row[4],
                    'stats': [
                        {
                            'temperature': row[7],
                            'humidity': row[8],
                            'date': row[9]
                        }]
                }
        conn.close()
        return result

    def delete_sensor(self, sensor_name):
        """
        docstring for delete_sensor
        """
        #TODO: finir de supprimer les entrée dans la table stats
        query = 'DELETE FROM sensors WHERE name=?;'
        conn = sqlite3.connect(self.conn_uri)
        cursor = conn.cursor()
        cursor.execute(query, [sensor_name])
        conn.commit()
        conn.close()

    def add_measure(self, sensor_name, temp, humidity, date):
        """docstring for add_measure"""
        query = 'SELECT id,name FROM sensors WHERE name=?;'
        conn = sqlite3.connect(self.conn_uri)
        cursor = conn.cursor()
        cursor.execute(query, [sensor_name])
        sensor = cursor.fetchone()
        print sensor
        id_sensor = sensor[0]
        query = 'INSERT INTO stats (id_sensor, temperature, humidity, label) ' \
            'VALUES (?,?,?,?);'
        cursor.execute(query, [id_sensor, temp, humidity, date])
        cursor.execute('SELECT * FROM stats WHERE id=?', [cursor.lastrowid])
        inserted_value = cursor.fetchone()
        conn.commit()
        conn.close()
        result = {'name': sensor[1],
                  'temperature': inserted_value[2],
                  'humidity': inserted_value[3]}
        return result


sensors = Sensors()
