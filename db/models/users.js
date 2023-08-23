import { pool } from '../connectionpool.js'

const result = await pool.query("SELECT * FROM users");

console.log(result);