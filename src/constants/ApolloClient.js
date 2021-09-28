import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import store from '../redux/store/index';

const developmentUrl = "https://development.cogniable.us/apis/graphql";
const productionUrl = "https://application.cogniable.us/apis/graphql";

export const client = new ApolloClient({
	link: new ApolloLink((operation, forward) => {
		const token = store.getState().authToken;
		// console.log('---------------------' + store.getState().authToken);
		operation.setContext({
			headers: {
				authorization: token ? `jwt ${token}` : '', //Your Auth token extraction logic
				database: 'india',
			}
		});
		return forward(operation);
	}).concat(
		new HttpLink({
			uri: productionUrl, // Server URL
		})
	),
	cache: new InMemoryCache()
});