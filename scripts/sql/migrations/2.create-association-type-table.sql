CREATE TABLE association_type (
  id SERIAL PRIMARY KEY,
  type VARCHAR (20)
);

INSERT INTO association_type (type) VALUES ('Husband'), ('Wife'), ('Mother'), ('Father'), ('Child');
