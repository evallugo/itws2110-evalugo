USE lab7;

CREATE TABLE IF NOT EXISTS grades (
  id INT NOT NULL AUTO_INCREMENT,
  crn INT(11) NOT NULL,
  RIN INT(9) NOT NULL,
  grade INT(3) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_grades_course
    FOREIGN KEY (crn) REFERENCES courses(crn),
  CONSTRAINT fk_grades_student
    FOREIGN KEY (RIN) REFERENCES students(RIN)
);
