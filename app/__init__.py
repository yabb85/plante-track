#! /usr/bin/python
# -*- coding:utf-8 -*-

from logging import DEBUG
from logging import getLogger
from flask import Flask
from logging.handlers import RotatingFileHandler

"""
Initialisation package
"""
app = Flask(__name__)
app.secret_key = 'plante website'

handler = RotatingFileHandler('ueki.log', maxBytes=10000, backupCount=1)
handler.setLevel(DEBUG)
app.logger.addHandler(handler)

logger = getLogger('werkzeug')
logger.addHandler(handler)

sensors = {}

from app import api, views
