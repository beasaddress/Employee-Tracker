//importing dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
//const PORT = process.env.PORT || 3006;
//const table = require('console.table');

//creating the connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //port: PORT,
        user: 'root',        
        password: 'securesql',
        database: 'employees_db'
    });
 db.connect(function (err) {
        if (err) throw err;
        console.log("SQL Connected");
        startInquirer();
    });


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
            switch(response.start) {
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

function viewEmployees() {
    db.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.id AS role_id, r.job_title, d.name AS department, r.salary, d.manager_id AS manager_name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON d.manager_id = m.id",
    function(err, results) {
        if(err) throw err;
        console.log(results);
        startInquirer();
    });
}

function viewRoles() {
    db.query("SELECT role.job_title, role.id AS role_id, department.name AS department_name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, results){
        if(err) throw err;
        console.log(results);
        startInquirer();
    });
}

function viewDepartments() {
    db.query("SELECT id, name FROM department ORDER BY id",
    function (err, results) {
        if(err) throw err;
        console.log(results);
        startInquirer();
    });
}

//functions that will add data to the database table

function add() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "add",
                message: "What would you like to add?",
                choices: ["Department", "Role", "Employee"]
            }
    ]).then(function(response){
        switch(response.add){
            case "Department":
                addDepartment();
                break;
            case "Role":
                addRole();
                break;
            case "Employee":
                addEmployee();
                break;
        }
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the new department?"
            },
            {
                name: "manager",
                type: "input",
                message: "Who is the manager of this department?"
            }
    ]).then(answers => {
        const query = `INSERT INTO department (name, manager_id) VALUES ('${answers.department}', '${answers.manager}')`;
        
        db.connect(err => {
            if (err) throw err;
            db.query(query, error => {
                if (error) throw error;
                console.log("New department has been added");
                db.end();
                startInquirer();
            });
        });
     });
}
function addRole() {
    inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "What is the job title?"
            },
            {
                name: "salary",
                type: "number",
                message: "What is the salary for this role?",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "department_id",
                type: "number",
                message: "Enter the Department ID",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                }
            }
    ]).then(answers => {
        const query = `INSERT INTO role (job_title, salary, department_id) VALUES ('${answers.role}', '${answers.salary}','${answers.department_id}')`;
        
        db.connect(err => {
            if (err) throw err;
            db.query(query, error => {
                if (error) throw error;
                console.log('New role has been added to to the database');
                db.end();
            });
        });
    });
}
function addEmployee(){
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter the new employee's first name."
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter the new employee's last name",
        },
        {
            name: "role_id",
            type: "input",
            message: "Enter the new employee's role ID"
        }
    ]).then(answers => {
        const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES ('${answers.firstName}', '${answers.lastName}', '${answers.role_id}')`;

        db.connect(err => {
            if (err) throw err;
            db.query(query, error => {
                if (error) throw error;
                console.log('New employee has been added to to the database');
                db.end();
            });
        });
    });
}