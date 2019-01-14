// # Test API
var express = require('express');
var app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Load dotenv
require('dotenv').config()


// Json parser
//app.use(multer()); // for parsing multipart/form-data
app.use(bodyParser.json({ limit: '5mb', extended: true }))
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }))

/**
 * Routes to API
 */
app.use('/api', require('./src/service/UserService'))

// Init DB
mongoose.connect('mongodb+srv://'+ process.env.DB_USER + ':'  + process.env.DB_PASS  + '@' + process.env.DB_URI )
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('MongoDB Connection Succeeded')
})


app.get('/', function (req, res) {
  res.send('A exemple API')
});


app.listen(process.env.API_PORT, function () {
  console.log('Interloper API is running in port ' + process.env.API_PORT + '!');
});
