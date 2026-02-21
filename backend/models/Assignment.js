import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
    {
        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedDate: {
            type: Date,
            default: Date.now,
        },
        returnDate: {
            type: Date,
            default: null,
        },
        expectedReturnDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['active', 'returned', 'overdue'],
            default: 'active',
        },
        notes: {
            type: String,
        },
        returnNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
assignmentSchema.index({ user: 1, status: 1 });
assignmentSchema.index({ equipment: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
