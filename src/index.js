const request = require('superagent')
const $ = require('jquery')
const d3 = require('./d3')
//const twitter = require('./twitter')
require('dotenv').config()


$('document').ready(function() {

  $('#sendform').on('click', function() {
    $('#graph').empty()
    var mainWord = $('#main-topic').val()
    var keywords = $('#displaybox').val()
    keywords = keywords.trim().split(" ")
    console.log(mainWord, keywords)
    request
      .post('/compare')
      .send({maintopic: mainWord, keywords: keywords})
      .end(function(err, res) {
        if (err) {
          console.log(err)
        } else {
          var dataArr = res.body.map(function(e) {
            return e.weightedScoring
          })
          d3.makeGraph(dataArr, '#graph', keywords)
        }
      })
    $('#displaybox').val('')
    $('#main-topic').val('')
  })

  $('#tweetform').on('click', function() {
    $('#twitter-graph').empty()
    var mainWord = $('#tweet-search').val()
    request
      .post('/tweets')
      .send({maintopic: mainWord})
      .end(function(err, res) {
        if (err) throw err
        var scores = res.body.result.map(function(e) {
          return e.weightedScoring
        })
        var tags = res.body.hashtags.map(function(e) {
          return e[1].term
        })
        console.log(scores.length)
        d3.makeGraph(scores, '#twitter-graph', tags)
      })
  })

  // $('#tweetform').on('click', function() {
  //   var mainWord = $('#tweet-search').val()
  //   twitter.getHashtags(mainWord, function(err, hashtags) {

  //     request
  //       .post('/compare')
  //       .send({maintopic: mainWord, keywords: hashtags})
  //       .end(function(err, res) {
  //         if (err) {
  //           console.log(err)
  //         } else { 
  //           var hashtagArr = res.body.map(function(e) {
  //             return e.weightedScoring
  //           })
  //           makeGraph(hashtagArr, '#twitter-graph', hashtags)
  //         }
  //       })
  //   })
  // })


  $('#streamform').on('click', function() {
    var mainWord = $('#stream-search').val()
    request
      .post('/stream')
      .send({searchterm: mainWord})
      .end(function(err, res) {
        if (err) throw err
        console.log(res)
      })
  })

  var socket = io.connect()
  window.socket = socket

  socket.on('newGeoCode', function(geoCode) {
    //do something
    console.log(geoCode)
    d3.worldMap.addGeoData(geoCode)
    d3.worldMap()
  })
})