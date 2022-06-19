FROM node:18.2.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . /usr/src/app
EXPOSE 3000
CMD [ "node", "main.js" ]
