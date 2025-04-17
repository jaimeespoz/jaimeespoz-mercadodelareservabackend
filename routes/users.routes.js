const { authenticateToken, generateAccessToken } = require('../src/authServer');

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const UsersController = require('../controllers/users.controller');

router
    .route('')
    .get(authenticateToken, UsersController.getAll)
    .post(authenticateToken, UsersController.add)
    .put(authenticateToken, UsersController.update)
    .delete(authenticateToken, UsersController.del);

router.route('/:username').get(authenticateToken, UsersController.get);
router.route('/email/:email').get(authenticateToken, UsersController.getemail);

module.exports = router;
