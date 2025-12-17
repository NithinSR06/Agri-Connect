import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ConsumerDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/consumer`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    if (!user || user.role !== 'consumer') {
        return <div className="p-8 text-center text-red-600">Access Denied. Consumer account required.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-6">My Orders</h1>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                        <a href="/marketplace" className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-green-800">
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order.uuid.slice(0, 8)}</h3>
                                    <p className="text-sm text-gray-500">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="mt-2 md:mt-0 text-right">
                                    <p className="font-bold text-xl">₹{order.total}</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'Accepted' || order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'Packed' ? 'bg-purple-100 text-purple-800' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{item.crop_name}</p>
                                            <p className="text-sm text-gray-500">Farmer: {item.farmer_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p>Qty: {item.quantity}kg</p>
                                            <p className="font-medium">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {order.status === 'Delivered' && (
                                <div className="mt-4 pt-4 border-t text-center md:text-right">
                                    <button className="text-primary font-bold hover:underline">Write a Review</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConsumerDashboard;
