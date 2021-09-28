import {
  getMedicalData,
  createMedical,
  getFamilyMembers,
  getUserProfile,
  getUserProfileSettings,
  parentScreeningGetSteps,
  parentScreeningStartPreAssess,
  parentScreeningGetPreAssessQuestion,
  parentScreeningRecordPreAssess,
  parentScreeningGetRecordedAssess,
  getTherapyLongTermGoals,
  getTherapyProgramsQuery,
  getFAQ,
  getStudentSessions,
  getAppointments,
  updateRecordingReminder,
  updateSessionReminder,
  updateMedicalReminder,
  updateStudentProfile,
  getToiletData,
  newToiletData,
  startCogniableAssessmentQuery,
  getCogniableAssessmentQuestionsQuery,
  saveCogniableAssessmentAnswerQuery,
  getPopularGroupsData,
  getBlogUpdates,
  getMandData,
  getDailyClick,
  createDailyClick,
  recordMandData,
  updateTemplateActiveData,
  getTemplateData,
  parentScreeningGetPreAssessVideos,
  parentScreeningSubmitVideos,
  parentScreeningGetAssessArea,
  parentScreeningRecordAssessResult,
  getNewTemplateFields,
  createNewTemplate,
  getAbcData,
  createBehaviour,
  createAntecedent,
  createConsequence,
  newAbcdata,
  getRelationships,
  getSessions,
  getFamilyMemberDetails,
  updateFamilyMember,
  deleteFamilyMember,
  addFamilyMember,
  forgetPassword,
  getDecelData,
  parentScreeningGetStatus,
  parentScreeningGetVideoStatus,
  getFoodData,
  createFood,
  getFoodTypes,
  parentScreeningGetAll,
  parentScreeningGetVideoStatusSingle,
  getAssessmentDetails,
  getCogniFirstQuestion,
  getCogniNextQuestion,
  updateFood,
  deleteFood,
  deleteMandData,
  updateMedical,
  deleteMedical,
  updateToiletData,
  deleteToiletData,
  addComments,
  getNotifications,
  updateTemplate,
  deleteTemplate,
  getAbcList,
  getBehaviorTemplate,
  getBehaviorTemplateDetails,
  removeStudentBehaviorRecord,
  getBehaviour,
  getBehaviorTemplateEnvironments,
  getTemplateEnvironment,
  addFrequencyRateBehaviorRecord,
  updateFrequencyRateBehaviorRecord,
  addDurationBehaviorRecord,
  updateDurationBehaviorRecord,
  addLatencyBehaviorRecord,
  updateLatencyBehaviorRecord,
  addPartialIntervalBehaviorRecord,
  updatePartialIntervalBehaviorRecord,
  addWholeIntervalBehaviorRecord,
  updateWholeIntervalBehaviorRecord,
  addMomentaryTimeBehaviorRecord,
  updateMomentaryTimeBehaviorRecord,

  getDecelStatus,
  updateDecelFrequency,
  createDecelRecord,
  updateDecelRecord,
  getChatUserList,
  getMessageList,
  mandReport,
  mandPage,
  preferredItems,
  GET_PREFERRED_ITEMS,
  getPreferredCategories,
  createPreferredItemsCategory,
  createPrefItem,
  deletePrefItem,
  likeBlog,
  addBlog,
  updateBlog,
  addGroup,
  deleteGroup,
  updateGroup,
  updatePrefItem,
  updateDecel,
  getEnvironment,
  getCommunityHomeData,
  getBlogData,
  deleteComment,
  updateComment,
  updateAbcdata,
  getFeedbackQuestion,
  createAppointmentFeedback,
  updateAppointmentFeedback,
  actHome,
  getExcerciseDetail,
  updateSeenStatus,
  createQuestionResponse,
  updateQuestionResponse,
  createUserResponse,
  updateUserResponse,
  actCourse,
  parentScreeningGetPreAssessInstruction,
  getTask,
  getSessionTargetsBySessionId,
  getSessionFeedback,
  saveSessionFeedback,
  promptCodes,
  markAsReadNotifications,  updateAssessment,
  getScreeningResult,
  recordBehaviourFrequency,
  updateChildSessionDuration,
  getCombinationCode
} from './parent.js';

