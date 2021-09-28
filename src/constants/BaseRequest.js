import {client} from './ApolloClient';
import TokenRefresher from '../helpers/TokenRefresher';
import {Alert} from 'react-native';
import {
  registerData,
  parentSignUp,
  clinicSignUp,
  getCountryList,
} from './index';

export default {
  forceSignOut(dispatchFunction) {
    Alert.alert(
      'Information',
      'Session expired, please login again.',
      [
        {
          text: 'Ok',
          onPress: () => {
            dispatchFunction(null);
          },
        },
      ],
      {cancelable: false},
    );
  },

  getUnauthorizedRequest(mutation, variables = {}) {
    return new Promise((result, reject) => {
      client
        .mutate({
          mutation,
          variables,
        })
        .then((graphQlResult) => {
          result(graphQlResult);
        })
        .catch((graphQlError) => {
          reject(graphQlError);
        });
    });
  },

  getRequest(dispatchFunction, mutation, variables = {}, refreshQuery = false) {
    refreshQuery = true;
    return new Promise((result, reject) => {
      if (refreshQuery) {
        TokenRefresher.refreshTokenIfNeeded(dispatchFunction, null)
          .then(() => {
            client
              .mutate({
                mutation,
                variables,
              })
              .then((graphQlResult) => {
                result(graphQlResult);
              })
              .catch((graphQlError) => {
                let str = graphQlError.toString();
                if (str.indexOf('Refresh has expired') !== -1) {
                  this.forceSignOut(dispatchFunction);
                } else {
                  reject(graphQlError);
                }
              });
          })
          .catch((error) => {
            let str = error.toString();
            if (str.indexOf('Refresh has expired') !== -1) {
              this.forceSignOut(dispatchFunction);
            } else {
              reject(error);
            }
          });
      } else {
        if (TokenRefresher.isTokenExpired()) {
          //tell app to sign out
          this.forceSignOut(dispatchFunction);
        } else {
          client
            .mutate({
              mutation,
              variables,
            })
            .then((graphQlResult) => {
              result(graphQlResult);
            })
            .catch((graphQlError) => {
              reject(graphQlError);
            });
        }
      }
    });
  },

  getRegisterData() {
    return this.getUnauthorizedRequest(registerData);
  },

  parentSignUp(variables) {
    return this.getUnauthorizedRequest(parentSignUp, variables);
  },

  clinicSignUp(variables) {
    return this.getUnauthorizedRequest(clinicSignUp, variables);
  },

  getCountryList() {
    return this.getUnauthorizedRequest(getCountryList);
  },
};
