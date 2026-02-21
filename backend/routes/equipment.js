import express from 'express';
import Equipment from '../models/Equipment.js';
import QRCode from 'qrcode';
import { protect, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';

const router = express.Router();

// @route   GET /api/equipment
// @desc    Get all equipment
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, type, search } = req.query;

        let query = {};

        // Employees can only see their assigned equipment
        if (req.user.role === 'employee') {
            query.assignedTo = req.user._id;
        } else {
            // Admin/HR filters
            if (status) query.status = status;
            if (type) query.type = type;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { serialNumber: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ];
        }

        const equipment = await Equipment.find(query)
            .populate('assignedTo', 'name email department')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: equipment.length,
            data: equipment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/equipment/:id
// @desc    Get single equipment
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate(
            'assignedTo',
            'name email department'
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found',
            });
        }

        // Limit access to single equipment for employees
        if (req.user.role === 'employee' && equipment.assignedTo?._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: This equipment is not assigned to you',
            });
        }

        res.json({
            success: true,
            data: equipment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/equipment
// @desc    Create equipment
// @access  Private (Admin/HR)
router.post(
    '/',
    protect,
    authorize('admin', 'hr'),
    logAction('equipment_created', 'Equipment'),
    async (req, res) => {
        try {
            const equipmentData = req.body;

            // Generate QR code
            const qrData = JSON.stringify({
                id: Date.now().toString(),
                serialNumber: equipmentData.serialNumber,
                name: equipmentData.name,
            });

            const qrCodeImage = await QRCode.toDataURL(qrData);
            equipmentData.qrCode = qrCodeImage;

            const equipment = await Equipment.create(equipmentData);

            res.status(201).json({
                success: true,
                data: equipment,
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Equipment with this serial number already exists',
                });
            }
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   PUT /api/equipment/:id
// @desc    Update equipment
// @access  Private (Admin/HR)
router.put(
    '/:id',
    protect,
    authorize('admin', 'hr'),
    logAction('equipment_updated', 'Equipment'),
    async (req, res) => {
        try {
            let equipment = await Equipment.findById(req.params.id);

            if (!equipment) {
                return res.status(404).json({
                    success: false,
                    message: 'Equipment not found',
                });
            }

            equipment = await Equipment.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            res.json({
                success: true,
                data: equipment,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
// @access  Private (Admin only)
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    logAction('equipment_deleted', 'Equipment'),
    async (req, res) => {
        try {
            const equipment = await Equipment.findById(req.params.id);

            if (!equipment) {
                return res.status(404).json({
                    success: false,
                    message: 'Equipment not found',
                });
            }

            if (equipment.status === 'assigned') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete assigned equipment. Please return it first.',
                });
            }

            await equipment.deleteOne();

            res.json({
                success: true,
                data: {},
                message: 'Equipment deleted successfully',
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
