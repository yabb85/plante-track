import json
from os import path


class Sensors(dict):
    """Collection of sensors"""
    def __init__(self, *args):
        """Initialize collection of sensors"""
        dict.__init__(self, *args)
        if path.isfile('/tmp/data.txt'):
            with open('/tmp/data.txt', 'r') as f:
                self.update(json.load(f))
        self.max_length = 25

    def __setitem__(self, key, val):
        """add element in collection"""
        if key not in self:
            super(Sensors, self).__setitem__(key, [])
        if len(self.__getitem__(key)) > 25:
            self.__getitem__(key).pop(0)
        self.__getitem__(key).append(val)
        with open('/tmp/data.txt', 'w') as f:
            json.dump(self, f)


sensors = Sensors()
