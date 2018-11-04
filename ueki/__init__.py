#! /usr/bin/python
# -*- coding:utf-8 -*-
"""
Initialisation package
"""

from __future__ import absolute_import
from __future__ import print_function
from logging import DEBUG
from logging import getLogger
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_uploads import configure_uploads
from flask_compress import Compress
from .models import DATA_BASE
from .api import api
from .upload import uploaded_image
from .views import simple_page


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
