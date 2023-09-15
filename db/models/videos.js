import { pool } from '../connectionpool.js'

async function getAllVideos() {
  try {
    const [ allVideos ] = await pool.query(`
        SELECT * FROM videos;
      `);
      return allVideos;
  } catch (error) {
    throw error;
  }
}

async function getVideoById(videoId) {
  try {
    const [ video ] = await pool.query(`
        SELECT * FROM videos
        WHERE id = ?
      `, [videoId]);

    const videoDestructured = video[0];
    return videoDestructured;

  } catch (error) {
    throw error;
  }
}

async function addVideo(newVideoData) {
  const {title, description, video_url} = newVideoData;
  
  try {
    const [ result ] = await pool.query(`
      INSERT INTO videos (title, description, video_url)
      VALUES (?, ?, ?);
    `, [title, description, video_url]);

    const newVideoId = result.insertId;
    const newVideo = await getVideoById(newVideoId);
    return newVideo;
    
  } catch (error) {
    throw error;
  }
}

async function updateVideo(videoId, videoInfo) {
  try {
    const {title, description, video_url} = videoInfo;

    const [ results ] = await pool.query(`
      UPDATE videos
      SET title = ?, description = ?, video_url = ?
      WHERE id = ?;
    `, [title, description, video_url, videoId]);

    const updatedVideo = await getVideoById(videoId);
    return updatedVideo;
  } catch (error) {
    throw error;
  }
}

export {
  getAllVideos,
  getVideoById,
  addVideo,
  updateVideo
};