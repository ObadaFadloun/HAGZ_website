const UserController = require('../controllers/authController');

const express = require('express');

const router = express.Router();

router.route('/register').post(UserController.register);
router.route('/login').post(UserController.login);

module.exports = router;
