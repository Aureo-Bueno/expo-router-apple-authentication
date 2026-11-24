import { useQuery } from '@apollo/client/react';
import { act } from 'react';
import { Text } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import { LocationsList } from '../index';

jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

const useQueryMock = useQuery as unknown as jest.Mock;

function renderedTexts(tree: ReactTestRenderer) {
  return tree.root
    .findAllByType(Text)
    .map((node) => String(node.props.children))
    .join(' ');
}

function renderList(result: unknown) {
  let tree!: ReactTestRenderer;

  useQueryMock.mockReturnValue(result);

  act(() => {
    tree = create(<LocationsList />);
  });

  return tree;
}

function locationsResult(refetch = jest.fn()) {
  return {
    loading: false,
    error: undefined,
    data: {
      locations: [
        {
          id: '1',
          name: 'Paraíso',
          description: 'Descrição do local',
          photo: 'https://example.com/photo.jpg',
        },
      ],
    },
    refetch,
  };
}

beforeEach(() => {
  useQueryMock.mockReset();
});

it('renders the loading state while locations are pending', () => {
  const tree = renderList({
    loading: true,
    error: undefined,
    data: undefined,
    refetch: jest.fn(),
  });

  expect(renderedTexts(tree)).toContain('Carregando localizações...');
});

it('renders the error state when the locations query fails', () => {
  const tree = renderList({
    loading: false,
    error: new Error('GraphQL indisponível'),
    data: undefined,
    refetch: jest.fn(),
  });

  expect(renderedTexts(tree)).toContain('Não foi possível carregar as localizações.');
});

it('renders the empty state when the locations query returns no items', () => {
  const tree = renderList({
    loading: false,
    error: undefined,
    data: { locations: [] },
    refetch: jest.fn(),
  });

  expect(renderedTexts(tree)).toContain('Nenhuma localização encontrada.');
});

it('renders the name and description returned by the locations query', () => {
  const tree = renderList(locationsResult());
  const text = renderedTexts(tree);

  expect(text).toContain('Paraíso');
  expect(text).toContain('Descrição do local');
});

it('calls refetch once when Recarregar is pressed', () => {
  const refetch = jest.fn();
  const tree = renderList(locationsResult(refetch));
  const reloadButton = tree.root
    .findAllByProps({ accessibilityLabel: 'Recarregar' })
    .find((node) => typeof node.props.onPress === 'function');

  expect(reloadButton).toBeDefined();

  act(() => {
    reloadButton?.props.onPress();
  });

  expect(refetch).toHaveBeenCalledTimes(1);
});
