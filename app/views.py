#! /usr/bin/python
# -*- coding:utf-8 -*-

from app import app
from flask import render_template


@app.route('/')
def index():
    """Display the main page"""
    return render_template('layout.html')
