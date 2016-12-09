#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Initialisation package
"""

from logging import DEBUG
from logging import getLogger
from flask import Flask
from logging.handlers import RotatingFileHandler
from app.models import sensors

app = Flask(__name__)
app.secret_key = 'plante website'

handler = RotatingFileHandler('ueki.log', maxBytes=10000, backupCount=1)
handler.setLevel(DEBUG)
app.logger.addHandler(handler)

logger = getLogger('werkzeug')
logger.addHandler(handler)


@app.cli.command()
def initdb():
    """Initialize the database."""
    sensors.install()
    print u'Init the db'


from app import api, views
