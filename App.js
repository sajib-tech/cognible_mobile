import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Image,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {ApolloProvider} from '@apollo/react-hooks';
import {client} from './src/constants/ApolloClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WS from 'react-native-websocket';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import PeakTabView from './src/pages/Common/Peak_equivalanace/PeaktabView';
import PeakScrollTabView from './src/pages/Common/Peak_equivalanace/PeakScrolltabView';
import Button from './src/components/Button';

import AppIntroSlider from 'react-native-app-intro-slider';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//import {createAppContainer} from 'react-navigation';

import SplashScreen from './src/pages/SplashScreen';
import TempScreen from './src/pages/TempScreen';
import OTPVerifyScreen from './src/pages/OTPVerifyScreen';
import SelectLangScreen from './src/pages/SelectLangScreen';
import SigninScreen from './src/pages/SigninScreen';
import SigninScreen2 from './src/pages/SigninScreen2';
import ForgetPassword from './src/pages/ForgetPassword';
import Counter from './src/pages/Counter';
import SignupMobileScreen from './src/pages/SignupMobileScreen';
import SignupEmailScreen from './src/pages/SignupEmailScreen';
import HomeScreen from './src/pages/HomeScreen';
import Home from './src/pages/Home';
import SessionBehaviorScreen from './src/pages/therapy/SessionBehaviorScreen';
import SessionTargetScreen from './src/pages/therapy/SessionTargetScreen';
import AttachmentScreen from './src/pages/therapy/AttachmentScreen'
import SessionTargetOverlay from './src/pages/therapy/SessionTargetOverlay';
import SessionTargetCorrectScreen from './src/pages/therapy/SessionTargetCorrectScreen';
import SessionTargetListScreen from './src/pages/therapy/SessionTargetListScreen';
import SessionPreviewScreen from './src/pages/therapy/SessionPreviewScreen';
import AssessmentInstructions from './src/pages/therapy/AssessmentInstructions';
import CogniableAssessment from './src/pages/therapy/CogniableAssessment';
import CogniableAssessment2 from './src/pages/therapy/CogniableAssessment2';
import AbcDataScreen from './src/pages/therapy/AbcDataScreen';
import ChangePassword from './src/pages/ChangePassword';

import DiscriminativeStimulus from './src/pages/therapy/DiscriminativeStimulus';

import TherapyAssessmentScreen from './src/pages/therapy/TherapyAssessmentScreen';
import PreferredItemsScreen from './src/pages/therapy/PreferredItemsScreen';
import PreferredItemNew from './src/pages/therapy/PreferredItemNew';
import TherapyRoadMap from './src/pages/therapy/TherapyRoadMap';
import VimeoProjectsList from './src/pages/therapy/VimeoProjectsList';
import CreateBlog from './src/pages/Clinic/createblog';
import AddBlog from './src/pages/Clinic/addBlog';
import Group from './src/pages/Clinic/group';

import ActHome from './src/pages/Parent/ACT/ActHome';
import ActCourse from './src/pages/Parent/ACT/ActCourse';
import ActExcercise from './src/pages/Parent/ACT/ActExcercise';

import VimeoProjectVideos from './src/pages/therapy/VimeoProjectVideos';
import TherapyProgramScreen from './src/pages/therapy/TherapyProgramScreen';
import SessionFeedbackScreen from './src/pages/therapy/SessionFeedbackScreen';
import BehaviourDecelDataScreen from './src/pages/therapy/BehaviourDecelDataScreen';
import BehaviourDecelTemplateScreen from './src/pages/therapy/BehaviourDecelTemplateScreen';
import BehaviourNewTemplateScreen from './src/pages/therapy/BehaviourNewTemplateScreen';
import BehaviorRecordingOption from './src/pages/therapy/BehaviorRecordingOption';

import BehaviourDecelMealScreen from './src/pages/therapy/BehaviourDecelMealScreen';
import BehaviourDecelMedicalScreen from './src/pages/therapy/BehaviourDecelMedicalScreen';
import BehaviourDecelToiletScreen from './src/pages/therapy/BehaviourDecelToiletScreen';
import NewToiletDataScreen from './src/pages/therapy/NewToiletDataScreen';
import BehaviourDecelMandScreen from './src/pages/therapy/BehaviourDecelMandScreen';
import AddNewMeal from './src/pages/therapy/AddNewMeal';
import AddNewMedication from './src/pages/therapy/AddNewMedication';
import SetPinScreen from './src/pages/SetPin';
//import WebViewVideo from './src/components/WebViewVideo';
import VideoPlayer from './src/components/VideoPlayer';
import BehaviorFRScreen from './src/components/BehaviorFRScreen';
import BehaviorFRRecords from './src/components/BehaviorFRRecords';
import BehaviorDRRecords from './src/components/BehaviorDRRecords';
import BehaviorLRRecords from './src/components/BehaviorLRRecords';
import BehaviorPIRecords from './src/components/BehaviorPIRecords';
import BehaviorWIRecords from './src/components/BehaviorWIRecords';
import BehaviorMTRecords from './src/components/BehaviorMTRecords';






import BehaviorDRScreen from './src/components/BehaviorDRScreen';
import BehaviorLRScreen from './src/components/BehaviorLRScreen';
import BehaviorPIScreen from './src/components/BehaviorPIScreen';
import BehaviorWIScreen from './src/components/BehaviorWIScreen';
import BehaviorMTScreen from './src/components/BehaviorMTScreen';

import NotificationScreen from './src/pages/NotificationScreen';
import SessionSummaryScreen from './src/pages/therapy/SessionSummaryScreen';
import PreviousSessionTarget from './src/pages/Therapist/Students/PreviousSessionTarget';
import VerifiedDoctorsScreen from './src/pages/therapy/VerifiedDoctorsScreen';
import QuestionInputText from './src/pages/screening/QuestionInputText';
import QuestionSelectOption2 from './src/pages/screening/QuestionSelectOption2';
import QuestionSelectOption2Selected from './src/pages/screening/QuestionSelectOption2Selected';
import QuestionSelectOption4 from './src/pages/screening/QuestionSelectOption4';
import QuestionSelectOption4Submitted from './src/pages/screening/QuestionSelectOption4Submitted';
import VideoInput from './src/pages/screening/VideoInput';
import VideoInputUploading from './src/pages/screening/VideoInputUploading';
import VideoInputUploadingCompleted from './src/pages/screening/VideoInputUploadingCompleted';
import AnalyzingVideo from './src/pages/screening/AnalyzingVideo';
import AnalyzingAssessment from './src/pages/screening/AnalyzingAssessment';
import PendingResults1 from './src/pages/screening/PendingResults1';
import PendingResults2 from './src/pages/screening/PendingResults2';
import TherapyHome from './src/pages/therapy/TherapyHome';
import TutorialsList from './src/pages/therapy/TutorialsList';
import AssessmentResults from './src/pages/therapy/AssessmentResults';
import UserProgram from './src/pages/therapy/UserProgram';
import HomeScreening from './src/pages/therapy/HomeScreening';
import NewFamilyMemberScreen from './src/pages/Parent/Profile/NewFamilyMemberScreen';
import FamilyMemberDetailScreen from './src/pages/Parent/Profile/FamilyMemberDetailScreen';
import CareAdvisorScreen from './src/pages/therapy/CareAdvisorScreen';
import SupportTicket from './src/pages/Common/Support_Ticket/SupportTicket';
import AddSupportTicket from './src/pages/Common/Support_Ticket/AddSupportTicket';
import SupportTicketStack from './src/pages/Common/Support_Ticket/SupportTicketStack';
import ViewSupportTicket from './src/pages/Common/Support_Ticket/ViewSupportTicket';
import EditSupportTicket from './src/pages/Common/Support_Ticket/EditSupportTicket';
import CalendarScreen from './src/pages/Calendar/CalendarScreen';
import LongTermGoalsScreen from './src/pages/therapy/LongTermGoalsScreen';
import ShortTermGoalsScreen from './src/pages/therapy/ShortTermGoalsScreen';
import SlideUpScreen from './src/pages/SlideUpScreen';
import SaveMeal from './src/pages/therapy/SaveMeal';
import SaveMedical from './src/pages/therapy/SaveMedical';
import Profile from './src/pages/Parent/Profile/ParentProfile';
import ParentTaskList from './src/pages/Parent/Profile/ParentTaskList';
import ParentTaskNew from './src/pages/Parent/Profile/ParentTaskNew';
import BookParentAppointmentStack from './src/pages/Parent/Appointment/BookParentAppointmentStack'
import GetPin from './src/pages/GetPin';
import LongTermShortTemGoalScreen from './src/pages/therapy/LongTermShortTemGoalScreen';
import AlreadyTargetAllocate from './src/pages/Therapist/Students/AlreadyTargetAllocate';
import equiquestion from './src/pages/Common/Peak/EquiQuestion';
import EquivalanceTarget from './src/pages/Common/Peak_equivalanace/EquivalanceTarget';

