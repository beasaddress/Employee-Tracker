DROP DATABASE IF EXISTS emplooyees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) UNIQUE NOT NULL,
    manager VARCHAR(30) PRIMARY KEY,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    job_title VARCHAR(30) NOT NULL PRIMARY KEY,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL,
    PRIMARY KEY(id)

);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role _id VARCHAR(30) NOT NULL,
    manager_id VARCHAR(30),
    PRIMARY KEY (id)
    FOREIGN KEY (role_id) REFERENCES role(job_title) ON DELETE SET NULL
    FOREIGN KEY (manager_id) REFERENCES department(manager) ON DELETE SET NULL
);

