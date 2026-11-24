import { useSyncExternalStore } from 'react';
import type { ColorSchemeName } from 'react-native';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function getMediaQueryList() {
  return typeof globalThis.matchMedia === 'function'
    ? globalThis.matchMedia(DARK_QUERY)
    : undefined;
}

function subscribe(onChange: () => void) {
  const mediaQueryList = getMediaQueryList();

  if (!mediaQueryList) {
    return () => undefined;
  }

  mediaQueryList.addEventListener('change', onChange);

  return () => mediaQueryList.removeEventListener('change', onChange);
}

function getSnapshot(): ColorSchemeName {
  return getMediaQueryList()?.matches ? 'dark' : 'light';
}

function getServerSnapshot(): 'light' {
  return 'light';
}

export function useColorScheme(): ColorSchemeName {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
