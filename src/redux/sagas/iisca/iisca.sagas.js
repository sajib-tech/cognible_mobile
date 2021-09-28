import {takeEvery, put, call, all} from 'redux-saga/effects'

import actions from './iisca.actions'

import {getQuestionareChoices, getQuestions} from '../../../pages/Therapist/IISCA/Query'



export function* SAVE_USER_DATA({payload}) {
  yield put ({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      selectedUser: payload
    }
  })
}

export function* GET_QUESTIONARE_CHOICES_DATA({payload}) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      Behavior: []
    }
  })

  const response = yield call(getQuestionareChoices)

  console.log("response questionaqire", response)

  if(response) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        questionaqire: response?.data?.getQuestionare
      }
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false
    }
  })
}

export function* GET_QUESTION_1_DATA({payload}) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      Question1: []
    }
  })

  const response = yield call(getQuestions, payload)

  console.log("question 1 response", response)

  if(response) {
    yield put({
      type: actions.SET_STATE,
      payload:{
        Question1: response?.data?.getQuestion
      }
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false
    }
  })

}

export function* GET_QUESTION_2_DATA({payload}) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      Question2: []
    }
  })

  const response = yield call(getQuestions, payload)

  console.log("response question 2", response)

  if(response) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        Question2: response?.data?.getQuestion
      }
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false
    }
  })
}


export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_USER_DATA, SAVE_USER_DATA),
    takeEvery(actions.LOAD_DATA, GET_QUESTIONARE_CHOICES_DATA),
    takeEvery(actions.LOAD_QUESTION_1_DATA, GET_QUESTION_1_DATA),
    takeEvery(actions.LOAD_QUESTION_2_DATA, GET_QUESTION_2_DATA)
  ])
}