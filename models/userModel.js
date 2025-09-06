const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // Fix the typo in the require statement

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'This email already exists'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be 8 characters at least'],
      maxLength: [20, 'Password must be 20 characters at most'],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match'
      }
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['admin', 'owner', 'player'],
      default: 'player'
    },
    profileImage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  }
});

userSchema.methods.checkPassword = async function (inputPass) {
  // Singular "checkPassword"
  return await bcrypt.compare(inputPass, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changes
  return false;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
