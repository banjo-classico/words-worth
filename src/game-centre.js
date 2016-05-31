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

function updateScore(score, playerId, array) {
  score = Math.floor(score)
  var id = getPlayerIndex(playerId, array)
  scoreDiv = $('#' + id)
  var playerScore = parseInt(scoreDiv.text(), 10)
  playerScore += score
  scoreDiv.empty()
  scoreDiv.text(playerScore)

}

function getPlayerIndex(id, array) {
  id = "/#" + id
  console.log(id)
  return array.indexOf(id) + 1
}

function initialiseGameObj() {
  return gameObj = {
    players: {
      1: '', 2: '', 3: '', 4: ''
    },
    scores: {
      1: 0, 2: 0, 3: 0, 4: 0
    }, 
    graph: ''
  }
}

function updateGame(gameState) {
  for (var i = 1; i < 5; i++) {
    $('#p' + i).text(gameState.players[i])
    $('#' + i).text(gameState.scores[i])
  }
  // $('#graph').append()
}

function updateGameState(data, gameState){
  switch (Object.keys(data)[0]) {
    case 'player': 
      gameState.players[data.player] = data.text
      break
    case 'score':
      gameState.scores[data.player] = data.score
      break
    case 'graph':
      gameState.graph = data.graph
  }
}

module.exports = {
  checkWord: checkWord,
  updateScore: updateScore,
  getPlayerIndex: getPlayerIndex,
  initialiseGameObj: initialiseGameObj,
  updateGame: updateGame,
  updateGameState: updateGameState
  // makeUpdateObject: makeUpdateObject
}