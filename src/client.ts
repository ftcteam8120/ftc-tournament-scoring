import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ReduxCache } from 'apollo-cache-redux';

declare const API_URL: string;

export function configureClient(store) {
  return new ApolloClient({
    link: new HttpLink({ uri: API_URL + '/graphql' }),
    cache: new ReduxCache({ store })
  });
}