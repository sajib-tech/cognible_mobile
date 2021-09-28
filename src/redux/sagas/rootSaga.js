import {all} from 'redux-saga/effects'

import iiscaSaga from './iisca/iisca.sagas'

export default function* rootSaga() {
  yield all([
    iiscaSaga()
  ])
}