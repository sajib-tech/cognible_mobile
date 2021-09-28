import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

import en from './en.json';
import ind from './in.json';
import ka from './ka.json';
import ma from './ma.json';
import mal from './mal.json';
import od from './od.json';
import ba from './ba.json';
import tel from './tel.json';

I18n.defaultLocale = 'en';
I18n.locale = 'en';
I18n.fallbacks = true;

I18n.translations = {en, ind, ba, ka, ma, mal, od, tel};

let currentLocale = I18n.currentLocale();

//console.log("currentLocale = ", currentLocale);

export const isRTL = false; //currentLocale.indexOf("he")===0 || currentLocale.indexOf("ar")===0;

ReactNative.I18nManager.allowRTL(isRTL);

export function getStr(name, params = {}) {
  //console.log('str called')
  currentLocale = I18n.currentLocale();
  // console.log("currentLocale = ", currentLocale);
  return I18n.t(name, params);
}

export function setLocale(param) {
  console.log('locale called');
  I18n.locale = param;
  I18n.defaultLocale = param;
}

export default I18n;
