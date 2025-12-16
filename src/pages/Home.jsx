import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section style={styles.hero}>
                <div className="container" style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Fresh from the Farm,<br />Straight to Your Table</h1>
                    <p style={styles.heroSubtitle}>
                        Connect directly with local farmers and discover the freshest organic produce in your area.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/marketplace" className="btn btn-primary" style={styles.heroBtn}>
                            Shop Now
                        </Link>
                        <button className="btn btn-outline" style={{ ...styles.heroBtn, borderColor: 'white', color: 'white' }}>
                            Learn More
                        </button>
                    </div>
                </div>
                <div style={styles.overlay}></div>
            </section>

            {/* Featured Categories */}
            <section className="container" style={styles.section}>
                <h2 className="text-center mb-4" style={styles.sectionTitle}>Browse Categories</h2>
                <div className="grid grid-cols-3">
                    {categories.map((cat) => (
                        <div key={cat.name} style={styles.categoryCard}>
                            <img src={cat.image} alt={cat.name} style={styles.categoryImage} />
                            <div style={styles.categoryOverlay}>
                                <h3 style={styles.categoryName}>{cat.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Value Props */}
            <section style={{ backgroundColor: 'var(--white)', padding: '4rem 0' }}>
                <div className="container grid grid-cols-3">
                    <div className="text-center">
                        <div style={styles.icon}>🌱</div>
                        <h3>100% Organic</h3>
                        <p style={styles.propText}>Certified organic produce from trusted local farmers.</p>
                    </div>
                    <div className="text-center">
                        <div style={styles.icon}>🚜</div>
                        <h3>Support Local</h3>
                        <p style={styles.propText}>Directly support small-scale farmers in your community.</p>
                    </div>
                    <div className="text-center">
                        <div style={styles.icon}>🚚</div>
                        <h3>Fast Delivery</h3>
                        <p style={styles.propText}>Farm-fresh delivery within 24 hours of harvest.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const categories = [
    { name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400' },
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=400' },
    { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400' },
];

const styles = {
    hero: {
        position: 'relative',
        height: '500px',
        backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        marginBottom: '4rem',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1,
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
    },
    heroTitle: {
        fontSize: '3.5rem',
        fontWeight: '800',
        marginBottom: '1rem',
        lineHeight: 1.2,
    },
    heroSubtitle: {
        fontSize: '1.2rem',
        marginBottom: '2rem',
        maxWidth: '600px',
        opacity: 0.9,
    },
    heroButtons: {
        display: 'flex',
        gap: '1rem',
    },
    heroBtn: {
        padding: '12px 30px',
        fontSize: '1.1rem',
    },
    section: {
        padding: '2rem 0 4rem',
    },
    sectionTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--dark)',
    },
    categoryCard: {
        position: 'relative',
        height: '250px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s',
    },
    categoryOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        color: 'white',
    },
    categoryName: {
        margin: 0,
        fontSize: '1.5rem',
    },
    icon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    propText: {
        color: 'var(--gray)',
    }
};

export default Home;
