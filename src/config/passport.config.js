const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
  Strategy: JWTStrategy,
  ExtractJwt,
} = require('passport-jwt');

const { User } = require('../modals');
const { JWT_SECRET } = require('./secrets.config');

// Customer Local Strategy (Email/Phone)
passport.use('customer-local', new LocalStrategy(
  {
    usernameField: 'email',
  },
  ((email, password, done) => {
    User.findOne({
      $or: [
        {
          email,
        },
      ],
    })
      .exec((err, user) => {
        if (err) {
          done(err);
        } else if (!user) {
          done(null, false, {
            message:
            "The username and password provided doesn't belong to an account. Please check your credentials and try again.",
          });
        } else {
          user.comparePassword(password, (err2, isCorrect) => {
            if (err2) {
              done(err2);
            } else if (!isCorrect) {
              done(null, false, {
                message:
                "The username and password provided doesn't belong to an account. Please check your credentials and try again.",
              });
            } else {
              done(null, user);
            }
          });
        }
      });
  }),
));

// // Admin Local Strategy (Email/Phone)
// passport.use('admin-local', new LocalStrategy(
//   {
//     usernameField: 'email',
//   },
//   ((email, password, done) => {
//     User.findOne({ email })
//       .populate('role')
//       .exec((err, user) => {
//         if (err) {
//           done(err);
//         } else if (!user || user.disabled || user.role?.app !== 'admin') {
//           done(null, false, {
//             message:
//             "The username and password provided doesn't
//  belong to an account. Please check your credentials and try again.",
//           });
//         } else {
//           user.comparePassword(password, (err2, isCorrect) => {
//             if (err2) {
//               done(err2);
//             } else if (!isCorrect) {
//               done(null, false, {
//                 message:
//                 "The username and password provided doesn't
//  belong to an account. Please check your credentials and try again.",
//               });
//             } else {
//               done(null, user);
//             }
//           });
//         }
//       });
//   }),
// ));

// Customer JWT Strategy
passport.use('customer-jwt', new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  ((payload, done) => {
    User.findById(payload.sub).exec((err, user) => {
      if (err) {
        done(err, false);
      } else if (!user || user.disabled) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  }),
));

// // Admin JWT Strategy
// passport.use('admin-jwt', new JWTStrategy(
//   {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: JWT_SECRET,
//   },
//   ((payload, done) => {
//     User.findById(payload.sub).populate('role').exec((err, user) => {
//       if (err) {
//         done(err, false);
//       } else if (!user || user.disabled || user.role?.app !== 'admin') {
//         done(null, false);
//       } else {
//         done(null, user);
//       }
//     });
//   }),
// ));

exports.requireCustomerAuth = passport.authenticate('customer-jwt', { session: false });
exports.requireAdminAuth = passport.authenticate('admin-jwt', { session: false });
