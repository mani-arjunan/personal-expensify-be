CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (1000) NOT NULL,
  age INT,
  full_name VARCHAR (100) NOT NULL,
  sex VARCHAR (20) NOT NULL,
  martial_status VARCHAR (20) NOT NULL
) 
