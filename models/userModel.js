const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fiestName: {
        type: String,
        required: [true, "Firt name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email already exists"],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valide email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be 8 characters at least"],
        maxLength: [20, "Password must be 20 characters at most"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            }
        }
    },
    role: {
        type: String,
        enun: ['admin', 'owner', 'player'],
        default: 'player'
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const User = mongoose.model('user', userSchema);

module.exports(User)