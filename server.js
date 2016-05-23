var express = require('express')
require('dotenv').config()
var bodyParser = require('body-parser')

var app = express()
var port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(express.static('client'))


app.get('/', function (req, res) {
    res.send('index.html')
})



app.listen(port, function () {
  console.log("Word's Worth is now cruising on 3000")
})