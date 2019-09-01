#!/usr/bin/env node

var ampq = require('amqplib/callback_api');

ampq.connect('amqp://rabbithw',function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    var queue = 'hello';
    var msg = 'Hello world';

    if (error1) {
      throw error1;
    }

    // Create the queue in case the producer has not started yet
    channel.assertQueue(queue, {
      durable: false
    }):

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    //Create a callback function that will be triggered when there are new
    //messages in the queue
    channel.consume(queue, function(msg){
      console.log(" [x] Received %s", msg.content.toString());
    } , {
      noAck: true
    });

  })
})
