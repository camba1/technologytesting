# Technology Testing

Repository containing multiple technologies that I am playing with for use in later projects

## RabbitMQ

Open source message broker software (sometimes called message-oriented middleware) that implements the Advanced Message Queuing Protocol.
This could be used for sending messages accross microservices

### Run node containers using DockerFile
Use the following commands to build and run the node producer and consumer containers Assuming you are in the producer/consumer appropriate root directory:

```
docker build -t hwproducer .
docker run -i --name myhwproducer hwproducer
```
Note the -i flag in the container startup to stop the container from exiting immediately as there is no process running in the container.

To access the container bash while it is running:

docker exec -it myhwproducer "bash"

To stop the container, you can do (in another terminal):

```
docker stop myhwproducer
```

Then to remove the container and image:
```
docker rm myhwproducer
docker rmi hwproducer
```

### Run all three containers as one with docker-compose
To start all the containers at once and automatically add them to the same network just got to the helloworld folder and type `docker-compose up`. Note that you can run them indetached mode using the -d parameter. After all 3 containers come up, you can stop them by doing `docker-compose down` in the same directory.
