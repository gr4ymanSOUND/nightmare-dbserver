// This is the Web Server
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config.js';
import express from 'express';
const server = express();

// require("dotenv").config()
// const express = require('express');
// const server = express();

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
import cors from 'cors';
// const cors = require('cors');
server.use(cors());

// create logs for everything
import morgan from 'morgan';
// const morgan = require('morgan');
server.use(morgan('dev'));

// handle application/json requests
server.use(express.json());

// here's our static files
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.join(__dirname, 'build')));

// const path = require('path');
// server.use(express.static(path.join(__dirname, 'build')));

// here's our API
import { apiRouter } from './api/index.js';
// const apiRouter = require('./api/index.js')
// let testmodule;
// const loadRouter = async () => {
//   testmodule = await import('./api/index.js');
// }

// console.log('api router module', apiRouter);
server.use('/api', apiRouter);

// connect to the server
const PORT = process.env.PORT || 4000;

// open the server

if (process.env.NODE_ENV == 'development') {
  server.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}!`);
  });
} else {
  server.listen();
}


