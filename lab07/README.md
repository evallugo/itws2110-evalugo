- Part 2 Commands:
    1. ALTER TABLE Students
        ADD Street VARCHAR(255),
        ADD City VARCHAR(100),
        ADD State CHAR(2),
        ADD Zip CHAR(10);
    2. ALTER TABLE Courses
        ADD Section CHAR(3),
        ADD Year SMALLINT(4);
    3. CREATE TABLE IF NOT EXISTS Grades (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        CRN INT(11) NOT NULL,
        RIN INT NOT NULL,
        Grade INT(3) NOT NULL,
        FOREIGN KEY (CRN) REFERENCES Courses(CRN),
        FOREIGN KEY (RIN) REFERENCES Students(RIN));
    4. INSERT INTO Courses (CRN, Prefix, Number, Title, Section, Year) VALUES
        (12345, 'ITWS', 2110, 'Web Systems Development', '001', 2025),
        (23456, 'ITWS', 1100, 'Intro to ITWS', '002', 2024),
        (34567, 'CSCI', 1200, 'Data Structures', '001', 2025),
        (45678, 'CSCI', 1100, 'Intro to Computer Science', '003', 2024);
    5. INSERT INTO Students (RIN, RCSID, FirstName, LastName, Alias, Phone, Street, City, State, Zip) VALUES
        (123456789, 'jdoe', 'John', 'Doe', 'Johnny', 1234567890, '123 Main St', 'Ithaca', 'NY', '14850'),
        (987654321, 'asmith', 'Alice', 'Smith', 'Ally', 9876543210, '456 Oak Ave', 'Ithaca', 'NY', '14850'),
        (555666777, 'bwillia', 'Bob', 'Williams', 'Bobby', 5556667770, '789 Pine Rd', 'Ithaca', 'NY', '14850'),
        (111222333, 'cjones', 'Carol', 'Jones', 'Caz', 1112223330, '321 Maple St', 'Ithaca', 'NY', '14850');
    6. INSERT INTO Grades (CRN, RIN, Grade) VALUES
        (12345, 123456789, 95), (12345, 987654321, 88), (12345, 555666777, 92), (23456, 123456789, 85),
        (23456, 111222333, 91), (34567, 987654321, 77), (34567, 555666777, 84), (45678, 111222333, 93),
        (45678, 987654321, 89), (45678, 123456789, 97);
    7. SELECT * FROM Students
        ORDER BY RIN;
        SELECT * FROM Students
        ORDER BY LastName;
        SELECT * FROM Students
        ORDER BY RCSID;
        SELECT * FROM Students
        ORDER BY FirstName;
    8. SELECT DISTINCT s.RIN,
        s.FirstName,
        s.LastName,
        s.Street,
        s.City,
        s.State,
        s.Zip
        FROM Students s
        JOIN Grades g ON s.RIN = g.RIN
        WHERE g.Grade > 90;
    9. SELECT c.CRN,
        c.Prefix,
        c.Number,
        c.Title,
        AVG(g.Grade) AS AvgGrade
        FROM Courses c
        JOIN Grades g ON c.CRN = g.CRN
        GROUP BY c.CRN, c.Prefix, c.Number, c.Title;
    10. SELECT c.CRN,
        c.Prefix,
        c.Number,
        c.Title,
        COUNT(g.RIN) AS NumStudents
        FROM Courses c
        LEFT JOIN Grades g ON c.CRN = g.CRN
        GROUP BY c.CRN, c.Prefix, c.Number, c.Title;



        Lab Struggles:
        * Connecting to the database 
        * Group communication

