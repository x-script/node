const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
const SALT_ROUNDS = 10

const userSchema = new Schema({
  userid: { type: ObjectId },
  username: { unique: true, type: String, minlength: 4, maxlength: 20 },
  password: { type: String, minlength: 6, maxlength: 20 },
  createAt: { type: Date, default: Date.now() },
  lastLoginAt: { type: Date, default: Date.now() },
  portraitUrl: { type: String, default: '' },
  nickname: { type: String, default: '' }
}, {
  // 自定义表名 （默认生成 model 名称的复数形式）
  collection: 'users'
})

userSchema.pre('save', function(next) {
  bcrypt.genSalt(SALT_ROUNDS, (error, salt) => {
    if (error) return next(error)

    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)

      this.password = hash
      next()
    })
  })
})

userSchema.methods = {
  comparePassword(password, password_hash) {
    return new Promise((resolve,reject) => {
      bcrypt.compare(password, password_hash, (error, res) => {
        if (!error) resolve(res)
        else reject(error)
      })
    })
  }
}

mongoose.model('User', userSchema)