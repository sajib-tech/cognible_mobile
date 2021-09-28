import {
  therapistDashboard,
  theraphistCheckIn,
  theraphistCheckOut,
  theraphistCheckInOut,
  therapistWorkLogList,
  therapistWorkLogNew,
  therapistLocationList,
  GetClinicVideo,
  therapistLeaveRequestList,
  therapistLeaveRequestNew,
  GetStudent,
  getAppointmentStatus,
  therapistGetStudentList,
  therapistStudentNew,
  therapistStudentNewData,
  getAreaList,
  theCaseManger,
  GetClinicID,
  getPeakEquCode,
  getPeakEquCodeDetails,
  getPeakEquSuggestedTargets,
  therapistCalendarList,
  therapistProfile,
  therapistGetAllocateTargets,
  getPeakEquDomain,
  GET_VBMAPP_TARGET,
  GUIDE,
  therapistGetAppointmentData,
  therapistAppointmentNew,
  therapistAppointmentEdit,
  therapistAppointmentDelete,
  therapistGoalResponsibility,
  therapistGoalStatus,
  therapistGoalsAssessment,
  therapistCreateLongTerm,
  therapistStudentPrograms,
  therapistGetLongTermGoals,
  therapistCreatShortTermGoal,
  therapistGetTargetArea,
  therapistGetTargets,
  therapistGetTargetsByDomain,
  therapistGetMasteryData,
  therapistAllocateNewTarget,
  GET_SBT_DEFAULT_STEPS,
  GET_SBT_STEP_STATUS,
  getStudentSessions,
  getSessionStatus,
  getPeakQuestionaire,
  createProgram,
  getStudentPeakPrograms,
  therapistGetMessageList,
  submitPeakAssessment,
  peakScoreDetails,
  peakFinishAssessment,
  peakSuggestedTargets,
  getPeakCodes,
  getPeakCodeDetails,
  getAssessmentsList,
  getTargetTypes,
  getTargetStatusList,
  startCogniableAssessment,
  getAssessmentsListCogniable,
  getCogniableAssessmentQuestionsQuery,
  saveCogniableAssessmentAnswerQuery,
  getRecordedAssessmentAreaCogniable,
  therapistGetSecondUserMessageList,
  getCogniableFirstQuestion,
  getAssessmentObjectCogniable,
  recordResponseCogniable,
  endQuestionsAssessmentCogniable,
  recordAreaResponse,
  endAssessmentCogniable,
  getIepReport,
  getUser,
  getEquiGraph,
  updateReminder,
  updateResponseCogniable,
  iepReportVbmapps,
  vbmappSuggestedTargets,
  deleteVBMAPPAssessment,
  getStartPeakEqui,
  getStepsForTarget,
  getSdForTarget,
  getPeakData,
  therapistAllocateNewTargetNew,
  alreadyAllocatedTargetsForStudent,
  cogniableSuggestedTargets,
  getTaskList,
  startBehaviourlAssessment,
  manualTargetAllocation,
  getAllTargetSetting,
  getAllQuestionsCode,
  getPeakSummaryData,
  updateTarget,
  factoreScoreDetatils,
  getBehaQuestion,
  getEquivilanceQuestion,
  recordPeakEquivalance,
  peakEquData,
  peakEquReport,
  cogniableReport,
  peakTableReport,
  updateTherapistProfile,
  finalAgeUpdate,
  factorAgeUpdate,
  peaktriangleReportLastFourData,
  RECORDING_TYPE,
  GET_BEHAVIOUR,
  PROMPT_CODES,
  BEH_PROMPT_CODES,
  GET_QUESTIONARE,
  IISCA_PROGRAMS,
  CREATE_IISCA_PROGRAM,
  deleteIISCAAssessment,
  CREATE_STUDENT_QUESTIONARE_MUTATION,
  GET_QUESTIONARE_BY_NAME,
  GET_QUESTIONARE_ANSWERS,
  SAVE_ANSWER_MUTATION,
  PROGRAM_AREA,
  GET_LONG_GOALS,
  GET_LONG_GOALS_DETAILS,
  DEFAULT_SHORT_TERM_GOALS,
  SHORT_TERM_GOALS,
  LONG_TERM_GOAL,
  STUDENT_DROPDOWNS,
  reinforce
} from './therapist';
import {clinicGetStaffList} from './clinic';
import BaseRequest from './BaseRequest';
import {GetVimeoProjects} from '.';

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

  getHomeData(variables) {
    return this.getRequest(therapistDashboard, variables);
  },

  getTaskList() {
    return this.getRequest(getTaskList);
  },

  startWorkDay(variables) {
    return this.getRequest(theraphistCheckIn, variables);
  },

  endWorkDay(variables) {
    return this.getRequest(theraphistCheckOut, variables);
  },

  startEndWorkDay(variables) {
    return this.getRequest(theraphistCheckInOut, variables);
  },

  getWorklogList(variables) {
    return this.getRequest(therapistWorkLogList, variables);
  },

  worklogNew(variables) {
    return this.getRequest(therapistWorkLogNew, variables);
  },

  getLocationList() {
    return this.getRequest(therapistLocationList);
  },

  getLeaveRequestList() {
    return this.getRequest(therapistLeaveRequestList);
  },

  leaveRequestNew(variables) {
    return this.getRequest(therapistLeaveRequestNew, variables);
  },

  getStudentList() {
    return this.getRequest(therapistGetStudentList);
  },

  

  getStudentNewData() {
    return this.getRequest(therapistStudentNewData);
  },
  getCaseMangerData() {
    return this.getRequest(theCaseManger);
  },

  studentNew(variables) {
    return this.getRequest(therapistStudentNew, variables);
  },

  getCalendarList(variables) {
    return this.getRequest(therapistCalendarList, variables);
  },

  getAppointmentData() {
    return this.getRequest(therapistGetAppointmentData);
  },

  getClinicStaffList() {
    return this.getRequest(clinicGetStaffList);
  },
  getAppointMentStatusList() {
    return this.getRequest(getAppointmentStatus);
  },

  appointmentNew(variables) {
    return this.getRequest(therapistAppointmentNew, variables);
  },
  GetClinicVideo(variables) {
    return this.getRequest(GetClinicVideo, variables);
  },
  getVimeoProjectVideo() {
    return this.getRequest(GetVimeoProjects);
  },
  GetClinicID(variables) {
    return this.getRequest(GetClinicID, variables);
  },
  GetStudent() {
    return this.getRequest(GetStudent);
  },

  appointmentEdit(variables) {
    return this.getRequest(therapistAppointmentEdit, variables);
  },

  appointmentDelete(variables) {
    return this.getRequest(therapistAppointmentDelete, variables);
  },

  getGoalResponsibility(variables) {
    return this.getRequest(therapistGoalResponsibility, variables);
  },
  getGoalStatus(variables) {
    return this.getRequest(therapistGoalStatus, variables);
  },
  getGoalAssessment(variables) {
    return this.getRequest(therapistGoalsAssessment, variables);
  },

  createLongTerm(variables, refetchQueries) {
    return this.getRequest(therapistCreateLongTerm, variables, refetchQueries);
  },
  getStudentPrograms(variables) {
    return this.getRequest(therapistStudentPrograms, variables);
  },
  getStudentProgramLongTermGoals(variables) {
    return this.getRequest(therapistGetLongTermGoals, variables);
  },
  GET_VBMAPP_TARGET(variables) {
    return this.getRequest(GET_VBMAPP_TARGET, variables);
  },
  getAreaList() {
    return this.getRequest(getAreaList);
  },
  createShortTerm(variables, refetchQueries) {
    return this.getRequest(
      therapistCreatShortTermGoal,
      variables,
      refetchQueries,
    );
  },

  getProfile(variables) {
    return this.getRequest(therapistProfile, variables);
  },
  updateProfile(variables) {
    return this.getRequest(updateTherapistProfile, variables);
  },
  getTargetArea(variables) {
    return this.getRequest(therapistGetTargetArea, variables);
  },
  getTargets(variables) {
    return this.getRequest(therapistGetTargets, variables);
  },
  getAllocateTargets(variables) {
    return this.getRequest(therapistGetAllocateTargets, variables);
  },
  alreadyAllocatedTargetsForStudent(variables) {
    return this.getRequest(alreadyAllocatedTargetsForStudent, variables);
  },
  getTargetsByDomain(variables) {
    return this.getRequest(therapistGetTargetsByDomain, variables);
  },
  getMasteryData(variables) {
    return this.getRequest(therapistGetMasteryData, variables);
  },
  getAllTargetSettingData(variables) {
    return this.getRequest(getAllTargetSetting, variables);
  },
  allocateNewTarget(variables) {
    return this.getRequest(therapistAllocateNewTarget, variables);
  },
  allocateNewTargetNew(variables) {
    return this.getRequest(therapistAllocateNewTargetNew, variables);
  },
  allocateManualTarget(variables) {
    return this.getRequest(manualTargetAllocation, variables);
  },
  getStudentSessions(variables) {
    return this.getRequest(getStudentSessions, variables);
  },
  getStudentSessionStatus(variables) {
    return this.getRequest(getSessionStatus, variables);
  },
  getPeakDirectQuestionaire(variables) {
    return this.getRequest(getPeakQuestionaire, variables);
  },
  createProgram(variables) {
    return this.getRequest(createProgram, variables);
  },
  getStudentPeakPrograms(variables) {
    return this.getRequest(getStudentPeakPrograms, variables);
  },
  getPeakData() {
    return this.getRequest(getPeakData);
  },
  getStartPeakEqui(variables) {
    return this.getRequest(getStartPeakEqui, variables);
  },
  getEquiGraph(variables) {
    return this.getRequest(getEquiGraph, variables);
  },
  getEquivilanceQuestion(variables) {
    return this.getRequest(getEquivilanceQuestion, variables);
  },
  recordPeakEquivalance(variables) {
    return this.getRequest(recordPeakEquivalance, variables);
  },
  peakEquData(variables) {
    return this.getRequest(peakEquData, variables);
  },
  peakEquReport(variables) {
    return this.getRequest(peakEquReport, variables);
  },
  getVBMAPPSAssessmentsList(variables) {
    return this.getRequest(getAssessmentsList, variables);
  },
  deleteVBMAPPAssessment(variables){
    return this.getRequest(deleteVBMAPPAssessment,variables)
  },
  getMessageList() {
    return this.getRequest(therapistGetMessageList);
  },
  getSecondUserMessageList(variables) {
    return this.getRequest(therapistGetSecondUserMessageList, variables);
  },
  submitPeakAssessment(variables) {
    return this.getRequest(submitPeakAssessment, variables);
  },
  peakFinishAssessment(variables) {
    return this.getRequest(peakFinishAssessment, variables);
  },
  peakScoreDetails(variables) {
    return this.getRequest(peakScoreDetails, variables);
  },
  getPeakCodes(variables) {
    return this.getRequest(getPeakCodes, variables);
  },
  getPeakCodeDetails(variables) {
    return this.getRequest(getPeakCodeDetails, variables);
  },
  peakSuggestedTargets(variables) {
    return this.getRequest(peakSuggestedTargets, variables);
  },
  getPeakEquCode(variables) {
    return this.getRequest(getPeakEquCode, variables);
  },
  getPeakEquDomain() {
    return this.getRequest(getPeakEquDomain);
  },
  getPeakEquSuggestedTargets(variables) {
    return this.getRequest(getPeakEquSuggestedTargets, variables);
  },
  getPeakEquCodeDetails(variables) {
    return this.getRequest(getPeakEquCodeDetails, variables);
  },
  getTargetTypes() {
    return this.getRequest(getTargetTypes);
  },
  getAllQuestionsCode(variables) {
    return this.getRequest(getAllQuestionsCode, variables);
  },
  getPeakSummaryData(variables) {
    return this.getRequest(getPeakSummaryData, variables);
  },
  getTargetStatusList() {
    return this.getRequest(getTargetStatusList);
  },
  getSbtStatusList(){
    return this.getRequest(GET_SBT_STEP_STATUS)
  },
  startCogniableAssessment(variables) {
    return this.getRequest(startCogniableAssessment, variables);
  },
  startBehaviourlAssessment(variables) {
    return this.getRequest(startBehaviourlAssessment, variables);
  },
  getAssessmentsListCogniable(variables) {
    return this.getRequest(getAssessmentsListCogniable, variables);
  },
  getCogniableFirstQuestion(variables) {
    return this.getRequest(getCogniableFirstQuestion, variables);
  },
  getAssessmentObjectCogniable(variables) {
    return this.getRequest(getAssessmentObjectCogniable, variables);
  },
  recordResponseCogniable(variables) {
    return this.getRequest(recordResponseCogniable, variables);
  },
  getBehaQuestion(variables) {
    return this.getRequest(getBehaQuestion, variables);
  },
  updateResponseCogniable(variables) {
    return this.getRequest(updateResponseCogniable, variables);
  },
  recordAreaResponse(variables) {
    return this.getRequest(recordAreaResponse, variables);
  },
  endAssessmentCogniable(variables) {
    return this.getRequest(endAssessmentCogniable, variables);
  },
  endQuestionsAssessmentCogniable(variables) {
    return this.getRequest(endQuestionsAssessmentCogniable, variables);
  },
  fetchCogniableAssessmentQuestions(variables) {
    return this.getRequest(getCogniableAssessmentQuestionsQuery, variables);
  },
  saveCogniableAssessmentAnswer(variables) {
    return this.getRequest(saveCogniableAssessmentAnswerQuery, variables);
  },
  getRecordedAssessmentAreaCogniable(variables) {
    return this.getRequest(getRecordedAssessmentAreaCogniable, variables);
  },
  getIepReport(variables) {
    return this.getRequest(getIepReport, variables);
  },
  getGuide(variables){
    return this.getRequest(GUIDE,variables)
  },
  getUser(variables) {
    return this.getRequest(getUser, variables);
  },

  updateReminder(variables) {
    return this.getRequest(updateReminder, variables);
  },

  getReportVbmapps(variables) {
    return this.getRequest(getReportVbmapps, variables);
  },

  iepReportVbmapps(variables) {
    return this.getRequest(iepReportVbmapps, variables);
  },

  vbmappSuggestedTargets(variables) {
    return this.getRequest(vbmappSuggestedTargets, variables);
  },

  getStepsForTarget(variables) {
    return this.getRequest(getStepsForTarget, variables);
  },

  getSdForTarget(variables) {
    return this.getRequest(getSdForTarget, variables);
  },
  cogniableSuggestedTargets(variables) {
    return this.getRequest(cogniableSuggestedTargets, variables);
  },

  updateTarget(variables) {
    return this.getRequest(updateTarget, variables);
  },
  cogniableReport(variables) {
    return this.getRequest(cogniableReport, variables);
  },
  peakTableReport(variables) {
    return this.getRequest(peakTableReport, variables);
  },
  peakReportLastFourData(variables) {
    return this.getRequest(peaktriangleReportLastFourData, variables);
  },
  peakTableReportFinalAgeSave(variables) {
    return this.getRequest(finalAgeUpdate, variables);
  },
  peakTableReportFactorsAgeSave(variables) {
    return this.getRequest(factorAgeUpdate, variables);
  },
  factoreScoreDetatils(variables) {
    return this.getRequest(factoreScoreDetatils, variables);
  },
  getRecordingTypeList() {
    return this.getRequest(RECORDING_TYPE)
  },
  getBehaviourList() {
    return this.getRequest(GET_BEHAVIOUR)
  },
  getBehaviour(variables) {
    return this.getRequest(GET_BEHAVIOUR,variables)
  },
  getPromptCodes() {
    return this.getRequest(PROMPT_CODES)
  },
  getBehPromptCodes() {
    return this.getRequest(BEH_PROMPT_CODES)
  },
  getBehReinforces(){
    return this.getRequest(reinforce)
  },

  getProgramAreas(variables) {
    return this.getRequest(PROGRAM_AREA, variables)
  },

  therapistGetLongTermGoals(variables) {
    return this.getRequest(GET_LONG_GOALS, variables)
  },

  getlongTermsDetails(variables) {
    return this.getRequest(GET_LONG_GOALS_DETAILS, variables)
  },

  // iisca
  getIISCAPrograms(variables){
    return this.getRequest(IISCA_PROGRAMS,variables)

  },
  createIISCAProgram(variables){
    return this.getRequest(CREATE_IISCA_PROGRAM,variables)

  },
  deleteIISCAAssessment(variables){
    return this.getRequest(deleteIISCAAssessment,variables)
  },
  createStudentQuestionare(variables){
    return this.getRequest(CREATE_STUDENT_QUESTIONARE_MUTATION,variables)

  },
  getQuestionareByName(variables){
    return this.getRequest(GET_QUESTIONARE_BY_NAME,variables)

  },
  getQuestionareAnswer(variables){

    return this.getRequest(GET_QUESTIONARE_ANSWERS,variables)

  },
  saveAnswer(variables){
    return this.getRequest(SAVE_ANSWER_MUTATION,variables)
  },
  getQuestionareChoices() {
    return this.getRequest(GET_QUESTIONARE)
  },

  getDefaultGoals(variables) {
    return this.getRequest(DEFAULT_SHORT_TERM_GOALS, variables)
  },

  getSbtDefaultSteps(){
    return this.getRequest(GET_SBT_DEFAULT_STEPS)
  },

  getFilteredShortTermGoals(variables) {
    return this.getRequest(SHORT_TERM_GOALS, variables)
  },

  getFilteredLongTermGoals(variables) {
    return this.getRequest(LONG_TERM_GOAL, variables)
  },
  getStudentDropdownData(variables) {
    return this.getRequest(STUDENT_DROPDOWNS, variables)
  }
};
