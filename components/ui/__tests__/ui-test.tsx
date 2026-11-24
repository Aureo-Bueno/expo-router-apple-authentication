import { act } from 'react';
import { Text } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import { ScreenHeader, StateBlock } from '../index';

function renderedTexts(tree: ReactTestRenderer) {
  return tree.root
    .findAllByType(Text)
    .map((node) => String(node.props.children))
    .join(' ');
}

it('renders ScreenHeader copy and palette text', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(
      <ScreenHeader eyebrow="APPLE ID" title="Entre com segurança" description="Descrição" />,
    );
  });
  const text = renderedTexts(tree);

  expect(text).toContain('APPLE ID');
  expect(text).toContain('Entre com segurança');
  expect(text).toContain('Descrição');
});

it('renders the provided StateBlock error message', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<StateBlock kind="error" message="Falhou" />);
  });

  expect(renderedTexts(tree)).toContain('Falhou');
});

it('renders the default StateBlock empty message', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<StateBlock kind="empty" />);
  });

  expect(renderedTexts(tree)).toContain('Nenhum item encontrado.');
});
