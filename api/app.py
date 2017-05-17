import logging
from json import load as jsonLoad
from json import dumps
from signal import SIGTERM, signal

from bottle import Bottle, request, response, run, static_file

from webservices.auth.Auth import requires_auth, requires_scope


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
    D("FILE_PATH->" + request.environ['PATH_INFO'])
    request.environ['PATH_INFO'] = request.environ['PATH_INFO'].rstrip('/')


@app.hook('after_request')
def enable_cors():
    origin = '*'
    methods = 'GET, POST, OPTIONS'
    headers = 'Origin, Authorization, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = methods
    response.headers['Access-Control-Allow-Headers'] = headers


@app.route("/test/submit", method=['OPTIONS', 'POST'])
def test_submit():
    if request.method == 'OPTIONS':
        return {}
    else:
        D("request: " + str(request.json))
        resp = {"error": ""}
        return dumps(resp)


@app.route("/test/1", method=['OPTIONS', 'GET'])
@requires_auth
def test1():
    if request.method == 'OPTIONS':
        return {}
    else:
        print("TESTING1")
        return "TESTING1"


@app.get("/test/2")
@requires_auth
def test2():
    print("TESTING2")
    return requires_scope("TESTING2")


@app.get("/static/<path:path>")
def get_static_file(path):
    print("GETTING FILE->"+path)
    return static_file(path, root=FILE_DIR)


def cleanup():
    print("Nothing to cleanup")


signal(SIGTERM, lambda *args: cleanup())

if __name__ == '__main__':
    try:
        run(app, server='cherrypy', host=HOST, port=PORT, reloader=RELOADER, debug=DEBUG)
    finally:
        cleanup()
