const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getUserById } = require('../db/models/users');

// this middleware checks the "Authorization" header passed to the route and gets user object if the token is verified
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {

      const { id } = jwt.verify(token, JWT_SECRET);

      if(id) {
        req.user = await getUserById(id);
        next();
      }

    } catch (error) {
      next(error);
    }
  } else {
      next({
          name: 'AuthorizationHeaderError',
          message: `Authoriztion token must start with ${ prefix }`
      });
  }
});


// API routers

const userRouter = require('./users');
apiRouter.use('/users', userRouter);



export { apiRouter} ;