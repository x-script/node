const { resolve } = require('path')
const mongoose = require('mongoose')
const glob = require('glob')

const db = 'mongodb://localhost/test-db'

const schemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

const connect = () => {
  let maxConnectCount = 0

  mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
    
  return new Promise((resolve, reject) => {
    mongoose.connection.on('disconnected', () => {
      console.log('********* 数据库断开 *********')

      if (maxConnectCount < 3 ) {
        maxConnectCount++
        mongoose.connect(db, {
          useCreateIndex: true,
          useNewUrlParser: true
        })    
      } else {
        reject()
        throw new Error('数据库重连失败！')
      }
    })

    mongoose.connection.on('error', error => {
      console.log('********* 数据库错误 *********')

      if (maxConnectCount < 3) {
        maxConnectCount++
        mongoose.connect(db, {
          useCreateIndex: true,
          useNewUrlParser: true
        })   
      } else {
        reject(error)
        throw new Error('数据库重连失败！')
      }
    })

    mongoose.connection.once('open', () => {
      console.log('MongoDB connected successfully')
      
      resolve()   
    })
  })
}

module.exports = {
  connect,
  schemas
}