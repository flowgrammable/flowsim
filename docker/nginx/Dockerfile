FROM ubuntu
RUN apt-get update -y
RUN apt-get install -y vim wget dialog net-tools nginx
RUN rm -v /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/
ADD run.sh /
RUN chmod +x run.sh
EXPOSE 80
CMD ["touch", "/etc/nginx/conf.d/proxy.conf"]
