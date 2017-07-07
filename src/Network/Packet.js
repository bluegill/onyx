export default class {
  constructor (data) {
    this.parse(data.toString())
  }

  parse (data) {
    let packet = data.split('\0')[0]

    this.raw = packet

    if (packet.startsWith('<')) {
      this.type = 'xml'

      if (packet.includes('policy')) {
        this.action = 'policy'

        return
      }

      let action = packet.split('action=\'')[1].split('\' r=')[0]

      this.action = action
    }

    if (packet.startsWith('%')) {
      let raw = packet.split('%')

      raw.shift()
      raw.shift()

      this.type = 'ext'
      this.zone = raw.shift()
      this.action = raw.shift()
      this.data = raw
    }
  }
}
