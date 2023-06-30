FROM node:14

WORKDIR /app/api

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8090

CMD [ "nodemon", "index.js" ]


