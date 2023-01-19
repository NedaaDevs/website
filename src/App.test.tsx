import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders  Prayer Times app. |  تطبيق أوقات الصلاة', () => {
  render(<App />);
  const linkElement = screen.getByText(/Prayer Times app. |  تطبيق أوقات الصلاة/i);
  console.log(linkElement);
  expect(linkElement).toBeInTheDocument();
});
