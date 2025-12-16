import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="*" element={<Home />} /> {/* Fallback */}
          </Routes>
        </main>
        <footer style={{ textAlign: 'center', padding: '2rem', color: '#888', borderTop: '1px solid #eee' }}>
          <p>&copy; 2025 Farm Connect. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
