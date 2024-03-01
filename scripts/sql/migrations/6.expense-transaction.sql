CREATE TABLE expense_transaction (
  id SERIAL PRIMARY KEY,
  description VARCHAR(1000),
  user_id INT REFERENCES users(id) NOT NULL,
  expense_id INT REFERENCES expense(id) NOT NULL,
  amount INT DEFAULT 0,
  Date TIMESTAMPTZ,
  private BOOLEAN DEFAULT false
)
