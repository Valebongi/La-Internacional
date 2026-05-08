#!/bin/sh
set -e

NGINX_PORT=${PORT:-80}
BACKEND_HOST=${BACKEND_HOST:-localhost:8080}

CONF=/etc/nginx/conf.d/default.conf

sed -i "s|NGINX_PORT_PLACEHOLDER|${NGINX_PORT}|g" "$CONF"
sed -i "s|BACKEND_HOST_PLACEHOLDER|${BACKEND_HOST}|g" "$CONF"

exec nginx -g "daemon off;"
