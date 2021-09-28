// import { ApolloClient, HttpLink,ApolloLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import {client as cl} from './ApolloClient';
import apolloClient from '../apollo/config';
// import store from '../redux/store/index';

// const developmentUrl = "https://development.cogniable.us/apis/graphql";
// const productionUrl = "https://application.cogniable.us/apis/graphql";

// export const client = new ApolloClient({
//   link: new ApolloLink((operation, forward) => {
//     const token = store.getState().authToken;
//     // console.log('---------------------' + store.getState().authToken);
//     operation.setContext({
//       headers: {
//         authorization: token ? `jwt ${token}` : '', //Your Auth token extraction logic
//         database: 'india',
//       }
//     });
//     return forward(operation);
//   }).concat(
//     new HttpLink({
//       uri: developmentUrl, // Server URL
//     })
//   ),
//   cache: new InMemoryCache()
// });
export const client = cl;
export const createAssessment = gql`
  mutation vbmappCreateAssessment($studentID: ID!, $color: String!) {
    vbmappCreateAssessment(input: {student: $studentID, color: $color}) {
      status
      message
      details {
        id
        testNo
        date
        color
        student {
          id
          firstname
        }
      }
    }
  }
`;

export const getQuestions = gql`
  mutation vbmappGetQuestions(
    $studentID: ID!
    $areaID: ID!
    $groupID: ID!
    $master: ID!
  ) {
    vbmappGetQuestions(
      input: {
        student: $studentID
        area: $areaID
        group: $groupID
        master: $master
      }
    ) {
      area
      group
      questions
    }
  }
`;

export const submitResponse = gql`
  mutation vbmappSubmitResponse(
    $master: ID!
    $areaID: ID!
    $groupID: ID!
    $question: Int!
    $score: Float!
  ) {
    vbmappSubmitResponse(
      input: {
        master: $master
        area: $areaID
        group: $groupID
        question: $question
        score: $score
      }
    ) {
      total
      details {
        id
        questionNum
        score
        date
        groups {
          id
          groupName
        }
      }
    }
  }
`;

export const submitResponseTask = gql`
  mutation vbmappSubmitResponse(
    $master: ID!
    $areaID: ID!
    $groupID: ID!
    $question: Int!
    $code: String!
  ) {
    vbmappSubmitResponse(
      input: {
        master: $master
        area: $areaID
        group: $groupID
        question: $question
        code: $code
      }
    ) {
      total
      details {
        id
        questionNum
        code
        date
        groups {
          id
          groupName
        }
      }
    }
  }
`;

export const getAreasList = gql`
  query {
    vbmappAreas {
      id
      apiArea
      areaName
      description
    }
  }
`;

export const getMilestoneGroups = gql`
  query vbmappGroups($areaID: ID!) {
    vbmappGroups(area: $areaID) {
      edges {
        node {
          id
          apiGroup
          groupName
          noQuestion
        }
      }
    }
  }
`;

export const getAssessmentsList = gql`
  query vbmappGetAssessments($studentID: ID!) {
    vbmappGetAssessments(student: $studentID) {
      edges {
        total
        totalPercent
        milestone
        milestonePercent
        barriers
        barriersPercent
        transition
        transitionPercent
        eesa
        eesaPercent
        node {
          id
          date
          testNo
          color
          student {
            id
            firstname
          }
        }
      }
    }
  }
`;

export const deleteVBMAPPAssessment=gql`
mutation($id:ID!) {
  vbmappDeleteAssessment (input: {pk: $id}) {
    status
    message
  }
}
`;

export const getGuideChapters = gql`
  mutation {
    vbmappGuide(input: {}) {
      details
    }
  }
`;

export const getChapterDetails = gql`
  mutation vbmappGuide($chapterNumber: Int!) {
    vbmappGuide(input: {chapter: $chapterNumber}) {
      details
    }
  }
`;

export const createNotes = gql`
  mutation vbmappCreateNote($areaID: ID!, $master: ID!, $note: String!) {
    vbmappCreateNote(
      input: {area: $areaID, masterRecord: $master, note: $note}
    ) {
      details {
        id
        note
        area {
          id
          apiArea
          areaName
        }
        masterRecord {
          id
          date
          testNo
        }
      }
    }
  }
`;

export const getNotes = gql`
query($id: ID) {
  vbmappGetNotes(masterRecord: $id) {
    edges {
      node {
        id
        note
        area {
          id
          apiArea
          areaName
        }
        masterRecord {
          id
          date
          testNo
        }
      }
    }
  }
}
`;

export const GUIDE = gql`
  mutation {
    vbmappGuide(input: {}) {
      details
    }
  }
`

export const getIepReport = gql`
  mutation VbmappIepReport($pk: ID!) {
    vbmappIepReport(input: {pk: $pk}) {
      status
      data
    }
  }
`;

export const therapistDashboard = gql`
  query therapistDashboard($therapist: ID) {
    upcoming_appointment: appointments(first: 3, therapist: $therapist) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
            mobileno
            lastname
          }
          isApproved
          purposeAssignment
          title
          appointmentStatus {
            id
            appointmentStatus
          }
          location {
            id
            location
          }
          feedbackanswersSet {
            id
            feedbackUser {
              id
            }
            question {
              id
              question
              type
              group {
                id
                name
              }
            }
            answerText
            answerRating
          }
        }
      }
    }
    lastStatus(first: 1) {
      edges {
        node {
          checkIn
          checkOut
          status
        }
      }
    }
    attendence: attendances(first: 1) {
      edges {
        node {
          id
          checkIn
          checkOut
          checkInLatitude
          checkInLongitude
          status
        }
      }
    }
    timesheet: timesheets(first: 1) {
      edges {
        node {
          id
          start
          end
          title
          note
          location {
            id
            location
          }
          status {
            id
            statusName
          }
        }
      }
    }
    tasks(last: 6) {
      edges {
        node {
          id
          taskName
          description
          startDate
          dueDate
          priority {
            id
            name
          }
          status {
            id
            taskStatus
            colorCode
          }
          taskType {
            id
            taskType
          }
        }
      }
    }
  }
`;

export const getTaskList = gql`
  query {
    tasks {
      edges {
        node {
          id
          taskName
          description
          startDate
          dueDate
          priority {
            id
            name
          }
          assignWork {
            edges {
              node {
                id
                name
                image
              }
            }
          }
          status {
            id
            taskStatus
            colorCode
          }
          taskType {
            id
            taskType
          }
          remainders {
            edges {
              node {
                id
                time
                frequency {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
          students {
            edges {
              node {
                id
                firstname
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

// $checkInLatitude: String!
// $checkInLongitude: String!

export const theraphistCheckIn = gql`
  mutation checkInAttendance(
    $checkIn: DateTime!
    $checkInLatitude: String!
    $checkInLongitude: String!
  ) {
    CheckInAttendance(
      input: {
        Userattendance: {
          checkIn: $checkIn
          checkInLongitude: $checkInLatitude
          checkInLatitude: $checkInLongitude
        }
      }
    ) {
      attendance {
        id
      }
    }
  }
`;

// export const theraphistCheckIn = gql`
// 	mutation checkInAttendance($time: String!, $latitude: String!, $longitude: String!) {
// 		CheckInAttendance(input:{Userattendance:{checkIn: "2020-05-03T13:38:48", checkInLongitude: $longitude, checkInLatitude: $latitude}})
// 		{
// 			attendance
// 			{
// 				id
// 			}
// 		}
// 	}
// `;

// export const theraphistCheckOut = gql`
// 	mutation checkOutAttendance($id: ID!, $checkOut: String!, $checkOutLongitude: String!, $checkOutLatitude: String!) {
// 		CheckOutAttendance(
// 			input: {
// 				Userattendance:{
// 					id: $id,
// 					checkOut: $checkOut,
// 					checkOutLongitude: $checkOutLongitude,
// 					checkOutLatitude: $checkOutLatitude
// 				}
// 			}
// 		) {
// 			attendance
// 			{
// 				id
// 			}
// 		}
// 	}
// `;

export const theraphistCheckOut = gql`
  mutation checkOutAttendance(
    $id: ID!
    $checkOut: DateTime!
    $checkOutLatitude: String!
    $checkOutLongitude: String!
  ) {
    CheckOutAttendance(
      input: {
        Userattendance: {
          id: $id
          checkOut: $checkOut
          checkOutLongitude: $checkOutLatitude
          checkOutLatitude: $checkOutLongitude
        }
      }
    ) {
      attendance {
        id
      }
    }
  }
`;

export const theraphistCheckInOut = gql`
  mutation startEnd($lat: String!, $lng: String!) {
    checkInOut(input: {longitude: $lng, latitude: $lat}) {
      details {
        id
        checkIn
        checkOut
        checkInLocation
        checkOutLocation
      }
    }
  }
`;

export const therapistWorkLogList = gql`
  query TherapistWorkLogList($date: Date!) {
    upcoming_appointment: appointments(start_Date: $date) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
          }
          purposeAssignment
          title
          location {
            id
            location
          }
        }
      }
    }
    timesheet: timesheets(start_Date: $date) {
      edges {
        node {
          id
          start
          end
          title
          note
          location {
            id
            location
          }
          status {
            id
            statusName
          }
        }
      }
    }
  }
`;

export const therapistWorkLogNew = gql`
  mutation createTimesheet(
    $title: String!
    $location: ID!
    $note: String!
    $start: DateTime!
    $end: DateTime!
    $isApproved: Boolean!
    $isBillable: Boolean!
  ) {
    CreateTimesheet(
      input: {
        timesheet: {
          title: $title
          location: $location
          note: $note
          start: $start
          end: $end
          isApproved: $isApproved
          isBillable: $isBillable
        }
      }
    ) {
      timesheet {
        id
      }
    }
  }
`;

export const therapistLocationList = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
  }
