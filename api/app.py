import logging
from json import load as jsonLoad
from json import dumps
# from json import dumps
from signal import SIGTERM, signal

from bottle import Bottle, request, response, run, static_file

from webservices.auth.Auth import requires_permission, GET_with_auth
from webservices.files.Files import get_static_file, get_directory_listing, get_path_type


with open('config.json') as data_file:
    CONFIG = jsonLoad(data_file)

with open('configs/database/sqlite.db.config.json') as dbConfigFile:
    db_config = jsonLoad(dbConfigFile)

HOST = CONFIG['host']
PORT = CONFIG['port']
RELOADER = CONFIG['reloader']
DEBUG = CONFIG['debug']
FILE_DIR = CONFIG['file_dir']


def get_loggers():
    logger = logging.getLogger("file_server")
    logger.setLevel(logging.DEBUG)
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('[%(asctime)s] %(levelname)s: %(message)s', '%Y-%m-%d %H:%M:%S')
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    loggers = dict()
    loggers['D'] = logger.debug
    loggers['I'] = logger.info
    loggers['W'] = logger.warning
    loggers['E'] = logger.error
    loggers['C'] = logger.critical
    return loggers


def get_file(path):
    return static_file(path, root=FILE_DIR)


LOGGERS = get_loggers()
D = LOGGERS['D']

app = Bottle()


@app.hook('before_request')
def strip_path():
    D("REQUEST->" + request.environ['PATH_INFO'])
    request.environ['PATH_INFO'] = request.environ['PATH_INFO'].rstrip('/')


@app.hook('after_request')
def enable_cors():
    origin = '*'
    methods = 'GET, POST, OPTIONS'
    headers = 'Origin, Authorization, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = methods
    response.headers['Access-Control-Allow-Headers'] = headers


@GET_with_auth(app, "/static/type")
@requires_permission('read:files')
def GET_path_type_root():
    print("getting type, at the end of the static content endpoint")

    resp = {
        "data": 'DIR'
    }
    return dumps(resp)


@GET_with_auth(app, "/static/type/<path:path>")
@requires_permission('read:files')
def GET_path_type(path):
    print("getting type, at the end of the static content endpoint")

    resp = {
        "data": get_path_type(FILE_DIR, path)
    }
    return dumps(resp)


@GET_with_auth(app, "/static/directory")
@requires_permission('read:files')
def GET_static_directory_root():
    print("getting root directory")

    resp = {
        "data": get_directory_listing(FILE_DIR, '.')
    }
    return dumps(resp)


@GET_with_auth(app, "/static/directory/<path:path>")
@requires_permission('read:files')
def GET_static_directory(path):
    print("getting directory->"+path)

    resp = {
        "data": get_directory_listing(FILE_DIR, path)
    }
    return dumps(resp)


@GET_with_auth(app, "/static/file/<path:path>")
@requires_permission('read:files')
def GET_static_file(path):
    print("getting file->"+path)
    origin = '*'
    methods = 'get, post, options'
    headers = 'Origin, Authorization, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

    file_resp = get_static_file(FILE_DIR, path)
    if(file_resp):
        file_resp.headers['Access-Control-Allow-Origin'] = origin
        file_resp.headers['Access-Control-Allow-Methods'] = methods
        file_resp.headers['Access-Control-Allow-Headers'] = headers
        return file_resp
    return ''


def cleanup():
    print("Nothing to cleanup")


signal(SIGTERM, lambda *args: cleanup())

if __name__ == '__main__':
    try:
        run(app, server='cherrypy', host=HOST, port=PORT, reloader=RELOADER, debug=DEBUG)
    finally:
        cleanup()
