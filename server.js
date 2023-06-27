//importing dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;



//creating the connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: PORT,
        user: 'root',
        password: 'securesql',
        database: 'employees_db'
    },
    console.log(`Connected to the employees Database of Beatriz Beth Technologies Inc`)
    );
startInquirer();

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
                    view();
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

//the functions will be triggered if the user selects any of the options that display
//when the user selects the "view option" at the start of the inquirer
function view(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "view",
                message: "You have selected to view our database. What would you like to view?",
                choices: ["Departments", "Roles", "Employees"]
            }
        ]).then(function(response){
            switch(response.view){
                case "Departments":
                    viewDepartments();
                    break;
                case "Roles":
                    viewRoles();
                    break;
                case "Employees":
                    viewEmployees();
                    break;
            }
        });
    }

function viewDepartments() {
    db.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.id AS role_id, r.job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON d.manager_id = m.id",
    function(err, results) {
        if(err) throw err;
        console.log(results);
        startInquirer();
    });
    }

function viewRoles() {

    }

function viewEmployees() {

    }
