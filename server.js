const express = require('express')
const bodyParser = require('body-parser')
const retina = require('./src/retina')
const twitter = require('./src/twitter')
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
    var terms = retina.buildTerms(mainWord, hashtags)
    retina.compareTerms(terms, function(err, resp, hashtags) {
      var result = {result: resp, hashtags: hashtags}
      res.json(result)
    })
  })
})


app.listen(port, function () {
  console.log("Word's Worth is now cruising on 3000")
})