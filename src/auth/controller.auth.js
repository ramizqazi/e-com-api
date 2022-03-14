const passport = require('passport');

const { User } = require('../modals');
const { signToken } = require('../util/jwt');
const {
  JWT_SECRET,
  APP_DOMAIN,
} = require('../config/secrets.config');

/**
 * POST /customer/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
    } = req.body;

    const existingUser = await User.findOne({ email }, { _id: 0, email: 1 });

    if (existingUser) {
      res.status(422).json({
        message: 'User with the given email address already exist. Please check your email and try again.',
      });
    } else {
      const user = await User.create({
        email,
        password,
        phone,
        profile: {
          firstName,
          lastName,
        },
      });
      const accessToken = await signToken({ sub: user._id });
      res.status(200).json({
        user: user.toJSON(true),
        token: accessToken,
      });
    }
  } catch (e) {
    next(e);
    res.status(404).json({ message: e.message });
  }
};

/**
 * POST /customer/auth/login
 */
exports.login = async (req, res, next) => {
  passport.authenticate('customer-local', (err1, user, info) => {
    if (err1) {
      next(err1);
    } else if (!user) {
      res.status(401).json({
        message: info.message,
      });
    } else {
      signToken(
        { sub: user._id },
        JWT_SECRET,
        { algorithm: 'HS256', issuer: APP_DOMAIN },
      ).then((token) => res.status(200).json({
        user,
        token,
      })).catch((e) => next(e));
    }
  })(req, res, next);
};
