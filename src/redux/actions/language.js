import { LANGUAGE } from '../constants';

export function changeLanguage(lang) {
    return {
        type: LANGUAGE,
        payload: lang
    }
}