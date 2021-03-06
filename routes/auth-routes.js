const router = require('express').Router();
const passport = require('passport');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const User = require('../model/user-model');
let localStrategy = require('passport-local').Strategy;
let mongoose1 = require('../db/mongoose');
const bcrypt = require('bcrypt');
let nodemailer = require('nodemailer');

//body-parser stuff
router.use(bodyParser.json());
let urlencodedParser = bodyParser.urlencoded({ extended: false });

//auth login
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup/local', urlencodedParser, (req, res) => {
    if(req.body.firstName === "" || req.body.lastName === "") {
        return res.render('signup', {
            error: "Please enter a valid name."
        });
    } else if (req.body.email === "") {
        return res.render('signup', {
            error: "Please enter a valid email."
        });
    } else if (req.body.password === "") {
        return res.render('signup', {
            error: "Please enter a valid password."
        });
    } else if(req.body.password.length < 6) {
        return res.render('signup', {
            error: "Password must be a minimum of 6 characters."
        });
    } else if(req.body.passwordConf === "") {
        return res.render('signup', {
            error: "Please confirm your password."
        });
    } else if(req.body.password != req.body.passwordConf) {
        return res.render('signup', {
            error: "Passwords do not match."
        });
    };
    console.log('after validation');
    let user = new User();
    user.firstName = capitalizeName(req.body.firstName);
    user.lastName =capitalizeName(req.body.lastName);
    user.email = lcEmail(req.body.email);
    //username
    user.password = req.body.password;
    User.emailVeri(req.body.email).then(() => {
        console.log(1);
    }).catch(() => {
        return res.render('signup', {
            error: 'Email already in use.'
        })
    });

    console.log('before', user);
    bcrypt.genSalt(10, (err, salt) => {
        console.log('gensalt', salt);
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            console.log('after', user);
            user.save().then(() => {
                res.render('login');
            });
        });
    });
}); 

function capitalizeName(name) {
    let firstLetter = name.substr(0,1).toUpperCase();
    let remaining = name.substr(1).toLowerCase();
    let newString = firstLetter + remaining
    return newString
}

function lcEmail(email) {
    let newEmail = email.toLowerCase();
    return newEmail;
}

module.exports = router;