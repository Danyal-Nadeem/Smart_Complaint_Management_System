const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
    try {
        let query;

        // If user is admin, they can see all complaints. If user is regular, they only see their own.
        if (req.user.role === 'admin') {
            query = Complaint.find().populate('user', 'name email');
        } else {
            query = Complaint.find({ user: req.user.id });
        }

        const complaints = await query.sort('-createdAt');

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Make sure user is complaint owner or admin
        if (complaint.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const complaint = await Complaint.create(req.body);

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only admins can update status/priority/resolution
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update status' });
        }

        complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get complaint stats for admin dashboard
// @route   GET /api/complaints/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const stats = await Complaint.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Complaint.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const categoryStats = await Complaint.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                status: stats,
                priority: priorityStats,
                category: categoryStats
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
