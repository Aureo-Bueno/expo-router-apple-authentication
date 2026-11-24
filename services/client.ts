import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloLink } from '@apollo/client/link';
import { HttpLink } from '@apollo/client/link/http';
import { Observable } from '@apollo/client/utilities';
import type { DogsData } from '@/types';

const dogs: DogsData = {
  dogs: [
    { id: '1', name: 'Rex', breed: 'Pastor Alemão' },
    { id: '2', name: 'Mia', breed: 'Siamês' },
    { id: '3', name: 'Bolt', breed: 'Labrador' },
  ],
};

const dogsLink = new ApolloLink(
  () =>
    new Observable((observer) => {
      observer.next({ data: dogs });
      observer.complete();
    }),
);

const httpLink = new HttpLink({ uri: 'https://flyby-router-demo.herokuapp.com/' });

export const client = new ApolloClient({
  link: ApolloLink.split((operation) => operation.operationName === 'GetDogs', dogsLink, httpLink),
  cache: new InMemoryCache(),
});
