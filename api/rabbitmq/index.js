import amqplib from 'amqplib'
import config from '../config'

class RabbitMQ {
    constructor() {
        this.connection = null
        this.channel = null
        this.url = config.rabbitmq
    }
}

export default RabbitMQ