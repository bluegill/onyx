'use strict'

export default class {
  static inherit (a, b) {
    for (let i of Object.keys(b)) {
      if (typeof b[i] === 'function') {
        a.prototype[i] = b[i]
      }
    }
  }

  static extend (parent, arr) {
    const [methodOne, methodTwo] = arr

    const result = (data, client) => {
      methodOne.apply(parent.world, [data, client])
      methodTwo.apply(parent, [data, client])
    }

    parent.world[methodTwo.name] = result
  }

  static firstToUpper (text) {
    return (text.charAt(0).toUpperCase() + text.slice(1))
  }

  static getKeyByValue (obj, val) {
    return Object.keys(obj).find(key => obj[key] === val)
  }

  static getTime () {
    return (Math.floor(new Date() / 1000))
  }

  static getVersion () {
    const version = require(`${process.cwd()}/package.json`).version

    return version
  }
}
