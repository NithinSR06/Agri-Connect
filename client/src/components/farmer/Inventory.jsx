import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Inventory = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        crop_name: '',
        price_per_kg: '',
        available_qty: '',
        harvest_date: '',
        description: '',
        image_url: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/my-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending Add Product request...');
            // FIXED: Route is /api/products, not /api/products/add
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Product added successfully!');
            setIsAdding(false);
            setFormData({ crop_name: '', price_per_kg: '', available_qty: '', harvest_date: '', description: '', image_url: '' });
            fetchProducts();
        } catch (error) {
            console.error('Add product error:', error);
            alert(`Failed to add product: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Inventory</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-800"
                >
                    <Plus size={18} /> Add Produce
                </button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="font-bold mb-4">Add New Produce</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Crop Name (e.g., Tomatoes)"
                            className="p-2 border rounded"
                            value={formData.crop_name}
                            onChange={e => setFormData({ ...formData, crop_name: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price per kg (₹)"
                            className="p-2 border rounded"
                            value={formData.price_per_kg}
                            onChange={e => setFormData({ ...formData, price_per_kg: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Available Quantity (kg)"
                            className="p-2 border rounded"
                            value={formData.available_qty}
                            onChange={e => setFormData({ ...formData, available_qty: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Harvest Date"
                            className="p-2 border rounded"
                            value={formData.harvest_date}
                            onChange={e => setFormData({ ...formData, harvest_date: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Image URL (Optional)"
                            className="p-2 border rounded md:col-span-2"
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="p-2 border rounded md:col-span-2"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-green-800">Save Product</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Crop</th>
                            <th className="p-3">Price/kg</th>
                            <th className="p-3">Qty (kg)</th>
                            <th className="p-3">Harvest Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No products listed yet.</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{product.crop_name}</td>
                                    <td className="p-3">₹{product.price_per_kg}</td>
                                    <td className="p-3">{product.available_qty}</td>
                                    <td className="p-3">{product.harvest_date}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${product.available_qty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.available_qty > 0 ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        {/* Edit button placeholder - for full implementation would open modal */}
                                        <button className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
