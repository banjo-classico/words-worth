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

// function makeUpdateObject() {
//   console.log('Im in an object')
//   return {
//     graph: $('svg'),
//     scores: $('.score'),
//     players: $('.player')
//   }
// }
function updateGame() {

}


module.exports = {
  checkWord: checkWord,
  updateScore: updateScore,
  // makeUpdateObject: makeUpdateObject
}