`;

export const GetClinicVideo = gql`
  query getClinicLibrary($clinic: ID!) {
    getClinicLibrary(clinic: $clinic) {
      edges {
        node {
          id
          name
          description
          clinic {
            id
            schoolName
          }
          videos {
            edges {
              node {
                id
                url
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;
export const GetClinicID = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
      internalNo
      dob
      school {
        id
        schoolName
      }
      programArea {
        edges {
          node {
            id
            name
            description
          }
        }
      }
    }
  }
`;
export const GetStudent = gql`
  query {
    schoolDetail {
      id
      schoolName
      address
    }
  }
`;

export const therapistGetStudentList = gql`
  query {
    recent_student: students(first: 6, orderBy: "-id") {
      edges {
        node {
          id
          firstname
          lastname
          image
          dob
          internalNo
          clientId
          createdAt
          mobileno
          isActive
          clinicLocation {
            location
          }
        }
      }
    }
    student_data: students(orderBy: "-id") {
      edges {
        node {
          id
          firstname
          lastname
          internalNo
          image
          dob
          mobileno
          isActive
          clinicLocation {
            location
          }
          caseManager {
            id
            email
            contactNo
            name
          }
          parent {
            id
          }
          category {
            id
            category
          }
        }
      }
    }
  }
`;

export const therapistLeaveRequestList = gql`
  {
    leaveRequest {
      edges {
        node {
          id
          start
          end
          status
          description
          requestedAt
        }
      }
    }
  }
`;

export const therapistLeaveRequestNew = gql`
  mutation createLeaveRequest(
    $description: String!
    $start: Date!
    $end: Date!
  ) {
    CreateLeaveRequest(
      input: {
        leaverequest: {description: $description, start: $start, end: $end}
      }
    ) {
      leaverequest {
        id
      }
    }
  }
`;

export const getAppointmentStatus = gql`
  query {
    appointmentStatuses {
      id
      appointmentStatus
    }
  }
`;

export const therapistCalendarList = gql`
  query TherapistWorkLogList($date: Date!) {
    upcoming_appointment: appointments(start_Date: $date) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
            lastname
            image
            mobileno
          }
          isApproved
          purposeAssignment
          title
          note
          # enableReminder
          appointmentStatus {
            id
            appointmentStatus
          }
          location {
            id
            location
          }
          therapist {
            id
            name
          }
          attendee {
            edges {
              node {
                id
                name
              }
            }
          }
          feedbackanswersSet {
            id
            feedbackUser {
              id
            }
            question {
              id
              question
              type
              group {
                id
                name
              }
            }
            answerText
            answerRating
          }
        }
      }
    }
  }
`;

export const therapistGetAppointmentData = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          lastname
          internalNo
          image
          isActive
          clinicLocation {
            location
          }
        }
      }
    }
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
  }
`;

export const therapistAppointmentNew = gql`
  mutation CreateAppointment(
    $title: String!
    $studentId: ID!
    $therapistId: ID!
    $additionalStaff: [ID]
    $staffToStaff: Boolean!
    $locationId: ID
    $note: String
    $purposeAssignment: String!
    $startDateAndTime: DateTime!
    $endDateAndTime: DateTime!
    $enableRecurring: Boolean!
    $startDate: String!
    $endDate: String!
    $startTime: String!
    $endTime: String!
    $isApproved: Boolean!
    $selectedDays: [String]
    $appointmentStatus: ID
  ) {
    CreateAppointment(
      input: {
        appointment: {
          title: $title
          student: $studentId
          therapist: $therapistId
          attendee: $additionalStaff
          location: $locationId
          note: $note
          purposeAssignment: $purposeAssignment
          start: $startDateAndTime
          end: $endDateAndTime
          isApproved: $isApproved
          staffToStaff: $staffToStaff
          appointmentStatus: $appointmentStatus
        }
        recurring: {
          enableRecurring: $enableRecurring
          startDate: $startDate
          endDate: $endDate
          startTime: $startTime
          endTime: $endTime
          days: $selectedDays
        }
      }
    ) {
      appointment {
        id
        title
      }
      recurring {
        id
        start
        end
      }
    }
  }
`;

export const therapistAppointmentEdit = gql`
  mutation UpdateAppointment(
    $id: ID!
    $title: String!
    $studentId: ID!
    $therapistId: ID!
    $additionalStaff: [ID]
    $staffToStaff: Boolean!
    $locationId: ID
    $note: String
    $purposeAssignment: String!
    $startDateAndTime: DateTime!
    $endDateAndTime: DateTime!
    $enableRecurring: Boolean!
    # $startDate: String!,
    # $endDate: String!,
    # $startTime: String!,
    # $endTime: String!,
    $isApproved: Boolean!
    # $selectedDays: [String],
    $appointmentStatus: ID
  ) {
    UpdateAppointment(
      input: {
        appointment: {
          id: $id
          therapist: $therapistId
          student: $studentId
          location: $locationId
          title: $title
          purposeAssignment: $purposeAssignment
          note: $note
          appointmentStatus: $appointmentStatus
          start: $startDateAndTime
          end: $endDateAndTime
          enableReminder: $enableRecurring
          staffToStaff: $staffToStaff
          isApproved: $isApproved
          attendee: $additionalStaff
        }
      }
    ) {
      appointment {
        id
      }
    }
  }
`;

export const therapistAppointmentDelete = gql`
  mutation deleteAppointment($id: ID!) {
    DeleteAppointment(id: $id) {
      success
    }
  }
`;

export const therapistStudentNewData = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
    category {
      id
      category
    }
    staffs {
      edges {
        node {
          id
          name
          user {
            id
          }
        }
      }
    }
    students {
      edges {
        node {
          id
          firstname
          parent {
            id
          }
        }
      }
    }
  }
`;
export const theCaseManger = gql`
  query {
    staffs(isActive: true) {
      edges {
        node {
          id
          name
          surname
        }
      }
    }
  }
`;
export const therapistStudentNew = gql`
  mutation CreateStudent(
    $clientId: String!
    $streetAddress: String
    $city: String
    $state: String
    $country: String
    $categoryId: ID!
    $email: String!
    $dateOfBirth: Date!
    $gender: String!
    $clinicLocation: ID!
    $firstName: String!
    $zipCode: String
    $lastName: String!
    $authStaff: ID
    $caseManager: ID
    $language: ID
  ) {
    createStudent(
      input: {
        studentData: {
          clientId: $clientId
          category: $categoryId
          streetAddress: $streetAddress
          city: $city
          state: $state
          country: $country
          email: $email
          gender: $gender
          dob: $dateOfBirth
          zipCode: $zipCode
          clinicLocation: $clinicLocation
          firstname: $firstName
          lastname: $lastName
          caseManager: $caseManager
          language: $language
          authStaff: [$authStaff]
        }
      }
    ) {
      student {
        firstname
        id
      }
    }
  }
`;

export const therapistGoalResponsibility = gql`
  query {
    goalResponsibility {
      id
      name
    }
  }
`;

export const therapistGoalStatus = gql`
  query {
    goalStatus {
      id
      status
    }
  }
`;

export const therapistGoalsAssessment = gql`
  query {
    goalsAssessment {
      id
      name
    }
  }
`;

export const therapistCreateLongTerm = gql`
  mutation CreateLongTerm(
    $student: ID!
    $goalName: String!
    $description: String!
    $dateInitialted: Date!
    $dateEnd: Date!
    $programArea: ID!
    $responsibility: ID!
    $goalStatus: ID!
  ) {
    createLongTerm(
      input: {
        goalData: {
          student: $student
          goalName: $goalName
          description: $description
          dateInitialted: $dateInitialted
          dateEnd: $dateEnd
          programArea: $programArea
          responsibility: $responsibility
          goalStatus: $goalStatus
        }
      }
    ) {
      details {
        id
      }
    }
  }
`;

export const getAreaList = gql`
  query {
    vbmappAreas {
      id
      apiArea
      areaName
      description
    }
  }
`;

export const GET_VBMAPP_TARGET = gql`
  mutation vbmappTargetSuggest($pk: ID!, $area: ID!) {
    vbmappTargetSuggest(input: {pk: $pk, area: $area}) {
      targets {
        id
        domain {
          id
          domain
        }
        targetArea {
          id
          Area
        }
        targetInstr
        video
        targetMain {
          id
          targetName
        }
      }
    }
  }
`;

export const therapistStudentPrograms = gql`
  query therapistStudentPrograms($studentId: ID!) {
    studentProgramArea(studentId: $studentId) {
      id
      name
      description
      percentageLong
      domain {
        edges {
          node {
            id
            domain
          }
        }
      }
    }
  }
