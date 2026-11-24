import { act } from 'react';
import { Text } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import DogsScreen from '../dogs';
import LocationsScreen from '../locations';

jest.mock('@apollo/client/react', () => ({
  useQuery: () => ({
    loading: true,
    error: undefined,
    data: undefined,
    refetch: jest.fn(),
  }),
}));

function renderedTexts(tree: ReactTestRenderer) {
  return tree.root
    .findAllByType(Text)
    .map((node) => String(node.props.children))
    .join(' ');
}

it('uses the themed Dogs header copy', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<DogsScreen />);
  });
  const text = renderedTexts(tree);

  expect(text).toContain('GRAPHQL');
  expect(text).toContain('Raças de cães');
});

it('uses the themed Locations header copy', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<LocationsScreen />);
  });
  const text = renderedTexts(tree);

  expect(text).toContain('GRAPHQL');
  expect(text).toContain('Localizações');
});
