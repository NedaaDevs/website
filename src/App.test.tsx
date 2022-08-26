import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders  The app still in beta version please report any bugs, Thanks.', () => {
  render(<App />);
  const linkElement = screen.getByText(/The app still in beta version please report any bugs, Thanks./i);
  expect(linkElement).toBeInTheDocument();
});
