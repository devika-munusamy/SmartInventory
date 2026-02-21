import express from 'express';
import Assignment from '../models/Assignment.js';
import Equipment from '../models/Equipment.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

const router = express.Router();

// @route   GET /api/assignments
// @desc    Get all assignments
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, userId } = req.query;

        let query = {};

        if (status) query.status = status;

        // Employees can only see their own assignments
        if (req.user.role === 'employee') {
            query.user = req.user._id;
        } else if (userId) {
            query.user = userId;
        }

        const assignments = await Assignment.find(query)
            .populate('equipment', 'name type serialNumber')
            .populate('user', 'name email department')
            .populate('assignedBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: assignments.length,
            data: assignments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/assignments
// @desc    Create assignment
// @access  Private (Admin/HR)
router.post(
    '/',
    protect,
    authorize('admin', 'hr'),
    logAction('assignment_created', 'Assignment'),
    async (req, res) => {
        try {
            const { equipment: equipmentId, user: userId, notes, expectedReturnDate } = req.body;

            // Check if equipment exists and is available
            const equipment = await Equipment.findById(equipmentId);
            if (!equipment) {
                return res.status(404).json({
                    success: false,
                    message: 'Equipment not found',
                });
            }

            if (equipment.status !== 'available') {
                return res.status(400).json({
                    success: false,
                    message: 'Equipment is not available for assignment',
                });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Create assignment
            const assignment = await Assignment.create({
                equipment: equipmentId,
                user: userId,
                assignedBy: req.user._id,
                notes,
                expectedReturnDate,
            });

            // Update equipment status
            equipment.status = 'assigned';
            equipment.assignedTo = userId;
            await equipment.save();

            // Create notification
            await Notification.create({
                user: userId,
                type: 'assignment',
                title: 'Equipment Assigned',
                message: `${equipment.name} has been assigned to you`,
                link: `/equipment/${equipmentId}`,
            });

            // Send email notification
            sendEmail({
                to: user.email,
                subject: 'Equipment Assigned to You',
                html: emailTemplates.assignmentNotification(
                    user.name,
                    equipment.name,
                    req.user.name
                ),
            });

            const populatedAssignment = await Assignment.findById(assignment._id)
                .populate('equipment', 'name type serialNumber')
                .populate('user', 'name email department')
                .populate('assignedBy', 'name');

            res.status(201).json({
                success: true,
                data: populatedAssignment,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   PUT /api/assignments/:id/return
// @desc    Return equipment
// @access  Private (Admin/HR)
router.put(
    '/:id/return',
    protect,
    authorize('admin', 'hr'),
    logAction('assignment_returned', 'Assignment'),
    async (req, res) => {
        try {
            const { returnNotes, decommission } = req.body;

            const assignment = await Assignment.findById(req.params.id)
                .populate('equipment')
                .populate('user', 'name email');

            if (!assignment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignment not found',
                });
            }

            if (assignment.status === 'returned') {
                return res.status(400).json({
                    success: false,
                    message: 'Equipment already returned',
                });
            }

            // Update assignment
            assignment.status = 'returned';
            assignment.returnDate = new Date();
            assignment.returnNotes = returnNotes;
            await assignment.save();

            // Update equipment
            const equipment = await Equipment.findById(assignment.equipment._id);
            equipment.status = decommission ? 'retired' : 'available';
            equipment.assignedTo = null;
            await equipment.save();

            // Create notification
            await Notification.create({
                user: assignment.user._id,
                type: 'return',
                title: 'Equipment Return Confirmed',
                message: `Return of ${equipment.name} has been confirmed`,
            });

            // Send email notification
            sendEmail({
                to: assignment.user.email,
                subject: 'Equipment Return Confirmed',
                html: emailTemplates.returnNotification(
                    assignment.user.name,
                    equipment.name
                ),
            });

            res.json({
                success: true,
                data: assignment,
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
