const ytdl = require('ytdl-core');

const getTitle = async (url) => {
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    console.log(title);
    return title;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const downloadVideo = async (url) => {
    try {
      title = await getTitle(url);
      console.log(`Downloading video: ${title}`);
      const parsedUrl = new URL(url);
      const searchParams = new URLSearchParams(parsedUrl.search);
      const videoId = searchParams.get("v");
      return new Promise((resolve, reject) => {
        const stream = ytdl(url, { quality: 'highest', filter: 'audioonly'});
        const outputFileName = `${videoId}.mp3`;

        stream.pipe(require('fs').createWriteStream(outputFileName));
    
        stream.on('end', () => {
          console.log(`Video downloaded as ${outputFileName}`);
        resolve(outputFileName);
        })
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

module.exports = { downloadVideo, getTitle };