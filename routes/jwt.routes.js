const express = require('express');
const router = express.Router();

const JwtController = require('../controllers/jwt.controller');

// router
// .route('')
// .get(authenticateToken, JwtController.get)
// .get(JwtController.token);
// .put(JwtController.update)
// .delete(JwtController.del);

router.route('/login').post(JwtController.login);
router.route('/logout').post(JwtController.logout);
router.route('/token').post(JwtController.token);

module.exports = router;
