// import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import {client as cl} from './ApolloClient';
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
export const cogniableParentLogin = gql`
  mutation TokenAuth($user: String!, $password: String!) {
    tokenAuth(input: {username: $user, password: $password}) {
      token
      payload
      refreshExpiresIn
      user {
        id
        groups {
          edges {
            node {
              id
              name
            }
          }
        }
        studentsSet {
          edges {
            node {
              id
              firstname
            }
          }
        }
        staffSet {
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

export const forgetPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: {email: $email}) {
      status
      message
    }
  }
`;

export const changePassword = gql`
  mutation changeUserPassword($current: String!, $new: String!) {
    changeUserPassword(input: {current: $current, new: $new}) {
      status
      message
      user {
        id
        username
      }
    }
  }
`;

// export const createDecelRecord = gql`
//   mutation CreateDecelRecord($templateId: ID!, $childSessionId: ID!) {
//     createDecel(input: {template: $templateId, ChildSession: $childSessionId}) {
//       details {
//         id
//         date
//         template {
//           id
//           behaviorDef
//           behaviorDescription
//         }
//       }
//       ChildSession {
//         id
//         sessionDate
//         status
//         duration
//       }
//     }
//   }
// `;

export const createDecelRecord = gql`
  mutation createDecel($templateId: ID!, $session: ID!) {
    createDecel(input: {template: $templateId, session: $session}) {
      details {
        id
        date
        irt
        note
        duration
        frequency {
          edges {
            node {
              id
            }
          }
        }
        template {
          id
          behaviorDescription
          behavior {
            id
            behaviorName
          }
          status {
            id
            statusName
          }
          environment {
            edges {
              node {
                id
                name
              }
            }
          }
          measurments {
            edges {
              node {
                id
                measuringType
              }
            }
          }
        }
      }
    }
  }
`;

export const updateDecelRecord = gql`
  mutation UpdateDecelRecord(
    $pk: ID!
    $environment: ID!
    $intensity: String!
    $note: String!
    $duration: String!
  ) {
    updateDecel(
      input: {
        pk: $pk
        environment: $environment
        intensity: $intensity
        note: $note
        duration: $duration
      }
    ) {
      details {
        id
        irt
        intensity
        note
        date
        duration
        template {
          id
          behaviorDef
          behaviorDescription
        }
        environment {
          id
          name
        }
        status {
          id
          statusName
        }
        frequency {
          edges {
            node {
              id
              count
              time
            }
          }
        }
      }
    }
  }
`;
export const updateDecelFrequency = gql`
  mutation UpdateDecelFrequency($pk: ID!, $time: Int!, $count: Int!) {
    updateDecelFrequency(input: {pk: $pk, time: $time, count: $count}) {
      details {
        id
        duration
        frequency {
          edges {
            node {
              id
              count
              time
            }
          }
        }
      }
    }
  }
`;

export const updateDecel = gql`
  mutation UpdateDecel(
    $id: ID!
    $irt: Int
    $intensity: String
    $environment: ID
    $duration: String
    $frequency: [FrequencyInput]
  ) {
    updateDecel(
      input: {
        pk: $id
        irt: $irt
        intensity: $intensity
        environment: $environment
        duration: $duration
        frequency: $frequency
      }
    ) {
      details {
        id
      }
    }
  }
`;

export const getEnvironment = gql`
  query {
    getEnvironment {
      id
      name
    }
  }
`;

