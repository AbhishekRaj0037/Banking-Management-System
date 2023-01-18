const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt')

const authenticateUser = async (username, password, done) => {
    User.findOne({ username: username }).then((user) => {
        if (!user)
            return done(null, false, { message: 'No user found' })
        if (bcrypt.compareSync(password, user.password))
            return done(null, user);
        else return done(null, false, { message: 'Wrong password' })
    }).catch(err => {
        done(err);
    });
}

const strategy = new LocalStrategy(authenticateUser);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err));
})



