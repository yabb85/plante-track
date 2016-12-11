#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Initialisation package
"""

from __future__ import print_function
from logging import DEBUG
from logging import getLogger
from flask import Flask
from logging.handlers import RotatingFileHandler
from app.models import DATA_BASE
from app.api import api
from app.views import simple_page


app = Flask(__name__)
app.secret_key = 'plante website'
app.register_blueprint(simple_page)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
DATA_BASE.init_app(app)
api.init_app(app)

handler = RotatingFileHandler('ueki.log', maxBytes=10000, backupCount=1)
handler.setLevel(DEBUG)
app.logger.addHandler(handler)

logger = getLogger('werkzeug')
logger.addHandler(handler)


@app.cli.command()
def initdb():
    """Initialize the database."""
    DATA_BASE.create_all()
    print(u'Init the db')
