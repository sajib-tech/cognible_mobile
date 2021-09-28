import {
  CHANGE_LANGUAGE,
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNOUT,
  LANGUAGE_CHANGE,
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
} from '../constants/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from '../actions/celeration-chart/action-types/panel.action-type';
import iiscaActions from '../sagas/iisca/iisca.actions'

const initialState = {
  count: 0,
  lang: 'english',
  authResult: false,
  authToken: '',
  authTokenPayload: {},
  user: {},
  userType: '',
  studentId: '',
  loggedInUser: '',
  lastLoginDate: '',
  familyMembersList: [],
  leaveRequestList: null,
  worklogList: null,
  calendarHome: null,
  studentHome: null,
  longTermsGoals: null,
  assessmentsList: null,
  shortTermsGoals: null,
  medicalData: null,
  profile: null,
  autismScreening: null,
  behaviourDecelToilet: null,
  assessmentData: null,
  parentProfile: null,
  timezone: 'Asia/Kolkata',
  peakPrograms: null,
  celerationChartState: {
    studentId: '',
    celerationCategories: [],

    celerationCharts: [
      {
        date: '',
        title: '',
        category: {id: '', name: ''},
        notes: '',
        points: [],
        pointsTypeLables: {
          type1: 'Correct',
          type2: 'Incorrect',
          type3: 'Prompted',
        },
      },
    ],

    loading: false,
    error: null,
    drawer: false,
    behaviorTypesSelected: [],
    celerationChartIndex: -1,
    celerationChart: {
      date: '',
      title: '',
      category: {name: ''},
      notes: '',
      points: [],
      yAxisLabel: 'COUNT PER MINUTE',
      pointsTypeLables: {
        type1: 'Correct',
        type2: 'Incorrect',
        type3: 'Prompted',
      },
    },
  },
  iisca: {
    loading: true,
    Questionaire: [],
    Question1: [],
    Question2: [],
    Question1Answer: [],
    SelectedUser: {},
    Situation: [],
    Behavior: [],
  }
};

