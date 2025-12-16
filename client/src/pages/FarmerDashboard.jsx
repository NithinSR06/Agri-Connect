import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Inventory from '../components/farmer/Inventory';
import FarmerOrders from '../components/farmer/FarmerOrders';
import Earnings from '../components/farmer/Earnings';
import { Package, ShoppingBag, DollarSign } from 'lucide-react';

const FarmerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('inventory');

    if (!user || user.role !== 'farmer') {
        return <div className="p-8 text-center text-red-600">Access Denied. Farmer account required.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-6">Farmer Dashboard</h1>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-64 bg-white rounded-lg shadow-md h-fit">
                    <div className="p-4 border-b">
                        <h2 className="font-bold text-lg">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.location_text}</p>
                    </div>
                    <nav className="flex flex-col p-2">
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`flex items-center gap-3 p-3 rounded-md text-left transition ${activeTab === 'inventory' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
                        >
                            <Package size={20} /> Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-3 p-3 rounded-md text-left transition ${activeTab === 'orders' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
                        >
                            <ShoppingBag size={20} /> Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('earnings')}
                            className={`flex items-center gap-3 p-3 rounded-md text-left transition ${activeTab === 'earnings' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
                        >
                            <DollarSign size={20} /> Earnings
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-lg shadow-md p-6 min-h-[500px]">
                    {activeTab === 'inventory' && <Inventory />}
                    {activeTab === 'orders' && <FarmerOrders />}
                    {activeTab === 'earnings' && <Earnings />}
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
