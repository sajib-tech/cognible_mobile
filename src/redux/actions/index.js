import {
  CHANGE_LANGUAGE,
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNOUT,
  ADD_FAMILY_MEMBER,
  INCREMENT,
  DECREMENT,
  SET_TOKEN,
  SET_TOKEN_PAYLOAD,
  SET_LEAVE_REQUEST_LIST,
  SET_WORKLOG_LIST,
  SET_CALENDAR_HOME,
  SET_STUDENT_HOME,
  SET_LONG_TERM_GOALS,
  SET_MEDICAL_DATA,
  SET_SHORT_TERM_GOALS,
  SET_PROFILE,
  SET_AUTISM_SCREENING,
  SET_BEHAVIOUR_DECEL_TOILET,
  SET_ASSESSMENT_DATA,
  SET_PARENT_PROFILE,
  SET_TIMEZONE,
  SET_PEAK_PROGRAMS,
  SET_VBMAPPS_ASSESSMENTS,
  SET_VBMAPPS_AREA,
  SETPIN,
  GETPIN,
  LANGUAGE_CHANGE,
} from '../constants/actionTypes';

export function changeLanguage(payload) {
    return {type: CHANGE_LANGUAGE, payload};
};

export function signin(payload) {
    return {type: SIGNIN, payload};
};
export function setpin(payload) {
  return {type: SETPIN, payload};
};
export function getpin(payload) {
  return {type: GETPIN, payload};
};
export function signin_success(payload) {
    return {type: SIGNIN_SUCCESS, payload};
};
export function signout(payload) {
  return {type: SIGNOUT, payload};
};
export function languageChange(payload) {
  return {type: LANGUAGE_CHANGE, payload};
};

export function setToken(payload) {
  // console.log(payload);
  return {type: SET_TOKEN, payload};
};
export function setTokenPayload(payload){
  // console.log(payload);
  return {type: SET_TOKEN_PAYLOAD, payload};
};

export function addFamilyMember(payload) {
    return {type: ADD_FAMILY_MEMBER, payload};
};


export function increment() {
  return { type: INCREMENT };
};

export function decrement() {
  return { type: DECREMENT };
};

/** Screen Redux */
export function setLeaveRequestList(payload){
  // console.log(payload);
  return {type: SET_LEAVE_REQUEST_LIST, payload};
};

export function setWorklogList(payload){
  return {type: SET_WORKLOG_LIST, payload};
};

export function setCalendarHome(payload){
  return {type: SET_CALENDAR_HOME, payload};
};

export function setStudentHome(payload){
  return {type: SET_STUDENT_HOME, payload};
};
export function setLongTermGoals(payload){
  return {type: SET_LONG_TERM_GOALS, payload};
};
export function setShortTermGoals(payload){
  return {type: SET_SHORT_TERM_GOALS, payload};
};
export function setMedicalData(payload){
  return {type: SET_MEDICAL_DATA, payload};
};
export function setProfile(payload){
  return {type: SET_PROFILE, payload};
};
export function setAutismScreening(payload){
  return {type: SET_AUTISM_SCREENING, payload};
};
export function setBehaviourDecelToilet(payload){
  return {type: SET_BEHAVIOUR_DECEL_TOILET, payload};
};
export function setAssessmentData(payload){
  return {type: SET_ASSESSMENT_DATA, payload};
};
export function setParentProfile(payload){
  return {type: SET_PARENT_PROFILE, payload};
};
export function setTimezone(payload) {
  // console.log(payload);
  return {type: SET_TIMEZONE, payload};
};
export function setPeakPrograms(payload) {
  return {type: SET_PEAK_PROGRAMS, payload};
};
export function setVBMAPPSAssessments(payload){
  return {type: SET_VBMAPPS_ASSESSMENTS, payload};
};
export function setVBMAPPSArea(payload){
  return {type: SET_VBMAPPS_AREA, payload};
};
