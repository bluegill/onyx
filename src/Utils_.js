import chalk  from 'chalk';
import logger from './Logger';

export function inherit(a, b){
  for(i of Object.keys(b)){
    if(typeof b[i] === 'function')
      a.prototype[i] = b[i];
  }
}

export function firstToUpper(text){
  return (
    text.charAt(0).toUpperCase() + text.slice(1)
  );
}

export function getTime(){
  return (
    Math.floor(new Date() / 1000)
  );
}

export function getVersion(){
  return (
    require(process.cwd() + '/package.json').version
  );
}

export function showHeader(){
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