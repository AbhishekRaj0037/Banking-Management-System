const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const dbURI = 'mongodb://localhost:27017';

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


router.route('/login').get((req, res) => {
    res.render("login", {
        activeTab: "login",
        homeStartingContent: homeStartingContent,
        aboutContent: aboutContent,
        contactContent: contactContent,
    });
});

router.route('/signup').get((req, res) => {
    res.render("signup", {
        activeTab: "signup",
        homeStartingContent: homeStartingContent,
        aboutContent: aboutContent,
        contactContent: contactContent,
    });
});

router.route('/signup').post(async (req, res) => {
    const ifExists = await User.findOne({ username: req.body.username });
    if (ifExists) {
        return res.send('<h1>Username already exists.</h1><p>Please <a href="/user/signup">Signup</a> with another username</p>');
    }
    console.log(req.body);
    const user = new User({
        username: req.body.username,
        balance: req.body.balance,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    })
    try {
        await user.save();
        console.log(user);
    }
    catch {
        console.log("Not successful");
    }
    return res.redirect('/user/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    return res.render("dashboard", {
        activeTab: "logout",
        homeStartingContent: homeStartingContent,
        currentUser: req.user,
    });
});
router.get('/login-failure', (req, res) => {
    console.log('login-failed');
    res.send(`<p>You entered the wrong password.<br>\
    <a href="/user/login">login</a><br>\
    <a href="/user/signup">signup</p>`);
});

router.get('/logout', (req, res, next) => {
    console.log(req.user)
    req.logOut((err) => {
        if (err) return next(err);
        res.redirect('/');
    });

});
router.get('/withdraw', (req, res, next) => {
    res.render('withdraw', {
        currentUser: req.user,
        activeTab: "logout",
    });
})

router.post('/withdraw', (req, res, next) => {
    User.findOneAndUpdate({ username: req.user.username }, { "$inc": { "balance": -Number(req.body.amount) } }, (error, data) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(data);
        }
    })

    res.redirect('/user/dashboard');
})

router.post('/deposit', (req, res, next) => {
    User.findOneAndUpdate({ username: req.user.username }, { "$inc": { "balance": +Number(req.body.amount) } }, (error, data) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(data);
        }
    })

    res.redirect('/user/dashboard');
})

router.get('/deposit', (req, res, next) => {
    res.render('deposit', {
        currentUser: req.user,
        activeTab: "logout",
    });
})

router.get('/dashboard', (req, res, next) => {
    res.render('dashboard', {
        activeTab: "logout",
        homeStartingContent: homeStartingContent,
        currentUser: req.user,
    });
})



module.exports = router;