// This is the Web Server
// require("dotenv").config()
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const server = express();

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
import cors from 'cors';
// const cors = require('cors');
server.use(cors());

// create logs for everything
// const morgan = require('morgan');
import morgan from 'morgan';
server.use(morgan('dev'));

// handle application/json requests
server.use(express.json());

// here's our static files
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));

// here's our API
// server.use('/api', require('./api'));
import { apiRouter } from './api/index.js';
server.use('/api', apiRouter);

// connect to the server
const PORT = process.env.PORT || 4000;

// define a server handle to close open tcp connection after unit tests have run
const handle = server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);
});


