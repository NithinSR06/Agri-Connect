import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Fresh from Farm to Table</h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        AgriConnect bridges the gap between local farmers and consumers.
                        Get fresh, high-quality produce directly from the source while supporting your local community.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register?role=consumer" className="bg-accent text-primary font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition">
                            I am a Buyer
                        </Link>
                        <Link to="/register?role=farmer" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-primary transition">
                            I am a Farmer
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose AgriConnect?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Local Discovery</h3>
                            <p className="text-gray-600">Find fresh produce within 20km of your location. Know exactly where your food comes from.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
                            <p className="text-gray-600">Farmers get 90% of the retail price. Consumers get better rates than supermarkets.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Freshness Guaranteed</h3>
                            <p className="text-gray-600">See harvest dates and freshness indicators before you buy. Farm fresh quality every time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-primary">For Consumers</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                                    <p>Set your location to find nearby farms.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                                    <p>Browse fresh produce and add to cart.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                                    <p>Choose a delivery slot and pay securely.</p>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-primary">For Farmers</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                                    <p>List your crops with harvest dates and prices.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                                    <p>Receive orders directly from local buyers.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                                    <p>Pack and deliver to earn better margins.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
