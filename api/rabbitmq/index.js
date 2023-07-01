import amqplib from 'amqplib'
import config from '../config'

class RabbitMQ {
    constructor() {
        this.connection = null
        this.channel = null
        this.url = config.rabbitmq.url
    }

    async connect() {
        try {
            this.connection = await amqplib.connect(config.rabbitmq.url)
            this.channel = await this.connection.createChannel()
        } catch(err) {
            throw err
        }
    }

    async send(queue, data) {
        try {
            await this.channel.assertQueue(queue, { durable: false })
            await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
            await this.channel.close()
            await this.connection.close()
        } catch(err) {
            throw err
        }
    }

    async receive(queue, callback) {
        try {
            this.channel.prefetch(1);
            await this.channel.assertQueue(queue, { durable: false })
            await this.channel.consume(queue, message => {
                console.log('开始监听: [x]:', message.content.toString())
                callback(message.content.toString())
                this.channel.ack(message)
            })
        } catch(err) {
            throw err
        }
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.close()
        }
    }
}

export const rabbitmq = new RabbitMQ()

export default RabbitMQ


