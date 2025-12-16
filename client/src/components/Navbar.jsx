import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                    🌱 AgriConnect
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {(!user || user.role === 'consumer') && (
                        <Link to="/marketplace" className="hover:text-secondary">Marketplace</Link>
                    )}
                    {user && user.role === 'farmer' && (
                        <Link to="/farmer-dashboard" className="hover:text-secondary">Dashboard</Link>
                    )}
                    {user && user.role === 'consumer' && (
                        <Link to="/consumer-dashboard" className="hover:text-secondary">My Orders</Link>
                    )}

                    <Link to="/checkout" className="relative hover:text-secondary">
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="font-medium">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-200">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="hover:text-secondary">Login</Link>
                            <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-full font-bold hover:bg-gray-100">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary pb-4 px-4 flex flex-col gap-3">
                    <Link to="/marketplace" className="py-2 border-b border-green-600">Marketplace</Link>
                    {user && user.role === 'farmer' && (
                        <Link to="/farmer-dashboard" className="py-2 border-b border-green-600">Dashboard</Link>
                    )}
                    {user && user.role === 'consumer' && (
                        <Link to="/consumer-dashboard" className="py-2 border-b border-green-600">My Orders</Link>
                    )}
                    <Link to="/checkout" className="py-2 border-b border-green-600 flex items-center gap-2">
                        <ShoppingCart size={20} /> Cart ({cart.length})
                    </Link>
                    {user ? (
                        <button onClick={handleLogout} className="text-left py-2 text-red-200">Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="py-2">Login</Link>
                            <Link to="/register" className="py-2 font-bold">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
