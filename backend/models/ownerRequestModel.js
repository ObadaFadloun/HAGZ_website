const mongoose = require('mongoose');

const ownerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A request must belong to a player']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ownerRequestSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'firstName lastName email role' });
  next();
});

const OwnerRequest = mongoose.model('OwnerRequest', ownerRequestSchema);
module.exports = OwnerRequest;
