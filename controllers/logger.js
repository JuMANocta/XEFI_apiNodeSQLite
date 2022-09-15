const {createLogger, format, transports} = require("winston")
const logLevels = {
    fatal : 0,
    error : 1,
    warm : 2,
    info : 3,
    debug: 4,
    trace : 5,
}
const logger = createLogger({
    levels : logLevels,
    format : format.combine(
        format.timestamp(),
        format.json()
    ),
    // afficher les logs dans la console :
    // transports : [new transports.Console()],
    // écrire les logs dans un fichier
    transports : [new transports.File({filename : "./logs/logs.log"})],
})
console.log("Loggeur disponible")
logger.log({level : 'info', message : 'Loggeur disponible'})

module.exports = logger