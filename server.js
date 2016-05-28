const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const retina = require('./src/retina')
const twitter = require('./src/twitter')
//const geo = require('./src/googlemaps')
const geo = require('./src/geoCoder')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)

const port = process.env.PORT || 3000
app.use(cors())

app.use(bodyParser.json())
app.use(express.static('client'))


app.get('/', function (req, res) {
    res.send('index.html')
})

app.post('/compare', function(req, res) {
  //build object needed for retina
  var terms = retina.buildTerms(req.body.maintopic, req.body.keywords)
  //access retina and retrieve similarity scores
  retina.compareTerms(terms, function(err, resp) {
    //build object for rendering
    res.json(resp)
  })
})

app.post('/tweets', function(req, res) {
  var mainWord = req.body.maintopic
  twitter.getHashtags(mainWord, function(err, hashtags) {
    hashtags = hashtags.filter(function(tag) {
      return tag.toLowerCase() !== mainWord
    })
    var terms = retina.buildTerms(mainWord, hashtags)
    retina.compareTerms(terms, function(err, resp, hashtags) {
      var result = {result: resp, hashtags: hashtags}
      res.json(result)
    })
  })
})

app.post('/stream', function(req, res) {
  var searchterm = req.body.searchterm
  twitter.client.stream('statuses/filter', {track: searchterm}, function(stream) {
    stream.on('data', function(tweet) {
      var location = tweet.user.location
      if (location !== null) {
        console.log(location)
        geo.getGeoCode(location, function(err, geoCode) {
          io.on('connection', function(socket) {
            socket.emit('newGeoCode', geoCode)
          })
          socket.on('disconnect', function(){
            console.log('user disconnected');
          })
        })
      }
      // var received = 'Stream is initiated'
      // res.send(received)
    })

    stream.on('error', function(error) {
      throw error
    })
  })
})


server.listen(port, function () {
  console.log("Word's Worth is now cruising...")
})