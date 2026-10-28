import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFound: React.FC = () => (
  <div className='page-container not-found'>
    <Helmet>
      <title>Page not found — KOR</title>
      <meta name='robots' content='noindex' />
    </Helmet>
    <h1>Page not found</h1>
    <p className='not-found-text'>
      We couldn't find the page you were looking for. It may have moved, or the
      link may be mistyped.
    </p>
    <nav className='not-found-links' aria-label='Helpful links'>
      <Link to='/'>Home</Link>
      <Link to='/our-app'>Our App</Link>
      <Link to='/faq'>FAQ</Link>
      <Link to='/contact'>Contact us</Link>
    </nav>
  </div>
);

export default NotFound;
