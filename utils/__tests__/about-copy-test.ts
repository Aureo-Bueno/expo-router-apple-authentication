import { aboutDescription, aboutTopics } from '../about-copy';

it('describes authentication, storage and GraphQL', () => {
  expect(aboutDescription).toContain('autenticação com Apple');
  expect(aboutDescription).toContain('GraphQL');

  const titles = aboutTopics.map((topic) => topic.title);
  expect(titles).toEqual(['Apple Sign In', 'Secure Store', 'Apollo GraphQL', 'Expo Router']);
});
