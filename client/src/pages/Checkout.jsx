import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        delivery_address: user?.location_text || '',
        delivery_slot: '',
        payment_method: 'COD',
        payment_reference: ''
    });

    if (cart.length === 0) {
        return <div className="p-8 text-center">Your cart is empty. <a href="/marketplace" className="text-primary font-bold">Go Shopping</a></div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to place an order');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                farmer_id: item.farmer_id
            }));

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
                items,
                ...formData
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            clearCart();
            alert('Order placed successfully!');
            navigate('/consumer-dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.crop_name} x {item.quantity}kg</span>
                                <span>₹{item.price_per_kg * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Delivery & Payment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Delivery Address</label>
                            <textarea
                                className="w-full border p-2 rounded"
                                rows="3"
                                value={formData.delivery_address}
                                onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Preferred Delivery Slot</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={formData.delivery_slot}
                                onChange={e => setFormData({ ...formData, delivery_slot: e.target.value })}
                                required
                            >
                                <option value="">Select a slot</option>
                                <option value="Today 9AM - 12PM">Today 9AM - 12PM</option>
                                <option value="Today 2PM - 5PM">Today 2PM - 5PM</option>
                                <option value="Tomorrow 9AM - 12PM">Tomorrow 9AM - 12PM</option>
                                <option value="Tomorrow 2PM - 5PM">Tomorrow 2PM - 5PM</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Payment Method</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={formData.payment_method === 'COD'}
                                        onChange={() => setFormData({ ...formData, payment_method: 'COD' })}
                                    />
                                    Cash on Delivery
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="UPI"
                                        checked={formData.payment_method === 'UPI'}
                                        onChange={() => setFormData({ ...formData, payment_method: 'UPI' })}
                                    />
                                    UPI
                                </label>
                            </div>
                        </div>

                        {formData.payment_method === 'UPI' && (
                            <div>
                                <label className="block text-gray-700 mb-2">UPI Reference ID</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    placeholder="Enter transaction ID"
                                    value={formData.payment_reference}
                                    onChange={e => setFormData({ ...formData, payment_reference: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-green-800 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
