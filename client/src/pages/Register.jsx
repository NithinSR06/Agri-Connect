import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'consumer',
        location_lat: '',
        location_lng: '',
        location_text: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const roleParam = searchParams.get('role');
        if (roleParam === 'farmer' || roleParam === 'consumer') {
            setFormData(prev => ({ ...prev, role: roleParam }));
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.location_lat || !formData.location_lng) {
            // For demo, if lat/lng not provided, maybe mock it or ask user?
            // Let's just default to a central location if empty for demo purposes or require it.
            // Requirement says: "Location (text + map picker if possible)".
            // I will add a simple "Get Current Location" button.
        }

        const res = await register(formData);
        if (res.success) {
            if (res.user.role === 'farmer') {
                navigate('/farmer-dashboard');
            } else if (res.user.role === 'consumer') {
                navigate('/marketplace');
            } else {
                navigate('/');
            }
        } else {
            setError(res.message);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        location_lat: position.coords.latitude,
                        location_lng: position.coords.longitude,
                        location_text: 'Current Location' // In real app, reverse geocode this
                    });
                },
                (error) => {
                    setError('Unable to retrieve location. Please enter manually or allow access.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Join AgriConnect</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">I am a...</label>
                        <select
                            name="role"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="consumer">Consumer (Buyer)</option>
                            <option value="farmer">Farmer (Seller)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Location</label>
                        <div className="flex gap-2 mb-2">
                            <button type="button" onClick={getLocation} className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
                                📍 Get Current Location
                            </button>
                        </div>
                        <input
                            type="text"
                            name="location_text"
                            placeholder="City/Area Name"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary mb-2"
                            value={formData.location_text}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="location_lat"
                                placeholder="Latitude"
                                className="w-1/2 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary text-sm"
                                value={formData.location_lat}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="location_lng"
                                placeholder="Longitude"
                                className="w-1/2 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary text-sm"
                                value={formData.location_lng}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Coordinates required for local discovery.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded hover:bg-green-800 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
