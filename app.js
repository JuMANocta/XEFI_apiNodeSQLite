const sqlite3 = require('sqlite3')
const express = require('express')
const logger = require('./logger.js')
let app = express()

const HTTP_PORT = "8000"

//Démarage du serveur HTTP
app.listen(HTTP_PORT, ()=>{
    console.log("Serveur en route sur le port " + HTTP_PORT)
    logger.log({level : 'info', message : "Serveur démarré sur le port " + HTTP_PORT})
})

//Création de la BDD et insertion de 3 lignes
let db = new sqlite3.Database('./model/bdd.db', (err)=>{
    if(err){
        console.error("J'ai pas pu ouvrir la BDD " + err.message)
        logger.log({level : 'error', message : 'BDD indisponible' })
    }else{
        db.run('CREATE TABLE employees(employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, last_name NVARCHAR(20) NOT NULL, first_name NVARCHAR(20) NOT NULL, title NVARCHAR(20), cp INTEGER(5))', ()=>{
            logger.log({level : 'info', message : 'Création de la BDD'})
        })
    }
    console.log("La BDD est disponible")
    logger.log({level : 'info', message : 'La BDD est disponible'})
})

//Demande d'information sur id d'employée
app.get('/getInfoEmployee/:id', (req, res, next)=>{
    console.log("Demande de récupération d'informations sur un employée")
    let params = [req.params.id]
    let select = "SELECT * FROM employees WHERE employee_id = ?"
    db.get(select, params, (err, row)=>{
        if(err){
            res.status(400).json({"error":err.message})
            return
        }
        if(row == undefined){
            res.status(400).json({"error":"id user non defini"})
            return
        }
        console.log("Demande de récupération d'informations")
        res.status(200).json(row)
    })
})

//Demande d'information sur le total des employées
app.get("/employees", (req, res, next)=>{
    let selectAll = "SELECT * FROM employees"
    db.all(selectAll, [], (err, rows)=>{
        if(err){
            res.status(400).json({"error":err.message})
            return
        }
        res.status(200).json({rows})
    })
})

//Insertion d'un nouvel employees
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.post("/employees/", (req, res, next)=>{
    let reqBody = req.body
    reqBody = [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.cp]
    let insert = "INSERT INTO employees (last_name, first_name, title, cp) VALUES (?,?,?,?)"
    db.run(insert, reqBody, function(err){
        if(err){
            res.status(400).json({"error":err.message})
            return
        }
        res.status(200).json({"employee_id":this.lastID})
    })
})

app.get("/test", (req,res,next)=>{
    res.redirect("back")
})

//Demande de mise à jour
app.patch("/employees/", (req, res, next) => {
    var reqBody = req.body;
    db.run(`UPDATE employees set last_name = ?, first_name = ?, title = ?, address = ?, country_code = ? WHERE employee_id = ?`,
        [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.address, reqBody.country_code, reqBody.employee_id],
        function (err) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updatedID: this.changes });
        });
});
//Demande de suppression
app.delete("/employees/:id", (req, res, next) => {
    db.run(`DELETE FROM user WHERE id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ deletedID: this.changes })
        });
});