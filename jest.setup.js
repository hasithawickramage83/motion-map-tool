// jest.setup.js
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock matchMedia for components that use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated but some libs still use
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Optional: Mock scrollTo to avoid errors in tests
window.scrollTo = jest.fn();

// Global mocks for toast and navigation
global.mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

global.mockNavigate = jest.fn();

// Optional: Mock fetch if you want global default behavior
global.fetch = jest.fn();
