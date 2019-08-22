const Router = require('koa-router')
const mongoose = require('mongoose')

const Jwt = require('./../util/Jwt')

let router = new Router()

/**
 * 注册接口
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
router.post('/signup', async (ctx) => {
  const User = mongoose.model('User')
  let user = new User(ctx.request.body)
  
  await user
    .save()
    .then(() => {
      ctx.body = {
        code: 200,
        message: '注册成功'
      }
    })
    .catch(error => {
      ctx.body = {
        code: 500,
        message: error
      }
    })
})

router.post('/signin', async (ctx) => {
  const User = mongoose.model('User')
  let data = ctx.request.body
  let username = data.username
  let password = data.password

  await User
    .findOne({ username: username })
    .exec()
    .then(async (res) => {
      console.log('1' + res)
      if (res) {
        let user = new User()
        let userid = res._id

        await user
          .comparePassword(password, res.password)
          .then(res => {
            console.log('2' + res)
            const jwt = new Jwt(username)
            let token = jwt.generateToken()
            
            ctx.body = {
              code: 200,
              message: res,
              data: {
                userid: userid,
                token: token
              }
            }
          })
          .catch(error => {
            console.log(error)
            ctx.body = {
              code: 500,
              message: error
            }
          })
      } else {
        ctx.body = {
          code: 200,
          message: '用户名不存在'
        }
      }
    })
    .catch(error => {
      console.log(error)
      ctx.body = {
        code: 500,
        message: error
      }
    })
})

router.post('/me', async ctx => {
  const User = mongoose.model('User')
  let data = ctx.request.body
  let token = ctx.request.header.token
  let userid = data.userid
  const jwt = new Jwt(token)
  let verifyToken = jwt.verifyToken()

  if (!verifyToken) {
    ctx.body = {
      code: 500,
      message: 'token过期'
    }

    return
  }
  
  await User
    .findOne({_id: userid})
    .exec()
    .then(async res => {
      console.log('me: ' + res)
      let data = {
        portraitUrl: res.portraitUrl,
        nickname: res.nickname
      }

      ctx.body = {
        code: 200,
        message: '',
        data: data
      }
    })
    .catch(error => {
      console.log(error)
      ctx.body = {
        code: 500,
        message: error
      }
    })
})

module.exports = router