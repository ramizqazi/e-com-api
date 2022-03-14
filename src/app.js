const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const debug = require('debug')('server:bin/www');

require('./config/passport.config');
const { MONGODB_URI } = require('./config/secrets.config');
const authRouter = require('./auth/route.auth');
const productRouter = require('./products/route.products');

const app = express();

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    debug('Mongodb Connected');
  })
  .catch((e) => {
    debug('Failed To Connected Db :', e);
  });

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/products', productRouter);

module.exports = app;
