import { describe, it, expect, vi } from 'vitest';

describe('main.jsx', () => {
  it('mounts the React app into the root element', async () => {
    const renderMock = vi.fn();
    const createRootMock = vi.fn(() => ({ render: renderMock }));

    vi.doMock('react-dom/client', () => ({
      default: { createRoot: createRootMock },
    }));

    vi.doMock('../App.jsx', () => ({
      default: () => null,
    }));

    document.body.innerHTML = '<div id="root"></div>';

    await import('../main.jsx');

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
    expect(renderMock).toHaveBeenCalledOnce();
  });
});
