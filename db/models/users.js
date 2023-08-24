import { pool } from '../connectionpool.js'

import bcrypt from 'bcrypt';
const SALT = 13;

async function getAllUsers() {
    try {
      const [ allUsers ] = await pool.query(`
        SELECT id, email, username, allow_email, status
        FROM users;
      `);
      return allUsers;
    } catch (error) {
      throw error;
    }
}
  
async function getUser({ username, password }) {

  try {
    const [ [user] ]= await pool.query(`
      SELECT *
      FROM users
      WHERE username = ?;
    `, [username]);
    
    if (!user) {
      throw new Error('issue logging in');
    };

    console.log(user);
    const userPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, userPassword);
    if (!passwordMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const [ user ] = await pool.query(`
      SELECT *
      FROM users
      WHERE id = ?;
    `, [id]);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function createUser(userInfo) {
  try {
    console.log(userInfo);
    const hashedPassword = await bcrypt.hash(userInfo.password, SALT);
    userInfo.password = hashedPassword;
    const valueString = Object.keys(userInfo).map(
      (key, index) => `?`
    ).join(', ');

  const keyString = Object.keys(userInfo).map(
      (key) => `${ key }`
    ).join(', ');

    // this should return the 
    const [ result ] = await pool.query(`
      INSERT INTO users (${keyString})
      VALUES (${valueString});
    `, Object.values(userInfo));

    const newUserId = result.insertId;
    const newUser = getUserById(newUserId);
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, userInfo) {
  try {
    const valueString = Object.keys(userInfo).map(
      (key, index) => `'${key}' = '${userInfo[key]}'`
    ).join(', ');
    const [ updatedUserId ] = await pool.query(`
      UPDATE users
      SET ${valueString}
      WHERE id = $1;
    `, [userId]);

    const updatedUser = getUserById(updatedUserId);
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export {
  getAllUsers,
  getUser,
  getUserById,
  createUser,
  updateUser
};