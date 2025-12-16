import { useState, useEffect } from 'react';
import axios from 'axios';

const Earnings = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Reusing getFarmerOrders for now, ideally backend should have a dedicated earnings endpoint
        // or we calculate it here.
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/farmer-orders`, { // Reusing order endpoint for calc
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    const calculateEarnings = () => {
        let total = 0;
        let today = 0;
        const todayDate = new Date().toISOString().split('T')[0];

        orders.forEach(order => {
            if (order.status === 'Delivered') {
                const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                total += orderTotal;
                if (order.created_at.startsWith(todayDate)) {
                    today += orderTotal;
                }
            }
        });

        return { total, today };
    };

    const { total, today } = calculateEarnings();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Earnings Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-gray-600 font-medium">Total Earnings</h3>
                    <p className="text-3xl font-bold text-primary mt-2">₹{total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Lifetime</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-gray-600 font-medium">Today's Earnings</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">₹{today.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-gray-600 font-medium">Pending Payouts</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">₹0.00</p>
                    <p className="text-sm text-gray-500 mt-1">Processed weekly</p>
                </div>
            </div>

            <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Date</th>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Items</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter(o => o.status === 'Delivered').length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No completed transactions yet.</td></tr>
                        ) : (
                            orders.filter(o => o.status === 'Delivered').map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="p-3">#{order.uuid.slice(0, 8)}</td>
                                    <td className="p-3">{order.items.map(i => i.crop_name).join(', ')}</td>
                                    <td className="p-3 font-bold">₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</td>
                                    <td className="p-3 text-green-600">Paid</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Earnings;
