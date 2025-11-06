import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

type WrapperProps = {
  children: ReactNode;
};

const AllTheProviders = ({ children }: WrapperProps) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };

export const mockNavigate = jest.fn();

export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

// Mock the toast module
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the useAuth hook
export const mockUseAuth = () => ({
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: false,
  user: null,
});

// Mock the fetch API
global.fetch = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Dumbbell: () => 'DumbbellIcon',
  User: () => 'UserIcon',
  Lock: () => 'LockIcon',
  Mail: () => 'MailIcon',
}));
