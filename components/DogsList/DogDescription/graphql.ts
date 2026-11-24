import { gql, type TypedDocumentNode } from '@apollo/client';
import type { DogDescriptionData, DogDescriptionVariables } from '@/types';

export const GET_DOG_QUERY: TypedDocumentNode<DogDescriptionData, DogDescriptionVariables> = gql`
  query GetDog($id: String) {
    dog(id: $id) {
      id
      name
      breed
    }
  }
`;
