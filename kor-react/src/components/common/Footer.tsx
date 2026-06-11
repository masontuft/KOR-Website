import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer">
        <p className="footer-copy">KOR &copy; {new Date().getFullYear()} - Mason Tuft</p>
        <h3>
          <Link className="link" to="/articles">
            Articles
          </Link>
        </h3>
        <h3>
          <Link className="link" to="/contact">
            Contact Us
          </Link>
        </h3>
        <div className="social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/facebook.png" alt="FB Icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/instagram.png" alt="Instagram Icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
