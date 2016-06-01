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
      socket.emit('score', Math.floor(resp.weightedScoring))
    })
  })

  socket.on('non-word', function(score) {
    socket.emit('score', score)
    console.log('not a valid word')
  })

  socket.on('update state', function(data) {
    g.updateGameState(data, gameState, players.length)
    io.emit('update game', gameState)
    console.log('state updated')
  })

  socket.on('disconnect', function() {
    newplayers = g.removePlayer(socket.id, players)
    players = newplayers
    io.emit('player exit', players, socket.id)
    console.log('a user disconnected')
  })
})

http.listen(port, function() {
  console.log("Word's Worth is now cruising on the interwebs")
})