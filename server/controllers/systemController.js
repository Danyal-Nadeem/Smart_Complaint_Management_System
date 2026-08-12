const SystemSettings = require('../models/SystemSettings');

// @desc    Get system status
// @route   GET /api/system/status
// @access  Public (or semi-public if needed)
exports.getSystemStatus = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({ isSystemOnline: true });
        }
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Toggle system status
// @route   PUT /api/system/toggle
// @access  Private/Admin
exports.toggleSystemStatus = async (req, res) => {
    try {
        // Only Super Admin can toggle system status
        if (req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
            return res.status(403).json({
                success: false,
                message: 'Only the Super Admin can toggle system status'
            });
        }

        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({ isSystemOnline: true });
        }

        settings.isSystemOnline = !settings.isSystemOnline;
        settings.lastUpdatedBy = req.user._id;
        await settings.save();

        // Broadcast the change to all connected clients
        if (global.io) {
            global.io.emit('systemStatusUpdate', settings.isSystemOnline);
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
