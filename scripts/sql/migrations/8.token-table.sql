CREATE TABLE token (
  id SERIAL PRIMARY KEY,
  refresh_token VARCHAR(200),
  user_id INT REFERENCES users(id)
)
