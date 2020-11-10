const axios = require('axios');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database/rooms.db');
require('dotenv').config();

axios.defaults.headers.common = {
    'Content-Type': 'application/json'
}


const { randomString } = require('../lib/utilities');

const CLIENT_URL = process.env.CLIENT_URL;

module.exports.createRoom = (
    server,
    session,
    handler,
    config) => {

    return new Promise(async (resolve, reject) => {
        try {
            db.run('CREATE TABLE IF NOT EXISTS rooms(id TEXT NOT NULL PRIMARY KEY, name TEXT, room NUMBER, user TEXT)');
            let createRequest = {
                "transaction": randomString(7),
                "janus": "message",
                "body": {
                    "request": "create",
                    "room": config.roomId,
                    "description": config.roomName,
                    "is_private": true,
                    "bitrate": 128000,
                    "fir_freq": 10,
                    "record": config.record,
                    "permanent": false
                }
            }
            if (config.pin) createRequest["body"]["pin"] = config.pin;
            let url = `${server}/${session}/${handler}`
            let roomRes = await axios.post(url, createRequest)

            console.log("Room creation res: ", roomRes.data);
            if (roomRes.data.janus == 'success') {
                let room = roomRes.data.plugindata.data
                let id = randomString(10);
                db.run('INSERT INTO rooms(id, name, room, user) VALUES(?,?,?,?)', [id], [config.roomName], [room.room],  [config.user], 
                (error, result)=>{
                    if(error) reject(`DB error: ${error}`);
                    console.log("DB save", result);
                    let resObj = {
                        url: CLIENT_URL + id
                    }
                    resolve(resObj);
                })
            }

        } catch (e) {
            reject(e);
        }
    });
}

module.exports.destroyRoom = (server, session, handler, roomId) => {
            return new Promise((resolve, reject) => {

                let destroyRequest = {
                    "transaction": randomString(7),
                    "janus": "message",
                    "body": {
                        "request": "destroy",
                        "room": roomId
                    }
                }
                let url = `${server}/${session}/${handler}`
                axios.post(url, destroyRequest)
                    .then((res) => {
                        if (res.janus == success) {
                            resolve(res.janus.plugindata.data);
                        }
                    })
            })
        }
