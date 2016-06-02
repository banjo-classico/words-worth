// const $ = require('jquery')
const d3 = require('./d3')
const g = require('./game-centre')


var socket = io()
var players = []
var users = ['P1', 'P2', 'P3', 'P4']

$('document').ready(function() {

  socket.on('initialise game', function(gameState) {
    $('.login').show()
      $('.title').show()
      $('h2').hide()
      $('#game').hide()
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
      $('#' + players.length).text(0)
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
      //toggle turn highlighter
      var nextTurn = g.changeTurn($('.turn').attr('id').slice(1), players.length)
      socket.emit('update state', {turn: 'turn', player: nextTurn})
      //g.startTimer(10, $('#timer'))
    })

    socket.on('player word', function(word){
      $('#used-words').append($('<li>').text(word))
    })

    socket.on('update game', function(gameState) {
      g.updateGame(gameState, players.length)
      var scores = $('.score').toArray().map(function(e) {
        return e.innerHTML.slice(-2)
      })
      console.log("Game updated")
      $('#graph').empty()
      d3.makeGraph(scores, users.slice(0, players.length))
      var winningPlayerPosition = g.checkForWin(scores)
      console.log("WIN: ", winningPlayerPosition)
      if(winningPlayerPosition) {
        socket.emit('winner', winningPlayerPosition)
      } 
    })

    socket.on('score', function(score) {
      var player = g.getPlayerIndex(socket.id, players)
      console.log("PLAYERID: ", player)
      socket.emit('update state', {score: score, player: player})
    })

    socket.on('game over', function(playerPosition) {
      var winner = $('#p' + playerPosition).text().slice(10)
      $('#winner').text(winner + ' wins!!')
      $('#game-over').show()
    })

    $('#play-again').click(function() {
      $('#used-words').empty('li')
      $('#game-over').hide()
      socket.emit('new game')
    })

    // socket.on('player exit', function(array, id) {
    //   var player = g.getPlayerIndex(id.slice(2), players)
    //   $('#p' + player).remove()
    //   players = array
    // })
  }
})
