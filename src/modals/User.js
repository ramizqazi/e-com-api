const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    avatar: {
      type: String,
    },
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date(),
  },
  wishList: [{
    type: String,
  }],
});

UserSchema.pre('save', function modifyPassword(next) {
  const user = this;
  if (!user.isModified('password')) {
    next();
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        next(err);
      } else {
        bcrypt.hash(user.password, salt, undefined, (e, hash) => {
          if (e) {
            next(e);
          } else {
            user.password = hash;
            next();
          }
        });
      }
    });
  }
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatched) => {
    callback(err, isMatched);
  });
};

UserSchema.methods.toJSON = function toJSON() {
  return {
    id: this._id,
    phone: this.phone,
    email: this.email,
    profile: this.profile,
    createdAt: this.createdAt,
    wishList: this.wishList,
  };
};

module.exports = mongoose.model('Users', UserSchema);
