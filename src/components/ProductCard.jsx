import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div style={styles.card}>
            <div style={styles.imageContainer}>
                <img src={product.image} alt={product.name} style={styles.image} />
                <span style={styles.category}>{product.category}</span>
            </div>
            <div style={styles.content}>
                <div style={styles.header}>
                    <h3 style={styles.title}>{product.name}</h3>
                    <span style={styles.price}>${product.price}/{product.unit}</span>
                </div>
                <p style={styles.farmer}>By Farmer #{product.farmerId}</p> {/* Ideally fetch farmer name */}
                <p style={styles.description}>{product.description}</p>
                <button
                    className="btn btn-outline"
                    style={styles.button}
                    onClick={() => onAddToCart(product)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
    },
    imageContainer: {
        position: 'relative',
        height: '200px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s',
    },
    category: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    content: {
        padding: '1.5rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem',
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: '700',
        margin: 0,
    },
    price: {
        fontWeight: '700',
        color: 'var(--primary-dark)',
    },
    farmer: {
        fontSize: '0.9rem',
        color: 'var(--gray)',
        marginBottom: '0.5rem',
    },
    description: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: '1.5rem',
        flex: 1,
    },
    button: {
        width: '100%',
    }
};

export default ProductCard;