import {
  getLanguage,
  getAuthResult,
  getUserType,
  getStudentId,
  getPin,
} from './src/redux/reducers';

// Therapist Module pages- Start
import TodayHome from './src/pages/Therapist/Today/TodayHome';
import StudentsHome from './src/pages/Therapist/Students/StudentsHome';
import CalendarHome from './src/pages/Therapist/Calendar/CalendarHome';
import MessagesHomeTherapist from './src/pages/Therapist/Messages/MessagesHome';
import MessagesHomeClinic from './src/pages/Clinic/Messages/MessagesHome';
import MessagesHomeParent from './src/pages/Parent/Messages/MessagesHome';
import MessageDetailTherapist from './src/pages/Therapist/Messages/MessageDetail';
import MessageDetailClinic from './src/pages/Clinic/Messages/MessageDetail';
import MessageDetailParent from './src/pages/Parent/Messages/MessageDetail';
import ProfileTherapist from './src/pages/Therapist/Profile/Profile';

import WorkLogList from './src/pages/Therapist/Today/WorkLogList';
import WorkLogNew from './src/pages/Therapist/Today/WorkLogNew';
import StudentDetail from './src/pages/Therapist/Students/StudentDetail';
import StudentProgressOverview from './src/pages/Therapist/Students/StudentProgressOverview';
import StudentDailyResponseRate from './src/pages/Therapist/Students/StudentDailyResponseRate';
import StudentMenuDetail from './src/pages/Therapist/Students/StudentMenuDetail';
import PreviousSession from './src/pages/Therapist/Students/PreviousSession';
import LongTermGoals from './src/pages/Therapist/Students/LongTermGoals';
import LongTermGoalNew from './src/pages/Therapist/Students/LongTermGoalNew';
import ShortTermGoals from './src/pages/Therapist/Students/ShortTermGoals';
import ShortTermGoalNew from './src/pages/Therapist/Students/ShortTermGoalNew';
import TargetAllocate from './src/pages/Therapist/Students/TargetAllocate';
import TargetAllocateNew from './src/pages/Therapist/Students/TargetAllocateNew';
import TargetAllocateNewAssess from './src/pages/Therapist/Students/TargetAllocateNewAssess';
import AppointmentNew from './src/pages/Therapist/Calendar/AppointmentNew';
import LeaveRequestNew from './src/pages/Therapist/Today/LeaveRequestNew';
import LeaveRequestList from './src/pages/Therapist/Today/LeaveRequestList';
import StudentNew from './src/pages/Therapist/Students/StudentNew';
import AppointmentEdit from './src/pages/Therapist/Calendar/AppointmentEdit';
import ClinicHome from './src/pages/Clinic/Home/ClinicHome';
import ClinicCalendarHome from './src/pages/Clinic/Calendar/ClinicCalendarHome';
import ClinicStudentHome from './src/pages/Clinic/Student/ClinicStudentHome';
import ClinicProfileHome from './src/pages/Clinic/Profile/ClinicProfileHome';
import ClinicStaffs from './src/pages/Clinic/Profile/ClinicStaffs';
import ClinicStaffDetail from './src/pages/Clinic/Profile/ClinicStaffDetail';
import TherapistProfile from './src/pages/Therapist/Today/TherapistProfile';
import ScreeningHome from './src/pages/Parent/AutismScreening/ScreeningHome';
import ClinicTaskNew from './src/pages/Clinic/Profile/ClinicTaskNew';
import ClinicTaskDetails from './src/pages/Clinic/Profile/clinictaskDetails';
import ClinicStaffNew from './src/pages/Clinic/Profile/ClinicStaffNew';
import ScreeningPreliminaryAssess from './src/pages/Parent/AutismScreening/ScreeningPreliminaryAssess';
import ScreeningAnalyzingAssess from './src/pages/Parent/AutismScreening/ScreeningAnalyzingAssess';
import ScreeningInstruction from './src/pages/Parent/AutismScreening/ScreeningInstruction';
import ScreeningVideo from './src/pages/Parent/AutismScreening/ScreeningVideo';
import ScreeningAnalyzingVideo from './src/pages/Parent/AutismScreening/ScreeningAnalyzingVideo';
import ScreeningResult from './src/pages/Parent/AutismScreening/ScreeningResult';
import Walkthrough from './Walkthrough';
import Color from './src/utility/Color';
import ScreeningResultWaiting from './src/pages/Parent/AutismScreening/ScreeningResultWaiting';
// Therapist Module pages- End

//VBMapps Module Pages - Start
import AssessmentsList from './src/pages/VBMapps/assessmentsList';
import NewAssessment from './src/pages/VBMapps/newAssessment';
import CreateNote from './src/pages/VBMapps/createNote';
import NotesList from './src/pages/VBMapps/notesList';
import GuideList from './src/pages/VBMapps/guideList';
import ChapterDetails from './src/pages/VBMapps/chapterDetails';

import AreasList from './src/pages/VBMapps/areasList';
import MilestoneGroups from './src/pages/VBMapps/milestoneGroups';
import MilestonesQuestions from './src/pages/VBMapps/milestonesQuestions';
import BarriersQuestions from './src/pages/VBMapps/barriersQuestions';
import TransitionQuestions from './src/pages/VBMapps/transitionQuestions';
import TaskQuestions from './src/pages/VBMapps/taskQuestions';
import EESAQuestions from './src/pages/VBMapps/eesaQuestions';
import IepReport from './src/pages/VBMapps/iepReport';
import VbmappSuggestedTargets from './src/pages/VBMapps/vbmappSuggestedTargets';
import VbmappToc from './src/components/vbmapps/VbmappToc'
import VbmappGuide from './src/pages/VBMapps/VbmappGuide'
import Objective from './src/pages/VBMapps/Objective';
import Example from './src/pages/VBMapps/Example';
import Material from './src/pages/VBMapps/Material';
//VBMapps Module Pages - End

//PEAK Module Pages - Start
import PeakScreen from './src/pages/Common/Peak/PeakScreen';
import PeakScoreScreen from './src/pages/Common/Peak/PeakScoreScreen';
import PeakPrograms from './src/pages/Common/Peak/PeakPrograms';
import {setTimezone, setpin} from './src/redux/actions';
import DirectAssessmentsList from './src/pages/Common/Peak/DirectAssessmentsList';
import PeakSuggestedTargets from './src/pages/Common//Peak//PeakSuggestedTargets';
import CreateProgram from './src/pages/Common/Peak/CreateProgram';
import PeakEquiQue from './src/pages/Common/Peak_equivalanace/PeakEquiQue';
import PeakEquTarResu from './src/pages/Common/Peak_equivalanace/PeakEquTarResu';
import PeakEquSuggesTarget from './src/pages/Common/Peak_equivalanace/PeakEquSuggesTarget';
import EquiResult from './src/pages/Common/Peak/EquiResult';

import ScreeningList from './src/pages/Parent/AutismScreening/ScreeningList';
//PEAK Module Pages - End

//BeghaviorAssessment pages Start
import BehaviorAssessmentsList from './src/pages/Common/behavior_Assessment/behaviorList';
import NewAssessmentBehavior from './src/pages/Common/behavior_Assessment/newBehaviorAssessment';
import QuestionsBehavior from './src/pages/Common/behavior_Assessment/questionsBehavior';
import AssessmentResultBehavior from './src/pages/Common/behavior_Assessment/assessmentBehaviorResult';
import BehaviorSuggestedTargets from './src/pages/Common/behavior_Assessment/behaviorSuggestedTargets';
import BehaviouralNewPage from './src/pages/Common/behavior_Assessment/Behav_ass_first';
import BehaviouralStartPage from './src/pages/Common/behavior_Assessment/Behav_ass_Start';
import equivalanceOption from './src/pages/Common/Peak/equivalanceScreen';
import PeakEquiTarget from './src/pages/Common/Peak_equivalanace/PeakEquiTarget';