`;
export const therapistGetLongTermGoals = gql`
  query TherapyPrograms($student: ID!, $program: ID!) {
    programDetails(id: $program) {
      id
      name
      description
      longtermgoalSet(student: $student) {
        edges {
          node {
            id
            percentageCorr
            masterTar
            totalTar
            goalName
            description
            dateInitialted
            dateEnd
            responsibility {
              id
              name
            }
            goalStatus {
              id
              status
            }
            shorttermgoalSet {
              edges {
                node {
                  id
                  goalName
                  percentageCorr
                  description
                  dateInitialted
                  dateEnd
                  assessment {
                    id
                    name
                  }
                  responsibility {
                    id
                    name
                  }
                  goalStatus {
                    id
                    status
                  }
                  targetAllocateSet {
                    edges {
                      node {
                        id
                        goalName
                        targetStatus {
                          id
                          statusName
                        }
                        targetAllcatedDetails {
                          id
                          targetName
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const therapistCreatShortTermGoal = gql`
  mutation createShortTerm(
    $longTerm: ID!
    $goalName: String!
    $description: String!
    $dateInitialted: Date!
    $dateEnd: Date!
    $responsibility: ID!
    $assessment: ID!
    $goalStatus: ID!
  ) {
    createShortTerm(
      input: {
        goalData: {
          longTerm: $longTerm
          goalName: $goalName
          description: $description
          dateInitialted: $dateInitialted
          dateEnd: $dateEnd
          responsibility: $responsibility
          assessment: $assessment
          goalStatus: $goalStatus
        }
      }
    ) {
      details {
        id
      }
    }
  }
`;

export const therapistProfile = gql`
  query profile($userId: ID!) {
    userSettings(user: $userId) {
      edges {
        node {
          id
          language
          sessionReminders
          medicalReminders
          dataRecordingReminders
        }
      }
    }
    users(id: $userId) {
      id
      firstName
      lastName
      username
      email
      name
      school {
        id
        schoolName
      }
      staffSet {
        edges {
          node {
            id
            contactNo
          }
        }
      }
      lastLogin
    }
  }
`;

export const updateTherapistProfile = gql`
  mutation updateStaff($id: ID, $email: String, $mobile: String) {
    updateStaff(input: {staffData: {id: $id, email: $email, mobile: $mobile}}) {
      staff {
        id
      }
    }
  }
`;

export const therapistGetTargetArea = gql`
  query TargetArea($domain: [ID]) {
    targetArea(domain: $domain) {
      edges {
        node {
          id
          Area
        }
      }
    }
  }
`;
export const therapistGetTargets = gql`
  query getTargets($domain: ID!, $targetArea: ID!, $student: ID) {
    target(domain: $domain, targetArea: $targetArea, student: $student ) {
      edges {
        node {
          id
          allocatedTar
          domain {
            id
            domain
          }
          targetArea {
            id
            Area
          }
          targetMain {
            id
            targetName
          }
          video
          targetInstr
        }
      }
    }
  }
`;
export const therapistGetAllocateTargets = gql`
  query targetAllocates($shortTerm: ID!) {
    targetAllocates(shortTerm: $shortTerm) {
      edges {
        node {
          id
          time
          targetInstr
          date
          objective
          peakBlocks
          default
          manualAllocateDomain {
            id
            domain
          }
          masteryCriteria {
            id
            name
            isDefault
          }
          targetStatus {
            id
            statusName
          }
          shortTerm {
            id
            goalName
            isDefault
          }
          sessionSet {
            edges {
              node {
                id
                sessionName {
                  id
                  name
                }
              }
            }
          }
          targetId {
            id
            domain {
              id
              domain
            }
          }
          targetAllcatedDetails {
            id
            targetName
            dateBaseline
            DailyTrials
            trialDuration
            consecutiveDays
            targetType {
              id
              typeTar
            }
            promptCodes {
              edges {
                node {
                  id
                  promptName
                }
              }
            }
          }
          videos {
            edges {
              node {
                id
                url
              }
            }
          }
          r1 {
            id
            behaviorName
          }
          r2 {
            id
            behaviorName
          }
          targetDocs {
            edges {
              node {
                id
                sd {
                  id
                  sd
                }
                step {
                  id
                  step
                }
                url
              }
            }
          }
          sd {
            edges {
              node {
                id
                sd
                sdstepsmasterySet {
                  edges {
                    node {
                      id
                      status {
                        id
                        statusName
                      }
                      mastery {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
          steps {
            edges {
              node {
                id
                step
                sdstepsmasterySet {
                  edges {
                    node {
                      id
                      status {
                        id
                        statusName
                      }
                      mastery {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
          mastery {
            edges {
              node {
                id
                sd {
                  id
                  sd
                }
                step {
                  id
                  step
                }
                status {
                  id
                  statusName
                }
                mastery {
                  id
                  name
                }
                prompts {
                  edges {
                    node {
                      id
                      promptName
                    }
                  }
                }
                behPrompts {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                manualMastery {
                  edges {
                    node {
                      id
                      gte
                      lte
                      isDaily
                      responsePercentage
                      minTrial
                      masteryType
                      noOfProblemBehavior
                      duration
                      consecutiveDays
                      fromStatus {
                        id
                        statusName
                      }
                      toStatus {
                        id
                        statusName
                      }
                    }
                  }
                }
              }
            }
          }
          manualMastery {
            edges {
              node {
                id
                gte
                lte
                isDaily
                responsePercentage
                minTrial
                consecutiveDays
                masteryType
                noOfProblemBehavior
                duration
                fromStatus {
                  id
                  statusName
                }
                toStatus {
                  id
                  statusName
                }
              }
            }
          }
          targetDocs {
            edges {
              node {
                id
                url
              }
            }
          }
          recordingType {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;
export const therapistGetTargetsByDomain = gql`
  query getTargets($domain: ID!) {
    target(domain: $domain) {
      edges {
        node {
          id
          domain {
            id
            domain
          }
          targetArea {
            id
            Area
          }
          targetMain {
            id
            targetName
          }
        }
      }
    }
  }
`;

export const therapistGetMasteryData = gql`
  query {
    masteryCriteria {
      id
      name
    }
  }
`;

export const getAllTargetSetting = gql`
  query($studentId: ID!) {
    getAllocateTargetSettings(student: $studentId) {
      edges {
        node {
          id
          dailyTrials
          consecutiveDays
          student {
            id
            firstname
          }
          targetType {
            id
            typeTar
          }
          masteryCriteria {
            id
            name
          }
          status {
            id
            statusName
          }
        }
      }
    }
  }
`;

export const therapistAllocateNewTargetNew = gql`
  mutation CreateTargetAllocate(
    $studentId: ID!
    $shortTerm: ID!
    $targetId: ID!
    $targetStatus: ID!
    $targetInstr: String!
    $date: Date!
    $masteryCriteria: ID!
    $targetName: String!
    $dailyTrials: Int!
    $consecutiveDays: Int!
    $targetType: ID!
    $video: [String]
    $default: Boolean
    $domain: ID
    $prompts: [ID]
    $targetDocs: [TargetDocsInput]
    $sd: [SdMasteryInput]
    $steps: [StepMasteryInput]
    $classes: [ClassesInput]
    $manualMastery: [ManualMasteryInput]
    $r1: ID
    $r2: ID
    $recordingType: [ID]
    $trialDuration: Int
  ) {
    createTargetAllocate2(
      input: {
        makeDefault: $default
        targetData: {
          shortTerm: $shortTerm
          targetId: $targetId
          studentId: $studentId
          targetStatus: $targetStatus
          objective: ""
          date: $date
          targetInstr: $targetInstr
          goodPractices: ""
          precaution: ""
          gernalizationCriteria: ""
          masteryCriteria: $masteryCriteria
          targetName: $targetName
          DailyTrials: $dailyTrials
          consecutiveDays: $consecutiveDays
          targetType: $targetType
          promptCodes: []
          prompts: $prompts
          sd: $sd
          steps: $steps
          videos: $video
          domain: $domain
          R1: $r1
          R2: $r2
          recordingType: $recordingType
          TrialDuration: $trialDuration
        }
        targetDocs: $targetDocs
        manualMastery: $manualMastery
        classes: $classes
      }
    ) {
      targetName
      target {
        id
        date
        targetInstr
        targetStatus {
          id
          statusName
        }
        shortTerm {
          id
          goalName
        }
        sessionSet {
          edges {
            node {
              id
            }
          }
        }
        targetId {
          id
          domain {
            id
            domain
          }
        }
        masteryCriteria {
          id
          name
        }
        isManual
        manualAllocateDomain {
          id
          domain
        }
        targetAllcatedDetails {
          id
          targetName
          dateBaseline
          DailyTrials
          consecutiveDays
          promptCodes {
            edges {
              node {
                id
                promptName
              }
            }
          }
          targetType {
            id
            typeTar
          }
          time
        }
        videos {
          edges {
            node {
              id
              url
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
              sd {
                id
                sd
              }
              step {
                id
                step
              }
            }
          }
        }
        classes {
          edges {
            node {
              id
              name
              stimuluses {
                edges {
                  node {
                    id
                    option
                    stimulusName
                  }
                }
              }
            }
          }
        }
        mastery {
          edges {
            node {
              id
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              status {
                id
                statusName
              }
              mastery {
                id
                name
              }
              prompts {
                edges {
                  node {
                    id
                    promptName
                  }
                }
              }
              behPrompts {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              manualMastery {
                edges {
                  node {
                    id
                    responsePercentage
                    minTrial
                    consecutiveDays
                    noOfProblemBehavior
                    masteryType
                    duration
                    fromStatus {
                      id
                      statusName
                    }
                    toStatus {
                      id
                      statusName
                    }
                  }
                }
              }
            }
          }
        }
        manualMastery {
          edges {
            node {
              id
              responsePercentage
              minTrial
              consecutiveDays
              noOfProblemBehavior
              masteryType
              duration
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
            }
          }
        }
        sd {
          edges {
            node {
              id
              sd
            }
          }
        }
        steps {
          edges {
            node {
              id
              step
            }
          }
        }
        baselineDate
        domainName
        default
        r1 {
          id
          behaviorName
        }
        r2 {
          id
          behaviorName
        }
      }
    }
  }
`;

// export const therapistAllocateNewTarget = gql`
// 	mutation CreateTargetAllocate(
// 		$shortTerm: ID!
// 		$targetId: ID!
// 		$studentId: ID!
// 		$targetStatus: ID!
// 		$objective: String!
// 		$date: Date!
// 		$targetInstr: String!
// 		$goodPractices: String!
// 		$precaution: String!
// 		$gernalizationCriteria: String!
// 		$masteryCriteria: ID!
// 		$targetName: String!
// 		$DailyTrials: Int!
// 		$consecutiveDays: Int!
// 		$targetType: ID!
// 		$sd: [SdMasteryInput]
// 	    $steps: [StepMasteryInput]
// 		$videos: [String]
// 		$peakBlocks:Int
// 		$peakType: String!
// 		$classes: [ClassesInput]

// 	) {
// 	createTargetAllocate2(
// 		input: {
// 			targetData: {
// 				shortTerm: $shortTerm
// 				targetId: $targetId
// 				studentId: $studentId
// 				targetStatus: $targetStatus
// 				objective: $objective
// 				date: $date
// 				targetInstr: $targetInstr
// 				goodPractices: $goodPractices
// 				precaution: $precaution
// 				gernalizationCriteria: $gernalizationCriteria
// 				masteryCriteria: $masteryCriteria
// 				targetName: $targetName
// 				DailyTrials: $DailyTrials
// 				consecutiveDays: $consecutiveDays
// 				targetType: $targetType
// 				promptCodes: []
// 				sd: $sd
// 				steps: $steps
// 				videos: $videos
// 				peakBlocks:$peakBlocks
// 				peakType: $peakType
// 			}
// 			classes:$classes

// 		}
// 	) {
// 		targetName
// 		target {
// 			id
// 			date
// 			targetInstr
// 			targetStatus {
// 				id
// 				statusName
// 			}
// 			sessionSet {
// 				edges {
// 					node {
// 						id
// 					}
// 				}
// 			}
// 			targetId {
// 				id
// 				domain {
// 					id
// 					domain
// 				}
// 			}
// 			targetAllcatedDetails {
// 				id
// 				targetName
// 				dateBaseline
// 				DailyTrials
// 				consecutiveDays
// 				targetType {
// 					id
// 					typeTar
// 				}
// 			}
// 			sd {
// 				edges {
// 					node {
// 						id
// 						sd
// 					}
// 				}
// 			}
// 			steps {
// 				edges {
// 					node {
// 						id
// 						step
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// `;

export const therapistAllocateNewTarget = gql`
  mutation(
    $studentId: ID
    $targetName: String!
    $shortTerm: ID
    $targetId: ID
    $targetStatus: ID
    $targetInstr: String
    $date: Date
    $masteryCriteria: ID
    $dailyTrials: Int
    $consecutiveDays: Int
    $targetType: ID
    $video: [String]
    $makeDefault: Boolean
    $peakBlocks: Int
    $peakType: String
    $equiCode: String
    $domain: ID
    $prompts: [ID]
    $targetDocs: [TargetDocsInput]
    $sd: [SdMasteryInput]
    $steps: [StepMasteryInput]
    $classes: [ClassesInput]
    $manualMastery: [ManualMasteryInput]
    $r1: ID
    $r2: ID
    $recordingType: [ID]
    $trialDuration: Int
    $sbtSteps: [SBTStepDataInput]
  ) {
    createTargetAllocate2(
      input: {
        makeDefault: $makeDefault
        targetData: {
          shortTerm: $shortTerm
          targetId: $targetId
          studentId: $studentId
          targetStatus: $targetStatus
          objective: ""
          date: $date
          targetInstr: $targetInstr
          goodPractices: ""
          precaution: ""
          gernalizationCriteria: ""
          masteryCriteria: $masteryCriteria
          targetName: $targetName
          DailyTrials: $dailyTrials
          consecutiveDays: $consecutiveDays
          targetType: $targetType
          prompts: $prompts
          sd: $sd
          steps: $steps
          videos: $video
          peakBlocks: $peakBlocks
          peakType: $peakType
          eqCode: $equiCode
          domain: $domain
          R1: $r1
          R2: $r2
          sbtStepData: $sbtSteps
          recordingType: $recordingType
          TrialDuration: $trialDuration
        }
        targetDocs: $targetDocs
        manualMastery: $manualMastery
        classes: $classes
      }
    ) {
      targetName
      target {
        id
        date
        targetStatus {
          id
          statusName
        }
        shortTerm {
          id
          goalName
        }
        objective
        targetId {
          id
          domain {
            id
            domain
          }
        }
        targetInstr
        masteryCriteria {
          id
          name
        }
        isManual
        manualAllocateDomain {
          id
          domain
        }
        videos {
          edges {
            node {
              id
              url
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
              sd {
                id
                sd
              }
              step {
                id
                step
              }
            }
          }
        }
        peakBlocks
        peakType
        classes {
          edges {
            node {
              id
              name
              stimuluses {
                edges {
                  node {
                    id
                    option
                    stimulusName
                  }
                }
              }
            }
          }
        }
        eqCode
        mastery {
          edges {
            node {
              id
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              status {
                id
                statusName
              }
              mastery {
                id
                name
              }
              prompts {
                edges {
                  node {
                    id
                    promptName
                  }
                }
              }
              behPrompts {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              manualMastery {
                edges {
                  node {
                    id
                    responsePercentage
                    minTrial
                    consecutiveDays
                    noOfProblemBehavior
                    masteryType
                    duration
                    fromStatus {
                      id
                      statusName
                    }
                    toStatus {
                      id
                      statusName
                    }
                  }
                }
              }
            }
          }
        }
        manualMastery {
          edges {
            node {
              id
              responsePercentage
              minTrial
              consecutiveDays
              noOfProblemBehavior
              masteryType
              duration
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
            }
          }
        }
        targetAllcatedDetails {
          id
          time
          targetType {
            id
            typeTar
          }
          targetName
          DailyTrials
          consecutiveDays
          promptCodes {
            edges {
              node {
                id
                promptName
              }
            }
          }
        }
        baselineDate
        domainName
        default
        r1 {
          id
          behaviorName
        }
        r2 {
          id
          behaviorName
        }
      }
    }
  }
`;

export const manualTargetAllocation = gql`
  mutation(
    $studentId: ID
    $targetName: String!
    $shortTerm: ID
    $targetId: ID
    $targetStatus: ID
    $targetInstr: String
    $date: Date
    $masteryCriteria: ID
    $dailyTrials: Int
    $consecutiveDays: Int
    $targetType: ID
    $video: [String]
    $makeDefault: Boolean
    $peakBlocks: Int
    $peakType: String
    $equiCode: String
    $domain: ID
    $prompts: [ID]
    $targetDocs: [TargetDocsInput]
    $sd: [SdMasteryInput]
    $steps: [StepMasteryInput]
    $classes: [ClassesInput]
    $manualMastery: [ManualMasteryInput]
    $r1: ID
    $r2: ID
    $recordingType: [ID]
    $trialDuration: Int
    $sbtSteps: [SBTStepDataInput]

  ) {
    createTargetAllocate2(
      input: {
        makeDefault: $makeDefault
        targetData: {
          shortTerm: $shortTerm
          targetId: $targetId
          studentId: $studentId
          targetStatus: $targetStatus
          objective: ""
          date: $date
          targetInstr: $targetInstr
          goodPractices: ""
          precaution: ""
          gernalizationCriteria: ""
          masteryCriteria: $masteryCriteria
          targetName: $targetName
          DailyTrials: $dailyTrials
          consecutiveDays: $consecutiveDays
          targetType: $targetType
          prompts: $prompts
          sd: $sd
          steps: $steps
          videos: $video
          peakBlocks: $peakBlocks
          peakType: $peakType
          eqCode: $equiCode
          domain: $domain
          R1: $r1
          R2: $r2
          sbtStepData: $sbtSteps
          recordingType: $recordingType
          TrialDuration: $trialDuration
        }
        targetDocs: $targetDocs
        manualMastery: $manualMastery
        classes: $classes
      }
    ) {
      targetName
      target {
        id
        date
        targetStatus {
          id
          statusName
        }
        shortTerm {
          id
          goalName
        }
        objective
        targetId {
          id
          domain {
            id
            domain
          }
        }
        targetInstr
        masteryCriteria {
          id
          name
        }
        isManual
        manualAllocateDomain {
          id
          domain
        }
        videos {
          edges {
            node {
              id
              url
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
              sd {
                id
                sd
              }
              step {
                id
                step
              }
            }
          }
        }
        peakBlocks
        peakType
        classes {
          edges {
            node {
              id
              name
              stimuluses {
                edges {
                  node {
                    id
                    option
                    stimulusName
                  }
                }
              }
            }
          }
        }
        eqCode
        mastery {
          edges {
            node {
              id
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              status {
                id
                statusName
              }
              mastery {
                id
                name
              }
              prompts {
                edges {
                  node {
                    id
                    promptName
                  }
                }
              }
              behPrompts {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              manualMastery {
                edges {
                  node {
                    id
                    responsePercentage
                    minTrial
                    consecutiveDays
                    masteryType
                    minTrial
                    consecutiveDays
                    noOfProblemBehavior
                    duration
                    fromStatus {
                      id
                      statusName
                    }
                    toStatus {
                      id
                      statusName
                    }
                  }
                }
              }
            }
          }
        }
        manualMastery {
          edges {
            node {
              id
              responsePercentage
              minTrial
              consecutiveDays
              masteryType
              minTrial
              consecutiveDays
              noOfProblemBehavior
              duration
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
            }
          }
        }
        targetAllcatedDetails {
          id
          time
          targetType {
            id
            typeTar
          }
          targetName
          DailyTrials
          consecutiveDays
          promptCodes {
            edges {
              node {
                id
                promptName
              }
            }
          }
        }
        baselineDate
        domainName
        default
        r1 {
          id
          behaviorName
        }
        r2 {
          id
          behaviorName
        }
      }
    }
  }
`;

export const getStudentSessions = gql`
  query GetStudentSession($studentId: ID!, $date: Date!) {
    GetStudentSession(studentId: $studentId, date: $date) {
      edges {
        node {
          id
          itemRequired
          duration
          sessionName {
            id
            name
          }
          instruction {
            edges {
              node {
                id
                instruction
              }
            }
          }
          sessionHost {
            edges {
              node {
                id
                memberName
                timeSpent {
                  edges {
                    node {
                      id
                      sessionName {
                        id
                        name
                      }
                      duration
                    }
                  }
                }
                relationship {
                  id
                  name
                }
              }
            }
          }
          targets {
            edges {
              node {
                id
                time
                targetInstr
                date
                targetId {
                  id
                  domain {
                    id
                    domain
                  }
                }
                targetAllcatedDetails {
                  id
                  targetName
                  dateBaseline
                  DailyTrials
                  consecutiveDays
                  targetType {
                    id
                    typeTar
                  }
                }
              }
            }
          }
          targets {
            edgeCount
          }
        }
      }
    }
  }
`;

export const getDateSessions = gql`
  query getDateSessions($studentId: ID!, $date: Date!) {
    getDateSessions(student: $studentId, date: $date) {
      id
      createdAt
      itemRequired
      student {
        id
        firstname
      }
      sessionName {
        id
        name
      }
      duration

      sessionHost {
        edges {
          node {
            memberName
            relationship {
              name
            }
          }
        }
      }
      instruction {
        edges {
          node {
            id
            instruction
          }
        }
      }
      targets {
        edgeCount

        edges {
          node {
            id
            targetlikeSet {
              edgeCount
            }
            targetId {
              domain {
                domain
              }
            }
            targetAllcatedDetails {
              id
              targetName
            }
          }
        }
      }
      childsessionSet(sessionDate: $date) {
        edges {
          node {
            id
            sessionDate
            createdAt
            status
          }
        }
      }
    }
  }
`;

export const getSessionStatus = gql`
  query GetStudentSession($sessionId: ID!) {
    getChildSession(sessions: $sessionId) {
      edges {
        node {
          id
          sessionDate
          createdAt
          duration
          status
        }
      }
    }
  }
`;

export const getPeakQuestionaire = gql`
  query peakGetCodes($peakType: String!) {
    peakGetCodes(peakType: $peakType) {
      edges {
        node {
          id
          peakType
          code
          description
          instructions
          expRes
        }
      }
    }
  }
`;

export const getEquiGraph = gql`
  query peakEquData($pk: ID!, $peakType: String!) {
    peakEquData(pk: $pk, peakType: $peakType) {
      score
      totalReflexivity
      totalSymmetry
      totalTransivity
      totalEquivalance

      scoreReflexivity
      scoreSymmetry
      scoreTransivity
      scoreEquivalance

      id
      score
      peakType
      program {
        id
        date
        title
      }
      records {
        edges {
          node {
            id
            response
            question {
              id
              questionText
              domain {
                id
                name
              }
            }
            test {
              id
              no
              name
            }
          }
        }
      }
    }
  }
`;

export const getPeakData = gql`
  query {
    peakEquDomains {
      id
      name
    }
  }
`;
export const getStartPeakEqui = gql`
  mutation startPeakEquivalance($program: ID!, $peakType: String!) {
    startPeakEquivalance(input: {program: $program, peakType: $peakType}) {
      details {
        id
        score
        peakType
        program {
          id
          date
          title
        }
      }
    }
  }
`;
export const getEquivilanceQuestion = gql`
  query peakEquQuestions($questionType: String!, $domain: ID!) {
    peakEquQuestions(questionType: $questionType, domain: $domain) {
      edges {
        node {
          id
          questionNum
          questionText
          questionType
          domain {
            id
            name
          }
          test {
            edges {
              node {
                id
                no
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const getStudentPeakPrograms = gql`
  query peakPrograms($studentId: ID!) {
    peakPrograms(student: $studentId) {
      edges {
        node {
          id
          title
          category
          notes
          date
          status
          student {
            id
            firstname
          }
          targets {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const createProgram = gql`
  mutation createProgram(
    $studentId: ID!
    $title: String!
    $category: String!
    $notes: String!
    $date: Date!
  ) {
    peakCreateProgram(
      input: {
        student: $studentId
        title: $title
        category: $category
        notes: $notes
        date: $date
      }
    ) {
      details {
        id
        title
        category
        notes
        date
        student {
          id
          firstname
        }
      }
    }
  }
`;

export const peakEquReport = gql`
  query peakEquivalance($program: ID!, $peakType: String!, $domainid: ID!) {
    peakEquivalance(
      program: $program
      peakType: $peakType
      records_Question_Domain: $domainid
    ) {
      edges {
        node {
          id
          score
          peakType
          program {
            id
            date
            title
          }
          records {
            edges {
              node {
                id
                response
                question {
                  id
                  questionText
                }
                test {
                  id
                  no
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const peakEquData = gql`
  query peakEquDetails($pk: ID!) {
    peakEquDetails(id: $pk) {
      id
      score
      peakType
      program {
        id
        date
        title
      }
      records {
        edges {
          node {
            id
            response
            question {
              id
              questionText
            }
            test {
              id
              no
              name
            }
          }
        }
      }
    }
  }
`;
export const recordPeakEquivalance = gql`
  mutation recordPeakEquivalance(
    $pk: ID!
    $question: ID!
    $test: ID!
    $response: Boolean!
  ) {
    recordPeakEquivalance(
      input: {pk: $pk, question: $question, test: $test, response: $response}
    ) {
      details {
        id
        score
        peakType
        program {
          id
          date
          title
        }
        records {
          edges {
            node {
              id
              response
              question {
                id
                questionText
              }
              test {
                id
                no
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const getPeakCodes = gql`
  query PeakGetCodes($category: String!) {
    peakGetCodes(peakType: $category) {
      edges {
        node {
          id
          peakType
          code
          description
          instructions
          expRes
        }
      }
    }
  }
`;

export const getPeakCodeDetails = gql`
  query PeakCodeDetails($code: ID!) {
    peakCodeDetails(id: $code) {
      id
      peakType
      code
      description
      instructions
      expRes
    }
  }
`;

export const therapistGetMessageList = gql`
  query {
    thread {
      edges {
        node {
          id
          firstUser {
            id
            name
          }
          secondUser {
            id
            name
          }
          chatmessageSet(last: 1) {
            edges {
              node {
                id
                user {
                  id
                  name
                }
                message
                timestamp
              }
            }
          }
        }
      }
    }
  }
`;

export const therapistGetSecondUserMessageList = gql`
  query GetMessage($id: ID!) {
    userthread(secondUser: $id) {
      firstUser {
        id
        name
      }
      secondUser {
        id
        name
      }
      chatmessageSet {
        edges {
          node {
            id
            user {
              id
              name
            }
            message
            timestamp
          }
        }
      }
    }
  }
`;

export const submitPeakAssessment = gql`
  mutation PeakSubmitResponse(
    $programId: ID!
    $correctIds: [ID!]
    $inCorrectIds: [ID!]
  ) {
    peakSubmitResponse(
      input: {program: $programId, yes: $correctIds, no: $inCorrectIds}
    ) {
      details {
        id
        program {
          id
          title
          date
        }
        yes {
          edges {
            node {
              id
              code
            }
          }
        }
        no {
          edges {
            node {
              id
              code
            }
          }
        }
      }
    }
  }
`;

export const peakFinishAssessment = gql`
  mutation PeakFinishAssessment($program: ID!) {
    peakFinishAssessment(input: {program: $program}) {
      details {
        id
        date
        title
        status
      }
    }
  }
`;

export const peakScoreDetails = gql`
  query($program: ID!) {
    peakDataSummary(program: $program) {
      total
      totalAttended
      totalCorrect
      totalIncorrect
      totalNoResponse
      totalSkipped
      totalSuggested
      edges {
        node {
          id
          yes {
            edges {
              node {
                id
                code
              }
            }
          }
          no {
            edges {
              node {
                id
                code
              }
            }
          }
        }
      }
    }
  }
`;

export const peakSuggestedTargets = gql`
  mutation SuggestPeakTargets($program: ID!) {
    suggestPeakTargets(input: {program: $program}) {
      details {
        id
        code
        description
        peakType
        code
        targets {
          edges {
            node {
              id
              status
              targetMain {
                id
                targetName
              }
              targetArea {
                id
                Area
              }
              domain {
                id
                domain
              }
              video
              targetInstr
            }
          }
        }
      }
    }
  }
`;

export const getPeakEquCode = gql`
  query getPeakEquCodes($skip: Int!, $first: Int!) {
    getPeakEquCodes(skip: $skip, first: $first) {
      edges {
        node {
          id
          code
          classes {
            edges {
              node {
                id
                name
                stimuluses {
                  edges {
                    node {
                      option
                      stimulusName
                      target {
                        id
                        status
                        targetMain {
                          id
                          targetName
                        }
                        targetArea {
                          id
                          Area
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getPeakEquDomain = gql`
  query {
    peakEquDomains {
      id
      name
    }
  }
`;

export const getTargetsByCategory = (category) => {
  return apolloClient
    .query({
      query: gql`query{
            getPeakEquCodes(codetype:"${category}"){
                edges{
                    node{
                        id
                        code
                        target{
                            id
                            maxSd
                            targetInstr
                            targetMain{
                                id
                                targetName
                            }
                        }
                        classes{
                            edges{
                                node{
                                    id
                                    name
                                    stimuluses{
                                        edges{
                                            node{
                                                id
                                                option
                                                stimulusName
                                            }
                                        }
                                    }
                                }
                            }
                        }
        
                    }
                }
            }
        }`,
      fetchPolicy: 'network-only',
    })
    .then((result) => result)
    .catch((error) => {
      error.graphQLErrors.map((item) => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        });
      });
    });
};

export const getPeakEquSuggestedTargets = gql`
  mutation suggestPeakEquivalanceTargets($id: ID!) {
    suggestPeakEquivalanceTargets(input: {domain: $id}) {
      targets {
        code {
          id
          code
        }
        target {
          id
          status
          targetMain {
            id
            targetName
          }
          targetArea {
            id
            Area
          }
        }
      }
    }
  }
`;

export const getPeakEquCodeDetails = gql`
  query getPeakEquCodeDetails($id: ID!) {
    getPeakEquCodeDetails(id: $id) {
      target {
        id
        maxSd
      }
      id
      code
      classes {
        edges {
          node {
            id
            name
            stimuluses {
              edges {
                node {
                  option
                  stimulusName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getTargetTypes = gql`
  query {
    types {
      id
      typeTar
    }
  }
`;
export const getAllQuestionsCode = gql`
  query($type: String!) {
    peakGetCodes(peakType: $type) {
      edges {
        node {
          id
          peakType
          code
          description
          instructions
          expRes
        }
      }
    }
  }
`;

export const getPeakSummaryData = gql`
  query($program: ID!) {
    peakDataSummary(program: $program) {
      total
      totalAttended
      totalCorrect
      totalIncorrect
      totalNoResponse
      totalSuggested
      totalSkipped

      edges {
        node {
          id
          program {
            id
            title
          }
          yes {
            edges {
              node {
                id
                code
              }
            }
          }
          no {
            edges {
              node {
                id
                code
              }
            }
          }
        }
      }
    }
  }
`;

export const getTargetStatusList = gql`
  query {
    targetStatus {
      id
      statusName
    }
  }
`;

export const startCogniableAssessment = gql`
  mutation StartCogniableAssessment(
    $studentID: ID!
    $name: String!
    $notes: String!
  ) {
    startCogniableAssess(
      input: {student: $studentID, name: $name, notes: $notes}
    ) {
      details {
        id
        date
        score
        status
        name
        notes
        student {
          id
          firstname
        }
      }
    }
  }
`;

export const startBehaviourlAssessment = gql`
  mutation startBehaviourlAssessment($title: String!, $studentID: ID!) {
    behStartAssessment(input: {title: $title, student: $studentID}) {
      details {
        id
        date
        title
        status
        student {
          id
          firstname
        }
      }
    }
  }
`;

export const getAssessmentsListCogniable = gql`
  query GetCogniableAssessments($studentID: ID!) {
    students(isActive: true) {
      edges {
        node {
          id
          firstname
        }
      }
    }
    getCogniableAssessments(student: $studentID, last: 7) {
      edges {
        node {
          id
          date
          score
          status
          name
          notes
          student {
            id
            firstname
          }
        }
      }
    }
    cogniableAssessAreas {
      id
      name
      description
    }
  }
`;

export const getCogniableFirstQuestion = gql`
  mutation GetFirstQuestion($studentId: ID!) {
    getCogQuestion(input: {student: $studentId}) {
      question {
        id
        age
        question
        area {
          id
          name
        }
        options {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
    }
  }
`;

export const getAssessmentObjectCogniable = gql`
  query GetCogniableAssessDetail($pk: ID!) {
    getCogniableAssessDetail(id: $pk) {
      id
      date
      score
      status
      name
      notes
      student {
        id
        firstname
      }
      assessmentQuestions {
        edges {
          node {
            id
            question {
              id
              age
              question
              area {
                id
                name
              }
              options {
                edges {
                  node {
                    id
                    name
                    description
                  }
                }
              }
            }
            answer {
              id
              name
              description
            }
          }
        }
      }
      assessmentAreas {
        edges {
          node {
            id
            response
            area {
              id
              name
              description
            }
          }
        }
      }
    }
  }
`;

export const getCogniableAssessmentQuestionsQuery = gql`
  query {
    cogniableAssessQuestions {
      id
      question
      options {
        edges {
          node {
            id
            name
            description
          }
        }
      }
    }
  }
`;

export const updateResponseCogniable = gql`
  mutation EditQuestions($pk: ID!, $questionId: ID!, $answerId: ID) {
    updateCogniableAssessment(
      input: {pk: $pk, question: $questionId, answer: $answerId}
    ) {
      status
      nextQuestion {
        id
        age
        question
        area {
          id
          name
        }
        options {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
      details {
        id
        date
        score
        assessmentQuestions {
          edges {
            node {
              id
              question {
                id
                age
                question
                area {
                  id
                  name
                }
                options {
                  edges {
                    node {
                      id
                      name
                      description
                    }
                  }
                }
              }
              answer {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export const recordResponseCogniable = gql`
  mutation RecordResponse($pk: ID!, $questionId: ID!, $answerId: ID) {
    recordCogQuestion(
      input: {pk: $pk, question: $questionId, answer: $answerId}
    ) {
      nextQuestion {
        id
        age
        question
        area {
          id
          name
        }
        options {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
      details {
        id
        date
        score
        status
        name
        notes
        student {
          id
          firstname
        }
        assessmentQuestions {
          edges {
            node {
              id
              question {
                id
                age
                question
                options {
                  edges {
                    node {
                      id
                      name
                      description
                    }
                  }
                }
              }
              answer {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export const getBehaQuestion = gql`
  query {
    behQuestions(category: "General") {
      edges {
        node {
          id
          category
          questions
          options {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const endQuestionsAssessmentCogniable = gql`
  mutation EndQuestionsAssessment($pk: ID!, $status: String!) {
    updateCogAssessment(input: {pk: $pk, status: $status}) {
      details {
        id
        date
        score
        status
        name
        notes
        student {
          id
          firstname
        }
        assessmentQuestions {
          edges {
            node {
              id
              question {
                id
                age
                question
                options {
                  edges {
                    node {
                      id
                      name
                      description
                    }
                  }
                }
              }
              answer {
                id
                name
                description
              }
            }
          }
        }
        assessmentAreas {
          edges {
            node {
              id
              response
              area {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export const saveCogniableAssessmentAnswerQuery = gql`
  mutation RecordCogniableAssessment($pk: ID!, $question: ID!, $answer: ID!) {
    recordCogniableAssess(
      input: {pk: $pk, questions: [{question: $question, answer: $answer}]}
    ) {
      details {
        id
        date
        score
        assessmentQuestions {
          edges {
            node {
              id
              question {
                id
                question
              }
              answer {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export const recordAreaResponse = gql`
  mutation RecordAreaResponse($pk: ID!, $areaId: ID!, $response: String!) {
    recordCogniableAssessResult(
      input: {pk: $pk, areas: [{area: $areaId, response: $response}]}
    ) {
      details {
        id
        date
        score
        status
        name
        notes
        student {
          id
          firstname
        }
        assessmentAreas {
          edges {
            node {
              id
              response
              area {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export const endAssessmentCogniable = gql`
  mutation EndAssessment($pk: ID!, $status: String!, $score: Int!) {
    updateCogAssessment(input: {pk: $pk, score: $score, status: $status}) {
      details {
        id
        date
        score
        status
        name
        notes
        student {
          id
          firstname
        }
        assessmentQuestions {
          edges {
            node {
              id
              question {
                id
                age
                question
                options {
                  edges {
                    node {
                      id
                      name
                      description
                    }
                  }
                }
              }
              answer {
                id
                name
                description
              }
            }
          }
        }
        assessmentAreas {
          edges {
            node {
              id
              response
              area {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export const updateTarget = gql`
  mutation updateTargetAllocate(
    $pk: ID!
    $status: ID!
    $targetName: String
    $dailyTrials: Int
    $consecutiveDays: Int
    $targetInstr: String
    $targetType: ID
    $videos: [String]
    $sd: [SdMasteryInput]
    $steps: [StepMasteryInput]
    $targetDocs: [TargetDocsInput]
    $manualMastery: [ManualMasteryInput]
    $r1: ID
    $r2: ID
    $recordingType: [ID]
    $trialDuration: Int
    $prompts: [ID]
    $domain: ID
    $shortTerm: ID
  ) {
    updateTargetAllocate2(
      input: {
        pk: $pk
        targetData: {
          targetStatus: $status
          targetName: $targetName
          DailyTrials: $dailyTrials
          consecutiveDays: $consecutiveDays
          targetInstr: $targetInstr
          targetType: $targetType
          videos: $videos
          sd: $sd
          steps: $steps
          R1: $r1
          R2: $r2
          recordingType: $recordingType
          TrialDuration: $trialDuration
          prompts: $prompts
          domain: $domain
          shortTerm: $shortTerm
        }
        targetDocs: $targetDocs
        manualMastery: $manualMastery
      }
    ) {
      targetName
      target {
        id
        date
        targetInstr
        targetStatus {
          id
          statusName
        }
        videos {
          edges {
            node {
              id
              url
            }
          }
        }
        r1 {
          id
          behaviorName
        }
        r2 {
          id
          behaviorName
        }
        targetId {
          id
          domain {
            id
            domain
          }
        }
        masteryCriteria {
          id
          name
        }
        targetAllcatedDetails {
          id
          targetName
          dateBaseline
          DailyTrials
          consecutiveDays
          targetType {
            id
            typeTar
          }
          promptCodes {
            edges {
              node {
                id
                promptName
              }
            }
          }
        }
        sd {
          edges {
            node {
              id
              sd
            }
          }
        }
        steps {
          edges {
            node {
              id
              step
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              url
            }
          }
        }
        mastery {
          edges {
            node {
              id
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              status {
                id
                statusName
              }
              mastery {
                id
                name
              }
              prompts {
                edges {
                  node {
                    id
                    promptName
                  }
                }
              }
              behPrompts {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              manualMastery {
                edges {
                  node {
                    id
                    gte
                    lte
                    isDaily
                    responsePercentage
                    minTrial
                    consecutiveDays
                    noOfProblemBehavior
                    duration
                    masteryType
                    fromStatus {
                      id
                      statusName
                    }
                    toStatus {
                      id
                      statusName
                    }
                  }
                }
              }
            }
          }
        }
        manualMastery {
          edges {
            node {
              id
              gte
              lte
              isDaily
              responsePercentage
              minTrial
              consecutiveDays
              noOfProblemBehavior
              masteryType
              duration
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
        targetDocs {
          edges {
            node {
              id
              url
            }
          }
        }
        recordingType {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const getRecordedAssessmentAreaCogniable = gql`
  query GetCogniableAssessDetail($pk: ID!) {
    getCogniableAssessDetail(id: $pk) {
      id
      date
      score
      student {
        id
        firstname
      }
      assessmentQuestions {
        edges {
          node {
            id
            question {
              id
              question
            }
            answer {
              id
              name
              description
            }
          }
        }
      }
      assessmentAreas {
        edges {
          node {
            id
            response
            area {
              id
              name
              description
            }
          }
        }
      }
    }
  }
`;

export const getUser = gql`
  query Users($id: ID!) {
    users(id: $id) {
      id
      firstName
      lastName
      username
      email
      name
      school {
        id
        schoolName
      }
      lastLogin
    }
  }
`;

export const updateMedicalReminder = gql`
  mutation changeMedicalReminder($userId: ID!, $status: Boolean!) {
    changeUserSetting(input: {user: $userId, medicalReminders: $status}) {
      details {
        id
        language
        sessionReminders
        medicalReminders
        dataRecordingReminders
      }
    }
  }
`;

export const updateReminder = gql`
  mutation changeSessionReminder(
    $userId: ID!
    $session: Boolean!
    $medical: Boolean!
    $recording: Boolean!
  ) {
    changeUserSetting(
      input: {
        user: $userId
        sessionReminders: $session
        medicalReminders: $medical
        dataRecordingReminders: $recording
      }
    ) {
      details {
        id
        language
        sessionReminders
        medicalReminders
        dataRecordingReminders
      }
    }
  }
`;
export const updateRecordingReminder = gql`
  mutation changeRecordingReminder($userId: ID!, $status: Boolean!) {
    changeUserSetting(input: {user: $userId, dataRecordingReminders: $status}) {
      details {
        id
        language
        sessionReminders
        medicalReminders
        dataRecordingReminders
      }
    }
  }
`;

export const getReportVbmapps = gql`
  mutation VbmappGetReport($master: ID!, $area: ID!, $groupId : ID!) {
    vbmappGetReport(input: {master: $master, area: $area, group: $groupId}) {
      details {
        id
        area {
          id
          apiArea
          areaName
          description
        }
        masterRecord {
          id
          testNo
          date
          color
          student {
            id
            firstname
            dob
          }
        }
        records {
          edges {
            node {
              id
              date
              questionNum
              code
            }
          }
        }
      }
    }
  }
`;

export const iepReportVbmapps = gql`
  mutation VbmappIepReport($pk: String!) {
    vbmappIepReport(input: {pk: $pk}) {
      status
      data
      file
    }
  }
`;

export const vbmappSuggestedTargets = gql`
  query VbmappSuggestedTargets($level: Int, $question: Int, $domain: ID!) {
    vbmappSuggestTargets(
      vbmappLevel: $level
      vbmappQuestion: $question
      vbmappDomain: $domain
    ) {
      edges {
        node {
          id
          vbmappCode
          vbmappLevel
          vbmappQuestion
          vbmappDomain {
            id
            groupName
          }
          vbmappTargets {
            edges {
              node {
                id
                domain {
                  id
                  domain
                }
                targetArea {
                  id
                  Area
                }
                targetMain {
                  id
                  targetName
                }
                video
                targetInstr
              }
            }
          }
        }
      }
    }
  }
`;

export const getStepsForTarget = gql`
  query GetSteps($text: String!) {
    targetStep(first: 8, step_Icontains: $text) {
      edges {
        node {
          id
          step
        }
      }
    }
  }
`;

export const getSdForTarget = gql`
  query GetStimulus($text: String!) {
    targetSd(first: 8, sd_Icontains: $text) {
      edges {
        node {
          id
          sd
        }
      }
    }
  }
`;

export const alreadyAllocatedTargetsForStudent = gql`
  query TargetAllocates($student: ID!) {
    targetAllocates(studentId: $student, targetStatus: "U3RhdHVzVHlwZTox") {
      edges {
        node {
          id
          time
          targetInstr
          date
          objective
          targetStatus {
            id
            statusName
          }
          sessionSet {
            edges {
              node {
                id
                sessionName {
                  id
                  name
                }
              }
            }
          }
          targetId {
            id
            domain {
              id
              domain
            }
          }
          targetAllcatedDetails {
            id
            targetName
            dateBaseline
            DailyTrials
            consecutiveDays
            targetType {
              id
              typeTar
            }
          }
          videos {
            edges {
              node {
                id
                url
              }
            }
          }
          sd {
            edges {
              node {
                id
                sd
              }
            }
          }
          steps {
            edges {
              node {
                id
                step
              }
            }
          }
        }
      }
    }
  }
`;

export const cogniableSuggestedTargets = gql`
  mutation SuggestCogniableTargets($pk: ID!) {
    suggestCogniableTargets(input: {pk: $pk}) {
      targets {
        id
        domain {
          id
          domain
        }
        targetArea {
          id
          Area
        }
        targetMain {
          id
          targetName
        }
        video
        targetInstr
      }
    }
  }
`;
export const cogniableReport = gql`
  mutation CogniableAssessmentReport($pk: String!) {
    cogniableAssessmentReport(input: {pk: $pk}) {
      status
      data
      file
    }
  }
`;

export const peakTableReport = gql`
  mutation peakReport($pk: ID!) {
    peakReport(input: {pk: $pk}) {
      fls
      pls
      vcs
      vrm
    }
  }
`;

export const peaktriangleReportLastFourData = gql`
  mutation lastFourRecords($pk: ID!) {
    lastFourRecords(input: {pk: $pk}) {
      programs {
        id
        date
        user {
          id
          firstName
          lastName
        }
        student {
          id
          caseManager {
            id
            name
          }
        }
        submitpeakresponsesSet {
          edges {
            node {
              id
              yes {
                edges {
                  node {
                    id
                    code
                  }
                }
              }
              no {
                edges {
                  node {
                    id
                    code
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const finalAgeUpdate = gql`
  mutation updatePeakProgram($program: ID!, $finalAge: String!) {
    updatePeakProgram(input: {program: $program, finalAge: $finalAge}) {
      details {
        id
        date
        title
        status
        finalAge
      }
    }
  }
`;

export const factorAgeUpdate = gql`
  mutation UpdatePeakProgram($program: ID!, $factorsAge: [FactorsInput]) {
    updatePeakProgram(input: {program: $program, factorsAge: $factorsAge}) {
      details {
        id
        date
        title
        status
        factorScores {
          edges {
            node {
              codeType
              age
            }
          }
        }
      }
    }
  }
`;

export const factoreScoreDetatils = gql`
  query peakProgram($id: ID!) {
    peakProgram(id: $id) {
      id
      title
      category
      notes
      student {
        id
        firstname
      }
      finalAge
      factorScores {
        edges {
          node {
            codeType
            age
          }
        }
      }
    }
  }
`;

export const RECORDING_TYPE = gql`
  query {
    recordingType {
      id
      name
    }
  }
`;

export const GET_BEHAVIOUR = gql`
  query($studentId: ID) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
        }
      }
    }
  }
`;

export const PROMPT_CODES = gql`
  query {
    promptCodes {
      id
      promptName
    }
  }
`;

export const BEH_PROMPT_CODES = gql`
  query {
    getBehPrompts {
      id
      name
    }
  }
`;

export const reinforce=gql`query {
  getSbtReinforces {
    id
    name
    isDefault
  }
}`;

export const GET_SBT_STEP_STATUS = gql`
  query {
    getSbtStepStatus {
      id
      statusName
    }
  }
`
// iisca
export const IISCA_PROGRAMS = gql`
  query($studentId: ID!) {
    IISCAPrograms(student: $studentId, isActive: true) {
      edges {
        node {
          id
          title
          notes
          date
          status
        }
      }
    }
  }
`
export const CREATE_IISCA_PROGRAM = gql`
  mutation($studentId: ID!, $title: String!, $note: String, $date: Date!) {
    IISCACreateProgram(input: { student: $studentId, title: $title, notes: $note, date: $date }) {
      details {
        id
        title
        notes
        date
        status
      }
    }
  }
`

export const deleteIISCAAssessment=gql`
mutation($id:ID!) {
  IISCADeleteProgram (input: {id: $id}) {
    status
    message
  }
}
`;
export const CREATE_STUDENT_QUESTIONARE_MUTATION = gql`
  mutation saveQuestionareAnswer(
    $dateOfInterview: Date
    $questionare: ID!
    $student: ID!
    $respondent: String
    $respondentRelation: String
    $dob: Date
    $gender: String
    $interviewer: String
    $answer: [AnswerInput]
    $iiscaProgram: ID!
    $behaviors: [BehaviorInputType]
    $situations: [SituationInputType]
    $activities: [ActivityInputType]
    $antecedents: [AntecedentInputType]
    $consequences: [ConsequenceInputType]
    $distractions: [DistractionInputType]
    $communications: [CommunicationMotiveInputType]
    $reasons: [ReasonInputType]
    $triggers: [TransitionTriggerInputType]
    $reactions: [ReactionInputType]
  ) {
    saveQuestionareAnswer(
      input: {
        dateOfInterview: $dateOfInterview
        questionare: $questionare
        student: $student
        respondent: $respondent
        respondentRelation: $respondentRelation
        dob: $dob
        gender: $gender
        interviewer: $interviewer
        answer: $answer
        iiscaProgram: $iiscaProgram
        behaviors: $behaviors
        situations: $situations
        activities: $activities
        antecedents: $antecedents
        consequences: $consequences
        distractions: $distractions
        communications: $communications
        reasons: $reasons
        triggers: $triggers
        reactions: $reactions
      }
    ) {
      details {
        id
        dateOfInterview
        questionare {
          id
        }
        student {
          id
        }
        dateOfInterview
        respondent
        respondentRelation
        dob
        gender
        interviewer
        behaviors {
          edges {
            node {
              id
              behaviorName
            }
          }
        }
        situations {
          edges {
            node {
              id
              name
            }
          }
        }
        activities {
          edges {
            node {
              id
              name
            }
          }
        }
        antecedents {
          edges {
            node {
              id
              antecedentName
            }
          }
        }
        consequences {
          edges {
            node {
              id
              consequenceName
            }
          }
        }
        distractions {
          edges {
            node {
              id
              name
            }
          }
        }
        communications {
          edges {
            node {
              id
              name
            }
          }
        }
        reasons {
          edges {
            node {
              id
              name
            }
          }
        }
        triggers {
          edges {
            node {
              id
              name
            }
          }
        }
        reactions {
          edges {
            node {
              id
              name
            }
          }
        }
        answers {
          edges {
            node {
              id
              question {
                id
                questionNo
                questionare {
                  id
                }
              }
              text
              preferredCategories {
                edges {
                  node {
                    id
                    name
                    preferreditemsSet {
                      edges {
                        node {
                          id
                          itemName
                        }
                      }
                    }
                  }
                }
              }
              behaviors {
                edges {
                  node {
                    id
                    behaviorName
                  }
                }
              }
              behaviorRanges {
                edges {
                  node {
                    id
                    behavior {
                      id
                      behaviorName
                    }
                    behaviorRange
                  }
                }
              }
              situationBehaviors {
                edges {
                  node {
                    id
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              behaviorReasons {
                edges {
                  node {
                    id
                    reason {
                      id
                      name
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              communicationMotives {
                edges {
                  node {
                    id
                    situation {
                      id
                      name
                    }
                    behavior {
                      id
                      behaviorName
                    }
                    communicationMotive {
                      id
                      name
                    }
                  }
                }
              }
              distractions {
                edges {
                  node {
                    id
                    distraction {
                      id
                      name
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              consequences {
                edges {
                  node {
                    id
                    consequence {
                      id
                      consequenceName
                    }
                    reaction {
                      id
                      name
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              transitionTriggers {
                edges {
                  node {
                    id
                    transitionTrigger {
                      id
                      name
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              antecedents {
                edges {
                  node {
                    id
                    antecedent {
                      id
                      antecedentName
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              activities {
                edges {
                  node {
                    id
                    activity {
                      id
                      name
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              myways {
                edges {
                  node {
                    id
                    name
                    behavior {
                      id
                      behaviorName
                    }
                    text
                  }
                }
              }
              clusters {
                edges {
                  node {
                    id
                    name
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              reinforcers {
                edges {
                  node {
                    reinforcer {
                      id
                      itemName
                    }
                    situation {
                      id
                      name
                    }
                    behaviors {
                      edges {
                        node {
                          id
                          behaviorName
                        }
                      }
                    }
                  }
                }
              }
              reinforcerTasks {
                edges {
                  node {
                    id
                    behavior {
                      id
                    }
                    reinforcerType
                    conditionType
                    transitionTriggers {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                    cab
                    dr
                    tr
                    sFCR
                    iFCR
                    cFCR
                    amount
                  }
                }
              }
              whoWhereMaterials {
                edges {
                  node {
                    id
                    who
                    where
                    material
                    conditionType
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_QUESTIONARE_BY_NAME = gql`
  query getQuestionareByName($name: String!) {
    getQuestionareByName(name: $name) {
      id
      name
      questions {
        edges {
          node {
            id
            text
            questionNo
          }
        }
      }
    }
  }
`

export const GET_QUESTIONARE_ANSWERS = gql`
  query getQuestionareAnswers($iisca: ID!, $name: String!) {
    getQuestionareAnswers(iisca: $iisca, name: $name) {
      id
      answers {
        edges {
          node {
            id
            question {
              id
              questionNo
              questionare {
                id
              }
            }
            text
            preferredCategories {
              edges {
                node {
                  id
                  name
                  preferreditemsSet {
                    edges {
                      node {
                        id
                        itemName
                      }
                    }
                  }
                }
              }
            }
            behaviors {
              edges {
                node {
                  id
                  behaviorName
                }
              }
            }
            behaviorRanges {
              edges {
                node {
                  id
                  behavior {
                    id
                    behaviorName
                  }
                  behaviorRange
                }
              }
            }
            situationBehaviors {
              edges {
                node {
                  id
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            behaviorReasons {
              edges {
                node {
                  id
                  reason {
                    id
                    name
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            communicationMotives {
              edges {
                node {
                  id
                  situation {
                    id
                    name
                  }
                  behavior {
                    id
                    behaviorName
                  }
                  communicationMotive {
                    id
                    name
                  }
                }
              }
            }
            distractions {
              edges {
                node {
                  id
                  distraction {
                    id
                    name
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            consequences {
              edges {
                node {
                  id
                  consequence {
                    id
                    consequenceName
                  }
                  reaction {
                    id
                    name
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            transitionTriggers {
              edges {
                node {
                  id
                  transitionTrigger {
                    id
                    name
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            antecedents {
              edges {
                node {
                  id
                  antecedent {
                    id
                    antecedentName
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            activities {
              edges {
                node {
                  id
                  activity {
                    id
                    name
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            myways {
              edges {
                node {
                  id
                  name
                  behavior {
                    id
                    behaviorName
                  }
                  text
                }
              }
            }
            clusters {
              edges {
                node {
                  id
                  name
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            reinforcers {
              edges {
                node {
                  reinforcer {
                    id
                    itemName
                  }
                  situation {
                    id
                    name
                  }
                  behaviors {
                    edges {
                      node {
                        id
                        behaviorName
                      }
                    }
                  }
                }
              }
            }
            reinforcerTasks {
              edges {
                node {
                  id
                  behavior {
                    id
                  }
                  reinforcerType
                  conditionType
                  transitionTriggers {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  cab
                  dr
                  tr
                  sFCR
                  iFCR
                  cFCR
                  amount
                }
              }
            }
            whoWhereMaterials {
              edges {
                node {
                  id
                  who
                  where
                  material
                  conditionType
                }
              }
            }
          }
        }
      }
      dateOfInterview
      respondent
      respondentRelation
      dob
      gender
      interviewer
      behaviors {
        edges {
          node {
            id
            behaviorName
          }
        }
      }
      situations {
        edges {
          node {
            id
            name
          }
        }
      }
      activities {
        edges {
          node {
            id
            name
          }
        }
      }
      antecedents {
        edges {
          node {
            id
            antecedentName
          }
        }
      }
      consequences {
        edges {
          node {
            id
            consequenceName
          }
        }
      }
      distractions {
        edges {
          node {
            id
            name
          }
        }
      }
      communications {
        edges {
          node {
            id
            name
          }
        }
      }
      reasons {
        edges {
          node {
            id
            name
          }
        }
      }
      triggers {
        edges {
          node {
            id
            name
          }
        }
      }
      reactions {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`

export const SAVE_ANSWER_MUTATION = gql`
  mutation saveAnswerMutation(
    $id: ID
    $question: ID
    $student: ID
    $text: String
    $boolean: Boolean
    $questionare: ID
    $preferredCategories: [ItemsCategoryInputType]
    $behaviors: [BehaviorInputType]
    $behaviorRanges: [BehaviorRangeInputType]
    $situationBehaviors: [SituationBehaviorInputType]
    $distractions: [DistractionSituationBehaviorInputType]
    $communicationMotives: [CommunicationSituationBehaviorInputType]
    $behaviorReasons: [BehaviorReasonInputType]
    $antecedents: [AntecedentSituationBehaviorInputType]
    $consequences: [BehaviorSituationConsequenceReactionInputType]
    $reinforcers: [ReinforcerSituationBehaviorInputType]
    $transitionTriggers: [TransitionTriggerSituationBehaviorInputType]
    $activities: [ActivitySituationBehaviorInputType]
    $myways: [MyWayInputType]
    $clusters: [ClusterInputType]
    $reinforcerTasks: [ReinforcerTaskInputType]
    $whoWhereMaterials: [WhoWhereMaterialInputType]
  ) {
    saveAnswerMutation(
      input: {
        id: $id
        question: $question
        student: $student
        text: $text
        boolean: $boolean
        questionare: $questionare
        preferredCategories: $preferredCategories
        behaviors: $behaviors
        behaviorRanges: $behaviorRanges
        situationBehaviors: $situationBehaviors
        distractions: $distractions
        communicationMotives: $communicationMotives
        behaviorReasons: $behaviorReasons
        antecedents: $antecedents
        consequences: $consequences
        reinforcers: $reinforcers
        transitionTriggers: $transitionTriggers
        activities: $activities
        myways: $myways
        clusters: $clusters
        reinforcerTasks: $reinforcerTasks
        whoWhereMaterials: $whoWhereMaterials
      }
    ) {
      details {
        id
        text
        question {
          id
        }
      }
    }
  }
`
export const CREATE_FLOPPING_TANTRUM = gql`
  mutation(
    $studentId: ID!
    $totalObsTime: Int!
    $lengthOfInterval: Int!
    $numberOfIntervals: Int!
  ) {
    createFlappingTantrum(
      input: {
        totalObservationTime: $totalObsTime
        lengthOfEachInterval: $lengthOfInterval
        numberOfIntervals: $numberOfIntervals
        studentId: $studentId
      }
    ) {
      details {
        id
        totalObservationTime
        lengthOfEachInterval
        numberOfIntervals
        tantrum {
          id
          name
          behavior {
            id
            behaviorName
          }
        }
      }
    }
  }
`

export const UPDATE_FLOPPING_TANTRUM = gql`
  mutation($id: ID!, $totalObsTime: Int!, $lengthOfInterval: Int!, $numberOfIntervals: Int!) {
    updateFlappingTantrum(
      input: {
        pk: $id
        totalObservationTime: $totalObsTime
        lengthOfEachInterval: $lengthOfInterval
        numberOfIntervals: $numberOfIntervals
      }
    ) {
      details {
        id
        totalObservationTime
        lengthOfEachInterval
        numberOfIntervals
        tantrum {
          id
          name
          behavior {
            id
            behaviorName
          }
        }
      }
    }
  }
`

export const RECORD_TANTRUM_FREQUENCY = gql`
  mutation($tantrumId: ID!, $time: Int!, $type: String!, $interval: Int) {
    createTantrumFrequency(
      input: { tantrumId: $tantrumId, time: $time, frequencyType: $type, interval: $interval }
    ) {
      details {
        id
        time
        interval
        tantrum {
          id
          name
          behavior {
            id
            behaviorName
          }
        }
        frequencyType
      }
    }
  }
`
export const CREATE_TANTRUM = gql`
  mutation($objectId: ID!, $name: String!, $behaviorId: ID!) {
    createTantrum(input: { floppingTantrum: $objectId, name: $name, behaviorId: $behaviorId }) {
      details {
        id
        name
        behavior {
          id
          behaviorName
        }
      }
    }
  }
`
export const GET_QUESTIONARE = gql`
  query {
    getQuestionare {
      id
      name
    }
  }
`;
export const PROGRAM_AREA = gql`
  query($id: ID!) {
    student(id: $id) {
      id
      programArea(isActive: true) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_LONG_GOALS = gql`
  query($program: ID, $student: ID) {
    longTerm(program: $program, student: $student) {
      edges {
        node {
          id
          goalStatus {
            id
            status
          }
        }
      }
    }
  }
`;

export const GET_LONG_GOALS_DETAILS = gql`
  query($program: ID, $goalStatus: ID, $student: ID) {
    longTerm(program: $program, goalStatus: $goalStatus, student: $student) {
      edges {
        node {
          id
          goalStatus {
            id
            status
          }
          program {
            id
            name
          }
          goalName
          dateInitialted
          dateEnd
          responsibility {
            id
            name
          }
          shorttermgoalSet {
            edges {
              node {
                id
                targetAllocateSet {
                  edges {
                    node {
                      id
                      targetStatus {
                        id
                        statusName
                      }
                      manualAllocateDomain {
                        id
                        domain
                      }
                      targetId {
                        id
                        domain {
                          id
                          domain
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SBT_DEFAULT_STEPS = gql`
  query {
    getSbtDefaultSteps {
      id
      description
      orderNo
      reinforce {
        edges {
          node {
            id
            name
            isDefault
          }
        }
      }
      status {
        id
        statusName
      }
      isActive
      mastery {
        id
        masteryType
        noOfProblemBehavior
        gte
        lte
        consecutiveDays
        minTrial
        fromStatus {
          id
          statusName
        }
        toStatus {
          id
          statusName
        }
      }
    }
  }
`

export const DEFAULT_SHORT_TERM_GOALS = gql`
  query($studentId: ID!, $program: ID) {
    shortTerm(
      longTerm_Student: $studentId
      longTerm_Program: $program
      isDefault: true
    ) {
      edges {
        node {
          id
          goalName
          longTerm {
            id
            program {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const SHORT_TERM_GOALS = gql`
  query($studentId: ID!, $program: ID) {
    shortTerm(
      longTerm_Student: $studentId
      longTerm_Program: $program
      isDefault: false
    ) {
      edges {
        node {
          id
          goalName
          goalStatus {
            id
            status
          }
          isActive
          longTerm {
            id
            program {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const LONG_TERM_GOAL = gql`
  query($studentId: ID!, $program: ID) {
    longTerm(student: $studentId, program: $program, isDefault: false) {
      edges {
        node {
          id
          goalName
          isActive
          goalStatus {
            id 
            status
          }
        }
      }
    }
  }
`;

export const STUDENT_DROPDOWNS = gql `
query {
  category {
    id
    category
  }
  languages {
    id
    name
  }
  schoolLocation {
    edges {
      node {
        id
        location
      }
    }
  }
  staffs(isActive: true) {
    edges {
      node {
        id
        name
        surname
      }
    }
  }
}
`