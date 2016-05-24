const request = require('superagent')
//const fs = require('fs')
require('dotenv').config()

function compareTerms(terms, callback) {
  request
    .post('http://api.cortical.io:80/rest/compare/bulk?retina_name=en_associative')
    .send(terms)
    .set('api-key', process.env.RETINA_API_KEY)
    .end(function(err, res) {
      if (err) {
        console.log(err)
      } else {
        callback(err, res.body, terms)
      }
    })
}

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

// function buildTextTerms(main, texts) {
//   var label
//   //check if main has more than one word
//   if (main.split(" ").length > 1) {
//     //if so then use text in api call
//     label = {"text": main}
//   } else {
//     //else use term in api call
//     label = {"term": main} }
//   var result = texts.map(function(text) {
//     return [label, {"text": text.text}]
//   })
//   return result
// }


// function compareElements(elements, callback) {
//   request
//     .post('http://api.cortical.io:80/rest/compare?retina_name=en_associative')
//     .send(elements)
//     .set('api-key', '85d59480-1a33-11e6-a057-97f4c970893c')
//     .end(function(err, res) {
//       if (err) {
//         console.log(err)
//       } else {
//         callback(err, res.body)
//       }
//     })
// }

// function readTexts (path, callback) {
//   fs.readFile(path, 'utf8', function(err, data) {
//     callback(err, JSON.parse(data))
//   })
// }

module.exports = {
  compareTerms: compareTerms,
  buildTerms: buildTerms
  // readTexts: readTexts,
  // buildTextTerms: buildTextTerms
}