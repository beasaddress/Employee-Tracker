INSERT INTO department (name, manager_id)
VALUES ("Finance", "Michael Scott"),
        ("Legal", "Creed Bratton"),
        ("Administration", "Michael Scott"),
        ("Marketing", "Kelly Kapoor"),
        ("Tech", "Jim Halpert"),
        ("Board of Directors", "Michael Scott"),
        ("HR", "Toby Flenderson");

INSERT INTO role (job_title, salary, department_id)
VALUES ("Accounts Payable", 65000, 1),
        ("Legal Secretary", 60000, 2),
        ("Receptionist", 38000, 3),
        ("Social Media Manager", 70000, 4),
        ("Software Engineer", 120000, 5),
        ("CEO", 500000, 6),
        ("HR Director", 80000, 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ("Angela", "Martin", 1),
        ("Andy", "Bernard", 2),
        ("Taylor", "Wood", 5),
        ("Alicia", "Keys", 4),
        ("Gwen", "Stefani", 6),
        ("Jordan", "Belfort", 7),
        ("Lana", "Del Ray", 1),
        ("Pam", "Beesly", 3);
