import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
    {
        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['routine', 'repair', 'upgrade', 'inspection', 'cleaning'],
        },
        scheduledDate: {
            type: Date,
            required: true,
        },
        completedDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
            default: 'scheduled',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        cost: {
            type: Number,
            min: 0,
            default: 0,
        },
        notes: {
            type: String,
        },
        completionNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
maintenanceSchema.index({ equipment: 1, scheduledDate: -1 });
maintenanceSchema.index({ status: 1, scheduledDate: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
