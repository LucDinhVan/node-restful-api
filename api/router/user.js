const express = require('express');
const router = express.Router();
const { login, logout, queryUserInfo } = require('../../controllers/user');

// router.get('', emailVerification);
// router.get('/email-verification', emailVerification);
router.post('/login', login);
router.get('/logout', logout);
router.get('', queryUserInfo);

module.exports = router;
