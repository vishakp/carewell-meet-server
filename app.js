const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const cache = require('./lib/datastore');



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

app.get("/getnewport/:roomid", (req, res) => {
    let id = req.params.roomid
    console.log("Room: ", id);
    cache.list(id)
    .then((list)=>{
        console.log("out: ", list)
        let config = {}
        if(list){
            config = JSON.parse(list.config);
            config.audioPort += 1
            config.videoPort += 1
            config.dataPort += 1
        }else{
            config.audioPort = 5000;
            config.videoPort = 5001;
            config.dataPort = 5002;
        }
        
        res.status(200).json({
            success:1,
            message: config
        })
    }).catch((err)=>{
        res.status(500).json({
            success: 0,
            message: err
        })
    })
})

app.post("/add-rtplistener/:roomid", (req, res) => {
    let roomId = req.params.roomid
    let cacheContent = {
        audioPort: req.body.audioPort,
        videoPort: req.body.videoPort,
        dataPort: req.body.dataPort
    }

    cache.upsert(roomId, 'config', cacheContent).then(()=>{
        res.status(200).json({
            success: 1,
            message: "Added to cache"
        })
    })
    .catch((e)=>{
        res.status(500).json({
            success: 0,
            message: e
        })
    });

})


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
