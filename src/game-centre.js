var playerScores = {
  '1': 0, 
  '2': 0, 
  '3': 0, 
  '4': 0
}

var usedWords = []

function checkWord(word) {
  if (usedWords.length === 0) {
    usedWords.push(word)
    return true
  }
  else if (/[a-z, A-Z]/g.test(word) && usedWords.indexOf(word.toLowerCase()) == -1) {
    usedWords.push(word)
    return true
  } else {
    return false
  }
}

function updateScore(score, player) {
  score = Math.floor(score)
  console.log(score)
  var playerScore = parseInt($('#player-score').text(), 10)
  playerScore += score
  $('#player-score').append('<p>').text(playerScore)
  playerScores[player] = playerScore
}

function getCurrentScores() {
  console.log(playerScores)
  var scores = Object.keys(playerScores).map(function(key) {
    return playerScores[key]
  })
  return scores

}



module.exports = {
  checkWord: checkWord,
  updateScore: updateScore,
  getCurrentScores: getCurrentScores
}