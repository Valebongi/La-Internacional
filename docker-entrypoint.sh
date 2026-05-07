#!/bin/sh
set -e

# Puerto en el que nginx escucha: Railway inyecta PORT; default 80
NGINX_PORT=${PORT:-80}

# Host del backend: en Railway usar el hostname interno del servicio backend
# Ej: BACKEND_HOST=la-internacional-backend.railway.internal:8080
BACKEND_HOST=${BACKEND_HOST:-localhost:8080}

CONF=/etc/nginx/conf.d/default.conf

sed -i "s|NGINX_PORT_PLACEHOLDER|${NGINX_PORT}|g" "$CONF"
sed -i "s|BACKEND_HOST_PLACEHOLDER|${BACKEND_HOST}|g" "$CONF"

exec nginx -g "daemon off;"
