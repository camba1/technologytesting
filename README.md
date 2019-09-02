# Technology Testing

Repository containing multiple technologies that I am playing with for use in later projects

## RabbitMQ

Open source message broker software (sometimes called message-oriented middleware) that implements the Advanced Message Queuing Protocol.
This could be used for sending messages accross microservices

### Hello World using a named queue
The first example uses a named queue to send and receive messages sent by a producer container and received by a consumer container. Both containers run nodejs and use the amqp.node client to connect to RebbitMQ.
The code for this example is found under the helloworld folder

#### Run node containers using DockerFile
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

#### Run all three containers as one with docker-compose
To start all the containers at once and automatically add them to the same network just got to the helloworld folder and type `docker-compose up`. Note that you can run them indetached mode using the -d parameter. After all 3 containers come up, you can stop them by doing `docker-compose down` in the same directory.

#### Sending messages

- Bring the containers up: `docker-compose up`
- Log into the producer service: `docker exec -it rabbithwproducer "bash"`
- Log into the consumer service: `docker exec -it rabbithwconsumer "bash"`
- Log into the RabbitMQ manager: Go to `http://localhost:15672` and use the guest/guest credentials.
- Send a message from the producer by executing `./send.js` from the src folder in the producer folder
- See the queue get created in the management console with one message
- Receive the message in the consumer by executing `./receive.js` from the src folder in the consumer container
- See the message count reset to 0 in the management console.
- Play sending more messages if you want
- Stop the receiving service (`ctrl-c`)
- Exit the producer and consumer containers
- Bring the containers down `docker-compose down`

### Work Queues (aka: Task Queues)

Work queues are used to schedule tasks to be completed later. This is specially useful when the task is long running. The task is encapsulated in the message. Work queues can parallelize work and have multiple consumers work on a task to be able to scale easily. Messages will get distributed in a round robbin fashion. If one wants to ensure that no more than X messages are sent to a queue at a time, use the `channel.prefetch(<X>);` command where X is the number of messages.

To run the example:
 - In the producer: run from the src folder `./new_task.js <dots>` (where \<dots> means a set of dots like '...' having each dots symbolize the number of seconds the task will take to run)
 - In the consumer: run from the src folder `./worker.js`. to start more than one worker, run the command in the same container or create multiple containers and run it in each of them. Note that running in multiple container needs more initial setup, but it is more recilient.

#### Acknowledgement of messages

- Automatic acknowledgement (not good if the consumer can get overwhelmed by the producer). Acknowledgement is sent as soon as the task is received
```
noAck: true
```
- Manual acknowledgement when task finishes. This ensures that if the worker dies, the meesage can be redelivered to another worker. Note that an acknowledgement must be provided somewhere or RabbitMQ will continously  resend these messages until they get acknolwedged
```
noAck: false
```
To send the manual acknowledgement, do `channel.ack(msg);` once the task is complete.

#### Meesage durability

On queue creation one can indicate that the queue must be written to disk. This is in case RabbitMQ crashes
```
channel.assertQueue(queue, {
  durable: true
});
```
The same must be done with the messages:
```
channel.sendToQueue(queue, Buffer.from(msg), {
  persitent: true
  });
```
Note that making the queue durable must be set both on the consumer and the producer.
