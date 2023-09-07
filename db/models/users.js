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

    // this is required because I was unable to destructure 2 layers into the nested arrays to access the actual user object like I did in the "getUser" function above
    // this should be functionally equivalient to doing "const [[user]]" in the pool.query
    const userDestructured = user[0];


    delete userDestructured.password;
    return userDestructured;
  } catch (error) {
    throw error;
  }
}

async function createUser(userInfo) {
  
  try {
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
    const newUser = await getUserById(newUserId);
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, userInfo) {
  try {
    if (userInfo.oldPassword) {
      console.log('trying to update user password');
      const hashedOldPassword = await bcrypt.hash(userInfo.oldPassword, SALT);
      const passwordMatch = await bcrypt.compare(hashedOldPassword, userInfo.oldPassword);
      console.log('password match result', passwordMatch);
      if (!passwordMatch) throw Error('Your old password is incorrect! Please try again.');
      // remove the old password after comparing to make sure updating is allowed
    }
    delete userInfo.oldPassword;
    
    const valueString = Object.keys(userInfo).map(
      (key, index) => {
        // special case for the allow_email field - since it's boolean, we need to remove the quotes from the 2nd half of the entry
        if (key == 'allow_email') {
          return `${key} = ${userInfo[key]}`
        }
        return `${key} = '${userInfo[key]}'`
      }
    ).join(', ');
    const [ results ] = await pool.query(`
      UPDATE users
      SET ${valueString}
      WHERE id = ?;
    `, [userId]);

    const updatedUser = await getUserById(userId);
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