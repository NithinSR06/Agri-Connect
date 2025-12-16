import { MapPin, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const getFreshness = (date) => {
        const harvest = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - harvest);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return { label: 'Harvested Today', color: 'bg-green-100 text-green-800' };
        if (diffDays <= 2) return { label: '1 Day Ago', color: 'bg-blue-100 text-blue-800' };
        return { label: `${diffDays} Days Ago`, color: 'bg-yellow-100 text-yellow-800' };
    };

    const freshness = getFreshness(product.harvest_date);

    const handleIncrement = () => {
        addToCart(product);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else {
            removeFromCart(product.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
            <div className="h-48 bg-gray-200 relative">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.crop_name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${freshness.color}`}>
                    {freshness.label}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{product.crop_name}</h3>
                    <div className="text-right">
                        <span className="block text-lg font-bold text-primary">₹{product.price_per_kg}</span>
                        <span className="text-xs text-gray-500">per kg</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <MapPin size={14} /> {product.location_text || 'Unknown Location'}
                </p>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>

                <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs text-gray-500">By {product.farmer_name}</span>

                    {product.available_qty > 0 ? (
                        quantity === 0 ? (
                            <button
                                onClick={handleIncrement}
                                className="bg-white border border-primary text-primary px-6 py-2 rounded-lg font-bold hover:bg-green-50 transition shadow-sm uppercase text-sm"
                            >
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center bg-primary text-white rounded-lg shadow-sm overflow-hidden">
                                <button
                                    onClick={handleDecrement}
                                    className="px-3 py-2 hover:bg-green-800 transition flex items-center justify-center"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-2 font-bold min-w-[30px] text-center">{quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="px-3 py-2 hover:bg-green-800 transition flex items-center justify-center"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        )
                    ) : (
                        <span className="text-red-500 font-bold text-sm px-4 py-2">Out of Stock</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
