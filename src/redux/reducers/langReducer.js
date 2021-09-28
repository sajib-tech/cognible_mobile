import { LANGUAGE } from '../constants';

const initialState = {
    lang: 'english'
};

const langReducer = (state = initialState, action) => {
    switch(action.type) {
        case LANGUAGE: return {...state, lang: action.payload};
        default: return state;
    }
};

export default langReducer;
