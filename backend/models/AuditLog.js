import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'user_created',
                'user_updated',
                'user_deleted',
                'equipment_created',
                'equipment_updated',
                'equipment_deleted',
                'assignment_created',
                'assignment_returned',
                'maintenance_scheduled',
                'maintenance_completed',
                'file_uploaded',
                'file_deleted',
                'login',
                'logout',
            ],
        },
        resource: {
            type: String, // e.g., 'Equipment', 'User', 'Assignment'
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        details: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
