//importing dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
//const PORT = process.env.PORT || 3006;
const consoleTable = require('console.table');

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
                    updateEmployee();
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
        console.table(results);
        startInquirer();
    });
}

function viewRoles() {
    db.query("SELECT role.job_title, role.id AS role_id, department.name AS department_name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, results){
        if(err) throw err;
        console.table(results);
        startInquirer();
    });
}

function viewDepartments() {
    db.query("SELECT id, name FROM department ORDER BY id",
    function (err, results) {
        if(err) throw err;
        console.table(results);
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

//a function that will give the user the ability to update an employees role

function updateEmployee() {
    //because the user has to 'select' a user based on acceptance criteria, they will have to choose an answer based on the current list 
    //of employees from the database so we'll use db.query first before inquirer prompt so that we can access the db to generate a list

    //going to display an employee table to the user so they only have to select first names. I found this easier because when i showed them full names, 
    //i found it hard to grab their answer and put it inside a variable and place it in a db query as a template 
    //literal bc their answer would technically bc two different values from the employee table (first AND last name) 
    viewEmployees();

    db.query('SELECT * FROM employee',
    function (err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    //dynamically displaying the list by creating an empty array, then using a for loop to
                    //iterate each of the results, then pushing the names into the array, then displaying that array as choices for the user
                    choices: function(){
                        let choiceList = [];
                        for(i=0; i< results.length; i++)
                        {
                            const firstName = `${results[i].first_name}`;
                           // const first = `${results[i].first_name}`;
                           // const last = `${results[i].last_name}`;
                            choiceList.push(firstName);
                        }
                        return choiceList;
                    },
                    message: "Select an employee to update"
                }
                
        ]).then(function(answer){
            const selectedEmployee = answer.choice;
            db.query("SELECT * FROM role",
            function(err, results){
                if(err) throw err;
            inquirer.prompt([
                {
                    name: "role",
                    type: "rawlist",
                    choices: function(){
                        var choiceList = [];
                        for(i=0; i<results.length; i++){
                            choiceList.push(results[i].job_title)
                        }
                        return choiceList;
                    },
                    message: "Select their new role"
                }
            ]).then(answers => {
                const newJobTitle = answers.newJobTitle;
                //using a new method here...since employee and role are two different tables, but i need to update a job_title based on an employee's first name,
                //i will need a "transaction" of sql statements that should work together as a single logical operation
                    db.beginTransaction(function (err) {
                        if (err) throw err;
                        //update employees job title INSIDE employee table
                        const updateEmployeeTable = `UPDATE employee SET role_id = (SELECT id FROM role WHERE job_title = '${newJobTitle}') WHERE first_name = '${selectedEmployee}'`;

                        db.query(updateEmployeeTable, function (err, results) {
                            if (err) {
                                //a can also use a "rollback" which basically is paired with a callback error
                                //the rollback will undo all the new changes from the transaction statements if an error occurs.
                                db.rollback(function () {
                                    throw err;
                                });
                            }
                            const updateRoleTable = `UPDATE role SET job_title = '${newJobTitle}' WHERE id = (SELECT role_id FROM employee WHERE first_name = '${selectedEmployee}')`;
                            db.query(updateRoleTable, function (err, result) {
                                if (err) {
                                    //if an error occurs when updating the role table, the rollback method will rollback the changes and reuturn it to its original state
                                    db.rollback(function () {
                                        throw err;
                                    });
                                }
                                //if there werent any errors, "commit" function should permanently apply all the changes 
                                //to the database that were made with the transaction of two queries/sql statements
                                db.commit(function (err) {
                                    if (err) {
                                        db.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Employee's role has been updated!");
                                });
                            })
                        })
                    })
            })
            })
        })
    })
}



