# DOCKER-VERSION 1.5.0
FROM      postgres
MAINTAINER Sasha Jovicic <sasha.jo@gmail.com>

COPY V1__subscriber.sql /
COPY run.sh /docker-entry-point-initdb.d/
# expose the working directory, the Back port, the Grunt server port, the SSHD port, and run SSHD
EXPOSE 5432
