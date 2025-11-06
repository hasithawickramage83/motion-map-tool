import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import Register from '../Register';
import { mockNavigate, mockToast } from '@/test-utils';

describe('Register Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the fetch implementation for successful registration
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === 'https://myfitnesstracking-v3.onrender.com/api/auth/register/') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'User registered successfully' }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  });

  test('renders registration form with all fields', () => {
    render(<Register />);
    
    // Check if all form elements are rendered
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  test('validates form fields', async () => {
    render(<Register />);
    
    // Try to submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Check if validation errors are shown for all required fields
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(usernameInput).toBeInvalid();
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    
    // Test invalid email format
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    expect(emailInput).toBeInvalid();
  });

  test('handles successful registration', async () => {
    render(<Register />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'newuser' },
    });
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'securepassword123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check if loading state is shown
    expect(screen.getByText(/creating account.../i)).toBeInTheDocument();
    
    // Wait for the async operation to complete
    await waitFor(() => {
      // Check if fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        'https://myfitnesstracking-v3.onrender.com/api/auth/register/',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'securepassword123',
          }),
        })
      );
      
      // Check if success toast was shown
      expect(mockToast.success).toHaveBeenCalledWith('Registration successful! Please login.');
      
      // Check if navigation occurred to login page
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('handles registration error from API', async () => {
    // Mock a failed API response with error message
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Username already exists' }),
    });
    
    render(<Register />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'existinguser' },
    });
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'existing@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for the async operation to complete
    await waitFor(() => {
      // Check if error toast was shown with the message from the API
      expect(mockToast.error).toHaveBeenCalledWith('Username already exists');
    });
  });

  test('handles network error during registration', async () => {
    // Mock a network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<Register />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'newuser' },
    });
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'securepassword123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for the async operation to complete
    await waitFor(() => {
      // Check if error toast was shown for network error
      expect(mockToast.error).toHaveBeenCalledWith('Network error. Please try again.');
    });
  });
});
