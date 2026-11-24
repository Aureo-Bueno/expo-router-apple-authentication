import { useQuery } from '@apollo/client/react';
import { act } from 'react';
import { Text } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import { DogsList } from '../index';

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
    tree = create(<DogsList />);
  });

  return tree;
}

function dogsResult(refetch = jest.fn()) {
  return {
    loading: false,
    error: undefined,
    data: { dogs: [{ id: '1', name: 'Rex', breed: 'Pastor Alemão' }] },
    refetch,
  };
}

beforeEach(() => {
  useQueryMock.mockReset();
});

it('renders the loading state while dogs are pending', () => {
  const tree = renderList({
    loading: true,
    error: undefined,
    data: undefined,
    refetch: jest.fn(),
  });

  expect(renderedTexts(tree)).toContain('Carregando cães...');
});

it('renders the error state when the dogs query fails', () => {
  const tree = renderList({
    loading: false,
    error: new Error('GraphQL indisponível'),
    data: undefined,
    refetch: jest.fn(),
  });

  expect(renderedTexts(tree)).toContain('Não foi possível carregar os cães.');
});

it('renders the empty state when the dogs query returns no items', () => {
  const tree = renderList({
    loading: false,
    error: undefined,
    data: { dogs: [] },
    refetch: jest.fn(),
  });

  expect(renderedTexts(tree)).toContain('Nenhum cão encontrado.');
});

it('renders the name and breed returned by the dogs query', () => {
  const tree = renderList(dogsResult());
  const text = renderedTexts(tree);

  expect(text).toContain('Rex');
  expect(text).toContain('Pastor Alemão');
});

it('calls refetch once when Recarregar is pressed', () => {
  const refetch = jest.fn();
  const tree = renderList(dogsResult(refetch));
  const reloadButton = tree.root
    .findAllByProps({ accessibilityLabel: 'Recarregar' })
    .find((node) => typeof node.props.onPress === 'function');

  expect(reloadButton).toBeDefined();

  act(() => {
    reloadButton?.props.onPress();
  });

  expect(refetch).toHaveBeenCalledTimes(1);
});
