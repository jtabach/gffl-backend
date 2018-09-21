const express = require('express');
const router = express.Router();

const NotificationController = require('../../controllers/notification');

router.get('/', NotificationController.getNotifications);
router.post('/', NotificationController.createNotification);
router.post('/view', NotificationController.viewNotification);
router.post('/dismiss', NotificationController.dismissNotifications);

module.exports = router;
