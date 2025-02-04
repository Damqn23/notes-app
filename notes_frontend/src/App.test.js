import { render, screen } from '@testing-library/react';
import App from './App';

// Before rendering, ensure that no access token is stored so that the Login page is shown.
localStorage.removeItem('accessToken');

test('renders the login page when not authenticated', () => {
  render(<App />);
  // Expect that the login page renders with the word "Login"
  const loginHeading = screen.getByText(/login/i);
  expect(loginHeading).toBeInTheDocument();
});
