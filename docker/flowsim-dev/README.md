## Usage on Linux Host ##


### Start Database ###

    sudo docker run --name flowsim-postgres flowgrammable/flowsim-postgres -d

### Start Flowsim Development and Connect to database ###


    sudo docker run --name flowsim-dev -v ~/flowsim:/flowsim -p 8080:8080 -p 9000:9000 -p 35729:35729 -p 2022:22 -t --link flowsim-postgres:postgres -d flowgrammable/flowsim-dev

user: flowsim/flowsim
shared volume: /flowsim

## Usage on Mac OSX and Windows Host##

`Note: If you are using Boot2Docker, your Docker daemon only has limited access to your OSX/Windows filesystem. Boot2Docker tries to auto-share your /Users (OSX) or C:\Users (Windows) directory - and so you can mount files or directories using docker run -v /Users/<path>:/<container path> ... (OSX) or docker run -v /c/Users/<path>:/<container path ... (Windows). All other paths come from the Boot2Docker virtual machine's filesystem`

## Post install steps ##

1. Login to flowsim-dev

    ssh flowsim@localhost -p2022

2. Dovnload develop branch from flowsim git and download dependencies

Download

    cd /flowsim
    git clone https://github.com/flowgrammable/flowsim.git --branch develop

Build back

    cd flowsim/backend
    npm install
    grunt

Build front.

    cd /flowsim/flowsim/flowsim-ui
    npm install
    bower install
    grunt

Modify config.json, change host attribute to 'postgres'. By linking flowsim-dev with flowsim-postgres, hosts file will contain an entry for database host 

    "database": {
        "database": "flowsim",
        "host": "postgress",
        "user": "flogdev",
        "pwd": "flogdev"
      },
Change server address to 0.0.0.0

    "server": {
        "address": "0.0.0.0",

3. Start Back server

cd /flowsim/flowsim/backend
node src/index -c /flowsim/flowsim/config.json -d /flowsim/flowsim/flowsim-ui/dist 

4. Start front server in development mode

cd /flowsim/flowsim/flowsim-ui/
grunt serve:local

5. Connect to http://localhost:9000/ 
6. You can edit files on the shared volume of your host using your favorite editor, and changes will be picked by livereload



### Development image ###
Development image content:

* Ubuntu 14.04
* java-8-oracle
* python
* node.js
* vim git sudo zip bzip2 fontconfig curl
* build-esential
* bower
* grunt-cli
* yo
* yo:generator-angular
* sshd

By default image runs sshd server so we can connect to this image from multiple sessions.


Pull the Flowsim Docker image:

    sudo docker pull sashajo/flowsim-dev

Create a "flowsim" folder in your home directory:

    mkdir ~/flowsim

Run The docker image, with the following options:

The Docker "/flowsim" folder is shared to the local "~/flowsim" folder

Forward all ports exposed by docker (8080 for Back server, 9000 for the "grunt serve" task, 35729 for the live reload with grunt-contrib-watch and 22 for SSHD). 

In the following example we forward the container 22 port to the host 2022 port, to prevent some port conflicts:

This is just an example of runing image standalone

    sudo docker run -v ~/flowsim:/flowsim -p 8080:8080 -p 9000:9000 -p 35729:35729 -p 2022:22 -t flowgrammable/flowsim-dev


