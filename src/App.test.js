import { render, screen } from '@testing-library/react';
import App from './App';
import { START_YEAR } from './dateUtils';

test('renders the year view with months', () => {
  render(<App />);
  expect(screen.getByText(String(START_YEAR))).toBeInTheDocument();
  expect(screen.getByText('Juillet')).toBeInTheDocument();
});
