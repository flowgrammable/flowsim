# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<SCRIPT
sudo apt-get -y update
DEBIAN_FRONTEND=noninteractive apt-get install -y -q python-software-properties software-properties-common

# install node.js from PPA
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get -y install nodejs

# Install Bower & Grunt
npm install -g bower grunt-cli

# install yeoman
npm install -g yo

# install Angular
npm install -g generator-angular

# install oracle java from PPA
add-apt-repository ppa:webupd8team/java -y
apt-get update
echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
apt-get -y install oracle-java8-installer && apt-get clean

# Set oracle java as the default java
update-java-alternatives -s java-8-oracle
echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc

#install utilities
apt-get -y install vim git sudo zip bzip2 fontconfig curl

#install build-esential
apt-get install -y build-essential

#postgres docker install
apt-get install -y docker.io
CONTAINER_NAME=flowsim-dev
DB_USER=flowsim
DB_USER_PASSWORD=flowsim
sudo docker run --name $CONTAINER_NAME-data --entrypoint /bin/echo postgres Data-only container for Flowsim
sudo docker run --name $CONTAINER_NAME-postgres -p 5432:5432 -e POSTGRES_USER=$DB_USER --volumes-from $CONTAINER_NAME-data -d postgres
SQL_FILE=/tmp/V1__subscriber.sql
sudo docker run -it --link $CONTAINER_NAME-postgres:postgres --rm -v /vagrant/backend/sql:/tmp postgres sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U '$DB_USER' -d '$DB_USER' -a -f '$SQL_FILE

SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 9000, host: 9000 
  config.vm.network "forwarded_port", guest: 8080, host: 8080

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end
  config.vm.provision "shell", inline: $script
  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
end
