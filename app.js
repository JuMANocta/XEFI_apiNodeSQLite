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
        logger.log({level : 'error', message : err.message })
    }else{
        db.run('CREATE TABLE employees(employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, last_name NVARCHAR(20) NOT NULL, first_name NVARCHAR(20) NOT NULL, title NVARCHAR(20), cp INTEGER(5))', (err)=>{
            logger.log({level : 'warm', message : err.message})
        })
    }
    console.log("La BDD est disponible")
    logger.log({level : 'info', message : 'La BDD est disponible'})
})

//Demande d'information sur id d'employée
app.get('/getInfoEmployee/:id', (req, res, next)=>{
    let params = [req.params.id]
    logger.log({level : 'info', message : 'récupération d\'informations sur l\'employée ' + params})
    let select = "SELECT * FROM employees WHERE employee_id = ?"
    db.get(select, params, (err, row)=>{
        if(err){
            logger.log({level : 'error', message : err.message})
            res.status(400).json({'error' : err.message})
            return
        }
        if(row == undefined){
            logger.log({level : 'error', message : 'id user non defini'})
            res.status(400).json({'error' : 'id user non defini'})
            return
        }
        console.log("Demande de récupération d'informations")
        logger.log({level : 'info', message : 'Récupération réussie'})
        res.status(200).json(row)
    })
})

//Demande d'information sur le total des employées
app.get("/getFullEmployees", (req, res, next)=>{
    let selectAll = "SELECT * FROM employees"
    db.all(selectAll, [], (err, rows)=>{
        if(err){
            logger.log({level : 'error', message : err.message})
            res.status(400).json({"error":err.message})
            return
        }
        logger.log({level : 'info', message : 'Récupération réussie'})
        res.status(200).json({rows})
    })
})

//Insertion d'un nouvel employees
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.post("/addEmployee/", (req, res, next)=>{
    let reqBody = req.body
    reqBody = [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.cp]
    let insert = "INSERT INTO employees (last_name, first_name, title, cp) VALUES (?,?,?,?)"
    db.run(insert, reqBody, function(err){
        if(err){
            logger.log({level : 'info', message : 'Ajout d\'un employée'})
            res.status(400).json({"error":err.message})
            return
        }
        logger.log({level : 'info', message : 'Ajout d\'un employée avec l\'id :' + this.lastID})
        res.status(200).json({"employee_id":this.lastID})
    })
})

//Demande de mise à jour
app.patch("/updateEmployees/", (req, res, next) => {
    var reqBody = req.body;
    db.run("UPDATE employees set last_name = ?, first_name = ?, title = ?, cfgsdgp = ? WHERE employee_id = ?",
        [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.country_code, reqBody.employee_id],
        function (err) {
            if (err) {
                logger.log({level : 'error', message : err.message})
                res.status(400).json({ "error": err.message })
                return;
            }
            logger.log({level : 'info', message : 'Modification d\'un employée : ' + this.changes} )
            res.status(200).json({ verification: this.changes });
        });
});
//Demande de suppression
app.delete("/deleteEmployees/:id", (req, res, next) => {
    db.run(`DELETE FROM user WHERE id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                logger.log({level : 'error', message : res.message})
                res.status(400).json({ "error": res.message })
                return;
            }
            logger.log({level : 'info', message : 'Suppression d\'un employée : ' + this.changes})
            res.status(200).json({ deletedVerif: this.changes })
        });
});

// Gestion de l'index de notre site
app.get("/", (req,res)=>{
    res.send('<h1>Api Employées</h1>')
})
// Récupération des URL fausses --> 302
app.get("*", (req,res)=>{
    // redirection vers notre page index
    res.redirect('/')
})