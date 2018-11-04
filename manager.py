#!/usr/bin/python
# -*- coding:utf-8 -*-
"""
Script principal
"""

from __future__ import print_function
from flask_script import Manager
from flask_script import Server
from ueki import create_app
from ueki import create_db


SETTINGS = {
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db',
    'UPLOADS_DEFAULT_DEST': '/tmp/upload',
    'MQTT_CLIENT_ID': 'ueki',
    'MQTT_BROKER_URL': 'localhost',
    'MQTT_BROKER_PORT': '1883',
    'MQTT_USERNAME': '',
    'MQTT_PASSWORD': ''
}
app = create_app(SETTINGS)

manager = Manager(app)
manager.add_command('runserver', Server(host='0.0.0.0', port=5000))


@app.errorhandler(500)
def internal_error(exception):
    app.logger.error(exception)
    return 500


@manager.command
def initdb():
    """Initialize the database."""
    create_db()
    print(u'Init the db')


if __name__ == "__main__":
    manager.run()
