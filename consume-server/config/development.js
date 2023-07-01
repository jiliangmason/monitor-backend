export default {
    es: {
        node: 'http://elasticsearch:9200', // 在docker上只有这个才可以成功连接
    },
    rabbitmq: {
        url: 'amqp://rabbitmq:5672',
        dataQueueKey: 'data-queue'
    }
}