FROM php:7-fpm

MAINTAINER Max Brooks <max@radiallogic.co.uk>

WORKDIR /var/www/html

RUN apt-get update

RUN apt-get install gem git ruby -y unzip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

RUN curl -LsS https://symfony.com/installer -o /usr/local/bin/symfony
RUN chmod a+x /usr/local/bin/symfony

RUN gem install sass
RUN gem install bourbon
RUN gem install neat

RUN git config --global user.email "max@radiallogic.co.uk"
RUN git config --global user.name "Max B"
