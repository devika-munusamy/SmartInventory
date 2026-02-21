import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import api from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Analytics = () => {
    const [utilization, setUtilization] = useState(null);
    const [trends, setTrends] = useState(null);
    const [costs, setCosts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [utilizationRes, trendsRes, costsRes] = await Promise.all([
                api.get('/analytics/equipment-utilization'),
                api.get('/analytics/assignment-trends'),
                api.get('/analytics/maintenance-costs'),
            ]);

            setUtilization(utilizationRes.data.data);
            setTrends(trendsRes.data.data);
            setCosts(costsRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
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

    const utilizationData = {
        labels: utilization?.map(item => item._id) || [],
        datasets: [{
            data: utilization?.map(item => item.count) || [],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        }],
    };

    const trendsData = {
        labels: trends?.map(item => `${item._id.month}/${item._id.year}`) || [],
        datasets: [{
            label: 'Assignments',
            data: trends?.map(item => item.count) || [],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
        }],
    };

    const costsData = {
        labels: costs?.breakdown?.map(item => item._id) || [],
        datasets: [{
            label: 'Cost ($)',
            data: costs?.breakdown?.map(item => item.totalCost) || [],
            backgroundColor: '#f59e0b',
        }],
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment Utilization</h2>
                        {utilization && <Pie data={utilizationData} />}
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Assignment Trends</h2>
                        {trends && <Line data={trendsData} />}
                    </div>

                    <div className="card lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Maintenance Costs</h2>
                        {costs && (
                            <>
                                <Bar data={costsData} />
                                <p className="text-center mt-4 text-lg font-semibold text-gray-900">
                                    Total: ${costs.total?.toFixed(2)}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
