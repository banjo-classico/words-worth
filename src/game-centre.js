function startTimer(duration, display) {
  var timer = duration
  var countdown = setInterval(function () {
    seconds = parseInt(timer % 60, 10)
    if(seconds % 2 === 0) {
      display.text(seconds)
    } // separate function
    if (--timer < 0) {
      clearInterval(countdown)
    } // separate function
  }, 500)
}

function checkWord(word, usedWords) {
  if (usedWords.length === 0) {
    return true
  }
  else if (/[a-z, A-Z]/g.test(word) && usedWords.indexOf(word.toLowerCase()) == -1) {
    return true
  } else {
    return false
  }
}

function getPlayerIndex(id, array) {
  id = "/#" + id
  return array.indexOf(id) + 1
}

function changeTurn(prev, length) {
  var nextTurn
  prev = parseInt(prev)
  if (prev < length) {
    nextTurn = prev + 1
  } else {
    nextTurn = prev - (length-1)
  }
  return nextTurn
}

function initialiseGameObj() {
  return gameObj = {
    players: {
      1: '', 2: '', 3: '', 4: ''
    },
    scores: {
      1: 0, 2: 0, 3: 0, 4: 0
    },
    turn: {1: 'turn', 2: '', 3: '', 4: ''}
  }
}

function updateGame(gameState, num) {
  for (var i = 1; i <= num ; i++) {
    $('#p' + i).text(gameState.players[i])
    $('#' + i).text(gameState.players[i].slice(10) + ': ' + gameState.scores[i])
    if ($('#p' + i).hasClass('turn')) {
      $('#p' + i).removeClass('turn')
    }
    $('#p' + i).addClass(gameState.turn[i])
  }
}

function updateGameState(data, gameState, num){
  switch (Object.keys(data)[0]) {
    case 'player':
      gameState.players[data.player] = data.text
      break
    case 'score':
      gameState.scores[data.player] += data.score
      break
    case 'turn':
      gameState.turn[data.player] = data.turn
      if (data.player === 1) {
        gameState.turn[num] = ''
      } else {
        gameState.turn[data.player - 1] = ''
      }
      break
  }
}

function checkForWin(scores) {
  winningScore = scores.filter(function (score) {
            return score > 79
            })

  if (winningScore.length === 1) {
    console.log("SCORES: ", scores)
    console.log('winning score: ', winningScore)
    return scores.indexOf(winningScore[0]) + 1
  } else {
    return null
  }
}

function removePlayer(id, array) {
  var index = array.indexOf(id)
  if (index > -1) {
    var removed = array.splice(index, 1)
    return array
  }
}

function resetGameState(gameState) {
  for (var i = 1; i < 5; i++) {
    gameState.scores[i] = 0
    if (i === 1) {
      gameState.turn[i] = 'turn'
    } else {
      gameState.turn[i] = ''
    }
  }
  return gameState
}

module.exports = {
  startTimer: startTimer,
  checkWord: checkWord,
  getPlayerIndex: getPlayerIndex,
  initialiseGameObj: initialiseGameObj,
  updateGame: updateGame,
  updateGameState: updateGameState,
  changeTurn: changeTurn,
  checkForWin: checkForWin,
  removePlayer: removePlayer,
  resetGameState: resetGameState
}