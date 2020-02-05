#!/usr/bin/env bash

# Use single quotes instead of double quotes to make it work with special-character passwords
PASSWORD='toor'
PROJECTFOLDER='tripsapp'

# create project folder
#sudo mkdir "/var/www/html/${PROJECTFOLDER}"

Update () {
    echo "-- Update packages --"
    sudo apt-get update
}
Update

sudo apt-get install -y vim htop curl git unzip
sudo apt-get install dirmngr -y --install-recommends

echo "-- Install mongo key"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

echo "Install mongodb "
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
Update
sudo apt-get install -y mongodb-org

echo "-- Install Yarn --"
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn


# sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
# echo "deb http://repo.mongodb.org/apt/debian "$(lsb_release -sc)"/mongodb-org/4.0 main" | sudo tee /etc/apt/sources.list.d/mongodb.list

# echo 'deb http://packages.dotdeb.org stretch all' >> /etc/apt/sources.list
# echo 'deb-src http://packages.dotdeb.org stretch all' >> /etc/apt/sources.list
Update


echo "Install nodejs "
sudo apt-get install curl software-properties-common
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get install -y nodejs apache2 


sudo npm install --global webpack nodemon webpack-cli

cd /var/www/html/tripsapp/;
npm link webpack;

echo "-- Install packages --"

#sudo apt-get -y install ca-certificates apt-transport-https 
#wget -q https://packages.sury.org/php/apt.gpg -O- | sudo apt-key add -
#echo "deb https://packages.sury.org/php/ stretch main" | sudo tee /etc/apt/sources.list.d/php.list


#Update
#apt-get install -y php7.3 php-pear php7.3-curl php7.3-dev php7.3-gd php7.3-mbstring php7.3-zip php7.3-pgsql php7.3-xml php7.3-json php7.3-mongodb

sudo systemctl enable mongod && sudo systemctl start mongod

#echo "Install mongodb php lib"
#sudo pecl channel-update pecl.php.net
# sudo pecl install mongodb
#sudo pecl install xdebug

#sudo echo "extension=mongodb.so" > /etc/php/7.3/cli/conf.d/20-mongodb.ini
#sudo echo "extension=mongodb.so" > /etc/php/7.3/apache2/conf.d/20-mongodb.ini
#sudo echo "max_execution_time = 0" >> /etc/php/7.3/apache2/php.ini 
#sudo echo "log_errors = on" >> /etc/php/7.3/apache2/php.ini
#sudo echo "error_reporting = E_ALL" >> /etc/php/7.3/apache2/php.ini

#echo "-- Configure PHP &Apache --"
#sed -i "s/error_reporting = .*/error_reporting = E_ALL/" /etc/php/7.3/apache2/php.ini
#sed -i "s/display_errors = .*/display_errors = On/" /etc/php/7.3/apache2/php.ini


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

#echo "-- Install Composer --"
# curl -s https://getcomposer.org/installer | php
# sudo mv composer.phar /usr/local/bin/composer
# sudo chmod +x /usr/local/bin/composer


echo "-- Configuring git --"

git config --global user.email "max@radiallogic.co.uk"
git config --global user.name "Max B"






