import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LegalPage from './LegalPage';
import { legalDocIndex } from '../../content/legal/legalDocs';

const renderPage = (slug: string) =>
  render(
    <MemoryRouter>
      <LegalPage slug={slug} />
    </MemoryRouter>
  );

describe('LegalPage', () => {
  it.each(legalDocIndex.map((d) => [d.slug, d.title]))(
    'renders the %s document with its title and sections',
    (slug, title) => {
      renderPage(slug);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(2);
    }
  );

  it('links the contact email', () => {
    renderPage('terms');
    const links = screen.getAllByRole('link', { name: 'masontuft@jmrcycling.com' });
    expect(links[0]).toHaveAttribute('href', 'mailto:masontuft@jmrcycling.com');
  });

  it('shows a fallback instead of crashing when a doc is missing', () => {
    renderPage('does-not-exist');
    expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
  });

  it('lists the other legal documents for navigation', () => {
    renderPage('privacy');
    const nav = screen.getByLabelText('Other legal documents');
    expect(nav).toHaveTextContent('Terms of Service');
    expect(nav).not.toHaveTextContent('Privacy Policy');
  });
});
