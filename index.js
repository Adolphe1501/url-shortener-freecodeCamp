require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require("body-parser");
var urls = {};

// Basic Configuration
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//redirect short url
app.get('/api/shorturl/:shorturl', function(req, res) {
  res.statusCode = 302;
  res.setHeader("Location", urls[req.params.shorturl]);
  res.end();
});

// post url and send back url and short url
function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}
app.post('/api/shorturl', function(req, res) {
  if(isValidHttpUrl(req.body.url))
  {
    console.log(Object.keys(urls).length);
    urls[Object.keys(urls).length]=req.body.url;
    console.log(urls);
    res.json({ original_url: req.body.url , short_url: Object.keys(urls).length-1 });
  }
  else
    res.json({error :'invalid url' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
