const express = require('express');

const app = express();

app.use(express.json());

PORT= 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

app.post('/youtube', (req, res) => {
    let link  = req.body.link;
    res.status(200).send('Recieved the youtube link, starting to process');
    console.log(link);
  })