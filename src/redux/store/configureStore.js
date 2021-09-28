import {createStore, combineReducers} from 'redux';

import langReducer from '../src/redux/reducers/langReducer';

const rootReducer = combineReducers({lang: langReducer});

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;
