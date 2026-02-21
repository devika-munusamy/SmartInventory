import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/audit
// @desc    Get audit logs
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { action, userId, startDate, endDate, page = 1, limit = 50 } = req.query;

        let query = {};

        if (action) query.action = action;
        if (userId) query.user = userId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .populate('user', 'name email role')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await AuditLog.countDocuments(query);

        res.json({
            success: true,
            count: logs.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: logs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
