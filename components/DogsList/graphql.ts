import { gql, type TypedDocumentNode } from '@apollo/client';
import type { DogsData } from '@/types';

export const GET_DOGS_QUERY: TypedDocumentNode<DogsData, Record<string, never>> = gql`
  query GetDogs {
    dogs {
      id
      name
      breed
    }
  }
`;
