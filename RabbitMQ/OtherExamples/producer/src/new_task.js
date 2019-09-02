#!/usr/bin/env node

/**
 * Program takes an arguement from the console to represent a task and puts it in the queue.
    Start it up as ./new_task.js ...  (were the number of dots represents the number of seconds
    the task should take)
 */
var amqp = require('amqplib/callback_api');
//connect to rabbitMQ
amqp.connect('amqp://rabbitoe', function(error0, connection){

  if (error0){
    throw error0;
  }

  //create a channel
  connection.createChannel(function(error1, channel){

    var queue = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    if (error1) {
      throw error1;
    }

    //Create queue
    channel.assertQueue(queue, {
      //indicate that the queue should be written to disk (in case rabbitMQ crashes)
      durable: true
    });

    //send message to queue
    channel.sendToQueue(queue, Buffer.from(msg), {
      //indicate that the message should be written to disk (in case rabbitMQ crashes)
      persitent: true
    });
    console.log(" [x] Sent %s", msg)
  });
  // Close the connection
  setTimeout(function() {
      connection.close();
      process.exit(0);
  }, 500);
})
