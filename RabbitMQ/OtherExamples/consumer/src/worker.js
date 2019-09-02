#!/usr/bin/env node

var ampq = require('amqplib/callback_api');

ampq.connect('amqp://rabbitoe',function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    var queue = 'task_queue';

    if (error1) {
      throw error1;
    }

    // Create the queue in case the producer has not started yet
    channel.assertQueue(queue, {
      //indicate that the queue should be written to disk (in case rabbitMQ crashes)
      durable: true
    });

    //Overrides the RabbitMQ roundrobbin distribution method to multiple workers to ensure
    //that a worker cannot receive more than one task at a time.
    channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    //Create a callback function that will process the tasks
    channel.consume(queue, function(msg){
      var secs = msg.content.toString().split('.').length - 1 ;

      console.log(" [x] Received %s", msg.content.toString());

      //Pretend the process is running by waiting 'secs' seconds
      setTimeout(function() {
        console.log("[x] Done.");
        channel.ack(msg);  //send manual acknowledgement
      }, secs * 1000)

    }, {
      // Automatic acknowledgement (not good if the consumer can get overwhelmed by the producer).
      // Acknowledgement is sent as soon as the task is received
      //noAck: true

      // Manual acknowledgement when task finishes. This ensures that if the worker dies, the meesage
      //can be redelivered to another worker. Note that an acknowledgement must be provided somewhere
      // or RabbitMQ will continously  resend these messages until they get acknolwedged
      noAck: false
    });

  })
})
