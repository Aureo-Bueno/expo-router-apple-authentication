import { GET_DOGS_QUERY } from '../../components/DogsList/graphql';
import { client } from '../client';

afterEach(() => {
  jest.restoreAllMocks();
});

it('returns dogs from the local data source', async () => {
  jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('unexpected network request'));

  const result = await client.query({ query: GET_DOGS_QUERY });

  expect(result.data).toEqual({
    dogs: [
      { id: '1', name: 'Rex', breed: 'Pastor Alemão' },
      { id: '2', name: 'Mia', breed: 'Siamês' },
      { id: '3', name: 'Bolt', breed: 'Labrador' },
    ],
  });
});
