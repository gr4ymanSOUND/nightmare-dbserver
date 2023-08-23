// for some reason this normal import would not work at all; I had to use a the different syntax below and add an entry to the package.json for the type to be module
// const mysql = require('mysql2');

import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'GRAYadmin',
  database: 'nightmare_harvester'
}).promise();

export { pool };