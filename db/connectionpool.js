// for some reason this normal import would not work at all; I had to use a the different syntax below and add an entry to the package.json for the type to be module
// const mysql = require('mysql2');

import mysql from 'mysql2';

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }).promise();

export { pool };