export const createDecel = gql`
  mutation recordDecelData(
    $intensity: String
    $environment: ID
    $frequency: Int
    $irt: Int
    $status: ID
    $id: ID
    $date: Date
  ) {
    createDecel(
      input: {
        decelData: {
          template: $id
          environment: $environment
          status: $status
          irt: $irt
          intensity: $intensity
          note: ""
          date: $date
          frequency: $frequency
          duration: "10:05"
        }
      }
    ) {
      details {
        id
        irt
        intensity
        note
        date
        frequency
        duration
        template {
          id
          behaviorDef
          behaviorDescription
        }
        environment {
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
`;
export const cogniableLogin = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(input: {username: $username, password: $password}) {
      token
      user {
        id
        groups {
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

export const verifyToken = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(input: {token: $token}) {
      payload
    }
  }
`;

export const refreshToken = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(input: {token: $token}) {
      token
      payload
    }
  }
`;

export const getCountries = gql`
  query {
    country {
      edges {
        node {
          id
          dbName
        }
      }
    }
  }
`;
export const getRelationships = gql`
  query {
    relationships {
      id
      name
    }
  }
`;
export const getFamilyMembers = gql`
  query Family($student: ID!) {
    family(student: $student) {
      edges {
        node {
          id
          members {
            edges {
              node {
                id
                memberName
                relationship {
                  id
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

export const getFamilyMemberDetails = gql`
  query FamilyMemberDetails($id: ID!) {
    familyMember(id: $id) {
      id
      memberName
      relationship {
        id
        name
      }
      timeSpent {
        edges {
          node {
            id
            duration
            sessionName {
              id
              name
            }
          }
        }
      }
    }
  }
`;
export const updateFamilyMember = gql`
  mutation EditFamily(
    $memberId: ID!
    $memberName: String!
    $relationship: ID!
    $timeSpent: [TimeSpentInput!]
  ) {
    editFamily(
      input: {
        id: $memberId
        memberName: $memberName
        relationship: $relationship
        timeSpent: $timeSpent
      }
    ) {
      details {
        id
      }
    }
  }
`;
export const addFamilyMember = gql`
  mutation FamilyMember(
    $student: ID!
    $memberName: String!
    $relationship: ID!
    $timeSpent: [TimeSpentInput!]
  ) {
    familyMember(
      input: {
        student: $student
        memberName: $memberName
        relationship: $relationship
        timeSpent: $timeSpent
      }
    ) {
      familyMember {
        id
        memberName
        relationship {
          id
          name
        }
        timeSpent {
          edges {
            node {
              id
              duration
            }
          }
        }
      }
    }
  }
`;
export const deleteFamilyMember = gql`
  mutation DeleteMember($memberId: ID!) {
    deleteMember(input: {pk: $memberId}) {
      ok
    }
  }
`;
export const getFoodTypes = gql`
  query {
    getFoodType {
      id
      name
    }
  }
`;

export const getFoodData = gql`
  query GetFood($studentId: ID!, $date: Date!) {
    getFood(student: $studentId, date_Gte: $date, date_Lte: $date) {
      edges {
        node {
          id
          date
          mealTime
          mealName
          mealType
          waterIntake
          servingSize
          calories
          note
          foodType {
            id
            name
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
        }
      }
    }
  }
`;

export const createFood = gql`
  mutation CreateFood(
    $studentId: ID!
    $date: Date!
    $mealName: String!
    $mealTime: String!
    $note: String!
    $mealType: String!
    $waterIntake: String!
    $foodType: ID!
    $remainders: [RemainderInput]
  ) {
    createFood(
      input: {
        foodData: {
          student: $studentId
          date: $date
          mealName: $mealName
          mealTime: $mealTime
          note: $note
          mealType: $mealType
          waterIntake: $waterIntake
          foodType: $foodType
          remainders: $remainders
        }
      }
    ) {
      details {
        id
        date
        mealTime
        mealName
        mealType
        waterIntake
        servingSize
        calories
        note
        foodType {
          id
          name
        }
      }
    }
  }
`;

export const updateFood = gql`
  mutation UpdateFood(
    $id: ID!
    $studentId: ID!
    $date: Date!
    $mealName: String!
    $mealTime: String!
    $note: String!
    $mealType: String!
    $waterIntake: String!
    $foodType: ID!
    $remainders: [RemainderInput]
  ) {
    updateFood(
      input: {
        foodData: {
          id: $id
          student: $studentId
          date: $date
          mealName: $mealName
          mealTime: $mealTime
          note: $note
          mealType: $mealType
          waterIntake: $waterIntake
          foodType: $foodType
          remainders: $remainders
        }
      }
    ) {
      details {
        id
        date
        mealTime
        mealName
        mealType
        waterIntake
        servingSize
        calories
        note
        foodType {
          id
          name
        }
      }
    }
  }
`;

export const deleteFood = gql`
  mutation DeleteFood($id: ID!) {
    deleteFood(input: {pk: $id}) {
      status
      message
    }
  }
`;

export const getSeverityTypes = gql`
  query {
    getSeverity {
      id
      name
    }
  }
`;

export const createMedical = gql`
  mutation createMedical(
    $studentId: ID!
    $date: Date!
    $condition: String!
    $startDate: Date!
    $endDate: Date!
    $note: String
    $severity: ID!
    $drug: [DrugInput]
    $remainders: [RemainderInput]
  ) {
    createMedical(
      input: {
        student: $studentId
        date: $date
        condition: $condition
        startDate: $startDate
        endDate: $endDate
        note: $note
        duration: "10 min"
        lastObservedDate: "2020-05-16"
        severity: $severity
        drug: $drug
        remainders: $remainders
      }
    ) {
      details {
        id
        date
        condition
        startDate
        endDate
        note
        duration
        lastObservedDate
      }
    }
  }
`;

export const updateMedical = gql`
  mutation UpdateMedic(
    $id: ID!
    $studentId: ID!
    $date: Date!
    $condition: String!
    $startDate: Date!
    $endDate: Date!
    $note: String
    $severity: ID!
    $drug: [DrugInput]
    $remainders: [RemainderInput]
  ) {
    updateMedical(
      input: {
        pk: $id
        student: $studentId
        date: $date
        condition: $condition
        startDate: $startDate
        endDate: $endDate
        note: $note
        duration: "10 min"
        lastObservedDate: "2020-05-16"
        severity: $severity
        drug: $drug
        remainders: $remainders
      }
    ) {
      details {
        id
        date
        condition
        startDate
        endDate
        note
        duration
        lastObservedDate
      }
    }
  }
`;

export const deleteMedical = gql`
  mutation Delete($id: ID!) {
    deleteMedical(input: {pk: $id}) {
      status
      message
    }
  }
`;

export const getMedicalData = gql`
  query GetMedication($studentId: ID!, $date: Date!) {
    getMedication(student: $studentId, date: $date) {
      edges {
        node {
          id
          date
          condition
          startDate
          endDate
          note
          duration
          severity {
            id
            name
          }
          drug {
            edges {
              node {
                id
                drugName
                dosage
                times
              }
            }
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

export const getStudentSessions2 = gql`
  query GetStudentSessions($studentId: ID!) {
    session(student: $studentId) {
      edges {
        node {
          id
          status
          itemRequired
          instruction
          sessionName {
            id
            name
          }
          sessionHost {
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
    }
  }
`;
export const getMandData = gql`
  query GetMandData($date: Date, $studentId: ID) {
    getMandData(dailyClick_Student: $studentId, date: $date) {
      edges {
        node {
          id
          data
          dailyClick {
            id
            measurments
          }
        }
      }
    }
  }
`;

export const mandPage = gql`
  query mandPage($studentId: ID!, $date: Date!) {
    getClickData(student: $studentId, date: $date) {
      edges {
        node {
          id
          measurments
          dailyClickDataSet {
            edges {
              node {
                id
                data
                date
              }
            }
          }
        }
      }
    }
  }
`;

export const getSessionTargetsBySessionId = gql`
  query GetSessionTargets($sessionId: ID!) {
    getsession(id: $sessionId) {
      targets {
        edges {
          node {
            id
            time
            targetInstr
            date
            objective
            peakBlocks
            peakType
            eqCode
            targetStatus {
              id
              statusName
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
              promptCodes {
                edges {
                  node {
                    id
                    promptName
                  }
                }
              }
              automaticTimer
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
                  mastery {
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
            r1 {
              id
              behaviorName
            }
            r2 {
              id
              behaviorName
            }
            sbtSteps {
              edges {
                node {
                  id
                  description
                  orderNo
                  reinforce {
                    edges {
                      node {
                        id
                        name
                      }
                    }
                  }
                  status {
                    id
                    statusName
                  }
                }
              }
            }

          }
        }
      }
    }
    getChildSession(sessions: $sessionId) {
      edges {
        node {
          id
          sessionDate
          createdAt
          duration
          status
          sessions {
            id
            itemRequired
            sessionName {
              id
              name
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
  }
`;

export const promptCodes = gql`
  query {
    promptCodes {
      id
      promptName
    }
  }
`;

export const updateChildSessionDuration = gql`
  mutation ChangeSessionStatus($pk: ID!, $duration: Int!) {
    changeSessionStatus(input: {pk: $pk, duration: $duration}) {
      details {
        id
        sessionDate
        status
        duration
        sessions {
          id
        }
      }
    }
  }
`;

export const childSessionDetails = gql`
  query getChildSession($session: ID!, $date: Date!) {
    getChildSession(sessions: $session, date: $date) {
      edges {
        node {
          id
          sessionDate
          createdAt
          duration
          status
          sessions {
            id
            itemRequired
            sessionName {
              id
              name
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
  }
`;

export const getSessionTargetsByStudentIdAndSessionId = gql`
  query GetSessionTargets($studentId: ID!, $sessionId: ID!) {
    targetAllocates(studentId: $studentId, session: $sessionId) {
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
          session {
            id
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

export const createPeakSessionRecord = gql`
  mutation sessionRecording(
    $targetId: ID!
    $childSessionId: ID!
    $targetStatus: ID!
    $durationStart: Int!
    $durationEnd: Int!
  ) {
    sessionRecording(
      input: {
        targets: $targetId
        childsession: $childSessionId
        status: $targetStatus
        durationStart: $durationStart
        durationEnd: $durationEnd
        sessionRecord: []
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
        sessionRecord {
          edges {
            node {
              id
              trial
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              promptCode {
                id
                promptName
              }
              text
            }
          }
        }
      }
    }
  }
`;

export const createSessionRecord = gql`
  mutation SessionRecording(
    $targetId: ID!
    $childSessionId: ID!
    $targetStatus: ID!
    $trial: String!
    $sd: ID!
    $step: ID!
    $durationStart: Int!
    $durationEnd: Int!
    $text: String!
    $indexNo: Int!
    $promptCode: ID!
  ) {
    sessionRecording(
      input: {
        targets: $targetId
        childsession: $childSessionId
        status: $targetStatus
        sessionRecord: [
          {
            trial: $trial
            durationStart: $durationStart
            durationEnd: $durationEnd
            prompt: $promptCode
            sd: $sd
            step: $step
            text: $text
            indexNo: $indexNo
          }
        ]
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
        sessionRecord {
          edges {
            node {
              id
              trial
              sd {
                id
                sd
              }
              step {
                id
                step
              }
              text
              indexNo
              promptCode {
                id
                promptName
              }
            }
          }
        }
      }
    }
  }
`;

export const saveSessionFeedback = gql`
  mutation updateSessionFeedbacks($pk: ID!, $feedback: String!, $rating: Int!) {
    updateSessionFeedbacks(
      input: {pk: $pk, feedback: $feedback, rating: $rating}
    ) {
      details {
        id
      }
    }
  }
`;

export const getSessionFeedback = gql`
  query childSessionDetails($id: ID!) {
    childSessionDetails(id: $id) {
      id
      rating
      feedback
    }
  }
`;

export const getSessionSummary = gql`
  query sessionSummary($childSeesionId: ID!) {
    summary: getSessionRecordings(ChildSession: $childSeesionId) {
      totalTarget
      edges {
        node {
          sessionRecord {
            totalTrial
            totalCorrect
            totalError
            totalPrompt
          }
        }
      }
    }
  }
`;

export const getTodaySessionsSummary = gql`
  query GetTodaySessionsSummary($date: Date!) {
    summary: getSessionRecordings(date: $date) {
      totalTarget
      edges {
        node {
          sessionRecord {
            totalTrial
            totalCorrect
            totalError
            totalPrompt
          }
        }
      }
    }
  }
`;
export const getThisWeekSessionsSummary = gql`
  query GetTodaySessionsSummary($fromDate: Date!, $toDate: Date!) {
    summary: getSessionRecordings(date_Gte: $fromDate, date_Lte: $toDate) {
      totalTarget
      edges {
        node {
          sessionRecord {
            totalTrial
            totalCorrect
            totalError
            totalPrompt
          }
        }
      }
    }
  }
`;
// export const getDecelData = gql`
//   query GetDecelData($date: Date, $studentId: ID) {
//     getDecelData(
//       template_Student: $studentId
//       date_Gte: $date
//       date_Lte: $date
//     ) {
//       edges {
//         node {
//           id
//           irt
//           intensity
//           note
//           date
//           frequency
//           duration
//           template {
//             id
//             behaviorDef
//             behaviorDescription
//             behavior {
//               behaviorName
//               id
//             }
//           }
//           environment {
//             id
//             name
//           }
//           status {
//             id
//             statusName
//           }
//         }
//       }
//     }
//   }
// `;

export const getBehaviorTemplate = gql`
  query getBehaviorTemplates($student: ID!) {
    getBehaviorTemplates(student: $student) {
      edges {
        node {
          id
          behaviorType
          behavior {
            id
            behaviorName
            definition
          }
          createdAt
          status {
            id
            statusName
          }
          student {
            id
          }
          description
          frequencyratebehaviorrecordSet {
            edges {
              node {
                id
                session {
                  id
                }
                date
                startTime
                endTime
                duration
                frequency
                rate
                rateUnit
              }
            }
          }
          durationbehaviorrecordSet {
            edges {
              node {
                id
                date
                startTime
                endTime
                duration
              }
            }
          }
          latencybehaviorrecordSet {
            edges {
              node {
                id
                date
                startTime
                endTime
                latency
              }
            }
          }
          partialintervalbehaviorrecordSet {
            edges {
              node {
                id
                date
                totalObservationTime
                observedTime
                intervalLength
                intervals
                frequency
                recordingType
                intervalChecks
                durationRecords {
                  edges {
                    node {
                      id
                      startTime
                      endTime
                      isSuccessful
                    }
                  }
                }
              }
            }
          }
          wholeintervalbehaviorrecordSet {
            edges {
              node {
                id
                date
                totalObservationTime
                observedTime
                intervalLength
                intervals
                frequency
                recordingType
                intervalChecks
                durationRecords {
                  edges {
                    node {
                      id
                      startTime
                      endTime
                      isSuccessful
                    }
                  }
                }
              }
            }
          }
          momentarytimebehaviorrecordSet {
            edges {
              node {
                id
                date
                totalObservationTime
                observedTime
                intervalLength
                intervals
                frequency
                rangeMin
                rangeMax
                recordingType
                intervalChecks
                durationRecords {
                  edges {
                    node {
                      id
                      startTime
                      endTime
                      isSuccessful
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

export const removeStudentBehaviorRecord = gql`
  mutation studentBehaviorRecordDeleteMutation($record: ID!, $behaviorType: String!) {
    studentBehaviorRecordDeleteMutation(input: { record: $record, behaviorType: $behaviorType }) {
      status
    }
  }
`

export const getTemplateEnvironment = gql`
  query getBehaviorTemplatesEnvironments($templates: [String!]!) {
    getBehaviorTemplatesEnvironments(templates: $templates) {
      templateId
      environments {
        id
        name
      }
    }
  }
`;

export const getDecelData = gql`
  query GetDecelData($date: Date, $studentId: ID) {
    getDecelData(
      template_Student: $studentId
      date_Gte: $date
      date_Lte: $date
    ) {
      edges {
        node {
          id
          irt
          intensity
          note
          date
          frequency {
            edges {
              node {
                id
                time
                count
              }
            }
          }
          duration
          template {
            id
            behaviorDef
            behaviorDescription
            behavior {
              id
              behaviorName
            }
          }
          environment {
            id
            name
          }
          status {
            id
            statusName
          }
          frequency {
            edges {
              node {
                id
                count
                time
              }
            }
          }
        }
      }
    }
  }
`;

export const recordMandData = gql`
  mutation RecordMand(
    $data: Int
    $date: Date
    $dailyClick: ID
    $sessionId: ID
  ) {
    recordMand(
      input: {
        dailyData: {
          dailyClick: $dailyClick
          date: $date
          data: $data
          session: $sessionId
        }
      }
    ) {
      details {
        id
        date
        data
        dailyClick {
          id
          measurments
        }
      }
    }
  }
`;

export const deleteMandData = gql`
  mutation DeleteMand($id: ID!) {
    deleteMandClick(input: {pk: $id}) {
      status
      message
    }
  }
`;

export const createDailyClick = gql`
  mutation CreateDailyClick($measurements: String, $studentId: ID) {
    createDailyClick(
      input: {clickData: {student: $studentId, measurments: $measurements}}
    ) {
      details {
        id
        measurments
        student {
          id
          firstname
        }
      }
    }
  }
`;

export const getDailyClick = gql`
  query GetDailyClick($studentId: ID) {
    getClickData(student: $studentId) {
      edges {
        node {
          id
          measurments
        }
      }
    }
  }
`;

export const getTemplateData = gql`
  query GetTemplate($studentId: ID!) {
    getTemplate(student: $studentId) {
      edges {
        node {
          id
          antecedentManipulations
          reactiveProcedures
          behaviorDescription
          isActive
          behavior {
            id
            behaviorName
            definition
          }
          status {
            id
            statusName
          }
          environment {
            edges {
              node {
                id
                name
              }
            }
          }
          measurments {
            edges {
              node {
                id
                measuringType
              }
            }
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
        }
      }
    }
  }
`;

export const getToiletData = gql`
  query GetToiletData($studentId: ID, $date: Date) {
    getToiletData(student: $studentId, date: $date) {
      edges {
        node {
          id
          date
          time
          lastWater
          lastWaterTime
          success
          urination
          bowel
          prompted
          reminders {
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
          urinationRecords {
            edges {
              node {
                id
                time
                status
              }
            }
          }
        }
      }
    }
  }
`;

export const newToiletData = gql`
  mutation NewToiletData(
    $studentId: ID!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
    $lastWater: String!
    $lastWaterTime: String!
    $time: String!
    $date: Date!
    $sessionId: ID
    $reminders: [RemaindersInput]
    $urinationRecord: [UrinationRecordsInput]
  ) {
    recordToiletdata(
      input: {
        toiletData: {
          session: $sessionId
          student: $studentId
          date: $date
          time: $time
          lastWater: $lastWater
          lastWaterTime: $lastWaterTime
          success: true
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
        remainders: $reminders
        urinationRecord: $urinationRecord
      }
    ) {
      details {
        id
        date
        time
        lastWater
        lastWaterTime
        success
        urination
        bowel
        prompted
        reminders {
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
      }
    }
  }
`;

export const updateToiletData = gql`
  mutation NewToiletData(
    $id: ID!
    $sesionId: ID
    $studentId: ID!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
    $lastWater: String!
    $lastWaterTime: String!
    $time: String!
    $date: Date!
    $reminders: [RemaindersInput]
    $urinationRecord: [UrinationRecordsInput]
  ) {
    updateToiletdata(
      input: {
        pk: $id
        toiletData: {
          session: $sesionId
          student: $studentId
          date: $date
          time: $time
          lastWater: $lastWater
          lastWaterTime: $lastWaterTime
          success: true
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
        remainders: $reminders
        urinationRecord: $urinationRecord
      }
    ) {
      details {
        id
        date
        time
        lastWater
        lastWaterTime
        success
        urination
        bowel
        prompted
        reminders {
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
      }
    }
  }
`;

export const deleteToiletData = gql`
  mutation DelToilet($id: ID!) {
    deleteToiletdata(input: {pk: $id}) {
      status
      message
    }
  }
`;

export const newAbcdata = gql`
  mutation NewAbcData(
    $studentId: ID!
    $response: String
    $frequency: Int
    $intensity: String
    $behaviors: [ID]
    $consequences: [ID]
    $antecedents: [ID]
    $date: Date
    $time: String
    $notes: String
    $environment: ID
    $function: String
  ) {
    recordAbcdata(
      input: {
        abcData: {
          studentId: $studentId
          date: $date
          target: 100
          frequency: $frequency
          time: $time
          Intensiy: $intensity
          response: $response
          Duration: "00:00"
          Notes: $notes
          environments: $environment
          behaviors: $behaviors
          consequences: $consequences
          antecedents: $antecedents
          function: $function
        }
      }
    ) {
      details {
        id
      }
    }
  }
`;

export const updateAbcdata = gql`
  mutation updateAbcdata(
    $id: ID!
    $studentId: ID!
    $response: String
    $frequency: Int
    $intensity: String
    $behaviors: [ID]
    $consequences: [ID]
    $antecedents: [ID]
    $date: Date
    $time: String
    $notes: String
    $environment: ID
    $function: String
  ) {
    updateAbcdata(
      input: {
        pk: $id
        abcData: {
          studentId: $studentId
          date: $date
          target: 100
          frequency: $frequency
          time: $time
          Intensiy: $intensity
          response: $response
          Duration: "00:00"
          Notes: $notes
          environments: $environment
          behaviors: $behaviors
          consequences: $consequences
          antecedents: $antecedents
          function: $function
        }
      }
    ) {
      details {
        id
      }
    }
  }
`;

export const createConsequence = gql`
  mutation CreateConsequence($studentId: ID!, $name: String!) {
    createConsequence(input: {student: $studentId, name: $name}) {
      details {
        id
        consequenceName
      }
    }
  }
`;
export const createAntecedent = gql`
  mutation CreateAntecedent($studentId: ID!, $name: String!) {
    createAntecedent(
      input: {student: $studentId, name: $name, note: "Test Note"}
    ) {
      details {
        id
        antecedentName
        note
        time
      }
    }
  }
`;
export const createBehaviour = gql`
  mutation CreateBehaviour($studentId: ID!, $name: String!) {
    createBehaviour(
      input: {student: $studentId, name: $name, definition: "Test Definition"}
    ) {
      details {
        id
        behaviorName
        definition
        time
      }
    }
  }
`;
export const getBehaviourData = gql`
  query GetBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
          definition
        }
      }
    }
  }
`;

export const getNewTemplateFields = gql`
  query GetBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
          definition
        }
      }
    }
    getDecelStatus {
      id
      statusName
      statusCode
    }
    getEnvironment {
      id
      name
      defination
    }
    getBehaviourMeasurings {
      id
      measuringType
      unit
    }
  }
`;

export const getBehaviorTemplateDetails = gql`
  query getBehaviorTemplateDetails($id: ID!) {
    getBehaviorTemplateDetails(id: $id) {
      id
      behavior {
        id
        behaviorName
      }
      behaviorType
      description
      reactiveProcedures
      antecedentManipulation
      status {
        id
        statusName
      }
      reminders {
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
    }
  }
`;
export const getBehaviorTemplateEnvironments = gql`
  query getBehaviorTemplateEnvironments($template: ID!) {
    getBehaviorTemplateEnvironments(template: $template) {
      id
      name
    }
  }
`;

export const getBehaviour = gql`
  query getBehaviour($studentId: ID!) {
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
export const getDecelStatus = gql`
  query {
    getDecelStatus {
      id
      statusName
      statusCode
    }
  }
`;

const DANCLE_MEASURMENTS = gql`
  query {
    getBehaviourMeasurings {
      id
      measuringType
      unit
    }
  }
`;
// export const createNewTemplate = gql`
//   mutation createNewTemplate(
//     $studentId: ID!
//     $behaviorId: ID!
//     $statusId: ID!
//     $behaviordef: String!
//     $behaviordes: String!
//     $environments: [ID!]
//     $antecedentManipulations: String
//     $reactiveProcedures: String
//     $remainders: [RemainderInput]
//   ) {
//     createTemplate(
//       input: {
//         decelData: {
//           student: $studentId
//           behavior: $behaviorId
//           status: $statusId
//           behaviorDef: $behaviordef
//           behaviorDescription: $behaviordes
//           environment: $environments
//           antecedentManipulations: $antecedentManipulations
//           reactiveProcedures: $reactiveProcedures
//           remainders: $remainders
//         }
//       }
//     ) {
//       details {
//         id
//         behaviorDef
//         behaviorDescription
//         behavior {
//           id
//           behaviorName
//           definition
//         }
//         status {
//           id
//           statusName
//         }
//       }
//     }
//   }
// `;

export const createNewTemplate = gql`
  mutation createTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $behaviorType: [String]!
    $status: ID!
    $description: String
    $envs: [ID]
    $manipulations: String
    $procedures: String
    $reminders: [RemainderInput]
  ) {
    createTemplate(
      input: {
        templateData: {
          studentId: $studentId
          behavior: $behaviorId
          behaviorType: $behaviorType
          status: $status
          description: $description
          environment: $envs
          antecedentManipulation: $manipulations
          reactiveProcedures: $procedures
          reminders: $reminders
        }
      }
    ) {
      template {
        id
        description
        reactiveProcedures
        antecedentManipulation
        behavior {
          id
          behaviorName
          definition
        }
      }
    }
  }
`;

// export const createNewTemplate = gql`
//   mutation createNewTemplate(
//     $studentId: ID!
//     $behaviorId: ID!
//     $statusId: ID!
//     $behaviordef: String!
//     $behaviordes: String!
//     $environments: [ID!]
//     $antecedentManipulations: String
//     $reactiveProcedures: String
//     $remainders: [RemainderInput]
//   ) {
//     createTemplate(
//       input: {
//         decelData: {
//           student: $studentId
//           behavior: $behaviorId
//           status: $statusId
//           behaviorDef: $behaviordef
//           behaviorDescription: $behaviordes
//           environment: $environments
//           antecedentManipulations: $antecedentManipulations
//           reactiveProcedures: $reactiveProcedures
//           remainders: $remainders
//         }
//       }
//     ) {
//       details {
//         id
//         behaviorDef
//         behaviorDescription
//         behavior {
//           id
//           behaviorName
//           definition
//         }
//         status {
//           id
//           statusName
//         }
//       }
//     }
//   }
// `;

export const updateTemplateActiveData = gql`
  mutation updateTemplates($id: ID!, $isActive: Boolean!) {
    updateTemplate(input: {decelData: {pk: $id, isActive: $isActive}}) {
      details {
        id
        isActive
        behaviorDef
        behaviorDescription
        behavior {
          id
          behaviorName
          definition
        }
      }
    }
  }
`;

export const updateTemplate = gql`
  mutation updateTemplate(
    $behaviorId: ID!
    $behaviorType: [String]!
    $tempId: ID!
    $status: ID!
    $description: String!
    $envs: [ID]
    $reminders: [RemainderInput]
    $manipulation: String
    $procedures: String
  ) {
    updateTemplate(
      input: {
        templateData: {
          pk: $tempId
          behavior: $behaviorId
          behaviorType: $behaviorType
          status: $status
          description: $description
          environment: $envs
          antecedentManipulation: $manipulation
          reactiveProcedures: $procedures
          reminders: $reminders
        }
      }
    ) {
      details {
        id
        behaviorType
        description
        reactiveProcedures
        antecedentManipulation
        behavior {
          id
          behaviorName
          definition
        }
        behaviorType
        description
        reactiveProcedures
        antecedentManipulation
        reminders {
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
        behavior {
          id
          behaviorName
          definition
        }
        status {
          id
          statusName
        }
      }
    }
  }
`;

// export const updateTemplate = gql`
//   mutation updateTemplates(
//     $id: ID!
//     $studentId: ID!
//     $behaviorId: ID!
//     $statusId: ID!
//     $behaviordef: String!
//     $behaviordes: String!
//     $environments: [ID!]
//     $antecedentManipulations: String
//     $reactiveProcedures: String
//     $remainders: [RemainderInput]
//   ) {
//     updateTemplate(
//       input: {
//         decelData: {
//           pk: $id
//           student: $studentId
//           behavior: $behaviorId
//           status: $statusId
//           behaviorDef: $behaviordef
//           behaviorDescription: $behaviordes
//           environment: $environments
//           antecedentManipulations: $antecedentManipulations
//           reactiveProcedures: $reactiveProcedures
//           remainders: $remainders
//         }
//       }
//     ) {
//       details {
//         id
//         behaviorDef
//         behaviorDescription
//         behavior {
//           id
//           behaviorName
//           definition
//         }
//         status {
//           id
//           statusName
//         }
//       }
//     }
//   }
// `;

export const deleteTemplate = gql`
mutation behaviorTemplateDeleteMutation($id: ID!) {
  behaviorTemplateDeleteMutation(input: { template: $id }) {
    id
    status
  }
}
`;
export const addFrequencyRateBehaviorRecord = gql`
  mutation(
    $date: Date
    $startTime: Time
    $endTime: Time
    $duration: Int
    $session:ID
    $frequency: Int
    $rate: Float
    $rateUnit: String
    $studentTemplate: ID
  ) {
    addFrequencyRateBehaviorRecord(
      input: {
        date: $date
        session:$session
        startTime: $startTime
        endTime: $endTime
        duration: $duration
        frequency: $frequency
        rate: $rate
        rateUnit: $rateUnit
        studentTemplate: $studentTemplate
      }
    ) {
      frequencyRateBehaviorRecord {
        id
        date
        startTime
        endTime
        duration
        frequency
        rate
        rateUnit
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
      }
    }
  }
`;

export const updateFrequencyRateBehaviorRecord = gql`
  mutation(
    $id:ID
    $date: Date
    $startTime: Time
    $endTime: Time
    $duration: Int
    $frequency: Int
    $rate: Float
    $rateUnit: String
    $studentTemplate: ID
  ) {
    addFrequencyRateBehaviorRecord(
      input: {
        id: $id
        date: $date
        startTime: $startTime
        endTime: $endTime
        duration: $duration
        frequency: $frequency
        rate: $rate
        rateUnit: $rateUnit
        studentTemplate: $studentTemplate
      }
    ) {
      frequencyRateBehaviorRecord {
        id
        date
        startTime
        endTime
        duration
        frequency
        rate
        rateUnit
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
      }
    }
  }
`;

export const addDurationBehaviorRecord = gql`
  mutation addDurationBehaviorRecord(
    $date: Date
    $startTime: Time!
    $endTime: Time!
    $duration: Int
    $tempId: ID!
  ) {
    addDurationBehaviorRecord(
      input: {
        date: $date
        startTime: $startTime
        endTime: $endTime
        duration: $duration
        studentTemplate: $tempId
      }
    ) {
      durationBehaviorRecord {
        id
        date
        startTime
        endTime
        duration
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
      }
    }
  }
`;
export const updateDurationBehaviorRecord = gql`
  mutation addDurationBehaviorRecord(
    $id:ID
    $date: Date
    $startTime: Time!
    $endTime: Time!
    $duration: Int
    $tempId: ID!
  ) {
    addDurationBehaviorRecord(
      input: {
        id: $id
        date: $date
        startTime: $startTime
        endTime: $endTime
        duration: $duration
        studentTemplate: $tempId
      }
    ) {
      durationBehaviorRecord {
        id
        date
        startTime
        endTime
        duration
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
      }
    }
  }
`;

export const addLatencyBehaviorRecord = gql`
  mutation addLatencyBehaviorRecord(
    $date: Date
    $startTime: Time!
    $endTime: Time!
    $duration: Int
    $tempId: ID!
  ) {
    addLatencyBehaviorRecord(
      input: {
        date: $date
        startTime: $startTime
        endTime: $endTime
        latency: $duration
        studentTemplate: $tempId
      }
    ) {
      latencyBehaviorRecord {
        id
        date
        startTime
        endTime
        latency
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
      }
    }
  }
`;

export const updateLatencyBehaviorRecord = gql`
  mutation addLatencyBehaviorRecord(
    $id: ID
    $date: Date
    $startTime: Time!
    $endTime: Time!
    $duration: Int
    $tempId: ID!
  ) {
    addLatencyBehaviorRecord(
      input: {
        id: $id
        date: $date
        startTime: $startTime
        endTime: $endTime
        latency: $duration
        studentTemplate: $tempId
      }
    ) {
      latencyBehaviorRecord {
        id
        date
        startTime
        endTime
        latency
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
      }
    }
  }
`;

export const addPartialIntervalBehaviorRecord = gql`
  mutation addPartialIntervalBehaviorRecord(
    $date: Date
    $totalObservationTime: Int
    $observedTime: Int
    $intervalLength: Int
    $intervals: Int
    $frequency: Int
    $recordingType: String
    $studentTemplate: ID
    $intervalChecks: String
    $durationRecords: [DurationRecordInputType]
  ) {
    addPartialIntervalBehaviorRecord(
      input: {
        date: $date
        totalObservationTime: $totalObservationTime
        observedTime: $observedTime
        intervalLength: $intervalLength
        intervals: $intervals
        frequency: $frequency
        recordingType: $recordingType
        studentTemplate: $studentTemplate
        intervalChecks: $intervalChecks
        durationRecords: $durationRecords
      }
    ) {
      partialBehaviorRecord {
        id
        date
        totalObservationTime
        observedTime
        intervalLength
        intervals
        frequency
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
        recordingType
        intervalChecks
        durationRecords {
          edges {
            node {
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

export const updatePartialIntervalBehaviorRecord = gql`
  mutation addPartialIntervalBehaviorRecord(
    $id: ID
    $date: Date
    $totalObservationTime: Int
    $observedTime: Int
    $intervalLength: Int
    $intervals: Int
    $frequency: Int
    $recordingType: String
    $studentTemplate: ID
    $intervalChecks: String
    $durationRecords: [DurationRecordInputType]
  ) {
    addPartialIntervalBehaviorRecord(
      input: {
        id: $id
        date: $date
        totalObservationTime: $totalObservationTime
        observedTime: $observedTime
        intervalLength: $intervalLength
        intervals: $intervals
        frequency: $frequency
        recordingType: $recordingType
        studentTemplate: $studentTemplate
        intervalChecks: $intervalChecks
        durationRecords: $durationRecords
      }
    ) {
      partialBehaviorRecord {
        id
        date
        totalObservationTime
        observedTime
        intervalLength
        intervals
        frequency
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
        recordingType
        intervalChecks
        durationRecords {
          edges {
            node {
              id
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

export const addWholeIntervalBehaviorRecord = gql`
  mutation addWholeIntervalBehaviorRecord(
    $date: Date
    $totalObservationTime: Int
    $observedTime: Int
    $intervalLength: Int
    $intervals: Int
    $frequency: Int
    $recordingType: String
    $studentTemplate: ID
    $intervalChecks: String
    $durationRecords: [DurationRecordInputType]
  ) {
    addWholeIntervalBehaviorRecord(
      input: {
        date: $date
        totalObservationTime: $totalObservationTime
        observedTime: $observedTime
        intervalLength: $intervalLength
        intervals: $intervals
        frequency: $frequency
        recordingType: $recordingType
        studentTemplate: $studentTemplate
        intervalChecks: $intervalChecks
        durationRecords: $durationRecords
      }
    ) {
      wholeBehaviorRecord {
        id
        date
        totalObservationTime
        observedTime
        intervalLength
        intervals
        frequency
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
        recordingType
        intervalChecks
        durationRecords {
          edges {
            node {
              id
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

export const updateWholeIntervalBehaviorRecord = gql`
  mutation addWholeIntervalBehaviorRecord(
    $id: ID
    $date: Date
    $totalObservationTime: Int
    $observedTime: Int
    $intervalLength: Int
    $intervals: Int
    $frequency: Int
    $recordingType: String
    $studentTemplate: ID
    $intervalChecks: String
    $durationRecords: [DurationRecordInputType]
  ) {
    addWholeIntervalBehaviorRecord(
      input: {
        id: $id
        date: $date
        totalObservationTime: $totalObservationTime
        observedTime: $observedTime
        intervalLength: $intervalLength
        intervals: $intervals
        frequency: $frequency
        recordingType: $recordingType
        studentTemplate: $studentTemplate
        intervalChecks: $intervalChecks
        durationRecords: $durationRecords
      }
    ) {
      wholeBehaviorRecord {
        id
        date
        totalObservationTime
        observedTime
        intervalLength
        intervals
        frequency
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
        recordingType
        intervalChecks
        durationRecords {
          edges {
            node {
              id
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;


export const addMomentaryTimeBehaviorRecord = gql`
  mutation addMomentaryTimeBehaviorRecord(
    $date: Date
    $totalObservationTime: Int
    $observedTime: Int
    $intervalLength: Int
    $intervals: Int
    $frequency: Int
    $rangeMin: Int
    $rangeMax: Int
    $recordingType: String
    $studentTemplate: ID
    $intervalChecks: String
    $durationRecords: [DurationRecordInputType]
  ) {
    addMomentaryTimeBehaviorRecord(
      input: {
        date: $date
        totalObservationTime: $totalObservationTime
        observedTime: $observedTime
        intervalLength: $intervalLength
        intervals: $intervals
        frequency: $frequency
        rangeMin: $rangeMin
        rangeMax: $rangeMax
        recordingType: $recordingType
        studentTemplate: $studentTemplate
        intervalChecks: $intervalChecks
        durationRecords: $durationRecords
      }
    ) {
      momentaryBehaviorRecord {
        id
        date
        totalObservationTime
        observedTime
        intervalLength
        intervals
        frequency
        rangeMin
        rangeMax
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
        recordingType
        intervalChecks
        durationRecords {
          edges {
            node {
              id
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

export const updateMomentaryTimeBehaviorRecord = gql`
  mutation addMomentaryTimeBehaviorRecord(
    $id: ID
    $date: Date
    $totalObservationTime: Int
    $observedTime: Int
    $intervalLength: Int
    $intervals: Int
    $frequency: Int
    $rangeMin: Int
    $rangeMax: Int
    $recordingType: String
    $studentTemplate: ID
    $intervalChecks: String
    $durationRecords: [DurationRecordInputType]
  ) {
    addMomentaryTimeBehaviorRecord(
      input: {
        id: $id
        date: $date
        totalObservationTime: $totalObservationTime
        observedTime: $observedTime
        intervalLength: $intervalLength
        intervals: $intervals
        frequency: $frequency
        rangeMin: $rangeMin
        rangeMax: $rangeMax
        recordingType: $recordingType
        studentTemplate: $studentTemplate
        intervalChecks: $intervalChecks
        durationRecords: $durationRecords
      }
    ) {
      momentaryBehaviorRecord {
        id
        date
        totalObservationTime
        observedTime
        intervalLength
        intervals
        frequency
        rangeMin
        rangeMax
        studentBehaviorTemplate {
          id
          student {
            id
          }
        }
        recordingType
        intervalChecks
        durationRecords {
          edges {
            node {
              id
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

export const getTutorialVideosList = gql`
  query {
    VimeoVideos {
      edges {
        node {
          id
          name
          url
          duration
          thubUrl
          status
          description
          html
          project {
            id
          }
          videoLike {
            edges {
              node {
                id
              }
            }
          }
          comment {
            edges {
              node {
                id
                comment
              }
            }
          }
        }
      }
    }
  }
`;

export const getAbcData = gql`
  query GetBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
          definition
        }
      }
    }
    getBehaviorLocation(studentId: $studentId, status: true) {
      edges {
        node {
          id
          behaviorLocation
          status
        }
      }
    }
    getAntecedent(studentId: $studentId) {
      edges {
        node {
          id
          antecedentName
        }
      }
    }
    getConsequences(studentId: $studentId) {
      edges {
        node {
          id
          consequenceName
        }
      }
    }
    getEnvironment {
      id
      name
    }
  }
`;

export const getAbcList = gql`
  query AbcList($studentId: ID!, $date: Date!) {
    getABC(studentId: $studentId, date_Gte: $date, date_Lte: $date) {
      edges {
        node {
          id
          date
          target
          frequency
          time
          Intensiy
          response
          Duration
          Notes
          function
          environments {
            id
            name
          }
          behavior {
            edges {
              node {
                id
                behaviorName
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
          antecedent {
            edges {
              node {
                id
                antecedentName
              }
            }
          }
          location {
            edges {
              node {
                id
                behaviorLocation
              }
            }
          }
        }
      }
    }
  }
`;

export const getTherapyProgramsQuery = gql`
  query TherapyPrograms($studentId: ID!) {
    student(id: $studentId) {
      id
      caseManager {
        id
        name
        contactNo
        email
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
export const getTherapyProgramDetails = gql`
  query ProgramDetails($therapyId: ID!) {
    programDetails(id: $therapyId) {
      id
      name
      videos {
        edges {
          node {
            id
            url
          }
        }
      }
      assessments {
        edges {
          node {
            id
            name
          }
        }
      }
      sessions {
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
export const getSessions = gql`
  {
    sessionName {
      id
      name
    }
  }
`;
export const getPreferredCategories = gql`
query($student: ID!) {
  preferredItemsCategory(student: $student) {
    edges {
      node {
        id
        name
      }
    }
  }
}
`;
export const preferredItems = gql`
  query PreferredItems($studentId: ID!, $programAreaId: ID!, $categoryId: ID!) {
    preferredItems(
      student: $studentId
      programArea: $programAreaId
      category: $categoryId
    ) {
      edges {
        node {
          id
          itemName
          description
          category {
            id
            name
          }
          programArea {
            id
            name
          }
          student {
            id
          }
        }
      }
    }
  }
`;

export const GET_PREFERRED_ITEMS = gql`
  query preferredItems($student: ID!) {
    preferredItems(student: $student) {
      edges {
        node {
          id
          itemName
          category {
            id
            name
          }
        }
      }
    }
  }
`

export const createPreferredItemsCategory = gql`
  mutation($student: ID!, $name: String!) {
    createPreferredItemsCategory(input: { student: $student, name: $name }) {
      details {
        id
        name
      }
    }
  }
`

export const createPrefItem = gql`
  mutation CreatePreferredItems(
    $studentId: ID!
    $programAreaId: ID!
    $categoryId: ID!
    $itemName: String!
    $description: String
  ) {
    createPreferredItems(
      input: {
        data: {
          student: $studentId
          programArea: $programAreaId
          category: $categoryId
          itemName: $itemName
          description: $description
        }
      }
    ) {
      details {
        id
        itemName
        description
        category {
          id
          name
        }
        programArea {
          id
          name
        }
      }
    }
  }
`;

export const updatePrefItem = gql`
  mutation updatePreferredItems(
    $id: ID!
    $programAreaId: ID!
    $categoryId: ID!
    $itemName: String!
    $description: String
  ) {
    updatePreferredItems(
      input: {
        pk: $id
        data: {
          programArea: $programAreaId
          category: $categoryId
          itemName: $itemName
          description: $description
        }
      }
    ) {
      details {
        id
      }
    }
  }
`;

export const deletePrefItem = gql`
  mutation($id: ID!) {
    deletePreferredItems(id: $id) {
      success
    }
  }
`

export const getTherapyLongTermGoals = gql`
  query TherapyPrograms($student: ID!, $program: ID!) {
    programDetails(id: $program) {
      id
      name
      description
      longtermgoalSet(student: $student) {
        edges {
          node {
            id
            goalName
            description
            dateInitialted
            dateEnd
            shorttermgoalSet {
              edges {
                node {
                  id
                  goalName
                  description
                  dateInitialted
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
            responsibility {
              id
              name
            }
            goalStatus {
              id
              status
            }
          }
        }
      }
    }
  }
`;
export const getShortTermGoals = gql`
  query TherapyPrograms($student: ID!, $program: ID!) {
    programDetails(id: $program) {
      longtermgoalSet(student: $student) {
        edges {
          node {
            goalName
            shorttermgoalSet {
              edges {
                node {
                  id
                  goalName
                  description
                  dateInitialted
                  goalStatus {
                    id
                    status
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
export const getLongTermGoals = gql`
  query TherapyPrograms($student: ID!, $program: ID!) {
    programDetails(id: $program) {
      id
      name
      description
      longtermgoalSet(student: $student) {
        edges {
          node {
            id
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
          }
        }
      }
    }
  }
`;
export const targetSummary = gql`
  query TargetSummary($studentId: ID!) {
    total_targets: targetAllocates(studentId: $studentId) {
      edgeCount
    }
    mastered_targets: targetAllocates(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZTox"
    ) {
      edgeCount
    }
    intherapy_targets: targetAllocates(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZToz"
    ) {
      edgeCount
    }
  }
`;

export const startSession = gql`
  mutation StartSession(
    $parentSessionId: ID!
    $status: String!
    $duration: Int!
  ) {
    startSession(
      input: {
        parentSession: $parentSessionId
        status: $status
        duration: $duration
      }
    ) {
      details {
        id
        sessionDate
        status
        duration
        sessions {
          id
        }
      }
    }
  }
`;
export const peakRecord = gql`
  mutation peakBlockTrials(
    $block: ID!
    $sd: ID!
    $start: Int!
    $end: Int!
    $mark: Int!
  ) {
    peakBlockTrials(
      input: {block: $block, sd: $sd, start: $start, end: $end, marks: $mark}
    ) {
      trial {
        id
        start
        end
        marks
        sd {
          id
          sd
        }
      }
      block {
        id
        durationStart
        durationEnd
        trial {
          edges {
            node {
              id
              start
              end
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
export const updatePeakRecord = gql`
  mutation peakBlockUpdateTrial(
    $pkId: ID!
    $sd: ID!
    $start: Int!
    $end: Int!
    $mark: Int!
  ) {
    peakBlockUpdateTrial(
      input: {pk: $pkId, sd: $sd, start: $start, end: $end, marks: $mark}
    ) {
      trial {
        id
        start
        end
        marks
        sd {
          id
          sd
        }
      }
    }
  }
`;
export const getGraphData = gql`
  query get5dayPercentage2($target: ID!, $sd: ID, $step: ID, $sessionType: ID) {
    get5dayPercentage2(
      target: $target
      sd: $sd
      step: $step
      sessionType: $sessionType
    ) {
      date
      correctPercent
      incorrectPercent
      errorPercent
      promptPercent
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
`;

export const getAutomatic = gql`
  mutation peakBlockAutomatic(
    $target: ID!
    $childSession: ID!
    $start: Int!
    $end: Int!
  ) {
    peakBlockAutomatic(
      input: {
        target: $target
        childSession: $childSession
        durationStart: $start
        durationEnd: $end
      }
    ) {
      skill {
        id
        durationStart
        durationEnd
        ChildSession {
          id
        }
        targets {
          id
          peakBlocks
          targetAllcatedDetails {
            targetName
            dateBaseline
          }
        }
        peak {
          edges {
            node {
              id
              durationStart
              durationEnd
              entryTime
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
      }
    }
  }
`;
export const createRecord = gql`
  mutation peakBlock($pk: ID!, $start: Int!, $end: Int!) {
    peakBlock(input: {pk: $pk, durationStart: $start, durationEnd: $end}) {
      skill {
        id
        durationStart
        durationEnd
        targets {
          id
        }
        peak {
          edges {
            node {
              id
              durationStart
              durationEnd
              entryTime
            }
          }
        }
      }
      block {
        id
        durationStart
        durationEnd
      }
    }
  }
`;

export const getAllPreviousRecordings = gql`
  query GetSessionRecordings(
    $childSession: ID!
    $sessiondate: Date!
    $targets: ID
  ) {
    getSessionRecordings(
      ChildSession: $childSession
      sessiondate: $sessiondate
      targets: $targets
    ) {
      edges {
        node {
          id
          durationStart
          durationEnd
          ChildSession {
            id
            sessionDate
            status
            sessions {
              id
              sessionName {
                id
                name
              }
            }
          }
          targets {
            id
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
                }
              }
            }
          }
          status {
            id
            statusName
          }
          isPeakEquivalance
          peakEquivalance {
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
                  id
                  stimulus1
                  sign12
                  stimulus2
                }
                relationTest {
                  id
                  stimulus1
                  sign12
                  stimulus2
                }
              }
            }
          }
          peak {
            edges {
              node {
                id
                durationStart
                durationEnd
                trial {
                  edges {
                    node {
                      id
                      start
                      end
                      sd {
                        id
                        sd
                      }
                      marks
                      promptCode {
                        id
                        promptName
                      }
                    }
                  }
                }
              }
            }
          }
          sessionRecord {
            edges {
              node {
                id
                entryTime
                trial
                durationStart
                durationEnd
                text
                sd {
                  id
                  sd
                }
                step {
                  id
                  step
                }
                promptCode {
                  id
                  promptName
                }
              }
            }
          }
          isBehReduction
          totalBehRecordingDuration
          behReduction {
            edges {
              node {
                id
                trial
                duration
                createdAt
                r1 {
                  id
                  behaviorName
                }
                r2 {
                  id
                  behaviorName
                }
                sbtStep{
                  id
                  description
                  status{
                    id
                    statusName
                  }
                }
                step {
                  id
                  step
                }
              }
            }
          }
          isBehRecording
          behaviourRecording {
            edges {
              node {
                id
                frequency
                start
                end
                createdAt
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getPreviousSessionRecordings = gql`
  query GetSessionRecordings($childSession: ID!, $date: Date!, $targetId: ID) {
    getSessionRecordings(
      ChildSession_Sessions: $childSession
      sessiondate: $date
      targets: $targetId
    ) {
      edges {
        node {
          id
          durationStart
          durationEnd
          ChildSession {
            id
            sessionDate
            status
            sessions {
              id
              sessionName {
                id
                name
              }
            }
          }
          targets {
            id
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
                }
              }
            }
          }
          status {
            id
            statusName
          }
          peak {
            edges {
              node {
                id
                durationStart
                durationEnd
                trial {
                  edges {
                    node {
                      id
                      start
                      end
                      sd {
                        id
                        sd
                      }
                      marks
                      promptCode {
                        id
                        promptName
                      }
                    }
                  }
                }
              }
            }
          }
          sessionRecord {
            edges {
              node {
                id
                entryTime
                trial
                durationStart
                durationEnd
                sd {
                  id
                  sd
                }
                step {
                  id
                  step
                }
                text
                indexNo
                promptCode {
                  id
                  promptName
                }
              }
            }
          }
          isBehReduction
          totalBehRecordingDuration
          behReduction {
            edges {
              node {
                id
                trial
                duration
                createdAt
                r1 {
                  id
                  behaviorName
                }
                r2 {
                  id
                  behaviorName
                }
                sbtStep{
                  id
                  description
                  status{
                    id
                    statusName
                  }
                }
                step {
                  id
                  step
                }
              }
            }
          }
          isBehRecording
          behaviourRecording {
            edges {
              node {
                id
                frequency
                start
                end
                createdAt
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const recordSBTTrial=gql`
mutation(
  $targets:ID!
  $childSession:ID!
  $status:ID
  $trial:String!
  $duration:Int
  $r1:ID!
  $r2:ID!
  $sbtStep:ID!
  $prompt:ID
  $reinforce:ID
  ) {
  recordBehaviourReductionRecording(input:{
    targets:$targets
    childSession:$childSession
    status:$status
    isBehReduction: true
    totalBehRecordingDuration:0
    isBehRecording:false
    behaviourRecording:[]
    behReduction:[
      {
        trial:$trial, 
        duration:$duration, 
        r1:$r1, 
        r2:$r2, 
        sbtStep:$sbtStep,
        prompt:$prompt,
        reinforce:$reinforce
      }
    ]
  }){
      behaviorReduction{
        id
        trial
        duration
        createdAt
        r1{
          id
          behaviorName
        }
        r2{
          id
          behaviorName
        }
        reinforce{
          id
          name
        }
        sbtStep{
          id
          description
          status{
            id
            statusName
          }
        }
        prompt{
          id
          promptName
        }
      }
      details{
        id
        durationStart
        durationEnd
        targets{
            id
        }
        isBehReduction
        totalBehRecordingDuration
        isBehRecording
      }
    }
  }`

export const updateSBTtrial=gql`mutation(
  $pk:ID!
  $trial:String!
  $r1:ID!
  $r2:ID!
  $prompt:ID
  $reinforce:ID
){
  updateBehaviourReductionTrial(input:{
    pk:$pk,
    trial:$trial,
    r1:$r1,
    r2:$r2,
    prompt:$prompt,
    reinforce:$reinforce
  }){
      details{
        id
        trial
        duration
        createdAt
        r1{
          id
          behaviorName
        }
        r2{
          id
          behaviorName
        }
        reinforce{
          id
          name
        }
        sbtStep{
          id
          description
          status{
            id
            statusName
          }
        }
        prompt{
          id
          promptName
        }
      }
  }

}`

export const getTargetIdSessionRecordings = gql`
  query GetSessionRecordings($childSessionId: ID!, $targetId: ID!) {
    getSessionRecordings(ChildSession: $childSessionId, targets: $targetId) {
      edges {
        node {
          id
          durationStart
          durationEnd
          ChildSession {
            id
            sessionDate
            status
            sessions {
              id
              sessionName {
                id
                name
              }
            }
          }
          targets {
            id
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
                }
              }
            }
          }
          status {
            id
            statusName
          }
          isBehReduction
          totalBehRecordingDuration
          behReduction {
            edges {
              node {
                id
                trial
                duration
                createdAt
                r1 {
                  id
                  behaviorName
                }
                r2 {
                  id
                  behaviorName
                }
                sbtStep{
                  id
                  description
                  status{
                    id
                    statusName
                  }
                }
                step {
                  id
                  step
                }
              }
            }
          }
          isBehRecording
          behaviourRecording {
            edges {
              node {
                id
                frequency
                start
                end
                createdAt
                user {
                  id
                }
              }
            }
          }
          peak {
            edges {
              node {
                id
                durationStart
                durationEnd
                trial {
                  edges {
                    node {
                      id
                      start
                      end
                      sd {
                        id
                        sd
                      }
                      marks
                      promptCode {
                        id
                        promptName
                      }
                    }
                  }
                }
              }
            }
          }
          isPeakEquivalance
          peakEquivalance {
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
                  id
                  stimulus1
                  sign12
                  stimulus2
                }
                relationTest {
                  id
                  stimulus1
                  sign12
                  stimulus2
                }
              }
            }
          }
          sessionRecord {
            edges {
              node {
                id
                entryTime
                trial
                durationStart
                durationEnd
                sd {
                  id
                  sd
                }
                step {
                  id
                  step
                }
                text
                indexNo
                promptCode {
                  id
                  promptName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const markAsReadNotifications = gql`
  mutation markAsReadNoti($pk: ID!) {
    markAsRead(input: {pk: $pk}) {
      details {
        id
        read
      }
    }
  }
`;

// export const markAsReadnotifications = gql `
// mutation markAsRead($pk: ID!) {
// pk: $pk
// }
// `

export const updateSessionRecord = gql`
  mutation UpdateTrial(
    $trialId: ID!
    $trial: String!
    $sd: ID!
    $step: ID!
    $text: String!
    $indexNo: Int!
  ) {
    updateTrial(
      input: {
        pk: $trialId
        durationStart: 0
        durationEnd: 0
        trial: $trial
        sd: $sd
        step: $step
        promptCode: ""
        text: $text
        indexNo: $indexNo
      }
    ) {
      details {
        id
        trial
        durationStart
        durationEnd
        sd {
          id
          sd
        }
        step {
          id
          step
        }
        text
        indexNo
        promptCode {
          id
          promptName
        }
      }
    }
  }
`;
export const getLanguageProfile = gql`
  query languages {
    languages {
      id
      name
    }
  }
`;

export const getUserProfile = gql`
  query GetUserProfile($studentId: ID!) {
    student(id: $studentId) {
      id
      firstname
      lastname
      school {
        id
        schoolName
      }
      currentAddress
      email
      parentMobile
      parent {
        id
        username
        lastLogin
      }
      language {
        id
        name
      }
    }
  }
`;
export const getUserProfileSettings = gql`
  query GetUserSettings($userId: ID!) {
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
  }
`;

export const getNotifications = gql`
  query notification($student: ID!) {
    notification(recipient: $student) {
      edges {
        node {
          id
          title
          description
          timestamp
          read
          notifyType
          recipient {
            id
            username
          }
        }
      }
    }
  }
`;

export const getFeedbackQuestion = gql`
  query questions($appointmentId: ID) {
    feedbackQuestions(appointmentId: $appointmentId) {
      edges {
        node {
          id
          question
          type
          group {
            id
            name
          }
        }
      }
    }
  }
`;

export const createAppointmentFeedback = gql`
  mutation CreateAppointmentFeedback(
    $appointmentId: ID!
    $answers: [AppointmentAnswerInputType]
  ) {
    CreateAppointmentFeedback(
      input: {appointmentId: $appointmentId, answers: $answers}
    ) {
      message
    }
  }
`;

export const updateAppointmentFeedback = gql`
  mutation UpdateAppointmentFeedback(
    $appointmentId: ID!
    $answers: [AppointmentAnswerInputType]
  ) {
    UpdateAppointmentFeedback(
      input: {appointmentId: $appointmentId, answers: $answers}
    ) {
      message
    }
  }
`;

export const GetVimeoProjects = gql`
  {
    VimeoProject {
      edges {
        node {
          id
          name
          url
        }
      }
    }
  }
`;

export const GetVimeoProjectVideos = gql`
  query VimeoVideos($projectId: ID!) {
    VimeoVideos(project: $projectId) {
      edgeCount
      edges {
        node {
          id
          status
          category
          name
          url
          html
          duration
          thubUrl
          description
          playerUrl
          project {
            id
            name
          }
          videoLike {
            edges {
              node {
                id
                date
              }
            }
          }
          comment {
            edges {
              node {
                id
                comment
              }
            }
          }
        }
      }
    }
  }
`;

export const likeVideo = gql`
  mutation likeVideo($videoId: ID!) {
    likeVideo(input: {pk: $videoId}) {
      status
      message
    }
  }
`;

export const getAppointments = gql`
  query Appointments($student: ID!, $date: Date!) {
    appointments(student: $student, start_Date: $date) {
      edges {
        node {
          id
          title
          start
          note
          student {
            id
            firstname
            lastname
            image
            mobileno
          }
          purposeAssignment
          end
          appointmentStatus {
            id
            appointmentStatus
          }
          therapist {
            id
            name
          }
          location {
            id
            location
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
export const getAppointments1 = gql`
  query Appointments($student: ID!) {
    appointments(student: $student) {
      edges {
        node {
          id
          start
          end
          appointmentStatus {
            id
            appointmentStatus
          }
          therapist {
            id
            name
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

export const parentScreeningGetSteps = gql`
  query {
    autismSteps {
      id
      name
      duration
      description
    }
  }
`;

export const parentScreeningGetStatus = gql`
  mutation getStatus($userId: ID!) {
    getScreeningAssessStatus(input: {user: $userId}) {
      status
      message
      details {
        id
        score
        date
        name
        age
        sex
        phone
        email
        address
        user {
          id
          username
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
  }
`;

export const parentScreeningGetVideoStatus = gql`
  mutation VideoStatus($userId: ID!) {
    getScreeningVideoStatus(input: {user: $userId}) {
      status
      message
      details {
        id
        video
      }
    }
  }
`;

export const parentScreeningGetVideoStatusSingle = gql`
  mutation VideoStatus($id: ID!) {
    getScreeningVideoStatus(input: {pk: $id}) {
      status
      message
      details {
        id
        video
      }
    }
  }
`;

export const parentScreeningGetAll = gql`
  query GetPreAssesAl($id: ID!) {
    getPreAssess(user: $id) {
      edges {
        node {
          id
          date
          score
          name
          age
          sex
          phone
          email
          address
          status
          user {
            id
            username
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
    }
  }
`;

export const parentScreeningStartPreAssess = gql`
  mutation StartPreAsses(
    $name: String!
    $age: String!
    $sex: String!
    $phone: String!
    $email: String!
    $address: String!
  ) {
    startPreAssess(
      input: {
        name: $name
        age: $age
        sex: $sex
        phone: $phone
        email: $email
        address: $address
      }
    ) {
      details {
        id
        name
        age
        sex
        phone
        email
        address
      }
    }
  }
`;

export const parentScreeningGetPreAssessQuestion = gql`
  query preAssessQuestions($language: String) {
    preAssessQuestions(language: $language) {
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

export const addComments = gql`
  mutation communityLikesComments($pk: ID!, $user: ID!, $comment: String) {
    communityLikesComments(
      input: {pk: $pk, comments: [{user: $user, comment: $comment}]}
    ) {
      status
      message
      details {
        id
        time
        title
        description
        category {
          id
          name
        }
        comments {
          edges {
            node {
              id
              time
              comment
              user {
                id
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const deleteComment = gql`
  mutation deleteCommunityComment($pk: ID!, $comment: ID!) {
    deleteCommunityComment(input: {pk: $pk, comment: $comment}) {
      status
      msg
    }
  }
`;

export const updateComment = gql`
  mutation editCommunityComment($pk: ID!, $comment: ID) {
    editCommunityComment(input: {pk: $pk, comment: $comment}) {
      details {
        id
        time
        comment
        user {
          id
          username
        }
      }
    }
  }
`;

export const getBlogData = gql`
  query {
    communityGroups {
      id
      name
    }
  }
`;

export const addBlog = gql`
  mutation addCommunityBlogs(
    $title: String!
    $category: ID!
    $description: String
    $groupId: ID!
  ) {
    addCommunityBlogs(
      input: {
        title: $title
        category: $groupId
        description: $description
        blogCategory: [$category]
      }
    ) {
      details {
        id
        title
        description
        category {
          id
          name
        }
        blogCategory {
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

export const updateBlog = gql`
  mutation updateCommunityBlogs(
    $pk: ID!
    $title: String!
    $category: ID!
    $description: String
    $groupId: ID!
  ) {
    updateCommunityBlogs(
      input: {
        pk: $pk
        title: $title
        category: $groupId
        description: $description
        blogCategory: [$category]
      }
    ) {
      details {
        id
        title
        description
        category {
          id
          name
        }
        blogCategory {
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
export const addGroup = gql`
  mutation addCommunityGroup($name: String!, $description: String!) {
    addCommunityGroup(input: {name: $name, description: $description}) {
      details {
        id
        name
        description
      }
    }
  }
`;

export const updateGroup = gql`
  mutation updateCommunityGroup(
    $name: String!
    $description: String!
    $pk: ID!
    $userId: ID!
  ) {
    updateCommunityGroup(
      input: {name: $name, description: $description, pk: $pk, users: [$userId]}
    ) {
      details {
        id
        name
        description
        user {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export const deleteGroup = gql`
  mutation deleteCommunityGroup($pk: ID!) {
    deleteCommunityGroup(input: {pk: $pk}) {
      status
      msg
    }
  }
`;
export const likeBlog = gql`
  mutation communityLikesComments($pk: ID!, $user: ID!) {
    communityLikesComments(input: {pk: $pk, likes: [$user]}) {
      status
      message
      details {
        id
        time
        title
        description
        category {
          id
          name
        }
        likes {
          edges {
            node {
              id
              time
              user {
                id
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const parentScreeningRecordPreAssess = gql`
  mutation RecordPreAssess($pk: ID!, $question: ID!, $answer: ID!) {
    recordPreAssess(
      input: {pk: $pk, questions: [{question: $question, answer: $answer}]}
    ) {
      details {
        id
        name
        age
        sex
        phone
        email
        address
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

export const parentScreeningGetRecordedAssess = gql`
  query GetPreAssessDetail($id: ID!) {
    getPreAssessDetail(id: $id) {
      id
      name
      age
      sex
      phone
      email
      address
      status
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

export const parentScreeningGetPreAssessVideos = gql`
  query getInstruction($language: String!, $student: ID!) {
    getPreAssessVideos(language: $language, student: $student) {
      edges {
        node {
          id
          language
          videoIntro
          videoInstruction
          videoUrl
          videoDescription
          audioUrl
          audioDescription
          scriptUrl
          scriptDescription
        }
      }
    }
  }
`;

export const parentScreeningGetPreAssessInstruction = gql`
  mutation getScreeningFiles($student: ID!, $language: String!) {
    getScreeningFiles(input: {student: $student, language: $language}) {
      video
      audio
      transcript
    }
  }
`;

export const parentScreeningSubmitVideos = gql`
  mutation UploadVideo($id: ID!, $videoUrl: String!) {
    preliminaryVideo(input: {assessment: $id, videoUrl: $videoUrl}) {
      assVideo {
        id
        video
      }
    }
  }
`;

export const parentScreeningGetAssessArea = gql`
  query {
    preAssessAreas {
      id
      name
      description
    }
  }
`;

export const getScreeningResult = gql`
  mutation preliminaryAssessmentFinalResponse($pk: ID!) {
    preliminaryAssessmentFinalResponse(input: {pk: $pk}) {
      result
    }
  }
`;

export const parentScreeningRecordAssessResult = gql`
  mutation Record($pk: ID!, $score: Int!, $area: ID!, $response: String!) {
    recordPreAssessResult(
      input: {
        pk: $pk
        score: $score
        areas: [{area: $area, response: $response}]
      }
    ) {
      details {
        id
        name
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

export const getFAQ = gql`
  query {
    frequentlyAskedQuestions {
      id
      question
      answer
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

export const updateSessionReminder = gql`
  mutation changeSessionReminder($userId: ID!, $status: Boolean!) {
    changeUserSetting(input: {user: $userId, sessionReminders: $status}) {
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
export const updateStudentProfile = gql`
  mutation UpdateStudent(
    $studentId: ID!
    $language: ID!
    $phone: String!
    $email: String!
  ) {
    updateStudent(
      input: {
        studentData: {
          id: $studentId
          language: $language
          parentMobile: $phone
          email: $email
        }
      }
    ) {
      student {
        id
        firstname
        email
        mobileno
        language {
          id
          name
        }
      }
    }
  }
`;
export const startCogniableAssessmentQuery = gql`
  mutation startCogniableAssessment($studentId: ID!) {
    startCogniableAssess(input: {student: $studentId}) {
      details {
        id
        date
        score
        student {
          id
          firstname
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

export const getCommunityHomeData = gql`
  query {
    communityGroups {
      id
      name
      description
      user {
        edges {
          node {
            id
            username
          }
        }
      }
    }
    communityBlogs(last: 10) {
      edges {
        node {
          id
          title
          time
          description
          category {
            id
            name
          }
          likes {
            count
            edges {
              node {
                id
                time
                user {
                  id
                  username
                }
              }
            }
          }
          comments {
            count
            edges {
              node {
                id
                time
                comment
                user {
                  id
                  username
                  name
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getPopularGroupsData = gql`
  query {
    communityGroups {
      id
      name
      description
      user {
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
export const getBlogUpdates = gql`
  query {
    communityBlogs(last: 20) {
      edges {
        node {
          id
          title
          time
          description
          category {
            id
            name
          }
          likes {
            count
            edges {
              node {
                id
                time
                user {
                  id
                  username
                }
              }
            }
          }
          comments {
            count
            edges {
              node {
                id
                time
                comment
                user {
                  id
                  username
                  name
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const completeSessionProcess = gql`
  mutation ChangeSessionStatus($pk: ID!, $duration: Int!) {
    changeSessionStatus(
      input: {pk: $pk, duration: $duration, status: "completed"}
    ) {
      details {
        id
        sessionDate
        status
        duration
        sessions {
          id
        }
      }
    }
  }
`;

export const getAssessmentDetails = gql`
  query GetCogniableAssessDetail($id: ID!) {
    getCogniableAssessDetail(id: $id) {
      id
      date
      score
      status
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

export const getCogniFirstQuestion = gql`
  mutation GetCogQuestion($studentId: ID!) {
    getCogQuestion(input: {student: $studentId}) {
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
    }
  }
`;

export const getCogniNextQuestion = gql`
  mutation RecordCogQuestion($pk: ID, $question: ID!, $answer: ID!) {
    recordCogQuestion(input: {pk: $pk, question: $question, answer: $answer}) {
      status
      option {
        id
        name
      }
      nextQuestion {
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
export const getCogniNextQuestion1 = gql`
  mutation RecordCogQuestion($pk: ID, $question: ID!, $answer: ID!) {
    recordCogQuestion(input: {pk: $pk, question: $question, answer: $answer}) {
      status
      nextQuestion {
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

export const getChatUserList = gql`
  query {
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
  }
`;

export const getMessageList = gql`
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

export const mandReport = gql`
  query mandReport(
    $studentId: ID!
    $mandId: ID!
    $sdate: Date!
    $edate: Date!
  ) {
    mandReport(
      studentId: $studentId
      id: $mandId
      startDate: $sdate
      endDate: $edate
    ) {
      measurments
      data {
        x
        y
      }
    }
  }
`;

export const actHome = gql`
  query ActHomePage {
    allCourse(orderBy: ["order"]) {
      edges {
        node {
          id
          name
          description
          seen
          exerciseSet(orderBy: "order") {
            edges {
              node {
                id
                name
                order
                description
                content
                link
                maxEstimatedTime
                minEstimatedTime
                seen
              }
            }
          }
        }
      }
    }
  }
`;

export const actCourse = gql`
  query singlecourse($id: ID!, $user: ID!) {
    course(id: $id) {
      id
      description
      seen
      name
      noofdaysCreatedBefore
      exerciseSet(course: $id) {
        edges {
          node {
            id
            name
            order
            description
            seen
            exercisetype {
              id
              name
            }
            questionsSet {
              edges {
                node {
                  id
                  questiontype
                  question
                  questionresponsesSet(user: $user) {
                    edges {
                      node {
                        response
                        id
                        user {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
            userresponsesSet(user: $user) {
              edges {
                node {
                  id
                  content
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getExcerciseDetail = gql`
  query singleExercisesWithQuestions($id: ID!, $userId: ID!) {
    exercise(id: $id) {
      id
      name
      description
      content
      link
      seen
      exercisetype {
        id
        name
      }
      userresponsesSet(user: $userId) {
        edges {
          node {
            id
            content
          }
        }
      }
      questionsSet {
        edges {
          node {
            id
            questiontype
            question
            questionresponsesSet(user: $userId) {
              edges {
                node {
                  response
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const updateSeenStatus = gql`
  mutation updateseenstaus($id: ID!) {
    updateSeenusersforexercise(input: {exerciseID: $id}) {
      exercise {
        course {
          seen
        }
      }
    }
  }
`;

export const createQuestionResponse = gql`
  mutation createquestionresponse($id: ID!, $response: String!) {
    createQuestionresponse(input: {response: $response, question: $id}) {
      userResponse {
        id
        response
      }
    }
  }
`;

export const updateQuestionResponse = gql`
  mutation updatequestionresponse($id: ID!, $response: String!) {
    updateQuestionresponse(
      input: {response: $response, questionResponseID: $id}
    ) {
      questionResponse {
        id
        response
      }
    }
  }
`;

export const createUserResponse = gql`
  mutation createUserResponse($id: ID!, $response: String!) {
    createUserresponse(input: {content: $response, exercise: $id}) {
      userResponse {
        id
        content
      }
    }
  }
`;

export const updateUserResponse = gql`
  mutation updateUserResponse($id: ID!, $response: String!) {
    updateUserresponse(input: {content: $response, userResponseID: $id}) {
      userResponse {
        id
        content
      }
    }
  }
`;

export const updateAssessment = gql`
  mutation updateAssessment($id: ID!, $rating: Int!, $feedback: String!) {
    updateAssessment(input: {pk: $id, rating: $rating, feedback: $feedback}) {
      details {
        id
        rating
        feedback
      }
    }
  }
`;

export const getTask = gql`
  query {
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
  }
`;

export const recordBehaviourFrequency = gql`
  mutation recordBehaviourReductionRecording(
    $targets: ID!
    $childSession: ID!
    $status: ID!
    $totalBehRecordingDuration: Int
    $behaviourRecording: [SkillsBehaviourRecordingInput]
    $isBehRecording: Boolean!
  ) {
    recordBehaviourReductionRecording(
      input: {
        targets: $targets
        childSession: $childSession
        status: $status
        totalBehRecordingDuration: $totalBehRecordingDuration
        behaviourRecording: $behaviourRecording
        isBehRecording: $isBehRecording
        behReduction: []
        isBehReduction: false
      }
    ) {
      behaviorRecording {
        id
        frequency
        start
        end
        createdAt
        user {
          id
        }
      }
      details {
        id
        durationStart
        durationEnd
        targets {
          id
        }
        isBehReduction
        totalBehRecordingDuration
        isBehRecording
      }
    }
  }
`;


export const getCombinationCode = gql `
  query getCombinationCode($code: String) {
    getPeakEquCodes(code: $code) {
      edges {
        node {
          id
          code
          train {
            edges {
              node{
                id
                stimulus1
                sign12
                stimulus2
                sign23
                stimulus3
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
                sign23
                stimulus3
              }
            }
          }
        }
      }
    }
  }
`