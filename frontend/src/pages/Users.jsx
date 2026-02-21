import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Trash2, Shield, Mail, Building, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const Users = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleDeactivate = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;

        try {
            await api.put(`/users/${id}`, { isActive: !currentStatus });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating user status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting user');
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
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">{users.length} registered users</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div key={user._id} className={`card ${!user.isActive ? 'opacity-60 bg-gray-100' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-red-100 text-red-600' :
                                            user.role === 'hr' ? 'bg-purple-100 text-purple-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'hr' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                    {user.isActive ? 'Active' : 'Deactivated'}
                                </span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {user.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Building className="w-4 h-4 mr-2" />
                                    {user.department || 'No Department'}
                                </div>
                            </div>

                            {currentUser._id !== user._id && currentUser.role === 'admin' && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleDeactivate(user._id, user.isActive)}
                                        className={`flex-1 btn text-sm py-2 ${user.isActive ? 'btn-secondary' : 'btn-success'
                                            }`}
                                    >
                                        {user.isActive ? (
                                            <><XCircle className="w-4 h-4 mr-1 inline" /> Deactivate</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4 mr-1 inline" /> Activate</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-danger text-sm py-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
