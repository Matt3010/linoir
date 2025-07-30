#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.__env = {
  TELEGRAM_API_ID: "${TELEGRAM_API_ID}",
  TELEGRAM_API_HASH: "${TELEGRAM_API_HASH}"
};
EOF

exec "$@"
