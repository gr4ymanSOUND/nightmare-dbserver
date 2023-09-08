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

async function addVideo({title, description, video_url}) {

  try {
    const [ result ] = await pool.query(`
      INSERT INTO videos (title, description, video_url)
      VALUES (?, ?, ?);
    `, [title, description, video_url]);

    // const newVideoId = result.insertId;
    const allVideos = await getAllVideos();
    return allVideos;
    
  } catch (error) {
    throw error;
  }
}

async function updateVideo() {
  try {
    
  } catch (error) {
    throw error;
  }
}

export {
  getAllVideos,
  addVideo,
  updateVideo
};