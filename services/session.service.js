const axios = require('axios');
const https = require('https');
const agent = new https.Agent({  
    rejectUnauthorized: false
  });
axios.defaults.headers.common = {
    'Content-Type': 'application/json'
}
axios.defaults.httpsAgent = agent;



const { randomString } = require('../lib/utilities');


    module.exports.createHandler = (server, plugin, keepAlive = false) => {
        return new Promise(async (resolve, reject) => {
            try {

                let sessionRes = await axios.post(server, {
                    transaction: randomString(7),
                    janus: "create"
                });
                if (sessionRes.data.janus == "success") {
                    let sessionId = sessionRes.data.data.id
                    server += `/${sessionId}`;
                    let pluginRequest = {
                        transaction: randomString(7),
                        janus: "attach",
                        plugin
                    }
                    let handlerRes = await axios.post(server, pluginRequest);
                    if (handlerRes.data.janus == "success") {
                        let handlerId = handlerRes.data.data.id;
                        if (keepAlive) {
                            keepAlive = this.keepAlive(server, sessionId);
                        }
                        resolve({
                            sessionId,
                            handlerId,
                            keepAlive
                        })
                    } else {
                        reject(handlerRes.janus)
                    }

                }
            } catch (error) {
                console.log("Error: ", error)
                reject(error)
            }
        })
    }

    let keepAlive = (server, sessionId) => {
        let url = `${server}/${sessionId}?maxev=5`
        return setInterval(() => {
            axios.get(url)
        }, 15000)

    }



