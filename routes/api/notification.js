const express = require('express');
const router = express.Router();

const NotificationController = require('../../controllers/notification');

router.post('/', NotificationController.createNotification);

module.exports = router;
