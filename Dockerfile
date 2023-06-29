FROM node:14

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8090

CMD [ "nodemon", "index.js" ]


