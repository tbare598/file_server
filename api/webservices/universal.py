'''
This module is used to house useful methods for any python program
'''
import json


def pl(msg):
    '''
        pl - short name for writing output while debugging
    '''
    print('DEBUG-->'+str(msg))


def pdict(a_dict):
    '''
        pdict - prints out a dictionary into a nice format
    '''
    print(json.dumps(a_dict, indent=2, separators=(',', ': ')))


def obj(aObj):
    '''
        obj - obj prints out the methods and attributes on an object
    '''
    ret = []
    for nm in dir(aObj):
        if not nm.startswith('__') and not callable(getattr(aObj, nm)):
            ret.append(nm)
    print(ret)
