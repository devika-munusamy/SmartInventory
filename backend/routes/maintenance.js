import express from 'express';
import Maintenance from '../models/Maintenance.js';
import Equipment from '../models/Equipment.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

const router = express.Router();

// @route   GET /api/maintenance
// @desc    Get all maintenance tasks
// @access  Private (Admin/HR)
router.get('/', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { status, type } = req.query;

        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const maintenance = await Maintenance.find(query)
            .populate('equipment', 'name type serialNumber')
            .populate('assignedTo', 'name email')
            .sort({ scheduledDate: 1 });

        res.json({
            success: true,
            count: maintenance.length,
            data: maintenance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/maintenance
// @desc    Schedule maintenance
// @access  Private (Admin/HR)
router.post(
    '/',
    protect,
    authorize('admin', 'hr'),
    logAction('maintenance_scheduled', 'Maintenance'),
    async (req, res) => {
        try {
            const maintenance = await Maintenance.create(req.body);

            const equipment = await Equipment.findById(req.body.equipment);

            // Send notification if assigned to someone
            if (req.body.assignedTo) {
                await Notification.create({
                    user: req.body.assignedTo,
                    type: 'maintenance',
                    title: 'Maintenance Scheduled',
                    message: `Maintenance scheduled for ${equipment.name}`,
                });
            }

            const populated = await Maintenance.findById(maintenance._id)
                .populate('equipment', 'name type serialNumber')
                .populate('assignedTo', 'name email');

            res.status(201).json({
                success: true,
                data: populated,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   PUT /api/maintenance/:id
// @desc    Update maintenance
// @access  Private (Admin/HR)
router.put(
    '/:id',
    protect,
    authorize('admin', 'hr'),
    logAction('maintenance_completed', 'Maintenance'),
    async (req, res) => {
        try {
            const maintenance = await Maintenance.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('equipment', 'name type serialNumber');

            if (!maintenance) {
                return res.status(404).json({
                    success: false,
                    message: 'Maintenance task not found',
                });
            }

            res.json({
                success: true,
                data: maintenance,
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
