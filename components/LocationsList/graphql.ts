import { gql, type TypedDocumentNode } from '@apollo/client';
import type { ILocations } from '@/types';

type LocationsData = {
  locations: ILocations[];
};

export const GET_LOCATIONS: TypedDocumentNode<LocationsData, Record<string, never>> = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;
