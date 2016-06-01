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

// function updateScore(score, playerId, array) {
//   score = Math.floor(score)
//   var id = getPlayerIndex(playerId, array)
//   scoreDiv = $('#' + id)
//   var playerScore = parseInt(scoreDiv.text(), 10)
//   playerScore += score
//   scoreDiv.empty()
//   scoreDiv.text(playerScore)

// }

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
    turn: {1: 'turn', 2: '', 3: '', 4: ''},
    hide: {1: 'hide', 2: 'hide', 3: 'hide', 4: 'hide'} 
  }
}



function updateGame(gameState, num) {
  for (var i = 1; i <= num ; i++) {
    $('#p' + i).text(gameState.players[i])
    $('#' + i).text(gameState.scores[i])
    if ($('#p' + i).hasClass('turn')) {
      $('#p' + i).removeClass('turn')
    }
    $('#p' + i).addClass(gameState.turn[i])
  }
}

function updateGameState(data, gameState, num){
  console.log("PLAYERS: ", num)
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

function removePlayer(id, array) {
  var index = array.indexOf(id)
  if (index > -1) {
    var removed = array.splice(index, 1)
    return array
  }
}

module.exports = {
  checkWord: checkWord,
  //updateScore: updateScore,
  getPlayerIndex: getPlayerIndex,
  initialiseGameObj: initialiseGameObj,
  updateGame: updateGame,
  updateGameState: updateGameState,
  changeTurn: changeTurn, 
  removePlayer: removePlayer
  // makeUpdateObject: makeUpdateObject
}