import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Wrench, Calendar, Plus } from 'lucide-react';
import api from '../utils/api';

const MaintenanceSchedule = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        equipment: '',
        type: 'routine',
        scheduledDate: '',
        priority: 'medium',
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [maintenanceRes, equipmentRes] = await Promise.all([
                api.get('/maintenance'),
                api.get('/equipment'),
            ]);
            setMaintenance(maintenanceRes.data.data);
            setEquipment(equipmentRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance', formData);
            setShowModal(false);
            setFormData({ equipment: '', type: 'routine', scheduledDate: '', priority: 'medium', notes: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error scheduling maintenance');
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.put(`/maintenance/${id}`, { status: 'completed', completedDate: new Date() });
            fetchData();
        } catch (error) {
            alert('Error updating maintenance');
        }
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Maintenance Schedule</h1>
                        <p className="text-gray-600 mt-2">{maintenance.length} scheduled tasks</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Schedule Maintenance
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maintenance.map((task) => (
                        <div key={task._id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                        <Wrench className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{task.equipment?.name}</h3>
                                        <p className="text-sm text-gray-600">{task.type}</p>
                                    </div>
                                </div>
                                <span className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                    {task.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(task.scheduledDate).toLocaleDateString()}
                                </div>
                                <p className="text-sm text-gray-600">Priority: <span className="font-medium">{task.priority}</span></p>
                                {task.notes && <p className="text-sm text-gray-600">{task.notes}</p>}
                            </div>

                            {task.status !== 'completed' && (
                                <button
                                    onClick={() => handleComplete(task._id)}
                                    className="w-full btn btn-success text-sm"
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Maintenance</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment *</label>
                                <select
                                    value={formData.equipment}
                                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Equipment</option>
                                    {equipment.map((item) => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="input"
                                >
                                    <option value="routine">Routine</option>
                                    <option value="repair">Repair</option>
                                    <option value="upgrade">Upgrade</option>
                                    <option value="inspection">Inspection</option>
                                    <option value="cleaning">Cleaning</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
                                <input
                                    type="date"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="input"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
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
                                <button type="submit" className="flex-1 btn btn-primary">Schedule</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceSchedule;
