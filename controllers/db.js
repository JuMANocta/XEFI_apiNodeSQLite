const sqlite3 = require('sqlite3')
const logger = require('./logger')

//Création de la BDD et insertion de 3 lignes
const db = new sqlite3.Database('model/bdd.db', (err)=>{
    if(err){
        console.error("J'ai pas pu ouvrir la BDD " + err.message)
        logger.log({level : 'error', message : err.message })
    }else{
        db.run('CREATE TABLE employees(employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, last_name NVARCHAR(20) NOT NULL, first_name NVARCHAR(20) NOT NULL, title NVARCHAR(20), cp INTEGER(5))', (err)=>{
            logger.log({level : 'warm', message : err.message})
        })
    }
    console.log("La BDD est disponible")
    logger.log({level : 'info', message : 'La BDD est disponible'})
})

module.exports = db