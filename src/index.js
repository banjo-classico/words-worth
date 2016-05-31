// const $ = require('jquery')
const d3 = require('./d3')
const g = require('./game-centre')


var socket = io()
var players
var users = ['P1', 'P2', 'P3', 'P4']

$('document').ready(function() {

  socket.on('initialise game', function(gameState) {
    $('.login').show()
      $('.title').show()
      $('h2').hide()
      $('#game').hide()
    g.updateGame(gameState)
  })

  $('#enterName').submit(function(e) {
    e.preventDefault()
    if (/[a-z, A-Z, 0-9]/g.test($('#playername').val())) {
      playGame()
      d3.makeGraph($('#player-scores').children().text(), ['','','',''])
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
      var nextTurn = g.changeTurn($('.turn').attr('id').slice(1), players.length)
      $('#p' + g.getPlayerIndex(socket.id, players)).removeClass('turn')
      socket.emit('update state', {class: 'turn', player: nextTurn})
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
      d3.makeGraph(scores, users.slice(0, players.length))
    })

    socket.on('score', function(score) {
      score = Math.floor(score)
      var player = g.getPlayerIndex(socket.id, players)
      console.log("PLAYERID: ", player)
      socket.emit('update state', {score: score, player: player})
    })
  }
})
