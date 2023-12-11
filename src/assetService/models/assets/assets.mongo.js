const mongoose = require('mongoose');

const Assets = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  ticker: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  purchasedDate: {
    type: Date,
    required: true
  },
  amountOnPurchase: {
    type: Number,
    required: true,
  },
  sold: {
    type: Boolean,
    default: false
  }
},
{
    timestamps: true,
}
);

// Virtual property to get the formatted date (yyyy-mm-dd)
Assets.virtual('formattedDate').get(function () {
  const formattedDate = this.purchasedDate.toISOString().split('T')[0];
  return formattedDate;
});

// Apply virtuals when converting to JSON
Assets.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Assets', Assets);
