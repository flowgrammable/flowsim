# DOCKER-VERSION 1.5.0
FROM      flowgrammable/flowsim-postgres
MAINTAINER Sasha Jovicic <sasha.jo@gmail.com>

COPY V1__subscriber.sql /V1__subscriber.sql
# expose the working directory, the Back port, the Grunt server port, the SSHD port, and run SSHD
VOLUME ["/flowsim"]
EXPOSE 5432
#RUN    /docker-entrypoint.sh
##RUN    psql -U postgres -d flowsim -a -f /V1__subscriber.sql 
