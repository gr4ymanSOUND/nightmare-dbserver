import pool from './connectionpool'

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
      status VARCHAR(255) NOT NULL
    );
    `);

  } catch (error) {
    throw error;
  }
}

async function addInitialData () {
  try {
    await pool.query(`
      INSERT INTO users (email, username, password, allow_email, status)
      VALUES 
      ('austin.lawrence.al@gmail.com', 'coolhatguy', 'ochoseis', true, 'active'),
      ('testing@test.test', 'test', 'testing', false, 'inactive');
    `);
  } catch (error) {
    throw(error)
  }
}


buildTables()
  .then(addInitialData)
  .catch(console.error)
