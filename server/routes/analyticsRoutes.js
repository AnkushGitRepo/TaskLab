const express = require('express');
const router = express.Router();
const { getOverview, getTimeline } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/overview', getOverview);
router.get('/timeline', getTimeline);

module.exports = router;
