import React, { useState } from 'react';
import StructuredData from '../common/StructuredData';
import posthog from '../../lib/posthog';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Use Formspree to handle form submission
      const formspreeId = process.env.REACT_APP_FORMSPREE_ID || 'myyvklzv';
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message,
          _replyto: formData.email,
          _subject: `KOR Contact Form: ${formData.subject || 'General Inquiry'}`
        }),
      });
      
      if (response.ok) {
        posthog.capture('contact_message_submitted', {
          subject: formData.subject || 'none',
          message_length: formData.message.length
        });
        setSubmitMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setCharacterCount(0);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      posthog.captureException(error as Error);
      console.error('Form submission error:', error);
      setSubmitMessage('Error sending message. Please check your connection and try again, or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'message') {
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <StructuredData
        type="website"
        pageTitle="Contact Us — KOR"
        pageDescription="Get in touch with the KOR team for support, partnerships, and feedback."
        url={`${baseUrl}/contact`}
      />
      <h1 style={{ color: 'black' }}>Contact Us</h1>
      <h3 className="paragraph" style={{ color: 'black' }}>
        We love questions and feedback - and we're always happy to help! Here
        are some ways to contact us
      </h3>
      <h1 className="title" style={{ color: 'black' }}>Here are the founders below</h1>
      
      <div className="contact-content">
        <div className="contact-card">
          <h1>Mason Tuft</h1>
          <img
            src="/images/Mason_riding_moab_1.0.png"
            alt="Mason"
            className="image_100"
          />
          <h3 className="title">Developer/CEO</h3>
          <h3 className="title">
            Email at{' '}
            <a
              href="mailto:masontuft@jmrcycling.com"
              style={{ color: 'white', textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              masontuft@jmrcycling.com
            </a>
          </h3>
        </div>
        
        <div className="contact-card">
          <h1>Robert Tuft</h1>
          <img src="/images/robert_riding.JPG" alt="Robert" className="image_100" />
          <h3 className="title">Senior Developer/CIO</h3>
          <h3 className="title">
            Email at{' '}
            <a
              href="mailto:roberttuft@jmrcycling.com"
              style={{ color: 'white', textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              roberttuft@jmrcycling.com
            </a>
          </h3>
        </div>
      </div>
      
      <div className="contact-form-container">
        <h2 className="form-title">Send Us a Message</h2>
        
        {submitMessage && (
          <div className={`form-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
            {submitMessage}
          </div>
        )}
        
        <form
          action="https://formspree.io/f/myyvklzv"
          method="post"
          name="EmailForm"
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">Full Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select 
              id="subject" 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select a topic (optional)</option>
              <option value="app-support">App Support</option>
              <option value="shop-partnership">Shop Partnership</option>
              <option value="general-inquiry">General Inquiry</option>
              <option value="bug-report">Bug Report</option>
              <option value="feature-request">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message <span className="required">*</span></label>
            <textarea
              id="message"
              name="message"
              placeholder="Your question or feedback..."
              rows={6}
              maxLength={500}
              value={formData.message}
              onChange={handleChange}
              required
            />
            <div className="char-counter">
              <span>{characterCount}</span>/500 characters
            </div>
          </div>
          
          <div className="form-group">
            <button 
              className="submit-button" 
              type="submit" 
              disabled={isSubmitting}
            >
              <span className="btn-text">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </span>
              {isSubmitting && <span className="btn-spinner"></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