//BeghaviorAssessment pages end

//Cogniable Assessments Pages - Start
import CogniableAssessmentsList from './src/pages/Common/Cogniable/assessmentsList';
import NewAssessmentCogniable from './src/pages/Common/Cogniable/newAssessment';
import AssessmentResultCogniable from './src/pages/Common/Cogniable/assessmentResult';
import CreateAssessmentCogniable from './src/pages/Common/Cogniable/createAssessment';
import QuestionsCogniable from './src/pages/Common/Cogniable/questions';
import CogniableSuggestedTargets from './src/pages/Common/Cogniable/cogniableSuggestedTargets';
//Cogniable Assessments Pages - End

// Charts
import ReactNativeCharts from './src/pages/ReactNativeCharts';
import BehaviourDecelDataEdit from './src/pages/therapy/BehaviourDecelDataEdit';
import AbcList from './src/pages/therapy/AbcList';
import BehaviourDecelMandGraph from './src/pages/therapy/BehaviourDecelMandGraph';
import TaskDetail from './src/pages/Therapist/Today/TaskDetail';
import TaskList from './src/pages/Therapist/Today/TaskList';
import TaskNew from './src/pages/Therapist/Today/TaskNew';
import ClinicTaskList from './src/pages/Clinic/Profile/ClinicTaskList';
import CommunityHome from './src/pages/Parent/Community/CommunityHome';
import CommunityBlogsDetail from './src/pages/Parent/Community/CommunityBlogsDetail';
import CommunityAddBlog from './src/pages/Parent/Community/CommunityAddBlog';
import CommunityAddGroup from './src/pages/Parent/Community/CommunityAddGroup';
import CommunityGroups from './src/pages/Parent/Community/CommunityGroups';
import CommunityBlogs from './src/pages/Parent/Community/CommunityBlogs';
import ManualTargetAllocationNew from './src/pages/Therapist/Students/ManualTargetAllocationNew';
import PeakTargetAllocateNewAssess from './src/pages/Common/Peak/PeakTargetAllocateNewAssess';
import PeakReport from './src/pages/Common/Peak/Report';
import EquiReport from './src/pages/Common/Peak/EquiReport';
import TargetStatusChange from './src/pages/Therapist/Students/TargetStatusChange';
import PeakEquivalanceAllTargets from './src/pages/Common/Peak_equivalanace/PeakEquivalanceAllTargets';
// Charts

//Feedback
import AppointmentFeedback from './src/pages/Feedback/AppointmentFeedback';
import store from './src/redux/store';
import CogniableReport from './src/pages/Common/Cogniable/Report';
import CelerationGraphPanel from './src/components/celeration-chart/celeration-chart-panel.container';
import AddCelerationChart from './src/components/celeration-chart/add-new-chart.component';
import UpdateCelerationChart from './src/components/celeration-chart/update-chart.component';
import CelerationGraph from './src/components/celeration-chart/celeration-graph.component';
import AddUpdatePoint from './src/components/celeration-chart/add-update-point.component';
//Feedback

import StudentIisca from './src/pages/Therapist/IISCA/StudentIisca'
import IiscaMain from './src/pages/Therapist/IISCA/IiscaMain';
import CreateIISCA from './src/pages/Therapist/IISCA/CreateIISCA';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
console.disableYellowBox = true;

