const express = require('express');
const router = express.Router();
const checkAuth = require('../../middlewares/checkAuth');
const { getAllKeys, getKey, createKey, updateKey, deleteKey } = require('../../controllers/key');

router.get('/', checkAuth, getAllKeys);
router.get('/:keyID', checkAuth, getKey);
router.post('/', checkAuth, createKey);
router.patch('/:keyID', checkAuth, updateKey);
router.delete('/:keyID', checkAuth, deleteKey);

module.exports = router;
