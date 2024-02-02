import { TypedDocumentNode, gql } from '@apollo/client';
import { DogsData } from './types';
import { Variables } from './DogDescription/types';

export const GET_DOGS_QUERY: TypedDocumentNode<DogsData, Variables> = gql`
  query GetDogs {
    dogs {
      id
      name
    }
  }
`;
