const express = require('express')
const bodyParser = require('body-parser')
const retina = require('./src/retina')
const twitter = require('./src/twitter')
//const geo = require('./src/googlemaps')
const geocoder = require('geocoder')
const cors = require('cors')

var app = express()
var port = process.env.PORT || 3000
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
      geocoder.geocode(location, function(err, data) {
        if (data.results[0] !== undefined) {
          var latLng = data.results[0].geometry.location
        console.log("DATA: ", data.results[0].geometry.location)
        //res.json(latLng)
        }
      })
    }
  })

  stream.on('error', function(error) {
    throw error
  })
})
})


app.listen(port, function () {
  console.log("Word's Worth is now cruising on 3000")
})