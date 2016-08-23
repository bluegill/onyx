import pluginBase from './PluginBase';

export default class extends pluginBase {
  constructor(manager){
    super(manager);

    this.filter = [
      'cpps.io',
      'cppsio',
      'cppsi0',
      'cpps.i0',
      'cppscreator',
      'anxrp',
      'flippr.eu',
      'frostpengu',
      'hyperboreal',
      'ipenguin',
      'ipengu.in',
      'migratecpps',
      'mystcp',
      'pengur.co',
      'pluspenguin'
    ];

    const handleSendMessage        = this.world.handleSendMessage;
    const handleSendPrivateMessage = this.world.handleSendPrivateMessage;

    this.world.handleSendMessage = ((data, client) => {
      let message = data[4].trim();
          message = message.toLowerCase();

      for(let str of this.filter){
        if(message.includes(str)) return;
      }

      handleSendMessage.apply(this.world, [data, client]);
    });

    this.world.handleSendPrivateMessage = ((data, client) => {
      let message = data[5].trim();
          message = message.toLowerCase();

      for(let str of this.filter){
        if(message.includes(str)) return;
      }

      handleSendPrivateMessage.apply(this.world, [data, client]);
    });
  }
}