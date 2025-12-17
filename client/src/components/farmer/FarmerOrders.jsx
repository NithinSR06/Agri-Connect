import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Truck, Package } from 'lucide-react';

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/farmer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchOrders();
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Incoming Orders</h2>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p className="text-gray-500">No orders yet.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order.uuid.slice(0, 8)}</h3>
                                    <p className="text-sm text-gray-500">From: {order.buyer_name} ({order.buyer_location})</p>
                                    <p className="text-sm text-gray-500">Slot: {order.delivery_slot}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'Accepted' || order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'Packed' ? 'bg-purple-100 text-purple-800' :
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded mb-4">
                                <h4 className="font-semibold text-sm mb-2">Items:</h4>
                                <ul className="space-y-1">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span>{item.crop_name} x {item.quantity}kg</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-2 justify-end">
                                {order.status === 'Pending' && (
                                    <>
                                        <button onClick={() => updateStatus(order.id, 'Rejected')} className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 flex items-center gap-1">
                                            <X size={16} /> Reject
                                        </button>
                                        <button onClick={() => updateStatus(order.id, 'Accepted')} className="px-4 py-2 bg-primary text-white rounded hover:bg-green-800 flex items-center gap-1">
                                            <Check size={16} /> Accept
                                        </button>
                                    </>
                                )}
                                {(order.status === 'Accepted' || order.status === 'Processing') && (
                                    <button onClick={() => updateStatus(order.id, 'Packed')} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1">
                                        <Package size={16} /> Mark Packed
                                    </button>
                                )}
                                {order.status === 'Packed' && (
                                    <button onClick={() => updateStatus(order.id, 'Delivered')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1">
                                        <Truck size={16} /> Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FarmerOrders;
