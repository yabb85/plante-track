#! /usr/bin/python
# -*- coding:utf-8 -*-

from flask import Flask

"""
Initialisation package
"""
app = Flask(__name__)
app.secret_key = 'plante website'

sensors = {}

from app import api, views
