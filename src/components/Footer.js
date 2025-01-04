import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const hideFooterPaths = ['/login', '/register'];

    if (hideFooterPaths.includes(location.pathname)) {
        return null;
    }

    // Add temporary inline styles to debug
    const footerStyle = {
        position: 'relative',
        width: '100%',
        padding: '1.5rem',
        background: '#111111',
        textAlign: 'center',
        borderTop: '1px solid #333333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const contentStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const textStyle = {
        fontFamily: 'Arial, sans-serif',
        color: '#999999',
        fontSize: '1.2rem',
        fontWeight: 500,
        margin: 0
    };

    const watermarkStyle = {
        fontFamily: 'Arial, sans-serif',
        color: '#666666',
        fontSize: '0.8rem',
        margin: '0.2rem 0 0 0'
    };

    return (
        <footer className="footer" style={footerStyle}>
            <div className="footer-content" style={contentStyle}>
                <p className="footer-text" style={textStyle}>Five Star Stash</p>
                <p className="watermark" style={watermarkStyle}>© 2025 All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer; 