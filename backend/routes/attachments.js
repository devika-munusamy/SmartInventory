import express from 'express';
import Attachment from '../models/Attachment.js';
import Equipment from '../models/Equipment.js';
import upload from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/auditLog.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   POST /api/attachments
// @desc    Upload file
// @access  Private (Admin/HR)
router.post(
    '/',
    protect,
    authorize('admin', 'hr'),
    upload.single('file'),
    logAction('file_uploaded', 'Attachment'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a file',
                });
            }

            const { equipment, category } = req.body;

            // Verify equipment exists
            const equipmentExists = await Equipment.findById(equipment);
            if (!equipmentExists) {
                // Delete uploaded file
                fs.unlinkSync(req.file.path);
                return res.status(404).json({
                    success: false,
                    message: 'Equipment not found',
                });
            }

            const attachment = await Attachment.create({
                equipment,
                filename: req.file.filename,
                originalName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                category: category || 'other',
                uploadedBy: req.user._id,
                filePath: req.file.path,
            });

            res.status(201).json({
                success: true,
                data: attachment,
            });
        } catch (error) {
            // Delete file if database save fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   GET /api/attachments/equipment/:equipmentId
// @desc    Get equipment attachments
// @access  Private
router.get('/equipment/:equipmentId', protect, async (req, res) => {
    try {
        const attachments = await Attachment.find({
            equipment: req.params.equipmentId,
        }).populate('uploadedBy', 'name');

        res.json({
            success: true,
            count: attachments.length,
            data: attachments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/attachments/:id/download
// @desc    Download file
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found',
            });
        }

        res.download(attachment.filePath, attachment.originalName);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   DELETE /api/attachments/:id
// @desc    Delete attachment
// @access  Private (Admin/HR)
router.delete(
    '/:id',
    protect,
    authorize('admin', 'hr'),
    logAction('file_deleted', 'Attachment'),
    async (req, res) => {
        try {
            const attachment = await Attachment.findById(req.params.id);

            if (!attachment) {
                return res.status(404).json({
                    success: false,
                    message: 'Attachment not found',
                });
            }

            // Delete file from filesystem
            if (fs.existsSync(attachment.filePath)) {
                fs.unlinkSync(attachment.filePath);
            }

            await attachment.deleteOne();

            res.json({
                success: true,
                message: 'Attachment deleted',
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
