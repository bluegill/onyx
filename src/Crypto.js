'use strict'

const crypto = require('crypto')

module.exports = class {
  static generateKey () {
    const characterMap = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_+=:;,./[]`~'

    let randomKey = ''

    for (let i = 0; i < 12; i++) {
      const randomChar = Math.floor(Math.random() * characterMap.length)
      randomKey += characterMap.charAt(randomChar)
    }

    return randomKey
  }

  static md5 (data) {
    return crypto.createHash('md5').update(data).digest('hex')
  }

  static sha256 (data) {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  static swapHash (hash) {
    const swappedHash = hash.substr(32, 32) + hash.substr(0, 32)

    return swappedHash
  }

  static encryptPassword (pass, key) {
    let encryptedPass = this.swapHash(pass) + key

    encryptedPass += 'Y(02.>\'H}t":E1'
    encryptedPass = this.sha256(encryptedPass)

    return this.swapHash(encryptedPass)
  }
}
