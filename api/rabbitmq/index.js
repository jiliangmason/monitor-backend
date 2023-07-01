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
            this.connection = await amqplib.connect(this.url)
            this.channel = await this.connection.createChannel()
        } catch(err) {
            throw err
        }
    }

    async send(queue, data, options) {
        try {
            await this.channel.assertQueue(queue, { durable: false })
            await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), options)
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


