const request = require('superagent')
const $ = require('jquery')
const func = require('./func')
const makeGraph = require('./graph')
require('dotenv').config()


$('document').ready(function() {

  $('#sendform').on('click', function() {
    var mainWord = $('#main-topic').val()
    var keywords = $('#displaybox').val()
    keywords = keywords.trim().split(" ")
    console.log(mainWord, keywords)
    var terms = func.buildTerms(mainWord, keywords)
    request
      .post('http://api.cortical.io:80/rest/compare/bulk?retina_name=en_associative')
      .send(terms)
      .set('api-key', process.env.RETINA_API_KEY)
      .end(function(err, res) {
        if (err) {
          console.log(err)
        } else {
            makeGraph(res.body, '#graph')
        }
      })
  })

})