CREATE TABLE income_transaction (
  id SERIAL PRIMARY KEY,
  description VARCHAR(1000),
  user_id INT REFERENCES users(id) NOT NULL,
  income_id INT REFERENCES income(id) NOT NULL,
  amount INT DEFAULT 0,
  Date TIMESTAMPTZ,
  private BOOLEAN DEFAULT false
)
