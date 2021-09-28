// import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
// import store from '../redux/store/index';

// const developmentUrl = "https://development.cogniable.us/apis/graphql";
// const productionUrl = "https://application.cogniable.us/apis/graphql";

// export const client = new ApolloClient({
// 	link: new ApolloLink((operation, forward) => {
// 		const token = store.getState().authToken;
// 		// console.log('---------------------' + store.getState().authToken);
// 		operation.setContext({
// 			headers: {
// 				authorization: token ? `jwt ${token}` : '', //Your Auth token extraction logic
// 				database: 'india',
// 			}
// 		});
// 		return forward(operation);
// 	}).concat(
// 		new HttpLink({
// 			uri: developmentUrl, // Server URL
// 		})
// 	),
// 	cache: new InMemoryCache()
// });

export const getGroupsList = gql`
  query {
    communityGroups {
      id
      name
      description
      user {
        count
        edges {
          node {
            id
            username
          }
        }
      }
    }
  }
`;
export const getCategroryList = gql`
  query {
    communityGroupsCategoryList {
      id
      name
    }
  }
`;

export const clinicHomeData = gql`
  query combined($dateFrom: Date, $dateTo: Date) {
    upcoming_appointment: appointments(
      first: 3
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
            mobileno
          }
          isApproved
          purposeAssignment
          title
          location {
            id
            location
          }
          therapist {
            id
            name
            user {
              id
              username
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

    schoolDetail: schoolDetail {
      id
      schoolName
      address
      email
      contactNo
      user {
        id
        lastLogin
      }
      staffSet(first: 2) {
        edges {
          node {
            id
            name
            isActive
            userRole {
              id
              name
            }
            image
          }
        }
      }
    }

    tasks: tasks(last: 5) {
      edges {
        node {
          id
          taskName
          description
          startDate
          dueDate
          taskType {
            id
          }
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
        }
      }
    }
  }
`;

export const clinicProfileData = gql`
  query {
    schoolDetail: schoolDetail {
      id
      schoolName
      address
      email
      contactNo
      user {
        id
        lastLogin
      }
      staffSet(first: 2) {
        edges {
          node {
            id
            name
            isActive
            userRole {
              id
              name
            }
            image
          }
        }
      }
    }

    tasks(status: "VGFza1N0YXR1c1R5cGU6MQ==") {
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
        }
      }
    }

    taskStatus {
      id
      taskStatus
      colorCode
    }
  }
`;

export const clinicUserSettingsData = gql`
  query userSettings($user: ID!) {
    userSettings(user: $user) {
      edges {
        node {
          id
          sessionReminders
          medicalReminders
          dataRecordingReminders
          language
          peakAutomaticBlocks
          user {
            id
            username
          }
        }
      }
    }
  }
`;

export const getPeakEquiByTargetId = gql`
  query getEquTar($target: ID!) {
    getEquTar(target: $target) {
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

      test {
        edges {
          node {
            id
            stimulus1
            sign12
            stimulus2
          }
        }
      }

      train {
        edges {
          node {
            id
            stimulus1
            sign12
            stimulus2
          }
        }
      }
    }
  }
`;

export const recordPeakEquiRecord = gql`
  mutation sessionRecording(
    $childsession: ID!
    $targets: ID!
    $status: ID!
    $peakEquivalance: [PeakEquivalanceInput]
    $sessionRecord: [SessionRecordInput]
    $isPeakEquivalance: Boolean
  ) {
    sessionRecording(input: {
      childsession: $childsession
      targets: $targets
      status: $status
      sessionRecord: $sessionRecord
      isPeakEquivalance: $isPeakEquivalance
      peakEquivalance: $peakEquivalance
    }
    ) {
      details {
        id
        durationStart
        durationEnd
        targets {
          id
        }
        ChildSession {
          id
          sessionDate
          status
          duration
          sessions {
            id
            sessionName {
              id
              name
            }
          }
        }
        peakEquivalance(last: 1) {
          edges {
            node {
              id
              durationStart
              durationEnd
              recType
              score
              codeClass {
                id
                name
              }
              relationTrain {
                stimulus1
                sign12
                stimulus2
              }
              relationTest {
                stimulus1
                sign12
                stimulus2
              }
            }
          }
        }
      }
    }
  }
`;

// export const recordPeakEquiRecord = gql`
//   mutation recordPeakEquivalanceScore(
//     $session: ID!
//     $target: ID!
//     $code: ID!
//     $codeClass: ID!
//     $recType: String!
//     $score: Int!
//   ) {
//     recordPeakEquivalanceScore(
//       input: {
//         session: $session
//         target: $target
//         code: $code
//         codeClass: $codeClass
//         recType: $recType
//         score: $score
//       }
//     ) {
//       details {
//         id
//         score
//         session {
//           id
//         }
//         target {
//           id
//         }
//         code {
//           id
//         }
//         codeClass {
//           id
//         }
//         recType
//       }
//     }
//   }
// `;

