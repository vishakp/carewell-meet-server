const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const indexRoutes = require('./controllers/indexRouter');


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
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use('/', indexRoutes);



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
