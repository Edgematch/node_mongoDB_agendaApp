const express = require('express')//calls for express dependency
const cookieParser = require('cookie-parser');
const session = require('express-session')
const {v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')//dependency for connections to the database
const MongoStore = require('connect-mongo')(session);//establish a storage for sessions
const passport = require('passport');//used for authenticate

const dotenv = require('dotenv').config({path:__dirname+'/./.env'})//stores our env variables

//initialize local strategy 
const initializePassport = require('./passport-config')
initializePassport(passport)

//initialize express server app
const app = express()

//makes a connection to the database
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser:true }, ()=> 
    console.log('connected to the database')
)

mongoose.Promise = global.Promise;
const db = mongoose.connection

//let express use sessions
app.use(cookieParser());
app.use(session({
    genid: (req) => {
      return uuidv4() // use UUIDs for session IDs
    },
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: db }),
    resave: false,
    saveUninitialized: true
  }))

//initilize passport and use passportsessions
app.use(passport.initialize());
app.use(passport.session());

//calls routes folder 
const authRoute = require('./Routes/auth')
const eventsRoute = require('./Routes/events')

//middleware to parse json objects
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//serves statics files 
app.use(express.static('../client'))

//express router midelware
app.use('/login', authRoute)
app.use('/events', eventsRoute)

const PORT = process.env.PORT || 3000

//runs the server 
app.listen(PORT, ()=> console.log(`Serever running on http://localhost:${PORT}`))