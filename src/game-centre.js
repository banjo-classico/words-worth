var playerScores = {'player1': 0, 'player2': 0, 'player3': 0, 'player4': 0}
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

function updateScore(score) {
  score = Math.floor(score)
  console.log(score)
  var playerScore = parseInt($('#player-score').text(), 10)
  playerScore += score
  $('#player-score').append('<p>').text(playerScore)
}



module.exports = {
  checkWord: checkWord,
  updateScore: updateScore
}