import Router from 'koa-router'
import moment from 'moment'
import { get } from 'lodash'
import uuid from 'node-uuid'
import { rabbitmq } from '../rabbitmq'
import config from '../config'

const router = new Router()

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 等待rabbitmq返回es的写入结果
 * @param {*} rabbitmq 
 * @returns 
 */
export const waitForRely = async (rabbitmq) => {
    return new Promise(resolve => {
        rabbitmq.channel.consume(config.rabbitmq.replyQueueKey, msg => {
            resolve(msg.content.toString())
        }, { noAck: true })
    })
}

router.prefix('/log')

router.post('/', async (ctx, next) => {
    const body = ctx.request.body
    try {
        const userPhone = get(body, ['data', 'customTag'])
        await rabbitmq.channel.assertQueue(config.rabbitmq.replyQueueKey, { durable: false })
        if (userPhone) {
            const data = body.data
            const { errorId, level, message, time, url } = data
            const params = {
                id: `${errorId}-${moment().format(DATE_FORMAT)}`,
                phone: userPhone,
                level,
                message,
                url,
                time: moment(time).format(DATE_FORMAT),
                create_time: moment().format(DATE_FORMAT),
            }
            console.log('log body:', data, params)
            await rabbitmq.send(config.rabbitmq.dataQueueKey, params, {
                replyTo: config.rabbitmq.replyQueueKey,
                correlationId: uuid()
            })
            const msg = await waitForRely(rabbitmq)
            ctx.body = {
                result: 1,
                message: msg || 'default'
            }
            next()
        } else {
            ctx.body = {
                result: 1,
                message: 'default'
            }
            next()
        }
    } catch(err) {
        console.error(err)
        ctx.throw(err)
    }
})


module.exports = router
