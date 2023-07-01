import Router from 'koa-router'
import moment from 'moment'
import { get } from 'lodash'
import RabbitMQ from '../rabbitmq'

const router = new Router()
const rabbitmq = new RabbitMQ()

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

router.prefix('/log')

router.post('/', async (ctx, next) => {
    const body = ctx.request.body
    try {
        const userPhone = get(body, ['data', 'customTag'])
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
            console.log('recv:', data, params)
            rabbitmq.connect().then(async () => {
                await rabbitmq.send('test-queue', params)
            })
        }
        ctx.body = {
            result: 1,
            message: 'success'
        }
    } catch(err) {
        console.error(err)
        ctx.throw(err)
    }
})


module.exports = router
