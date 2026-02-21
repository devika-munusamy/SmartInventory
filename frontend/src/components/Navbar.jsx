import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                                <span className="text-white font-bold text-xl">SI</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">
                                Smart Inventory
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                            Dashboard
                        </Link>
                        <Link to="/equipment" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                            Equipment
                        </Link>
                        <Link to="/assignments" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                            Assignments
                        </Link>
                        {(user?.role === 'admin' || user?.role === 'hr') && (
                            <>
                                <Link to="/users" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                    Users
                                </Link>
                                <Link to="/maintenance" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                    Maintenance
                                </Link>
                                <Link to="/analytics" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                    Analytics
                                </Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/audit" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                Audit
                            </Link>
                        )}

                        <Link to="/notifications" className="p-2 rounded-full hover:bg-gray-100">
                            <Bell className="w-5 h-5 text-gray-700" />
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <User className="w-5 h-5 text-gray-700" />
                                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.role}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
