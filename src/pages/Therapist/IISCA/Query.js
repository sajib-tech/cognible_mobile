import gql from 'graphql-tag'

import {client} from '../../../constants/ApolloClient'

export const GET_QUESTIONARE = gql`
  query {
    getQuestionare {
      id
      name
    }
  }
`

export const getQuestionareChoices = () => {
  return client.query({
    query: gql`
    query {
      getQuestionare {
        id
        name
      }
    }
    `,
    fetchPolicy: 'network-only'
  }).then((res) => {
    console.log("response questionaire choices", res)
    return res
  }).catch((err) => {
    console.log("error questionaire choices", err)
  })
}

export const getQuestions = (payload) => {
  return client.query({
    query: gql`
    query getQuestion($questionare: ID!) {
      getQuestion(questionare: $questionare) {
        id
        text
      }
    }
    `,
    variables: {
      questionare: payload.id
    },
    fetchPolicy: 'network-only'
  }).then((result) => {
    return result
  }).catch((err) => {
    console.log("error fetching quesion 1", err)
  })
}