import amqp from 'amqplib'
import config from '../api/config'
const Koa = require('koa')
const app = new Koa()

const consumeQueue = async () => {
  amqp.connect(config.rabbitmq.url)
}

consumeQueue()

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
