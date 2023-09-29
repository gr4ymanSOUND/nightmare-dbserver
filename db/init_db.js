import { pool } from './connectionpool.js'

import { createUser } from './models/users.js';
import { addVideo } from './models/videos.js';

async function buildTables() {
  try {
    await pool.query(`
      USE nightmare_harvester;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS videos;
    `);
    await pool.query(`
      DROP TABLE IF EXISTS users;
    `);

    await pool.query(`
      CREATE TABLE users (
        id integer PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL, 
        username VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) UNIQUE NOT NULL,
        allow_email BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        status VARCHAR(255) NOT NULL DEFAULT 'active',
        created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE videos (
        id integer PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR(255) UNIQUE NOT NULL,
        video_url VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT 'hidden',
        created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

  } catch (error) {
    throw error;
  }
}

async function addInitialData () {

    const usersToCreate = [
      { email:'austin.lawrence.al@gmail.com', username:'coolhatguy', password:'ochocinco', allow_email: true, status: 'active', is_admin: true },
      { email:'testing@test.test', username:'CultLeaderDerek', password:'l34dER', allow_email: false, status: 'active', is_admin: true}
    ];

    console.log("creating users");
    const [users] = await Promise.all(usersToCreate.map(createUser));
    console.log('result of creating users', users);
    console.log("finished creating users!!");

    const videoToCreate = {
      title: 'Test Video',
      description: 'This is a test video in the database initialization',
      video_url: 'https://www.youtube-nocookie.com/embed/o9yIgEzZvVY',
      status: 'supporter'
    };

    console.log("creating first video");
    const newVideo = await addVideo(videoToCreate);
    console.log('result of creating new video', newVideo);
    console.log("finished creating first video!!");
}


buildTables()
  .then(addInitialData)
  .catch(console.error)
