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
from ueki.models import DATA_BASE
from ueki.api import api
from ueki.upload import uploaded_image
from ueki.views import simple_page
from flask_uploads import configure_uploads
from flask_compress import Compress


def create_app(settings=None):
    """
    Create flask application
    """
    app = Flask(__name__)
    app.secret_key = 'plante website'
    app.register_blueprint(simple_page)
    if settings:
        app.config.update(settings)

    DATA_BASE.init_app(app)
    api.init_app(app)
    compress = Compress()
    compress.init_app(app)

    configure_uploads(app, uploaded_image)

    handler = RotatingFileHandler('ueki.log', maxBytes=10000, backupCount=1)
    handler.setLevel(DEBUG)
    app.logger.addHandler(handler)
    logger = getLogger('werkzeug')
    logger.addHandler(handler)

    return app


def create_db():
    """docstring for create_db"""
    DATA_BASE.create_all()
