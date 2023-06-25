//importing dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

//creating the connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'securesql',
        database: 'employees_db'
    },
    console.log(`Connected to the employees Database of Beatriz Beth Technologies Inc`)
    
);