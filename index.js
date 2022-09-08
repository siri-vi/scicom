const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const middleware = require('./middleware/index')
const userRouter = require("./routes/userRoutes")
const ideaRouter = require("./routes/ideaRoutes")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session')

const app = express()
dotenv.config()
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'Our little secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

//use this for Production
// const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
//local
// MONGO_URL = `mongodb://localhost:27017/authDB`
// const mongoURL = process.env.MONGO_URL
// const connectWithRetry = () => {
//   mongoose
//     .connect(mongoURL)
//     .then(() => console.log("Successfully connected to DB"))
//     .catch((e) => {
//       console.log(e)
//       setTimeout(connectWithRetry, 5000)
//     })
// }
// connectWithRetry()

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://localhost:5000/auth/google/callback',
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.send("You're authenticated")
  });

app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.get('/researcher', (req, res) => {
  res.sendFile(__dirname + "/public/researcher.html");
});

app.get('/sme', (req, res) => {
  res.sendFile(__dirname + "/public/sme.html");
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
})

app.post('/register', (req, res) => {

  User.register({
    username: req.body.username
  }, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, () => {
        res.send("You're registered")
      })
    }
  });

});

app.post('/login', (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.send("You're logged in");
      })
    }
  })

});

app.enable("trust proxy");
app.use(cors({}))
app.use(express.json())
//Middleware
// app.use(middleware.decodeToken);

app.use("/user", userRouter)
app.use("/ideabrekrr", ideaRouter)

app.get('/researcher', (req, res) => {
  res.sendFile(__dirname + "public/researcher.html");
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`))



//Todo:
//add error loggers
//add analytics