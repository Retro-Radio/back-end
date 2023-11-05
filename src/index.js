const express = require('express');
const cors = require('cors');
const youtube = require("./youtubeFunctions.js");
const fs = require('fs');
const app = express();

app.use(cors({origin: `*`}));
app.use(express.json());

PORT= 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post('/youtube', async (req, res) => {
    let link  = req.body.link;
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
    
    res.status(200).json({title: title});
  })

  app.get('/audio-stream', async (req, res) => {
    let { url } = req.query;
    let videoId = url;
    url += ".mp3";
    console.log(url);
    stat = fs.statSync(url);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
    });

    fs.createReadStream(url).pipe(res);
  });


