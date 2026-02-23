import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';

const navLinkClass = ({ isActive }) =>
    isActive
        ? 'text-primary-600 bg-primary-50 px-3 py-2 rounded-md font-semibold transition-colors duration-150'
        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100 px-3 py-2 rounded-md font-medium transition-colors duration-150';

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

                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/dashboard" className={navLinkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/equipment" className={navLinkClass}>
                            Equipment
                        </NavLink>
                        <NavLink to="/assignments" className={navLinkClass}>
                            Assignments
                        </NavLink>
                        {(user?.role === 'admin' || user?.role === 'hr') && (
                            <>
                                <NavLink to="/users" className={navLinkClass}>
                                    Users
                                </NavLink>
                                <NavLink to="/maintenance" className={navLinkClass}>
                                    Maintenance
                                </NavLink>
                                <NavLink to="/analytics" className={navLinkClass}>
                                    Analytics
                                </NavLink>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <NavLink to="/audit" className={navLinkClass}>
                                Audit
                            </NavLink>
                        )}

                        <NavLink
                            to="/notifications"
                            className={({ isActive }) =>
                                `p-2 rounded-full transition-colors duration-150 ${isActive ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100 text-gray-700'}`
                            }
                        >
                            <Bell className="w-5 h-5" />
                        </NavLink>

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
