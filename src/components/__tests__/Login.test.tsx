import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import Login from '../Login';
import { mockNavigate, mockToast } from '@/test-utils';

// ✅ Jest mock MUST be here – top of file
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: jest.fn(),
    isAuthenticated: false,
    user: null,
  }),
}));

// ✅ Move mockLogin before the mock so it's defined
const mockLogin = jest.fn();

describe('Login Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Mock fetch globally
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === 'https://myfitnesstracking-v3.onrender.com/api/token/') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access: 'mock-access-token' }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    }) as jest.Mock;
  });

  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('validates fields', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByLabelText('Username')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
  });

  test('successful login', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' }});
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' }});
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'mock-access-token');
      expect(mockToast.success).toHaveBeenCalledWith('Login successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles login error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' }});
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' }});
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Invalid credentials. Please try again.');
    });
  });

  test('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' }});
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' }});
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Network error. Please try again.');
    });
  });
});
