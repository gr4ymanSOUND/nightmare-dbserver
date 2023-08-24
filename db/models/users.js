import { pool } from '../connectionpool.js'

// basic format
// const result = await pool.query("SELECT * FROM users");


import bcrypt from 'bcrypt';
const SALT = 13;

async function getAllUsers() {
    try {
      const [ allUsers ] = await pool.query(`
        SELECT id, "firstName", "lastName", email, "userName", "isAdmin", status
        FROM users;
      `);
      return allUsers;
    } catch (error) {
      throw error;
    }
}
  
async function getUser({ userName, password }) {

  try {
    const {rows: [user]}= await pool.query(`
      SELECT *
      FROM users
      WHERE "userName" = $1;
    `, [userName]);
    
    if (!user) {
      throw new Error('issue logging in');
    };

    const userPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, userPassword);
    if (!passwordMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function createUser(userInfo) {
  try {
    const hashedPassword = await bcrypt.hash(userInfo.password, SALT);
    userInfo.password = hashedPassword;
    const valueString = Object.keys(userInfo).map(
      (key, index) => `$${ index+1 }`
    ).join(', ');

  const keyString = Object.keys(userInfo).map(
      (key) => `"${ key }"`
    ).join(', ');

    const {rows: [newUser]} = await pool.query(`
      INSERT INTO users (${keyString})
      VALUES (${valueString})
      RETURNING *;
    `, Object.values(userInfo));

    delete newUser.password;
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {rows: [user]} = await pool.query(`
      SELECT *
      FROM users
      WHERE id = $1;
    `, [id]);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, userInfo) {
  try {
    const valueString = Object.keys(userInfo).map(
      (key, index) => `"${key}" = '${userInfo[key]}'`
    ).join(', ');
    const { rows: [updatedUser] } = await pool.query(`
      UPDATE users
      SET ${valueString}
      WHERE id = $1
      RETURNING *;
    `, [userId]);
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