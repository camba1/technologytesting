#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
//connect to rabbitMQ
amqp.connect('amqp://rabbitoe', function(error0, connection){

  if (error0){
    throw error0;
  }

  //create a channel
  connection.createChannel(function(error1, channel){

    if (error1) {
      throw error1;
    }

    var exchange = 'topic_logs';
    var args = process.argv.slice(2);
    var key = (args.length > 0) ? args[0] : 'anonymous.info';
    var msg = args.slice(1).join(' ') || 'Hello World!';

    //Create exchange
    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    // severity is here used as the binding key to be used for routing
    channel.publish(exchange, key, Buffer.from(msg));
      console.log(" [x] Sent %s: '%s'", key, msg);
    });

  // Close the connection
  setTimeout(function() {
      connection.close();
      process.exit(0);
  }, 500);

})
