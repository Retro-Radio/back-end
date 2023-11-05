const express = require('express');
const cors = require('cors');
const youtube = require("./youtubeFunctions.js");
const fs = require('fs');
const app = express();
var {spawn} = require('child_process')

app.use(cors({origin: `*`}));
app.use(express.json());

PORT= 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post('/youtube', async (req, res) => {
    let link  = req.body.link;
    let distortion = req.body.distortion;
    if(distortion == null) {
        distortion = 3;
    }
    const parsedUrl = new URL(link);
    const searchParams = new URLSearchParams(parsedUrl.search);
    const videoId = searchParams.get("v");
    console.log(link);
    let title = await youtube.getTitle(link);
    if (title == null) {
        res.status(400).json({error: "Invalid Link"});
        return;
    }
    path = await youtube.downloadVideo(link);
    console.log("Path: " + path);
    const outputFilePath = `distorted_${distortion}_${videoId}.mp3`;
    
    if (fs.existsSync(outputFilePath)) {
        // If the output file already exists, just send the response with the title
        res.status(200).json({ title: title });
        return;
    }
    if(distortion == 0) {
        fs.copyFileSync(path, outputFilePath);
        res.status(200).json({ title: title });
        fs.rmSync(path);
        return;
    }
    path = await youtube.downloadVideo(link);
    console.log("Path: " + path);
    const inputFilePath = `${path}`;
    
    const ffmpegCommand = `-i ${inputFilePath} -af "acrusher=level_in=${distortion}:level_out=16:bits=8:mode=log:aa=0.7:1" ${outputFilePath}`;
    const ffmpegProcess = spawn("ffmpeg", ffmpegCommand.split(" "), { shell: true });

    ffmpegProcess.on('error', (error) => {
        console.log("ffmpeg error: " + error);
    });

    ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Audio distortion complete.');
          // Now, you can send a response to your client.
          res.status(200).json({ title: title });
          fs.rmSync(inputFilePath);
        } else {
          console.error('Error running ffmpeg.');
        }
    });
  })

  app.get('/audio-stream', async (req, res) => {
    let { url, distortion } = req.query;
    let videoId = url;
    if(distortion == null) {
        distortion = 3;
    }
    url = "distorted_" + distortion + '_' + url + ".mp3";
    console.log(url);
    // Check if the file exists
    if (!fs.existsSync(url)) {
        res.status(400).json({error: "Invalid Link"});
        return;
    }
    stat = fs.statSync(url);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
    });

    fs.createReadStream(url).pipe(res);
  });


