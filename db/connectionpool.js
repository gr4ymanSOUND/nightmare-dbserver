// for some reason this normal import would not work at all; I had to use a the different syntax below and add an entry to the package.json for the type to be module
// this ended up leading to a lot of headaches down the line with the shared hosting server which used commonJS and not modules
// const mysql = require('mysql2');

import mysql from 'mysql2';

  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'GRAYadmin',
    database: 'nightmare_harvester'
  }).promise();

  // for the live environment
  // couldn't get the node_env variable (prod vs dev) to work correctly for some reason, so just switching between which is commented when I make a build for uploading
  // const pool = mysql.createPool({
  //   host: process.env.MYSQL_HOST,
  //   user: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD,
  //   database: process.env.MYSQL_DATABASE
  // }).promise();

export { pool };