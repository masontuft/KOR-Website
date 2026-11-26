import React, { useState } from 'react';
import StructuredData from '../common/StructuredData';

const faqs = [
  {
    question: 'I just bought a used bike — how can I track it accurately?',
    answer:
      'The app has a "Part Settings" page where you can manually set the wear percentage for used parts. We recommend having a bike shop estimate the condition of your components for the most accurate tracking.',
  },
  {
    question: 'Can I use this app without a shop?',
    answer:
      'Absolutely! You can use our free version or purchase a personal account plan. We do recommend getting a shop code from a participating bike shop — it unlocks additional features and enhanced support.',
  },
  {
    question: 'I lost my personal account code before entering it in the app. What now?',
    answer:
      'No problem. Contact us via email with your account information and we\'ll help you retrieve your personal account code.',
  },
  {
    question: 'What if I don\'t have every part — no dropper, no rear shock, etc.?',
    answer:
      'KOR is flexible. Use the bike settings page to customize which components you want to track based on your specific setup. You can easily add or remove suspension, dropper posts, tubeless sealant, and more.',
  },
  {
    question: 'How does the QR code system work?',
    answer:
      'Bike shops can generate a QR code from their KOR dashboard. When a customer scans it, they\'re taken straight to the app store with the shop code pre-filled — zero friction onboarding.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formspreeId = process.env.REACT_APP_FORMSPREE_ID || 'myyvklzv';
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.question,
          _replyto: formData.email,
          _subject: 'KOR FAQ Question',
        }),
      });

      if (response.ok) {
        setSubmitMessage("Question submitted! We'll respond within 24 hours.");
        setFormData({ name: '', email: '', question: '' });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('Error submitting question. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <StructuredData
        type="website"
        pageTitle="Frequently Asked Questions — KOR"
        pageDescription="Answers to common questions about KOR, personal plans, shop accounts, and getting started."
        url={`${baseUrl}/faq`}
      />

      <section className="faq-page-hero">
        <h1 className="faq-page-title">Frequently Asked Questions</h1>
        <p className="faq-page-subtitle">
          Quick answers to the most common questions about KOR.
        </p>
      </section>

      <section className="faq-section">
        <div className="faq-accordion" role="list">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`faq-accordion-item ${openIndex === i ? 'open' : ''}`}
              role="listitem"
            >
              <button
                className="faq-trigger"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className="faq-trigger-text">{item.question}</span>
                <span className="faq-trigger-icon" aria-hidden="true">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              <div className="faq-panel">
                <p className="faq-panel-text">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-ask-section">
        <h2 className="faq-ask-title">Still have a question?</h2>
        <p className="faq-ask-subtitle">
          Send it our way and we'll get back to you within 24 hours.
        </p>

        {submitMessage && (
          <div
            className={`form-message ${
              submitMessage.includes('Error') ? 'error' : 'success'
            }`}
          >
            {submitMessage}
          </div>
        )}

        <form
          className="faq-ask-form"
          onSubmit={handleSubmit}
        >
          <div className="form_line">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="First name / Last name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_line">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="youraddress@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_line">
            <label htmlFor="question">Your Question</label>
            <textarea
              id="question"
              name="question"
              placeholder="Describe your question or concern..."
              rows={4}
              value={formData.question}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Question'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default FAQ;
