const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3');
const validateSchema = require('../schema/validator');

const roomService = require('../services/room.service');
const sessionService = require('../services/session.service');

const { randomString } = require('../lib/utilities');

const db = new sqlite3.Database('./database/meeting.db');

axios.defaults.headers.common = {
    'Content-Type': 'application/json'
}


router.get('/', (req, res) => {
    res.send(new Date());
})

router.route('/create')
    .post(validateSchema('create-meeting'), async (req, res) => {
    try{

        console.log("User: ", req.user);

        let janus = process.env.JANUS_URL
        let roomConfig = {
            roomId: Math.floor(Math.random() * 10000),
            roomName: req.body.name,
            pin: req.body.pin,
            record: req.body.record ? req.body.record : false,
            user: req.user.name
        }
        let session = await sessionService.createHandler(janus, 'janus.plugin.videoroom');

        let room = await roomService.createRoom(janus, session.sessionId, session.handlerId, roomConfig);
        console.log("Room ",JSON.stringify(room, null, 2));
        res.status(200).json({
            success: 1,
            body: room
        })
    }catch(e){
        res.status(500).json({
            success: 0,
            error: e
        })
    }
})

router.delete('destroy-meeting/:roomId', async (req, res) => {
    try{
        let janus = process.env.JANUS_URL
        let room = req.params.roomId
        let session = await sessionService.createHandler(janus, 'janus.plugin.videoroom');
        let response = await roomService.destroyRoom(janus, session.sessionId, session.handlerId, room);


    }catch(e){
        res.status(500).json({
            success: 0,
            error: e
        })
    }
})



module.exports = router;
