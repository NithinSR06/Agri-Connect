import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Search, MapPin } from 'lucide-react';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        crop_name: '',
        radius: 20,
        lat: '',
        lng: '',
        location_text: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initial load - try to get user location or default
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFilters(prev => ({
                        ...prev,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        location_text: 'Current Location'
                    }));
                    fetchProducts(pos.coords.latitude, pos.coords.longitude);
                },
                () => fetchProducts() // Fallback without location
            );
        } else {
            fetchProducts();
        }
    }, []);

    const fetchProducts = async (lat, lng) => {
        setLoading(true);
        try {
            const params = {
                crop_name: filters.crop_name,
                radius: filters.radius,
                lat: lat || filters.lat,
                lng: lng || filters.lng
            };
            // Remove empty params
            Object.keys(params).forEach(key => !params[key] && delete params[key]);

            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, { params });
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const { cart, total } = useCart();

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2 font-medium">Search Produce</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                className="w-full pl-10 p-2 border rounded focus:outline-none focus:border-primary"
                                value={filters.crop_name}
                                onChange={e => setFilters({ ...filters, crop_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Search Radius (km)</label>
                        <select
                            className="w-full p-2 border rounded focus:outline-none focus:border-primary"
                            value={filters.radius}
                            onChange={e => setFilters({ ...filters, radius: e.target.value })}
                        >
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="20">20 km</option>
                            <option value="50">50 km</option>
                        </select>
                    </div>

                    <button type="submit" className="bg-primary text-white py-2 px-6 rounded hover:bg-green-800 transition font-bold">
                        Find Fresh
                    </button>
                </form>
                {filters.location_text && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        <MapPin size={14} /> Searching near: {filters.location_text}
                    </p>
                )}
            </div>

            {loading ? (
                <div className="text-center py-10">Loading fresh produce...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No produce found matching your criteria. Try increasing the radius.
                        </div>
                    ) : (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            )}

            {/* Sticky Cart Footer */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
                    <div className="container mx-auto flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">{cart.length} Items</p>
                            <p className="font-bold text-lg">₹{total}</p>
                        </div>
                        <a href="/checkout" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition flex items-center gap-2">
                            View Cart
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
