import { TypedDocumentNode, gql } from '@apollo/client';
import { Data, Variables } from './types';

export const GET_DOG_QUERY: TypedDocumentNode<Data, Variables> = gql`
  query GetDog($id: String) {
    dog(id: $id) {
      id
      name
      breed
    }
  }
`;
