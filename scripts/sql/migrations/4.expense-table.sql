CREATE TABLE expense (
  id SERIAL PRIMARY KEY,
  type VARCHAR (20)
);

INSERT INTO expense (type) VALUES ('Food'), ('Shopping'), ('Transport'), ('Home'), ('Personal'), ('Bills'), ('Outing'), ('Travel'); 
