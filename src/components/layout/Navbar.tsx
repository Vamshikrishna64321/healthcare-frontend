// ============================================
// CareSync • Navbar.tsx
// Modern Clean Navbar + Stethoscope Logo
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, Stethoscope } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center space-x-2">

                        {/* New Stethoscope Icon */}
                        <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-2 rounded-xl shadow-[0_0_12px_rgba(56,189,248,0.6)]">
                            <Stethoscope size={24} className="text-white" />
                        </div>

                        {/* App Name */}
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                            CareSync
                        </span>
                    </Link>

                    {/* DESKTOP NAV LINKS */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>

                        {isAuthenticated && (
                            <>
                                {/* Patient Links */}
                                {user?.role === 'patient' && (
                                    <>
                                        <Link
                                            to="/doctors"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Find Doctors
                                        </Link>
                                        <Link
                                            to="/patient/appointments"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            My Appointments
                                        </Link>
                                    </>
                                )}

                                {/* Doctor Links */}
                                {user?.role === 'doctor' && (
                                    <>
                                        <Link
                                            to="/doctor/dashboard"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/doctor/appointments"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Appointments
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* RIGHT SIDE (AUTH) */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                {/* User Badge */}
                                <div className="hidden md:flex items-center space-x-2 text-sm">
                                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                        {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                                    </div>
                                    <span className="text-gray-700">
                                        {user.profile.firstName} {user.profile.lastName}
                                    </span>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isAuthenticated && (
                <div className="md:hidden bg-gray-50 px-4 py-3 border-t">
                    <div className="text-sm text-gray-700 mb-2">
                        {user?.profile.firstName} {user?.profile.lastName} ({user?.role})
                    </div>
                    <div className="space-y-2">

                        {/* Patient */}
                        {user?.role === 'patient' && (
                            <>
                                <Link
                                    to="/doctors"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Find Doctors
                                </Link>
                                <Link
                                    to="/patient/appointments"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    My Appointments
                                </Link>
                            </>
                        )}

                        {/* Doctor */}
                        {user?.role === 'doctor' && (
                            <>
                                <Link
                                    to="/doctor/dashboard"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/doctor/appointments"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Appointments
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
