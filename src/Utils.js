'use strict'

module.exports = class {
  static inherit (a, b) {
    for (let i of Object.keys(b)) {
      if (typeof b[i] === 'function') {
        a.prototype[i] = b[i]
      }
    }
  }

  static firstToUpper (text) {
    return (text.charAt(0).toUpperCase() + text.slice(1))
  }

  static getTime () {
    return (Math.floor(new Date() / 1000))
  }

  static getVersion () {
    const version = require(`${process.cwd()}/package.json`).version

    return version
  }
}
