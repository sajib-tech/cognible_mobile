/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from "apollo-link-error";

const httpLink = createHttpLink({
  uri: 'https://application.cogniable.us/apis/graphql',
})

const errorLink = onError(({ graphQLErrors, networkError,response, operation, forward }) => {
   if(graphQLErrors)
   {

    // graphQLErrors.forEach(({ message, locations, path }) =>
    //   notification.success({
    //     message: message,
    //     description: message,
    //   })
    // );
   }
});

const httperrorLink = errorLink.concat(httpLink);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
 
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      database: 'india',
    },
  }
})

const authhttperrorLink = authLink.concat(httperrorLink);

export default new ApolloClient({
  link: authhttperrorLink,
  cache: new InMemoryCache()
})
