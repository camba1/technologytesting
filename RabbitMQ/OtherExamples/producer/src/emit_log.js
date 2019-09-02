#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
//connect to rabbitMQ
amqp.connect('amqp://rabbitoe', function(error0, connection){

  if (error0){
    throw error0;
  }

  //create a channel
  connection.createChannel(function(error1, channel){

    var exchange = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    if (error1) {
      throw error1;
    }

    //Create exchange
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    channel.publish(exchange, '', Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });
  // Close the connection
  setTimeout(function() {
      connection.close();
      process.exit(0);
  }, 500);

})
