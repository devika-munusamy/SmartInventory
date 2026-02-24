import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { CheckCircle, Package, User } from 'lucide-react';
import api from '../utils/api';

const AssignmentList = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [formData, setFormData] = useState({
        equipment: '',
        user: '',
        notes: '',
    });
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [returnNotes, setReturnNotes] = useState('');
    const [decommission, setDecommission] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsRes, equipmentRes, usersRes] = await Promise.all([
                api.get('/assignments'),
                api.get('/equipment'),
                (user.role === 'admin' || user.role === 'hr') ? api.get('/users') : Promise.resolve({ data: { data: [] } }),
            ]);

            setAssignments(assignmentsRes.data.data);
            setEquipment(equipmentRes.data.data);
            setUsers(usersRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments', formData);
            setShowAssignModal(false);
            setFormData({ equipment: '', user: '', notes: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating assignment');
        }
    };

    const handleReturnSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/assignments/${selectedAssignment}/return`, {
                returnNotes,
                decommission
            });
            setShowReturnModal(false);
            setReturnNotes('');
            setDecommission(false);
            setSelectedAssignment(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error returning equipment');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'badge-info',
            returned: 'badge-success',
            overdue: 'badge-danger',
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                        <p className="text-gray-600 mt-2">{assignments.length} total assignments</p>
                    </div>
                    {(user.role === 'admin' || user.role === 'hr') && (
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="btn btn-primary"
                        >
                            New Assignment
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <div key={assignment._id} className="card hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{assignment.equipment?.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Serial: {assignment.equipment?.serialNumber}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <User className="w-4 h-4 mr-1" />
                                                {assignment.user?.name}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {assignment.returnNotes && (
                                            <p className="text-sm text-gray-500 mt-2 italic">
                                                Return Note: {assignment.returnNotes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`badge ${getStatusBadge(assignment.status)}`}>
                                        {assignment.status}
                                    </span>
                                    {assignment.status === 'active' && (user.role === 'admin' || user.role === 'hr') && (
                                        <button
                                            onClick={() => {
                                                setSelectedAssignment(assignment._id);
                                                setShowReturnModal(true);
                                            }}
                                            className="btn btn-success text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Return
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {assignments.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No assignments found</p>
                    </div>
                )}
            </div>

            {/* Assign Modal */}
            {showAssignModal && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setShowAssignModal(false)}
                >
                    <div className="bg-white rounded-xl max-w-md w-full p-6 border border-gray-300 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">New Assignment</h2>

                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment *</label>
                                <select
                                    value={formData.equipment}
                                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Equipment</option>
                                    {equipment.filter(e => e.status === 'available').map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} - {item.serialNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
                                <select
                                    value={formData.user}
                                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
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
                                <button type="submit" className="flex-1 btn btn-primary">
                                    Assign Equipment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                    onClick={() => { setShowReturnModal(false); setReturnNotes(''); }}
                >
                    <div className="bg-white rounded-xl max-w-md w-full p-6 border border-gray-300 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Return</h2>

                        <form onSubmit={handleReturnSubmit} className="space-y-4">
                            <p className="text-gray-600">Are you sure you want to confirm the return of this equipment?</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Return Notes (Optional)</label>
                                <textarea
                                    value={returnNotes}
                                    onChange={(e) => setReturnNotes(e.target.value)}
                                    placeholder="e.g., Condition: Good, Charger included"
                                    className="input"
                                    rows="3"
                                />
                            </div>

                            <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <input
                                    type="checkbox"
                                    id="decommission"
                                    checked={decommission}
                                    onChange={(e) => setDecommission(e.target.checked)}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <label htmlFor="decommission" className="text-sm font-medium text-yellow-800">
                                    Decommission hardware (Mark as Retired)
                                </label>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button type="submit" className="flex-1 btn btn-success">
                                    Confirm Return
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReturnModal(false);
                                        setReturnNotes('');
                                    }}
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

export default AssignmentList;
