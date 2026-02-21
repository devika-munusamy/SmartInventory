import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { Package, Users, CheckCircle, Wrench, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/analytics/dashboard');
            setStats(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {user.role === 'employee'
                            ? "Here's the status of your assigned equipment."
                            : "Here's what's happening with your inventory today."
                        }
                    </p>
                </div>

                {/* Employee Stats Grid */}
                {user.role === 'employee' && stats?.stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatsCard
                            title="My Equipment"
                            value={stats.stats.totalEquipment}
                            icon={Package}
                            gradient="gradient-primary"
                        />
                        <StatsCard
                            title="Active Assignments"
                            value={stats.stats.activeAssignments}
                            icon={CheckCircle}
                            gradient="gradient-success"
                        />
                        <StatsCard
                            title="Returned Items"
                            value={stats.stats.pastAssignments}
                            icon={Users}
                            gradient="gradient-secondary"
                        />
                    </div>
                )}

                {/* Admin/HR Stats Grid */}
                {(user.role === 'admin' || user.role === 'hr') && stats && !stats.isEmployee && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Equipment"
                            value={stats.equipment.total}
                            icon={Package}
                            gradient="gradient-primary"
                        />
                        <StatsCard
                            title="Available"
                            value={stats.equipment.available}
                            icon={CheckCircle}
                            gradient="gradient-success"
                        />
                        <StatsCard
                            title="Assigned"
                            value={stats.equipment.assigned}
                            icon={Users}
                            gradient="gradient-secondary"
                        />
                        <StatsCard
                            title="Maintenance"
                            value={stats.equipment.maintenance}
                            icon={Wrench}
                            gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
                        />
                    </div>
                )}

                {/* Recent Activity / Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Equipment by Type (Admin/HR Only) */}
                    {(user.role === 'admin' || user.role === 'hr') && stats && !stats.isEmployee && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment by Type</h2>
                            <div className="space-y-3">
                                {stats.equipment.byType.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-700">{item._id}</span>
                                        <span className="badge badge-info">{item.count} items</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href="/equipment"
                                className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-center"
                            >
                                <Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                <p className="font-medium text-primary-900">
                                    {user.role === 'employee' ? 'My Equipment' : 'View Equipment'}
                                </p>
                            </a>
                            <a
                                href="/assignments"
                                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
                            >
                                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <p className="font-medium text-purple-900">
                                    {user.role === 'employee' ? 'My Assignments' : 'Assignments'}
                                </p>
                            </a>
                            {(user.role === 'admin' || user.role === 'hr') && (
                                <>
                                    <a
                                        href="/maintenance"
                                        className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
                                    >
                                        <Wrench className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                        <p className="font-medium text-yellow-900">Maintenance</p>
                                    </a>
                                    <a
                                        href="/analytics"
                                        className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
                                    >
                                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="font-medium text-green-900">Analytics</p>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
