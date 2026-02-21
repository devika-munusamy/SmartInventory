import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Package, Plus, Search, Download, Trash2, Edit } from 'lucide-react';
import api from '../utils/api';
import QRCode from 'qrcode';

const EquipmentList = () => {
    const { user } = useAuth();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Laptop',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        purchasePrice: '',
        condition: 'good',
        notes: '',
    });

    useEffect(() => {
        fetchEquipment();
    }, [statusFilter]);

    const fetchEquipment = async () => {
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;

            const { data } = await api.get('/equipment', { params });
            setEquipment(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching equipment:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/equipment', formData);
            setShowAddModal(false);
            setFormData({
                name: '',
                type: 'Laptop',
                brand: '',
                model: '',
                serialNumber: '',
                purchaseDate: '',
                purchasePrice: '',
                condition: 'good',
                notes: '',
            });
            fetchEquipment();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating equipment');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this equipment?')) return;

        try {
            await api.delete(`/equipment/${id}`);
            fetchEquipment();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting equipment');
        }
    };

    const downloadQRCode = async (equipment) => {
        try {
            const qrData = JSON.stringify({
                id: equipment._id,
                serialNumber: equipment.serialNumber,
                name: equipment.name,
            });
            const qrCodeUrl = await QRCode.toDataURL(qrData);

            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.download = `QR-${equipment.serialNumber}.png`;
            link.click();
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const filteredEquipment = equipment.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const badges = {
            available: 'badge-success',
            assigned: 'badge-info',
            maintenance: 'badge-warning',
            retired: 'badge-danger',
        };
        return badges[status] || 'badge-info';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user.role === 'employee' ? 'My Equipment' : 'All Equipment'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {user.role === 'employee'
                                ? `You have ${filteredEquipment.length} items assigned`
                                : `${filteredEquipment.length} items total`
                            }
                        </p>
                    </div>
                    {(user.role === 'admin' || user.role === 'hr') && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-primary flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Equipment
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input"
                        >
                            <option value="">All Status</option>
                            <option value="available">Available</option>
                            <option value="assigned">Assigned</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="retired">Retired</option>
                        </select>
                    </div>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEquipment.map((item) => (
                        <div key={item._id} className="card hover:shadow-2xl transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-600">{item.type}</p>
                                </div>
                                <span className={`badge ${getStatusBadge(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Serial:</span> {item.serialNumber}
                                </p>
                                {item.brand && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Brand:</span> {item.brand}
                                    </p>
                                )}
                                {item.assignedTo && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Assigned to:</span> {item.assignedTo.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => downloadQRCode(item)}
                                    className="flex-1 btn btn-secondary text-sm py-2"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    QR Code
                                </button>
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn btn-danger text-sm py-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEquipment.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No equipment found</p>
                    </div>
                )}
            </div>

            {/* Add Equipment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Equipment</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input"
                                    >
                                        <option>Laptop</option>
                                        <option>Monitor</option>
                                        <option>Keyboard</option>
                                        <option>Mouse</option>
                                        <option>Headset</option>
                                        <option>Webcam</option>
                                        <option>Docking Station</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number *</label>
                                    <input
                                        type="text"
                                        value={formData.serialNumber}
                                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                                    <input
                                        type="date"
                                        value={formData.purchaseDate}
                                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                                    <input
                                        type="number"
                                        value={formData.purchasePrice}
                                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        className="input"
                                    >
                                        <option value="excellent">Excellent</option>
                                        <option value="good">Good</option>
                                        <option value="fair">Fair</option>
                                        <option value="poor">Poor</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input"
                                    rows="3"
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button type="submit" className="flex-1 btn btn-primary">
                                    Add Equipment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentList;
