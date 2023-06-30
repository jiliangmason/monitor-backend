FROM node:14

WORKDIR /app/consume-server

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8091

CMD [ "nodemon", "index.js" ]


