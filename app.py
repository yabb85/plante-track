#!/usr/bin/python
# -*- coding:utf-8 -*-
"""
Script principal
"""

from __future__ import print_function
from flask_script import Manager
from app import create_app
from app import create_db


SETTINGS = {
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db'
}
app = create_app(SETTINGS)

manager = Manager(app)


@manager.command
def initdb():
    """Initialize the database."""
    create_db()
    print(u'Init the db')


if __name__ == "__main__":
    manager.run()
