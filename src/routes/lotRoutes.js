const express = require('express');
const router = express.Router();
const lotController = require('../controllers/lotController');

router.get('/:method', lotController.getLotsByMethod);

module.exports = router;