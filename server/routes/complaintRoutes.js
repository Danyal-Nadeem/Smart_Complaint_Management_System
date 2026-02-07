const express = require('express');
const {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaintStatus,
    getStats
} = require('../controllers/complaintController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All routes are protected

router.route('/')
    .get(getComplaints)
    .post(createComplaint);

router.get('/stats', authorize('admin'), getStats);

router.route('/:id')
    .get(getComplaint)
    .put(authorize('admin'), updateComplaintStatus);

module.exports = router;
