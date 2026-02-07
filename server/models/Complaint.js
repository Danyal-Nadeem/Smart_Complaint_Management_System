const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['General', 'Technical', 'Hostel', 'Academic', 'Other']
    },
    priority: {
        type: String,
        required: [true, 'Please add a priority'],
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    resolution: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
