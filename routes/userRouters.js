const AuthController = require('../controllers/authController');
const UserController = require('../controllers/userController');

const express = require('express');

const router = express.Router();

router.route('/').get(UserController.getAllUsers);
router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateMe)
  .delete(UserController.deleteMe);

module.exports = router;
