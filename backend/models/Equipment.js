import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide equipment name'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Please provide equipment type'],
            enum: ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Webcam', 'Docking Station', 'Other'],
        },
        brand: {
            type: String,
            trim: true,
        },
        model: {
            type: String,
            trim: true,
        },
        serialNumber: {
            type: String,
            required: [true, 'Please provide serial number'],
            unique: true,
            trim: true,
        },
        purchaseDate: {
            type: Date,
        },
        purchasePrice: {
            type: Number,
            min: 0,
        },
        status: {
            type: String,
            enum: ['available', 'assigned', 'maintenance', 'retired'],
            default: 'available',
        },
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        qrCode: {
            type: String, // Base64 encoded QR code image
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
// equipmentSchema.index({ status: 1, type: 1 });
// equipmentSchema.index({ serialNumber: 1 });

// const Equipment = mongoose.model('Equipment', equipmentSchema);

// export default Equipment;

equipmentSchema.index({ status: 1, type: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;