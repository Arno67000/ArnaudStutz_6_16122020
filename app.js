const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const toobusy = require('toobusy-js');
require('dotenv').config();

const winston = require('./logger/winstonConfig');
const morgan = require('morgan');

const userRouter = require('./routes/user');
const sauceRouter = require('./routes/sauce');

const app = express();

app.use(helmet());

app.use(morgan('combined', { stream: winston.stream }));

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie ! Server on port '+process.env.APP_PORT))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//app.use(express.multipart({ limit:"10mb" }));

app.use(bodyParser.urlencoded({extended: false, limit: "1kb"}));
app.use(bodyParser.json({ limit: "1kb" }));
app.use(mongoSanitize({
  replaceWith: '_'
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRouter);
app.use('/api/sauces', sauceRouter);

// error handler
app.use(function(err, req, res, next) {
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500);
  res.render('error');
 });

module.exports = app;