const express = require('express');
const router = express.Router();

const NotificationController = require('../../controllers/notification');

router.get('/', NotificationController.getNotifications);
router.post('/view', NotificationController.viewNotification);
router.post('/viewAll', NotificationController.viewAllNotifications);
router.post('/dismiss', NotificationController.dismissNotifications);
router.post('/postOnTimeline', NotificationController.createPostOnTimelineNotification);
router.post('/likeOnPost', NotificationController.createLikeOnPostNotification);
router.post('/commentOnPost', NotificationController.createCommentOnPostNotification);

module.exports = router;
