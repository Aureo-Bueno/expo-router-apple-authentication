import { darkTheme, getNavigationTheme, getTheme, lightTheme } from '../index';

it('selects light tokens when color scheme is null', () => {
  expect(getTheme(null)).toBe(lightTheme);
  expect(getTheme(null).colors.background).toBe('#F3F3F1');
});

it('selects dark tokens when color scheme is dark', () => {
  expect(getTheme('dark')).toBe(darkTheme);
  expect(getTheme('dark').colors.background).toBe('#111318');
});

it('maps app tokens to the React Navigation theme', () => {
  const navigationTheme = getNavigationTheme(darkTheme);

  expect(navigationTheme.dark).toBe(true);
  expect(navigationTheme.colors.primary).toBe('#2F95DC');
  expect(navigationTheme.colors.background).toBe('#111318');
  expect(navigationTheme.colors.card).toBe('#1B1E25');
  expect(navigationTheme.colors.text).toBe('#F4F5F7');
  expect(navigationTheme.colors.border).toBe('#2C313A');
  expect(navigationTheme.colors.notification).toBe('#FF8A84');
});

it('exposes tab bar layout tokens', () => {
  expect(lightTheme.layout.tabBarHeight).toBe(64);
  expect(lightTheme.layout.tabIconSize).toBe(22);
});
