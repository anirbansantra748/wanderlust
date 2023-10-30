if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}
console.log(process.env.SECRET);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.ATLASDB_URL;
const store =  MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("error in moongoose session",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    express: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// Passport configuration
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect with mongoose
//const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log('Mongoose started');
  })
  .catch((err) => {
    console.log(err);
  });
  
// Set up view engine and directories
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares for flash messages and session
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// Define routes
app.use('/', require('./routes/user'));
app.use('/listings', require('./routes/listing'));
app.use('/listings/:id/reviews', require('./routes/review'));


// Custom 404 page
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found!'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err;
  res.status(statusCode).render('error.ejs', { err });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
