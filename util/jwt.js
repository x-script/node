const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')

class Jwt {
  constructor(data) {
    this.data = data
  }

  generateToken() {
    let data = this.data
    let create_time = Math.floor(Date.now() / 1000)
    let token = jwt.sign({
      data,
      expiry_time: create_time + 60 * 30
    }, 'token')

    return token
  }

  verifyToken() {
    let token = this.data
    let res = true

    try {
      let expiry_time = jwt.verify(token, 'token')
      let current_time = Math.floor(Date.now() / 1000)

      if (current_time <= expiry_time) res = false
    } catch (error) {
      res = false
    }

    return res
  }
}

module.exports = Jwt