export const updatePeakEquiRecord = gql`
  mutation updatePeakEquivalanceTrial(
    $pk: ID!
    $score: Int
  ) {
    updatePeakEquivalanceTrial(
      input: {
        pk: $pk
        score: $score
      }
    ) {
      details {
        id
        durationStart
        durationEnd
        recType
        score
        codeClass {
          id
          name
        }
        relationTrain{
          id
      }
      relationTest{
          id
      }
      }
    }
  }
`;

export const getPeakEquiRecord = gql`
  query getPeakEquRecording(
    $session: ID!
    $target: ID!
    $code: ID
    $codeClass: ID
    $recType: String
  ) {
    getPeakEquRecording(
      session: $session
      target: $target
      code: $code
      codeClass: $codeClass
      recType: $recType
    ) {
      edges {
        node {
          id
          score
          session {
            id
          }
          target {
            id
          }
          code {
            id
            code
          }
          codeClass {
            id
            name
          }
          recType
        }
      }
    }
  }
`;

export const setCircleLearnerTargets = gql`
  query getCircleLearnerTargets($target: ID!) {
    getCircleLearnerTargets(target: $target) {
      learner {
        id
        firstname
      }
      target {
        id
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
`;

export const getPeakEquiClassRecord = gql`
  query getPeakEquRecording(
    $session: ID!
    $target: ID!
    $code: ID!
    $recType: String!
  ) {
    getPeakEquRecording(
      session: $session
      target: $target
      code: $code
      recType: $recType
    ) {
      edges {
        node {
          id
          score
          session {
            id
          }
          target {
            id
          }
          code {
            id
            code
          }
          codeClass {
            id
            name
          }
          recType
        }
      }
    }
  }
`;

export const setClinicUserSettingsData = gql`
  mutation changeUserSetting($user: ID!, $peakAutomaticBlocks: Boolean!) {
    changeUserSetting(
      input: {user: $user, peakAutomaticBlocks: $peakAutomaticBlocks}
    ) {
      details {
        id
        sessionReminders
        medicalReminders
        dataRecordingReminders
        language
        peakAutomaticBlocks
        user {
          id
          username
        }
      }
    }
  }
`;

export const clinicUpdateProfile = gql`
  mutation updateProfile($email: String!, $phone: String!) {
    updateClinic(input: {email: $email, contactNo: $phone}) {
      school {
        id
      }
    }
  }
`;

export const listStatus = gql`
  query {
    taskStatus {
      id
      taskStatus
      colorCode
    }
  }
`;

export const clinicUpdateTask = gql`
  mutation closeTask(
    $id: ID!
    $taskType: ID!
    $taskName: String!
    $description: String!
    $priority: ID!
    $startDate: Date!
    $dueDate: Date!
    $status: ID!
  ) {
    updateTask(
      input: {
        task: {
          pk: $id
          taskType: $taskType
          taskName: $taskName
          description: $description
          priority: $priority
          startDate: $startDate
          dueDate: $dueDate
          status: $status
        }
      }
    ) {
      task {
        id
      }
    }
  }
`;

export const clinicCloseTask = gql`
  mutation closeTask(
    $id: ID!
    $taskType: ID!
    $taskName: String!
    $description: String!
    $priority: ID!
    $startDate: Date!
    $dueDate: Date!
  ) {
    updateTask(
      input: {
        task: {
          pk: $id
          taskType: $taskType
          taskName: $taskName
          description: $description
          priority: $priority
          startDate: $startDate
          dueDate: $dueDate
          status: "VGFza1N0YXR1c1R5cGU6Mg=="
        }
      }
    ) {
      task {
        id
      }
    }
  }
`;

export const clinicGetStaffList = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
          isActive
          userRole {
            id
            name
          }
          image
        }
      }
    }
  }
