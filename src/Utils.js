import chalk  from 'chalk';
import logger from './Logger';

export default class {
  static firstToUpper(text){
    return (text.charAt(0).toUpperCase() + text.slice(1))
  }

  static getTime(){
    return (Math.floor(new Date() / 1000));
  }

  static getVersion(){
    const version = require(process.cwd() + '/package.json').version;
    return version;
  }

  static showHeader(){
    console.log(chalk.green(`
    ______    _____  ___   ___  ___  ___  ___  
   /    " \\  (\\"   \\|"  \\ |"  \\/"  ||"  \\/"  | 
  // ____  \\ |.\\\\   \\    | \\   \\  /  \\   \\  /  
 /  /    ) :)|: \\.   \\\\  |  \\\\  \\/    \\\\  \\/   
(: (____/ // |.  \\    \\. |  /   /     /\\.  \\   
 \\        /  |    \\    \\ | /   /     /  \\   \\  
  \\"_____/    \\___|\\____\\)|___/     |___/\\___| 
                                               
         Version ${this.getVersion()} | Written by Lux
    `));
  }
}