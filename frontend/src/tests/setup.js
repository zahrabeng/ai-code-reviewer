import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 400,
  height: 300,
  top: 0,
  left: 0,
  bottom: 300,
  right: 400,
  x: 0,
  y: 0,
  toJSON: () => {},
}));
