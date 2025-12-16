import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <Link to="/" style={styles.logo}>
                    Farm<span style={{ color: 'var(--primary)' }}>Connect</span>
                </Link>
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Home</Link>
                    <Link to="/marketplace" style={styles.link}>Marketplace</Link>
                    <Link to="/profile" style={styles.link}>Profile</Link>
                    <button className="btn btn-primary" style={styles.cartBtn}>
                        Cart (0)
                    </button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        zIndex: 1000,
        padding: '1rem 0',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--dark)',
        letterSpacing: '-0.5px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    link: {
        fontWeight: '500',
        color: 'var(--dark)',
        transition: 'color 0.2s',
    },
    cartBtn: {
        padding: '8px 16px',
        fontSize: '0.9rem',
    }
};

export default Navbar;
