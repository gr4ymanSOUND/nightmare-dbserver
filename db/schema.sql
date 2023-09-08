CREATE DATABASE nightmare_harvester;
USE nightmare_harvester;

DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL, 
  username VARCHAR(255) UNIQUE NOT NULL, 
  password VARCHAR(255) UNIQUE NOT NULL,
  allow_email BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL, 
  username VARCHAR(255) UNIQUE NOT NULL, 
  password VARCHAR(255) UNIQUE NOT NULL,
  allow_email BOOLEAN DEFAULT false,
  status VARCHAR(255) NOT NULL DEFAULT 'active',
  is_admin BOOLEAN DEFAULT false
);

CREATE TABLE videos (
  id integer PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) UNIQUE NOT NULL,
  description VARCHAR(255) UNIQUE NOT NULL,
  video_url VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO users (email, username, password, allow_email, status, is_admin)
VALUES 
('austin.lawrence.al@gmail.com', 'coolhatguy', 'ochoseis', true, 'active', true),
('testing@test.test', 'CultLeaderDerek', 'l34dER', false, 'active', true);