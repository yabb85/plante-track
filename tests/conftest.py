#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
define test
"""
import pytest
from os import path as os_path
from os import unlink as os_unlink
from ueki import create_app
from ueki import create_db

TESTDB_PATH = '/tmp/test_ueki.db'
TEST_DATABASE_URI = 'sqlite:///' + TESTDB_PATH


@pytest.fixture
def app(request):
    """
    Define app used by tests
    """
    settings_override = {
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': TEST_DATABASE_URI,
        'UPLOADS_DEFAULT_DEST': '/tmp/test_upload'
    }
    flask_app = create_app(settings_override)
    with flask_app.app_context():
        if os_path.exists(TESTDB_PATH):
            os_unlink(TESTDB_PATH)
        create_db()
    return flask_app
