const sqlite3 = require('sqlite3')
const express = require('express');
const app = express();
const routes = require('./controllers/routes')
const logger = require('./controllers/logger')

const HTTP_PORT = "8000"

app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/', routes);

//Démarage du serveur HTTP
app.listen(HTTP_PORT, ()=>{
    console.log("Serveur en route sur le port " + HTTP_PORT)
    logger.log({level : 'info', message : "Serveur démarré sur le port " + HTTP_PORT})
})