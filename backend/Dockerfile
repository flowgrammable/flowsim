# DOCKER-VERSION 1.5.0
FROM      ubuntu:14.04
MAINTAINER Colton Chojnacki <colton@flowgrammable.org>

# make sure the package repository is up to date
RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ trusty-updates main restricted" >> /etc/apt/sources.list
RUN echo "deb-src http://us.archive.ubuntu.com/ubuntu/ trusty-updates main restricted" >> /etc/apt/sources.list
RUN apt-get -y update

# install python-software-properties (so you can do add-apt-repository)
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q python-software-properties software-properties-common

# install utilities
RUN apt-get -y install vim git sudo zip bzip2 fontconfig curl build-essential libpq-dev
RUN curl -sL https://deb.nodesource.com/setup | sudo bash - && sudo apt-get install -y nodejs

# configure the "flowsim" and "root" users
RUN echo 'root:flowsim' |chpasswd
RUN groupadd flowsim && useradd flowsim -s /bin/bash -m -g flowsim -G flowsim && adduser flowsim sudo
RUN echo 'flowsim:flowsim' |chpasswd

RUN sudo npm install -g npm
RUN cd /home && chown -R flowsim:flowsim /home/flowsim 
ADD . /home/flowsim
RUN cd /home/flowsim && npm install
# expose the working directory, the Back port, the Grunt server port, the SSHD port, and run SSHD
VOLUME ["/home/flowsim/"]
EXPOSE 8080
EXPOSE 8081
EXPOSE 9000
CMD ["cd", "/home/flowsim/","&&", "npm", "start"]
