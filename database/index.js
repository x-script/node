const { resolve } = require('path')
const glob = require('glob')
const mongoose = require('mongoose')

const db = 'mongodb://localhost/test-db'

exports.schemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
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
        throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
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
        throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
      }
    })

    mongoose.connection.once('open', () => {
      console.log('MongoDB connected successfully') 
      resolve()   
    })
  })
}