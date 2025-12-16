import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

const Marketplace = () => {
    const [filter, setFilter] = useState('All');

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    const categories = ['All', 'Fruits', 'Vegetables', 'Dairy'];

    const handleAddToCart = (product) => {
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <div style={styles.header}>
                <h1 style={styles.title}>Marketplace</h1>
                <div style={styles.filters}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                ...styles.filterBtn,
                                backgroundColor: filter === cat ? 'var(--primary)' : 'transparent',
                                color: filter === cat ? 'white' : 'var(--dark)',
                                borderColor: filter === cat ? 'var(--primary)' : '#ddd',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center" style={{ padding: '4rem' }}>
                    <h3>No products found in this category.</h3>
                </div>
            )}
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
    },
    filters: {
        display: 'flex',
        gap: '0.5rem',
    },
    filterBtn: {
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
    }
};

export default Marketplace;