function rootReducer(state = initialState, action) {
  let updatedCelerationCharts = [];
  // console.log('reducer state', state);
  // console.log('reducer state and data', JSON.stringify(action.payload));
  // console.log('reducer state and data', state, JSON.stringify(action));
  switch (action.type) {
    //Celeration
    case actions.fetchAllCelerationCategoriesBegin:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          loading: true,
          error: null,
        },
      };
    case actions.fetchAllCelerationCategoriesSuccess:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationCategories: action.celerationCategories
            ? action.celerationCategories
            : [],
          loading: false,
          error: null,
        },
      };
    case actions.fetchAllCelerationCategoriesFailure:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationCategories: [],
          loading: false,
          error: action.error,
        },
      };
    case actions.openAddDrawer:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          drawer: true,
          celerationChart: {
            date: '',
            title: '',
            category: {name: ''},
            notes: '',
            points: [],
            pointsTypeLables: {
              type1: 'Correct',
              type2: 'Incorrect',
              type3: 'Prompted',
            },
            student: {id: action.studentId},
          },
          celerationChartIndex: -1,
        },
      };
    case actions.fetchAllCelerationChartBegin:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          loading: true,
          error: null,
        },
      };
    case actions.fetchAllCelerationChartSuccess:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationCharts: action.celerationCharts
            ? action.celerationCharts
            : [],
          loading: false,
          error: null,
        },
      };
    case actions.fetchAllCelerationChartFailure:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationCharts: [],
          loading: false,
          error: action.error,
        },
      };
    case actions.onCelerationChartChange:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationChart: {
            ...state.celerationChartState.celerationChart,
            [action.key]: action.value,
          },
        },
      };
    case actions.onAddCelerationChart:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          drawer: true,
          celerationCharts: [
            ...state.celerationChartState.celerationCharts,
            {
              ...action.chart,
              yAxisLabel: 'COUNT PER MINUTE',
              points: [],
              pointsTypeLables: {
                type1: 'Correct',
                type2: 'Incorrect',
                type3: 'Prompted',
              },
            },
          ],
        },
      };
    case actions.resetCelerationChart:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          drawer: false,
          celerationChartIndex: -1,
          celerationChart: {
            date: '',
            title: '',
            category: {name: ''},
            notes: '',
            points: [],
            pointsTypeLables: {
              type1: '',
              type2: '',
              type3: '',
            },
          },
        },
      };
    case actions.onSelectCelerationChart:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          drawer: true,
          celerationChartIndex: state.celerationChartState.celerationCharts.indexOf(
            action.chart,
          ),
          celerationChart: action.chart,
        },
      };
    case actions.onDisplaySelectedChart: {
      const selectedDisplayChart = state.celerationChartState.celerationCharts.find(
        (chart) => chart.id === action.chart.id,
      );
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          drawer: false,
          celerationChartIndex: selectedDisplayChart
            ? state.celerationChartState.celerationCharts.indexOf(
                selectedDisplayChart,
              )
            : -1,
          celerationChart: {...action.chart, points: action.nodes},
        },
      };
    }
    case actions.onUpdateCelerationChart:
      updatedCelerationCharts = state.celerationChartState.celerationCharts.map(
        (chart, index) => {
          if (index !== state.celerationChartState.celerationChartIndex) {
            return chart;
          }
          return {
            ...action.chart,
          };
        },
      );
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationCharts: updatedCelerationCharts,
          celerationChartIndex: -1,
        },
      };
    case actions.addPoint:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationChart: {
            ...state.celerationChartState.celerationChart,
            points: [
              ...state.celerationChartState.celerationChart.points,
              action.point,
            ],
          },
        },
      };
    case actions.updatePoint:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          celerationChart: {
            ...state.celerationChartState.celerationChart,
            points: [
              ...state.celerationChartState.celerationChart.points.slice(
                0,
                action.pointIndex,
              ),
              action.newPoint,
              ...state.celerationChartState.celerationChart.points.slice(
                action.pointIndex + 1,
              ),
            ],
          },
        },
      };

    case actions.onBehaviorTypesChange:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          behaviorTypesSelected: action.behaviors,
        },
      };

    case actions.setStudentId:
      return {
        ...state,
        celerationChartState: {
          ...state.celerationChartState,
          studentId: action.studentId,
        },
      };

    // Original
    case INCREMENT:
      return {
        count: state.count + 1,
      };
    case DECREMENT:
      return {
        count: state.count - 1,
      };

    case CHANGE_LANGUAGE:
      return {...state, lang: action.payload};
    case SIGNIN_SUCCESS:
      console.log('=================');
      console.log('rootReducer: ' + action.payload);
      console.log('=================');
      return {...state, authResult: true, authToken: action.payload};
    case SIGNIN:
      let userData = action.payload.tokenAuth.user;

      console.log('USER DATA===', action.payload);

      let activeUser = null;
      let student = null;
      let staffSet = null;
      if (userData.groups && userData.groups.edges.length > 0) {
        activeUser = userData.groups.edges[0].node;
      }
      if (userData.studentsSet && userData.studentsSet.edges.length > 0) {
        student = userData.studentsSet.edges[0].node;
      }
      if (userData.staffSet && userData.staffSet.edges.length > 0) {
        staffSet = userData.staffSet.edges[0].node;
      }

      console.log(activeUser);
      return {
        ...state,
        authResult: true,
        lastLoginDate: action.payload.lastLoginDate,
        authToken: action.payload.tokenAuth.token,
        authTokenPayload: action.payload.tokenAuth.payload,
        user: {
          id: action.payload.tokenAuth.user.id,
          staffSet: staffSet,
          userType: activeUser,
          student: student,
        },
        userType: activeUser.name,
        getPin: true,
        studentId: student != null ? student.id : '',
      };

    case SIGNOUT:
      AsyncStorage.clear();
      return {
        ...state,
        authResult: false,
        authToken: '',
        user: {},
        userType: '',
        studentId: '',
      };
    case LANGUAGE_CHANGE:
      return {
        ...state,
        authResult: true,
        authToken: '',
        user: {},
        userType: '',
        studentId: '',
        setPin: true,
        getPin: false,
      };
    case SETPIN:
      let authResult = action.payload.authResult;
      let setPin = action.payload.setPin;
      let getPin = action.payload.getPin;
      console.log('setPin', 1234);
      return {
        ...state,
        authResult: authResult,
        setPin: setPin,
        getPin: getPin,
      };
    case GETPIN:
      console.log('user 123==', action.payload);
      let user = action.payload.userData.tokenAuth.user;

      let active = null;
      let studentUser = null;
      let staff = null;
      if (user.groups && user.groups.edges.length > 0) {
        active = user.groups.edges[0].node;
      }
      if (user.studentsSet && user.studentsSet.edges.length > 0) {
        studentUser = user.studentsSet.edges[0].node;
      }
      if (user.staffSet && user.staffSet.edges.length > 0) {
        staff = user.staffSet.edges[0].node;
      }

      console.log('getpin', action.payload.userData.tokenAuth.token);
      return {
        ...state,
        authToken: action.payload.userData.tokenAuth.token,
        user: {
          id: action.payload.userData.tokenAuth.user.id,
          staffSet: staff,
          userType: active,
          student: studentUser,
        },
        authResult: true,
        getPin: true,
        userType: active.name,
        studentId: studentUser != null ? studentUser.id : '',
      };
    case SET_TOKEN:
      console.log('SET_TOKEN', action);
      if (action.payload == null) {
        return {
          ...state,
          authResult: false,
        };
      } else {
        return {
          ...state,
          authToken: action.payload.data.refreshToken.token,
          authTokenPayload: action.payload.data.refreshToken.payload,
        };
      }
    case SET_TOKEN_PAYLOAD:
      // console.log("SET_TOKEN_PAYLOAD: "+JSON.stringify(action.payload.verifyToken.payload));
      return {
        ...state,
        authTokenPayload: action.payload.verifyToken.payload,
      };
    case ADD_FAMILY_MEMBER:
      return {
        ...state,
        familyMembersList: [...state.familyMembersList, action.payload],
      };
    case SET_LEAVE_REQUEST_LIST:
      return {...state, leaveRequestList: action.payload};
    case SET_WORKLOG_LIST:
      return {...state, worklogList: action.payload};
    case SET_CALENDAR_HOME:
      return {...state, calendarHome: action.payload};
    case SET_STUDENT_HOME:
      return {...state, studentHome: action.payload};
    case SET_LONG_TERM_GOALS:
      return {...state, longTermsGoals: action.payload};
    case SET_SHORT_TERM_GOALS:
      return {...state, shortTermsGoals: action.payload};
    case SET_MEDICAL_DATA:
      return {...state, medicalData: action.payload};
    case SET_PROFILE:
      return {...state, profile: action.payload};
    case SET_AUTISM_SCREENING:
      return {...state, autismScreening: action.payload};
    case SET_BEHAVIOUR_DECEL_TOILET:
      return {...state, behaviourDecelToilet: action.payload};
    case SET_ASSESSMENT_DATA:
      return {...state, assessmentData: action.payload};
    case SET_PARENT_PROFILE:
      return {...state, parentProfile: action.payload};
    case SET_TIMEZONE:
      return {...state, timezone: action.payload};
    case SET_PEAK_PROGRAMS:
      return {...state, peakPrograms: action.payload};
    case SET_VBMAPPS_ASSESSMENTS:
      return {...state, assessmentsList: action.payload};
    case SET_VBMAPPS_AREA:
        return {...state, areasList: action.payload};

      // iisca reducers

    case iiscaActions.SET_STATE: 
      return {
        ...state,
        iisca: {...state.iisca, ...action.payload}
      }

    default:
      return state;
  }
  console.log('return state: ', state);
  return state;
}

export default rootReducer;

export const getLanguage = (state) => state.lang;
export const getAuthResult = (state) => state.authResult;
export const getPin = (state) => state.getPin;
export const getUserInfo = (state) => state.user;
export const getUserType = (state) => state.userType;
export const getStudentId = (state) => state.studentId;
export const getAuthToken = (state) => state.authToken;
export const getAuthTokenPayload = (state) => state.authTokenPayload;
export const getFamilyMembersList = (state) => state.familyMembersList;
