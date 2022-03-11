const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product Name is required'],
  },
  about: {
    type: String,
    required: [true, 'Product About is required'],
  },
  photos: [{
    type: String,
  }],
  price: {
    type: Number,
  },
  variants: [{
    name: String,
    price: Number,
  }],
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date(),
  },
});

ProductSchema.methods.toJSON = function toJSON() {
  return {
    id: this._id,
    name: this.name,
    about: this.about,
    photos: this.photos,
    price: this.price,
    variants: this.variants,
    available: this.available,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Products', ProductSchema);
