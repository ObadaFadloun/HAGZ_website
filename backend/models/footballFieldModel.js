const mongoose = require('mongoose');
const validator = require('validator');

const footballFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Football field name is required'],
    trim: true,
    maxlength: [100, 'Football field name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Football field location is required'],
    trim: true
  },
  mapLink: {
    type: String,
    required: [true, 'A football field must have a Google Maps link'],
    validate: {
      validator: function (val) {
        // Accept only valid Google Maps links
        return /^https?:\/\/(www\.)?google\.com\/maps/.test(val);
      },
      message: 'Please provide a valid Google Maps link'
    }
  },
  pricing: {
    type: Number,
    required: [true, 'Pricing information is required'],
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Football field owner ID is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Facilities
  bathrooms: { type: Boolean, default: false },
  changingRooms: { type: Boolean, default: false },
  nightLights: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },

  // Partnerships
  partnerships: [
    {
      name: { type: String, trim: true },
      type: { type: String, enum: ['cafe', 'gym', 'shop', 'other'] },
      description: { type: String, trim: true }
    }
  ],

  // Equipment Rentals
  equipmentRentals: [
    {
      item: { type: String, trim: true },
      price: { type: Number, min: [0, 'Price cannot be negative'] },
      available: { type: Boolean, default: true }
    }
  ],

  // Media
  images: [
    {
      url: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            if (value.startsWith('http://localhost')) {
              return true; // allow dev
            }
            return validator.isURL(value, { require_protocol: true });
          },
          message: 'Please provide a valid URL for the image'
        }
      },
      caption: {
        type: String,
        trim: true,
        maxlength: [100, 'Caption cannot exceed 100 characters']
      }
    }
  ],
  video: {
    type: String,
    validate: {
      validator: function (value) {
        // ✅ Allow empty string or valid URL
        return !value || validator.isURL(value);
      },
      message: 'Please provide a valid URL for the video'
    }
  },

  // Availability
  openTime: {
    type: String,
    required: [true, 'Open time is required'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Open time must be in HH:MM format'
    ]
  },
  closeTime: {
    type: String,
    required: [true, 'Close time is required'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Close time must be in HH:MM format'
    ]
  },
  closedDays: [
    {
      type: String,
      enum: {
        values: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        message: 'Closed day must be a valid weekday'
      }
    }
  ],

  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be less than 0'],
    max: [5, 'Average rating cannot be more than 5']
  },
  totalReviews: {
    type: Number,
    default: 0
  },

  // Extras
  weatherIntegration: { type: Boolean, default: false },
  tags: [
    {
      type: String,
      enum: {
        values: [
          'Kids-friendly',
          'Professional',
          'Turf',
          'Grass',
          'Indoor',
          'Outdoor',
          '5-a-side',
          '7-a-side',
          '11-a-side',
          'Training',
          'Competition'
        ],
        message: 'Invalid tag'
      }
    }
  ],
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },

  // System
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

footballFieldSchema.virtual('topComments').get(function () {
  return this.reviews
    .sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes))
    .slice(0, 5);
});

footballFieldSchema.index({ location: 'text', name: 'text' });
footballFieldSchema.index({ ownerId: 1 });
footballFieldSchema.index({ averageRating: -1 });

module.exports = mongoose.model('FootballField', footballFieldSchema);
