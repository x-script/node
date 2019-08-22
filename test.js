const Jwt = require('./util/Jwt')

let jwt = new Jwt({
  username: 123
})

let token = jwt.generateToken()

console.log(token)

let jj = new Jwt(token)
let res = jj.verifyToken()
console.log(res)