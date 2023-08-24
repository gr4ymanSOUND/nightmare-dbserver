import { pool } from './connectionpool.js'

import { createUser } from './models/users.js';

const result = await pool.query("SELECT * FROM users");

console.log(result);

async function buildTables() {
  try {
    await pool.query(`
      USE nightmare_harvester;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS users;
    `);

    await pool.query(`
    CREATE TABLE users (
      id integer PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL, 
      username VARCHAR(255) UNIQUE NOT NULL, 
      password VARCHAR(255) UNIQUE NOT NULL,
      allow_email BOOLEAN DEFAULT false,
      status VARCHAR(255) NOT NULL DEFAULT 'active'
    );
    `);

  } catch (error) {
    throw error;
  }
}

async function addInitialData () {

    const usersToCreate =   [
      { email:'austin.lawrence.al@gmail.com', username:'coolhatguy', password:'ochocinco', allow_email: true, status: 'active' },
      { email:'testing@test.test', username:'tester', password:'TOASTY', allow_email: false, status: 'active' }
    ];

    console.log("creating users");
    const [users] = await Promise.all(usersToCreate.map(createUser));
    console.log(users);
    console.log("finished creating users!!");
}


buildTables()
  .then(addInitialData)
  .catch(console.error)
