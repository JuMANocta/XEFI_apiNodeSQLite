const sqlite3 = require('sqlite3')
const express = require('express')
let app = express()

const HTTP_PORT = "8000"

app.listen(HTTP_PORT, ()=>{
    console.log("Serveur en route sur le port " + HTTP_PORT)
})

