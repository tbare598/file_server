import logging
import re
from json import load as jsonLoad
from json import dumps
from signal import SIGTERM, signal

from bottle import Bottle, request, response, run

# from configs.tests.tests import getTests
# from webservices.test.Test import Test


with open('config.json') as data_file:
    CONFIG = jsonLoad(data_file)

with open('configs/database/sqlite.db.config.json') as dbConfigFile:
    db_config = jsonLoad(dbConfigFile)

HOST = CONFIG['host']
PORT = CONFIG['port']
RELOADER = CONFIG['reloader']
DEBUG = CONFIG['debug']


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


LOGGERS = get_loggers()
D = LOGGERS['D']

app = Bottle()


@app.hook('before_request')
def strip_path():
    request.environ['PATH_INFO'] = request.environ['PATH_INFO'].rstrip('/')
    request.environ['SYS_ID'] = request.environ['PATH_INFO'].split('/')[1].upper()
    request.environ['PATH_INFO'] = re.sub(r'^/[^/]+', '', request.environ['PATH_INFO'])


@app.hook('after_request')
def enable_cors():
    origin = '*'
    methods = 'GET, POST, OPTIONS'
    headers = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = methods
    response.headers['Access-Control-Allow-Headers'] = headers


@app.get("/test/envs")
def get_db_envs():
    results = {'envs': ['ID', 'PROD']}

    response.content_type = 'application/json'
    return dumps(results)


@app.route("/test/submit", method=['OPTIONS', 'POST'])
def test_submit():
    if request.method == 'OPTIONS':
        return {}
    else:
        D("request: " + str(request.json))
        resp = {"error": ""}
        return dumps(resp)


def cleanup():
    print("Nothing to cleanup")


signal(SIGTERM, lambda *args: cleanup())

if __name__ == '__main__':
    try:
        from bottle import PasteServer
        run(app, server=PasteServer, host=HOST, port=PORT, reloader=RELOADER, debug=DEBUG)
    finally:
        cleanup()