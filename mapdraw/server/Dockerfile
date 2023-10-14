# Base Image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install -g webpack nodemon webpack-cli mongo
RUN npm install

RUN apk update
RUN apk add vim htop curl git unzip

# RUN npm link webpack

#RUN apk add dirmngr -y --install-recommends
RUN git config --global user.email "max@radiallogic.co.uk"
RUN git config --global user.name "Max B"

# Bundle app source
COPY . .

# Expose the port
EXPOSE 8080

# Run the app
WORKDIR /usr/src/app/client
RUN yarn install

#RUN npm link webpack


# Run the app
WORKDIR /usr/src/app/server
RUN npm run build
CMD ["npm", "run" ,"dockerstart"]
