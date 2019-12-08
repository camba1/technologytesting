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

#### Running the example
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

### Publish & Subscribe

This type of queue allows publishing a message to multiple subscribers (unlike work queues that are one message to one consumer).

When sending message to a queue, we directly provide the queue name, while `channel.publish('logs', '', Buffer.from('Hello World!'));` sends message to a specific exchange called '_logs_' but not to a specific queue (second paramter being empty)

In order to use an exchange we must define it with  `channel.assertExchange('logs', 'fanout', {durable: false})` and there are 4 types of exchanges: direct, topic, headers and fanout. Fanout is the whole channel option, meaning the message will get pushed to all the queues in the channel.

Note that RabbitMQ still needs a queue to work from when a new worker comes online. As such we can let it create a random , exclusive queue to be used with that specific queue (since it is not important that the consumer and producer are using the same queue in this case).

```
channel.assertQueue('', {
  exclusive: true
});
```

We must also bind the que we just created to the exchange (the 'logs' exchange in this case), so we use the commad `channel.bindQueue(queue_name, 'logs', '');` as part of the assertQueue directive.

##### Running the example

To run the example:
- Start publishing messages :` ./emit_log.js` (from the src directory)
- Subscribe to an exchange: `./receive_logs.js` (from the src directory)
- Subscribe to an exchange again `./receive_logs.js` (from the src directory in another console)


#### Direct exchange routing

If we want messages to go to an subset of subscriber, we can use the 'direct' exchange type( instead of fanout ). they we can assign a 'binding key' to each message and a matching 'routing key' to the queue. Only queues in the exchange where the routing key matches the message binding keys will receive the message.

To run the example:
- Start publishing messages :` ./emit_log_direct.js` (from the src directory)
- Subscribe to an exchange: `./receive_logs_direct.js <info,warning,error> "<message>"` (from the src directory)
- Subscribe to an exchange again `./receive_logs_direct.js <info,warning,error> "<message>"` (from the src directory in another console)

#### Topic exchange patern

This is simialr to direct exchanges, however the binding and routing keys are composed of a bunch of words separated by commas (,) and can be up to 255 bites long. However, the the queue routing key can contain 'jokers':

- \# can match zero or more words
- \* can match exactly one word

As such, for example, 'one.two.three' could be matched by 'one.two.three', 'one.two.*', 'one.#', '#'.

### Remote procedure call (RPC)

RPC queues similar to the work queues in that they connect a task to a worker. However, the worker and task can be in different machines.

In this scenario, the client will send a message to an outbound queue along with the name of a **reply_to** queue name and a **correlation_id**. The reply_to queue will be where the worker will put a message indicating that the task is complete. The correlation_id will allow us to use the outbound and inbound queue with multiple rpc calls within the same client. In particular the correlation_id will be unique to each rpc call. The whole process looks like this:

- Client starts up: create anonymous exclusive callback rpc_queue
- For each RPC request,  Client sends a message with:
  - **reply_to** (callback queue)
  - **correlation_id** (unique value request)
- The request is sent to rpc_queue.
- Worker does the job when request appears in rpc_queue and sends results back using the queue from the **reply_to** field.
- The client: When a message appears callback queue, client checks the correlation_id. If it matches the value from the request it returns the response to the application.
