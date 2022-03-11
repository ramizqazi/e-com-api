const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const debug = require('debug')('server:bin/www');

require('./config/passport.config');
const { MONGODB_URI } = require('./config/secrets.config');
const authRouter = require('./auth/route.auth');

const app = express();

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    debug('Mongodb Connected');
  })
  .catch((e) => {
    debug('Failed To Connected Db :', e);
  });

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

module.exports = app;
