import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin/HR)
router.get('/', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { role, department } = req.query;

        let query = {};
        if (role) query.role = role;
        if (department) query.department = department;

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Admin/HR)
router.get('/:id', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put(
    '/:id',
    protect,
    authorize('admin'),
    logAction('user_updated', 'User'),
    async (req, res) => {
        try {
            const { password, ...updateData } = req.body;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete - deactivate)
// @access  Private (Admin only)
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    logAction('user_deleted', 'User'),
    async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { isActive: false },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            res.json({
                success: true,
                message: 'User deactivated successfully',
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

export default router;
