// const $ = require('jquery')
const d3 = require('./d3')
const g = require('./game-centre')


var socket = io()
var playerNumber
var players

$('document').ready(function() {

  socket.on('initialise game', function(gameState) {
    g.updateGame(gameState)
  })

  $('#enterName').submit(function(e) {
    e.preventDefault()
    if (/[a-z, A-Z, 0-9]/g.test($('#playername').val())) {
      playGame()
      d3.makeGraph($('#player-scores').children().text())
      $('.login').hide()
      $('.title').hide()
      $('h2').show()
      $('#game').show()
    }
  })

  function playGame() {
    console.log("Game is initiated")
    socket.emit('get random')
    var player = $('#playername').val()

    socket.emit('player', player)

    socket.on('random word', function(word) {
      $('#random-word').text(word)
    })

    socket.on('player entry', function(data) {
      players = data.pArray
      var text = 'Player ' + players.length.toString() + ': ' + data.name
      $('#p' + players.length).text(text)
      playerNumber = players.length
      console.log('PLAYER: ', playerNumber)
      socket.emit('update state', {player: players.length, text: text})
    })

    $('#attempt').submit(function(e) {
      e.preventDefault()
      var playerWord = $('#player-word').val()
      var usedWords = $('#used-words').children().text()  
      if (g.checkWord(playerWord, usedWords)) {
        $('#used-words').append($('<li>').text(playerWord))
        socket.emit('player word', playerWord)
      } else {
        socket.emit('non-word', 0)
      }
      $('#player-word').val('')
    })

    socket.on('player word', function(word){
      $('#used-words').append($('<li>').text(word))
    })

    socket.on('update game', function(gameState) {
      g.updateGame(gameState)
      var scores = $('.score').toArray().map(function(e) {
        return e.innerHTML
      })
      console.log('Im here!!')
      $('#graph').empty()
      d3.makeGraph(scores)
    })

    socket.on('score', function(score) {
      score = Math.floor(score)
      var player = g.getPlayerIndex(socket.id, players)
      console.log("PLAYERID: ", player)
      socket.emit('update state', {score: score, player: player})
    })

    // socket.on('update', function(updateObj) {
    //   console.log("UPDATEOBJ: ", updateObj)
    //   $('#result-container').replaceWith(updateObj.graph)
    //   $('#player-scores').replaceWith(updateObj.scores)
    //   $('#player-display').replaceWith(updateObj.players)
    // })

    // socket.on('update scoreboard', function(board) {
    //   $('#player-scores').append(board)
    // })

    // socket.on('update graph', function(graph) {
    //   $('#graph').append(graph)
    // })


  }
})

//======================== OLD VERSION ========================>

// const request = require('superagent')
// const $ = require('jquery')
// const d3 = require('./d3')
// const twitter = require('./twitter')
// require('dotenv').config()


// $('document').ready(function() {
//   d3.worldMap()

//   $('#sendform').on('click', function() {
//     $('#graph').empty()
//     var mainWord = $('#main-topic').val()
//     var keywords = $('#displaybox').val()
//     keywords = keywords.trim().split(" ")
//     console.log(mainWord, keywords)
//     request
//       .post('/compare')
//       .send({maintopic: mainWord, keywords: keywords})
//       .end(function(err, res) {
//         if (err) {
//           console.log(err)
//         } else {
//           var dataArr = res.body.map(function(e) {
//             return e.weightedScoring
//           })
//           d3.makeGraph(dataArr, '#graph', keywords)
//         }
//       })
//     $('#displaybox').val('')
//     $('#main-topic').val('')
//   })

//   $('#tweetform').on('click', function() {
//     $('#twitter-graph').empty()
//     var mainWord = $('#tweet-search').val()
//     request
//       .post('/tweets')
//       .send({maintopic: mainWord})
//       .end(function(err, res) {
//         if (err) throw err
//         var scores = res.body.result.map(function(e) {
//           return e.weightedScoring
//         })
//         var tags = res.body.hashtags.map(function(e) {
//           return e[1].term
//         })
//         console.log(scores.length)
//         d3.makeGraph(scores, '#twitter-graph', tags)
//       })
//   })

//   var socket = io()
//   $('#stream-search').submit(function(e) {
//     e.preventDefault()
//     socket.emit('twitter-stream', $('#streamtopic').val())
//   })

//   socket.on('geoCode', function(geoCode) {
//     console.log(geoCode.lat, geoCode.lng)
//     $('#test-text').text(geoCode.lat)
//     d3.addGeoData(geoCode)
//   })
// })
