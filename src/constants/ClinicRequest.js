import {
    clinicProfileData, clinicGetStaffList, clinicUpdateProfile,
    clinicEmployeeTimesheet, clinicEmployeeAttendance, clinicEmployeeAppointment, clinicEmployeeApproveLeave,
    clinicTaskInit, clinicTaskNew, clinicStaffNew,
    clinicHomeData, clinicGetRole, getStudentGraphData, getStudentGraphInfo,
    clinicCloseTask, getPeakEquiByTargetId, recordPeakEquiRecord, get5dayPercentage2,
    clinicTaskUpdate, setClinicUserSettingsData, getPeakEquiRecord, getPeakEquiClassRecord,setCircleLearnerTargets,
    getStudentDailyResponse, getStudentDailyResponseInfo, listStatus, clinicUpdateTask,
    getGroupsList, getCategroryList, clinicUserSettingsData, saveCount, getCount, updatePeakEquiRecord, peakBlockWise,peakEquivalence
} from './clinic';
import BaseRequest from './BaseRequest';

export default {
    dispatchFunction: null,

    setDispatchFunction(func) {
        this.dispatchFunction = func;
    },

    getRequest(mutation, variables = {}, refreshQuery = false) {
        return BaseRequest.getRequest(this.dispatchFunction, mutation, variables, refreshQuery);
    },

    getHomeData(variables){
        return this.getRequest(clinicHomeData, variables);
    },
    getGroupsData(){
        return this.getRequest(getGroupsList);
    },
    getCategoryData(){
        return this.getRequest(getCategroryList);
    },
    getProfileData() {
        return this.getRequest(clinicProfileData);
    },

    getProfileSetting(variables) {
        return this.getRequest(clinicUserSettingsData, variables);
    },

    getPeakEquiByTargetId(variables) {
        return this.getRequest(getPeakEquiByTargetId, variables);
    },

    recordPeakEquiTarget(variables) {
        return this.getRequest(recordPeakEquiRecord, variables);
    },

    updatePeakEquiRecord(variables) {
        return this.getRequest(updatePeakEquiRecord, variables);
    },
    get5dayPercentage2(variables){
        return this.getRequest(get5dayPercentage2,variables)
    },
    getPeakEquRecord(variables) {
        return this.getRequest(getPeakEquiRecord, variables);
    },
    getPeakEquClassRecord(variables) {
        return this.getRequest(getPeakEquiClassRecord, variables);
    },
    getCircleLearnerTargets(variables) {
        return this.getRequest(setCircleLearnerTargets, variables);
    },

    updateProfileSetting(variables) {
        return this.getRequest(setClinicUserSettingsData, variables);
    },

    updateProfileData(variables){
        return this.getRequest(clinicUpdateProfile, variables);
    },

    listStatus(){
        return this.getRequest(listStatus);
    },

    closeTask(variables){
        return this.getRequest(clinicCloseTask, variables);
    },

    updateTask(variables){
        return this.getRequest(clinicUpdateTask, variables);
    },

    getStaffList() {
        return this.getRequest(clinicGetStaffList);
    },

    getEmployeeTimesheet(variables) {
        return this.getRequest(clinicEmployeeTimesheet, variables);
    },

    getEmployeeAttendance(variables) {
        return this.getRequest(clinicEmployeeAttendance, variables);
    },

    getEmployeeAppointment(variables) {
        return this.getRequest(clinicEmployeeAppointment, variables);
    },

    approveLeaveRequest(variables) {
        return this.getRequest(clinicEmployeeApproveLeave, variables);
    },

    getTaskInit() {
        return this.getRequest(clinicTaskInit);
    },

    taskNew(variables) {
        return this.getRequest(clinicTaskNew, variables);
    },

    taskUpdate(variables) {
        return this.getRequest(clinicTaskUpdate, variables);
    },

    saveCount(variables) {
        return this.getRequest(saveCount, variables);
    },

    getCount(variables) {
        return this.getRequest(getCount, variables);
    },

    staffNew(variables) {
        return this.getRequest(clinicStaffNew, variables);
    },

    staffGetRole(){
        return this.getRequest(clinicGetRole);
    },

    getStudentGraphData(){
        return this.getRequest(getStudentGraphData);
    },
    getStudentGraphInfo(variables){
        return this.getRequest(getStudentGraphInfo, variables);
    },
    getDailyResponseData(){
        return this.getRequest(getStudentDailyResponse);
    },
    getDailyResponseInfo(variables){
        return this.getRequest(getStudentDailyResponseInfo, variables);
    },
    peakBlockWise(variables){
        return this.getRequest(peakBlockWise,variables)
    },
    peakEquivalence(variables){
        return this.getRequest(peakEquivalence,variables)
    }
}
