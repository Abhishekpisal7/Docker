ARG TAG=16-alpine

FROM node:${TAG}

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app 

ENV PORT 3000

EXPOSE ${PORT}

CMD ["npm", "start"]