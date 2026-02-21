import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Bell, Check } from 'lucide-react';
import api from '../utils/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error:', error);
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`card ${!notification.read ? 'border-l-4 border-primary-600' : ''}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'assignment' ? 'bg-blue-100' :
                                            notification.type === 'return' ? 'bg-green-100' :
                                                notification.type === 'maintenance' ? 'bg-yellow-100' : 'bg-gray-100'
                                        }`}>
                                        <Bell className={`w-5 h-5 ${notification.type === 'assignment' ? 'text-blue-600' :
                                                notification.type === 'return' ? 'text-green-600' :
                                                    notification.type === 'maintenance' ? 'text-yellow-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{notification.title}</h3>
                                        <p className="text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="btn btn-secondary text-sm"
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        Mark Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
