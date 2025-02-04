import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Notes from './pages/Notes';
import Login from './pages/Login';
import Register from './pages/Register';
import NoteForm from './pages/NoteForm';
import userEvent from '@testing-library/user-event';

// Mock components to prevent unnecessary API calls
jest.mock('./pages/Notes', () => () => <div>Notes Page</div>);
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Register', () => () => <div>Register Page</div>);
jest.mock('./pages/NoteForm', () => () => <div>Note Form Page</div>);

describe('App Routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirects to Login when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test('renders Notes page when authenticated', () => {
    localStorage.setItem('accessToken', 'test-token');
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Notes Page/i)).toBeInTheDocument();
  });

  test('renders Register page when visiting /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Register Page/i)).toBeInTheDocument();
  });

  test('redirects to Login when visiting /note while not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/note']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test('renders NoteForm when authenticated and visiting /note', () => {
    localStorage.setItem('accessToken', 'test-token');
    render(
      <MemoryRouter initialEntries={['/note']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Note Form Page/i)).toBeInTheDocument();
  });

  test('redirects to Login when trying to edit a note without authentication', () => {
    render(
      <MemoryRouter initialEntries={['/note/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test('renders NoteForm when authenticated and visiting /note/:id', () => {
    localStorage.setItem('accessToken', 'test-token');
    render(
      <MemoryRouter initialEntries={['/note/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Note Form Page/i)).toBeInTheDocument();
  });

  test('shows 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });
});