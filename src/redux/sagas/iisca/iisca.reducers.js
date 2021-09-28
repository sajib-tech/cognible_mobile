import actions from './iisca.actions'

const initialState = {
  loading: true,
  Questionaire: [],
  Question1: [],
  Question2: [],
  Question1Answer: [],
  SelectedUser: {},
  Situation: [],
  Behavior: [],
}

export default function iiscaReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
