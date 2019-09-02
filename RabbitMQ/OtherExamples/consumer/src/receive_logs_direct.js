#!/usr/bin/env node

var ampq = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

ampq.connect('amqp://rabbitoe',function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    var exchange = 'direct_logs';

    if (error1) {
      throw error1;
    }

    //direct channel
    channel.assertExchange(exchange,'direct', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q){
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages. To exit press CTRL+C");

      args.forEach(function(severity){
        channel.bindQueue(q.queue, exchange, severity);
      })

    channel.consume(q.queue, function(msg){
      if (msg.content) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }
  }, {
      noAck: true
    });
  });
  });
});
