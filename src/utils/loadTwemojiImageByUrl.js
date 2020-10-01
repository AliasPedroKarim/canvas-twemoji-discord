const { loadImage } = require('canvas');

const cachedTwemojiImages = new Map();

module.exports =  async function loadTwemojiImageByUrl (url) {
  return new Promise(async (res, rej) => {
    if (cachedTwemojiImages.has(url)) {
      return res(cachedTwemojiImages.get(url));
    }

    try {
      let image = await loadImage(url);
      if (!url.includes("discord")) cachedTwemojiImages.set(url, image);
      res(image);
    } catch (e) {
      console.error(`An error occurred while loading the image, error: `, e);
      res(null);
    }
  });
};