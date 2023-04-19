const express = require('express');
var app = express();
app.use(express({extends:true}));
app.use(express.json())
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"project1"
})

connection.connect((error)=>{
    if(error) console.log('error in connection to database',error);
    else console.log('connected to mysql database');
})

// app.post('/test',(req,res)=>{
//     console.log(req.body);
//     res.json(req.body);
// })

app.get('/get',(req,res)=>{
    connection.query('SELECT * from employee', (error,result)=>{
        if(error) {
            console.log('error in fetching the data from the server' , error);
            res.status(500).send('error in fetching data from the database');
        }else{
            res.status(200).send(result);
        }
    })
})

app.get('/get/:id',(req,res)=>{
    var id = req.params.id;
    connection.query('SELECT * from employees where id = ?',[id], (error,result)=>{
        if(error) {
            console.log('error in fetching the data from the server' , error);
            res.status(500).send(error);
        }else if (result.length > 0){
            // console.log(result)
            res.status(200).send(result[0]);
        } else {
            res.status(404).send('Id not found');
        }
    })
})

app.post('/post',(req,res)=>{
    const{ name, email, phone} = req.body;
    var sql = "INSERT INTO employee (name,email,phone) VALUES ?"

    var VALUES = [[name , email , phone]];

    connection.query(sql,[VALUES],(error,result)=>{
        if(error){
            console.log('database cant create', error);
            res.status(500).send('error in putting the data');
        } else{
            res.status(200).send('data store successful');
        }
    })
})

app.put('/data/:id',(req,res)=>{

    const {name , email , phone } = req.body;
    var id = req.params.id;
    connection.query('SELECT * from employees where id = ?',[id], (error,result)=>{
        if(error) {
            console.log('error in fetching the data from the server' , error);
            res.status(500).send('error in fetching data from the database');
        }else if (result.length > 0){
            connection.query('UPDATE employee SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id],(error,result)=>{
                if(error){
                    console.log("not put the data into the database",error);
                    res.status(500).json({message: "not putting data"})
                } else{
                    res.status(200).json({message: "data update successful", result});
                }
            })
        } else {
            res.status(404).send('Id not found');
        }
    })
})

app.delete('/data/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM employee WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log('Error deleting data in MySQL database:', error);
            res.status(500).send('Error deleting data in MySQL database!');
        } else {
            res.status(200).send('Data deleted successfully!');
        }
    });
});

app.use(function(req, res, next){
    res.status(404).send("Oops Route not found!!!!!!");
})

app.listen(3000, () => {
    console.log('JSON API server is listening on port 3000!');
});