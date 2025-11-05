const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    field: {
      type: mongoose.Schema.ObjectId,
      ref: 'FootballField',
      required: [true, 'Reservation must belong to a football field']
    },
    player: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reservation must belong to a player']
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reservation must have an owner']
    },
    date: {
      type: Date,
      required: [true, 'Reservation must have a date']
    },
    startTime: {
      type: String,
      required: [true, 'Reservation must have a start time']
    },
    endTime: {
      type: String,
      required: [true, 'Reservation must have an end time']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Reservation must have a total price']
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active'
    },
    promoCode: {
      type: String,
      default: null
    },
    loyaltyPointsUsed: {
      type: Number,
      default: 0
    },
    equipmentRental: [
      {
        item: {
          type: String
        },
        quantity: {
          type: Number,
          default: 1
        },
        price: Number
      }
    ],
    weather: {
      type: Object, // { temperature, condition, icon }
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔗 Auto-populate references when querying
reservationSchema.pre(/^find/, function (next) {
  this.populate('player', 'firstName lastName email')
    .populate('field', 'name location price')
    .populate('owner', 'firstName lastName email');
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
