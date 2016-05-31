// const $ = require('jquery')
const d3 = require('./d3')
const g = require('./game-centre')


var socket = io()
var playerNumber
var cPlayers

$('document').ready(function() {

  $('#enterName').submit(function(e) {
    e.preventDefault()
    if (/[a-z, A-Z, 0-9]/g.test($('#playername').val())) {
      playGame()
      d3.makeGraph($('#player-scores').children().text())
    }
  })

  function playGame() {
    console.log("Game is initiated")
    socket.emit('get random')
    var player = $('#playername').val()
    socket.emit('player', player)
    $('.login').hide()
    $('.title').hide()
    $('h2').show()
    $('#game').show()
    socket.on('random word', function(word) {
    $('#random-word').append('<h3>').text(word)
    })


    socket.on('player entry', function(info) {
      players = info.pArray
      var text = 'Player ' + info.pArray.length.toString() + ': ' + info.name
      $('#p' + info.pArray.length).text(text)
      playerNumber = info.pArray.length
      console.log('PLAYER: ', playerNumber)
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

    socket.on('score', function(score) {
      console.log(players, socket.id)
      g.updateScore(score, socket.id, players)
      $('#graph').empty()
      var scores = $('.score').toArray().map(function(e) {
        return e.innerHTML
      })
      d3.makeGraph(scores)
      socket.emit('update', {
        graph: $('svg'),
        scores: $('.score'),
        players: $('.player')
      })
    })

    socket.on('update', function(updateOject) {
      console.log(updateOject)
      $('#result-container').updateOject.graph
      $('#player-scores').updateOject.scores
      $('#player-display').updateOject.players
    })

    socket.on('update scoreboard', function(board) {
      $('#player-scores').append(board)
    })

    socket.on('update graph', function(graph) {
      $('#graph').append(graph)
    })


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
