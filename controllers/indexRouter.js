const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../lib/datastore');

const { randomString } = require('../lib/utilities');

axios.defaults.headers.common = {
    'Content-Type': 'application/json'
}

router.post('/create-plugin', async (req, res) => {
    try {

        let server = req.body.server
        let plugin = req.body.plugin
        let keepAlive = req.query.keepAlive
        let sessionRes = await axios.post(server, {
            transaction: randomString(7),
            janus: "create"
        });
        if(session.janus == "success"){
            let sessionId = sessionRes.data.id
            server += `/${sessionId}`;
            let pluginRequest = {
                transaction: randomString(7),
                janus: "attach",
                plugin
            }
            let handlerRes = await axios.post(server, pluginRequest);
            if(handlerRes.janus == "success"){
                let handlerId = handlerRes.data.id;
                
                res.status(200).json({
                    success: 1,
                    data: {
                        sessionId,
                        handlerId,
                        plugin
                    }
                })
            }
            if(keepAlive){
                
            }
        
        }

    }catch(e){

        res.status(500).json({
            success: 0,
            error: e
        })
    }
    
})

router.post('/destroy-mount-points/:sessionId/:handlerid', async (req, res)=>{
    try{
        let mountPoints = req.body.mountPointIds
        let url = `${req.body.serverUrl}/${req.params.sessionId}/${handlerId}`
        for(let i=0;i<mountPoints.length;i++){
            let result = await axios.post(url, {
                transaction: randomString(7),
                janus: "message",
                body: {
                    request: "destroy",
                    id: mountPoints[i]
                }
            });
            console.log(JSON.stringify(result, null, 2));
        }
        res.status(200).json({
            success: 1,
            destroyed: mountPoints
        })
    }catch(e){
        res.status(500).json({
            success: 0,
            error: e
        })
    }
})


router.get("/getnewport/:roomid", (req, res) => {
    let id = req.params.roomid
    console.log("Room: ", id);
    cache.list(id)
    .then((list)=>{
        console.log("out: ", list)
        let config = {}
        if(list){
            config = JSON.parse(list.config);
            config.audioPort += 3
            config.videoPort += 3
            config.dataPort += 3
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

router.post("/add-rtplistener/:roomid", (req, res) => {
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

module.exports = router;