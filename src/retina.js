const request = require('superagent')
//const fs = require('fs')
require('dotenv').config()

function compareTerms(terms, callback) {
  request
    .post('http://api.cortical.io:80/rest/compare?retina_name=en_associative')
    .send(terms)
    .set('api-key', process.env.RETINA_API_KEY)
    .end(function(err, res) {
      if (err) {
        console.log(err)
      } else {
        callback(err, res.body)
      }
    })
}

function buildTerms(mainTerm, keyWord) {
  return [{"term": mainTerm}, {"term": keyWord}]
}

// function getRandomWord(callback) {
//   request
//     .get('http://randomword.setgetgo.com/get.php')
//     .end(function(err, res) {
//       if (err) {
//         console.log(err)
//       } else {
//         callback(err, res.body)
//       }
//     })
// }

module.exports = {
  compareTerms: compareTerms,
  buildTerms: buildTerms,
  // getRandomWord: getRandomWord
}