`;

export const clinicGetEmployeeData = gql`
  query employeeData($date: Date!) {
    leaveRequest {
      edges {
        node {
          id
          start
          end
          description
          status
        }
      }
    }
    attendances {
      edges {
        node {
          id
          checkIn
          checkOut
          checkInLocation
        }
      }
    }
    appointments(start_Date: $date) {
      edges {
        node {
          id
          start
          end
          title
          purposeAssignment
          student {
            id
            firstname
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`;

export const clinicEmployeeTimesheet = gql`
  query employeeData($date: Date!, $staffId: ID!) {
    timesheets(start_Date: $date, staffId: $staffId) {
      edges {
        node {
          id
          title
          start
          end
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

export const clinicEmployeeAttendance = gql`
  query employeeAttendance($staffId: ID!, $date: Date) {
    leaveRequest(staffId: $staffId, start_Lte: $date, end_Gte: $date) {
      edges {
        node {
          id
          start
          end
          description
          status
        }
      }
    }
    attendances(createdBy: $staffId, checkIn_Date: $date) {
      edges {
        node {
          id
          checkIn
          checkOut
          checkInLocation
        }
      }
    }
  }
`;

export const clinicEmployeeAppointment = gql`
  query employeeData($date: Date!, $staffId: ID!) {
    appointments(start_Date: $date, therapist: $staffId) {
      edges {
        node {
          id
          start
          end
          title
          purposeAssignment
          student {
            id
            firstname
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`;

export const clinicEmployeeApproveLeave = gql`
  mutation approve($id: ID!, $status: Int!) {
    UpdateLeave(input: {LeaveRequestId: $id, leavestatus: $status}) {
      leaverequest {
        id
        status
      }
    }
  }
`;

export const clinicTaskInit = gql`
  query {
    priority {
      id
      name
    }
    taskStatus {
      id
      taskStatus
    }
    taskType {
      id
      taskType
    }
    students(orderBy: "firstname") {
      edges {
        node {
          id
          firstname
          lastname
        }
      }
    }

    staffs {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const clinicTaskNew = gql`
  mutation CreateTask(
    $taskType: ID!
    $taskName: String!
    $description: String!
    $priority: ID!
    $status: ID!
    $startDate: Date!
    $dueDate: Date!
    $assignWork: [ID]
    $students: [ID]
    $taskDatetime: DateTime!
    $remainders: [RemainderInput]
  ) {
    createTask(
      input: {
        task: {
          taskType: $taskType
          taskName: $taskName
          description: $description
          priority: $priority
          status: $status
          startDate: $startDate
          dueDate: $dueDate
          assignWork: $assignWork
          students: $students
          taskDatetime: $taskDatetime
          remainders: $remainders
          dayEndTime: "18:30:00"
        }
      }
    ) {
      task {
        id
        taskName
        description
        startDate
        dueDate
        status {
          id
          taskStatus
        }
        priority {
          id
          name
        }
        taskType {
          id
          taskType
        }
        assignWork {
          edges {
            node {
              id
              name
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
      }
    }
  }
`;

export const clinicTaskUpdate = gql`
  mutation updateTask(
    $id: ID!
    $taskType: ID!
    $taskName: String!
    $description: String!
    $priority: ID!
    $status: ID!
    $startDate: Date!
    $dueDate: Date!
    $assignWork: [ID]
    $students: [ID]
    $taskDatetime: DateTime!
    $remainders: [RemainderInput]
  ) {
    updateTask(
      input: {
        task: {
          pk: $id
          taskType: $taskType
          taskName: $taskName
          description: $description
          priority: $priority
          status: $status
          startDate: $startDate
          dueDate: $dueDate
          assignWork: $assignWork
          students: $students
          taskDatetime: $taskDatetime
          remainders: $remainders
          dayEndTime: "18:30:00"
        }
      }
    ) {
      task {
        id
      }
    }
  }
`;

export const saveCount = gql`
  mutation taskCounter($taskId: ID!, $countData: Int!) {
    taskCounter(input: {pk: $taskId, count: $countData}) {
      data
      details {
        id
      }
    }
  }
`;

export const getCount = gql`
  query taskCount($taskId: ID!) {
    taskCount(task: $taskId) {
      date
      count
      task {
        id
        taskName
      }
    }
  }
`;

export const clinicStaffNew = gql`
  mutation CreateStaff(
    $empId: String!
    $designation: String
    $role: ID!
    $email: String!
    $firstname: String!
    $surname: String!
    $gender: String!
    $mobile: String
    $address: String
    $dob: Date!
    $ssnAadhar: String
    $qualification: String
    $salutation: String
    $emergencyName: String
    $emergencyContact: String
    $shiftStart: String
    $shiftEnd: String
    $taxId: String
    $npi: String
    $duration: String
    $dateOfJoining: Date!
    $streetAddress: String
    $city: String
    $state: String
    $country: String
    $zipCode: String
    $location: ID
    $credentials: ID
  ) {
    createStaff(
      input: {
        staffData: {
          empId: $empId
          designation: $designation
          role: $role
          email: $email
          firstname: $firstname
          surname: $surname
          gender: $gender
          mobile: $mobile
          address: $address
          dob: $dob
          ssnAadhar: $ssnAadhar
          qualification: $qualification
          salutation: $salutation
          emergencyName: $emergencyName
          emergencyContact: $emergencyContact
          shiftStart: $shiftStart
          shiftEnd: $shiftEnd
          taxId: $taxId
          npi: $npi
          duration: $duration
          dateOfJoining: $dateOfJoining
          clinicLocation: $location
          streetAddress: $streetAddress
          city: $city
          state: $state
          country: $country
          zipCode: $zipCode
          credentials: $credentials
        }
      }
    ) {
      staff {
        id
        name
      }
    }
  }
`;

export const clinicGetRole = gql`
query {
  userRole {
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
  getStaffCredentials {
    id
    name
    goals
    targetAllocation
    clinic {
      id
      schoolName
    }
  }
}
`;

export const getStudentGraphData = gql`
  query {
    programArea {
      edges {
        node {
          id
          name
        }
      }
    }
    domain {
      edges {
        node {
          id
          domain
        }
      }
    }
    targetStatus(first: 4) {
      id
      statusName
    }
  }
`;

export const getStudentGraphInfo = gql`
  query Graph(
    $student_id: ID!
    $start_date: Date
    $end_date: Date
    $program: ID
    $status: ID
  ) {
    domainPercentage(
      student: $student_id
      dateGte: $start_date
      dateLte: $end_date
      programArea: $program
      targetStatus: $status
    ) {
      id
      domain
      tarCount
    }
    domainMastered(
      studentId: $student_id
      dateGte: $start_date
      dateLte: $end_date
      programArea: $program
      targetStatus: $status
    ) {
      totalCount
      target {
        id
        domainName
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
        }
        intherapyDate
        masterDate
        inmaintainenceDate
      }
    }
  }
`;

export const getStudentDailyResponse = gql`
  query {
    types {
      id
      typeTar
    }
    targetStatus {
      id
      statusName
    }
  }
`;

export const getStudentDailyResponseInfo = gql`
  query responseInfo($student_id: ID!, $start_date: Date!, $end_date: Date!) {
    responseRate(
      studentId: $student_id
      dateGte: $start_date
      dateLte: $end_date
    ) {
      targetId
      targetName
      targetStatusName
      targetType
      perTar
      perPeakCorrect
      perPeakPrompt
      perPeakError
      sessionDate
      sessionRecord {
        perSd
        sd
        step
        perStep
      }
      behRecording {
        start
        end
        frequency
      }
    }
  }
`;

export const peakBlockWise = gql`
  query($student: ID!, $start: Date, $end: Date, $sessionName: ID) {
    peakBlockWiseReport(
      student: $student
      start: $start
      end: $end
      sessionName: $sessionName
    ) {
      date
      target {
        id
        baselineDate
        masterDate
        intherapyDate
        inmaintainenceDate
        targetAllcatedDetails {
          id
          targetName
          dateBaseline
        }
        phaset {
          edges {
            node {
              id
              date
              content
            }
          }
        }
        peakType
      }
      blocks {
        id
        totalScore
        trial {
          edges {
            node {
              id
              marks
              sd {
                id
                sd
              }
            }
          }
        }
      }
    }
  }
`;
export const get5dayPercentage2=gql` 
query GetTargetPercentage($target: ID!, $sd: ID, $step: ID, $sessionId: ID) {
  get5dayPercentage2(target: $target, sd: $sd, step: $step, sessionType: $sessionId) {
    date
    correctPercent
    errorPercent
    promptPercent
    incorrectPercent
    noResponsePercent
    frequency
    behRec{
     
      id 
      frequency
      start
      end
       
    }
  }
}
`

export const peakEquivalence = gql`
  query(
    $student: ID!
    $start: Date
    $end: Date
    $sessionName: ID
    $equivalence: Boolean
  ) {
    peakBlockWiseReport(
      student: $student
      start: $start
      end: $end
      sessionName: $sessionName
      equivalence: $equivalence
    ) {
      date
      target {
        id
        baselineDate
        masterDate
        intherapyDate
        inmaintainenceDate
        targetAllcatedDetails {
          id
          targetName
        }
        phaset {
          edges {
            node {
              id
              date
              content
            }
          }
        }
      }
      equBlocks {
        score
        recType
        relationTrain {
          id
          stimulus1
          sign12
          stimulus2
          sign23
          stimulus3
        }
        relationTest {
          id
          stimulus1
          sign12
          stimulus2
          sign23
          stimulus3
        }
        codeClass {
          id
          name
        }
        id
      }
    }
  }
`;
