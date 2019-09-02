#!/usr/bin/env node

var ampq = require('amqplib/callback_api');

ampq.connect('amqp://rabbitoe',function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    var exchange = 'logs';

    if (error1) {
      throw error1;
    }

    channel.assertExchange(exchange,'fanout', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q){
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

    channel.consume(q.queue, function(msg){
      if (msg.content) {
        console.log(" [x] %s", msg.content.toString());
      }
  }, {
      noAck: true
    });
  });
  });
});
