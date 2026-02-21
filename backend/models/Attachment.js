import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
    {
        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true,
        },
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: ['receipt', 'manual', 'warranty', 'other'],
            default: 'other',
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
attachmentSchema.index({ equipment: 1 });

const Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;
