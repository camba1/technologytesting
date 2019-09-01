#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
//connect to rabbitMQ
amqp.connect('amqp://rabbithw', function(error0, connection){

  if (error0){
    throw error0;
  }

  //create a channel
  connection.createChannel(function(error1, channel){
    var queue = 'hello';
    var msg = 'Hello world';

    if (error1) {
      throw error1;
    }

    //Create queue
    channel.assertQueue(queue, {
      durable: false
    });

    //send message to queue
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log(" [x] Sent %s", msg)
  });
  // Close the connection
  setTimeout(function() {
      connection.close();
      process.exit(0);
  }, 500);
})
