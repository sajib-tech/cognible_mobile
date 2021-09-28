import store from './store/index';
import {changeLanguage} from './actions/index';

window.store = store;
window.changeLanguage = changeLanguage;
