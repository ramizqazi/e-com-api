const mongoose = require('mongoose');

const { Schema } = mongoose;

const StoreSchema = new Schema({
  category: {
    type: String,
    enum: ['men', 'women', 'electronics', 'jewellery'],
    required: [true, 'Type is required'],
  },
  name: {
    type: String,
  },
  photo: {
    type: String,
    default: undefined,
  },
  email: {
    type: String,
  },
  about: {
    type: String,
  },
  phone: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

StoreSchema.index({
  name: 'text',
});

StoreSchema.index({
  category: 1,
  disabled: 1,
  type: 1,
  ranks: 1,
});

StoreSchema.methods.toJSON = function toJSON() {
  return {
    id: this._id,
    name: this.name,
    photo: this.photos,
    email: this.email,
    about: this.about,
    category: this.category,
  };
};

module.exports = mongoose.model('stores', StoreSchema);
