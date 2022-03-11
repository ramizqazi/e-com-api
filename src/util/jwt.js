const jwt = require('jsonwebtoken');
const { APP_DOMAIN, JWT_SECRET } = require('../config/secrets.config');

exports.signToken = (payload, secret = JWT_SECRET, options = {
  algorithm: 'HS256', issuer: APP_DOMAIN,
}) => new Promise((resolve, reject) => {
  jwt.sign(
    payload,
    secret,
    options,
    (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    },
  );
});

exports.verifyToken = (token, secret = JWT_SECRET) => new Promise((resolve, reject) => {
  jwt.verify(
    token,
    secret,
    (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    },
  );
});
