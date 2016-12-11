#! /usr/bin/python
# -*- coding:utf-8 -*-

from flask import Blueprint
from flask import render_template


simple_page = Blueprint('simple_page', __name__)

@simple_page.route('/')
def index():
    """
    Display the main page
    """
    return render_template('layout.html')
