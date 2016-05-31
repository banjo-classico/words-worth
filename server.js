//========================== NEW VERSION ========================>

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const retina = require('./src/retina')
const g = require('./src/game-centre')
//const wordnik = require('wordnik-bb').init(process.env.)
const cors = require('cors')

const port = process.env.PORT || 3000
app.use(cors())
app.use(express.static('client'))

app.get('/', function(req, res) {
  res.sendfile(__dir + '/index.html')
})


var players = []
var playername = ''
var gameState = g.initialiseGameObj()

io.on('connection', function(socket) {

  console.log('Player connected')
  socket.emit('initialise game', gameState)

  socket.on('player', function(player) {
    players.push(socket.id)
    var playerNumber = players.length
    console.log(players)
    playername = player
    io.emit('player entry', {name: player, pArray: players})
  })

  var randomWord = 'penguin'
  // socket.on('get random', function() {
  //   randomWord = retina.getRandomWord(function(err, res) {
  //     if (err) console.log(err)
  //     else {
  //       console.log("RANDOM: ", res)
  //       socket.emit('random word', res)
  //     }
  //   })
  // })

  socket.on('player word', function(word) {
    socket.broadcast.emit('player word', word)
    retina.compareTerms([{"term": randomWord}, {"term": word}], function(err, resp) {
      console.log(resp.weightedScoring)
      socket.emit('score', resp.weightedScoring)
    })
  })

  socket.on('non-word', function(score) {
    socket.emit('score', score)
    console.log('not a valid word')
  })

  socket.on('update state', function(data) {
    g.updateGameState(data, gameState)
    io.emit('update game', gameState)
    console.log('state updated')
  })

  socket.on('disconnect', function() {
    io.emit('player exit', playername)
    console.log('a user disconnected')
  })
})

http.listen(port, function() {
  console.log("Word's Worth is now cruising on the interwebs")
})

//========================= OLD VERSION ===========================>

// const express = require('express')
// const app = express()
// const http = require('http').Server(app)
// const io = require('socket.io')(http)
// const bodyParser = require('body-parser')
// const retina = require('./src/retina')
// const twitter = require('./src/twitter')
// //const geo = require('./src/googlemaps')
// const geo = require('./src/geoCoder')
// const cors = require('cors')


// const port = process.env.PORT || 3000
// app.use(cors())

// app.use(bodyParser.json())
// app.use(express.static('client'))


// app.get('/old-version', function (req, res) {
//     res.sendfile(__dir + 'index.html')
// })

// app.post('/compare', function(req, res) {
//   //build object needed for retina
//   var terms = retina.buildTerms(req.body.maintopic, req.body.keywords)
//   //access retina and retrieve similarity scores
//   retina.compareTerms(terms, function(err, resp) {
//     //build object for rendering
//     res.json(resp)
//   })
// })

// app.post('/tweets', function(req, res) {
//   var mainWord = req.body.maintopic
//   twitter.getHashtags(mainWord, function(err, hashtags) {
//     hashtags = hashtags.filter(function(tag) {
//       return tag.toLowerCase() !== mainWord
//     })
//     var terms = retina.buildTerms(mainWord, hashtags)
//     retina.compareTerms(terms, function(err, resp, hashtags) {
//       var result = {result: resp, hashtags: hashtags}
//       res.json(result)
//     })
//   })
// })

// io.on('connection', function(socket) {
//   socket.on('twitter-stream', function(word) {
//     word = '#' + word
//     console.log(word)
//     twitter.client.stream('statuses/filter', {track: word}, function(stream) {
//       stream.on('data', function(tweet) {
//         var location = tweet.user.location
//         if (location !== null) {
//           console.log(location)
//           geo.getGeoCode(location, function(err, geoCode) {
//             socket.emit('geoCode', geoCode)
//           })
//         }
//       })
//       stream.on('error', function(error) {
//         throw error
//       })
//     })
//   })
// })

// http.listen(port, function () {
//   console.log("Word's Worth is now cruising...")
// })
