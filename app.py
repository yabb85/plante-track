#!/usr/bin/python
# -*- coding:utf-8 -*-

from app import create_app
from app import create_db


SETTINGS = {
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db'
}
app = create_app(SETTINGS)


@app.cli.command()
def initdb():
    """Initialize the database."""
    create_db()
    print(u'Init the db')


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
