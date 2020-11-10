const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const basicAuth = require('./basicAuth');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt')

const db = new sqlite3.Database('./database/user.db'); 

const indexRoutes = require('./controllers/indexRouter');
const roomRoutes = require('./controllers/roomRouter');

require('dotenv').config()

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const PORT = process.env.PORT;

const app = express();
const port = normalizePort(PORT || '3000');
app.set('port', port);
const server = http.createServer(app);
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(basicAuth);
app.use('/', indexRoutes);
app.use('/room/', roomRoutes);

server.listen(port);
server.on('listening', () => {
  console.log("Listening on " + port);
})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Authorizer function
 */

 function authorize(user, secret){
   console.log("User: ", user, secret)
   if(user == 'admin' && secret == SECRET) return true;
    db.get(`SELECT * FROM user WHERE name = ?`, [user], (err, result) => {
      console.log("Error in authorize", err)
    if(err) return false;
    console.log("Result: ", result);
    let passwordMatch = bcrypt.compareSync(secret, result.secret);
    return passwordMatch;
   });
   
  }
  function getUnauthorizedResponse(req){
      return {
        error: 'unauthorized user. Please check your credentials.'
      }
  }
