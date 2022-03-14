const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  about: {
    type: String,
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
  ratings: {
    1: {
      type: Number,
      default: 0,
    },
    2: {
      type: Number,
      default: 0,
    },
    3: {
      type: Number,
      default: 0,
    },
    4: {
      type: Number,
      default: 0,
    },
    5: {
      type: Number,
      default: 0,
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: Number,
  },
  category: {
    type: String,
    enum: ['men', 'women', 'electronics', 'jewellery'],
    required: [true, 'Type is required'],
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'stores',
  },
}, { timestamps: true });

ProductSchema.index({
  name: 'text',
});

ProductSchema.methods.toCustomerJSON = function toCustomerJSON() {
  return {
    id: this._id,
    name: this.name,
    about: this.about,
    photos: this.photos,
    price: this.price,
    variants: this.variants,
    ratings: this.ratings,
    discount: this.discount,
    category: this.category,
    store: this.store instanceof mongoose.Document
      ? this.store.toCustomerJSON()
      : this.store && { id: this.store },
  };
};

module.exports = mongoose.model('products', ProductSchema);
