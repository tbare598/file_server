from json import load as jsonLoad
from urllib.request import urlopen
from functools import wraps
from bottle import request
from jose import jwt

with open('config.json') as data_file:
    CONFIG = jsonLoad(data_file)["auth0"]

AUTH0_CLIENT_ID = CONFIG["AUTH0_CLIENT_ID"]
AUTH0_DOMAIN = CONFIG["AUTH0_DOMAIN"]

jsonResp = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
jwks = jsonLoad(jsonResp)


def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        return {
            "code": "authorization_header_missing",
            "description": "Authorization header is expected",
            "status_code": 401}

    parts = auth.split()

    if parts[0].lower() != "bearer":
        return {
            "code": "invalid_header",
            "description": "Authorization header must start with Bearer",
            "status_code": 401}
    elif len(parts) != 3:
        return {"code": "invalid_header",
                "description": "Tokens not found",
                "status_code": 401}

    auth_token = parts[1]
    id_token = parts[2]
    return {"auth_token": auth_token, "id_token": id_token}


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        tokens = get_token_auth_header()
        if "status_code" in tokens:
            return tokens
        auth_token = tokens['auth_token']
        id_token = tokens['id_token']
        unverified_header = jwt.get_unverified_header(id_token)

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                jwt.decode(
                    id_token,
                    rsa_key,
                    algorithms=unverified_header["alg"],
                    issuer="https://"+AUTH0_DOMAIN+"/",
                    audience=AUTH0_CLIENT_ID,
                    access_token=auth_token
                )
            except jwt.ExpiredSignatureError:
                return {"code": "token_expired",
                        "description": "token is expired",
                        "status_code": 401}
            except jwt.JWTClaimsError as err:
                print(err)
                return {"code": "invalid_claims",
                        "description": "incorrect claims, please check the audience and issuer",
                        "status_code": 401}
            except Exception as err:
                print(err)
                return {"code": "invalid_header",
                        "description": "Unable to parse authentication token.",
                        "status_code": 400}
            return f(*args, **kwargs)
        return {"code": "invalid_header",
                "description": "Unable to find appropriate key",
                "status_code": 400}
    return decorated


def requires_permission(required_perm):
    """Determines if the required scope is present in the access token
    Args:
        required_scope (str): The scope required to access the resource
    """

    def requires_permission_decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            tokens = get_token_auth_header()
            if "status_code" in tokens:
                return tokens
            id_token = tokens['id_token']
            if "status_code" in id_token:
                return id_token
            unverified_claims = jwt.get_unverified_claims(id_token)
            token_perms = unverified_claims["permissions"]
            for perm in token_perms:
                if perm == required_perm:
                    return f(*args, **kwargs)
            return {
                "code": "permission_not_found",
                "description": "permission '" + required_perm + "' not found in permissions list",
                "status_code": 401}

        return decorated
    return requires_permission_decorator


def GET_with_auth(app, path):
    def GET_with_auth_decorator(f):
        @app.route(path, ['OPTIONS'])
        def handle_options(*args, **kwargs):
            return {}

        @app.get(path)
        @requires_auth
        @wraps(f)
        def decorated(*args, **kwargs):
            return f(*args, **kwargs)

        return decorated
    return GET_with_auth_decorator
