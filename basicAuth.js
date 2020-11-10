const userService = require('./services/user.service');
require('dotenv').config()


const SECRET = process.env.SECRET;
const ADMIN_USER = process.env.ADMIN_USER;

module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // make path public
    // if (req.path === '/') {
    //     return next();
    // }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    console.log(username, password, ADMIN_USER, SECRET);
    
    if(username == ADMIN_USER && password == SECRET){
        console.log("Admin user")
        req.user = {
            name: username
        };
        next();
    }else{
        const user = await userService.authenticate({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }
        
        // attach user to request object
        req.user = user
        
        next();
    }
}