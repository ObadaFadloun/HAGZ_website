// favoriteController.js
const User = require('../models/userModel');

exports.toggleFavorite = async (req, res) => {
  try {
    const user = req.user; // from authController.protect
    const fieldId = req.params.fieldId;

    if (!user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const index = user.favorites.findIndex((f) => f.toString() === fieldId);
    if (index === -1) {
      // Add favorite
      user.favorites.push(fieldId);
    } else {
      // Remove favorite
      user.favorites.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      isFavorite: index === -1 // true if added, false if removed
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      status: 'success',
      data: user.favorites
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  }
};
