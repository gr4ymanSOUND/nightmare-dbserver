CREATE DATABASE nightmare_harvester;
USE nightmare_harvester;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL, 
  username VARCHAR(255) UNIQUE NOT NULL, 
  password VARCHAR(255) UNIQUE NOT NULL,
  allow_email BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

INSERT INTO users (email, username, password, allow_email, status)
VALUES 
('austin.lawrence.al@gmail.com', 'coolhatguy', 'ochoseis', true, 'active'),
('testing@test.test', 'test', 'testing', false, 'inactive');