const Koa = require('koa')
const app = new Koa()
import amqplib from 'amqplib'
import RecordModel from './model/record'
import config from './config'

let connection
let channel
const record = new RecordModel()

const replyHandler = async (message) => {
  const data = JSON.parse(message.content.toString())
  console.log('开始监听queue的消息: [x]:', data)
  if (data) {
    await record.save(data)
    channel.sendToQueue(message.properties.replyTo, Buffer.from('log success'.toString()),  {
      correlationId: message.properties.correlationId
    })
    channel.ack(message)
  } else {
    channel.sendToQueue(message.properties.replyTo, Buffer.from('log failed'.toString()),  {
      correlationId: message.properties.correlationId
    })
    channel.ack(message)
  }
}

const consumeQueue = async () => {
  try {
    connection = await amqplib.connect(config.rabbitmq.url)
    channel = await connection.createChannel()
  
    await channel.assertQueue(config.rabbitmq.dataQueueKey, { durable: false })
    channel.consume(config.rabbitmq.dataQueueKey, replyHandler, { noAck: false })
  } catch(err) {
    console.error('rabbitmq_consumer异常', err)
  }
}

consumeQueue()

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
