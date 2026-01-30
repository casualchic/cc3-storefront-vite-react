import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li><a href="/category/women">Women</a></li>
            <li><a href="/category/men">Men</a></li>
            <li><a href="/category/accessories">Accessories</a></li>
            <li><a href="/category/sale">Sale</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/returns">Returns</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>About</h3>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/sustainability">Sustainability</a></li>
            <li><a href="/careers">Careers</a></li>
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
