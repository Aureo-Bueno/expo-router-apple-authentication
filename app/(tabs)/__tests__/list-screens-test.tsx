import { useQuery } from '@apollo/client/react';
import { act, type ComponentType, createElement } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import DogsScreen from '../dogs';
import LocationsScreen from '../locations';

jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

const mockedUseQuery = jest.mocked(useQuery);

beforeEach(() => {
  mockedUseQuery.mockReturnValue({
    loading: false,
    error: undefined,
    data: {
      dogs: [{ id: 'dog-1', name: 'Rex', breed: 'Vira-lata' }],
      locations: [
        {
          id: 'location-1',
          name: 'Parque',
          description: 'Local para caminhar',
          photo: 'https://example.com/parque.jpg',
        },
      ],
    },
    refetch: jest.fn(),
  } as never);
});

function render(screen: ComponentType) {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(createElement(screen));
  });

  return tree;
}

function expectNoScrollViewAboveFlatList(tree: ReactTestRenderer) {
  let node = tree.root.findByType(FlatList).parent;

  while (node) {
    expect(node.type).not.toBe(ScrollView);
    node = node.parent;
  }
}

it('renders the Dogs FlatList without an enclosing ScrollView', () => {
  const tree = render(DogsScreen);

  expect(tree.root.findAllByType(FlatList)).toHaveLength(1);
  expectNoScrollViewAboveFlatList(tree);
});

it('renders the Locations FlatList without an enclosing ScrollView', () => {
  const tree = render(LocationsScreen);

  expect(tree.root.findAllByType(FlatList)).toHaveLength(1);
  expectNoScrollViewAboveFlatList(tree);
});
