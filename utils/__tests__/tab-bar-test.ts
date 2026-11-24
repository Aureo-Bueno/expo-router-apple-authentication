import { getTabIcon, getTabLabel } from '../tab-bar';

it('uses Entrar for the sign route when signed out', () => {
  expect(getTabLabel('sign', false)).toBe('Entrar');
  expect(getTabIcon('sign', false)).toBe('sign-in');
});

it('uses Sair for the sign route when signed in', () => {
  expect(getTabLabel('sign', true)).toBe('Sair');
  expect(getTabIcon('sign', true)).toBe('sign-out');
});

it('uses Portuguese labels for protected routes', () => {
  expect(getTabLabel('index', true)).toBe('Início');
  expect(getTabLabel('about', true)).toBe('Sobre');
  expect(getTabLabel('locations', true)).toBe('Locais');
  expect(getTabLabel('dogs', true)).toBe('Cães');
});
