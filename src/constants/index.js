import {ApolloClient, HttpLink, ApolloLink, InMemoryCache} from 'apollo-boost';
import {client as cl} from './ApolloClient';
import gql from 'graphql-tag';
import store from '../redux/store/index';

const developmentUrl = 'https://development.cogniable.us/apis/graphql';
const productionUrl = 'https://application.cogniable.us/apis/graphql';

export const client = cl;

export const cogniableParentLogin = gql`
  mutation TokenAuth($user: String!, $password: String!) {
    tokenAuth(input: {username: $user, password: $password}) {
      token
      payload
      refreshExpiresIn
      user {
        id
        firstName
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
              dob
              language {
                id
                name
              }
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
export const createDecelRecord = gql`
  mutation CreateDecelRecord($templateId: ID!) {
    createDecel(input: {template: $templateId}) {
      details {
        id
        date
        template {
          id
          behaviorDef
          behaviorDescription
        }
      }
    }
  }
`;

export const updateDecelRecord = gql`
  mutation UpdateDecelRecord(
    $pk: ID!
    $environment: ID!
    $irt: Int!
    $intensity: String!
    $note: String!
    $duration: String!
  ) {
    updateDecel(
      input: {
        pk: $pk
        environment: $environment
        irt: $irt
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
        irt
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
          note: "Test Note"
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

export const getSeverityTypes = gql`
  query {
    getSeverity {
      id
      name
    }
  }
`;

export const createMedical = gql`
  mutation CreateMedical(
    $studentId: ID!
    $date: Date!
    $condition: String!
    $startDate: Date!
    $endDate: Date!
    $severity: ID!
    $medicineDetails: String!
    $dosage: String!
    $howOftenTaken: Int!
    $note: String!
    $reminderTime: String!
    $frequency: String!
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
        lastObservedDate: $startDate
        severity: $severity
        drug: [
          {drugName: $medicineDetails, dosage: $dosage, times: $howOftenTaken}
        ]
        remainders: [{time: $reminderTime, frequency: $frequency}]
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
              frequency
            }
          }
        }
      }
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
                frequency
              }
            }
          }
        }
      }
    }
  }
`;
export const getStudentSessions = gql`
  query GetStudentSession($studentId: ID!) {
    GetStudentSession(studentId: $studentId) {
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
export const getStudentSummary = gql`
  query GetStudentSummary($studentId: ID!) {
    masterTargetGraph(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZTo0"
      dateGte: "2020-07-01"
    ) {
      date
      tarCount
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

export const createSessionRecord = gql`
  mutation SessionRecording(
    $targetId: ID!
    $childSessionId: ID!
    $targetStatus: ID!
    $trial: String!
  ) {
    sessionRecording(
      input: {
        targets: $targetId
        childsession: $childSessionId
        durationStart: 123456
        durationEnd: 123456
        status: $targetStatus
        sessionRecord: [
          {
            trial: $trial
            durationStart: 12345
            durationEnd: 12345
            prompt: ""
            sd: ""
            step: ""
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

export const getSessionSummaryByStudent = gql`
  query($studentId: ID!, $startDate: Date!, $endDate: Date!) {
    sessionSummary(
      studentId: $studentId
      dateGte: $startDate
      dateLte: $endDate
    ) {
      id
      sessions {
        id
        sessionName {
          id
          name
        }
      }
      sessionDate
      duration
      correctCount
      errorCount
      promptCount
      peakCorrect
      peakError
      peakPrompt
    }
  }
`;

export const getSessionSummary = gql`
  query sessionSummary($childSeesionId: ID!) {
    summary: getSessionDataRecording(ChildSession: $childSeesionId) {
      totalTarget
      mandCount
      behCount
      toiletData {
        id
        date
        time
        bowel
        urination
        prompted
      }
      edges {
        node {
          id
          targets {
            id
            targetAllcatedDetails {
              id
              DailyTrials
              targetType {
                id
                typeTar
              }
            }
          }
          sessionRecord {
            totalTrial

            totalCorrect
            totalIncorrect
            totalNr
            totalError

            totalPrompt
            physical
            verbal
            gestural
            textual
          }
          peak {
            totalCorrect
            totalError
            totalPrompt
          }
        }
      }
    }
    childSessionDetails(id: $childSeesionId) {
      id
      feedback
      rating
    }
  }
`;

export const getTodaySessionsSummary = gql`
  query GetTodaySessionsSummary($ChildSession: ID!, $date: Date!) {
    summary: getSessionRecordings(ChildSession: $ChildSession, date: $date) {
      totalTarget
      mandCount
      behCount
      edges {
        node {
          sessionRecord {
            totalTrial
            totalCorrect
            totalError
            totalPrompt
            totalNr
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
            totalNr
          }
        }
      }
    }
  }
`;

export const getWeekSessionsSummary = gql`
  query getSessionRecordings(
    $ChildSession: ID!
    $fromDate: Date!
    $toDate: Date!
  ) {
    summary: getSessionRecordings(
      ChildSession: $ChildSession
      date_Gte: $fromDate
      date_Lte: $toDate
    ) {
      totalTarget
      mandCount
      behCount
      edges {
        node {
          id
          sessionRecord {
            totalTrial
            totalCorrect
            totalError
            totalPrompt
            totalNr
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
  mutation RecordMand($data: Int, $date: Date, $dailyClick: ID) {
    recordMand(
      input: {dailyData: {dailyClick: $dailyClick, date: $date, data: $data}}
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
          behaviorDescription
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
  ) {
    recordToiletdata(
      input: {
        toiletData: {
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
      }
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
  ) {
    recordAbcdata(
      input: {
        abcData: {
          studentId: $studentId
          date: "2020-04-12"
          target: 100
          frequency: $frequency
          time: "02:16 PM"
          Intensiy: $intensity
          response: $response
          Duration: "10:05"
          Notes: "Test Notes"
          behaviors: $behaviors
          consequences: $consequences
          antecedents: $antecedents
          locations: ["QmVoYXZpb3JMb2NhdGlvblR5cGU6NjI="]
        }
      }
    ) {
      details {
        id
        date
        target
        frequency
        time
        Intensiy
        response
        Duration
        Notes
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
export const createEnvironment = gql`
  mutation CreateEnvironment(
    $studentId: ID!
    $name: String!
    $description: String!
  ) {
    decelEnvironment(
      input: {studentId: $studentId, name: $name, description: $description}
    ) {
      environment {
        id
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

export const createNewTemplate = gql`
  mutation createNewTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $statusId: ID!
    $behaviordef: String!
    $behaviordes: String!
    $measurements: [ID!]
    $environments: [ID!]
  ) {
    createTemplate(
      input: {
        decelData: {
          student: $studentId
          behavior: $behaviorId
          status: $statusId
          behaviorDef: $behaviordef
          behaviorDescription: $behaviordes
          measurments: $measurements
          environment: $environments
        }
      }
    ) {
      details {
        id
        behaviorDef
        behaviorDescription
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
  }
`;
export const getTherapyProgramsQuery = gql`
  query TherapyPrograms($studentId: ID!) {
    student(id: $studentId) {
      id
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
export const getSessions = gql`
  {
    sessionName {
      id
      name
    }
  }
`;
export const getPreferredCategories = gql`
  query {
    preferredItemsCategory {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const getPreferredCategories1 = gql`
  query PreferredItemsCategory($studentId: ID!) {
    preferredItemsCategory(student: $studentId) {
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

export const createPrefItem = gql`
  mutation CreatePreferredItems(
    $studentId: ID!
    $programAreaId: ID!
    $categoryId: ID!
    $itemName: String!
    $description: String!
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
export const getShortTermGoalById = gql`
  query shortTerm($longTerm: ID!) {
    shortTerm(longTerm: $longTerm) {
      edges {
        node {
          id
          goalName
          description
          dateInitialted
          dateEnd
          isActive
          targetAllocateSet {
            edges {
              node {
                id
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
  query targetAllocates($studentId: ID!, $date: Date, $endDate: Date) {
    targetAllocates(
      studentId: $studentId
      date_Gte: $endDate
      date_Lte: $date
    ) {
      edgeCount
      masteredCount
      interventionCount
    }
  }
`;

export const startSession = gql`
  mutation StartSession(
    $parentSessionId: ID!
    $status: String!
    $duration: Int!
    $date: Date
  ) {
    startSession(
      input: {
        parentSession: $parentSessionId
        status: $status
        duration: $duration
        date: $date
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
export const getChildSession = gql`
  query getChildSession($sessionId: ID!) {
    childSessionGet(sessions: $sessionId) {
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
export const getTargetIdSessionRecordings = gql`
  query GetSessionRecordings($childSessionId: ID!, $targetId: ID!) {
    getSessionRecordings(ChildSession: $childSessionId, targets: $targetId) {
      edges {
        node {
          id
          durationStart
          durationEnd
          targets {
            id
          }
          status {
            id
            statusName
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

export const updateSessionRecord = gql`
  mutation UpdateTrial($trialId: ID!, $trial: String!) {
    updateTrial(
      input: {
        pk: $trialId
        durationStart: 1234567890
        durationEnd: 1234567890
        trial: $trial
        sd: ""
        step: ""
        promptCode: ""
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
        promptCode {
          id
          promptName
        }
      }
    }
  }
`;

export const getUserProfile = gql`
  query GetUserProfile($studentId: ID!) {
    student(id: $studentId) {
      id
      firstname
      lastname
      email
      parentMobile
      parent {
        id
        username
        lastLogin
      }
    }
  }
`;
export const getUserProfileSettings = gql`
  query GetUserSettings($studentId: ID!) {
    userSettings(user: $studentId) {
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

export const GetVimeoProjects = gql`
  {
    VimeoProject {
      edges {
        node {
          id
          name
          url
          projectId
          description
        }
      }
    }
    getClinicLibrary(clinic: "U2Nob29sVHlwZTo1MDI=") {
      edges {
        node {
          id
          name
          description
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
            edgeCount
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

export const getAppointments = gql`
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

export const getDoctorsListQuery = gql`
  query {
    getDoctors {
      edges {
        node {
          id
          name
          qualification
          location
          association
          practicingArea
        }
      }
    }
  }
`;

export const registerData = gql`
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

export const parentSignUp = gql`
  mutation registerParent(
    $firstname: String!
    $lastname: String!
    $email: String!
    $dob: Date!
    $level: String
    $language: ID!
    $password: String!
  ) {
    parentSignUp(
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        dob: $dob
        level: $level
        language: $language
        password: $password
        defaultProgram: false
      }
    ) {
      details {
        id
        firstname
        lastname
        email
        dob
        isDefaultProgram
        language {
          id
          name
        }
      }
    }
  }
`;

export const clinicSignUp = gql`
  mutation registerClinic(
    $name: String!
    $email: String!
    $country: String
    $password: String!
    $no: Int!
  ) {
    signUp(
      input: {
        data: {
          name: $name
          email: $email
          country: $country
          password: $password
          noLearner: $no
        }
      }
    ) {
      school {
        id
        schoolName
        email
        noLearner
        user {
          id
          username
        }
      }
    }
  }
`;

export const getCountryList = gql`
  query {
    country {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
