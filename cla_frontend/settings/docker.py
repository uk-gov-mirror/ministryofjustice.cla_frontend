from .base import *
import os

try:
    SECRET_KEY = os.environ["SECRET_KEY"]
except KeyError as e:
    print(
        "Secret key not found, using a default key for the docker build step only, "
        "please set the SECRET_KEY in your environment"
    )
    SECRET_KEY = "CHANGE_ME"
    pass

DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost").split(",")

TEMPLATE_DEBUG = DEBUG

ADMINS = (("CLA", "cla-alerts@digital.justice.gov.uk"),)

MANAGERS = ADMINS

HOST_NAME = os.environ.get("HOST_NAME", "localhost")

BACKEND_BASE_URI = os.environ["BACKEND_BASE_URI"]

ZONE_PROFILES = {
    "call_centre": {
        "CLIENT_ID": os.environ.get("CALL_CENTRE_CLIENT_ID"),
        "CLIENT_SECRET": os.environ.get("CALL_CENTRE_SECRET_ID"),
        "LOGIN_REDIRECT_URL": "call_centre:dashboard",
        "BASE_URI": "%s/call_centre/api/v1/" % BACKEND_BASE_URI,
        "AUTHENTICATION_BACKEND": "call_centre.backend.CallCentreBackend",
    },
    "cla_provider": {
        "CLIENT_ID": os.environ.get("CLA_PROVIDER_CLIENT_ID"),
        "CLIENT_SECRET": os.environ.get("CALL_PROVIDER_SECRET_ID"),
        "LOGIN_REDIRECT_URL": "cla_provider:dashboard",
        "BASE_URI": "%s/cla_provider/api/v1/" % BACKEND_BASE_URI,
        "AUTHENTICATION_BACKEND": "cla_provider.backend.ClaProviderBackend",
    },
}

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.CachedStaticFilesStorage"

# LOGGING CONFIG FOR DOCKER ENV
LOGGING["filters"] = {
    "require_debug_false": {"()": "django.utils.log.RequireDebugFalse"},
    "require_debug_true": {"()": "django.utils.log.RequireDebugTrue"},
}

LOGGING["handlers"]["mail_admins"] = {
    "level": "ERROR",
    "class": "django.utils.log.AdminEmailHandler",
    "filters": ["require_debug_false"],
}

LOGGING["handlers"]["production_file"] = {
    "level": "INFO",
    "class": "logging.handlers.RotatingFileHandler",
    "filename": "/var/log/wsgi/app.log",
    "maxBytes": 1024 * 1024 * 5,  # 5 MB
    "backupCount": 7,
    "formatter": "logstash",
    "filters": ["require_debug_false"],
}

LOGGING["handlers"]["debug_file"] = {
    "level": "DEBUG",
    "class": "logging.handlers.RotatingFileHandler",
    "filename": "/var/log/wsgi/debug.log",
    "maxBytes": 1024 * 1024 * 5,  # 5 MB
    "backupCount": 7,
    "formatter": "verbose",
    "filters": ["require_debug_true"],
}

LOGGING["loggers"][""] = {"handlers": ["production_file", "debug_file"], "level": "DEBUG"}
LOGGING["loggers"]["django.request"] = {"handlers": ["mail_admins"], "level": "ERROR", "propagate": True}