import {createEnvironment} from './index';

import {getLanguageProfile} from './parent';
import BaseRequest from './BaseRequest';

export default {
  dispatchFunction: null,

  setDispatchFunction(func) {
    this.dispatchFunction = func;
  },

  getRequest(mutation, variables = {}, refreshQuery = false) {
    return BaseRequest.getRequest(
      this.dispatchFunction,
      mutation,
      variables,
      refreshQuery,
    );
  },

  getSessionTargetsBySessionId(variables) {
    return this.getRequest(getSessionTargetsBySessionId, variables);
  },

  getSessionFeedback(variables) {
    return this.getRequest(getSessionFeedback, variables);
  },
  updateChildSessionDuration(variables){
    return this.getRequest(updateChildSessionDuration,variables)
  },

  saveSessionFeedback(variables) {
    return this.getRequest(saveSessionFeedback, variables);
  },

  actHome() {
    return this.getRequest(actHome);
  },

  actCourse(variables) {
    return this.getRequest(actCourse, variables);
  },

  getExcerciseDetail(variables) {
    return this.getRequest(getExcerciseDetail, variables);
  },

  updateSeenStatus(variables) {
    return this.getRequest(updateSeenStatus, variables);
  },

  createQuestionResponse(variables) {
    return this.getRequest(createQuestionResponse, variables);
  },

  updateQuestionResponse(variables) {
    return this.getRequest(updateQuestionResponse, variables);
  },

  createUserResponse(variables) {
    return this.getRequest(createUserResponse, variables);
  },

  updateUserResponse(variables) {
    return this.getRequest(updateUserResponse, variables);
  },

  forgetPassword(variables) {
    return this.getRequest(forgetPassword, variables);
  },

  updateUserProfileSettings(variables) {
    return this.getRequest(updateStudentProfile, variables);
  },
  fetchUserProfileSettings(variables) {
    return this.getRequest(getUserProfileSettings, variables);
  },
  getLanguage() {
    return this.getRequest(getLanguageProfile);
  },
  fetchUserProfile(variables) {
    return this.getRequest(getUserProfile, variables);
  },
  fetchFamilyMembers(variables) {
    return this.getRequest(getFamilyMembers, variables);
  },
  fetchMedicalData(variables) {
    return this.getRequest(getMedicalData, variables);
  },
  addNewMedical(variables) {
    return this.getRequest(createMedical, variables);
  },
  updateMedical(variables) {
    return this.getRequest(updateMedical, variables);
  },
  deleteMedical(variables) {
    return this.getRequest(deleteMedical, variables);
  },
  fetchToiletData(variables) {
    return this.getRequest(getToiletData, variables);
  },
  saveToiletInfo(variables) {
    return this.getRequest(newToiletData, variables);
  },
  updateToiletInfo(variables) {
    return this.getRequest(updateToiletData, variables);
  },
  deleteToiletInfo(variables) {
    return this.getRequest(deleteToiletData, variables);
  },

  fetchStudentSessions(variables) {
    return this.getRequest(getStudentSessions, variables);
  },
  fetchStudentAppointments(variables) {
    return this.getRequest(getAppointments, variables);
  },
  fetchNotifications(variables) {
    return this.getRequest(getNotifications, variables);
  },

  markAsReadNoti(variables) {
    return this.getRequest(markAsReadNotifications, variables)
  },

  getFeedbackQuestion(variables) {
    return this.getRequest(getFeedbackQuestion, variables);
  },
  createAppointmentFeedback(variables) {
    return this.getRequest(createAppointmentFeedback, variables);
  },
  updateAppointmentFeedback(variables) {
    return this.getRequest(updateAppointmentFeedback, variables);
  },

  updateDataRecordingReminder(variables) {
    return this.getRequest(updateRecordingReminder, variables);
  },

  updateDataSessionReminder(variables) {
    return this.getRequest(updateSessionReminder, variables);
  },

  updateDataMedicalReminder(variables) {
    return this.getRequest(updateMedicalReminder, variables);
  },

  fetchGoalsData(variables) {
    return this.getRequest(getTherapyLongTermGoals, variables);
  },
  fetchTherapyProgramsData(variables) {
    return this.getRequest(getTherapyProgramsQuery, variables);
  },
  fetchFAQ(variables) {
    return this.getRequest(getFAQ, variables);
  },
  screeningGetSteps() {
    return this.getRequest(parentScreeningGetSteps);
  },
  screeningGetStatus(variables) {
    return this.getRequest(parentScreeningGetStatus, variables);
  },
  screeningGetVideoStatus(variables) {
    return this.getRequest(parentScreeningGetVideoStatus, variables);
  },
  screeningGetVideoStatusSingle(variables) {
    return this.getRequest(parentScreeningGetVideoStatusSingle, variables);
  },
  screeningGetAllData(variables) {
    return this.getRequest(parentScreeningGetAll, variables);
  },

  screeningGetSingleData(variables) {
    return this.getRequest(parentScreeningGetAll, variables);
  },

  screeningStartPreAssess(variables) {
    return this.getRequest(parentScreeningStartPreAssess, variables);
  },

  screeningGetPreAssessQuestion(variables) {
    return this.getRequest(parentScreeningGetPreAssessQuestion, variables);
  },

  screeningRecordPreAssess(variables) {
    return this.getRequest(parentScreeningRecordPreAssess, variables);
  },

  screeningGetRecordedAssess(variables) {
    return this.getRequest(parentScreeningGetRecordedAssess, variables);
  },
  addComments(variables) {
    return this.getRequest(addComments, variables);
  },
  deleteComment(variables) {
    return this.getRequest(deleteComment, variables);
  },
  updateComment(variables) {
    return this.getRequest(updateComment, variables);
  },
  getBlogData() {
    return this.getRequest(getBlogData);
  },
  addBlogs(variables) {
    return this.getRequest(addBlog, variables);
  },
  updateBlogs(variables) {
    return this.getRequest(updateBlog, variables);
  },
  addGroup(variables) {
    return this.getRequest(addGroup, variables);
  },
  updateGroup(variables) {
    return this.getRequest(updateGroup, variables);
  },
  deleteGroup(variables) {
    return this.getRequest(deleteGroup, variables);
  },
  likeBlog(variables) {
    return this.getRequest(likeBlog, variables);
  },
  startCogniableAssessment(variables) {
    return this.getRequest(startCogniableAssessmentQuery, variables);
  },
  fetchCogniableAssessmentQuestions(variables) {
    return this.getRequest(getCogniableAssessmentQuestionsQuery, variables);
  },
  saveCogniableAssessmentAnswer(variables) {
    return this.getRequest(saveCogniableAssessmentAnswerQuery, variables);
  },

  getCommunityHomeData() {
    return this.getRequest(getCommunityHomeData);
  },
  fetchPopularGroupsData() {
    return this.getRequest(getPopularGroupsData);
  },
  fetchBlogUpdates() {
    return this.getRequest(getBlogUpdates);
  },
  fetchMandData(variables) {
    return this.getRequest(getMandData, variables);
  },

  getMandPage(variables) {
    return this.getRequest(mandPage, variables);
  },
  fetchDailyClicksData(variables) {
    return this.getRequest(getDailyClick, variables);
  },
  createMandData(variables) {
    return this.getRequest(createDailyClick, variables);
  },
  updateRecordMandData(variables) {
    return this.getRequest(recordMandData, variables);
  },
  deleteMandData(variables) {
    return this.getRequest(deleteMandData, variables);
  },

  fetchTemplatesData(variables) {
    return this.getRequest(getTemplateData, variables);
  },
  updateTemplateActiveData(variables) {
    return this.getRequest(updateTemplateActiveData, variables);
  },
  screeningGetPreAssessVideos(variables) {
    return this.getRequest(parentScreeningGetPreAssessVideos, variables);
  },
  screeningGetPreAssessInstruction(variables) {
    return this.getRequest(parentScreeningGetPreAssessInstruction, variables);
  },

  screeningSubmitVideos(variables) {
    return this.getRequest(parentScreeningSubmitVideos, variables);
  },

  screeningGetAssessArea() {
    return this.getRequest(parentScreeningGetAssessArea);
  },

  screeningRecordAssessResult(variables) {
    return this.getRequest(parentScreeningRecordAssessResult, variables);
  },
  fetchNewTemplateFields(variables) {
    return this.getRequest(getNewTemplateFields, variables);
  },
  getBehaviorTemplateDetails(variables){
    return this.getRequest(getBehaviorTemplateDetails,variables);
  },
  getBehaviorTemplateEnvironments(variables){
    return this.getRequest(getBehaviorTemplateEnvironments,variables);
  },
  getBehaviour(variables){
    return this.getRequest(getBehaviour,variables);
  },
  getDecelStatus(variables){
    return this.getRequest(getDecelStatus,variables)
  },
  createBehaviourData(variables) {
    return this.getRequest(createBehaviour, variables);
  },
  createEnvironmentData(variables) {
    return this.getRequest(createEnvironment, variables);
  },
  createNewTemplate(variables) {
    return this.getRequest(createNewTemplate, variables);
  },
  updateTemplate(variables) {
    return this.getRequest(updateTemplate, variables);
  },
  addFrequencyRateBehaviorRecord(variables){
    return this.getRequest(addFrequencyRateBehaviorRecord,variables);
  },
  updateFrequencyRateBehaviorRecord(variables){
    return this.getRequest(updateFrequencyRateBehaviorRecord,variables)
  },
  addDurationBehaviorRecord(variables){
    return this.getRequest(addDurationBehaviorRecord,variables)
  },
  updateDurationBehaviorRecord(variables){
    return this.getRequest(updateDurationBehaviorRecord,variables)
  },
  addLatencyBehaviorRecord(variables){
    return this.getRequest(addLatencyBehaviorRecord,variables)
  },
  updateLatencyBehaviorRecord(variables){
    return this.getRequest(updateLatencyBehaviorRecord,variables)
  },
  addPIBehaviorRecord(variables){
    return this.getRequest(addPartialIntervalBehaviorRecord,variables)
  },
  updatePIBehaviorRecord(variables){
    return this.getRequest(updatePartialIntervalBehaviorRecord,variables)
  },
  addWIBehaviorRecord(variables){
    return this.getRequest(addWholeIntervalBehaviorRecord,variables)
  },
  updateWIBehaviorRecord(variables){
    return this.getRequest(updateWholeIntervalBehaviorRecord,variables)
  },
  addMTBehaviorRecord(variables){
    return this.getRequest(addMomentaryTimeBehaviorRecord,variables)
  },
  updateMTBehaviorRecord(variables){
    return this.getRequest(updateMomentaryTimeBehaviorRecord,variables)
  },
  deleteTemplate(variables) {
    return this.getRequest(deleteTemplate, variables);
  },
  updateDecelFrequency(variables) {
    return this.getRequest(updateDecelFrequency, variables);
  },
  createDecelRecord(variables) {
    return this.getRequest(createDecelRecord, variables);
  },
  updateDecelRecord(variables) {
    return this.getRequest(updateDecelRecord, variables);
  },
  updateDecel(variables) {
    return this.getRequest(updateDecel, variables);
  },
  getEnvironment() {
    return this.getRequest(getEnvironment);
  },

  fetchAbcData(variables) {
    return this.getRequest(getAbcData, variables);
  },
  saveAntacedentItem(variables) {
    return this.getRequest(createAntecedent, variables);
  },

  saveBehaviourItem(variables) {
    return this.getRequest(createBehaviour, variables);
  },
  saveConsequenceItem(variables) {
    return this.getRequest(createConsequence, variables);
  },
  newAbcData(variables) {
    return this.getRequest(newAbcdata, variables);
  },
  updateAbcData(variables) {
    return this.getRequest(updateAbcdata, variables);
  },
  getRelationships() {
    return this.getRequest(getRelationships);
  },

  getFoodData(variables) {
    return this.getRequest(getFoodData, variables);
  },
  getFoodType() {
    return this.getRequest(getFoodTypes);
  },
  createFoodData(variables) {
    return this.getRequest(createFood, variables);
  },
  updateFoodData(variables) {
    return this.getRequest(updateFood, variables);
  },
  deleteFoodData(variables) {
    return this.getRequest(deleteFood, variables);
  },

  getSessions() {
    return this.getRequest(getSessions);
  },
  getFamilyMemberDetails(variables) {
    return this.getRequest(getFamilyMemberDetails, variables);
  },
  updateFamilyMember(variables) {
    return this.getRequest(updateFamilyMember, variables);
  },

  deleteFamilyMember(variables) {
    return this.getRequest(deleteFamilyMember, variables);
  },
  addFamilyMember(variables) {
    return this.getRequest(addFamilyMember, variables);
  },
  getBehaviorTemplate(variables) {
    return this.getRequest(getBehaviorTemplate, variables);
  },
  removeStudentBehaviorRecord(variables){
    return this.getRequest(removeStudentBehaviorRecord,variables)

  },
  getTemplateEnvironment(variables) {
    return this.getRequest(getTemplateEnvironment, variables);
  },
  getDecelData(variables) {
    return this.getRequest(getDecelData, variables);
  },
  getAssessmentDetails(variables) {
    return this.getRequest(getAssessmentDetails, variables);
  },
  getCogniFirstQuestion(variables) {
    return this.getRequest(getCogniFirstQuestion, variables);
  },
  getNextQuestion(variables) {
    return this.getRequest(getCogniNextQuestion, variables);
  },

  getAbcList(variables) {
    return this.getRequest(getAbcList, variables);
  },

  getChatUserList() {
    return this.getRequest(getChatUserList);
  },
  getMessageList() {
    return this.getRequest(getMessageList);
  },

  mandReport(variables) {
    return this.getRequest(mandReport, variables);
  },

  getPreferredItems(variables) {
    return this.getRequest(preferredItems, variables);
  },
  getPItems(variables){
    return this.getRequest(GET_PREFERRED_ITEMS,variables)
  },
  getPreferredCategories(variables) {
    return this.getRequest(getPreferredCategories, variables);
  },

  createPreferredItemsCategory(variables){
    return this.getRequest(createPreferredItemsCategory, variables);
  },

  createPrefItem(variables) {
    return this.getRequest(createPrefItem, variables);
  },

  updatePrefItem(variables) {
    return this.getRequest(updatePrefItem, variables);
  },
  deletePrefItem(variables) {
    return this.getRequest(deletePrefItem, variables);
  },

  getTask() {
    return this.getRequest(getTask);
  },

  getPrompts() {
    return this.getRequest(promptCodes)
  },
  submitResult(variables) {
    return this.getRequest(updateAssessment, variables) 
  },
  getScreeningResult(variables) {
    return this.getRequest(getScreeningResult, variables)
  },
  recordBehaviour(variables) {
    return this.getRequest(recordBehaviourFrequency, variables)
  },
  getCombinationCodes(variables) {
    return this.getRequest(getCombinationCode, variables)
  }
};
