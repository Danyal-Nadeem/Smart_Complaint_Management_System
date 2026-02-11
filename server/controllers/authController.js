const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const isUser = role === 'user';

        const user = await User.create({
            name,
            email,
            password,
            role,
            status: isUser ? 'approved' : 'pending',
            approvalToken: isUser ? undefined : crypto.randomBytes(20).toString('hex'),
            approvalTokenExpire: isUser ? undefined : Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        // If regular user, return token immediately
        if (isUser) {
            return sendTokenResponse(user, 201, res);
        }

        // For admins, proceed with approval email flow
        const approvalToken = user.approvalToken;

        // Construct approval URL
        const approvalUrl = `${req.protocol}://${req.get('host')}/api/auth/approve/${approvalToken}`;

        const message = `
          New account registration request:
          Name: ${user.name}
          Email: ${user.email}
          Role: ${user.role}
          
          Please approve this user by clicking the link below:
          ${approvalUrl}
        `;

        try {
            await sendEmail({
                email: process.env.SUPER_ADMIN_EMAIL || 'danyalnadeem288@gmail.com',
                subject: 'Admin Approval Required - CMS Pro',
                message,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
                        <h2 style="color: #4f46e5;">New Registration Request</h2>
                        <p>A new account has been registered and requires your approval.</p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Name:</strong> ${user.name}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Role:</strong> ${user.role}</p>
                        </div>
                        <a href="${approvalUrl}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Approve User</a>
                        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This link will expire in 24 hours.</p>
                    </div>
                `
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful! Your account is pending admin approval. You will be notified once activated.'
            });
        } catch (err) {
            console.error('SMTP Error:', err);
            user.approvalToken = undefined;
            user.approvalTokenExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent',
                error: err.message
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        res.status(400).json({ message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is approved
        console.log(`Login attempt: ${email}, Status: ${user.status}, Role: ${user.role}`);

        // Auto-approve logic:
        // 1. Super Admin from .env always gets in
        // 2. Regular 'user' role is auto-approved (as requested)
        const isSuperAdmin = email === process.env.SUPER_ADMIN_EMAIL;
        const isRegularUser = user.role === 'user';

        if (user.status !== 'approved' && (isSuperAdmin || isRegularUser)) {
            console.log(`Auto-approving account: ${email} (Role: ${user.role})`);
            user.status = 'approved';
            await user.save({ validateBeforeSave: false });
        }

        if (user.status !== 'approved') {
            return res.status(403).json({
                message: 'Your account is pending approval. Please wait for the super admin to activate it.'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        res.status(400).json({ message: err.message });
    }
};

// @desc    Approve user registration
// @route   GET /api/auth/approve/:token
// @access  Public (Secure via token)
exports.approveUser = async (req, res) => {
    try {
        // Find user by token and check if token is not expired
        const user = await User.findOne({
            approvalToken: req.params.token,
            approvalTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired approval token' });
        }

        // Set status to approved and clear token
        user.status = 'approved';
        user.approvalToken = undefined;
        user.approvalTokenExpire = undefined;

        await user.save();

        res.status(200).send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #4f46e5;">Account Approved!</h1>
            <p>The account for <strong>${user.name}</strong> (${user.email}) has been successfully activated.</p>
            <p>The user can now log in to the portal.</p>
          </div>
        `);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
