const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // Fix the typo in the require statement

const FootballField = require('./footballFieldModel');

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
    role: {
      type: String,
      enum: ['admin', 'owner', 'player'],
      default: 'player'
    },
    profileImage: {
      type: String
    },
    ownerRequestStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be 8 characters at least'],
      maxlength: [20, 'Password must be 20 characters at most'],
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
      },
      select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now()
    },
    active: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    permanentlyDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    this.passwordChangedAt = Date.now() - 1000;
    next();
  }
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  // Singular "checkPassword"
  return await bcrypt.compare(candidatePassword, userPassword);
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getQuery());

  if (!user) {
    return next();
  }

  if (user.role === 'owner') {
    await FootballField.deleteMany({ ownerId: user._id });
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
