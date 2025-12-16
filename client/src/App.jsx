import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';

import FarmerDashboard from './pages/FarmerDashboard';

import Marketplace from './pages/Marketplace';

import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';

import ConsumerDashboard from './pages/ConsumerDashboard';

import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Consumer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['consumer']} />}>
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
              </Route>

              {/* Farmer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
                <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