const slideScreens = [
  {
    key: 1,
    title: '',
    text: 'Autism Therapy at home',
    image: require('./android/img/walkthrough.jpeg'),
    backgroundColor: '#FFFFFF',
  },
  {
    key: 2,
    title: '',
    text: 'Early Screening can rehabilitate autism',
    image: require('./android/img/walkthrough22.jpeg'),
    backgroundColor: '#FFFFFF',
  },
  {
    key: 3,
    title: '',
    text: 'Acceptance and Commitment',
    image: require('./android/img/walkthrough33.jpeg'),
    backgroundColor: '#FFFFFF',
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSplash: true,
      introSlide: true,
      isPin: false,
    };
    this.hideIntroSlider = this.hideIntroSlider.bind(this);

    OneSignal.setLogLevel(6, 0);

    OneSignal.init('3cd73086-cc04-4d57-a4c8-ec6485fed3ee', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse((permission) => {
      console.log('iOS Permission', permission);
    });

    OneSignal.addEventListener('received', (data) => this.onReceived(data));
    OneSignal.addEventListener('opened', (data) => this.onOpened(data));
    OneSignal.addEventListener('ids', (data) => this.onIds(data));
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  hideSplashScreen() {
    this.setState({isSplash: false, introSlide: true});
  }
  //
  hideIntroSlider() {
    this.setState({introSlide: false});
  }

  componentDidMount() {
    // if (DeviceInfo.isTablet()) {
    //     Orientation.lockToLandscape();
    //     this.setState({introSlide: false});
    // }
    console.log('didload');
    AsyncStorage.getItem('userpin')
      .then((result) => {
        console.log('pin 234===', result == null);
        if (result === null) {
          console.log('pin 123===', result);
          this.props.dispatchSignin({
            authResult: false,
            setPin: false,
            getPin: false,
          });
        } else {
          console.log('pin 234===', result);
          let data = JSON.parse(result);
          this.setState({isPin: true});
          this.props.dispatchSignin({
            authResult: true,
            setPin: false,
            getPin: false,
          });
        }
      })
      .catch((err) => {});
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received');
    OneSignal.removeEventListener('opened');
    OneSignal.removeEventListener('ids');
  }

  tempHomeScreen() {
    return <TempScreen />;
  }

  otpScreen() {
    return <OTPVerifyScreen />;
  }

  selectLangScreen() {
    return <SelectLangScreen />;
  }

  render() {
    if (this.state.introSlide) {
      return (
        <Walkthrough
          onContinue={() => {
            this.setState({introSlide: false});
          }}
        />
      );
    }

    // if(this.props.authResult && this.props.getPin && this.chatSocket == null){
    //     let userId = encodeURIComponent(store.getState().user.id);
    //     let url = "ws://application.cogniable.us/ws/reminder/" + userId;
    //     console.log("URL", url)
    //     this.chatSocket = new WebSocket(url);

    //     this.chatSocket.onmessage = function (e) {
    //         const data = JSON.parse(e.data);
    //         console.log("OnMessage", data);
    //     };
    // }

    let userId = null;
    if (this.props.authResult && this.props.getPin) {
      userId = encodeURI(store.getState().user.id);
    }
    let url = 'ws://application.cogniable.us/ws/reminder/' + userId;

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    // console.log('props in App js file:' + JSON.stringify(this.props));
    return (
      <ApolloProvider client={client}>
        <View style={{flex: 1, backgroundColor: Color.primary}}>
          <StatusBar
            backgroundColor={Color.primary}
            barStyle={
              Platform.OS == 'android' ? 'light-content' : 'dark-content'
            }
          />

          {!this.props.authResult && (
            <NavigationContainer>{this.getLoginStack()}</NavigationContainer>
          )}
          {this.props.authResult && !this.props.getPin && (
            <NavigationContainer>{this.getPinStack()}</NavigationContainer>
          )}

          {this.props.authResult && this.props.getPin && (
            <WS
              ref={(ref) => {
                this.ws = ref;
              }}
              url={url}
              onOpen={() => {
                console.log('Open!');
                // this.ws.send("How are you ?");
              }}
              onMessage={(msg) => {
                let data = msg.data;
                console.log('OnMessage Triggered', data);
              }}
              onError={(err) => {
                //console.log("onError", err.message, url);
              }}
              onClose={(err) => {
                console.log('onClose', err);
              }}
              reconnect // Will try to reconnect onClose
            />
          )}

          {this.props.authResult &&
            this.props.getPin &&
            this.props.userType === 'parents' && (
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                      let iconName;
                      if (route.name === 'Home') {
                        iconName = 'heart-outline';
                      } else if (route.name === 'Therapy') {
                        iconName = 'book-open-outline';
                      } else if (route.name === 'Calendar') {
                        iconName = 'calendar-blank';
                      } else if (route.name === 'Profile') {
                        iconName = 'account-outline';
                      } else if (route.name === 'Messages') {
                        iconName = 'email-outline';
                      }
                      return (
                        <MaterialCommunityIcons
                          name={iconName}
                          color={color}
                          size={24}
                        />
                      );
                    },
                  })}>
                  <Tab.Screen name="Home" component={this.getHomeStack} />
                  <Tab.Screen name="Therapy" component={this.getTherapyStack} />
                  <Tab.Screen
                    name="Calendar"
                    component={this.getCalendarStack}
                  />
                  <Tab.Screen
                    name="Messages"
                    component={this.getParentMessagesStack}
                  />
                  <Tab.Screen name="Profile" component={this.getProfileStack} />
                </Tab.Navigator>
              </NavigationContainer>
            )}
          {this.props.authResult &&
            this.props.getPin &&
            this.props.userType === 'therapist' && (
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                      let iconName;
                      if (route.name === 'Today') {
                        iconName = 'heart-outline';
                      } else if (route.name === 'Learners') {
                        iconName = 'account-multiple-outline';
                      } else if (route.name === 'Calendar') {
                        iconName = 'calendar-blank';
                      } else if (route.name === 'Profile') {
                        iconName = 'account-outline';
                      } else if (route.name === 'Messages') {
                        iconName = 'email-outline';
                      } else if (route.name === 'Celeration') {
                        iconName = 'chart-line';
                      }
                      return (
                        <MaterialCommunityIcons
                          name={iconName}
                          color={color}
                          size={24}
                        />
                      );
                    },
                  })}>
                  <Tab.Screen
                    name="Today"
                    component={this.getTherapistTodayStack}
                  />
                  <Tab.Screen
                    name="Learners"
                    component={this.getTherapistStudentsStack}
                  />
                  <Tab.Screen
                    name="Calendar"
                    component={this.getTherapistCalendarStack}
                  />
                  <Tab.Screen
                    name="Messages"
                    component={this.getTherapistMessagesStack}
                  />

                  <Tab.Screen
                    name="Profile"
                    component={this.getTherapistProfileStack}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            )}

          {this.props.authResult &&
            this.props.getPin &&
            this.props.userType === 'school_admin' && (
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                      let iconName;
                      if (route.name === 'Home') {
                        iconName = 'heart-outline';
                      } else if (route.name === 'Learners') {
                        iconName = 'book-open-variant';
                      } else if (route.name === 'Calendar') {
                        iconName = 'calendar-blank';
                      } else if (route.name === 'Profile') {
                        iconName = 'account-outline';
                      } else if (route.name === 'Messages') {
                        iconName = 'email-outline';
                      } else if (route.name === 'Celeration') {
                        iconName = 'chart-line';
                      }
                      return (
                        <MaterialCommunityIcons
                          name={iconName}
                          color={color}
                          size={24}
                        />
                      );
                    },
                  })}>
                  <Tab.Screen name="Home" component={this.getClinicHomeStack} />
                  <Tab.Screen
                    name="Learners"
                    component={this.getTherapistStudentsStack}
                  />
                  <Tab.Screen
                    name="Calendar"
                    component={this.getTherapistCalendarStack}
                  />
                  <Tab.Screen
                    name="Messages"
                    component={this.getClinicMessagesStack}
                  />
                  <Tab.Screen
                    name="Profile"
                    component={this.getClinicProfileStack}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            )}
        </View>
      </ApolloProvider>
    );
  }

  // Therapist Navigator Stack screens- Start

  getTherapistTodayStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="TodayHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="TodayHome" component={TodayHome} />
        <Stack.Screen
          name="AppointmentFeedback"
          component={AppointmentFeedback}
        />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="TaskNew" component={TaskNew} />
        <Stack.Screen name="TaskDetail" component={TaskDetail} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />

        {/* <Stack.Screen name="ScreeningHome" component={ScreeningHome} />

<Stack.Screen name="ScreeningList" component={ScreeningList} />
<Stack.Screen name="ScreeningVideo" component={ScreeningVideo} />
<Stack.Screen name="ScreeningResult" component={ScreeningResult} />
<Stack.Screen
  name="ScreeningPreliminaryAssess"
  component={ScreeningPreliminaryAssess}
/>
<Stack.Screen
  name="ScreeningAnalyzingVideo"
  component={ScreeningAnalyzingVideo}
/>
<Stack.Screen
  name="ScreeningAnalyzingAssess"
  component={ScreeningAnalyzingAssess}
/>
 <Stack.Screen
  name="ScreeningResultWaiting"
  component={ScreeningResultWaiting}
/>
<Stack.Screen
  name="ScreeningInstruction"
  component={ScreeningInstruction}
/> */}
        <Stack.Screen name="WorkLogList" component={WorkLogList} />
        <Stack.Screen name="WorkLogNew" component={WorkLogNew} />
        <Stack.Screen name="LeaveRequestNew" component={LeaveRequestNew} />
        <Stack.Screen name="LeaveRequestList" component={LeaveRequestList} />
        <Stack.Screen name="TherapistProfile" component={TherapistProfile} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePassword} />
        <Stack.Screen name="VimeoProjectsList" component={VimeoProjectsList} />
        <Stack.Screen name="AbcDataScreen" component={AbcDataScreen} />
        <Stack.Screen name="AbcList" component={AbcList} />

        <Stack.Screen name="TherapyRoadMap" component={TherapyRoadMap} />

        <Stack.Screen
          name="VimeoProjectVideos"
          component={VimeoProjectVideos}
        />
        <Stack.Screen name="Playing Tutorial Video" component={VideoPlayer} />
        <Stack.Screen name="TutorialsList" component={TutorialsList} />
        <Stack.Screen name="ParentCommunity" component={CommunityHome} />
        <Stack.Screen
          name="CommunityBlogsDetail"
          component={CommunityBlogsDetail}
        />
        <Stack.Screen name="CommunityAddBlog" component={CommunityAddBlog} />
        <Stack.Screen name="CommunityAddGroup" component={CommunityAddGroup} />
        <Stack.Screen name="CommunityGroups" component={CommunityGroups} />
        <Stack.Screen name="CommunityBlogs" component={CommunityBlogs} />
      </Stack.Navigator>
    );
  }

  getTherapistStudentsStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="StudentsHome"
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS === 'android' ? false : true,
        }}>
        <Stack.Screen name="StudentsHome" component={StudentsHome} />
        <Stack.Screen name="StudentDetail" component={StudentDetail} />
        <Stack.Screen
          name="StudentProgressOverview"
          component={StudentProgressOverview}
        />

        <Stack.Screen name="ScreeningHome" component={ScreeningHome} />

        <Stack.Screen name="ScreeningList" component={ScreeningList} />
        <Stack.Screen name="ScreeningVideo" component={ScreeningVideo} />
        <Stack.Screen name="ScreeningResult" component={ScreeningResult} />
        <Stack.Screen
          name="ScreeningPreliminaryAssess"
          component={ScreeningPreliminaryAssess}
        />
        <Stack.Screen
          name="ScreeningAnalyzingVideo"
          component={ScreeningAnalyzingVideo}
        />
        <Stack.Screen
          name="ScreeningAnalyzingAssess"
          component={ScreeningAnalyzingAssess}
        />
        <Stack.Screen
          name="ScreeningResultWaiting"
          component={ScreeningResultWaiting}
        />
        <Stack.Screen
          name="ScreeningInstruction"
          component={ScreeningInstruction}
        />

        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="StudentDailyResponseRate"
          component={StudentDailyResponseRate}
        />

        <Stack.Screen
          name="CelerationGraphPanel"
          component={CelerationGraphPanel}
        />
        <Stack.Screen
          name="AddCelerationChart"
          component={AddCelerationChart}
        />
        <Stack.Screen
          name="UpdateCelerationChart"
          component={UpdateCelerationChart}
        />
        <Stack.Screen name="CelerationGraph" component={CelerationGraph} />

        <Stack.Screen name="AddPoint" component={AddUpdatePoint} />

        <Stack.Screen
          name="StudentMenuDetail"
          component={StudentMenuDetail}
          options={{animationEnabled: Platform.OS === 'android' ? false : true}}
        />
        <Stack.Screen name="PreviousSession" component={PreviousSession} />
        <Stack.Screen
          name="PreviousSessionTarget"
          component={PreviousSessionTarget}
        />
        
        <Stack.Screen name="StudentNew" component={StudentNew} />
        <Stack.Screen name="SessionPreview" component={SessionPreviewScreen} />
        <Stack.Screen name="SessionTarget" component={SessionTargetScreen} />
        <Stack.Screen name="AttachmentScreen" component={AttachmentScreen} />
        <Stack.Screen
          name="SessionBehaviorScreen"
          component={SessionBehaviorScreen}
        />
        <Stack.Screen
          name="SessionTargetOverlay"
          component={SessionTargetOverlay}
        />
        <Stack.Screen
          name="SessionFeedbackScreen"
          component={SessionFeedbackScreen}
        />
        <Stack.Screen
          name="SessionSummaryScreen"
          component={SessionSummaryScreen}
        />
        <Stack.Screen name="LongTermGoals" component={LongTermGoals} />
        <Stack.Screen name="LongTermGoalNew" component={LongTermGoalNew} />
        <Stack.Screen name="ShortTermGoals" component={ShortTermGoals} options={{animationEnabled: Platform.OS === 'ios' ? true : false}} />
        <Stack.Screen name="ShortTermGoalNew" component={ShortTermGoalNew} />
        <Stack.Screen name="TargetAllocate" component={TargetAllocate} />
        <Stack.Screen
          name="AlreadyTargetAllocate"
          component={AlreadyTargetAllocate}
        />
        <Stack.Screen name="TargetAllocateNew" component={TargetAllocateNew} />
        <Stack.Screen
          name="TargetAllocateNewAssess"
          component={TargetAllocateNewAssess}
        />

        <Stack.Screen
          name="BehaviouralNewPage"
          component={BehaviouralNewPage}
        />
        <Stack.Screen name="PeakEquiTarget" component={PeakEquiTarget} />

        <Stack.Screen
          name="BehaviourDecelDataScreen"
          component={BehaviourDecelDataScreen}
        />

        <Stack.Screen
          name="PeakEquSuggesTarget"
          component={PeakEquSuggesTarget}
        />
        <Stack.Screen name="PeakEquTarResu" component={PeakEquTarResu} />
        <Stack.Screen name="PeakEquiQue" component={PeakEquiQue} />
        <Stack.Screen
          name="BehaviourDecelDataEdit"
          component={BehaviourDecelDataEdit}
        />
        <Stack.Screen
          name="BehaviourDecelTemplateScreen"
          component={BehaviourDecelTemplateScreen}
        />
        <Stack.Screen
          name="BehaviouralStartPage"
          component={BehaviouralStartPage}
        />
        <Stack.Screen
          name="BehaviourNewTemplateScreen"
          component={BehaviourNewTemplateScreen}
        />
        <Stack.Screen
          name="BehaviorRecordingOption"
          component={BehaviorRecordingOption}
        />
        <Stack.Screen
          name="BehaviorFRScreen"
          component={BehaviorFRScreen}
        />
        <Stack.Screen
          name="BehaviorFRRecords"
          component={BehaviorFRRecords}
        />
        <Stack.Screen
          name="BehaviorDRScreen"
          component={BehaviorDRScreen}
        />
        <Stack.Screen
          name="BehaviorDRRecords"
          component={BehaviorDRRecords}
        />
         <Stack.Screen
          name="BehaviorLRScreen"
          component={BehaviorLRScreen}
        />
        <Stack.Screen
          name="BehaviorLRRecords"
          component={BehaviorLRRecords}
        />
         <Stack.Screen
          name="BehaviorPIScreen"
          component={BehaviorPIScreen}
        />
        <Stack.Screen
          name="BehaviorPIRecords"
          component={BehaviorPIRecords}
        />
         <Stack.Screen
          name="BehaviorWIScreen"
          component={BehaviorWIScreen}
        />
        <Stack.Screen
          name="BehaviorWIRecords"
          component={BehaviorWIRecords}
        />
         <Stack.Screen
          name="BehaviorMTScreen"
          component={BehaviorMTScreen}
        />
        <Stack.Screen
          name="BehaviorMTRecords"
          component={BehaviorMTRecords}
        />
        <Stack.Screen
          name="BehaviourDecelMealScreen"
          component={BehaviourDecelMealScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMedicalScreen"
          component={BehaviourDecelMedicalScreen}
        />
        <Stack.Screen
          name="BehaviourDecelToiletScreen"
          component={BehaviourDecelToiletScreen}
        />
        <Stack.Screen
          name="NewToiletDataScreen"
          component={NewToiletDataScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMandScreen"
          component={BehaviourDecelMandScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMandGraph"
          component={BehaviourDecelMandGraph}
        />

        <Stack.Screen name="AbcDataScreen" component={AbcDataScreen} />
        <Stack.Screen name="AbcList" component={AbcList} />

        <Stack.Screen
          name="PreferredItemsScreen"
          component={PreferredItemsScreen}
        />
        <Stack.Screen name="PreferredItemNew" component={PreferredItemNew} />

        <Stack.Screen name="AddNewMeal" component={AddNewMeal} />
        <Stack.Screen name="AddNewMedication" component={AddNewMedication} />

        <Stack.Screen name="AssessmentsList" component={AssessmentsList} />
        <Stack.Screen name="NewAssessment" component={NewAssessment} />
        <Stack.Screen name="CreateNote" component={CreateNote} />
        <Stack.Screen name="NotesList" component={NotesList} />
        <Stack.Screen name="GuideList" component={GuideList} />
        <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
        <Stack.Screen name="AreasList" component={AreasList} />
        <Stack.Screen name="MilestoneGroups" component={MilestoneGroups} />
        <Stack.Screen name="IepReport" component={IepReport} />
        <Stack.Screen
          name="VbmappSuggestedTargets"
          component={VbmappSuggestedTargets}
        />
        <Stack.Screen
          name="VbmappToc"
          component={VbmappToc}
        />
        <Stack.Screen
          name="VbmappGuide"
          component={VbmappGuide}
        />
        

        <Stack.Screen name="PeakScreen" component={PeakScreen} />
        <Stack.Screen name="PeakScoreScreen" component={PeakScoreScreen} />
        <Stack.Screen name="PeakPrograms" component={PeakPrograms} />
        <Stack.Screen name="CreateProgram" component={CreateProgram} />
        <Stack.Screen name="EquiResult" component={EquiResult} />

        <Stack.Screen
          name="PeakSuggestedTargets"
          component={PeakSuggestedTargets}
        />

        <Stack.Screen name="equivalanceOption" component={equivalanceOption} />
        <Stack.Screen
          name="DirectAssessmentsList"
          component={DirectAssessmentsList}
        />
        <Stack.Screen
          name="MilestonesQuestions"
          component={MilestonesQuestions}
        />
        <Stack.Screen name="BarriersQuestions" component={BarriersQuestions} />
        <Stack.Screen
          name="TransitionQuestions"
          component={TransitionQuestions}
        />
        <Stack.Screen name="TaskQuestions" component={TaskQuestions} />
        <Stack.Screen name="EESAQuestions" component={EESAQuestions} />

        <Stack.Screen name="PeakTabView" component={PeakTabView} />

        <Stack.Screen name="PeakScrollTabView" component={PeakScrollTabView} />
        <Stack.Screen
          name="BehaviorAssessmentsList"
          component={BehaviorAssessmentsList}
        />

        <Stack.Screen
          name="NewAssessmentBehavior"
          component={NewAssessmentBehavior}
        />
        <Stack.Screen name="QuestionsBehavior" component={QuestionsBehavior} />
        <Stack.Screen
          name="AssessmentResultBehavior"
          component={AssessmentResultBehavior}
        />
        <Stack.Screen
          name="BehaviorSuggestedTargets"
          component={BehaviorSuggestedTargets}
        />
        <Stack.Screen name="equiquestion" component={equiquestion} />

        <Stack.Screen name="EquivalanceTarget" component={EquivalanceTarget} />

        <Stack.Screen
          name="CogniableAssessmentsList"
          component={CogniableAssessmentsList}
        />
        <Stack.Screen
          name="CreateAssessmentCogniable"
          component={CreateAssessmentCogniable}
        />
        <Stack.Screen
          name="NewAssessmentCogniable"
          component={NewAssessmentCogniable}
        />
        <Stack.Screen
          name="QuestionsCogniable"
          component={QuestionsCogniable}
        />
        <Stack.Screen
          name="AssessmentResultCogniable"
          component={AssessmentResultCogniable}
        />
        <Stack.Screen
          name="CogniableSuggestedTargets"
          component={CogniableSuggestedTargets}
        />
        <Stack.Screen
          name="ManualTargetAllocationNew"
          component={ManualTargetAllocationNew}
        />
        <Stack.Screen
          name="StudentIisca"
          component={StudentIisca}
        />
        <Stack.Screen
          name="IiscaMain"
          component={IiscaMain}
        />
        <Stack.Screen
          name="CreateIISCA"
          component={CreateIISCA}
        />
        <Stack.Screen
          name="PeakEquivalanceAllTargets"
          component={PeakEquivalanceAllTargets}
        />

        <Stack.Screen name="PeakReport" component={PeakReport} />

        <Stack.Screen name="EquiReport" component={EquiReport} />

        <Stack.Screen
          name="TargetStatusChange"
          component={TargetStatusChange}
        />
        <Stack.Screen
          name="PeakTargetAllocateNewAssess"
          component={PeakTargetAllocateNewAssess}
        />
        <Stack.Screen name="CogniableReport" component={CogniableReport} />
      </Stack.Navigator>
    );
  }

  getTherapistCalendarStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="CalendarHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="CalendarHome" component={CalendarHome} />
        <Stack.Screen
          name="AppointmentFeedback"
          component={AppointmentFeedback}
        />
        <Stack.Screen name="AppointmentNew" component={AppointmentNew} />
        <Stack.Screen name="AppointmentEdit" component={AppointmentEdit} />
      </Stack.Navigator>
    );
  }

  getTherapistMessagesStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="MessagesHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="MessagesHome" component={MessagesHomeTherapist} />
        <Stack.Screen name="MessageDetail" component={MessageDetailTherapist} />
      </Stack.Navigator>
    );
  }

  getClinicMessagesStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="MessagesHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="MessagesHome" component={MessagesHomeClinic} />
        <Stack.Screen name="MessageDetail" component={MessageDetailClinic} />
      </Stack.Navigator>
    );
  }

  getParentMessagesStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="MessagesHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="MessagesHome" component={MessagesHomeParent} />
        <Stack.Screen name="MessageDetail" component={MessageDetailParent} />
      </Stack.Navigator>
    );
  }

  getTherapistProfileStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Profile" component={ProfileTherapist} />
        <Stack.Screen name="SupportTicket" component={SupportTicketStack} />
        <Stack.Screen name="AddSupportTicket" component={AddSupportTicket} />
        <Stack.Screen name="ViewSupportTicket" component={ViewSupportTicket} />
        <Stack.Screen name="EditSupportTicket" component={EditSupportTicket} />
      </Stack.Navigator>
    );
  }

  // Therapist Navigator Stack screens- End

  // Clinic Navigator Stack Screens - Start
  getClinicHomeStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="ClinicHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ClinicHome" component={ClinicHome} />
        <Stack.Screen
          name="AppointmentFeedback"
          component={AppointmentFeedback}
        />
        {/* <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        /> */}

        <Stack.Screen name="ScreeningHome" component={ScreeningHome} />

        <Stack.Screen name="ScreeningList" component={ScreeningList} />
        <Stack.Screen name="ScreeningVideo" component={ScreeningVideo} />
        <Stack.Screen name="ScreeningResult" component={ScreeningResult} />
        <Stack.Screen
          name="ScreeningPreliminaryAssess"
          component={ScreeningPreliminaryAssess}
        />
        <Stack.Screen
          name="ScreeningAnalyzingVideo"
          component={ScreeningAnalyzingVideo}
        />
        <Stack.Screen
          name="ScreeningAnalyzingAssess"
          component={ScreeningAnalyzingAssess}
        />
        <Stack.Screen
          name="ScreeningResultWaiting"
          component={ScreeningResultWaiting}
        />
        <Stack.Screen
          name="ScreeningInstruction"
          component={ScreeningInstruction}
        />
        <Stack.Screen name="ClinicStaffs" component={ClinicStaffs} />
        <Stack.Screen name="ClinicStaffDetail" component={ClinicStaffDetail} />
        <Stack.Screen name="ClinicStaffNew" component={ClinicStaffNew} />
        <Stack.Screen name="VimeoProjectsList" component={VimeoProjectsList} />
        <Stack.Screen name="CreateBlog" component={CreateBlog} />
        <Stack.Screen name="AddBlog" component={AddBlog} />
        <Stack.Screen name="Group" component={Group} />

        <Stack.Screen name="AbcDataScreen" component={AbcDataScreen} />
        <Stack.Screen name="AbcList" component={AbcList} />

        <Stack.Screen name="TherapyRoadMap" component={TherapyRoadMap} />
        <Stack.Screen name="TaskList" component={ParentTaskList} />
        <Stack.Screen name="TaskNew" component={ParentTaskNew} />

        <Stack.Screen
          name="VimeoProjectVideos"
          component={VimeoProjectVideos}
        />
        <Stack.Screen name="Playing Tutorial Video" component={VideoPlayer} />
        <Stack.Screen name="TutorialsList" component={TutorialsList} />
        <Stack.Screen name="ParentCommunity" component={CommunityHome} />
        <Stack.Screen
          name="CommunityBlogsDetail"
          component={CommunityBlogsDetail}
        />
        <Stack.Screen name="CommunityAddBlog" component={CommunityAddBlog} />
        <Stack.Screen name="CommunityAddGroup" component={CommunityAddGroup} />
        <Stack.Screen name="CommunityGroups" component={CommunityGroups} />
        <Stack.Screen name="CommunityBlogs" component={CommunityBlogs} />
      </Stack.Navigator>
    );
  }

  getClinicStudentsStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="ClinicStudentHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ClinicStudentHome" component={ClinicStudentHome} />
      </Stack.Navigator>
    );
  }

  getClinicCalendarStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="ClinicCalendarHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="ClinicCalendarHome"
          component={ClinicCalendarHome}
        />
      </Stack.Navigator>
    );
  }

  getClinicProfileStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="ClinicProfileHome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ClinicProfileHome" component={ClinicProfileHome} />
        <Stack.Screen name="ClinicStaffs" component={ClinicStaffs} />
        <Stack.Screen name="ClinicStaffDetail" component={ClinicStaffDetail} />
        <Stack.Screen name="ClinicTaskList" component={ClinicTaskList} />
        <Stack.Screen name="ClinicTaskDetails" component={ClinicTaskDetails} />
        <Stack.Screen name="SupportTicket" component={SupportTicketStack} />
        <Stack.Screen name="AddSupportTicket" component={AddSupportTicket} />
        <Stack.Screen name="ViewSupportTicket" component={ViewSupportTicket} />
        <Stack.Screen name="EditSupportTicket" component={EditSupportTicket} />
        <Stack.Screen name="ClinicTaskNew" component={ClinicTaskNew} />
        <Stack.Screen name="ClinicStaffNew" component={ClinicStaffNew} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePassword} />
      </Stack.Navigator>
    );
  }

  // Clinic Navigator Stack Screens - End

  getLoginStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="Signin2"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Counter" component={Counter} />
        <Stack.Screen name="SelectLang" component={SelectLangScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signin2" component={SigninScreen2} />
        <Stack.Screen name="SetPin" component={SetPinScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="SignupMobile" component={SignupMobileScreen} />
        <Stack.Screen name="SignupEmail" component={SignupEmailScreen} />
        <Stack.Screen name="OTP" component={OTPVerifyScreen} />
        <Stack.Screen name="ReactNativeCharts" component={ReactNativeCharts} />
      </Stack.Navigator>
    );
  }

  getPinStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="GetPin"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="GetPin" component={GetPin} />
      </Stack.Navigator>
    );
  }

  getHomeStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="HomeScreening"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home2" component={TempScreen} />
        <Stack.Screen name="QuestionInputText" component={QuestionInputText} />
        <Stack.Screen
          name="QuestionSelectOption2"
          component={QuestionSelectOption2}
        />

        <Stack.Screen
          name="ScreeningResultWaiting"
          component={ScreeningResultWaiting}
        />
        <Stack.Screen
          name="QuestionSelectOption2Selected"
          component={QuestionSelectOption2Selected}
        />
        <Stack.Screen
          name="QuestionSelectOption4"
          component={QuestionSelectOption4}
        />
        <Stack.Screen
          name="QuestionSelectOption4Submitted"
          component={QuestionSelectOption4Submitted}
        />
        <Stack.Screen name="VideoInput" component={VideoInput} />
        <Stack.Screen
          name="VideoInputUploading"
          component={VideoInputUploading}
        />
        <Stack.Screen
          name="VideoInputUploadingCompleted"
          component={VideoInputUploadingCompleted}
        />
        <Stack.Screen name="AnalyzingVideo" component={AnalyzingVideo} />
        <Stack.Screen
          name="AnalyzingAssessment"
          component={AnalyzingAssessment}
        />
        <Stack.Screen name="PendingResults1" component={PendingResults1} />
        <Stack.Screen name="PendingResults2" component={PendingResults2} />
        <Stack.Screen name="TherapyHome" component={TherapyHome} />
        <Stack.Screen name="TutorialsList" component={TutorialsList} />

        <Stack.Screen
          name="StudentProgressOverview"
          component={StudentProgressOverview}
        />
        <Stack.Screen
          name="StudentDailyResponseRate"
          component={StudentDailyResponseRate}
        />

        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="HomeScreening" component={HomeScreening} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />

        <Stack.Screen
          name="VerifiedDoctors"
          component={VerifiedDoctorsScreen}
        />
        <Stack.Screen name="ParentCommunity" component={CommunityHome} />
        <Stack.Screen
          name="CommunityBlogsDetail"
          component={CommunityBlogsDetail}
        />
        <Stack.Screen name="CommunityAddBlog" component={CommunityAddBlog} />
        <Stack.Screen name="CommunityAddGroup" component={CommunityAddGroup} />
        <Stack.Screen name="CommunityGroups" component={CommunityGroups} />
        <Stack.Screen name="CommunityBlogs" component={CommunityBlogs} />
        <Stack.Screen
          name="SessionTargetList"
          component={SessionTargetListScreen}
        />
        <Stack.Screen name="SessionPreview" component={SessionPreviewScreen} />
        <Stack.Screen name="SessionTarget" component={SessionTargetScreen} />
        <Stack.Screen name="AttachmentScreen" component={AttachmentScreen} />

        <Stack.Screen
          name="SessionTargetOverlay"
          component={SessionTargetOverlay}
        />
        <Stack.Screen
          name="SessionFeedbackScreen"
          component={SessionFeedbackScreen}
        />
        <Stack.Screen
          name="SessionSummaryScreen"
          component={SessionSummaryScreen}
        />

        <Stack.Screen
          name="SessionTargetCorrect"
          component={SessionTargetCorrectScreen}
        />
        <Stack.Screen
          name="AssessmentInstructions"
          component={AssessmentInstructions}
        />
        <Stack.Screen
          name="DiscriminativeStimulus"
          component={DiscriminativeStimulus}
        />

        <Stack.Screen
          name="BehaviourDecelDataScreen"
          component={BehaviourDecelDataScreen}
        />

        <Stack.Screen
          name="BehaviourDecelDataEdit"
          component={BehaviourDecelDataEdit}
        />

        <Stack.Screen
          name="BehaviourDecelTemplateScreen"
          component={BehaviourDecelTemplateScreen}
        />

        <Stack.Screen
          name="BehaviourNewTemplateScreen"
          component={BehaviourNewTemplateScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMealScreen"
          component={BehaviourDecelMealScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMedicalScreen"
          component={BehaviourDecelMedicalScreen}
        />
        <Stack.Screen
          name="BehaviourDecelToiletScreen"
          component={BehaviourDecelToiletScreen}
        />
        <Stack.Screen
          name="NewToiletDataScreen"
          component={NewToiletDataScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMandScreen"
          component={BehaviourDecelMandScreen}
        />

        <Stack.Screen
          name="BehaviourDecelMandGraph"
          component={BehaviourDecelMandGraph}
        />

        <Stack.Screen name="AbcDataScreen" component={AbcDataScreen} />

        <Stack.Screen name="AbcList" component={AbcList} />

        <Stack.Screen name="AddNewMeal" component={AddNewMeal} />
        <Stack.Screen name="AddNewMedication" component={AddNewMedication} />

        {/* ACT */}
        <Stack.Screen name="ActHome" component={ActHome} />
        <Stack.Screen name="ActCourse" component={ActCourse} />
        <Stack.Screen name="ActExcercise" component={ActExcercise} />

        {/* Autism Screening */}
        <Stack.Screen name="ScreeningList" component={ScreeningList} />
        <Stack.Screen name="ScreeningHome" component={ScreeningHome} />
        <Stack.Screen
          name="ScreeningPreliminaryAssess"
          component={ScreeningPreliminaryAssess}
        />
        <Stack.Screen
          name="ScreeningAnalyzingAssess"
          component={ScreeningAnalyzingAssess}
        />
        <Stack.Screen
          name="ScreeningInstruction"
          component={ScreeningInstruction}
        />
        <Stack.Screen name="ScreeningVideo" component={ScreeningVideo} />
        <Stack.Screen
          name="ScreeningAnalyzingVideo"
          component={ScreeningAnalyzingVideo}
        />
        <Stack.Screen name="ScreeningResult" component={ScreeningResult} />
        <Stack.Screen
          name="CogniableAssessmentsList"
          component={CogniableAssessmentsList}
        />
        <Stack.Screen
          name="AssessmentResultCogniable"
          component={AssessmentResultCogniable}
        />
        <Stack.Screen
          name="CogniableSuggestedTargets"
          component={CogniableSuggestedTargets}
        />
        <Stack.Screen name="TargetAllocateNew" component={TargetAllocateNew} />
        <Stack.Screen
          name="TargetAllocateNewAssess"
          component={TargetAllocateNewAssess}
        />
        <Stack.Screen
          name="CreateAssessmentCogniable"
          component={CreateAssessmentCogniable}
        />
        <Stack.Screen
          name="NewAssessmentCogniable"
          component={NewAssessmentCogniable}
        />
        <Stack.Screen
          name="QuestionsCogniable"
          component={QuestionsCogniable}
        />
        <Stack.Screen name="CogniableReport" component={CogniableReport} />
        <Stack.Screen name="ShortTermGoals" component={ShortTermGoals} options={{animationEnabled: Platform.OS === 'ios' ? true : false}} />
      </Stack.Navigator>
    );
  }

  getTherapyStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="TherapyProgramScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="TherapyProgramScreen"
          component={TherapyProgramScreen}
        />
        <Stack.Screen name="AbcDataScreen" component={AbcDataScreen} />
        <Stack.Screen name="AbcList" component={AbcList} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="ScreeningPreliminaryAssess"
          component={ScreeningPreliminaryAssess}
        />
        <Stack.Screen name="TherapyRoadMap" component={TherapyRoadMap} />
        <Stack.Screen name="TaskList" component={ParentTaskList} />
        <Stack.Screen name="TaskNew" component={ParentTaskNew} />

        <Stack.Screen name="VimeoProjectsList" component={VimeoProjectsList} />
        <Stack.Screen
          name="VimeoProjectVideos"
          component={VimeoProjectVideos}
        />
        <Stack.Screen
          name="SessionTargetList"
          component={SessionTargetListScreen}
        />
        <Stack.Screen name="SessionPreview" component={SessionPreviewScreen} />
        <Stack.Screen name="SessionTarget" component={SessionTargetScreen} />
        <Stack.Screen name="AttachmentScreen" component={AttachmentScreen} />

        <Stack.Screen
          name="SessionTargetOverlay"
          component={SessionTargetOverlay}
        />
        <Stack.Screen
          name="SessionTargetCorrect"
          component={SessionTargetCorrectScreen}
        />
        <Stack.Screen
          name="AssessmentInstructions"
          component={AssessmentInstructions}
        />
        <Stack.Screen
          name="CogniableAssessment"
          component={CogniableAssessment}
        />
        <Stack.Screen
          name="CogniableAssessment2"
          component={CogniableAssessment2}
        />
        <Stack.Screen name="AssessmentResults" component={AssessmentResults} />
        <Stack.Screen name="UserProgram" component={UserProgram} />
        <Stack.Screen
          name="PreferredItemsScreen"
          component={PreferredItemsScreen}
        />
        <Stack.Screen name="PreferredItemNew" component={PreferredItemNew} />
        <Stack.Screen
          name="LongTermGoalsScreen"
          component={LongTermGoalsScreen}
        />
        <Stack.Screen
          name="LongTermShortTemGoalScreen"
          component={LongTermShortTemGoalScreen}
        />
        <Stack.Screen
          name="ShortTermGoalsScreen"
          component={ShortTermGoalsScreen}
          options={{animationEnabled: Platform.OS === 'ios' ? true : false}}
        />
        <Stack.Screen
          name="AlreadyTargetAllocate"
          component={AlreadyTargetAllocate}
        />
        <Stack.Screen name="TargetAllocate" component={TargetAllocate} />

        <Stack.Screen
          name="ManualTargetAllocationNew"
          component={ManualTargetAllocationNew}
          options={{animationEnabled: Platform.OS === 'ios' ? true : false}}
        />
        
        <Stack.Screen name="Playing Tutorial Video" component={VideoPlayer} />
        <Stack.Screen name="TutorialsList" component={TutorialsList} />
        <Stack.Screen
          name="SessionFeedbackScreen"
          component={SessionFeedbackScreen}
        />
        <Stack.Screen
          name="SessionSummaryScreen"
          component={SessionSummaryScreen}
        />
      </Stack.Navigator>
    );
  }

  getCalendarStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="CalendarScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="BookParentAppointment" component={BookParentAppointmentStack}/>
        <Stack.Screen
          name="AppointmentFeedback"
          component={AppointmentFeedback}
        />
        <Stack.Screen name="SessionPreview" component={SessionPreviewScreen} />
        <Stack.Screen name="SessionTarget" component={SessionTargetScreen} />
        <Stack.Screen name="AttachmentScreen" component={AttachmentScreen} />

        <Stack.Screen
          name="SessionTargetOverlay"
          component={SessionTargetOverlay}
        />
        <Stack.Screen name="AppointmentNew" component={AppointmentNew} />
        <Stack.Screen
          name="SessionFeedbackScreen"
          component={SessionFeedbackScreen}
        />
        <Stack.Screen
          name="SessionSummaryScreen"
          component={SessionSummaryScreen}
        />
        <Stack.Screen name="Home2" component={TempScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SelectLang" component={SelectLangScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="HomeScreening" component={HomeScreening} />
      </Stack.Navigator>
    );
  }

  getProfileStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="profile"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="TaskList" component={ParentTaskList} />
        <Stack.Screen name="TaskNew" component={ParentTaskNew} />
        <Stack.Screen
          name="NewFamilyMember"
          component={NewFamilyMemberScreen}
        />
        <Stack.Screen
          name="FamilyMemberDetails"
          component={FamilyMemberDetailScreen}
        />
        <Stack.Screen name="CareAdvisorScreen" component={CareAdvisorScreen} />
        <Stack.Screen name="SupportTicket" component={SupportTicketStack} />
        <Stack.Screen name="AddSupportTicket" component={AddSupportTicket} />
        <Stack.Screen name="ViewSupportTicket" component={ViewSupportTicket} />
        <Stack.Screen name="EditSupportTicket" component={EditSupportTicket} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePassword} />
      </Stack.Navigator>
    );
  }

  // getSupportTicketStack(){
  //   const Stack = createStackNavigator();
  //   return (
  //     <Stack.Navigator initialRouteName={SupportTicket}>
  //       <Stack.Screen name="SupportTicket" component={SupportTicket} />
  //       <Stack.Screen name="AddSupportTicket" component={AddSupportTicket} />
  //     </Stack.Navigator>
  //   )
  // }

  getAllStack() {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="BehaviourDecelMandScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home2" component={TempScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SelectLang" component={SelectLangScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="SignupMobile" component={SignupMobileScreen} />
        <Stack.Screen name="SignupEmail" component={SignupEmailScreen} />
        <Stack.Screen name="OTP" component={OTPVerifyScreen} />
        <Stack.Screen name="Home1" component={HomeScreen} />
        <Stack.Screen
          name="SessionTargetList"
          component={SessionTargetListScreen}
        />
        <Stack.Screen name="SessionPreview" component={SessionPreviewScreen} />
        <Stack.Screen name="SessionTarget" component={SessionTargetScreen} />
        <Stack.Screen name="AttachmentScreen" component={AttachmentScreen} />
        <Stack.Screen
          name="SessionTargetOverlay"
          component={SessionTargetOverlay}
        />
        <Stack.Screen
          name="SessionTargetCorrect"
          component={SessionTargetCorrectScreen}
        />
        <Stack.Screen
          name="AssessmentInstructions"
          component={AssessmentInstructions}
        />
        <Stack.Screen
          name="TherapyAssessmentScreen"
          component={TherapyAssessmentScreen}
        />
        <Stack.Screen
          name="PreferredItemsScreen"
          component={PreferredItemsScreen}
        />
        <Stack.Screen name="PreferredItemNew" component={PreferredItemNew} />
        <Stack.Screen
          name="SessionFeedbackScreen"
          component={SessionFeedbackScreen}
        />
        <Stack.Screen name="TherapyRoadMap" component={TherapyRoadMap} />
        <Stack.Screen name="TaskList" component={ParentTaskList} />
        <Stack.Screen name="TaskNew" component={ParentTaskNew} />

        <Stack.Screen
          name="TherapyProgramScreen"
          component={TherapyProgramScreen}
        />

        <Stack.Screen
          name="BehaviourDecelMealScreen"
          component={BehaviourDecelMealScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMedicalScreen"
          component={BehaviourDecelMedicalScreen}
        />
        <Stack.Screen
          name="BehaviourDecelToiletScreen"
          component={BehaviourDecelToiletScreen}
        />
        <Stack.Screen
          name="BehaviourDecelMandScreen"
          component={BehaviourDecelMandScreen}
        />

        <Stack.Screen
          name="BehaviourDecelMandGraph"
          component={BehaviourDecelMandGraph}
        />

        <Stack.Screen
          name="SessionSummaryScreen"
          component={SessionSummaryScreen}
        />
        <Stack.Screen
          name="VerifiedDoctorsScreen"
          component={VerifiedDoctorsScreen}
        />
        <Stack.Screen name="ParentCommunityScreen" component={CommunityHome} />
        <Stack.Screen
          name="CommunityBlogsDetail"
          component={CommunityBlogsDetail}
        />
        <Stack.Screen name="CommunityAddBlog" component={CommunityAddBlog} />
        <Stack.Screen name="CommunityAddGroup" component={CommunityAddGroup} />
        <Stack.Screen name="CommunityGroups" component={CommunityGroups} />
        <Stack.Screen name="CommunityBlogs" component={CommunityBlogs} />
        <Stack.Screen name="HomeScreening" component={HomeScreening} />
        <Stack.Screen name="SaveMeal" component={SaveMeal} />
        <Stack.Screen name="SaveMedical" component={SaveMedical} />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    backgroundColor: '#FFFFFF',
    height: screenHeight,
  },
  image: {
    marginTop: 50,
    width: screenWidth,
    height: 300,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 400,
  },
  text: {
    marginTop: 20,
    padding: 10,
    fontFamily: 'SF Pro Display',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 12,
    textAlign: 'left',
    letterSpacing: -0.3,
    color: '#45494E',
  },
  title: {},
  continueView: {
    margin: 10,
    width: screenWidth - 20,
    position: 'absolute',
    bottom: 100,
  },
  buttonContinue: {
    padding: 10,
    width: '100%',
    textAlign: 'center',
    color: '#3E7BFA',
  },
});

const mapStateToProps = (state) => ({
  lang: getLanguage(state),
  authResult: getAuthResult(state),
  getPin: getPin(state),
  userType: getUserType(state),
  studentId: getStudentId(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetTimezone: (data) => dispatch(setTimezone(data)),
  dispatchSignin: (data) => dispatch(setpin(data)),
});

//export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);
