require('dotenv').config()
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})


var stream = client.stream('statuses/filter', {track: searchterm})

stream.on('data', function(tweet) {
  console.log(tweet)
})

stream.on('error', function(error) {
  throw error
})

//can also be done with callback

client.stream('statuses/filter', {track: searchterm}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet)
  })

  stream.on('error', function(error) {
    throw error
  })
})