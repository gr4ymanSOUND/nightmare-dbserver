import express from 'express';
const videoRouter = express.Router();
import { requireUser } from './utils.js'
import jwt from 'jsonwebtoken';

import {
  getAllVideos,
  getVideoById,
  addVideo,
  updateVideo
} from '../db/models/videos.js';


// basic video API route for all visitors to the site
videoRouter.get('/', async (req, res, next) => {
  try {
    const allVideos = await getAllVideos();
    res.send(allVideos)
  } catch (error) {
    next(error);
  }
});

videoRouter.post('/create', async (req, res, next) => {  
  const prefix = 'Bearer ';

  try {
    const auth = req.headers.authorization;
    const token = auth.slice(prefix.length);
    let authorizedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (authorizedUser.username) {
      const { newVideoInfo } = req.body;
      const newVideo = await addVideo(newVideoInfo);
      res.send(newVideo);
    } else {
      throw new Error('The server ran into an issue creating the video due to missing authorization.');
    }
  } catch (error) {
    next(error);
  }
});

videoRouter.patch('/:videoId', requireUser, async (req, res, next) => {
  const prefix = 'Bearer ';

  try {
    const { videoId } = req.params;
    const auth = req.headers.authorization;
    const token = auth.slice(prefix.length);
    let authorizedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (authorizedUser.username) {
      const { videoInfo } = req.body;
      const updatedVideo = await updateVideo(videoId, videoInfo);
      res.send(updatedVideo);
    } else {
      throw new Error('The server ran into an issue updating the video due to missing authorization.');
    }
  } catch (error) {
    next(error);
  }

});



export { videoRouter };