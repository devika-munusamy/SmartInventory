import express from 'express';
import Equipment from '../models/Equipment.js';
import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import Maintenance from '../models/Maintenance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        if (req.user.role === 'employee') {
            // Employee stats
            const myEquipmentCount = await Equipment.countDocuments({ assignedTo: req.user._id });
            const myActiveAssignments = await Assignment.countDocuments({
                user: req.user._id,
                status: 'active'
            });
            const myPastAssignments = await Assignment.countDocuments({
                user: req.user._id,
                status: 'returned'
            });

            return res.json({
                success: true,
                data: {
                    isEmployee: true,
                    stats: {
                        totalEquipment: myEquipmentCount,
                        activeAssignments: myActiveAssignments,
                        pastAssignments: myPastAssignments
                    }
                }
            });
        }

        // Admin/HR statistics (System-wide)
        const totalEquipment = await Equipment.countDocuments();
        const availableEquipment = await Equipment.countDocuments({ status: 'available' });
        const assignedEquipment = await Equipment.countDocuments({ status: 'assigned' });
        const maintenanceEquipment = await Equipment.countDocuments({ status: 'maintenance' });

        // Equipment by type
        const equipmentByType = await Equipment.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Active assignments
        const activeAssignments = await Assignment.countDocuments({ status: 'active' });

        // Recent assignments
        const recentAssignments = await Assignment.find()
            .populate('equipment', 'name type')
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Upcoming maintenance
        const upcomingMaintenance = await Maintenance.countDocuments({
            status: 'scheduled',
            scheduledDate: { $gte: new Date() },
        });

        // Total users
        const totalUsers = await User.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: {
                isEmployee: false,
                equipment: {
                    total: totalEquipment,
                    available: availableEquipment,
                    assigned: assignedEquipment,
                    maintenance: maintenanceEquipment,
                    byType: equipmentByType,
                },
                assignments: {
                    active: activeAssignments,
                    recent: recentAssignments,
                },
                maintenance: {
                    upcoming: upcomingMaintenance,
                },
                users: {
                    total: totalUsers,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/analytics/equipment-utilization
// @desc    Get equipment utilization data
// @access  Private (Admin/HR)
router.get('/equipment-utilization', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const utilization = await Equipment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json({
            success: true,
            data: utilization,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/analytics/assignment-trends
// @desc    Get assignment trends over time
// @access  Private (Admin/HR)
router.get('/assignment-trends', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { months = 6 } = req.query;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const trends = await Assignment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json({
            success: true,
            data: trends,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/analytics/maintenance-costs
// @desc    Get maintenance cost breakdown
// @access  Private (Admin/HR)
router.get('/maintenance-costs', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const costs = await Maintenance.aggregate([
            {
                $match: {
                    status: 'completed',
                    cost: { $gt: 0 },
                },
            },
            {
                $group: {
                    _id: '$type',
                    totalCost: { $sum: '$cost' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { totalCost: -1 } },
        ]);

        const totalCost = costs.reduce((sum, item) => sum + item.totalCost, 0);

        res.json({
            success: true,
            data: {
                breakdown: costs,
                total: totalCost,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
