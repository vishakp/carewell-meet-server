const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { randomString } = require('../lib/utilities');

const db = new sqlite3.Database('./database/user.db');


module.exports.authenticate = (username, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM user WHERE name = ?', [username], (err, result) => {
            if (err) reject(err);
            if(result){
                let passwordMatch = bcrypt.compareSync(password, result.secret);
                if (passwordMatch) {
                    const { name, email, userToken } = result;
                    resolve( {
                        name,
                        email,
                        userToken
                    });
                }
                else
                reject();
            }else{
                reject("user not found");
            }
        });
    })
}

module.exports.createUser = (
    name,
    email,
    secret,
    userToken) => {
    return new Promise((resolve, reject) => {
        db.run('CREATE TABLE IF NOT EXISTS user(id TEXT NOT NULL PRIMARY KEY, name TEXT, email TEXT, secret TEXT, token TEXT)');

        let encryptedSecret = bcrypt.hashSync(secret, 10);
        let id = randomString(6);

        db.get(`SELECT * FROM user WHERE email = ?`, [email], (err, result) => {

            if (!err && result) {
                const { name, email, userToken } = result;

                resolve({
                    name,
                    email,
                    userToken
                })

            } else {
                db.run('INSERT INTO user(id, name, email, secret, token) VALUES(?,?,?,?,?)', [id], [name], [email], [encryptedSecret], [userToken], (error, response) => {
                    if (error) reject(error)
                    resolve({
                        name,
                        email,
                        userToken
                    })
                });
            }
        });

    })
}