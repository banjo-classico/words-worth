require('dotenv').config()
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

function getHashtags(word, callback) {
  //create term for query
  var tag = '#' + word
  //access twitter api with term
  client.get('search/tweets.json', {q: tag, lang: 'en'}, function(error, tweets, response) {
    if(error) {
      console.log("There was an error: ", error)
    } else {
      var tagsArr = extractTags(tweets)
      callback(error, tagsArr)
    }
  })
}

function extractTags(tweets) {
  var tagsArr = tweets.statuses.map(function(e) {
        //map through hashtag arrays to access the text of each tag
        return e.entities.hashtags.map(function (hashtag) {
          return hashtag.text
        })
      })
  tagsArr = tagsArr.reduce(function(a, b) {
    return a.concat(b)})
    .reduce(function(a, b){
      if(a.indexOf(b)<0) {
        a.push(b)
      }
      return a},[])

  return tagsArr.map(function(tag) {
    return tag.split(/(?=[A-Z])/).join(" ")
  })
}
//tweets.statuses.entities.hashtags then array of objects with .text as tag

module.exports = {
  getHashtags: getHashtags
}