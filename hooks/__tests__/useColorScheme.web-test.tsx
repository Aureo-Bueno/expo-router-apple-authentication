import { act } from 'react';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import { useColorScheme } from '../useColorScheme.web';

type ChangeListener = () => void;

let matches: boolean;
let onChange: ChangeListener | undefined;
let scheme!: ReturnType<typeof useColorScheme>;

function Probe() {
  scheme = useColorScheme();
  return null;
}

function renderHook() {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<Probe />);
  });

  return tree;
}

beforeEach(() => {
  matches = true;
  onChange = undefined;

  Object.defineProperty(globalThis, 'matchMedia', {
    configurable: true,
    value: jest.fn(() => ({
      matches,
      addEventListener: (_type: string, listener: ChangeListener) => {
        onChange = listener;
      },
      removeEventListener: jest.fn(),
    })),
  });
});

it('returns dark when the dark color scheme is preferred', () => {
  renderHook();

  expect(scheme).toBe('dark');
});

it('reacts when the preferred color scheme changes to light', () => {
  renderHook();

  expect(scheme).toBe('dark');

  act(() => {
    matches = false;
    onChange?.();
  });

  expect(scheme).toBe('light');
});
