FROM php:7-fpm

MAINTAINER Max Brooks <max@radiallogic.co.uk>

WORKDIR /var/www/html

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
        libssl-dev \
		gem \
		git \
		ruby \
		ruby-dev \
		unzip \
		nodejs \ 
    && pecl install mongodb \
    && echo "extension=mongodb.so" > /usr/local/etc/php/conf.d/ext-mongodb.ini \
    && echo "upload_max_filesize = 5M" > /usr/local/etc/php/conf.d/upload.ini \
    && docker-php-ext-install iconv mcrypt mbstring exif zip \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install gd 

RUN gem install sass --no-user-install && gem install bourbon && gem install neat

RUN git config --global user.email "max@radiallogic.co.uk"
RUN git config --global user.name "Max B"
