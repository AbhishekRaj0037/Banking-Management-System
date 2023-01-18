const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const ejsMate = require('ejs-mate');
const path = require('path');
const home = require('./routes/home');
const users = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('./config/passport-config');
const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017';
module.exports.connection = mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const MongoStore = require('connect-mongo');
const session = require('express-session');



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbURI })
}))


app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    next();
})
app.use('/', home);
app.use('/user', users);

app.listen(8000, () => {
    console.log(`Listening on 8000}`);
})
module.exports = app;