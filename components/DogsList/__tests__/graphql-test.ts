import { print } from 'graphql';
import { GET_DOGS_QUERY } from '../graphql';

it('requests breed for each dog', () => {
  expect(print(GET_DOGS_QUERY)).toContain('breed');
});
