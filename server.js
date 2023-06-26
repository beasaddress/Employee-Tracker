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

    //a function that will start the functionality of the application once the connection is created to the db
    function startInquirer() {
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "start",
                    message: "Welcome to the Employee Database. What would you like to do?",
                    choices: ["View", "Add", "Update", "Exit"]
                }
            ]).then(function(response){
                switch(response.startInquirer) {
                    case "View":
                        views();
                        break;
                    case "Add":
                        add();
                        break;
                    case "Update":
                        update();
                        break;
                    case "Exit":
                        console.log("Database closed. Goodbye.");
                }
            });
    }



