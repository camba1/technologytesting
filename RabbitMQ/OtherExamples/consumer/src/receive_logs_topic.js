#!/usr/bin/env node

var ampq = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

ampq.connect('amqp://rabbitoe',function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    var exchange = 'topic_logs';

    if (error1) {
      throw error1;
    }

    //direct channel
    channel.assertExchange(exchange,'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q){
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages. To exit press CTRL+C");

      args.forEach(function(key){
        channel.bindQueue(q.queue, exchange, key);
      })

    channel.consume(q.queue, function(msg){
       console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
  }, {
      noAck: true
    });
  });
  });
});
