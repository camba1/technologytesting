FROM node
WORKDIR /code

RUN npm install amqplib

COPY package.json /code
RUN npm install && npm ls

COPY . /code

EXPOSE 3000
CMD ["npm","start"]
