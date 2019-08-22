const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

// 数据库
const { connect, schemas } = require('./database')

// API
const user = require('./api/User')

const app = new Koa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods())
app.use(bodyParser())

router.use('/user', user.routes())

// app.use(async(ctx, next) => {
//   const start = new Date().getTime(); // 当前时间
//   await next(); // 调用下一个middleware
//   const ms = new Date().getTime() - start; // 耗费时间
//   console.log(`Time: ${ms}ms`); // 打印耗费时间
//   ctx.body = {'name': 'xx'}

//   console.log(ctx.url);
// });
;(async () => {
  await connect()
  schemas()
})()

app.use(async (ctx) => {
  ctx.response.type = 'html'
  ctx.response.body = fs.createReadStream('./test.html')
})

const server = app.listen(3000, () => {
  console.log('[Server] starting at port ' + server.address().port)
});