#!/usr/bin/python
# -*- coding:utf-8 -*-

# use virtualenv to execute server
activate_this = 'path_of_application/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, 'path_oof_application')

from manager import app as application
