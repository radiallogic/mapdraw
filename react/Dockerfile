FROM debian:jessie

MAINTAINER Max Brooks <max@radiallogic.co.uk>

WORKDIR /var/www/js

RUN apt-get update && apt-get install -y gem git ruby unzip npm node

RUN npm install --save redux react react-redux webpack react-dom
RUN npm install --save-dev redux-devtools
RUN npm install babel-loader babel-preset-es2015 babel-preset-react -S

RUN gem install sass
RUN gem install bourbon
RUN gem install neat

