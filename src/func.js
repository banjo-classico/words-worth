function buildTerms(mainTerm, keyWords) {
  var label
  //check if main term has more than one word
  if (mainTerm.split(" ").length > 1) {
    //if so then use 'text' in api call
    label = {"text": mainTerm}
  } else {
    //else use 'term' in api call
    label = {"term": mainTerm} }
  var result = keyWords.map(function(word) {
    return [label, {"term": word}]
  })
  return result
}

module.exports = {
  buildTerms: buildTerms
}