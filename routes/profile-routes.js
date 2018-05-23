const router = require('express').Router();
const hbs = require('hbs');

const authCheck = (req, res, next) => {
    if(!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', (req, res) => {
    res.render('profile', {
        user: req.user
    });
});

module.exports = router;