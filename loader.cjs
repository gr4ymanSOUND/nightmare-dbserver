async function loadApp() {
  try {
    await import('./index.js');
    
  } catch (error) {
    console.error(error)
    throw error;
  }
}

loadApp();