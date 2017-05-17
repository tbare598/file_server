from json import load as jsonLoad
from urllib.request import urlopen
from functools import wraps
from bottle import request
from jose import jwt

with open('config.json') as data_file:
    CONFIG = jsonLoad(data_file)["auth0"]

API_AUDIENCE = CONFIG["API_AUDIENCE"]
AUTH0_DOMAIN = CONFIG["AUTH0_DOMAIN"]


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
    elif len(parts) == 1:
        return {"code": "invalid_header",
                "description": "Token not found",
                "status_code": 401}
    elif len(parts) > 2:
        return {"code": "invalid_header",
                "description": "Authorization header must be Bearer token",
                "status_code": 401}

    token = parts[1]
    return token


def requires_scope(required_scope):
    """Determines if the required scope is present in the access token
    Args:
        required_scope (str): The scope required to access the resource
    """
    token = get_token_auth_header()
    if "status_code" in token:
        return token
    unverified_claims = jwt.get_unverified_claims(token)
    token_scopes = unverified_claims["scope"].split()
    for token_scope in token_scopes:
        if token_scope == required_scope:
            return True
    return False


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        if "status_code" in token:
            return token
        jsonResp = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
        jwks = jsonLoad(jsonResp)
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            print("key")
            print(key)
            print("unverified_header")
            print(unverified_header)
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
                    token,
                    rsa_key,
                    algorithms=unverified_header["alg"],
                    audience=API_AUDIENCE,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError:
                return {"code": "token_expired",
                        "description": "token is expired",
                        "status_code": 401}
            except jwt.JWTClaimsError:
                return {"code": "invalid_claims",
                        "description": "incorrect claims, please check the audience and issuer",
                        "status_code": 401}
            except Exception:
                return {"code": "invalid_header",
                        "description": "Unable to parse authentication token.",
                        "status_code": 400}
            # Set current user, to this session
            # _app_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        return {"code": "invalid_header",
                "description": "Unable to find appropriate key",
                "status_code": 400}
    return decorated
