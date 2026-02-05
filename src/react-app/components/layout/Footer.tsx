import { Link } from '@tanstack/react-router';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/category/$slug" params={{ slug: 'women' }}>Women</Link></li>
            <li><Link to="/category/$slug" params={{ slug: 'men' }}>Men</Link></li>
            <li><Link to="/category/$slug" params={{ slug: 'accessories' }}>Accessories</Link></li>
            <li><Link to="/category/$slug" params={{ slug: 'sale' }}>Sale</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>About</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/sustainability">Sustainability</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <ul>
            <li><a href="/newsletter">Newsletter</a></li>
            <li><a href="https://instagram.com/casualchicboutique" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://facebook.com/casualchicboutique" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://pinterest.com/casualchicboutique" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Casual Chic Boutique. All rights reserved.</p>
      </div>
    </footer>
  );
};
