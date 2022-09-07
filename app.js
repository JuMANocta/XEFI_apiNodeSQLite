const sqlite3 = require('sqlite3')
const express = require('express')
let app = express()

const HTTP_PORT = "8000"

//Démarage du serveur HTTP
app.listen(HTTP_PORT, ()=>{
    console.log("Serveur en route sur le port " + HTTP_PORT)
})

//Création de la BDD et insertion de 3 lignes
let db = new sqlite3.Database('./model/bdd.db', (err)=>{
    if(err){
        console.error("J'ai pas pu ouvrir la BDD " + err.message)
    }else{
        db.run('CREATE TABLE employees(employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, last_name NVARCHAR(20) NOT NULL, first_name NVARCHAR(20) NOT NULL, title NVARCHAR(20), cp INTEGER(5))', ()=>{
            let insert = "INSERT INTO employees (last_name, first_name, title, cp) VALUES (?,?,?,?)"
            db.run(insert, ["Chamoix", "Dore", "DG", 75000])
            db.run(insert, ["Idris", "Maloi", "SE", 75000])
            db.run(insert, ["Jhon", "Do", "AG", 75000])
        })
    }
    console.log("La BDD est disponible")
})

//Demande d'information sur id d'employée
app.get('/employees/:id', (req, res, next)=>{
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