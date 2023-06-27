import Elastic from '../es'
const router = require('koa-router')()

const elastic = new Elastic()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.post('/ping', async (ctx, next) => {
  try {
    const res = await elastic.ping()
    ctx.body = {
      result: 1,
      message: `connection elasticsearch success, result: ${res}`
    }
  } catch(err) {
    ctx.throw(err, 'connection elasticsearch failed!!!')
  }
})

module.exports = router
