#!/bin/sh

(echo "upstream app_servers { server $NODE_PORT_8080_TCP_ADDR:$NODE_PORT_8080_TCP_PORT; }" && cat /etc/nginx/conf.d/proxy.conf) > proxy.conf.new
mv proxy.conf.new /etc/nginx/conf.d/proxy.conf

cat /etc/nginx/conf.d/proxy.conf

service nginx start
