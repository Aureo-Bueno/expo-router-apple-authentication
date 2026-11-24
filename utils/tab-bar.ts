export type TabRoute = 'index' | 'about' | 'sign' | 'locations' | 'dogs';

const labels: Record<TabRoute, string> = {
  index: 'Início',
  about: 'Sobre',
  sign: 'Entrar',
  locations: 'Locais',
  dogs: 'Cães',
};

export function getTabLabel(route: TabRoute, signedIn: boolean): string {
  if (route === 'sign' && signedIn) {
    return 'Sair';
  }

  return labels[route];
}

export function getTabIcon(route: TabRoute, signedIn: boolean) {
  if (route === 'sign') {
    return signedIn ? ('sign-out' as const) : ('sign-in' as const);
  }

  if (route === 'index') {
    return 'home' as const;
  }

  if (route === 'about') {
    return 'archive' as const;
  }

  return 'list' as const;
}
