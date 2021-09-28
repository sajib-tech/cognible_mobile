import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'

import combineSpreadingReducers from './combineSpreadingreducres'
import sagas from '../sagas/rootSaga'
import iiscaReducer from '../sagas/iisca/iisca.reducers'

import { logger } from 'redux-logger'

const sagaMiddleware = createSagaMiddleware()

const middlewares = []
middlewares.push(logger)
middlewares.push(thunk)
middlewares.push(sagaMiddleware)

const store = createStore(rootReducer  ,compose(applyMiddleware(...middlewares)));
sagaMiddleware.run(sagas)


export default store;
