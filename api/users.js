import express from 'express';
const userRouter = express.Router();
import { requireUser } from './utils.js'
import jwt from 'jsonwebtoken';

// this isn't working for some reason, so I replaced all of the "secret" variables with the full thing
// const secret = process.env.JWT_SECRET;

import {
    getUser,
    getUserById,
    getAllUsers,
    updateUser,
    createUser,
    resetPassword
} from '../db/models/users.js';

// get a list of all users -- used for the admins
userRouter.get('/', requireUser, async (req, res, next) => {
  const prefix = 'Bearer ';
  try {
    const auth = req.headers.authorization;
    const token = auth.slice(prefix.length);
    let authorizedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (authorizedUser.username) {
      const allUsers = await getAllUsers();
      res.send(allUsers)
    } else {
      throw new Error('error getting all user info');
    }
  } catch (error) {
    next(error);
  }
});

// create new users from the user form
userRouter.post('/create', async (req, res, next) => {  
  try {
    const { newUserData }  = req.body;
    const newUser = await createUser(newUserData);
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

// log in existing users
userRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getUser({username, password});

    const token = jwt.sign({username: user.username, id: user.id}, process.env.JWT_SECRET)

    const confirmation = {
      message: "you're logged in!",
      token: token,
      user: user
    }
    res.send(confirmation);
  } catch (error) {
    next(error);
  }
});

// used to pull the user info for already logged in users
// if they have a token in localstorage, this will get called every time the app loads
userRouter.get('/me', requireUser, async (req, res, next) => {
    const prefix = 'Bearer ';
    try {
      const auth = req.headers.authorization;
      const token = auth.slice(prefix.length);
      
      let authorizedUser = jwt.verify(token, process.env.JWT_SECRET);
      if (authorizedUser.username) {
        const me = await getUserById(authorizedUser.id);
        res.send(me)
      } else {
        throw new Error('error getting user info');
      }
    } catch (error) {
      next(error);
    }
});

// update user accounts
userRouter.patch('/:userId', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newUserData = req.body;
    const updatedUser = await updateUser(userId, newUserData);
    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).send(`There was a problem updating your account. Please check all fields and try again \n (hint: your old password may not be correct)`);
  }

});

// reset user passwords
userRouter.patch('/reset/:userId', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { basePassword } = req.body;
    const resettingPassword = await resetPassword(userId, basePassword);
    res.send(resettingPassword);
  } catch (error) {
    console.error(error);
  }
});

// doesn't actually delete a user, but updates their status to be inactive instead
userRouter.delete('/:userId', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newUserData = {allow_email: false, status: 'inactive'}
    const deletedUser = await updateUser(userId, newUserData);
    res.send(deletedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
})


export { userRouter };