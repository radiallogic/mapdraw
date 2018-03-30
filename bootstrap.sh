#!/usr/bin/env bash

# Use single quotes instead of double quotes to make it work with special-character passwords
PASSWORD='toor'
PROJECTFOLDER='tripsapp'

# create project folder
#sudo mkdir "/var/www/html/${PROJECTFOLDER}"

Update () {
    echo "-- Update packages --"
    sudo apt-get update
    sudo apt-get upgrade
}
Update

sudo apt-get install -y vim htop curl git unzip #--force-yes python-software-properties

echo "-- Install mongo key"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

echo 'deb http://packages.dotdeb.org jessie all' >> /etc/apt/sources.list
echo 'deb-src http://packages.dotdeb.org jessie all' >> /etc/apt/sources.list
Update

echo "Install mongodb "
sudo apt-get install -y mongodb-org

echo "-- Install NodeJS --"
sudo curl -sL https://deb.nodesource.com/setup_6.x | bash -

echo "-- Install packages --"

sudo apt-get install -y apache2 git-core npm nodejs # --force-yes  rabbitmq-server redis-server
sudo apt-get install -y  \
		php7.0-common \
		php7.0 \
		php7.0-mongodb \
		php7.0-json \
		php7.0-cli \
		libapache2-mod-php7.0 \
		php7.0 \
		#php7.0-mysql \
		php7.0-fpm php7.0-curl php7.0-gd php7.0-mcrypt php7.0-mbstring php7.0-bcmath php7.0-zip
Update

echo "-- Configure PHP &Apache --"
sed -i "s/error_reporting = .*/error_reporting = E_ALL/" /etc/php/7.0/apache2/php.ini
sed -i "s/display_errors = .*/display_errors = On/" /etc/php/7.0/apache2/php.ini
sudo a2enmod rewrite

echo "-- Creating virtual hosts --"
# setup hosts file
VHOST=$(cat <<EOF
<VirtualHost *:80>
    DocumentRoot "/var/www/html/${PROJECTFOLDER}/public/"
    <Directory "/var/www/html/${PROJECTFOLDER}">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOF
)
echo "${VHOST}" > /etc/apache2/sites-available/000-default.conf

# enable mod_rewrite
sudo a2enmod rewrite

# restart apache
service apache2 restart

echo "-- Install Composer --"
curl -s https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

echo "-- Installing ruby --"
sudo apt-get install -y \
		gem \
		ruby \
		ruby-dev \

echo "-- Installing sass, bourbon and neat --"
sudo gem install sass --no-user-install && gem install bourbon && gem install neat

echo "-- Configuring git --"

git config --global user.email "max@radiallogic.co.uk"
git config --global user.name "Max B"






