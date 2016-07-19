import logger    from '../logger';
import {Plugins} from '../../onyxConfig';

export default class {
  constructor(world){
    this.world   = world;
    this.server  = world.server;
    this.plugins = [];

    for(const plugin of Plugins){
      if(plugin.enabled){
        try {
          this.plugins[plugin.name.toLowerCase()] = new (require(`../${plugin.path}`)).default(this);
        } catch(error){
          logger.warn(`Unable to load plugin '${plugin}'!`);
        }
      }
    }

    const pluginCount = Object.keys(this.plugins).length;
    logger.info(`Plugin manager initialized, loaded ${pluginCount} plugins`);
  }

  getPlugin(plugin){
    return this.plugins[plugin.toLowerCase()];
  }
}