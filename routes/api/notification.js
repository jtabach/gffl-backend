const express = require('express');
const router = express.Router();

const NotificationController = require('../../controllers/notification');

router.get('/', NotificationController.getNotifications);
router.post('/', NotificationController.createNotification);

module.exports = router;
