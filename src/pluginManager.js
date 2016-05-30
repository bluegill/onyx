import logger  from './logger';
import plugins from '../config/plugins';

export default class {
  constructor(world){
    this.world   = world;
    this.server  = world.server;
    this.plugins = [];

    for(const plugin of Object.keys(plugins)){
      const pluginObj = plugins[plugin];
      if(pluginObj.enabled){
        try {
          this.plugins[plugin] = new (require(`./${pluginObj.path}`))(this);
        } catch(error){
          logger.warn(`Unable to load plugin '${plugin}'!`);
        }
      }
    }

    const pluginCount = Object.keys(this.plugins).length;
    logger.info(`Plugin manager initialized, loaded ${pluginCount} plugins`);
  }

  getPlugin(plugin){
    if(this.plugins[plugin]){
      return this.plugins[plugin];
    }
  }
}