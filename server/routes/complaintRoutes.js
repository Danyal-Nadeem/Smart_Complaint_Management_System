const express = require('express');
const {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaintStatus,
    updateComplaint,
    deleteComplaint,
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
    .put(authorize('admin'), updateComplaintStatus)
    .delete(deleteComplaint);

router.put('/:id/update', updateComplaint);

module.exports = router;
