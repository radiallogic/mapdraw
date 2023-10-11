FROM ubuntu:rolling

# Set working directory
WORKDIR /var/www

# mount 
VOLUME ["/var/www"]

#run command
ADD bootstrap.sh /var/www/bootstrap.sh
RUN ["sh /var/www/bootstrap.sh"]

#ports to expose
EXPOSE 80
EXPOSE 3000 


# #run command
# ## Server
# cd server
# nodemon ./build/app.js #run 
# yarn build #build

# #Client
# yarn upgrade 
# webpack -w

CMD ["cd ./server && nodemon ./build/app.js && cd ../client && webpack -w"]
