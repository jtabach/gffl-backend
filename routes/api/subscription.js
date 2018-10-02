const express = require('express');
const router = express.Router();

const SubscriptionController = require('../../controllers/subscription');

router.post('/save', SubscriptionController.saveSubscription);

module.exports = router;
