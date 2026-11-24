import { unstable_settings } from '../_layout';

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

it('sets the root layout anchor without the deprecated initialRouteName setting', () => {
  expect(unstable_settings).toEqual({ anchor: '(tabs)' });
});
