CREATE TABLE income (
  id SERIAL PRIMARY KEY,
  type VARCHAR (20)
);

INSERT INTO income (type) VALUES ('Salary'), ('Business'), ('Interest'), ('Extra Income'); 
