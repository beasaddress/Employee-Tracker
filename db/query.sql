SELECT * FROM employee
JOIN role ON employee.role_id = role.id
JOIN department on role.department_id = department.id;