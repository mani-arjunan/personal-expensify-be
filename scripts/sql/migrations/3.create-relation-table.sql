CREATE TABLE relation (
    id SERIAL PRIMARY KEY,
    approved BOOLEAN,
    rejected BOOLEAN,
    primary_id INT REFERENCES users(id) NOT NULL,
    association_id INT REFERENCES users(id) NOT NULL,
    association_type_id INT REFERENCES association_type(id),
    UNIQUE (primary_id, association_id)
)

