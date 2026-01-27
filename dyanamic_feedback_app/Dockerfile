FROM node:trixie-slim

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app 

ARG DEFAULT_PORT=3000

ENV PORT $DEFAULT_PORT

EXPOSE $PORT

CMD ["npm", "start"]