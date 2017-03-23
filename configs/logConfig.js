
function logConfig(){
    var winston = require('winston');
    var logger=new (winston.Logger)({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    warn: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    prompt: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  }
});
  logger.add(winston.transports.Console, {
  level: 'error',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false
});
 
 logger.info('Logger settings done');

return logger;
}

module.exports=logConfig();