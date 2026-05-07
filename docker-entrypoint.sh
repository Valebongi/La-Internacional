#!/bin/sh
set -e

# Sustituir BACKEND_HOST en la configuración de nginx (in-place)
BACKEND_HOST=${BACKEND_HOST:-localhost:8080}
sed -i "s|\${BACKEND_HOST:-localhost:8080}|$BACKEND_HOST|g" /etc/nginx/conf.d/default.conf

# Iniciar nginx
exec nginx -g "daemon off;"