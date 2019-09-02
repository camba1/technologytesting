FROM node
WORKDIR /code

COPY package.json /code

RUN npm install amqplib

RUN npm install && npm ls

COPY . /code
