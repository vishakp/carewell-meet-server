const express = require('express');
const router = express.Router();

const { randomString } = require('../lib/utilities');

const validateSchema = require('../schema/validator');
const userService = require('../services/user.service');


router.get('/', (req, res) => {
    res.send(new Date());
})

router.route('/')
    .post((req, res) => {
        console.log(req.user, "Request user")
        res.send(new Date());
    });


router.route('/register')
    .post(validateSchema('user-registeration'), async (req, res) => {
        try {
            console.log("Register user!")
            let name = req.body.name
            let email = req.body.email
            let secret = req.body.secret;
            let userToken = req.body.token ? req.body.token : null
            let user = await userService.createUser(name, email,secret, userToken);
            res.status(200).json({
                success: 1,
                data: user
            })
            
        } catch (e) {
            res.status(500).json({
                success: 0,
                error: e
            })
        }
    });

module.exports = router;