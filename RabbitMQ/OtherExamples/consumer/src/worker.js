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
      // Ensure queue is created before trying to consume from it
      durable: true
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    //Create a callback function that will be triggered when there are new
    //messages in the queue
    channel.consume(queue, function(msg){
      var secs = msg.content.toString().split('.').length - 1 ;

      console.log(" [x] Received %s", msg.content.toString());

      //Pretend the process is running by waiting 'secs' seconds
      setTimeout(function() {
        console.log("[x] Done.");
      }, secs * 1000)
      
    }, {
      // Automatic acknowledgement (not good if the consumer can get overwhelmed by the producer)
      noAck: true
    });

  })
})
