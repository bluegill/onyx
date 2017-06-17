'use strict'

let path = 'lib'

if (process.argv.includes('--src')) path = 'src'

const Onyx = require(`./${path}/Onyx`)
const Logger = require(`./${path}/Logger`)

let config = require('./config')

if (config) {
  const onyx = new Onyx(config)

  onyx.nil() // hide lint warning
} else {
  Logger.error('Server configuration not found')
}
