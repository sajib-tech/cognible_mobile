/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {Component, createRef} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  FlatList,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
  processColor,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Card, Overlay, List, ListItem, Icon} from 'react-native-elements';
import Pdf from 'react-native-pdf';
import Collapsible from 'react-native-collapsible';
import Timer from 'react-compound-timer';


import {
  VictoryLine,
  VictoryTheme,
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryVoronoiContainer,
} from 'victory-native';
import RnModal from 'react-native-modal';
import {Modalize} from 'react-native-modalize';
import {TouchableWithoutFeedback as TouchableOpacityAbs} from 'react-native-gesture-handler';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import Video from 'react-native-video';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {LineChart} from 'react-native-charts-wrapper';
import SessionBehaviorScreen from './SessionBehaviorScreen';
import BehaviourDecelDataScreen from './BehaviourDecelDataScreen';
import BehaviourDecelTemplateScreen from '../../pages/therapy/BehaviourDecelTemplateScreen';
import BehaviourNewTemplateScreen from '../../pages/therapy/BehaviourNewTemplateScreen';
import BehaviourDecelMandScreen from '../../pages/therapy/BehaviourDecelMandScreen';
import BehaviourDecelMandGraph from './BehaviourDecelMandGraph';
import NewToiletDataScreen from '../../pages/therapy/NewToiletDataScreen';
import TargetResponse from '../../components/TargetResponse';
import TargetProgress from '../../components/TargetProgress';
import TextInput from '../../components/TextInput';
import TrialProgressNew from '../../components/TrialProgressNew';
import moment from 'moment';
import {
  client,
  refreshToken,
  createSessionRecord,
  getSessionTargetsBySessionId,
  updateSessionRecord,
  getSessionSummary,
  getTargetIdSessionRecordings,
  completeSessionProcess,
  updateChildSessionDuration,
  peakRecord,
  updatePeakRecord,
  createRecord,
  createPeakSessionRecord,
  getAutomatic,
  getGraphData,
  getPreviousSessionRecordings,
  getAllPreviousRecordings,
} from '../../constants/parent';
import _ from 'lodash';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

import {useQuery} from '@apollo/react-hooks';
import Carousel from 'react-native-snap-carousel';

import {connect} from 'react-redux';
import store from '../../redux/store';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import HTMLView from 'react-native-htmlview';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import VideoControl from '../../components/VideoControl';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import {getStr} from '../../../locales/Locale';
import {element} from 'prop-types';
import ClinicRequest from '../../constants/ClinicRequest';
import {Thumbnail} from 'react-native-thumbnail-video';
import BehaviourDecelToiletScreen from './BehaviourDecelToiletScreen';
import SimpleModal from '../../components/SimpleModal';
import UrlParser from 'js-video-url-parser';
import YoutubePlayer from '../../components/YoutubePlayer';
import VimeoPlayer from '../../components/VimeoPlayer';
import ParentRequest from '../../constants/ParentRequest';
import BackgroundTimer from 'react-native-background-timer';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import PickerModal from '../../components/PickerModal';
import LoadingIndicator from '../../components/LoadingIndicator';
import SBTBlock from './SBTBlock';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

let extraBackgroundTimer = null;
let thirdExtraBackgroundTimer = null;
let reductionTimer = null;
const behaviorRecordingId='VGFyZ2V0RGV0YWlsVHlwZToxMQ=='
const peakId='VGFyZ2V0RGV0YWlsVHlwZTo4'
const SBTId = 'VGFyZ2V0RGV0YWlsVHlwZToxMA=='


const TEMPDATA = [
  {
    id: 0,
    label: 'Seconds',
  },
  {
    id: 1,
    label: 'Minutes',
  },
  {
    id: 2,
    label: 'Hours',
  },
  {
    id: 3,
    label: 'Days',
  },
];

class SessionTargetScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: {},
      studentId: '',
      isExitVisible: false,
      isInstrVisible: false,
      isEditVisible: false,
      exitReason: '',
      loading: true,
      pageTitle: '',
      fromPage: '',
      pressed: false,
      emailTxt: '',
      pwdTxt: '',
      message: '',
      showCorrectResponse: true,
      showCorrectResponseBorder: false,
      showInCorrectResponseBorder: false,
      animation: new Animated.Value(0),
      sessionId: '',
      incorrectData: [],

      currentTargetIndex: 0,
      currentTargetNumber: 1,

      currentTargetCorrectNumer: 0,
      targetsCount: 0,
      targetList: [],
      currentTargetInstructions: '',
      currentTrialNumber: 0,
      currentTrialNo: 0,
      totalTrials: 0,
      trialSuccessCount: 0,

      sidebarMode: 'normal',
      isShowBehaviour: false,
      scrollEnabled: true,

      sd: [],
      steps: [],

      parentSessionInfo: {},
      showTimer: '00:00',
      totalSeconds: 0,

      timer: null,
      counter: '00',
      miliseconds: '00',

      durationStartTime: '',
      durationEndTime: '',

      showDataRecordingModal: false,
      isBehaviourActive: true,
      isBehaviourNewActive: false,
      isMandActive: false,
      isToiletActive: false,
      isToiletNewActive: false,
      isToiletEdit: false,

      isVideoPlayVisible: false,
      videoUrl: '',
      status: '',

      correctResponseText: 'child was able to response correctly',
      isContentLoaded: false,

      stimulusCurrentIndex: 0,
      stepsCurrentIndex: 0,
      currentPeak: [],
      peakBlack: 0,
      totalMarks: 0,
      currentPeakTrial: 1,
      currentPeakStimIndex: 0,
      currentPeakSdIndex: 0,

      currentThumbnail: null,
      currentPeakSkillId: 0,
      peakAllSd: [],
      block: [],
      peakType: 'default',
      reasonText: '',
      incorrectIndex: -1,
      dataSets: [],
      isChart: false,
      isMandGraph: false,
      xAxis: [],
      isEquiRecord: false,
      equiTarget: {},
      classIndex: 0,
      isTrain: true,
      peakEquiRecord: [],
      peakEquTarget: 1,
      peakEquiClassRecord: [],
      allMastery: [],
      statusName: '',
      fromEdit: false,
      date: null,
      isChartLoaded: false,
      labelYear: '',
      sessionTypeID: '',
      showAttachment: false,
      viewAttachment: false,
      viewImageAttachment: false,
      attachments: [],
      attachmentIndex: 0,
      extraShowTimer: '00 min 00 sec',
      extraTotalSeconds: 0,
      extraTimer: null,
      extraCounter: '00',
      extraMiliseconds: '00',
      extraTotalDuration: '',
      extraDurationStartTime: '',
      extraDurationEndTime: '',
      recordingTypeData: TEMPDATA,
      selectedRecordingType: '0',
      calculatedRate: '0',
      thirdShowTimer: '00 min 00 sec',
      thirdTotalSeconds: 0,
      isExtraTimerRunning: false,
      showThirdTimer: false,
      startThirdTimer: false,
      startExtraTimer: false,
      recordingDuration: '0',
      recordingFrequency: '0',
      behaviours: [],
      startBehaviourTime: '',
      stopBehaviourTime: '',
      totalBehaviourDuration: '',
      totalBehaviourFrequency: '',
      reductionTotalSeconds: 0,
      reductionShowTimer: '00 min 00 sec',
      attachmentUrl: '',
      combinationCode: null,
      totalClasses: [],
      behRec: null,
      Frequency: 0,
      scoreLoading:false,
      frGraph:[],
      drGraph:[],
      rateGraph:[],
      isBehRecordingType:false,
      selectedTab:'frequency',
      isPeakType:false,

      SBTStepActiveId:'',
      SBTStepActiveIndex:0,
      isPrompt:false,
      isCorrect:false,
      childStatus:''
    };
    this.correctResponseRef = React.createRef();
    this.inCorrectResponseRef = React.createRef();
    this.goBack = this.goBack.bind(this);
    this.getCurrentTargetTrialsInfo = this.getCurrentTargetTrialsInfo.bind(
      this,
    );
    this.setTrailBoxes = this.setTrailBoxes.bind(this);
    this.prePopulateIncorrectData = this.prePopulateIncorrectData.bind(this);
    this.selectIncorrectItem = this.selectIncorrectItem.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.modalizeRef = React.createRef();
    this.timerRef=React.createRef();

    this.screenRef = createRef()
  }

  componentDidMount() {
    // this.startTimer();

    // this.startExtraTimer(0)

    console.log('target id=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-', this.props.route.params.parentSessionInfo);
    let {route} = this.props;
    let sessionId = route.params.sessionId;
    let fromPage = route.params.fromPage;
    let student = route.params.student;
    let studentId = route.params.studentId; // this.state.studentId;
    let fromEdit = route.params.fromEdit;
    let date = route.params.date;

    let correctResponseText = this.state.correctResponseText.replace(
      'child',
      student.firstname,
    );
    this.setState({
      pageTitle: route.params.pageTitle,
      fromPage: route.params.fromPage,
      sessionId: sessionId,
      student: student,
      studentId: studentId,
      parentSessionInfo: route.params.parentSessionInfo,
      correctResponseText: correctResponseText,
      fromEdit: fromEdit,
      date: date,
    });
    this.getSessionTargets(studentId, sessionId);

    this.getPrompts();

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  getCombinationCode = () => {
    const {targetList, currentTargetIndex} = this.state;

    let currentTarget = targetList[currentTargetIndex]?.node;

    const variables = {
      code: currentTarget?.eqCode ? currentTarget?.eqCode : '1A',
    };

    console.log(variables);

    ParentRequest.getCombinationCodes(variables)
      .then((res) => {
        console.log(res);

        this.setState({combinationCode: res?.data?.getPeakEquCodes?.edges});
      })
      .catch((err) => {
        console.log(err);
        console.log(JSON.stringify(err));
      });
  };

  getPrompts = () => {
    ParentRequest.getPrompts().then((res) => {
      console.log('prompt codes', res);
      this.managePrompts(res.data.promptCodes);
    });
  };

  managePrompts = (res) => {
    let temp = [];

    const fixed = [
      {key: 'Child did not respond', isSelected: false},
      {key: 'Child responded incorrectly', isSelected: false},
    ];

    console.log('res manage 283', res);
    for (const obj of res) {
      const ob = {};
      ob.key = obj.promptName;
      ob.isSelected = false;
      ob.id = obj.id;
      temp.push(ob);
      this.setState({incorrectData: temp.concat(fixed)});
    }
  };

  getSessionTargets(studentId, sessionId) {
    let vars = {
      sessionId: sessionId,
    };
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    console.log('TARGETS FOR SESSIONID ID --->' + sessionId);
    ParentRequest.getSessionTargetsBySessionId(vars)
      .then((res) => {
        let data = res.data;

        // console.log(
        //   'data session target screen 280===========================================================================================================',
        //   JSON.stringify(data),
        // );

        if (data.getsession.targets.edges) {
          let targetLength = Object.keys(data.getsession.targets.edges).length;
          let allEdges = data.getsession.targets.edges;
          allEdges.map((edge) => {
            edge.node.trialsInfo = [];
          });

          let durationStartTime = this.state.showTimer;
          this.setState(
            {
              targetList: allEdges,
              targetsCount: targetLength,
              durationStartTime: durationStartTime,
              isContentLoaded: true,
            },
            () => {
              this.fetchThumbnail();
              console.log(
                'Target List -->' + JSON.stringify(this.state.targetList),
              );
              //this.populateSessionTargets();
            },
          );

          this.setTrailBoxes(targetLength);
        }

        if (data.getChildSession.edges.length > 0) {
          const milli = data.getChildSession.edges[0].node.duration;
          var seconds = parseInt(milli / 1000);

          this.setState({
            sessionTypeID:
              data?.getChildSession?.edges[0]?.node?.sessions?.sessionName?.id,
          });

          if (data.getChildSession.edges[0].node.status === 'COMPLETED') {
            let pSeconds = (seconds % 60) + '';
            if (pSeconds.length < 2) {
              pSeconds = '0' + pSeconds;
            }
            let sec = pSeconds;

            let pMinutes = parseInt(seconds / 60) + '';
            if (pMinutes.length < 2) {
              pMinutes = '0' + pMinutes;
            }
            let min = pMinutes;
            let totalDuration = min + ' : ' + sec;
            this.setState(
              {
                showTimer: totalDuration,
                totalSeconds: seconds,
                status: 'COMPLETED',
              },
              () => this.startTimer(seconds),
            );
          } else {
            this.startTimer(seconds);
          }
        } else {
          this.startTimer(0);
        }
      })
      .catch((err) => {
        this.setState({loading: false, isContentLoaded: true});
      });
  }

  populateSessionTargets() {
    //Pre populate all the targets first two items
    this.state.targetList.forEach((target, index) => {
      this.getTargetSessionRecordings(
        this.state.parentSessionInfo.id,
        target?.node?.id,
        index,
      );
    });
  }

  fetchThumbnail() {
    this.setState({
      currentThumbnail: null,
    });
    let currentTarget = this.state.targetList[this.state.currentTargetIndex];
    if (currentTarget && currentTarget.node.videos.edges.length > 0) {
      let videoNode = currentTarget.node.videos.edges[0];
      let videoUrl = videoNode.node.url;
      let videoId = videoUrl != undefined ? videoUrl.split('/')[3] : '';

      let url = `https://player.vimeo.com/video/${videoId}/config`;
      console.log('URL', url);
      axios
        .get(url)
        .then((result) => {
          let res = result.data;
          this.setState({
            currentThumbnail: res.video.thumbs.base,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            currentThumbnail: null,
          });
        });
    } else {
      console.log('Video is empty');
    }
  }

  getVideoInfo() {
    let currentTarget = this.state.targetList[this.state.currentTargetIndex];
    if (currentTarget.node.videos.edges.length > 0) {
      let videoNode = currentTarget.node.videos.edges[0];
      let videoUrl = videoNode.node.url;
      let finalUrl = '';
      let splitList = [];
      let videoId = '';

      console.log('videoUrl', videoUrl);

      this.props.navigation.navigate('SessionTargetOverlay', {
        title: currentTarget.node.targetAllcatedDetails.targetName,
        videoUrl: videoUrl,
      });
    } else {
      Alert.alert('Information', 'No videos found for this target');
    }
  }

  renderVideoPlayer() {
    let {targetList, videoUrl} = this.state;
    let currentTarget = targetList[this.state.currentTargetIndex];
    let isVideoAvailable = false;
    if (currentTarget && currentTarget.node.videos.edges.length > 0) {
      isVideoAvailable = true;
    }

    let videoMetaData = UrlParser.parse(videoUrl);
    let videoHeight = (screenWidth * 165) / 295;

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.isVideoPlayVisible}
        onRequestClose={() => {
          this.setState({isVideoPlayVisible: false});
        }}>
        <SafeAreaView
          style={{
            width: '100%',
            height:
              OrientationHelper.getDeviceOrientation() == 'landscape'
                ? '90%'
                : 320,
            backgroundColor: Color.white,
          }}>
          <NavigationHeader
            backPress={() => this.setState({isVideoPlayVisible: false})}
            title="Video Instruction"
          />
          <Container>
            <Text
              style={{color: Color.black, fontSize: 16, marginVertical: 10}}>
              {this.state.videoTitle}
            </Text>

            {videoMetaData?.provider == 'youtube' && videoUrl && (
              <YoutubePlayer url={videoUrl} height={videoHeight} />
            )}
            {videoMetaData?.provider == 'vimeo' && videoUrl && (
              <VimeoPlayer url={videoUrl} height={videoHeight} />
            )}

            {/*{isVideoAvailable && <Video source={{ uri: videoUrl }} controls={true} style={styles.video} resizeMode='cover' />}*/}
            {/* <WebView containerStyle={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}
								 scalesPageToFit={true}
								 source={{uri: videoUrl}}
								 javaScriptEnabled={true}
								 domStorageEnabled={true}
								 mediaPlaybackRequiresUserAction={true}
								 automaticallyAdjustContentInsets={false}


								 style={{
									 flex:1,
									 alignSelf: 'stretch',
									 width: Dimensions.get('window').width - 32,
									 height:OrientationHelper.getDeviceOrientation() == 'landscape' ?
										 Dimensions.get('window').height/1.4  : Dimensions.get('window').height/5 ,
									 backgroundColor: 'white',marginTop:OrientationHelper.getDeviceOrientation() == 'landscape' ?
										 30 : 10,
								 }}
						/> */}
            {!isVideoAvailable && <NoData>No Video Available</NoData>}
          </Container>
        </SafeAreaView>
      </Modal>
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    BackgroundTimer.stopBackgroundTimer();
  }

  handleBackButtonClick() {
    this.setState({isShowBehaviour: false, showDataRecordingModal: false});
    return true;
  }
  renderLoading() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          size="large"
          color="black"
          style={{
            zIndex: 99999,
            opacity: 0.5,
            height: screenHeight,
            backgroundColor: '#ccc',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />
      );
    } else {
      return null;
    }
  }

  goBack() {
    if (!this.state.fromEdit) {
      this.setState({isExitVisible: true});
    } else {
      this.props.navigation.goBack();
    }
    // this.props.navigation.goBack();
  }

  startTimer(seconds) {
    let self = this;
    BackgroundTimer.runBackgroundTimer(() => {
      ++seconds;
      let pSeconds = (seconds % 60) + '';
      //console.log(pSeconds);
      if (pSeconds.length < 2) {
        pSeconds = '0' + pSeconds;
      }
      let sec = pSeconds;

      let pMinutes = parseInt(seconds / 60) + '';
      if (pMinutes.length < 2) {
        pMinutes = '0' + pMinutes;
      }
      let min = pMinutes;

      let totalDuration = min + ' : ' + sec;
      self.setState({showTimer: totalDuration, totalSeconds: seconds});
    }, 1000);
  }

  setTrailBoxes(targetsLength) {
    for (let index = 0; index < targetsLength; index++) {
      let dailyTrails = this.state.targetList[index].node.targetAllcatedDetails
        .DailyTrials;
      if (dailyTrails === 0) {
        dailyTrails = 1;
      }
      if (index == 0) {
        this.setState({
          currentTrialNumber: 1,
          totalTrials: dailyTrails,
          currentTargetInstructions: this.state.targetList[index].node
            .targetInstr,
          isInstrVisible: false,
        });
      }
      for (let i = 0; i < dailyTrails; i++) {
        this.state.targetList[index].node.trialsInfo.push({
          result: '',
          isFilled: false,
          inCorrectOptionIndex: -1,
          sessionRecord: {},
        });
      }
    }
    this.setState({loading: false, isContentLoaded: true});
    this.getPeakType();
  }

  getPeakType() {
    let {route} = this.props;

    let studentId = route.params.student.parent?.id;
    if (!studentId) {
      studentId = route.params.student.id;
    }
    let variables = {
      user: studentId,
    };

    ClinicRequest.getProfileSetting(variables)
      .then((profileData) => {
        if (profileData.data.userSettings.edges.length > 0) {
          this.setState(
            {
              peakType: profileData.data.userSettings.edges[0].node
                .peakAutomaticBlocks
                ? 'automatic'
                : 'default',
            },
            () => {
              this.getTargetSessionRecordings(
                this.state.parentSessionInfo.id,
                this.state.targetList[0].node.id,
                this.state.currentTargetIndex,
              );
            },
          );
        } else {
          this.getTargetSessionRecordings(
            this.state.parentSessionInfo.id,
            this.state.targetList[0].node.id,
            this.state.currentTargetIndex,
          );
          this.setState({peakType: false});
        }
      })
      .catch((error) => {
        this.setState({isLoading: false});
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[0].node.id,
          this.state.currentTargetIndex,
        );
      });
  }

  getPreviousRecordingsAll(childSessionId, targetId, currentTargetIndex) {
    console.log(':childsession id', childSessionId);
    let params = {
      childSession: childSessionId,
      sessiondate: this.state.date,
      targets: targetId,
    };
    // console.log("params>>>",params);
    return client
      .query({
        query: getAllPreviousRecordings,
        fetchPolicy: 'no-cache',
        variables: params,
      })
      .then((result) => {
        return result.data;
      });
  }
  getCurrentSessionRecordings(childSessionId, targetId, currentTargetIndex) {
    console.log('childSessionId>>>>', childSessionId, targetId);
    return client
      .query({
        query: getTargetIdSessionRecordings,
        fetchPolicy: 'no-cache',
        variables: {
          childSessionId: childSessionId,
          targetId: targetId,
        },
      })
      .then((result) => {
        console.log('>>>>>>', JSON.stringify(result));
        return result.data;
      });
  }

  getTargetSessionRecordings(childSessionId, targetId, currentTargetIndex) {
    let targetQuery;
    if (this.state.date) {
      targetQuery = this.getPreviousRecordingsAll(
        childSessionId,
        targetId,
        currentTargetIndex,
      );
    } else {
      targetQuery = this.getCurrentSessionRecordings(
        childSessionId,
        targetId,
        currentTargetIndex,
      );
    }
    targetQuery
      .then((data) => {
        let dr = 0;
        data.getSessionRecordings?.edges?.length > 0
          ? data.getSessionRecordings.edges[0].node?.behaviourRecording?.edges?.map(
              ({node}) => {
                return (dr += node.end - node.start);
              },
            )
          : 1;
        console.log('recording Duration>>>>',data.getSessionRecordings.edges[0].node.status.statusName, Math.round(dr / 1000));
        this.setState({
          loading: false,
          scoreLoading:false,
          behRec:
            data.getSessionRecordings?.edges?.length > 0
              ? data.getSessionRecordings.edges[0].node.behaviourRecording
              : undefined,
          Frequency:
            data.getSessionRecordings?.edges?.length > 0
              ? data.getSessionRecordings.edges[0].node?.behaviourRecording
                  ?.edges?.length
              : 0,
          recordingDuration: Math.round(dr / 1000),
        });

        let targetList = this.state.targetList;
        let trialsInfo = targetList[currentTargetIndex].node.trialsInfo;
        let sdLength = targetList[currentTargetIndex].node?.sd?.edges?.length;
        let stepsLength =
          targetList[currentTargetIndex].node?.steps?.edges?.length;
        let trialsInfoLength = trialsInfo.length;
        if (
          data.getSessionRecordings.edges &&
          data.getSessionRecordings.edges.length > 0
        ) {
          //console.log("session recordings before --->" + JSON.stringify(data.getSessionRecordings.edges[1].node.sessionRecord.edges))
          let sessRecordings =
            data.getSessionRecordings.edges.length > 1
              ? data.getSessionRecordings.edges[1].node.sessionRecord.edges
              : data.getSessionRecordings.edges[0].node.sessionRecord.edges;
          let sessRecordLength = sessRecordings.length;
          this.setState({
            allMastery:
              data.getSessionRecordings.edges[0].node.targets.mastery.edges,
            statusName:
              data.getSessionRecordings.edges[0].node.status.statusName,
          });
          if (sdLength > 0) {
            let stimulusId = this.getStimulusId();
            let allStimData = sessRecordings;
            let filterData = allStimData.filter(
              (e) => e.node.sd.id === stimulusId,
            );
            sessRecordings = filterData;
            sessRecordLength = filterData.length;
          } else if (stepsLength > 0) {
            let stepId = this.getStepId();
            let allStimData = sessRecordings;
            let filterData = allStimData.filter(
              (e) => e.node.step.id === stepId,
            );
            sessRecordings = filterData;
            sessRecordLength = filterData.length;
          }
          if (trialsInfoLength >= sessRecordLength) {
            for (let i = 0; i < trialsInfoLength; i++) {
              if (sessRecordLength > i) {
                trialsInfo[i].sessionRecord = sessRecordings[i].node;
                if (sessRecordings[i].node && sessRecordings[i].node.id) {
                  console.log(
                    'In trial x  -->' +
                      JSON.stringify(sessRecordings[i].node.trial),
                  );
                  if (sessRecordings[i].node.trial == 'CORRECT') {
                    trialsInfo[i].result = 'positive';
                    trialsInfo[i].isFilled = true;
                  } else if (sessRecordings[i].node.trial == 'PROMPT') {
                    trialsInfo[i].result = 'negative';
                    trialsInfo[i].isFilled = true;
                  } else if (
                    sessRecordings[i].node.trial == 'NORESPONSE' ||
                    sessRecordings[i].node.trial == 'INCORRECT' ||
                    sessRecordings[i].node.trial == 'ERROR'
                  ) {
                    trialsInfo[i].result = 'nuetral';
                    trialsInfo[i].isFilled = true;
                  }
                }
              } else {
                trialsInfo[i].sessionRecord = {};
                trialsInfo[i].result = '';
                trialsInfo[i].isFilled = false;
              }
            }
          } else {
            let index = sessRecordLength - 1;
            for (let j = 0; j < trialsInfoLength; j++) {
              trialsInfo[j].sessionRecord = sessRecordings[index].node;
              if (sessRecordings[index].node && sessRecordings[index].node.id) {
                if (sessRecordings[index].node.trial === 'CORRECT') {
                  trialsInfo[j].result = 'positive';
                  trialsInfo[j].isFilled = true;
                } else if (
                  sessRecordings[index].node.trial === 'ERROR' ||
                  sessRecordings[index].node.trial == 'NORESPONSE'
                ) {
                  trialsInfo[j].result = 'nuetral';
                  trialsInfo[j].isFilled = true;
                  trialsInfo[j].inCorrectOptionIndex = 0;
                }
              }
              index--;
            }
          }

          console.log(
            'In session recordings previous recording -->' +
              JSON.stringify(sessRecordings),
          );

          targetList[currentTargetIndex].node.trialsInfo = trialsInfo;
          if (
            targetList[currentTargetIndex] != undefined &&
            targetList[currentTargetIndex].node.targetAllcatedDetails.targetType
              .typeTar === 'Peak'
          ) {
            if (this.state.peakType == 'automatic') {
              // console.log('Inside peak type automatic-->');
              this.getAutomaticPeak(childSessionId, targetId);
            } else {
              console.log(
                'Inside peak type not automatic targetindex-->' +
                  currentTargetIndex,
              );

              let peakRecord =
                data.getSessionRecordings.edges[0].node.peak.edges;
              let totalScore = 0;
              if (peakRecord.length > 0) {
                peakRecord.map((item, index) => {
                  const trials = item.node.trial.edges;
                  if (trials.length > 0) {
                    trials.map((item) => {
                      totalScore = totalScore + item.node.marks;
                    });
                  }
                });
                const trials =
                  peakRecord[this.state.currentPeakStimIndex] != undefined
                    ? peakRecord[this.state.currentPeakStimIndex].node.trial !=
                      undefined
                      ? peakRecord[this.state.currentPeakStimIndex].node.trial
                          .edges
                      : []
                    : [];
                this.setState({
                  currentPeak: peakRecord,
                  totalMarks: totalScore,
                  currentPeakTrial: this.state.currentPeakTrial,
                });
              }
              let block = this.state.targetList[this.state.currentTargetIndex]
                .node.peakBlocks;
              let arr = [];
              for (let i = 0; i < block; i++) {
                arr.push({
                  block: this.createStimulusList(
                    targetList[currentTargetIndex].node.sd.edges,
                  ),
                });
              }
              this.setState({peakAllSd: arr});

              this.setState({
                targetList: targetList,
                currentTrialNo: sessRecordLength,
                currentPeakSkillId: data.getSessionRecordings.edges[0].node.id,
              });
              console.log(
                'state currentPeak trial before -->' +
                  this.state.currentPeakTrial,
              );
            }
          }
          if (
            targetList[currentTargetIndex] != undefined &&
            targetList[currentTargetIndex].node.targetAllcatedDetails.targetType
              .typeTar === 'Skill Based Treatment'
          ){
            console.log(">>>>>>>>>>sbt>>",data.getSessionRecordings.edges[0].node.isBehReduction);
            if (data.getSessionRecordings.edges[0].node.isBehReduction) {
              // write logic for sbt recording updation on local object
              console.log(">>>>inside>>>",data.getSessionRecordings);
              if (data.getSessionRecordings.edges[0].node.behReduction.edges.length > 0) {
              console.log(">>>>*****inside>>>",data.getSessionRecordings.edges[0].node.behReduction.edges,targetList[currentTargetIndex].node?.sbtSteps,data.getSessionRecordings.edges[0].node.behReduction);

                      let sbtStep={}
                      if(targetList[currentTargetIndex].node?.sbtSteps?.edges.length>0 ){
                        for (let k = 0; k < targetList[currentTargetIndex].node.sbtSteps.edges.length; k++) {
                          sbtStep[
                            targetList[currentTargetIndex].node.sbtSteps.edges[k].node.id
                          ] = []
                        }
                      }

                      console.log("sbtStep>>>",sbtStep);
                      data.getSessionRecordings.edges[0].node.behReduction.edges.map(recordingItem => {
                      console.log("sbtStep>>>",recordingItem.node.sbtStep.id);
                        
                          sbtStep[recordingItem.node.sbtStep.id] = [
                            ...sbtStep[
                              recordingItem.node.sbtStep.id
                            ],
                            recordingItem.node,
                          ]
                      console.log("sbtStep>>>",sbtStep);
                        
                      })
                      targetList[currentTargetIndex].node={
                        ...targetList[currentTargetIndex].node,
                        sbt:sbtStep,
                        isBehReduction:true,
                        
                      }

                      console.log("targetList for sbt>>",targetList[currentTargetIndex].node.sbt);
                // data.getSessionRecordings.edges[0].node.behReduction.edges.map(recordingItem => {
                //   sbtStep={
                //     `${recordingItem.node.sbtStep.id}`:recordingItem.node
                //   }
                   
                  
                // })
              }
            }
            // console.log("targetList>>>",targetList[currentTargetIndex]);
          this.setState({
            targetList:targetList,
            SBTStepActiveId:targetList[currentTargetIndex].node?.sbtSteps?.edges[0].node?.id,
          })

          }
          if (
            targetList[currentTargetIndex] != undefined &&
            targetList[currentTargetIndex].node.targetAllcatedDetails.targetType
              .typeTar === 'Peak' &&
            targetList[currentTargetIndex].node.peakType == 'EQUIVALENCE'
          ) {
            console.log(
              'equi code xy -->' + targetList[currentTargetIndex].node.eqCode,
            );
            console.log(
              'classes --->' +
                JSON.stringify(targetList[currentTargetIndex].node.classes),
            );
            //this.getPeakEquivalenceTargetType(targetList[currentTargetIndex].node.
            //targetId.id)
            let eqCode = targetList[currentTargetIndex]?.node?.eqCode
              ? targetList[currentTargetIndex]?.node?.eqCode
              : '1A';
            let classes = targetList[currentTargetIndex].node.classes;

            this.setState({totalClasses: classes.edges});

            let recordings = data?.getSessionRecordings?.edges;
            console.log('classindex', this.state.classIndex);
            console.log('classes', classes);

            let recordedData =
              recordings[recordings.length - 1]?.node?.peakEquivalance?.edges;

            let filteredTrainRecorded = recordedData.filter(
              (item) => item?.node?.recType === 'TRAIN',
            );

            let filteredTestRecorded = recordedData.filter(
              (item) => item?.node?.recType === 'TEST',
            );

            let tempArr = recordedData.map((item) => {
              if (this.state.isTrain) {
                if (
                  classes?.edges[this.state.classIndex]?.node?.id ===
                    item?.node?.codeClass?.id &&
                  item?.node?.recType === 'TRAIN'
                ) {
                  let node = {score: item?.node?.score, id: item?.node?.id};
                  return {node};
                }
              } else {
                if (
                  classes?.edges[this.state.classIndex]?.node?.id ===
                    item?.node?.codeClass?.id &&
                  item?.node?.recType === 'TEST'
                ) {
                  let node = {score: item?.node?.score, id: item?.node?.id};
                  return {node};
                }
              }
            });

            console.log(tempArr);
            tempArr = tempArr.filter((item) => item && item?.node);

            this.setState({
              peakEquiRecord: tempArr,
              peakEquiClassRecord: this.state.isTrain
                ? filteredTrainRecorded
                : filteredTestRecorded,
            });

            this.getPeakEquivalenceTargetType(eqCode, classes);
          }

          if (
            targetList[currentTargetIndex] != undefined &&
            targetList[currentTargetIndex].node.targetAllcatedDetails.targetType
              .typeTar === 'Time Circle'
          ) {
            this.getCircleLearnerRecord(targetList[currentTargetIndex].node.id);
          }
          this.setupBorder(currentTargetIndex);
          this.setResponseCounts(currentTargetIndex);
        } else {
          if (
            targetList[currentTargetIndex] != undefined &&
            targetList[currentTargetIndex].node.targetAllcatedDetails.targetType
              .typeTar === 'Peak' &&
            this.state.peakType != 'automatic'
          ) {
            this.createSessionPeak(
              targetId,
              childSessionId,
              targetList[currentTargetIndex].node.targetStatus.id,
            );
          }
          if (this.state.peakType == 'automatic') {
            this.getAutomaticPeak(childSessionId, targetId);
          }
          this.setState({currentTrialNo: 0});
        }
      })
      .catch((error) => {
        this.setState({loading: false});
      });
  }
  getAutomaticPeak(childSessionId, targetId) {
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    client
      .query({
        query: getAutomatic,
        fetchPolicy: 'no-cache',
        variables: {
          target: targetId,
          childSession: childSessionId,
          start: startTimeInSeconds,
          end: endTimeInSeconds,
        },
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        let peakRecord = data.peakBlockAutomatic.skill.peak.edges;
        let totalScore = 0;
        if (peakRecord.length > 0) {
          peakRecord.map((item, index) => {
            const trials = item.node.trial.edges;
            if (trials.length > 0) {
              trials.map((item) => {
                totalScore = totalScore + item.node.marks;
              });
            }
          });
        }
        this.setState({peakAllSd: peakRecord, totalMarks: totalScore});
        this.setState({currentPeakSkillId: data.peakBlockAutomatic.skill.id});
      })
      .catch((error) => {
        this.setState({loading: false, isContentLoaded: true});
      });
  }

  getTargetGraphData(targetId) {
    let {targetList, currentTargetIndex} = this.state;
    let sdLength = targetList[currentTargetIndex]?.node?.sd?.edges?.length;
    let stepsLength = targetList[currentTargetIndex].node?.steps?.edges?.length;
    let stimulusId = '';
    let stepId = '';
    if (sdLength > 0) {
      stimulusId = this.getStimulusId();
      console.log('Stimulus id is peak test 123--->' + stimulusId);
    }
    if (stepsLength > 0 && sdLength === 0) {
      stepId = this.getStepId();
    }
    // this.setState({
    //   isChart: true,
    //   dataSets: [],
    // });
    console.log('Target Id --->' + targetId);
    let params = {
      target: targetId,
      sd: stimulusId,
      step: stepId,
      sessionType: this.state.sessionTypeID,
    };
    console.log('this.props', this.props);
    console.log(
      'params for stimulus check again 12 steps-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*' +
        JSON.stringify(params),
    );
    client
      .query({
        query: getGraphData,
        fetchPolicy: 'no-cache',
        variables: params,
      })
      .then((result) => {
        console.log('Graph data for steps -->' + JSON.stringify(result));
        return result.data;
      })
      .then((data) => {
        console.log(data);
        console.log(this.state.targetList[this.state.currentTargetIndex]);
        let isPeakTarget = false;
        let isBehaviorRecordingTarget=false;    

        if (
          this.state.targetList[this.state.currentTargetIndex]?.node?.targetAllcatedDetails.targetType.id === peakId
        ) {
          isPeakTarget = true;
          this.setState({
            isBehRecordingType:false,
            isPeakType:true
          })

        }
        else if(this.state.targetList[this.state.currentTargetIndex]?.node?.targetAllcatedDetails.targetType.id ===
          behaviorRecordingId){
            isBehaviorRecordingTarget=true
            this.setState({
              isBehRecordingType:true,
              isPeakType:false
            })
          }
          else{
            this.setState({
              isBehRecordingType:false,
              isPeakType:false
            })
          }

        this.setState({isChartLoaded: false});
        let correctPercent = [];
        let errorPercent = [];
        let promptPercent = [];
        let date = [];
        const fr = []
        const dur = []
        const rate=[]
        let year=''
        if (isPeakTarget) {
          data.get5dayPercentage2.reverse().map((item, index) => {
            if (index < 5) {
              correctPercent.push(item.correctPercent);
              errorPercent.push(item.errorPercent);
              promptPercent.push(item.promptPercent);
              date.push(item.date);
            }
          });
        }
        if(isBehaviorRecordingTarget){
       
          data.get5dayPercentage2?.reverse().map((item,index) => {
            if(index > 4){
              return
            }
            fr.push(item.behRec.length)
            let durationCount = 0
            let rateCount=0
            if (item.behRec.length > 0) {
              item.behRec.map(item2 => {
                let r=0
                durationCount += (item2.end - item2.start)     
                rateCount += ((item2.frequency*1000)/durationCount)

              })
              
            }
            let r=item.behRec?.length>0 ? ((parseInt(item.behRec.length)*1000)/durationCount).toFixed(3): 0
            dur.push((durationCount / 1000).toFixed())
            rate.push(r==='Infinity'? 0 :r)
            date.push(moment(item.date).format('DD-MM'));
            year=moment(item.date).format('YYYY')

          })
          this.setState({
            frGraph:fr.reverse(),
            drGraph:dur.reverse(),
            rateGraph:rate.reverse(),
            xAxis:date.reverse(),
            isChart:true,
            labelYear:year
          })

        } else {
          data.get5dayPercentage2.reverse().map((item, index) => {
            if (index < 5) {
              correctPercent.push(item.correctPercent);
              errorPercent.push(item.incorrectPercent + item.noResponsePercent);
              promptPercent.push(item.promptPercent);
              date.push(item.date);
            }
          });
        }
        if(!this.state.isBehRecordingType){

          
        const splitted = [];
        date.reverse().map((d) => {
          const f = d.split('-')[1];
          const s = d.split('-')[2];
          const y = d.split('-')[0];
          this.setState({labelYear: y});
          if (splitted.length < 5) {
            splitted.push(s + '-' + f);
          }
        });

        console.log('date after split', splitted);
        const tempSplitted = splitted.reverse();

        let value1 = [];
        let value2 = [];
        let value3 = [];
        for (let i = 0; i < 5; i++) {
          //const total = correctPercent[i] + errorPercent[i] + promptPercent[i]
          value1.push({y: correctPercent[i], x: splitted[i]});
          value2.push({y: errorPercent[i], x: splitted[i]});
          value3.push({y: promptPercent[i], x: splitted[i]});
        }

        let dataSets = [
          {
            name: 'Correct',
            data: value1.reverse(),
            color: '#8ACA2B',
            lineWidth: 5,
          },
          {
            name: 'Incorrect',
            data: value2.reverse(),
            color: 'red',
            lineWidth: 5,
          },
          {
            name: 'Prompt',
            data: value3.reverse(),
            color: '#FFC166',
            lineWidth: 5,
          },
        ];
        console.log('Inside peak showgraph>>>>',dataSets);
        this.setState(
          {
            dataSets: dataSets,
            isChart: true,
            xAxis: splitted,
          },
          () => {
            console.log('Inside peak showgraph -->' + this.state.isChart);
          },
        );
        }     
      })
      .catch((error) => {
        this.setState({loading: false, isContentLoaded: true, isChart: true});
      });
  }
  //peak equivalence api
  getPeakEquivalenceTargetType(eqCode, classes) {
    const {targetList, currentTargetIndex} = this.state;

    let eqTarget = {
      id: eqCode,
      classes: classes,
    };
    this.setState({equiTarget: eqTarget});
    // this.getPeakEquRecord();
    // this.getPeakEquClassRecord();

    /*let variables = {
			target: targetId,
		}
		console.log('Peak and equivalence target -->' + JSON.stringify(variables))
		ClinicRequest.getPeakEquiByTargetId(variables).then(resultData => {
			console.log('result data -->' + JSON.stringify(resultData.data))
			this.setState({ equiTarget: resultData.data.getEquTar[0] }, () => {
				if (this.state.equiTarget) {
					this.getPeakEquRecord()
					this.getPeakEquClassRecord()
				}
			
		}).catch(error => {
			this.setState({ isLoading: false });
		});*/
  }
  recordPeakEqui(score) {
    const {
      equiTarget,
      classIndex,
      isTrain,
      targetList,
      currentTargetIndex,
      parentSessionInfo,
      combinationCode,
      peakEquiRecord,
      peakEquTarget,
    } = this.state;

    console.log('currenttargetindex', this.state.currentTargetIndex);
    console.log('targetlist', targetList);
    console.log('equiTarget', equiTarget);

    console.log(peakEquiRecord);
    // let variables = {
    //   session: this.state.parentSessionInfo.id,
    //   target: this.state.targetList[this.state.currentTargetIndex].node.id,
    //   code: equiTarget.id,
    //   codeClass: equiTarget.classes.edges[classIndex].node.id,
    //   recType: isTrain ? 'Train' : 'Test',
    //   score: score,
    // };

    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );

    let variables = {
      targets: targetList[currentTargetIndex]?.node?.id,
      childsession: parentSessionInfo.id,
      status: targetList[currentTargetIndex]?.node?.targetStatus?.id,
      isPeakEquivalance: true,
      sessionRecord: [],
      peakEquivalance: [
        {
          score: score,
          recType: isTrain ? 'Train' : 'Test',
          durationEnd: endTimeInSeconds * 1000,
          durationStart: startTimeInSeconds * 1000,
          codeClass: equiTarget?.classes?.edges[classIndex]?.node?.id,
          relationTest: isTrain
            ? ''
            : combinationCode[0]?.node?.test?.edges[0]?.node?.id,
          relationTrain: isTrain
            ? combinationCode[0]?.node?.train.edges[0]?.node?.id
            : '',
        },
      ],
    };

    console.log(variables);
    ClinicRequest.recordPeakEquiTarget(variables)
      .then((resultData) => {
        console.log(resultData);
        let node = {
          score,
          id:
            resultData?.data?.sessionRecording?.details?.peakEquivalance
              ?.edges[0]?.node?.id,
        };

        peakEquiRecord.push({node});

        console.log(this.state.totalClasses.length);
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[this.state.currentTargetIndex].node.id,
          this.state.currentTargetIndex,
        );
        this.setState({peakEquiRecord}, () => {
          if (peakEquTarget < 10) {
            this.setState({peakEquTarget: peakEquTarget + 1});
          } else if (classIndex < this.state.totalClasses.length - 1) {
            this.setState({classIndex: classIndex + 1}, () => {
              this.setState({peakEquTarget: 1});
            });
          } else if (
            classIndex === this.state.totalClasses.length - 1 &&
            this.state.isTrain
          ) {
            this.setState({
              isEquiRecord: false,
              peakEquTarget: 1,
              isTrain: false,
              classIndex: 0,
            });
          } else {
            this.setState({
              isEquiRecord: false,
              peakEquTarget: 1,
              currentTargetIndex: this.state.currentTargetIndex + 1,
            });
          }
        });

        // this.getPeakEquRecord();
        // this.getPeakEquClassRecord();
      })
      .catch((error) => {
        console.log(error);
        console.log(JSON.stringify(error));

        this.setState({isLoading: false});
      });
  }
  updatePeakEqui(id, score) {
    console.log('Inside update peak equi id-->' + id);
    console.log('Inside update peak equi score-->' + score);

    const {
      equiTarget,
      classIndex,
      isTrain,
      peakEquTarget,
      peakEquiRecord,
    } = this.state;
    let variables = {
      pk: id,
      score: score,
    };

    console.log(variables);
    ClinicRequest.updatePeakEquiRecord(variables)
      .then((resultData) => {
        let node = {score, id: id};
        peakEquiRecord.splice(peakEquTarget - 1, 1);

        peakEquiRecord.splice(peakEquTarget - 1, 0, {node});

        console.log(peakEquiRecord);
        this.setState(peakEquiRecord);
        // this.getPeakEquRecord();
        // this.getPeakEquClassRecord();
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.setState({isLoading: false});
      });
  }
  getPeakEquRecord() {
    const {equiTarget, classIndex, isTrain} = this.state;
    let variables = {
      session: this.state.parentSessionInfo.id,
      target: this.state.targetList[this.state.currentTargetIndex].node.id,
      code: equiTarget.id,
      codeClass: equiTarget.classes.edges[classIndex].node.id,
      recType: isTrain ? 'Train' : 'Test',
    };

    console.log(variables);

    ClinicRequest.getPeakEquRecord(variables)
      .then((resultData) => {
        console.log(
          'In get getPeakEquRecord result ---->' + JSON.stringify(resultData),
        );

        this.setState({
          peakEquiRecord: resultData.data.getPeakEquRecording.edges,
        });
      })
      .catch((error) => {
        this.setState({isLoading: false});
      });
  }
  getPeakEquClassRecord() {
    const {equiTarget, classIndex, isTrain} = this.state;

    let variables = {
      session: this.state.parentSessionInfo.id,
      target: this.state.targetList[this.state.currentTargetIndex].node.id,
      code: equiTarget.id,
      recType: isTrain ? 'Train' : 'Test',
    };
    ClinicRequest.getPeakEquClassRecord(variables)
      .then((resultData) => {
        console.log(
          'In get getPeakEquRecord class result ---->' +
            JSON.stringify(resultData),
        );

        this.setState({
          peakEquiClassRecord: resultData.data.getPeakEquRecording.edges,
        });
      })
      .catch((error) => {
        this.setState({isLoading: false});
      });
  }

  getCircleLearnerRecord(id) {
    let variables = {
      target: id,
    };

    ClinicRequest.getCircleLearnerTargets(variables)
      .then((resultData) => {
        console.log('getCicleData', resultData);
      })
      .catch((error) => {
        this.setState({isLoading: false});
      });
  }

  //sessionPeak
  // shuffle peak stimulus block
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  // create peak stimulus block
  createStimulusList(list) {
    const len = list.length;
    let k = 0;
    const newList = [];
    if (len > 0) {
      for (let i = 0; i < 10; i++) {
        if (k < len) {
          newList.push({
            sd: list[k].node,
          });
          k += 1;
        } else {
          k = 0;
          newList.push({
            sd: list[k].node,
          });
          k += 1;
        }
      }
    }
    return this.shuffle(newList);
  }
  recordPeakSession(blockId, sdId, mark) {
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    client
      .query({
        query: peakRecord,
        fetchPolicy: 'no-cache',
        variables: {
          block: blockId,
          sd: sdId,
          start: startTimeInSeconds,
          end: endTimeInSeconds,
          mark: mark,
        },
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        this.handleAfterResponsePeak();
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[this.state.currentTargetIndex].node.id,
          this.state.currentTargetIndex,
        );
      })
      .catch((error) => {
        this.setState({loading: false, isContentLoaded: true});
      });
  }
  updatePeakSession(pkId, sdId, mark) {
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    const variables = {
      pkId: pkId,
      sd: sdId,
      start: startTimeInSeconds,
      end: endTimeInSeconds,
      mark: mark,
    };
    console.error('peak record params', variables);
    client
      .query({
        query: updatePeakRecord,
        fetchPolicy: 'no-cache',
        variables: variables,
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        this.handleAfterResponsePeak();
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[this.state.currentTargetIndex].node.id,
          this.state.currentTargetIndex,
        );

        console.log('Before update peak');
      })

      .catch((error) => {
        console.log('session error===', error);
        this.setState({loading: false, isContentLoaded: true});
      });
  }
  createBlock(pkId) {
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    client
      .query({
        query: createRecord,
        fetchPolicy: 'no-cache',
        variables: {
          pk: pkId,
          start: startTimeInSeconds,
          end: endTimeInSeconds,
        },
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[this.state.currentTargetIndex].node.id,
          this.state.currentTargetIndex,
        );
      })
      .catch((error) => {
        console.log('session error===', JSON.stringyf);
        this.setState({loading: false, isContentLoaded: true});
      });
  }
  createSessionPeak = (targetId, childId, typeId) => {
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    let queryParams = {
      targetId: targetId,
      childSessionId: childId,
      targetStatus: typeId,
      durationStart: startTimeInSeconds,
      durationEnd: endTimeInSeconds,
    };
    console.error('peak session record params', queryParams);
    client
      .mutate({
        mutation: createPeakSessionRecord,
        variables: queryParams,
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        this.setState({currentPeakSkillId: data.sessionRecording.details.id});
        if (this.state.peakType != 'automatic') {
          this.createBlock(data.sessionRecording.details.id);
        }
      })
      .catch((err) => {
        this.setState({loading: false});
      });
  };
  getCurrentTargetTrialsInfo() {
    return this.state.targetList[this.state.currentTargetIndex].node.trialsInfo;
    // return (<TrialProgressNew data={this.state.targetList[index].node.trialsInfo} />)
  }
  moveTrailTo(direction) {
    const {
      currentTargetIndex,
      targetList,
      currentTrialNumber,
      showTimer,
    } = this.state;

    if (direction === 'previous') {
      if (currentTrialNumber > 1) {
        this.setState({
          currentTrialNumber: currentTrialNumber - 1,
          currentTrialNo: currentTrialNumber - 1,
          durationStartTime: showTimer,
        });
        this.prePopulateIncorrectData(
          currentTrialNumber - 1,
          currentTargetIndex,
        );
      }
    } else if (direction === 'next') {
      const currentTarget =
        targetList[currentTargetIndex].node.trialsInfo[currentTrialNumber - 1];

      if (
        this.state.currentTrialNumber < this.state.totalTrials &&
        currentTarget.isFilled
      ) {
        this.setState({
          currentTrialNumber: currentTrialNumber + 1,
          currentTrialNo: currentTrialNumber + 1,
          showCorrectResponseBorder: false,
          durationStartTime: showTimer,
          showCorrectResponse: true,
        });
        this.prePopulateIncorrectData(
          currentTrialNumber + 1,
          currentTargetIndex,
        );
      }
    }
  }

  moveSBTstepTo(direction) {
    const {
      currentTargetIndex,
      targetList,
      currentTrialNumber,
      showTimer,
      SBTStepActiveIndex
    } = this.state;

    if (direction === 'previous') {
      if (SBTStepActiveIndex > 0) {
        this.setState({
          SBTStepActiveIndex: SBTStepActiveIndex - 1,
          
        });
        
      }
    } else if (direction === 'next') {
      if(SBTStepActiveIndex === targetList[currentTargetIndex].node.sbtSteps.edges.length){
        this.setState({SBTStepActiveIndex:SBTStepActiveIndex-1})
      }
      if(SBTStepActiveIndex < targetList[currentTargetIndex].node.sbtSteps.edges.length-1){
      this.setState({
        SBTStepActiveIndex: SBTStepActiveIndex + 1,
        
      });
    }
    }
  }
  setResponseCounts(targetIndex) {
    let targetList = this.state.targetList;
    let trialsInfo = targetList[targetIndex].node.trialsInfo;
    let correctResponseCount = 0;
    let inCorrectResponseCount = 0;
    let promptCount = 0;

    console.log(
      'trails info sessiontargetcreen 1412=============>',
      JSON.stringify(trialsInfo),
    );
    for (let i = 0; i < trialsInfo.length; i++) {
      if (trialsInfo[i].result === 'positive') {
        correctResponseCount++;
      } else if (
        trialsInfo[i].result === 'negative' ||
        trialsInfo[i].result === 'nuetral'
      ) {
        inCorrectResponseCount++;
      } else if (trialsInfo[i].result === 'nuetral') {
        // promptcount++
        promptCount++;
      }
    }
    this.setState({currentTargetCorrectNumer: correctResponseCount});
    if (this.correctResponseRef.current != null) {
      this.correctResponseRef.current.changeCount(correctResponseCount);
    }
    if (this.inCorrectResponseRef.current != null) {
      this.inCorrectResponseRef.current.changeCount(inCorrectResponseCount);
    }
  }
  setupBorder(currentTargetIndex) {
    let index = 0;
    let incorrectList = this.state.incorrectData;
    incorrectList.map((el, i) => (el.isSelected = false));
    let targetList = this.state.targetList;
    let trialsInfo = targetList[currentTargetIndex].node.trialsInfo;
    let trialData = trialsInfo[index];
    if (
      trialData.isFilled &&
      (trialData.result === 'negative' || trialData.result === 'nuetral')
    ) {
      this.setState({
        showInCorrectResponseBorder: true,
        showCorrectResponseBorder: false,
      });

      if (trialData.inCorrectOptionIndex > -1) {
        incorrectList[trialData.inCorrectOptionIndex].isSelected = true;
        this.setState({incorrectData: incorrectList});
      }
      if (this.correctResponseRef.current != null) {
        this.correctResponseRef.current.changeSelected(false);
      }
      if (this.inCorrectResponseRef.current != null) {
        this.inCorrectResponseRef.current.changeSelected(true);
      }
    } else if (trialData.isFilled && trialData.result === 'positive') {
      this.setState({
        showInCorrectResponseBorder: false,
        showCorrectResponseBorder: true,
      });
      if (this.inCorrectResponseRef.current != null) {
        this.inCorrectResponseRef.current.changeSelected(false);
        this.setState({showInCorrectResponseBorder: false});
      }
      if (trialData.isFilled) {
        if (this.correctResponseRef.current != null) {
          ////console.log("Setting correct response selected");
          this.correctResponseRef.current.changeSelected(true);
          this.setState({showCorrectResponseBorder: true});
        }
      } else {
        if (this.correctResponseRef.current != null) {
          ////console.log("Setting correct response selected");
          this.correctResponseRef.current.changeSelected(false);
          this.setState({showCorrectResponseBorder: false});
        }
      }
    } else if (trialData.isFilled === false) {
      this.setState({
        showInCorrectResponseBorder: false,
        showCorrectResponseBorder: false,
      });
      if (this.correctResponseRef.current != null) {
        this.correctResponseRef.current.changeSelected(false);
      }
      if (this.inCorrectResponseRef.current != null) {
        this.inCorrectResponseRef.current.changeSelected(false);
      }
    }
  }
  prePopulateIncorrectData(activeTrialNumber, currentTargetIndex) {
    this.setState({
      showCorrectResponseBorder: false,
      showInCorrectResponseBorder: false,
    });
    let incorrectList = this.state.incorrectData;
    incorrectList.map((el, i) => (el.isSelected = false));
    let i = activeTrialNumber - 1;
    let targetList = this.state.targetList;
    // let index = currentTargetIndex;
    let trialsInfo = targetList[currentTargetIndex].node.trialsInfo;
    let trialData = trialsInfo[i];
    if (
      trialData.isFilled &&
      (trialData.result === 'negative' || trialData.result === 'nuetral')
    ) {
      this.setState({
        showInCorrectResponseBorder: true,
        showCorrectResponseBorder: false,
      });
      if (trialData.inCorrectOptionIndex > -1) {
        incorrectList[trialData.inCorrectOptionIndex].isSelected = true;
        this.setState({incorrectData: incorrectList});
      }
      if (this.correctResponseRef.current != null) {
        this.correctResponseRef.current.changeSelected(false);
      }
      if (this.inCorrectResponseRef.current != null) {
        this.inCorrectResponseRef.current.changeSelected(true);
      }
    } else if (trialData.isFilled && trialData.result === 'positive') {
      this.setState({
        showInCorrectResponseBorder: false,
        showCorrectResponseBorder: true,
      });
      if (this.inCorrectResponseRef.current != null) {
        this.inCorrectResponseRef.current.changeSelected(false);
        this.setState({showInCorrectResponseBorder: false});
      }
      if (trialData.isFilled) {
        if (this.correctResponseRef.current != null) {
          ////console.log("Setting correct response selected");
          this.correctResponseRef.current.changeSelected(true);
          this.setState({showCorrectResponseBorder: true});
        }
      } else {
        if (this.correctResponseRef.current != null) {
          ////console.log("Setting correct response selected");
          this.correctResponseRef.current.changeSelected(false);
          this.setState({showCorrectResponseBorder: false});
        }
      }
    } else if (trialData.isFilled === false) {
      this.setState({
        showInCorrectResponseBorder: false,
        showCorrectResponseBorder: false,
      });
      if (this.correctResponseRef.current != null) {
        this.correctResponseRef.current.changeSelected(false);
      }
      if (this.inCorrectResponseRef.current != null) {
        this.inCorrectResponseRef.current.changeSelected(false);
      }
    }
    // this.setResponseCounts(currentTargetIndex);
  }
  showTarget(number) {
    let index = number;
    let dailyTrails = this.state.targetList[index]?.node?.targetAllcatedDetails
      .DailyTrials;
    if (dailyTrails === 0) {
      dailyTrails = 1;
    }
    this.setState({
      currentTargetIndex: index,
      currentTargetNumber: number,
      currentTrialNumber: 1,
      totalTrials: dailyTrails,
      showCorrectResponse: true,
      showCorrectResponseBorder: false,
      showInCorrectResponseBorder: false,
      currentTargetInstructions: this.state.targetList[index].node.targetInstr,
    });
    if (this.correctResponseRef.current != null) {
      this.correctResponseRef.current.changeSelected(false);
    }
    if (this.inCorrectResponseRef.current != null) {
      this.inCorrectResponseRef.current.changeSelected(false);
    }
    // this.setResponseCounts(index);
    // this.prePopulateIncorrectData(1, index); // defaults to trial 1, after ta ̰ arget changes
    this.setupBorder(index);
    this.setResponseCounts(index);

    //this.getTargetSessionRecordings(this.state.parentSessionInfo.id, this.state.targetList[index].node.id, index);
  }
  callbackTargetProgress(direction) {
    ////console.log(direction);
    if (direction === 'previous') {
      if (this.state.currentTargetNumber > 1) {
        this.showTarget(this.state.currentTargetNumber - 1);
        let index = this.state.currentTargetIndex - 1;
        let durationStartTime = this.state.showTimer;
        let dailyTrails = this.state.targetList[index].node
          .targetAllcatedDetails.DailyTrials;
        if (dailyTrails === 0) {
          dailyTrails = 1;
        }
        this.setState(
          {
            currentTargetIndex: index,
            currentTargetNumber: this.state.currentTargetNumber - 1,
            currentTrialNumber: 1,
            totalTrials: dailyTrails,
            showCorrectResponse: true,
            showCorrectResponseBorder: false,
            showInCorrectResponseBorder: false,
            currentTargetInstructions: this.state.targetList[index].node
              .targetInstr,
            durationStartTime: durationStartTime,
            stimulusCurrentIndex: 0,
            currentPeakTrial: 1,
            currentPeakStimIndex: 0,
            peakType: '',
            peakEquTarget: 1,
          },
          () => {
            this.fetchThumbnail();
          },
        );
        if (this.correctResponseRef.current != null) {
          this.correctResponseRef.current.changeSelected(false);
        }
        if (this.inCorrectResponseRef.current != null) {
          this.inCorrectResponseRef.current.changeSelected(false);
        }
        // this.setResponseCounts(index);
        // this.prePopulateIncorrectData(1, index); // defaults to trial 1, after target changes
        this.setupBorder(index);
        this.setResponseCounts(index);
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[index].node.id,
          index,
        );
      }
    } else if (direction === 'next') {
      console.log('***After calling next***', this.state.isExtraTimerRunning);
      if (this.state.targetsCount == this.state.currentTargetNumber) {
        this.completeSession();
      } else if (this.state.targetsCount > this.state.currentTargetNumber) {
        let index = this.state.currentTargetIndex + 1;

        this.showTarget(index);

        //console.log(this.state.currentTargetIndex);
        //console.log(index);
        let durationStartTime = this.state.showTimer;
        let dailyTrails = this.state.targetList[index].node
          .targetAllcatedDetails.DailyTrials;
        if (dailyTrails === 0) {
          dailyTrails = 1;
        }
        if (this.state.isExtraTimerRunning === true) {
          clearInterval(extraBackgroundTimer);
          clearInterval(thirdExtraBackgroundTimer);
        }
        // clearInterval(extraShowTimer);
        this.setState(
          {
            currentTargetIndex: index,
            currentTargetNumber: this.state.currentTargetNumber + 1,
            currentTrialNumber: 1,
            totalTrials: dailyTrails,
            showCorrectResponse: true,
            showCorrectResponseBorder: false,
            showInCorrectResponseBorder: false,
            currentTargetInstructions: this.state.targetList[index].node
              .targetInstr,
            durationStartTime: durationStartTime,
            stimulusCurrentIndex: 0,
            currentPeakTrial: 1,
            currentPeakStimIndex: 0,
            peakType: '',
            peakEquTarget: 1,
            extraShowTimer: '00 min 00 sec',
            extraTotalSeconds: 0,
            extraTimer: null,
            extraCounter: '00',
            extraMiliseconds: '00',
            extraTotalDuration: '',
            extraDurationStartTime: '',
            extraDurationEndTime: '',
            calculatedRate: '0',
            thirdShowTimer: '00 min 00 sec',
            thirdTotalSeconds: 0,
            isExtraTimerRunning: false,
            showThirdTimer: false,
            startThirdTimer: false,
            startExtraTimer: false,
            recordingDuration: '0',
            recordingFrequency: '0',
            Frequency: 0,
            startBehaviourTime: '',
            stopBehaviourTime: '',
            totalBehaviourDuration: '',
            totalBehaviourFrequency: '',
            scoreLoading:true
          },
          () => {
            this.fetchThumbnail();

            if (
              this.state.targetList[index]?.node?.peakType === 'EQUIVALENCE'
            ) {
              this.getCombinationCode();
            }

            if (
              this.state.targetList[this.state.currentTargetIndex]?.node
                ?.targetAllcatedDetails?.targetType?.typeTar ===
              'Behavior Reduction'
            ) {
              this.startBehaviourRedutionTimer(
                this.state.reductionTotalSeconds,
              );
            }
          },
        );
        if (this.correctResponseRef.current != null) {
          this.correctResponseRef.current.changeSelected(false);
        }
        if (this.inCorrectResponseRef.current != null) {
          this.inCorrectResponseRef.current.changeSelected(false);
        }
        // this.prePopulateIncorrectData(1, index); // defaults to trial 1, after target changes
        this.setupBorder(index);
        this.setResponseCounts(index);
        //console.log(index);
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[index].node.id,
          index,
        );
      }
    }
  }

  // handleAfterResponse = () => {
  //   console.error('current trail number', this.state.currentTrialNumber);
  //   console.log('Inside handle response');
  //   let {
  //     targetsCount,
  //     targetList,
  //     currentTrialNumber,
  //     totalTrials,
  //   } = this.state;
  //   let {
  //     currentTargetIndex,
  //     stimulusCurrentIndex,
  //     currentTargetNumber,
  //   } = this.state;
  //   const totalStimulus =
  //     targetList[currentTargetIndex].node?.sd?.edges?.length;

  //   let {stepsCurrentIndex} = this.state;
  //   const totalSteps =
  //     targetList[currentTargetIndex].node?.steps?.edges?.length;

  //   if (totalStimulus == 0 && totalSteps == 0) {
  //     console.log('current target index -->' + currentTargetNumber);
  //     if (currentTrialNumber < totalTrials) {
  //       this.moveTrailTo('next');
  //     }
  //     if (currentTrialNumber == totalTrials) {
  //       console.log(
  //         'current target index before calling next -->' + currentTargetNumber,
  //       );
  //       if (this.state.targetsCount != this.state.currentTargetNumber) {
  //         this.setState({currentTargetNumber: currentTargetIndex});
  //       }
  //       this.setState({isChart: false});
  //       this.callbackTargetProgress('next');
  //     }
  //   }

  //   if (totalStimulus > 0 && totalSteps == 0) {
  //     if (currentTrialNumber < totalTrials) {
  //       this.moveTrailTo('next');
  //     } else if (currentTrialNumber == totalTrials) {
  //       if (stimulusCurrentIndex + 1 < totalStimulus) {
  //         console.log('going to snap');
  //         this.setState({currentTrialNumber: 1}, () => {
  //           this._carouselStimulus.snapToNext(true, true);
  //         });
  //       } else {
  //         if (this.state.targetsCount != this.state.currentTargetNumber) {
  //           this.setState({currentTargetNumber: currentTargetIndex});
  //         }
  //         this.setState({isChart: false});
  //         this.callbackTargetProgress('next');
  //         this.setState({
  //           stepsCurrentIndex: this._carousel.currentindex,
  //           stimulusCurrentIndex: this._carouselStimulus.currentIndex,
  //         });
  //         this._carouselStimulus?.snapToItem(
  //           this._carouselStimulus.currentIndex,
  //           true,
  //           true,
  //         );
  //         this._carousel?.snapToItem(this._carousel.currentindex, true, true);
  //       }
  //     }
  //   }

  //   if (totalSteps > 0 && totalStimulus == 0) {
  //     if (stepsCurrentIndex + 1 < totalSteps) {
  //       this._carousel.snapToNext(true, true);
  //     } else {
  //       if (currentTrialNumber < totalTrials) {
  //         this.setState({stepsCurrentIndex: 0});
  //         this.moveTrailTo('next');
  //         this._carousel?.snapToItem(0, true, true);
  //       }
  //       if (currentTrialNumber == totalTrials) {
  //         if (this.state.targetsCount != this.state.currentTargetNumber) {
  //           this.setState({currentTargetNumber: currentTargetIndex});
  //         }
  //         this.setState({isChart: false});
  //         this.callbackTargetProgress('next');
  //         this.setState({stepsCurrentIndex: 0, stimulusCurrentIndex: 0});
  //         this._carouselStimulus?.snapToItem(0, true, true);
  //         this._carousel?.snapToItem(0, true, true);
  //       }
  //     }
  //   }

  //   if (totalSteps > 0 && totalStimulus > 0) {
  //     if (stimulusCurrentIndex + 1 < totalStimulus) {
  //       if (stepsCurrentIndex + 1 < totalSteps) {
  //         console.error('case called ');
  //         this._carousel.snapToNext(true, true);
  //       } else {
  //         this._carouselStimulus.snapToNext(true, true);
  //         this._carousel?.snapToItem(0, true, true);
  //         this.moveTrailTo('next');
  //       }
  //     } else {
  //       if (currentTrialNumber < totalTrials) {
  //         console.error('curremnt tril number', currentTrialNumber);
  //         this.setState({stepsCurrentIndex: this._carousel.currentIndex});
  //         this.setState({
  //           stimulusCurrentIndex: this._carouselStimulus.currentIndex,
  //         });
  //         this._carouselStimulus?.snapToItem(
  //           this._carouselStimulus.currentIndex,
  //           true,
  //           true,
  //         );
  //         this._carousel?.snapToItem(
  //           this._carousel.currentIndex + 1,
  //           true,
  //           true,
  //         );
  //         if (
  //           stimulusCurrentIndex + 1 === totalStimulus &&
  //           stepsCurrentIndex + 1 === totalSteps
  //         ) {
  //           this.moveTrailTo('next');
  //         }
  //       } else if (currentTrialNumber == totalTrials) {
  //         if (this.state.targetsCount != this.state.currentTargetNumber) {
  //           this.setState({currentTargetNumber: currentTargetIndex});
  //         }
  //         this.setState({isChart: false});
  //         this.callbackTargetProgress('next');
  //         this.setState({
  //           stepsCurrentIndex: this._carousel.currentIndex,
  //           stimulusCurrentIndex: this._carouselStimulus.currentIndex,
  //         });
  //         this._carouselStimulus?.snapToItem(
  //           this._carouselStimulus.currentIndex,
  //           true,
  //           true,
  //         );
  //         this._carousel?.snapToItem(this._carousel.currentIndex, true, true);
  //       }
  //     }
  //   }
  // };

  handleAfterResponse = () => {
    console.log('Inside handle response');
    let {
      targetsCount,
      targetList,
      currentTrialNumber,
      totalTrials,
    } = this.state;
    let {
      currentTargetIndex,
      stimulusCurrentIndex,
      currentTargetNumber,
    } = this.state;
    const totalStimulus =
      targetList[currentTargetIndex].node?.sd?.edges?.length;

    let {stepsCurrentIndex} = this.state;
    const totalSteps =
      targetList[currentTargetIndex].node?.steps?.edges?.length;

    if (totalStimulus == 0 && totalSteps == 0) {
      console.log('current target index -->' + currentTargetNumber);
      if (currentTrialNumber < totalTrials) {
        this.moveTrailTo('next');
      }
      if (currentTrialNumber == totalTrials) {
        console.log(
          'current target index before calling next -->' + currentTargetNumber,
        );
        if (this.state.targetsCount != this.state.currentTargetNumber) {
          this.setState({currentTargetNumber: currentTargetIndex});
        }
        this.setState({isChart: false});
        this.callbackTargetProgress('next');
      }
    }

    if (totalStimulus > 0 && totalSteps == 0) {
      if (currentTrialNumber < totalTrials) {
        this.moveTrailTo('next');
      } else if (currentTrialNumber == totalTrials) {
        if (stimulusCurrentIndex + 1 < totalStimulus) {
          console.log('going to snap');
          this.setState({currentTrialNumber: 1}, () => {
            this._carouselStimulus.snapToNext(true, true);
          });
        } else {
          if (this.state.targetsCount != this.state.currentTargetNumber) {
            this.setState({currentTargetNumber: currentTargetIndex});
          }
          this.setState({isChart: false});
          this.callbackTargetProgress('next');
          this.setState({stepsCurrentIndex: 0, stimulusCurrentIndex: 0});
          this._carouselStimulus?.snapToItem(0, true, true);
          this._carousel?.snapToItem(0, true, true);
        }
      }
    }

    if (totalSteps > 0 && totalStimulus == 0) {
      if (stepsCurrentIndex + 1 < totalSteps) {
        this._carousel.snapToNext(true, true);
      } else {
        if (currentTrialNumber < totalTrials) {
          this.setState({stepsCurrentIndex: 0});
          this.moveTrailTo('next');
          this._carousel?.snapToItem(0, true, true);
        }
        if (currentTrialNumber == totalTrials) {
          if (this.state.targetsCount != this.state.currentTargetNumber) {
            this.setState({currentTargetNumber: currentTargetIndex});
          }
          this.setState({isChart: false});
          this.callbackTargetProgress('next');
          this.setState({stepsCurrentIndex: 0, stimulusCurrentIndex: 0});
          this._carouselStimulus?.snapToItem(0, true, true);
          this._carousel?.snapToItem(0, true, true);
        }
      }
    }

    if (totalSteps > 0 && totalStimulus > 0) {
      if (stimulusCurrentIndex + 1 < totalStimulus) {
        if (stepsCurrentIndex + 1 < totalSteps) {
          this._carousel.snapToNext(true, true);
        } else {
          this._carouselStimulus.snapToNext(true, true);
          this._carousel?.snapToItem(0, true, true);
        }
      } else {
        if (currentTrialNumber < totalTrials) {
          this.setState({stepsCurrentIndex: 0});
          this.setState({stimulusCurrentIndex: 0});
          this.moveTrailTo('next');
          this._carouselStimulus?.snapToItem(0, true, true);
          this._carousel?.snapToItem(0, true, true);
        }
        if (currentTrialNumber == totalTrials) {
          if (this.state.targetsCount != this.state.currentTargetNumber) {
            this.setState({currentTargetNumber: currentTargetIndex});
          }
          this.setState({isChart: false});
          this.callbackTargetProgress('next');
          this.setState({stepsCurrentIndex: 0, stimulusCurrentIndex: 0});
          this._carouselStimulus?.snapToItem(0, true, true);
          this._carousel?.snapToItem(0, true, true);
        }
      }
    }
  };

  handleAfterResponsePeak() {
    const {
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      peakAllSd,
      peakType,
    } = this.state;
    const totalBlocks = peakAllSd.length;

    let trials;
    if (peakType == 'automatic' && peakAllSd.length > 0) {
      trials = peakAllSd[currentPeakStimIndex].node.trial.edges;
    } else {
      trials =
        currentPeak[currentPeakStimIndex] != undefined
          ? currentPeak[currentPeakStimIndex].node.trial != undefined
            ? currentPeak[currentPeakStimIndex].node.trial.edges
            : []
          : [];
    }
    const totalTrials = 10;

    if (currentPeakStimIndex + 1 < totalBlocks) {
      if (currentPeakTrial < totalTrials) {
        //this.managePickNextPrevious('Next')
        this.setState({currentPeakTrial: currentPeakTrial + 1});
        console.log(
          'current trial index indeide handle A -->' +
            this.state.currentPeakTrial,
        );
      } else {
        this._carouselA.snapToItem(currentPeakStimIndex + 1, true, () => {});
      }
    } else {
      if (currentPeakTrial < totalTrials) {
        this.setState({currentPeakTrial: currentPeakTrial + 1});
        //this.managePickNextPrevious('Next')
      } else {
        this.setState({currentPeakTrial: 1, currentPeakStimIndex: 0}, () => {
          if (this.state.targetsCount != this.state.currentTargetNumber) {
            this.setState({currentTargetNumber: this.state.currentTargetIndex});
          }
          this.callbackTargetProgress('next');
        });
      }
    }
  }

  reloadChart = () => {
    if (this.state.isChart) {
      this.setState({isChart: false}, () => {
        this.setState({isChart: true});
      });
    }
  };

  callbackTargetResponse = (responseType, isExpanded) => {
    ////console.log("callbackTargetResponse:"+ responseType+","+isExpanded);
    if (responseType == 'incorrect') {
      this.setState({showCorrectResponse: isExpanded});
      if (isExpanded) {
        // update
        this.setResponseCounts(this.state.currentTargetIndex);
      }
    } else if (responseType == 'correct') {
      //  Make trail as green
      this.completeTrail();
    }
  };
  completeTrail() {
    console.log('completeTrail() is called:');
    let targetList = this.state.targetList;
    let index = this.state.currentTargetIndex;
    let trialsInfo = targetList[index].node.trialsInfo;
    let trialData = trialsInfo[this.state.currentTrialNumber - 1];
    trialData.isFilled = true;
    trialData.result = 'positive';
    trialsInfo[this.state.currentTrialNumber - 1] = trialData;
    targetList[this.state.currentTargetIndex].node.trialsInfo = trialsInfo;
    let currentTrialNo = this.state.currentTrialNo;

    this.setState({
      targetList: targetList,
      showCorrectResponseBorder: true,
      showInCorrectResponseBorder: false,
    });
    if (this.inCorrectResponseRef.current != null) {
      this.inCorrectResponseRef.current.changeSelected(false);
    }
    this.removeSelectionIncorrectData();
    this.setResponseCounts(index);
    let inCorrectItemIndex = -1;
    //console.log(targetList[index].node);
    console.log('incorrect target response', targetList[index].node);
    this.doSessionRecord(targetList[index].node, 'Correct', inCorrectItemIndex);
  }
  doSessionRecord(targetNode, responseType, inCorrectItemIndex) {
    console.log('targetnode', targetNode);
    console.log('responseType', responseType);
    console.log('inCorrectItemIndex', inCorrectItemIndex);
    let trialsInfo = targetNode.trialsInfo;
    let trialData = trialsInfo[this.state.currentTrialNumber - 1];
    if (trialData.sessionRecord && trialData.sessionRecord.id) {
      // call update query
      this.updateSessionRecord(
        targetNode,
        trialData.sessionRecord.id,
        responseType,
        inCorrectItemIndex,
      );
    } else {
      // Save trial
      this.saveSessionRecord(targetNode, responseType, inCorrectItemIndex);
    }
  }
  updateSessionRecord(targetNode, trialId, responseType, inCorrectItemIndex) {
    // $trialId: ID!, $trial: String!
    this.setState({loading: true});
    let stimulusId = this.getStimulusId();
    let stepId = this.getStepId();
    let queryParams = {
      trialId: trialId,
      trial: responseType,
      sd: stimulusId,
      step: stepId,
      text: this.state.reasonText,
      indexNo: this.state.incorrectIndex,
      promptCode:
        responseType === 'Prompt'
          ? this.state.incorrectData[this.state.incorrectIndex].id
          : '',
    };
    console.log('updateSessionRecord', queryParams);
    client
      .mutate({
        mutation: updateSessionRecord,
        variables: queryParams,
        refetchQueries: [
          {
            query: getTargetIdSessionRecordings,
            variables: {
              childSessionId: this.state.parentSessionInfo.id,
              targetId: targetNode.id,
            },
            fetchPolicy: 'network-only',
          },
          {
            query: getSessionSummary,
            variables: {
              childSeesionId: this.state.parentSessionInfo.id,
            },
            fetchPolicy: 'network-only',
          },
        ],
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        this.setState({loading: false, reasonText: ''});
        if (data.updateTrial && data.updateTrial.details) {
          let targetList = this.state.targetList;
          let index = this.state.currentTargetIndex;
          let trialsInfo = targetList[index].node.trialsInfo;
          let trialData = trialsInfo[this.state.currentTrialNumber - 1];
          trialData.isFilled = true;
          trialData.inCorrectOptionIndex = inCorrectItemIndex;
          trialData.sessionRecord = data.updateTrial.details;
          trialsInfo[this.state.currentTrialNumber - 1] = trialData;
          targetList[
            this.state.currentTargetIndex
          ].node.trialsInfo = trialsInfo;
          this.setState({targetList: targetList});
        }
        console.log('Before handle response');
        this.handleAfterResponse();
      })
      .catch((err) => {
        this.setState({loading: false});
      });
  }
  getStimulusId() {
    let activeId = '';
    let {targetList, currentTargetIndex, stimulusCurrentIndex} = this.state;
    let currentTarget = targetList[currentTargetIndex];

    if (currentTarget.node.targetAllcatedDetails.targetType.typeTar == 'Peak') {
      let {
        currentPeak,
        currentPeakStimIndex,
        currentPeakTrial,
        targetList,
        peakType,
        currentPeakSdIndex,
        currentTargetIndex,
        peakAllSd,
      } = this.state;
      let sd;
      if (peakType == 'automatic') {
        sd =
          peakAllSd[currentPeakStimIndex].node.trial.edges[currentPeakSdIndex];
      } else {
        sd =
          targetList[currentTargetIndex] != undefined
            ? targetList[currentTargetIndex].node.sd.edges.length > 0
              ? targetList[currentTargetIndex].node.sd.edges[currentPeakSdIndex]
              : []
            : [];
      }
      activeId = sd?.node?.id;
    } else {
      if (
        currentTarget.node.sd &&
        currentTarget.node.sd.edges &&
        currentTarget.node.sd.edges.length > 0
      ) {
        let cStimulus = currentTarget.node.sd.edges[stimulusCurrentIndex];
        activeId = cStimulus.node.id;
      }
    }
    return activeId;
  }

  getStepId() {
    let activeId = '';
    let {targetList, currentTargetIndex, stepsCurrentIndex} = this.state;
    let currentTarget = targetList[currentTargetIndex];
    if (
      currentTarget.node.steps &&
      currentTarget.node.steps.edges &&
      currentTarget.node.steps.edges.length > 0
    ) {
      let cStep = currentTarget.node.steps.edges[stepsCurrentIndex];
      activeId = cStep.node.id;
    }
    return activeId;
  }
  saveSessionRecord(targetNode, responseType) {
    console.log('In save session record targetId-->' + targetNode.id);
    this.setState({loading: true});
    let stimulusId = '';
    let stepId = '';
    if (targetNode.sd.edges.length > 0) {
      stimulusId = this.getStimulusId();
    } else {
      stepId = this.getStepId();
    }

    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    console.log('targetnode=-=-=-=-=-=-=-=-=-==-', targetNode);
    let queryParams = {
      targetId: targetNode.id,
      childSessionId: this.state.parentSessionInfo.id,
      targetStatus: targetNode.targetStatus.id,
      trial: responseType,
      sd: stimulusId,
      step: stepId,
      durationStart: startTimeInSeconds,
      durationEnd: endTimeInSeconds,
      text: this.state.reasonText,
      indexNo: this.state.incorrectIndex,
      promptCode:
        responseType === 'Prompt'
          ? this.state.incorrectData[this.state.incorrectIndex].id
          : '',
    };
    console.log('saveSessionRecord query m -->' + JSON.stringify(queryParams));
    client
      .mutate({
        mutation: createSessionRecord,
        variables: queryParams,
        refetchQueries: [
          {
            query: getTargetIdSessionRecordings,
            variables: {
              childSessionId: this.state.parentSessionInfo.id,
              targetId: targetNode.id,
            },
            fetchPolicy: 'network-only',
          },
          {
            query: getSessionSummary,
            variables: {
              childSeesionId: this.state.parentSessionInfo.id,
            },
            fetchPolicy: 'network-only',
          },
        ],
      })
      .then((response) => {
        console.log(
          'Inside save -- child session info -->' +
            JSON.stringify(this.state.parentSessionInfo),
        );
        console.log(
          'After save -- child session info X -->' +
            JSON.stringify(response.data),
        );

        return response.data;
      })
      .then((data) => {
        this.setState({loading: false, reasonText: ''});
        let currentTrialNo = this.state.currentTrialNo;
        this.setState({
          currentTrialNo: currentTrialNo == 0 ? 1 : currentTrialNo,
        });
        if (
          data.sessionRecording &&
          data.sessionRecording.details &&
          data.sessionRecording.details.sessionRecord
        ) {
          let edges = data.sessionRecording.details.sessionRecord.edges;
          if (edges.length > 0) {
            let sessionObject = edges[edges.length - 1];
            let targetList = this.state.targetList;
            let index = this.state.currentTargetIndex;
            let trialsInfo = targetList[index].node.trialsInfo;
            let trialData = trialsInfo[this.state.currentTrialNumber - 1];
            trialData.isFilled = true;
            trialData.sessionRecord = sessionObject.node;
            trialsInfo[this.state.currentTrialNumber - 1] = trialData;
            targetList[
              this.state.currentTargetIndex
            ].node.trialsInfo = trialsInfo;
            this.setState({targetList: targetList});
          }
        }
        this.handleAfterResponse();
      })
      .catch((err) => {
        this.setState({loading: false});
      });
  }
  pauseSession() {
    this.setState({loading: true});
    let queryParams = {
      pk: this.state.parentSessionInfo.id,
      duration: this.state.totalSeconds * 1000,
    };
    client
      .mutate({
        mutation: updateChildSessionDuration,
        variables: queryParams,
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        this.setState({loading: false});
        let {navigation} = this.props;
      })
      .catch((err) => {
        this.setState({loading: false});
        Alert.alert('Information', err.toString());
      });
  }
  completeSession() {
    this.setState({loading: true});
    let queryParams = {
      pk: this.state.parentSessionInfo.id,
      duration: this.state.totalSeconds * 1000,
    };
    client
      .mutate({
        mutation: completeSessionProcess,
        variables: queryParams,
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        this.setState({loading: false});
        let {navigation} = this.props;
        navigation.navigate('SessionFeedbackScreen', {
          pageTitle: this.state.pageTitle,
          fromPage: this.state.fromPage,
          sessionId: this.state.sessionId,
          childSeesionId: this.state.parentSessionInfo.id,
          studentId: this.state.studentId,
        });
      })
      .catch((err) => {
        this.setState({loading: false});
        Alert.alert('Information', err.toString());
      });
  }
  removeSelectionIncorrectData() {
    let incorrectList = this.state.incorrectData;
    incorrectList.map((el, i) => (el.isSelected = false));
  }
  selectIncorrectItem(inCorrectItemIndex) {
    let incorrectList = this.state.incorrectData;
    incorrectList.map((el, i) => (el.isSelected = false));
    incorrectList[inCorrectItemIndex].isSelected = true;
    this.setState({incorrectData: incorrectList});

    let targetList = this.state.targetList;
    let index = this.state.currentTargetIndex;
    let trialsInfo = targetList[index].node.trialsInfo;
    let trialData = trialsInfo[this.state.currentTrialNumber - 1];
    trialData.isFilled = true;
    trialData.result = inCorrectItemIndex >= 4 ? 'nuetral' : 'negative';
    trialData.inCorrectOptionIndex = inCorrectItemIndex;
    trialsInfo[this.state.currentTrialNumber - 1] = trialData;
    targetList[this.state.currentTargetIndex].node.trialsInfo = trialsInfo;
    this.setState({
      targetList: targetList,
      showCorrectResponseBorder: false,
      showInCorrectResponseBorder: true,
    });
    this.setResponseCounts(index);

    //If no response = "NoResponse", otherwise is "Error"
    let responseType = '';

    if (inCorrectItemIndex < 4) {
      responseType = 'Prompt';
    } else if (inCorrectItemIndex === 4) {
      responseType = 'NoResponse';
    } else if (inCorrectItemIndex === 5) {
      responseType = 'Incorrect';
    }
    this.doSessionRecord(
      targetList[index].node,
      responseType,
      inCorrectItemIndex,
    );
    if (this.inCorrectResponseRef.current != null) {
      this.inCorrectResponseRef.current.changeSelected(true);
    }
  }
  handleOpen = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    this.setState({sidebarMode: 'instruction'});
  };
  handleClose = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  renderIncorrectResponse(item, index) {
    const {targetList, currentTargetIndex, currentTrialNo} = this.state;
    let trialsInfo =
      targetList[currentTargetIndex].node.trialsInfo[
        currentTrialNo == 0 ? currentTrialNo : currentTrialNo - 1
      ];
    let rstyle = '',
      iconName = 'circle';
    if (
      trialsInfo != undefined &&
      (trialsInfo.sessionRecord != undefined) &
        (trialsInfo.sessionRecord.indexNo != undefined) &&
      trialsInfo.sessionRecord.indexNo >= 0 &&
      index == trialsInfo.sessionRecord.indexNo
    ) {
      rstyle = eval('styles.incorrectItemSelected');
      iconName = 'dot-circle';
    }
    let childName = this.state.student.firstname;
    item.key = item.key.replace('Child', childName);
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({isEditVisible: false, incorrectIndex: index}, () => {
            this.selectIncorrectItem(index);
          });
        }}
        activeOpacity={0.8}
        style={[styles.itemView, rstyle]}>
        <FontAwesome5 name={iconName} style={[styles.itemIcon, rstyle]} />
        <View style={{flexDirection: 'column'}}>
          <Text style={[styles.itemText, rstyle]}>{item.key}</Text>
          {trialsInfo != undefined &&
            trialsInfo.sessionRecord != undefined &&
            trialsInfo.sessionRecord.text != undefined &&
            index == trialsInfo.sessionRecord.indexNo && (
              <Text style={{marginTop: 5, marginLeft: 15}}>
                Note:
                {trialsInfo.sessionRecord.text}
              </Text>
            )}
        </View>
      </TouchableOpacity>
    );
  }
  renderItem = ({item, index}) => {
    const {backgroundColor} = item;
    return (
      <TouchableOpacity
        style={[styles.item, {backgroundColor}]}
        onPress={() => {
          this._carousel.scrollToIndex(index);
        }}>
        <Text>STIMULUS {index + 1}</Text>
        <Text style={{width: '100%', fontSize: 20}}>{item.node.sd}</Text>
      </TouchableOpacity>
    );
  };

  renderHeader() {
    let {targetsCount, targetList, showTimer, isChart} = this.state;
    let currentTarget = this.state.targetList[this.state.currentTargetIndex];
    let videoUrl =
      currentTarget != undefined
        ? currentTarget.node.videos.edges.length > 0
          ? currentTarget.node.videos.edges[0].node.url
          : ''
        : '';
    if (targetsCount > 0) {
      if (OrientationHelper.getDeviceOrientation() == 'portrait') {
        return (
          <View style={[styles.targetInstructionView]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 0,
              }}>
              <View>
                <TouchableOpacity
                  style={{marginBottom: 15}}
                  onPress={() => this.setState({showAttachment: true})}>
                  <MaterialCommunityIcons name="file-outline" size={25} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  {this.state.showTimer}
                </Text>
              </View>

              <View>
                <Button
                  theme="secondary"
                  style={{height: 35, padding: 10}}
                  labelButton={!isChart ? 'Show Graph' : 'Hide Graph'}
                  onPress={() => {
                    console.log('In graph press');
                    this.setState({isChartLoaded: true});
                    !isChart
                      ? this.getTargetGraphData(
                          this.state.targetList[this.state.currentTargetIndex]
                            .node.id,
                        )
                      : this.setState({isChart: false});
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 0,
                flex: 1,
                paddingVertical: 0,
                margin: 0,
                marginBottom: 0,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.handleOpen();
                }}>
                <Text
                  style={[styles.targetInstructionTitle, {marginBottom: 0}]}>
                  Target Instruction
                </Text>
              </TouchableOpacity>
            </View>

            {/* <View
              style={{
                width: '100%',
                alignItems: 'flex-end',
                marginTop: -60,
                marginBottom: 10,
              }}>
              {/* <TouchableOpacity style={{height: 42, borderWidth: StyleSheet.hairlineWidth}}>

               <MaterialCommunityIcons 
                name="chart-line"
                size={25}
                color={Color.primary}
               />
               </TouchableOpacity> 
               
            </View> */}
            {targetList.map((element, index) => {
              if (this.state.currentTargetNumber - 1 == index) {
                return (
                  <View style={styles.targetInstructionInformation} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        this.getVideoInfo();
                      }}>
                      {videoUrl.length > 0 ? (
                        videoUrl.split('/')[2] != undefined &&
                        videoUrl.split('/')[2].includes('youtu') ? (
                          <View
                            style={{
                              width: 180,
                              height: 180,
                              marginTop: 0,
                              paddingVertical: 0,
                              borderRadius: 5,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: 'lightgray',
                            }}>
                            <Thumbnail
                              url={videoUrl}
                              imageHeight={85}
                              imageWidth={175}
                              showPlayIcon={false}
                              onPress={() => {
                                this.getVideoInfo();
                              }}
                              containerStyle={{borderRadius: 5}}
                            />
                          </View>
                        ) : this.state.currentThumbnail != null ? (
                          <>
                            <Image
                              style={[styles.instructionImage]}
                              source={
                                this.state.currentThumbnail
                                  ? {uri: this.state.currentThumbnail}
                                  : require('../../../android/img/Image.png')
                              }
                            />
                            <View
                              style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <FontAwesome5
                                name={'play-circle'}
                                size={30}
                                color="rgba(255,255,255,0.8)"
                              />
                            </View>
                          </>
                        ) : (
                          <View
                            style={[
                              styles.instructionImage,
                              {
                                backgroundColor: Color.blackOpacity,
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}>
                            <FontAwesome5
                              name="info-circle"
                              size={30}
                              color={Color.white}
                            />
                            <Text style={{color: Color.white}}>
                              Video Not Available
                            </Text>
                          </View>
                        )
                      ) : (
                        this.state.currentThumbnail == null && (
                          <View
                            style={[
                              styles.instructionImage,
                              {
                                backgroundColor: Color.blackOpacity,
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}>
                            <FontAwesome5
                              name="info-circle"
                              size={30}
                              color={Color.white}
                            />
                            <Text style={{color: Color.white}}>
                              Video Not Available
                            </Text>
                          </View>
                        )
                      )}
                    </TouchableOpacity>

                    <View style={styles.instructions}>
                      <TouchableOpacity onPress={this.handleOpen}>
                        <Text style={styles.instructionsText}>
                          {element.node.targetAllcatedDetails.targetName}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.videoTime}>6 min</Text>
                      <Text style={styles.videoTime}>
                        {this.state.statusName}
                      </Text>
                      <Text style={styles.videoTime}>
                        {element.node.targetAllcatedDetails.targetType?.typeTar}
                      </Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
        );
      } else {
        return (
          <View style={styles.targetInstructionView}>
            <TouchableOpacity
              style={{position: 'absolute', left: 5, top: 5}}
              onPress={() => {
                this.handleOpen();
              }}>
              <Text style={styles.targetInstructionTitle}>
                Target Instruction
              </Text>
            </TouchableOpacity>
            <Button
              theme="secondary"
              style={{
                height: 30,
                width: 120,
                alignSelf: 'flex-end',
                marginBottom: 5,
                marginTop: -10,
                fontSize: 10,
              }}
              labelButton={!isChart ? 'Show Graph' : 'Hide Graph'}
              onPress={() => {
                !isChart
                  ? this.getTargetGraphData(
                      this.state.targetList[this.state.currentTargetIndex].node
                        .id,
                    )
                  : this.setState({isChart: false});
              }}
            />
            {targetList.map((element, index) => {
              if (this.state.currentTargetNumber - 1 == index) {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity onPress={this.handleOpen}>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            this.getVideoInfo();
                          }}>
                          {videoUrl.split('/')[2] != undefined &&
                          videoUrl.length > 0 ? (
                            videoUrl.split('/')[2].includes('youtu') ? (
                              <View style={styles.videoImage}>
                                <Thumbnail
                                  url={videoUrl}
                                  imageHeight={120}
                                  imageWidth={300}
                                  showPlayIcon={false}
                                  onPress={() => {
                                    this.getVideoInfo();
                                  }}
                                  containerStyle={{borderRadius: 5}}
                                />
                              </View>
                            ) : this.state.currentThumbnail != null ? (
                              <>
                                <Image
                                  style={styles.videoImage}
                                  source={
                                    this.state.currentThumbnail
                                      ? {uri: this.state.currentThumbnail}
                                      : require('../../../android/img/Image.png')
                                  }
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <FontAwesome5
                                    name={'play-circle'}
                                    size={30}
                                    color="rgba(255,255,255,0.8)"
                                  />
                                </View>
                              </>
                            ) : (
                              <View
                                style={[
                                  styles.videoImage,
                                  {
                                    backgroundColor: Color.blackOpacity,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  },
                                ]}>
                                <FontAwesome5
                                  name="info-circle"
                                  size={30}
                                  color={Color.white}
                                />
                                <Text style={{color: Color.white}}>
                                  Video Not Available
                                </Text>
                              </View>
                            )
                          ) : (
                            this.state.currentThumbnail == null && (
                              <View
                                style={[
                                  styles.videoImage,
                                  {
                                    backgroundColor: Color.blackOpacity,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  },
                                ]}>
                                <FontAwesome5
                                  name="info-circle"
                                  size={30}
                                  color={Color.white}
                                />
                                <Text style={{color: Color.white}}>
                                  Video Not Available
                                </Text>
                              </View>
                            )
                          )}
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Text style={styles.instructionsText}>
                          {element.node.targetAllcatedDetails.targetName}
                        </Text>
                        <Text style={styles.videoTime}>6 min</Text>
                        <Text style={styles.videoTime}>
                          {
                            element.node.targetAllcatedDetails.targetType
                              ?.typeTar
                          }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          </View>
        );
      }
    }
    return null;
  }
  renderStimulusItem = ({item, index}) => {
    let {
      targetList,
      currentTargetIndex,
      stimulusCurrentIndex,
      allMastery,
    } = this.state;
    const total = targetList[currentTargetIndex].node.sd.edges.length;
    const status =
      allMastery.length > index ? allMastery[index].node.status.statusName : '';

    return (
      <View
        style={[
          styles.stimulusVw,
          {
            marginLeft:
              OrientationHelper.getDeviceOrientation() == 'landscape' ? 0 : -70,
            backgroundColor:
              stimulusCurrentIndex == index ? 'rgba(62,123,250,0.15)' : 'white',
            width:
              OrientationHelper.getDeviceOrientation() == 'landscape'
                ? screenWidth / 3.7
                : screenWidth - 150,
          },
        ]}>
        <Text style={{color: '#63686E', fontSize: 12}}>
          STIMULUS {index + 1} - {total}
        </Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          {item.node.sd}
        </Text>
        <Text
          style={{
            width: '100%',
            fontSize: 12,
            color: 'rgba(62,123,250,0.9)',
            textAlign: 'right',
            position: 'absolute',
            top: 5,
            right: 5,
          }}>
          {status}
        </Text>
      </View>
    );
  };
  _renderStepItem = ({item, index}) => {
    let {
      targetList,
      currentTargetIndex,
      stepsCurrentIndex,
      allMastery,
    } = this.state;
    const total = targetList[currentTargetIndex].node.steps.edges.length;
    const status =
      allMastery.length > index ? allMastery[index].node.status.statusName : '';
    return (
      <View
        style={[
          styles.stimulusVw,
          {
            marginLeft:
              OrientationHelper.getDeviceOrientation() == 'landscape' ? 0 : -70,
            backgroundColor:
              stepsCurrentIndex == index ? 'rgba(62,123,250,0.15)' : 'white',
          },
        ]}>
        <Text style={{color: '#63686E', fontSize: 12}}>STEP {index + 1}</Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          {item.node.step}
        </Text>
        <Text
          style={{
            width: '100%',
            fontSize: 12,
            color: 'rgba(62,123,250,0.9)',
            textAlign: 'right',
            position: 'absolute',
            top: 5,
            right: 5,
          }}>
          {status}
        </Text>
      </View>
    );
  };
  // getStimulusIndex() {
  // 	let { targetList, currentTargetIndex, currentTrialNumber } = this.state;
  // 	if(targetList[currentTargetIndex].node.trialsInfo.length > 0) {
  // 		let findeIndex = 0
  // 		let currenSd =
  // 			targetList[currentTargetIndex].node.trialsInfo[currentTrialNumber - 1].sessionRecord.sd
  // 		let allSd = targetList[currentTargetIndex]
  // 		findeIndex = _.findIndex(allSd, function (item) {
  // 			return item.node.id === currenSd.id;
  // 		})
  // 		return findeIndex != -1 ? findeIndex : 0
  // 	}
  //
  // 	return 0
  // }
  renderStimulus() {
    let {
      targetsCount,
      targetList,
      currentTargetIndex,
      currentTrialNumber,
    } = this.state;
    return (
      <>
        {targetsCount > 0 &&
          targetList.map(
            (element, index) =>
              this.state.currentTargetIndex == index && (
                <>
                  {/* <SwiperFlatList 
                  data={element.node.sd.edges}
                  renderItem={this.renderStimulusItem}
                  ref={(c) => {
                    this._carouselStimulus = c;
                  }}
                  index={this.state.stimulusCurrentIndex}
                  scrollToIndex={(index) => {
                    this.setState(
                      {
                        stimulusCurrentIndex: index,
                        currentTrialNumber: this.state.currentTrialNumber,
                        currentTrialNo: this.state.currentTrialNumber,
                      },
                      () => {
                        this.getTargetSessionRecordings(
                          this.state.parentSessionInfo.id,
                          this.state.targetList[this.state.currentTargetIndex]
                            .node.id,
                          this.state.currentTargetIndex,
                        );
                      },
                    );
                  }}
                /> */}
                  <Carousel
                    layout={'default'}
                    ref={(c) => {
                      this._carouselStimulus = c;
                    }}
                    data={element.node.sd.edges}
                    renderItem={this.renderStimulusItem}
                    sliderWidth={
                      OrientationHelper.getDeviceOrientation() == 'landscape'
                        ? screenWidth / 3.2
                        : screenWidth
                    }
                    itemWidth={
                      OrientationHelper.getDeviceOrientation() == 'landscape'
                        ? screenWidth / 3.7
                        : screenWidth - 150
                    }
                    useScrollView
                    onSnapToItem={(index) => {
                      console.error('onsnap to item index', index);
                      console.error(
                        'onsnaptoitem currenttrialno',
                        this.state.currentTrialNo,
                      );
                      console.error(
                        'onsnaptoitem currenttrialnumber',
                        this.state.currentTrialNumber,
                      );
                      this.setState(
                        {
                          stimulusCurrentIndex: index,
                          currentTrialNumber: 1,
                          currentTrialNo: 1,
                        },
                        () => {
                          this.getTargetSessionRecordings(
                            this.state.parentSessionInfo.id,
                            this.state.targetList[this.state.currentTargetIndex]
                              .node.id,
                            this.state.currentTargetIndex,
                          );
                        },
                      );
                    }}
                  />
                </>
              ),
          )}
      </>
    );
  }
  renderSteps() {
    let {targetsCount, targetList} = this.state;
    return (
      <>
        {targetsCount > 0 &&
          targetList.map(
            (element, index) =>
              this.state.currentTargetIndex == index && (
                <>
                  <Carousel
                    layout={'default'}
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={element.node.steps.edges}
                    renderItem={this._renderStepItem}
                    sliderWidth={
                      OrientationHelper.getDeviceOrientation() == 'landscape'
                        ? screenWidth / 3.2
                        : screenWidth
                    }
                    itemWidth={
                      OrientationHelper.getDeviceOrientation() == 'landscape'
                        ? screenWidth / 3.7
                        : screenWidth - 150
                    }
                    onSnapToItem={(index) => {
                      this.setState(
                        {
                          stepsCurrentIndex: index,
                          currentTrialNumber: this.state.currentTrialNumber,
                        },
                        () => {
                          this.getTargetSessionRecordings(
                            this.state.parentSessionInfo.id,
                            this.state.targetList[this.state.currentTargetIndex]
                              .node.id,
                            this.state.currentTargetIndex,
                          );
                        },
                      );
                    }}
                  />
                </>
              ),
          )}
      </>
    );
  }
  renderTrial() {
    let {
      targetsCount,
      targetList,
      status,
      currentTrialNumber,
      totalTrials,
      fromEdit,
    } = this.state;
    return (
      <>
        {/* Trail Progress */}
        <View style={styles.trailProgressTitle}>
          <Text style={styles.trailProgressText}>
            Trial {currentTrialNumber} of {totalTrials}
          </Text>
          {(status !== 'COMPLETED' || fromEdit) && (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  this.moveTrailTo('previous');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-left'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.moveTrailTo('next');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-right'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {targetsCount > 0 &&
          targetList.map(
            (element, index) =>
              this.state.currentTargetIndex == index && (
                <TrialProgressNew
                  key={index}
                  currentNumber={currentTrialNumber}
                  data={element.node.trialsInfo}
                />
              ),
          )}
      </>
    );
  }
  renderResponse(cText) {
    let {
      student,
      correctResponseText,
      incorrectData,
      showCorrectResponseBorder,
      showInCorrectResponseBorder,
    } = this.state;

    let crstyle = '';
    let incrstyle = '';
    if (showCorrectResponseBorder) {
      crstyle = eval('styles.correct');
    }
    if (showInCorrectResponseBorder) {
      incrstyle = eval('styles.incorrect');
    }

    return (
      <>
        {/* Correct Response */}
        {this.state.showCorrectResponse && (
          <View style={[styles.outsideBlock, crstyle]}>
            <TargetResponse
              ref={this.correctResponseRef}
              selected={this.state.showCorrectResponseBorder}
              responseType="correct"
              displayColor={false}
              response="Correct"
              count={this.state.currentTargetCorrectNumer}
              message={cText}
              callbackFunction={this.callbackTargetResponse}
            />
          </View>
        )}

        {/* InCorrect Response */}
        <View style={[styles.outsideBlock, incrstyle]}>
          <TargetResponse
            ref={this.inCorrectResponseRef}
            selected={this.state.showInCorrectResponseBorder}
            displayColor={
              this.state.selectedResponse === 'incorrect' ? true : false
            }
            responseType="incorrect"
            response="Incorrect"
            message="Describe what verbally fluent means in a line"
            count={0}
            callbackFunction={this.callbackTargetResponse}
          />
          {!this.state.showCorrectResponse && (
            <View style={{paddingTop: 10}}>
              {incorrectData.map((item, idx) => {
                return this.renderIncorrectResponse(item, idx);
              })}
            </View>
          )}
        </View>
        {/*this.state.isChart &&this.renderChart()*/}

        <View style={{height: 80}} />
      </>
    );
  }

  renderChartModal() {
    const {isPeakType,isBehRecordingType,selectedTab}=this.state
    let linedata={}
    if(this.state.selectedTab==='duration' && this.state.isBehRecordingType){
      linedata = {
        labels: this.state.xAxis,
        datasets: [
          {
            data: this.state.drGraph,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `#000000`,
          },
        ],
      };
    }
    else if(this.state.selectedTab==='frequency' && this.state.isBehRecordingType){
      linedata = {
        labels: this.state.xAxis,
        datasets: [
          {
            data: this.state.frGraph,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `#000000`,
          },          
        ],
        legend:['Frequency']
      };
    }
    else if(this.state.selectedTab==='rate' && this.state.isBehRecordingType){
      linedata = {
        labels: this.state.xAxis,
        datasets: [
          {
            data: this.state.rateGraph,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `${Color.black}`,
          },
        ],
        legend:['Calculated Rate']
      };
    }
    // console.log("true>>>",isPeakType,isBehRecordingType,this.state.rateGraph);

   
    return (
      <SimpleModal
        style={{padding: 0, width: 350, height: 450}}
        // containerStyle={{backgroundColor: 'blue'}}
        visible={this.state.isChart}
        onRequestClose={() => {
          this.setState({isChart: false});
        }}>
        <View
          style={{
            height: 400,
            backgroundColor: 'white',
            marginBottom: 10,
            marginTop: 16,
          }}>
          {this.state.isChartLoaded ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
            {this.state.isBehRecordingType && <>

              <View style={{height: 50, paddingTop: 10}}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedTab: 'frequency'}, () => {
                          console.log('selected tab>>', this.state.selectedTab);
                        });
                      }}>
                      <Text
                        style={[
                          styles.tabView,
                          this.state.selectedTab === 'frequency'
                            ? styles.selectedTabView
                            : '',
                        ]}>
                        Frequency
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedTab: 'rate'}, () => {
                          console.log('selected tab>>', this.state.selectedTab);
                        });
                      }}>
                      <Text
                        style={[
                          styles.tabView,
                          this.state.selectedTab === 'rate'
                            ? styles.selectedTabView
                            : '',
                        ]}>
                        Rate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedTab: 'duration'}, () => {
                          console.log('selected tab>>', this.state.selectedTab);
                        });
                      }}>
                      <Text
                        style={[
                          styles.tabView,
                          this.state.selectedTab === 'duration'
                            ? styles.selectedTabView
                            : '',
                        ]}>
                        Duration(sec)
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              {this.state.selectedTab==='frequency' && this.state.isBehRecordingType && <>
              {/* <View style={{justifyContent:'center',flexDirection:'row'}}>
              <Text>Frequency and rate</Text>
              </View> */}
              {/* <View style={{justifyContent:'center',flexDirection:'row'}}>
              <View style={{flexDirection:'row'}}>
              <MaterialCommunityIcons
                  name="record"
                  color={Color.black}
                  size={20}
                />
                <Text>Frequency</Text>
              </View>
              <View style={{flexDirection:'row'}}>
              <MaterialCommunityIcons
                  name="record"
                  color={Color.bluejay}
                  size={20}
                />
                <Text>Calculated Rate</Text>
              </View>
              </View>
               */}
              <View>
              <LineChart
                  data={linedata}
                  width={Dimensions.get('window').width - 70} // from react-native
                  height={280}
                  yAxisLabel={''}
                  withInnerLines={false}                  
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `#000000`,
                    style: {
                      borderRadius: 0,
                    },
                    useShadowColorFromDataset: false,
                  }}
                  // bezier
                  style={{
                    marginVertical: 8,
                    marginTop:20,
                    marginLeft:0,
                    paddingHorizontal:0,
                    borderRadius: 0,
                  }}
                />
                <Text style={{textAlign: 'center'}}>
                {this.state.labelYear} (year)
              </Text>
              </View>
              
              </>
              }
               {this.state.selectedTab==='rate' && this.state.isBehRecordingType && <>
              {/* <View style={{justifyContent:'center',flexDirection:'row'}}>
              <Text>Frequency and rate</Text>
              </View> */}
              {/* <View style={{justifyContent:'center',flexDirection:'row'}}>
              <View style={{flexDirection:'row'}}>
              <MaterialCommunityIcons
                  name="record"
                  color={Color.black}
                  size={20}
                />
                <Text>Frequency</Text>
              </View>
              <View style={{flexDirection:'row'}}>
              <MaterialCommunityIcons
                  name="record"
                  color={Color.bluejay}
                  size={20}
                />
                <Text>Calculated Rate</Text>
              </View>
              </View>
               */}
              <View>
              <LineChart
                  data={linedata}
                  width={Dimensions.get('window').width - 70} // from react-native
                  height={280}
                  yAxisLabel={''}
                  withInnerLines={false}
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    // decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `#000000`,
                    style: {
                      borderRadius: 0,
                    },
                    useShadowColorFromDataset: false,
                  }}
                  // bezier
                  style={{
                    marginVertical: 8,
                    marginTop:20,
                    marginLeft:0,
                    paddingHorizontal:0,
                    borderRadius: 0,
                  }}
                />
                <Text style={{textAlign: 'center'}}>
                {this.state.labelYear} (year)
              </Text>
              </View>
              
              </>
              }
              {this.state.selectedTab==='duration' && this.state.isBehRecordingType && <>
              <View style={{marginTop:30}}>
              <BarChart
                      data={linedata}
                      width={Dimensions.get('window').width - 70} // from react-native
                      height={280}
                      yAxisLabel={''}
                      chartConfig={{
                        backgroundColor: 'white',
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `#000000`,
                        style: {
                          borderRadius: 0,
                        },
                        useShadowColorFromDataset: false,
                      }}
                      withInnerLines={false}
                      showValuesOnTopOfBars={true}
                      showBarTops={true}
                      // bezier
                      style={{
                        marginVertical: 8,
                        borderRadius: 0,
                      }}
                    />
                    </View>
                    <Text style={{textAlign: 'center'}}>
                {this.state.labelYear} (year)
              </Text>
              </>}
              {/* <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Frequency and Rate
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    transform: [{rotate: '-90deg'}],
                    margin: 0,
                    marginHorizontal: -40,
                  }}>
                  Frequency and Rate
                </Text>

                <VictoryChart
                  domain={{y: [0, 100]}}
                  // categories={{x: this.state.xAxis}}
                  minDomain={this.state.xAxis[0]}
                  height={350}
                  width={350}>
                  <VictoryLine
                    style={{
                      data: {stroke: '#8ACA2B'},
                      parent: {border: '2px solid '},
                    }}
                    data={
                      this.state.dataSets ? this.state.dataSets[0]?.data : []
                    }
                  />
                  <VictoryLine
                    style={{
                      data: {stroke: 'red'},
                      parent: {border: '2px solid '},
                    }}
                    data={
                      this.state.dataSets ? this.state.dataSets[1]?.data : []
                    }
                  />
                  <VictoryLine
                    style={{
                      data: {stroke: '#FFC166'},
                      parent: {border: '2px solid '},
                    }}
                    data={
                      this.state.dataSets ? this.state.dataSets[2]?.data : []
                    }
                  />
                </VictoryChart>
              </View>

              <Text style={{textAlign: 'center'}}>
                {this.state.labelYear} (year)
              </Text>
               */}
              </> 
              }
            { !this.state.isBehRecordingType && <>
              
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                correct and Incorrect response
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    transform: [{rotate: '-90deg'}],
                    margin: 0,
                    marginHorizontal: -40,
                  }}>
                  Percentage(%)
                </Text>

                <VictoryChart
                  domain={{y: [0, 100]}}
                  // categories={{x: this.state.xAxis}}
                  minDomain={this.state.xAxis[0]}
                  height={350}
                  width={350}>
                  <VictoryLine
                    style={{
                      data: {stroke: '#8ACA2B'},
                      parent: {border: '2px solid '},
                    }}
                    data={
                      this.state.dataSets ? this.state.dataSets[0]?.data : []
                    }
                  />
                  <VictoryLine
                    style={{
                      data: {stroke: 'red'},
                      parent: {border: '2px solid '},
                    }}
                    data={
                      this.state.dataSets ? this.state.dataSets[1]?.data : []
                    }
                  />
                  <VictoryLine
                    style={{
                      data: {stroke: '#FFC166'},
                      parent: {border: '2px solid '},
                    }}
                    data={
                      this.state.dataSets ? this.state.dataSets[2]?.data : []
                    }
                  />
                </VictoryChart>
              </View>

              <Text style={{textAlign: 'center'}}>
                {this.state.labelYear} (year)
              </Text>
              </>
  }

              {/* <HighchartsReactNative
              styles={{
                backgroundColor: '#fff',
                justifyContent: 'center',
                height: 350,
              }}
              loader={false}
              options={{
                chart: {
                  type: 'line',
                },

                title: {
                  text: 'correct and Incorrect response',
                },

                subtitle: false,

                yAxis: {
                  allowDecimals: false,
                },

                credits: {
                  enabled: false,
                },

                xAxis: {
                  categories: this.state.xAxis,
                },

                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle',
                },

                plotOptions: {
                  line: {
                    dataLabels: {
                      enabled: false,
                    },
                    enableMouseTracking: false,
                  },
                },

                series: this.state.dataSets,

                responsive: {
                  rules: [
                    {
                      condition: {
                        maxWidth: 500,
                      },
                      chartOptions: {
                        legend: {
                          layout: 'horizontal',
                          align: 'center',
                          verticalAlign: 'bottom',
                        },
                      },
                    },
                  ],
                },
              }}
            /> */}
          
            </>
          )}
        </View>
      </SimpleModal>
    );
  }

  // renderChart() {
  //   return (
  //     <>
  //       {/* ACT Placeholder */}
  //       <View
  //         style={{
  //           height: 300,
  //           backgroundColor: 'white',
  //           marginBottom: 10,
  //           marginTop: 16,
  //         }}>
  //         <HighchartsReactNative
  //           styles={{
  //             backgroundColor: '#fff',
  //             justifyContent: 'center',
  //             height: 350,
  //           }}
  //           loader={true}
  //           options={{
  //             chart: {
  //               type: 'line',
  //             },

  //             title: {
  //               text: 'correct and Incorrect response',
  //             },

  //             subtitle: false,

  //             yAxis: {
  //               allowDecimals: false,
  //             },

  //             credits: {
  //               enabled: false,
  //             },

  //             xAxis: {
  //               categories: this.state.xAxis,
  //             },

  //             legend: {
  //               layout: 'vertical',
  //               align: 'right',
  //               verticalAlign: 'middle',
  //             },

  //             plotOptions: {
  //               line: {
  //                 dataLabels: {
  //                   enabled: false,
  //                 },
  //                 enableMouseTracking: false,
  //               },
  //             },

  //             series: this.state.dataSets,

  //             responsive: {
  //               rules: [
  //                 {
  //                   condition: {
  //                     maxWidth: 500,
  //                   },
  //                   chartOptions: {
  //                     legend: {
  //                       layout: 'horizontal',
  //                       align: 'center',
  //                       verticalAlign: 'bottom',
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           }}
  //         />
  //       </View>
  //     </>
  //   );
  // }
  renderExitModal() {
    return (
      <SimpleModal
        visible={this.state.isExitVisible}
        onRequestClose={() => {
          this.setState({isExitVisible: false});
        }}>
        <Text style={styles.modalTitle}>
          Are you sure you want to exit the session early ?
        </Text>

        <TextInput
          label="Describe your reason"
          style={{height: 200}}
          multiline={true}
          value={this.state.exitReason}
          placeholder={'Write Something ...'}
          onChangeText={(exitReason) => {
            this.setState({exitReason});
          }}
        />

        <Button
          labelButton="Cancel"
          theme="danger"
          style={{marginVertical: 10}}
          onPress={() => {
            this.setState({isExitVisible: false});
          }}
        />

        <Button
          labelButton="Exit Session"
          theme="danger-block"
          style={{marginBottom: 10}}
          onPress={() => {
            this.pauseSession();
            this.setState({isExitVisible: false});
            this.props.navigation.goBack();
          }}
        />
      </SimpleModal>
    );
  }
  renderTextEditModal() {
    return (
      <SimpleModal
        visible={this.state.isEditVisible}
        onRequestClose={() => {
          this.setState({isEditVisible: false});
        }}>
        <TextInput
          label="Describe your reason"
          underlineColorAndroid="transparent"
          placeholder={'Write Something ...'}
          numberOfLines={10}
          multiline={true}
          value={this.state.reasonText}
          onChangeText={(exitReason) => {
            this.setState({reasonText: exitReason});
          }}
        />

        <Button
          labelButton="Save"
          theme="primary"
          style={{marginTop: 10}}
          onPress={() => {
            this.setState({isEditVisible: false});
            this.selectIncorrectItem(this.state.incorrectIndex);
          }}
        />

        <Button
          labelButton="Cancel"
          theme="secondary"
          style={{marginTop: 10}}
          onPress={() => {
            this.setState({isEditVisible: false});
          }}
        />
      </SimpleModal>
    );
  }
  renderTargetProgress() {
    let targetList = this.state.targetList;
    if (this.state.loading == false) {
      if (OrientationHelper.getDeviceOrientation() == 'portrait') {
        return (
          <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
            {targetList.map((element, index) => {
              if (this.state.currentTargetNumber - 1 == index) {
                return (
                  <TargetProgress
                    current={this.state.currentTargetNumber}
                    total={targetList.length}
                    parentCallback={(dir) => {
                      this.setState({isChart: false});
                      this.callbackTargetProgress(dir);
                    }}
                  />
                );
              }
            })}
          </View>
        );
      }
    }
    return null;
  }
  renderTargetProgressInLandscape() {
    let targetList = this.state.targetList;
    if (this.state.loading == false) {
      return targetList.map((element, index) => {
        if (this.state.currentTargetNumber - 1 == index) {
          return (
            <TargetProgress
              current={this.state.currentTargetNumber}
              total={targetList.length}
              parentCallback={(dir) => {
                this.setState({isVideo: true});
                this.callbackTargetProgress(dir);
              }}
            />
          );
        }
      });
    }
  }
  renderInstructions() {
    const {route} = this.props;

    const backdrop = {
      transform: [
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 0.01],
            outputRange: [screenHeight, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
      opacity: this.state.animation.interpolate({
        inputRange: [0.01, 0.5],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    };

    const slideUp = {
      transform: [
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [0, -1 * screenHeight],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    if (OrientationHelper.getDeviceOrientation() == 'portrait') {
      return (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.cover, backdrop]}>
          <View style={[styles.sheet]}>
            <Animated.View style={[styles.popup, slideUp]}>
              <TouchableOpacity onPress={this.handleClose}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <FontAwesome5
                    name={'chevron-down'}
                    style={styles.backIconText}
                  />
                  <Text style={{color: Color.blackFont}}>
                    {' '}
                    Target Description
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{flex: 1, padding: 10}}>
                <Image
                  style={{width: '100%', height: '30%'}}
                  source={require('../../../android/img/Image.png')}
                />
                <WebView
                  scalesPageToFit={false}
                  style={{height: '100%'}}
                  originWhitelist={['*']}
                  source={{html: this.state.currentTargetInstructions}}
                />
              </View>
              {/* {this.state.currentTargetInstructions} */}
            </Animated.View>
          </View>
        </Animated.View>
      );
    } else {
      return (
        <>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.titleUpcoming, {flex: 1}]}>Instructions</Text>
            <TouchableOpacity
              style={{marginTop: 16}}
              onPress={() => {
                this.setState({sidebarMode: 'normal'});
              }}>
              <MaterialCommunityIcons
                name="close"
                color={Color.blackFont}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <WebView
            scalesPageToFit={false}
            style={{height: '100%'}}
            originWhitelist={['*']}
            source={{html: this.state.currentTargetInstructions}}
          />
        </>
      );
    }
  }
  displayBehaviourNewTemplate() {
    let thiss = this;
    return (
      <View style={{flex: 1}}>
        {this.state.isEditBeh ? (
          <BehaviourNewTemplateScreen
            disableNavigation={true}
            route={{
              params: {
                studentId: this.state.studentId,
                template: this.state.template,
                parent: this.state.parent,
              },
            }}
            navigation={{
              goBack() {
                thiss.setState({isBehaviourNewActive: false});
              },
            }}
          />
        ) : (
          <BehaviourNewTemplateScreen
            disableNavigation={true}
            route={{params: {studentId: this.state.studentId}}}
            navigation={{
              goBack() {
                thiss.setState({isBehaviourNewActive: false});
              },
            }}
          />
        )}
        <Button
          labelButton="Cancel"
          theme="secondary"
          style={{marginBottom: 10}}
          onPress={() => {
            this.setState({
              isBehaviourNewActive: false,
              isEditBeh: false,
            });
          }}
        />
      </View>
    );
  }
  displayBehaviourPage() {
    return (
      <View style={{flex: 1}}>
        {/* <BehaviourDecelTemplateScreen
          disableNavigation={true}
          route={{
            params: {
              studentId: this.state.studentId,
              childSessionId: this.state.parentSessionInfo.id,
            },
          }}
          navigation={{
            goBack() {},
          }}
          onEdit={(template, parent) => {
            this.setState({template: template, parent: parent}, () => {
              this.setState({
                isBehaviourNewActive: true,
                isEditBeh: true,
              });
            });
          }}
          isFromSession={true}
        /> */}
        <SessionBehaviorScreen
          refrence={this.screenRef}
          disableNavigation={true}
          route={{
            params: {
              studentId: this.state.studentId,
              childSessionId: this.state.parentSessionInfo.id,
            },
          }}
          navigation={this.props.navigation}
          onEdit={(template, parent) => {
            this.setState({template: template, parent: parent}, () => {
              this.setState({
                isBehaviourNewActive: true,
                isEditBeh: true,
              });
            });
          }}
          sessionNavigation={() => {
            if(Platform.OS === "ios") {
              this.setState({showDataRecordingModal: false})
            }
          }}
          isFromSession={true}
        />
        {/* {!this.state.loading && (
          <Button
            labelButton="New Template"
            style={{marginBottom: 10}}
            onPress={() =>
              this.setState({
                isBehaviourNewActive: true,
              })
            }
          />
        )} */}
      </View>
    );
  }
  displayMandPage() {
    return !this.state.isMandGraph ? (
      <BehaviourDecelMandScreen
        disableNavigation={true}
        route={{
          params: {
            studentId: this.state.studentId,
            student: this.state.student,
          },
        }}
        navigation={{
          goBack() {},
        }}
        onGraphClick={(el) => {
          this.setState({mandData: el}, () => {
            this.setState({isMandGraph: true});
          });
        }}
        isFromSession={true}
        sessionId={this.state.parentSessionInfo.id}
      />
    ) : (
      <BehaviourDecelMandGraph
        disableNavigation={true}
        route={{
          params: {
            studentId: this.state.studentId,
            mandData: this.state.mandData,
            student: this.state.student,
            isFromSession: true,
          },
        }}
        onCancel={() => {
          this.setState({isMandGraph: false});
        }}
        isFromSession={true}
      />
    );
  }
  displayToiletPage() {
    let thiss = this;
    return (
      <>
        <BehaviourDecelToiletScreen
          disableNavigation={true}
          route={{
            params: {
              studentId: this.state.studentId,
              student: this.state.student,
            },
          }}
          navigation={{
            goBack() {},
            navigate(screen, params) {
              thiss.setState({
                isToiletNewActive: true,
                isToiletEdit: true,
                toiletParams: params,
              });
            },
          }}
          isFromSession={true}
        />

        {!this.state.loading && (
          <Button
            labelButton="New Toilet Data"
            style={{marginBottom: 10}}
            onPress={() =>
              this.setState({isToiletNewActive: true, isToiletEdit: false})
            }
          />
        )}
      </>
    );
  }

  displayToiletPageNew() {
    let thisInstance = this;
    let params = {studentId: this.state.studentId, student: this.state.student};
    if (this.state.isToiletEdit) {
      params = this.state.toiletParams;
    }
    return (
      <View style={{flex: 1}}>
        <NewToiletDataScreen
          disableNavigation={true}
          route={{params: params}}
          navigation={{
            goBack() {
              thisInstance.setState({isToiletNewActive: false});
            },
          }}
          isFromSession={true}
          sessionId={this.state.parentSessionInfo.id}
        />
        <Button
          labelButton="Cancel"
          theme="secondary"
          style={{marginBottom: 10}}
          onPress={() => {
            this.setState({isToiletNewActive: false});
          }}
        />
      </View>
    );
  }
  renderDataRecordingModal() {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        style={{zIndex: -1}}
        visible={this.state.showDataRecordingModal}
        onRequestClose={() => {
          this.setState({
            isShowBehaviour: false,
            showDataRecordingModal: false,
          });
        }}>
        <SafeAreaView style={{flex: 1}}>
          {this.renderBehaviourData()}
        </SafeAreaView>
      </Modal>
    );
  }
  switchDataRecordingTab(type) {
    if (type === 'behaviour') {
      this.setState({
        isBehaviourActive: true,
        isMandActive: false,
        isToiletActive: false,
      });
    } else if (type === 'mand') {
      this.setState({
        isBehaviourActive: false,
        isMandActive: true,
        isToiletActive: false,
        isMandGraph: false,
      });
    } else if (type === 'toilet') {
      this.setState({
        isBehaviourActive: false,
        isMandActive: false,
        isToiletActive: true,
      });
    }
  }
  headerComponent() {
    let {
      isBehaviourActive,
      isBehaviourNewActive,
      isMandActive,
      isToiletActive,
      isToiletNewActive,
    } = this.state;

    return (
      <View style={styles.overlayHeader}>
        {/* <Ionicons name='ios-flash' size={30} color={Color.primary} /> */}
        <TouchableOpacity
          onPress={() => {
            this.setState({
              isShowBehaviour: false,
              showDataRecordingModal: false,
            });
          }}>
          <MaterialCommunityIcons
            name="chevron-down"
            color={Color.blackFont}
            size={20}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{width: '100%'}}>
          <TouchableOpacity
            style={{
              backgroundColor: !isBehaviourActive ? '#bcbcbc' : Color.primary,
              height: 40,
              width: screenWidth / 3.7,
              justifyContent: 'center',
              borderRadius: 5,
              marginRight: 5,
            }}
            onPress={() => {
              this.switchDataRecordingTab('behaviour');
            }}>
            <Text
              style={{
                fontSize: 14,
                color: !isBehaviourActive ? 'black' : 'white',
                alignSelf: 'center',
              }}>
              Behavior Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: !isMandActive ? '#bcbcbc' : Color.primary,
              height: 40,
              width: screenWidth / 3.7,
              justifyContent: 'center',
              borderRadius: 5,
              marginRight: 5,
            }}
            onPress={() => {
              this.switchDataRecordingTab('mand');
            }}>
            <Text
              style={{
                fontSize: 14,
                color: !isMandActive ? 'black' : 'white',
                alignSelf: 'center',
              }}>
              Mand Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: !isToiletActive ? '#bcbcbc' : Color.primary,
              height: 40,
              width: screenWidth / 3.7,
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={() => {
              this.switchDataRecordingTab('toilet');
            }}>
            <Text
              style={{
                fontSize: 14,
                color: !isToiletActive ? 'black' : 'white',
                alignSelf: 'center',
              }}>
              Toilet Data
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={{flex: 1}} />
      </View>
    );
  }
  renderBehaviourData() {
    let {
      isBehaviourActive,
      isBehaviourNewActive,
      isMandActive,
      isToiletActive,
      isToiletNewActive,
    } = this.state;
    if (this.state.isShowBehaviour) {
      return (
        <View style={{flex: 1, marginTop: 20}}>
          {((Platform.OS == 'android' &&
            OrientationHelper.getDeviceOrientation() == 'landscape') ||
            Platform.OS == 'ios') &&
            this.headerComponent()}
          <Container>
            {isBehaviourActive && (
              <>
                {!isBehaviourNewActive && this.displayBehaviourPage()}
                {isBehaviourNewActive && this.displayBehaviourNewTemplate()}
              </>
            )}

            {this.state.isMandActive && this.displayMandPage()}

            {isToiletActive && (
              <>
                {!isToiletNewActive && this.displayToiletPage()}
                {isToiletNewActive && this.displayToiletPageNew()}
              </>
            )}
          </Container>
        </View>
      );
    } else {
      return (
        <View style={styles.overlayWrapper}>
          <View style={styles.overlayHeader}>
            <Ionicons name="ios-flash" size={30} color={Color.primary} />

            <Text style={styles.overlayTitleActive}>Behavior Data</Text>
            <Text style={styles.overlayTitle}>Mand Data</Text>
            <Text style={styles.overlayTitle}>Toilet Data</Text>

            <View style={{flex: 1}} />

            <TouchableOpacity
              style={{}}
              onPress={() => {
                this.setState({isShowBehaviour: true});
              }}>
              <MaterialCommunityIcons
                name="chevron-up"
                color={Color.blackFont}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
  renderUpcomingTarget() {
    let {targetsCount, targetList} = this.state;

    return (
      <>
        <Text style={styles.titleUpcoming}>Upcoming Target</Text>

        <ScrollView>
          {targetList.map((element, index) => {
            let selectedStyle =
              this.state.currentTargetNumber - 1 == index
                ? styles.cardTargetSelected
                : styles.cardTarget;
            //if (this.state.currentTargetNumber - 1 == index) {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.showTarget(index + 1);
                }}
                key={index}
                activeOpacity={0.9}
                style={selectedStyle}>
                <Image
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 4,
                    marginBottom: 10,
                  }}
                  source={require('../../../android/img/Image.png')}
                />

                <Text style={styles.instructionsText}>
                  {element.node.targetAllcatedDetails.targetName}
                </Text>
                <Text style={styles.videoTime}>6 min</Text>
                <Text style={styles.videoTime}>{this.state.statusName}</Text>
                <View style={{height: 10}} />
                <TrialProgressNew data={element.node.trialsInfo} />
              </TouchableOpacity>
            );
            //}
          })}
        </ScrollView>

        {this.state.currentTargetNumber == targetList.length && (
          <View style={{marginVertical: 10}}>
            <Button
              labelButton="Finish Session"
              onPress={() => {
                let {navigation} = this.props;
                navigation.navigate('SessionFeedbackScreen', {
                  pageTitle: this.state.pageTitle,
                  fromPage: this.state.fromPage,
                  sessionId: this.state.sessionId,
                  childSeesionId: this.state.parentSessionInfo.id,
                  studentId: this.state.studentId,
                });
              }}
            />
          </View>
        )}
      </>
    );
  }

  //Note:- peak part
  checkForSelectedStimulus() {
    const {
      peakAllSd,
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      targetList,
      currentTargetIndex,
      peakType,
    } = this.state;
    let filterIndex = 0;
    let trials;
    if (peakType == 'automatic' && peakAllSd.length > 0) {
      return currentPeakTrial - 1;
    } else {
      trials =
        currentPeak[currentPeakStimIndex] != undefined
          ? currentPeak[currentPeakStimIndex].node.trial != undefined
            ? currentPeak[currentPeakStimIndex].node.trial.edges
            : []
          : [];
      const currentTrial = trials[currentPeakTrial - 1];
      let currentSd =
        targetList[currentTargetIndex] != undefined
          ? targetList[currentTargetIndex].node.sd.edges
          : [];
      if (currentTrial != undefined) {
        filterIndex = _.findIndex(currentSd, function (item) {
          return item.node.id === currentTrial.node.sd.id;
        });
      }
    }
    return filterIndex != -1 ? filterIndex : 0;
  }
  managePickNextPrevious(text) {
    const {
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      peakType,
    } = this.state;
    const trials =
      currentPeak[currentPeakStimIndex] != undefined
        ? currentPeak[currentPeakStimIndex].node.trial != undefined
          ? currentPeak[currentPeakStimIndex].node.trial.edges
          : []
        : [];

    if (text == 'Next') {
      if (peakType == 'automatic' && currentPeakTrial < 10) {
        this.setState({currentPeakTrial: currentPeakTrial + 1}, () => {
          this._carouselB.snapToItem(currentPeakTrial, true, () => {});
        });
      } else if (
        trials.length > currentPeakTrial - 1 &&
        currentPeakTrial < 10
      ) {
        this.setState({currentPeakTrial: currentPeakTrial + 1});
      }
    } else {
      if (currentPeakTrial != 1) {
        this.setState({currentPeakTrial: currentPeakTrial - 1});
      }
    }
  }
  recordPeak = (previousMark, currentMak) => {
    const {
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      targetList,
      peakType,
      currentPeakSdIndex,
      currentTargetIndex,
      peakAllSd,
    } = this.state;

    let sd;
    if (peakType == 'automatic') {
      sd = peakAllSd[currentPeakStimIndex].node.trial.edges[currentPeakSdIndex];
    } else {
      sd =
        targetList[currentTargetIndex] != undefined
          ? targetList[currentTargetIndex].node.sd.edges.length > 0
            ? targetList[currentTargetIndex].node.sd.edges[currentPeakSdIndex]
            : []
          : [];
    }
    let block = this.state.currentPeak[this.state.currentPeakStimIndex];

    if (previousMark == -1 && peakType != 'automatic') {
      this.recordPeakSession(block?.node?.id, sd.node?.id, currentMak);
    } else {
      let trials;
      if (peakType == 'automatic') {
        trials = peakAllSd[currentPeakStimIndex].node.trial.edges;
      } else {
        trials =
          currentPeak[currentPeakStimIndex] != undefined
            ? currentPeak[currentPeakStimIndex].node.trial != undefined
              ? currentPeak[currentPeakStimIndex].node.trial.edges
              : []
            : [];
      }
      const currentTrial = trials[currentPeakTrial - 1];
      this.updatePeakSession(
        currentTrial.node.id,
        peakType == 'automatic' ? sd.node.sd.id : sd.node?.id,
        currentMak,
      );
    }
  };
  renderScoreItem = (item, index) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const {currentPeak, peakType, peakAllSd} = this.state;
    let trials;
    if (peakType == 'automatic' && peakAllSd.length > 0) {
      trials = peakAllSd[item.index].node.trial.edges;
    } else {
      trials =
        currentPeak[item.index] != undefined
          ? currentPeak[item.index].node.trial != undefined
            ? currentPeak[item.index].node.trial.edges
            : []
          : [];
    }
    return (
      <TouchableOpacity
        onPress={() => {
          this._carouselA.snapToItem(item.index, true, () => {});
          if (
            currentPeak[item.index] == undefined &&
            this.state.peakType != 'automatic'
          ) {
            this.createBlock(this.state.currentPeakSkillId);
          }
          const trials =
            currentPeak[item.index] != undefined
              ? currentPeak[item.index].node.trial != undefined
                ? currentPeak[item.index].node.trial.edges
                : []
              : [];
          this.setState({
            currentPeakStimIndex: item.index,
            currentPeakTrial:
              trials.length < 10
                ? trials.length == 0
                  ? 1
                  : trials.length
                : 10,
          });
        }}
        style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.scoreItemVw}>
          <Text>B-{item.index + 1}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '85%',
          }}>
          {data.map((item, index) => {
            if (trials.length > 0 && trials.length > index) {
              const mark = trials[index].node.marks;
              return (
                <View
                  style={[
                    styles.scoreItemTextVw,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        mark == 0
                          ? '#FF8080'
                          : mark == 10
                          ? '#4BAEA0'
                          : mark == 2 || mark == 4 || mark == 8
                          ? '#FF9C52'
                          : 'white',
                    },
                  ]}>
                  <Text style={{fontSize: 10, color: 'white'}}>{mark}</Text>
                </View>
              );
            } else {
              return <View style={styles.scoreItemTextVw}></View>;
            }
          })}
        </View>
      </TouchableOpacity>
    );
  };
  renderPeakscorecard = () => {
    const {peakAllSd} = this.state;
    return (
      <View style={[styles.scoreboardView, {marginBottom: 30}]}>
        <Text style={styles.scoreText}>Scoreboard</Text>
        <Text style={styles.totalScore}>{this.state.totalMarks}</Text>
        <View style={{marginTop: 15}}>
          <FlatList
            data={peakAllSd}
            renderItem={(item, index) => this.renderScoreItem(item, index)}
            keyExtractor={(item) => item.id}
            extraData={1}
          />
        </View>
        {/*OrientationHelper.getDeviceOrientation() == 'landscape' && this.state.isChart && this.renderChart()*/}
      </View>
    );
  };
  renerQuestionStimulus = ({item, index}) => {
    const {
      currentTargetIndex,
      targetList,
      peakAllSd,
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      peakType,
    } = this.state;
    let isCurrent = false;
    let trials;

    if (peakType == 'automatic' && peakAllSd.length > 0) {
      trials = peakAllSd[currentPeakStimIndex].node.trial.edges;
      const currentTrial = trials[currentPeakTrial - 1];
      let filterData = trials.filter(
        (itema) => itema.node.id === currentTrial.node.id,
      );
      if (filterData.length > 0) {
        if (filterData[0].node.id == item.node.id) {
          isCurrent = true;
        }
      }
    } else {
      trials =
        currentPeak[currentPeakStimIndex] != undefined
          ? currentPeak[currentPeakStimIndex].node.trial != undefined
            ? currentPeak[currentPeakStimIndex].node.trial.edges
            : []
          : [];
      const currentTrial = trials[currentPeakTrial - 1];
      if (currentTrial != undefined) {
        let filterData = trials.filter(
          (item) => item.node.id === currentTrial.node.id,
        );
        if (filterData.length > 0) {
          if (filterData[0].node.sd.id == item.node.id) {
            isCurrent = true;
          }
        }
      }
    }

    let currentSd;
    if (this.state.peakType == 'automatic') {
      currentSd = peakAllSd[this.state.currentPeakStimIndex].node.trial.edges;
    } else {
      currentSd =
        targetList[currentTargetIndex] != undefined
          ? targetList[currentTargetIndex].node != undefined
            ? targetList[currentTargetIndex].node.sd.edges
            : []
          : [];
    }
    return (
      <View
        style={[
          styles.stimulusVw,
          {
            marginLeft:
              OrientationHelper.getDeviceOrientation() == 'landscape' ? 0 : -50,
            backgroundColor: isCurrent ? 'rgba(62,123,250,0.15)' : 'white',
          },
        ]}>
        <Text style={{color: '#63686E', fontSize: 12}}>
          STIMULUS {index + 1} - {currentSd.length}
        </Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          {this.state.peakType == 'automatic' ? item.node.sd.sd : item.node.sd}
        </Text>
      </View>
    );
  };
  renderQuestionCarosoul = () => {
    const {currentTargetIndex, targetList, peakAllSd} = this.state;
    let currentSd;
    if (this.state.peakType == 'automatic') {
      currentSd = peakAllSd[this.state.currentPeakStimIndex].node.trial.edges;
    } else {
      currentSd =
        targetList[currentTargetIndex] != undefined
          ? targetList[currentTargetIndex].node.sd.edges
          : [];
    }
    return (
      <Carousel
        layout={'default'}
        ref={(c) => {
          this._carouselB = c;
        }}
        data={currentSd}
        firstItem={this.checkForSelectedStimulus()}
        useScrollView={true}
        renderItem={this.renerQuestionStimulus}
        sliderWidth={
          OrientationHelper.getDeviceOrientation() == 'landscape'
            ? screenWidth / 3.7
            : screenWidth - 40
        }
        itemWidth={
          OrientationHelper.getDeviceOrientation() == 'landscape'
            ? screenWidth / 4.2
            : screenWidth - 150
        }
        onSnapToItem={(index) => {
          if (this.state.peakType == 'automatic') {
            this.setState({currentPeakTrial: index + 1});
          }
          this.setState({currentPeakSdIndex: index});
        }}
      />
    );
  };
  renderQuestionItem = ({index, item}) => {
    const {
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      peakAllSd,
      peakType,
    } = this.state;
    let trials;
    if (peakType == 'automatic' && peakAllSd.length > 0) {
      trials = peakAllSd[currentPeakStimIndex].node.trial.edges;
    } else {
      trials =
        currentPeak[currentPeakStimIndex] != undefined
          ? currentPeak[currentPeakStimIndex].node.trial != undefined
            ? currentPeak[currentPeakStimIndex].node.trial.edges
            : []
          : [];
    }
    const marks =
      trials.length > 0 && trials.length > currentPeakTrial - 1
        ? trials[currentPeakTrial - 1].node.marks
        : -1;
    return (
      <View style={styles.scoreboardView}>
        <View style={{flexDirection: 'row', marginTop: -10}}>
          <Text style={[styles.TrialText, {color: 'black'}]}>
            TRIAL {currentPeakTrial}/{10}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: -20,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.managePickNextPrevious('Previous');
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.managePickNextPrevious('Next');
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom: 20}}>
          {this.renderQuestionCarosoul()}
          <Text
            style={[
              styles.scoreText,
              {
                marginBottom:
                  OrientationHelper.getDeviceOrientation() == 'landscape'
                    ? 30
                    : 10,
                marginTop:
                  OrientationHelper.getDeviceOrientation() == 'landscape'
                    ? -10
                    : 20,
              },
            ]}>
            Scoring
          </Text>
          <View style={styles.containerPeak}>
            <TouchableOpacity
              onPress={() => this.recordPeak(marks, 0)}
              style={[
                styles.SquareShapeView,
                {backgroundColor: marks == 0 ? '#FF8080' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.recordPeak(marks, 2)}
              style={[
                styles.SquareShapeView,
                {backgroundColor: marks == 2 ? '#FF9C52' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.recordPeak(marks, 4)}
              style={[
                styles.SquareShapeView,
                {backgroundColor: marks == 4 ? '#FF9C52' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.recordPeak(marks, 8)}
              style={[
                styles.SquareShapeView,
                {backgroundColor: marks == 8 ? '#FF9C52' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.recordPeak(marks, 10)}
              style={[
                styles.SquareShapeView,
                {backgroundColor: marks == 10 ? '#4BAEA0' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>10</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  renderPeakQuestion = () => {
    const {currentPeak, peakAllSd} = this.state;
    return (
      <Carousel
        layout={'default'}
        ref={(c) => {
          this._carouselA = c;
        }}
        data={peakAllSd}
        renderItem={this.renderQuestionItem}
        scrollEnabled={false}
        sliderWidth={
          OrientationHelper.getDeviceOrientation() == 'landscape'
            ? screenWidth / 3.2
            : screenWidth - 45
        }
        itemWidth={
          OrientationHelper.getDeviceOrientation() == 'landscape'
            ? screenWidth / 3.5
            : screenWidth - 45
        }
        onSnapToItem={(index) => {
          if (
            currentPeak[index] == undefined &&
            this.state.peakType != 'automatic'
          ) {
            this.createBlock(this.state.currentPeakSkillId);
          }
          const trials =
            currentPeak[index] != undefined
              ? currentPeak[index].node.trial != undefined
                ? currentPeak[index].node.trial.edges
                : []
              : [];
          this.setState({
            currentPeakStimIndex: index,
            currentPeakTrial:
              trials.length == 0 ? 1 : trials.length < 10 ? trials.length : 10,
          });
        }}
      />
    );
  };
  renderPeak = () => {
    const {currentPeakStimIndex, currentPeak, peakAllSd, peakType} = this.state;
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let trials;
    if (peakType == 'automatic' && peakAllSd.length > 0) {
      trials = peakAllSd[currentPeakStimIndex].node.trial.edges;
    } else {
      trials =
        currentPeak[currentPeakStimIndex] != undefined
          ? currentPeak[currentPeakStimIndex].node.trial != undefined
            ? currentPeak[currentPeakStimIndex].node.trial.edges
            : []
          : [];
    }
    return (
      <View style={styles.peakView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 10, marginLeft: 10}}>
            Block {currentPeakStimIndex + 1}/{peakAllSd.length}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (currentPeakStimIndex != 0) {
                  this.setState({
                    currentPeakStimIndex: currentPeakStimIndex - 1,
                  });
                  this._carouselA.snapToItem(
                    currentPeakStimIndex - 1,
                    true,
                    () => {},
                  );
                }
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentPeakStimIndex < peakAllSd.length - 1) {
                  this.setState({
                    currentPeakStimIndex: currentPeakStimIndex + 1,
                  });
                  this._carouselA.snapToItem(
                    currentPeakStimIndex + 1,
                    true,
                    () => {},
                  );
                }
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          {data.map((item, index) => {
            if (trials.length > 0 && trials.length > index) {
              const mark = trials[index].node.marks;
              return (
                <View
                  style={[
                    styles.scoreItemTextVw,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        mark == 0
                          ? '#FF8080'
                          : mark == 10
                          ? '#4BAEA0'
                          : mark == 2 || mark == 4 || mark == 8
                          ? '#FF9C52'
                          : 'white',
                    },
                  ]}>
                  <Text style={{fontSize: 10, color: 'white'}}>{mark}</Text>
                </View>
              );
            } else {
              return <View style={styles.scoreItemTextVw}></View>;
            }
          })}
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {this.renderPeakQuestion()}
        </View>
        {OrientationHelper.getDeviceOrientation() == 'portrait' &&
          this.renderPeakscorecard()}
      </View>
    );
  };

  //Note:- Circular Session part
  renderCircularStimulus = ({item, index}) => {
    return (
      <View
        style={[
          styles.stimulusVw,
          {marginLeft: -50, backgroundColor: 'white'},
        ]}>
        <Text style={{color: '#63686E', fontSize: 12}}>
          STIMULUS {index + 1} - 4
        </Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          Stimulus 1
        </Text>
      </View>
    );
  };
  renderCircularCarosoul = () => {
    const data = [1, 2, 3, 4];

    return (
      <Carousel
        layout={'default'}
        ref={(c) => {
          this._carouselB = c;
        }}
        data={data}
        useScrollView={true}
        renderItem={this.renderCircularStimulus}
        sliderWidth={screenWidth - 40}
        itemWidth={screenWidth - 150}
        onSnapToItem={(index) => {}}
      />
    );
  };
  renderCircularItem = ({index, item}) => {
    return (
      <View style={styles.scoreboardView}>
        <View style={{flexDirection: 'row', marginTop: -10}}>
          <Text style={[styles.TrialText, {color: 'black'}]}>TRIAL 1/{15}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: -20,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.managePickNextPrevious('Previous');
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.managePickNextPrevious('Next');
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {this.renderCircularCarosoul()}
          <View style={{marginBottom: -90}}>{this.renderResponse('abc')}</View>
        </View>
      </View>
    );
  };
  renderCircularQuestion = () => {
    const data = [1, 2, 3, 4, 5];
    return (
      <Carousel
        layout={'default'}
        ref={(c) => {
          this._carouselA = c;
        }}
        data={data}
        renderItem={this.renderCircularItem}
        scrollEnabled={false}
        sliderWidth={screenWidth - 45}
        itemWidth={screenWidth - 45}
        onSnapToItem={(index) => {}}
      />
    );
  };
  renderCircularScoreItem = (item, index) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    return (
      <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.scoreItemVw}>
          <Text>S-{item.index + 1}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '85%',
          }}>
          {data.map((item, index) => {
            return <View style={[styles.scoreItemTextVw, {marginTop: 4}]} />;
          })}
        </View>
      </TouchableOpacity>
    );
  };
  renderCircularRecord = () => {
    const data = [1, 2, 3, 4, 5];
    return (
      <View style={[styles.scoreboardView, {marginBottom: 30}]}>
        <View style={{marginTop: 15}}>
          <FlatList
            data={data}
            renderItem={(item, index) =>
              this.renderCircularScoreItem(item, index)
            }
            keyExtractor={(item) => item.id}
            extraData={1}
          />
        </View>
      </View>
    );
  };
  renderCircular = () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return (
      <View style={styles.peakView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 10, marginLeft: 10}}>Block 1/3</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 0,
            }}>
            <TouchableOpacity>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
            width: '90%',
            marginHorizontal: 10,
            flexWrap: 'wrap',
          }}>
          {data.map((item, index) => {
            return (
              <View style={[styles.scoreItemTextVw, {marginTop: 4}]}></View>
            );
          })}
        </View>
        {this.renderCircularQuestion()}
        {this.renderCircularRecord()}
      </View>
    );
  };

  //Note:- Peak Equivalence part
  renderPeakScoreItem = (item, index) => {
    const {peakEquiRecord} = this.state;
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.scoreItemVw}>
          <Text>A-B</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '85%',
          }}>
          {data.map((item, index) => {
            if (peakEquiRecord.length > 0 && peakEquiRecord.length > index) {
              const mark = peakEquiRecord[index].node.score;
              return (
                <View
                  style={[
                    styles.scoreItemTextVw,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        mark == 0
                          ? '#FF8080'
                          : mark == 10
                          ? '#4BAEA0'
                          : mark == 2 || mark == 4 || mark == 8
                          ? '#FF9C52'
                          : 'white',
                    },
                  ]}>
                  <Text style={{fontSize: 10, color: 'white'}}>{mark}</Text>
                </View>
              );
            } else {
              return <View style={styles.scoreItemTextVw}></View>;
            }
          })}
        </View>
      </TouchableOpacity>
    );
  };
  renderPeakScoreClassItem = (item, index) => {
    const {peakEquiClassRecord} = this.state;
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    console.log('peak equi record', peakEquiClassRecord);
    let class1 = peakEquiClassRecord.filter(
      (item) => item.node.codeClass.name == 'Class 1',
    );
    let class2 = peakEquiClassRecord.filter(
      (item) => item.node.codeClass.name == 'Class 2',
    );
    let class3 = peakEquiClassRecord.filter(
      (item) => item.node.codeClass.name == 'Class 3',
    );
    let currentRecords =
      item.item == 0 ? class1 : item.item == 1 ? class2 : class3;

    console.log(currentRecords, 'current records');
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.scoreItemVw}>
          <Text>class{item.item + 1}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '85%',
          }}>
          {data.map((item, index) => {
            if (currentRecords.length > 0 && currentRecords.length > index) {
              const mark = currentRecords[index].node.score;
              return (
                <View
                  style={[
                    styles.scoreItemTextVw,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        mark == 0
                          ? '#FF8080'
                          : mark == 10
                          ? '#4BAEA0'
                          : mark == 2 || mark == 4 || mark == 8
                          ? '#FF9C52'
                          : 'white',
                    },
                  ]}>
                  <Text style={{fontSize: 10, color: 'white'}}>{mark}</Text>
                </View>
              );
            } else {
              return <View style={styles.scoreItemTextVw}></View>;
            }
          })}
        </View>
      </TouchableOpacity>
    );
  };
  calculateTotal = () => {
    let total = 0;
    const {peakEquiRecord} = this.state;
    peakEquiRecord.map((item) => (total = total + item.node.score));
    return total;
  };
  calculateClassTotal = () => {
    let total = 0;
    const {peakEquiClassRecord} = this.state;
    peakEquiClassRecord.map((item) => (total = total + item.node.score));
    return total;
  };
  renderPeakEquscorecard = () => {
    const data = [1, 2, 3, 4];
    const {isEquiRecord, equiTarget} = this.state;
    const arr = [];
    equiTarget.classes?.edges.map((item, index) => {
      arr.push(index);
    });
    return (
      <View style={[styles.scoreboardView, {marginBottom: 30}]}>
        <Text style={styles.scoreText}>Scoreboard</Text>
        <Text style={styles.totalScore}>
          {isEquiRecord ? this.calculateTotal() : this.calculateClassTotal()}
        </Text>
        <View style={{marginTop: 15}}>
          <FlatList
            data={isEquiRecord ? [1] : arr}
            renderItem={(item, index) =>
              isEquiRecord
                ? this.renderPeakScoreItem(item, index)
                : this.renderPeakScoreClassItem(item, index)
            }
            keyExtractor={(item) => item.id}
            extraData={1}
          />
        </View>
      </View>
    );
  };
  classItem = (props) => {
    const {index, item} = props;
    const {classIndex} = this.state;
    return (
      <TouchableOpacity
        style={{marginHorizontal: 7}}
        onPress={() => {
          this.setState(
            {classIndex: index, peakEquiRecord: [], peakEquTarget: 1},
            () => {
              this.getTargetSessionRecordings(
                this.state.parentSessionInfo.id,
                this.state.targetList[this.state.currentTargetIndex].node.id,
                this.state.currentTargetIndex,
              );
            },
          );
        }}>
        <Text style={styles.classText}>{item.node.name}</Text>
        {index == classIndex && <View style={styles.bottomLineVw} />}
      </TouchableOpacity>
    );
  };
  itemStimulus = (props) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const {classIndex, equiTarget, peakEquiRecord} = this.state;

    return (
      <TouchableOpacity
        style={{marginHorizontal: 1}}
        onPress={() => {
          this.setState({isEquiRecord: true}, () => {
            this.getTargetSessionRecordings(
              this.state.parentSessionInfo.id,
              this.state.targetList[this.state.currentTargetIndex].node.id,
              this.state.currentTargetIndex,
            );
          });
        }}>
        <View style={[styles.SquareShapStimView, {marginTop: 1}]}>
          {equiTarget != undefined && (
            <Text style={styles.headingText}>
              {
                equiTarget.classes?.edges[classIndex]?.node.stimuluses.edges[0]
                  ?.node.option
              }
              -
              {
                equiTarget.classes?.edges[classIndex]?.node.stimuluses.edges[1]
                  ?.node.option
              }
            </Text>
          )}

          {equiTarget.test != undefined && (
            <Text style={styles.headingText}>
              {equiTarget.test.edges[0].node.stimulus1}
              {equiTarget.test.edges[0].node.sign12}
              {equiTarget.test.edges[0].node.stimulus2}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '100%',
              marginTop: 10,
            }}>
            {data.map((item, index) => {
              if (peakEquiRecord.length > 0 && peakEquiRecord.length > index) {
                const mark = peakEquiRecord[index].node.score;
                return (
                  <View
                    style={[
                      styles.scoreItemTextVw,
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          mark == 0
                            ? '#FF8080'
                            : mark == 10
                            ? '#4BAEA0'
                            : mark == 2 || mark == 4 || mark == 8
                            ? '#FF9C52'
                            : 'white',
                      },
                    ]}>
                    <Text style={{fontSize: 10, color: 'white'}}>{mark}</Text>
                  </View>
                );
              } else {
                return <View style={styles.scoreItemTextVw}></View>;
              }
            })}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderPeakEquivalence = () => {
    const {equiTarget, isTrain} = this.state;

    return (
      <View>
        <Text style={{marginTop: 10, fontSize: 20}}>{equiTarget.code}</Text>
        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  isTrain: true,
                  peakEquiRecord: [],
                  peakEquiClassRecord: [],
                  peakEquTarget: 1,
                },
                () => {
                  this.getTargetSessionRecordings(
                    this.state.parentSessionInfo.id,
                    this.state.targetList[this.state.currentTargetIndex].node
                      .id,
                    this.state.currentTargetIndex,
                  );
                },
              );
            }}>
            <Text style={{fontSize: 16}}>Train</Text>
            <View
              style={[
                styles.TrainingTab,
                {backgroundColor: isTrain ? '#007ff6' : 'white'},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 10, width: 60}}
            onPress={() => {
              this.setState(
                {
                  isTrain: false,
                  peakEquiRecord: [],
                  peakEquiClassRecord: [],
                  peakEquTarget: 1,
                },
                () => {
                  this.getTargetSessionRecordings(
                    this.state.parentSessionInfo.id,
                    this.state.targetList[this.state.currentTargetIndex].node
                      .id,
                    this.state.currentTargetIndex,
                  );
                },
              );
            }}>
            <Text style={{fontSize: 16, marginLeft: 20}}>Test</Text>
            <View
              style={[
                styles.TrainingTab,
                {
                  backgroundColor: !isTrain ? '#007ff6' : 'white',
                  left: 10,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{marginTop: 8}}
          bounces
          data={equiTarget.classes?.edges}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={(item, index) => this.classItem(item, index)}
          keyExtractor={(item) => item.id}
        />
        <FlatList
          style={{marginTop: 15}}
          bounces
          data={[1]}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => this.itemStimulus(item, index)}
          keyExtractor={(item) => item.id}
        />
        <View style={{paddingHorizontal: 10}}>
          {this.renderPeakEquscorecard()}
        </View>
      </View>
    );
  };
  renderPeakEquQuestionItem = () => {
    const {equiTarget, classIndex, peakEquTarget, peakEquiRecord} = this.state;

    console.log('peakEquiRecord is --->' + JSON.stringify(peakEquiRecord));
    console.log('peakEquTarget is --->' + JSON.stringify(peakEquiRecord));

    console.log('peak equi index', peakEquTarget);

    const mark =
      peakEquiRecord.length > peakEquTarget - 1
        ? peakEquiRecord[peakEquTarget - 1].node.score
        : -1;
    const pkId =
      peakEquiRecord.length > peakEquTarget - 1
        ? peakEquiRecord[peakEquTarget - 1].node.id
        : 0;

    return (
      <View style={styles.scoreboardView}>
        <View style={{flexDirection: 'row', marginTop: -20, marginBottom: 10}}>
          <Text style={[styles.TrialText, {color: 'black'}]}>
            TRIAL {peakEquTarget}/10
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  peakEquTarget:
                    peakEquTarget > 1 ? peakEquTarget - 1 : peakEquTarget,
                });
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  peakEquTarget:
                    peakEquTarget < 10 ? peakEquTarget + 1 : peakEquTarget,
                });
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {equiTarget != undefined && (
          <Text style={styles.headingText}>
            {
              equiTarget.classes?.edges[classIndex]?.node.stimuluses.edges[0]
                ?.node.option
            }
            -
            {
              equiTarget.classes?.edges[classIndex]?.node.stimuluses.edges[1]
                ?.node.option
            }
          </Text>
        )}

        {equiTarget != undefined && (
          <Text style={styles.headingText}>
            {
              equiTarget.classes?.edges[classIndex]?.node.stimuluses.edges[0]
                ?.node.stimulusName
            }
            -
            {
              equiTarget.classes?.edges[classIndex]?.node.stimuluses.edges[1]
                ?.node.stimulusName
            }
          </Text>
        )}
        <View style={{marginBottom: 20}}>
          <Text style={[styles.scoreText, {marginBottom: 30, marginTop: 20}]}>
            Scoring
          </Text>
          <View style={styles.containerPeak}>
            <TouchableOpacity
              onPress={() => {
                mark == -1
                  ? this.recordPeakEqui(0)
                  : this.updatePeakEqui(pkId, 0);
              }}
              style={[
                styles.SquareShapeView,
                {
                  backgroundColor: mark == 0 ? '#FF8080' : 'white',
                },
              ]}>
              <Text style={styles.peakNumber}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                mark == -1
                  ? this.recordPeakEqui(2)
                  : this.updatePeakEqui(pkId, 2);
              }}
              style={[
                styles.SquareShapeView,
                {backgroundColor: mark == 2 ? '#FF9C52' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                mark == -1
                  ? this.recordPeakEqui(4)
                  : this.updatePeakEqui(pkId, 4);
              }}
              style={[
                styles.SquareShapeView,
                {backgroundColor: mark == 4 ? '#FF9C52' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                mark == -1
                  ? this.recordPeakEqui(8)
                  : this.updatePeakEqui(pkId, 8);
              }}
              style={[
                styles.SquareShapeView,
                {backgroundColor: mark == 8 ? '#FF9C52' : 'white'},
              ]}>
              <Text style={styles.peakNumber}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                mark == -1
                  ? this.recordPeakEqui(10)
                  : this.updatePeakEqui(pkId, 10);
              }}
              style={[
                styles.SquareShapeView,
                {
                  backgroundColor: mark == 10 ? '#4BAEA0' : 'white',
                },
              ]}>
              <Text style={styles.peakNumber}>10</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  renderPeakEquRecord() {
    console.log('In render peak equi record');
    const {isTrain} = this.state;
    return (
      <View>
        <Text style={{marginVertical: 10}}>
          {isTrain ? 'Training' : 'Test'}
        </Text>
        {this.renderPeakEquQuestionItem()}
        {this.renderPeakEquscorecard()}
        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
          <Button
            theme="danger"
            style={{height: 42, padding: 10, marginBottom: 50}}
            labelButton={'Cancel'}
            onPress={() => {
              this.setState({isEquiRecord: false, peakEquTarget: 1});
            }}
          />
        )}
      </View>
    );
  }

  /*
  ....###....########.########....###.....######..##.....##.##.....##.########.##....##.########
  ...##.##......##.......##......##.##...##....##.##.....##.###...###.##.......###...##....##...
  ..##...##.....##.......##.....##...##..##.......##.....##.####.####.##.......####..##....##...
  .##.....##....##.......##....##.....##.##.......#########.##.###.##.######...##.##.##....##...
  .#########....##.......##....#########.##.......##.....##.##.....##.##.......##..####....##...
  .##.....##....##.......##....##.....##.##....##.##.....##.##.....##.##.......##...###....##...
  .##.....##....##.......##....##.....##..######..##.....##.##.....##.########.##....##....##...
  */

  showImageAttachmentModal = (type, index, url) => {
    const {
      viewAttachment,
      targetList,
      currentTargetIndex,
      attachmentIndex,
      stimulusCurrentIndex,
    } = this.state;

    let tempUrl;
    let currentSd =
      targetList[currentTargetIndex]?.node?.sd?.edges[stimulusCurrentIndex]
        ?.node?.sd;
    targetList[currentTargetIndex]?.node?.targetDocs?.edges.map((doc) => {
      if (doc?.node?.sd?.sd === currentSd) {
        tempUrl = doc?.node?.url;
      }
    });

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.viewImageAttachment}
        onRequestClose={() => {
          this.setState({
            viewImageAttachment: false,
          });
        }}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            style={{padding: 7, alignSelf: 'flex-end'}}
            onPress={() => this.setState({viewImageAttachment: false})}>
            <MaterialCommunityIcons name="close" size={28} />
          </TouchableOpacity>

          <View
            style={{
              marginHorizontal: 7,
              borderRadius: 10,
              overflow: 'hidden',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Image
              source={{
                uri: tempUrl,
              }}
              style={{height: '80%', width: '100%', resizeMode: 'contain'}}
              progressiveRenderingEnabled
            />
          </View>

          {/*  */}
        </SafeAreaView>
      </Modal>
    );
  };

  showAttachmentModal = (type, index, url) => {
    const {
      viewAttachment,
      targetList,
      currentTargetIndex,
      attachmentIndex,
    } = this.state;

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.viewAttachment}
        onRequestClose={() => {
          this.setState({
            viewAttachment: false,
          });
        }}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            style={{padding: 7, alignSelf: 'flex-end'}}
            onPress={() => this.setState({viewAttachment: false})}>
            <MaterialCommunityIcons name="close" size={28} />
          </TouchableOpacity>

          <View style={{marginHorizontal: 7}}>
            <Pdf
              source={{
                uri: this.state.attachmentUrl,
              }}
              style={{height: '100%', width: '100%'}}
            />
          </View>

          {/*  */}
        </SafeAreaView>
      </Modal>
    );
  };

  handleView = (index, name, url) => {
    this.setState({showAttachment: false});
    let type = name.split('.');
    console.log('type', type);
    if (
      type[type.length - 1] == 'png' ||
      type[type.length - 1] == 'jpg' ||
      type[type.length - 1] == 'jpeg'
    ) {
      this.setState({viewImageAttachment: true});
      this.showImageAttachmentModal('i', index, url);
      this.props.navigation.navigate('AttachmentScreen', {
        type: 'i',
        url,
      });
    } else {
      this.setState({viewAttachment: true});
      this.showAttachmentModal('p', index, url);
      this.props.navigation.navigate('AttachmentScreen', {
        type: 'p',
        url,
      });
    }
  };

  renderAttachmentItem = ({item, index}) => {
    let uriComponent = item.node.url.split('/');
    let name = uriComponent[uriComponent.length - 1];
    let type = name.split('.');

    let isImage = false;
    let isCollapsed = true;

    if (
      type[type.length - 1] == 'png' ||
      type[type.length - 1] == 'jpg' ||
      type[type.length - 1] == 'jpeg'
    ) {
      isImage = true;
    } else {
      isImage = false;
    }
    return (
      <View
        style={{
          padding: 10,
          borderWidth: StyleSheet.hairlineWidth,
          marginVertical: 5,
          borderColor: Color.primary,
          marginHorizontal: 7,
          borderRadius: 7,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.setState({attachmentIndex: index});
            isCollapsed = !isCollapsed;
            this.handleView(
              index,
              uriComponent[uriComponent.length - 1],
              item.node.url,
            );
          }}>
          <Text style={{marginLeft: screenWidth * 0.002}}>{name}</Text>
        </TouchableOpacity>

        {/* {isImage &&  <View
            style={{
              marginHorizontal: 7,
              borderRadius: 10,
              justifyContent: 'center',
              height: screenHeight * 0.4 ,
              width: "90%",
              alignItems: "center"
            }}>
            <Image
              source={{
                uri: item?.node?.url
              }}
              style={{height: '80%', width: '100%', resizeMode: 'contain', alignSelf: 'center'}}
              progressiveRenderingEnabled
            />
          </View>}
          {!isImage &&  <View style={{marginHorizontal: 7}}>
            <Pdf
              source={{
                uri:
                  item?.node?.url,
              }}
              style={{height: '100%', width: '100%'}}
            />
          </View>} */}
      </View>
    );
  };

  renderAttachmentModal = () => {
    const {
      showAttachment,
      attachmentData,
      targetList,
      currentTargetIndex,
      stimulusCurrentIndex,
      stepsCurrentIndex,
      currentPeakStimIndex,
      peakAllSd,
      currentPeak,
      currentPeakSdIndex,
    } = this.state;

    // console.log("console.log(peak all sd)", peakAllSd)

    // targetList[currentTargetIndex].node.targetAllcatedDetails
    //                 .targetType.typeTar === 'Peak'

    let currentsd =
      targetList[currentTargetIndex]?.node?.sd?.edges[stimulusCurrentIndex]
        ?.node?.sd;
    let currentStep =
      targetList[currentTargetIndex]?.node?.steps?.edges[stepsCurrentIndex]
        ?.node?.step;
    let currentPeakSd;

    if (
      targetList[currentTargetIndex]?.node?.targetAllcatedDetails?.targetType
        ?.typeTar === 'Peak'
    ) {
      currentPeakSd =
        targetList[currentTargetIndex]?.node?.sd?.edges[currentPeakSdIndex]
          ?.node?.sd;
    }
    let tempArr = [];

    if (
      targetList[currentTargetIndex]?.node?.targetAllcatedDetails?.targetType
        ?.typeTar !== 'Peak' &&
      targetList[currentTargetIndex]?.node?.sd?.edges.length > 0
    ) {
      tempArr = targetList[currentTargetIndex]?.node?.targetDocs.edges.filter(
        (doc) => doc?.node?.sd?.sd === currentsd,
      );
    } else if (targetList[currentTargetIndex]?.node?.steps?.edges.length > 0) {
      tempArr = targetList[currentTargetIndex]?.node?.targetDocs.edges.filter(
        (doc) => doc?.node?.step?.step === currentStep,
      );
    } else if (
      targetList[currentTargetIndex]?.node?.targetAllcatedDetails?.targetType
        ?.typeTar === 'Peak'
    ) {
      tempArr = targetList[currentTargetIndex]?.node?.targetDocs.edges.filter(
        (doc) => doc?.node?.sd?.sd === currentPeakSd,
      );
    }

    let tempAllFile = [];
    let temp = [];
    targetList[currentTargetIndex]?.node?.targetDocs.edges.map((doc) => {
      if (!doc?.node?.sd?.sd && !doc?.node?.step?.step) {
        tempAllFile.push(doc);
      }
    });

    tempAllFile.map((file) => tempArr.push(file));

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.showAttachment}
        onRequestClose={() => {
          this.setState({
            showAttachment: false,
          });
        }}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 7,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Attachments</Text>
            <TouchableOpacity
              style={{alignSelf: 'flex-end', padding: 7}}
              onPress={() => this.setState({showAttachment: false})}>
              <MaterialCommunityIcons name="close" size={25} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={tempArr}
            renderItem={this.renderAttachmentItem}
            keyExtractor={(item) => item.node.id.toString()}
            ListEmptyComponent={() => (
              <Text style={{alignSelf: 'center'}}>No attachment Available</Text>
            )}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  /*
  .########..########.##....##.########..########.########.
  .##.....##.##.......###...##.##.....##.##.......##.....##
  .##.....##.##.......####..##.##.....##.##.......##.....##
  .########..######...##.##.##.##.....##.######...########.
  .##...##...##.......##..####.##.....##.##.......##...##..
  .##....##..##.......##...###.##.....##.##.......##....##.
  .##.....##.########.##....##.########..########.##.....##
  */

  startExtraTimer = (seconds, type) => {
    extraBackgroundTimer = setInterval(() => {
      ++seconds;
      let pSeconds = (seconds % 60) + '';
      if (pSeconds.length < 2) {
        pSeconds = '0' + pSeconds;
      }
      let sec = pSeconds;

      let pMinutes = parseInt(seconds / 60) + '';
      if (pMinutes.length < 2) {
        pMinutes = '0' + pMinutes;
      }
      let min = pMinutes;

      let totalDuration = `${min} min ${sec} sec`;

      // console.log("duration", totalDuration)
      this.setState(
        {
          extraShowTimer: totalDuration,
          extraTotalSeconds: seconds,
        },
        () => {
          // if(type) this.startThirdExtraTimer(this.state.thirdTotalSeconds)
        },
      );
    }, 1000);
  };
  startThirdExtraTimer = (seconds, type) => {
    thirdExtraBackgroundTimer = setInterval(() => {
      ++seconds;
      let pSeconds = (seconds % 60) + '';
      //console.log(pSeconds);
      if (pSeconds.length < 2) {
        pSeconds = '0' + pSeconds;
      }
      let sec = pSeconds;

      let pMinutes = parseInt(seconds / 60) + '';
      if (pMinutes.length < 2) {
        pMinutes = '0' + pMinutes;
      }
      let min = pMinutes;

      let totalDuration = `${min} min ${sec} sec`;

      // console.log("duration", totalDuration)
      this.setState({
        thirdShowTimer: totalDuration,
        thirdTotalSeconds: seconds,
      });
    }, 1000);
  };

  setRate = (unit = 0, unitIndex) => {
    console.log('unit ', unit);
    console.log('unitIndex ', unitIndex);
    const {
      recordingDuration,
      recordingTypeData,
      recordingFrequency,
    } = this.state;
    let duration = recordingDuration * 1000;
    console.log('recordingDuration', recordingDuration, recordingFrequency);

    if (Number(recordingDuration) > 0) {
      let calculatedRate = 0;
      switch (unit) {
        case 0:
          calculatedRate = (recordingFrequency * 1000) / duration;
          break;

        case 1:
          calculatedRate = (recordingFrequency * 100) / (duration * 6);
          break;

        case 2:
          calculatedRate = (recordingFrequency * 10) / (duration * 36);
          break;

        case 3:
          calculatedRate = (recordingFrequency * 10) / (duration * 36 * 24);
          break;

        default:
          break;
      }
      console.log('calculated rate>>>>>>>', calculatedRate);
      this.setState({calculatedRate: calculatedRate.toFixed(3).toString()});
    }
  };

  startBehaviorTimer = () => {
    const {
      isExtraTimerRunning,
      extraTotalSeconds,
      thirdTotalSeconds,
    } = this.state;

    if (isExtraTimerRunning) {
      this.setState(
        {
          showThirdTimer: true,
          startExtraTimer: true,
          startThirdTimer: true,
          startBehaviourTime: extraTotalSeconds * 1000,
        },
        () => {
          this.startThirdExtraTimer(thirdTotalSeconds);
        },
      );
    } else {
      this.setState(
        {
          isExtraTimerRunning: true,
          startExtraTimer: true,
          startThirdTimer: true,
          showThirdTimer: true,
          startBehaviourTime: extraTotalSeconds * 1000,
        },
        () => {
          this.startExtraTimer(extraTotalSeconds);
          this.startThirdExtraTimer(thirdTotalSeconds);
        },
      );
    }
  };

  stopBehaviourTimer = () => {
    const {
      extraTotalSeconds,
      stopBehaviourTime,
      startBehaviourTime,
      totalBehaviourDuration,
      behaviours,
      recordingFrequency,
      recordingDuration,
      totalBehaviourFrequency,
      Frequency,
    } = this.state;
    let tempBehaviours = behaviours;

    this.setState(
      {
        startThirdTimer: false,
        thirdShowTimer: '00 min 00 sec',
        thirdTotalSeconds: 0,
        showThirdTimer: false,
        stopBehaviourTime: extraTotalSeconds * 1000,
        recordingFrequency: tempBehaviours.length,
      },
      () => {
        clearInterval(thirdExtraBackgroundTimer);
        let tempDuration = extraTotalSeconds * 1000 - startBehaviourTime;
        tempBehaviours.push({
          start: startBehaviourTime,
          end: extraTotalSeconds * 1000,
          duration: tempDuration,
        });

        // let tempRecordingDuration = Number(recordingDuration) + ((extraTotalSeconds * 1000) - startBehaviourTime)
        let tempRecordingDuration =
          Number(totalBehaviourDuration) + Number(tempDuration);
        let rd = Number(recordingDuration) + Math.round(Number(tempDuration) / 1000);
        let tempFrequency =
          Number(totalBehaviourFrequency) > 0
            ? Number(totalBehaviourFrequency) + 1
            : Number(Frequency) + 1;
        console.log(
          'totalFrequenct>>>>>>',

          tempDuration,
          recordingDuration,
          rd,
          tempRecordingDuration,
          totalBehaviourDuration,
        );
        this.setState(
          {
            totalBehaviourDuration: tempRecordingDuration.toString(),
            recordingFrequency: tempFrequency.toString(),
            recordingDuration: rd,
            behaviours: tempBehaviours,
            totalBehaviourFrequency: tempFrequency,
            Frequency: Frequency + 1,
          },
          () => {
            this.setRate(Number(this.state.selectedRecordingType));
            this.recordBehaviour();
          },
        );
      },
    );
    console.log('behaviour', behaviours);
  };

  recordBehaviour = () => {
    const {
      totalBehaviourFrequency,
      totalBehaviourDuration,
      startBehaviourTime,
      stopBehaviourTime,
      targetList,
      currentTargetIndex,
      Frequency,
    } = this.state;

    let tempArr = [];

    tempArr.push({
      frequency: totalBehaviourFrequency,
      start: startBehaviourTime,
      end: stopBehaviourTime,
    });

    let variables = {
      totalBehRecordingDuration: parseInt(Frequency),
      behaviourRecording: tempArr,
      targets: targetList[currentTargetIndex]?.node?.id,
      childSession: this.state.parentSessionInfo.id,
      status: targetList[currentTargetIndex]?.node?.targetStatus?.id,
      isBehRecording: true,
    };
    console.log('targetBehRecording>>>>', targetList[currentTargetIndex]?.node);
    console.log('variables>>>>>>>>>>>>>', variables);
    let v = {
      pk: this.state.parentSessionInfo.id,
      duration: parseInt(totalBehaviourDuration),
    };
    ParentRequest.updateChildSessionDuration(v).then((res) => {
      console.log('response>>>>>', res.data.changeSessionStatus);
    });
    ParentRequest.recordBehaviour(variables)
      .then((res) => {
        console.log(
          'response>>>>>>>>>>',
          res.data.recordBehaviourReductionRecording,
        );
        const variables2 = {
          target: targetList[currentTargetIndex]?.node?.id,
          sd: '',
          step: '',
          sessionId: this.props.route.params.sessionId,
        };
        console.log('variables2*****', variables2);
        let bRec;
        if(this.state.date){
          bRec=this.getPreviousRecordingsAll(
            this.state.parentSessionInfo.id,
          targetList[currentTargetIndex]?.node?.id,
          );
        }
        else{ 
          bRec = this.getCurrentSessionRecordings(
          this.state.parentSessionInfo.id,
          targetList[currentTargetIndex]?.node?.id,
        );
        }
        bRec.then((data) => {
          this.setState({
            behRec:
              data.getSessionRecordings.edges.length > 0
                ? data.getSessionRecordings.edges[0].node.behaviourRecording
                : undefined,
            Frequency:
              data.getSessionRecordings.edges.length > 0
                ? data.getSessionRecordings.edges[0].node.behaviourRecording
                    ?.edges?.length
                : 0,
            scoreLoading:false
          });
        });
        let dr = 0;


        // // ClinicRequest.get5dayPercentage2(variables2)
        // .then(res=>{
        //   console.log("response>>>>getPercentage>>>",res.data);
        // })
        // .catch((err)=>{
        //   console.log("error>>>>>>>>",err);
        // })
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  startBehaviourRedutionTimer = (seconds) => {
    reductionTimer = setInterval(() => {
      ++seconds;
      let pSeconds = (seconds % 60) + '';
      //console.log(pSeconds);
      if (pSeconds.length < 2) {
        pSeconds = '0' + pSeconds;
      }
      let sec = pSeconds;

      let pMinutes = parseInt(seconds / 60) + '';
      if (pMinutes.length < 2) {
        pMinutes = '0' + pMinutes;
      }
      let min = pMinutes;

      let totalDuration = `${min} min ${sec} sec`;

      // console.log("duration", totalDuration)
      this.setState({
        reductionShowTimer: totalDuration,
        reductionTotalSeconds: seconds,
      });
    }, 1000);
  };


  renderBehaviourReductionView = () => {
    // this.startBehaviourRedutionTimer()
    const {reductionShowTimer, SBTStepActiveIndex,SBTStepActiveId,targetList,isPrompt,isCorrect, currentTargetIndex} = this.state;
    console.log("SBTDemo>>>",SBTStepActiveId,SBTStepActiveIndex,targetList.length,currentTargetIndex);
    console.log("targetList>>>",this.timerRef.current);
    
    return (
      <View style={{padding: 15}}>
        {/* {this.renderTrial()} */}
        <View style={styles.trailProgressTitle}>
          <Text style={styles.trailProgressText}>
            {targetList[currentTargetIndex].node.sbtSteps?.edges?.length>0?targetList[currentTargetIndex].node.sbtSteps?.edges[SBTStepActiveIndex].node.description:<Text>No Steps Found</Text>}
          </Text>
        <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTstepTo('previous');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-left'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
              <Text style={{
                marginTop:5
              }}>Step {SBTStepActiveIndex+1}/{targetList[currentTargetIndex].node.sbtSteps?.edges?.length}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTstepTo('next');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-right'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
            </View>
</View>
<View style={{justifyContent:'center',...styles.cardTarget}}>
<View style={{flexDirection: 'row',justifyContent:'center'}}>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTstepTo('previous');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-left'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
              <Text style={{
                marginTop:5
              }}>Trial {SBTStepActiveIndex+1}/{targetList[currentTargetIndex].node.targetAllcatedDetails?.DailyTrials}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTstepTo('next');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-right'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <View
          style={{
            backgroundColor: Color.bluejay,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Timer
                            key={SBTStepActiveIndex+Math.random()}
                            initialTime={30000}
                            direction="backward"
                            startImmediately={true}
                            checkpoints={[
                              {
                                time: 29,
                                callback: () => {
                                  console.log('Checkpoint 30 sec - call record none response query')
                                  // autoRecordNone && this.recordResponse('Error', '', '', '', '')
                                },
                              },
                            ]}
                          >
                            {() => (
                              <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                              }}>
                              <Text style={{margin: 5, fontSize: 16, color: Color.white}}>
                                <Timer.Minutes /> min
                              </Text>
                              <Text style={{margin: 5, fontSize: 16, color: Color.white}}>
                                <Timer.Seconds /> sec
                              </Text>
                            </View>
                            )}
                          </Timer>
            {/* <Text style={{fontSize: 18,color:Color.white}}>{reductionShowTimer}</Text> */}
          </View>
        </View>
</View>
        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            width:'30%',
            margin:8
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              borderColor:Color.bluejay

            }}>
            <Text style={{fontSize: 15, color: Color.bluejay}}>
              R1:{' '}
              <Text style={{color: Color.bluejay, fontSize: 15}}>
                {targetList[currentTargetIndex]?.node?.r1?.behaviorName}(0)
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 10,margin:8,width:'30%'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1
            }}>
            <Text style={{color: Color.bluejay, fontSize: 15}}>
              R2:{' '}
              <Text style={{color: Color.bluejay, fontSize: 15}}>
                {targetList[currentTargetIndex]?.node?.r2?.behaviorName}(0)
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            width:'30%',
            margin:8
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              borderColor:Color.bluejay

            }}>
            <Text style={{fontSize: 15, color: Color.bluejay}}>
              None(0)              
            </Text>
          </TouchableOpacity>
        </View>
        </View>
        
        
        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            width:'40%',
            margin:8
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              borderColor:Color.bluejay

            }}
            onPress={()=>{
              this.setState({
                isPrompt:!isPrompt,
                isCorrect:false
              })

            }}>
            <Text style={{fontSize: 15, color: Color.bluejay}}>
              Prompt(0)
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 10,margin:8,width:'40%'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1
            }}
            onPress={()=>{
              this.setState({
                isPrompt:false,
                isCorrect:!isCorrect
              })

            }}>
            <Text style={{color: Color.bluejay, fontSize: 15}}>
              Correct(0){' '}
              
            </Text>
          </TouchableOpacity>
        </View>
        </View>
        <View style={{flexDirection:'column'}}>
        {isPrompt && targetList[currentTargetIndex].node.targetAllcatedDetails?.promptCodes.edges.length>0 && <>
          {
            targetList[currentTargetIndex].node.targetAllcatedDetails?.promptCodes.edges.map(({node})=>{
              return <View style={{
                marginBottom:5
              }}>
                <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1
            }}>
            <Text style={{color: Color.bluejay, fontSize: 15}}>
              {node.promptName}
              
            </Text>
            </TouchableOpacity>

              </View>
            })
          }

          </>}
          </View>
          <View>
          {isCorrect && targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex].node.reinforce.edges.length>0 && <>
          {
            targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex].node.reinforce.edges.map(({node})=>{
              return <View style={{
                marginBottom:5
              }}>
                <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1
            }}>
            <Text style={{color: Color.bluejay, fontSize: 15}}>
              {node.name}
              
            </Text>
            </TouchableOpacity>

              </View>
            })
          }

          </>}
          </View>
      
      </View>
    );
  };

  renderBehaviourRecordingView = () => {
    const {
      extraShowTimer,
      recordingTypeData,
      selectedRecordingType,
      thirdShowTimer,
      calculatedRate,
      isExtraTimerRunning,
      startThirdTimer,
      startExtraTimer,
      recordingDuration,
      recordingFrequency,
      showThirdTimer,
      behaviours,
      totalBehaviourDuration,
      extraTotalSeconds,
      startBehaviourTime,
      stopBehaviourTime,
      totalBehaviourFrequency,
      Frequency,
      behRec,
      scoreLoading
    } = this.state;
    let tempBehaviours = behaviours;
    let totalDur=0

    return (
      <View style={{padding: 15}}>
        <View
          style={{
            flex: 1,
            borderWidth: 0.7,
            borderColor: Color.grayDarkFill,
            padding: 7,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderRadius: 7,
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18}}>{extraShowTimer}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              flex: 1,
            }}>
            <TouchableOpacity
              style={{
                padding: 5,
                borderRadius: 3,
                borderWidth: 0.7,
                borderColor: Color.gray,
                backgroundColor: startExtraTimer ? Color.gray : Color.white,
              }}
              disabled={startExtraTimer}
              onPress={() => {
                this.setState(
                  {isExtraTimerRunning: true, startExtraTimer: true},
                  () => {
                    this.setState(
                      {startBehaviourTimer: extraTotalSeconds * 1000},
                      () => {
                        this.startExtraTimer(this.state.extraTotalSeconds);
                      },
                    );
                  },
                );
              }}>
              <MaterialCommunityIcons
                name="play-circle-outline"
                color={startExtraTimer ? Color.success : Color.darkGreen}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                borderRadius: 3,
                borderWidth: 0.7,
                borderColor: Color.gray,
                backgroundColor: !startExtraTimer ? Color.gray : Color.white,
              }}
              disabled={!startExtraTimer}
              onPress={() => {
                this.setState(
                  {isExtraTimerRunning: false, startExtraTimer: false,startThirdTimer:false,showThirdTimer:false},
                  () => {
                    clearInterval(extraBackgroundTimer);
                    clearInterval(thirdExtraBackgroundTimer)
                    // this.recordBehaviour();
                  },
                );
              }}>
              <MaterialCommunityIcons
                name="pause-circle-outline"
                color={Color.youtube}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                borderRadius: 3,
                borderWidth: 0.7,
                borderColor: Color.gray,
              }}
              onPress={() => {
                this.setState(
                  {
                    extraTotalSeconds: 0,
                    extraShowTimer: `00 min 00 sec`,
                    isExtraTimerRunning: false,
                    startExtraTimer: false,
                    recordingFrequency: '0',
                    recordingDuration: '0',
                  },
                  () => {
                    clearInterval(extraBackgroundTimer);
                    let tempDuration =
                      extraTotalSeconds * 1000 - startBehaviourTime;
                  },
                );
              }}>
              <MaterialCommunityIcons
                name="reload"
                color={Color.primary}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            padding: 5,
            paddingVertical: 5,
            borderWidth: 0.7,
            borderColor: Color.grayDarkFill,
            marginVertical: 8,
            borderRadius: 7,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View style={{flex: 0.8, marginHorizontal: 5, paddingVertical: 0}}>
              <TextInput
                label="Duration"
                error={''}
                placeholder={'0'}
                defaultValue={recordingDuration.toString()}
                editable={false}
                onChangeText={(recordingDuration) =>
                  this.setState(
                    {
                      recordingDuration: Math.floor(
                        parseInt(recordingDuration) / 1000,
                      ).toFixed(),
                    },
                    () => {},
                  )
                }
                // style={{height: 30}}
                style={{fontSize: 12, paddingVertical: 1, paddingTop: 1}}
              />
            </View>
            <View style={{flex: 0.8}}>
              <TextInput
                label="Frequency"
                error={''}
                placeholder={'0'}
                editable={false}
                defaultValue={Frequency !== undefined ? Frequency.toString():'0'}
                onChangeText={(recordingFrequency) =>
                  this.setState({recordingFrequency}, () => {})
                }
                style={{
                  fontSize: 12,
                  padding: 3,
                  paddingVertical: 1,
                  paddingTop: 1,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                marginHorizontal: 5,
              }}>
              <TextInput
                label="Calculated Rate"
                error={''}
                placeholder={'Calculated Rate'}
                defaultValue={calculatedRate}
                onChangeText={(targetName) => console.log('text')}
                editable={false}
                style={{
                  padding: 1,
                  paddingVertical: 0,
                  marginBottom: 0,
                  paddingTop: 1,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <PickerModal
                label=""
                placeholder=""
                error={''}
                selectedValue={selectedRecordingType}
                data={recordingTypeData}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedRecordingType: itemValue}, () => {
                    this.setRate(itemValue, itemIndex);
                  });
                }}
                style={{
                  fontSize: 12,
                  padding: 3,
                  paddingVertical: 1,
                  marginBottom: 0,
                  paddingTop: 1,
                  height: 30,
                }}
              />
            </View>
          </View>
          {showThirdTimer && (
            <View style={{alignSelf: 'center', marginVertical: 10}}>
              <Text style={{fontSize: 16}}>{thirdShowTimer}</Text>
            </View>
          )}
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <View>
                <Text>Behaviour</Text>
              </View>
              <TouchableOpacity
                style={{
                  padding: 5,
                  borderRadius: 3,
                  borderWidth: 0.7,
                  borderColor: Color.gray,
                  backgroundColor: startThirdTimer ? Color.gray : Color.white,
                }}
                onPress={() => this.startBehaviorTimer()}
                disabled={startThirdTimer}>
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  color={Color.darkGreen}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 5,
                  borderRadius: 3,
                  borderWidth: 0.7,
                  borderColor: Color.gray,
                  backgroundColor: !startThirdTimer ? Color.gray : Color.white,
                }}
                disabled={!startThirdTimer}
                onPress={() => {
                  this.stopBehaviourTimer();
                }}>
                <MaterialCommunityIcons
                  name="pause-circle-outline"
                  color={Color.youtube}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.scoreboardView}>
          <View>
            <Text style={styles.scoreText}>ScoreBoard</Text>
          </View>
                <View style={{marginBottom:10,marginTop:5}}>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '25%', alignItems: 'center',...styles.heading}}><Text>Trial</Text></View>
              <View style={{width: '25%', alignItems: 'center',...styles.heading}}><Text>Frequency</Text></View>
              <View style={{width: '25%', alignItems: 'center',...styles.heading}}><Text>Duration</Text></View>
              <View style={{width: '25%', alignItems: 'center',...styles.heading}}><Text>Rate</Text></View>
            </View>
          </View>
          {this.state.scoreLoading && this.renderLoading()}
          <View>
            {behRec !== undefined  && behRec !== null && !scoreLoading  && behRec.edges?.length !== 0 ? <>
            {
              
              
              behRec.edges.map(({node}) => {
                // console.log("item>>>>",node);
                let rate=0
                totalDur+=(node.end-node.start)
                // console.log("frequency",node.frequency," duration>>>>",totalDur);
                rate=(node.frequency/totalDur).toFixed(3)
                // console.log("rate>>>",rate);
                return (
                  <View style={{marginBottom: 0}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth:1,
                        borderBottomColor:Color.gray
                      }}>
                      <View style={{width: '25%', alignItems: 'center',borderLeftWidth:1,borderColor:Color.gray}}>
                        <Text>Trial {node.frequency}</Text>
                      </View>
                      <View style={{width: '25%', alignItems: 'center'}}>
                        <Text>1</Text>
                      </View>
                      <View style={{width: '25%', alignItems: 'center'}}>
                        <Text>
                          {((node.end - node.start) / 1000).toFixed()}
                        </Text>
                      </View>
                      <View style={{width: '25%', alignItems: 'center',borderRightWidth:1,borderColor:Color.gray}}>
                        <Text>
                          {(node.frequency*1000 / (totalDur)).toFixed(3)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
              }
            
            </>: (
              <NoData>No Trials Found</NoData>
              )}
          </View>
          </View>
          <View style={{marginTop: -25}}></View>
        </View>
      </View>
    );
  };

  render() {
    const {route} = this.props;

    let pageTitle = route.params.pageTitle;
    let {
      correctResponseText,
      student,
      isContentLoaded,
      targetList,
      isEquiRecord,
      currentTargetIndex,
      SBTStepActiveIndex,
      SBTStepActiveId,
      parentSessionInfo
    } = this.state;
    // console.log("parentSessionInfo",parentSessionInfo.id);
    let cText = '';
    if (student && student.firstname) {
      cText = correctResponseText.replace('child', student.firstname);
    }
    if (this.state.showDataRecordingModal) {
      this.modalizeRef?.current?.open();
    } else {
      this.modalizeRef?.current?.close();
    }

    return (
      <SafeAreaView style={styles.container}>
        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
          <NavigationHeader
            backPress={() => this.goBack()}
            title={pageTitle}
            disabledTitle
            materialCommunityIconsName="flash"
            dotsPress={() => {
              this.setState({
                showDataRecordingModal: true,
                isShowBehaviour: true,
              });
            }}
          />
        )}
        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
          <NavigationHeader
            backPress={() => this.goBack()}
            title={pageTitle}
            disabledTitle
            materialCommunityIconsName="flash"
            dotsPress={() => {
              this.setState({
                showDataRecordingModal: true,
                isShowBehaviour: true,
              });
            }}
          />
        )}
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              <ScrollView
              style={{marginBottom:40}}
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}>
                {this.renderHeader()}
                {targetList[currentTargetIndex] != undefined &&
                targetList[currentTargetIndex].node.targetAllcatedDetails
                  .targetType.typeTar === 'Peak' &&
                targetList[currentTargetIndex].node.peakType ==
                  'EQUIVALENCE' ? (
                  !isEquiRecord ? (
                    this.renderPeakEquivalence()
                  ) : (
                    this.renderPeakEquRecord()
                  )
                ) : targetList[currentTargetIndex] != undefined ? (
                  targetList[currentTargetIndex].node.targetAllcatedDetails
                    .targetType.typeTar === 'Peak' ? (
                    this.renderPeak()
                  ) : targetList[currentTargetIndex]?.node
                      ?.targetAllcatedDetails?.targetType?.typeTar ===
                    'Skill Based Treatment' ? (
                    // this.renderBehaviourReductionView()
                    <SBTBlock 
                    targetList={targetList}
                    currentTargetIndex={currentTargetIndex} 
                    SBTStepActiveId={SBTStepActiveId} 
                    SBTStepActiveIndex={SBTStepActiveIndex} 
                    childSessionId={parentSessionInfo}
                    currentSessionTime={this.state.showTimer}
                    getSessionRecordings={()=>this.getTargetSessionRecordings(
                      this.state.parentSessionInfo.id,
                      this.state.targetList[currentTargetIndex]?.node.id,
                      currentTargetIndex,
                    )}
                     />
                  ) : targetList[currentTargetIndex]?.node
                      ?.targetAllcatedDetails?.targetType?.typeTar ===
                    'Behavior Recording' ? (
                    this.renderBehaviourRecordingView()
                  ) : (
                    <>
                      {this.renderTrial()}
                      {this.renderStimulus()}
                      {this.renderSteps()}
                      {isContentLoaded && this.renderResponse(cText)}
                    </>
                  )
                ) : (
                  <View />
                )}

                {/*{this.renderCircular()}*/}
                {this.renderChartModal()}
                {this.renderExitModal()}
                {this.renderTextEditModal()}
                {this.renderVideoPlayer()}
              </ScrollView>
              {
                Platform.OS == 'ios' ? (
                  this.renderDataRecordingModal()
                ) : (
                  <Modalize
                    onClose={() => {
                      if (this.state.showDataRecordingModal) {
                        this.setState({
                          isShowBehaviour: false,
                          showDataRecordingModal: false,
                        });
                      }
                    }}
                    HeaderComponent={this.headerComponent.bind(this)}
                    disableScrollIfPossible={true}
                    ref={this.modalizeRef}
                    handleStyle={{borderRadius: 0, backgroundColor: 'white'}}
                    modalHeight={screenHeight}
                    modalStyle={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}>
                    <SafeAreaView style={{flex: 1, height: '100%'}}>
                      {this.renderBehaviourData()}
                    </SafeAreaView>
                  </Modalize>
                )
                //this.renderDataRecordingModal()
              }

              {this.renderInstructions()}
              {this.renderTargetProgress()}
            </>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <Row style={{flex: 1}}>
                <Column style={{flex: 2}}>
                  <Row style={{flex: 1}}>
                    <Column>
                      {this.renderHeader()}
                      {targetList[currentTargetIndex] != undefined &&
                      targetList[currentTargetIndex].node.targetAllcatedDetails
                        .targetType.typeTar === 'Peak' &&
                      targetList[currentTargetIndex].node.peakType ==
                        'EQUIVALENCE' ? (
                        this.renderPeakEquivalence()
                      ) : targetList[currentTargetIndex] != undefined ? (
                        targetList[currentTargetIndex].node
                          .targetAllcatedDetails.targetType.typeTar ===
                        'Peak' ? (
                          this.renderPeak()
                        ) : (
                          <>
                            {this.renderTrial()}
                            {this.renderStimulus()}
                            {this.renderSteps()}
                          </>
                        )
                      ) : (
                        <View />
                      )}
                      {this.renderTargetProgressInLandscape()}
                    </Column>
                    <Column>
                      <Text
                        style={{
                          width: '100%',
                          fontSize: 24,
                          textAlign: 'center',
                        }}>
                        {this.state.showTimer}
                      </Text>
                      {targetList[currentTargetIndex] != undefined &&
                      targetList[currentTargetIndex].node.targetAllcatedDetails
                        .targetType.typeTar === 'Peak' &&
                      targetList[currentTargetIndex].node.peakType ==
                        'EQUIVALENCE'
                        ? this.renderPeakEquRecord()
                        : targetList[currentTargetIndex] != undefined &&
                          targetList[currentTargetIndex].node
                            .targetAllcatedDetails.targetType.typeTar === 'Peak'
                        ? this.renderPeakscorecard()
                        : isContentLoaded && this.renderResponse(cText)}
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      {/*{this.renderBehaviourData()}*/}
                      {this.renderDataRecordingModal()}
                    </Column>
                  </Row>
                </Column>
                <Column>
                  {this.state.sidebarMode == 'normal' &&
                    this.renderUpcomingTarget()}
                  {this.state.sidebarMode == 'instruction' &&
                    this.renderInstructions()}
                </Column>
              </Row>
              {this.renderChartModal()}
              {this.renderExitModal()}
              {this.renderTextEditModal()}
              {this.renderVideoPlayer()}
            </>
          )}
        </Container>

        {this.renderLoading()}
        {this.renderAttachmentModal()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    color: Color.blackFont,
    borderBottomColor: Color.gray,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  peakView: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  scoreItemVw: {
    height: 24,
    width: 43,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreItemTextVw: {
    height: 20,
    marginLeft: 5,
    width: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  scoreText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 5,
    color: 'black',
  },
  questionText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    marginTop: 10,
    color: '#45494E',
  },
  TrialText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    marginTop: 5,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  containerPeak: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },

  SquareShapeView: {
    width: 40,
    height: 40,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peakNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  totalScore: {
    position: 'absolute',
    right: 20,
    top: 20,
    color: '#3E7BFA',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
  },
  scoreboardView: {
    marginTop: 10,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  carousel: {
    // height: 200,
    // borderColor: 'red',
    // borderWidth: 1
  },
  heading:{
    backgroundColor:Color.gray,
    color:'white',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:Color.gray,
    
  },
  scrollView: {
    // flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 100,
  },
  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingLeft: 15,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
  },
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
  },
  // Target Instruction
  targetInstructionView: {
    paddingTop: 10,
  },
  targetInstructionTitle: {
    color: '#63686E',
    fontSize: 18,
    fontWeight: '500',
  },
  graphTitle: {
    color: '#63686E',
    fontSize: 12,
    fontWeight: '500',
  },
  targetInstructionInformation: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
  },
  videoPlay: {
    position: 'absolute',
    left: 80,
    top: 30,
    fontSize: 30,
    color: '#fff',
    zIndex: 99999,
  },
  instructionImage: {
    width: 180,
    height: 100,
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 5,
  },
  videoImage: {
    width: '100%',
    height: 120,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  instructions: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  instructionsText: {
    color: '#45494E',
    fontSize: 16,
    fontWeight: '500',
  },
  videoTime: {
    paddingTop: 5,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: '500',
  },

  progressBox: {
    height: 15,
    width: '19%',
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: '#4BAEA0',
  },
  correct: {
    borderColor: '#4BAEA0',
    color: '#4BAEA0',
  },
  incorrect: {
    borderColor: '#FF9C52',
    color: '#FF9C52',
  },

  // scorebaord
  // trailProgress
  trailProgressSection: {
    marginTop: 30,
  },
  trailProgressTitle: {
    flexDirection: 'row',
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingBottom: 10,
    // marginRight: 10,
    // borderColor: 'red',
    // borderWidth: 1
  },
  arrowButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    // backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
  arrowButtonText: {
    fontSize: 20,
    fontWeight: 'normal',
    // color: '#fff'
  },
  trailProgressText: {
    paddingTop: 10,
    textAlign: 'left',
    flex: 1,
    color: '#63686E',
    fontSize: 16,
    fontWeight: '500',
  },
  trailProgress: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
  },
  progressBox: {
    height: 15,
    width: 40,
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: '#4BAEA0',
  },
  headingText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#45494E',
  },

  // Popup
  cover: {
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  sheet: {
    position: 'absolute',
    top: Dimensions.get('window').height + 10,
    left: 0,
    right: 0,
    height: '90%',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  popup: {
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    paddingTop: 20,
    // borderTopLeftRadius: 5,
    // borderBottomLeftRadius:
    // borderTopRightRadius: 5,
    borderRadius: 5,
    // alignItems: "center",
    // justifyContent: "center",
    // minHeight: 330,
    height: '100%',
  },

  instructionContent: {
    padding: 10,
    position: 'absolute',
  },

  itemView: {
    borderColor: '#ccc',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },
  itemIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  itemText: {
    marginLeft: 12,
    color: '#63686E',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  incorrectItemSelected: {
    borderColor: '#FF9C52',
    color: '#FF9C52',
  },
  outsideBlock: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    // flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },

  // Exit

  exitViewTouchable: {
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    backgroundColor: '#FF8080',
    borderRadius: 8,
  },
  exitView: {
    width: '100%',
  },
  exitViewText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
  cancelViewTouchable: {
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(95, 95, 95, 0.75)',
  },
  cancelView: {
    width: '100%',
    marginTop: 20,
  },
  cancelViewText: {
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 17,
    textAlign: 'center',
  },

  titleUpcoming: {
    marginTop: 16,
    color: '#45494E',
    fontSize: 16,
    marginBottom: 10,
  },
  cardTarget: {
    borderRadius: 5,
    padding: 16,
    margin: 3,
    marginBottom: 8,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderWidth: 1,
    borderColor: Color.white,
  },
  cardTargetSelected: {
    borderRadius: 5,
    padding: 16,
    margin: 3,
    marginBottom: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderWidth: 1,
    borderColor: Color.primary,
  },

  // Overlay Bottom
  overlayWrapper: {
    borderRadius: 5,
    padding: 16,
    margin: 3,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    backgroundColor: Color.white,
  },
  overlayCard: {
    borderRadius: 5,
    padding: 16,
    margin: 3,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    flexDirection: 'row',
  },
  overlayTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#45494E',
    marginLeft: 16,
  },
  overlayTitleActive: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: Color.primary,
    marginLeft: 16,
  },
  overlayItemTitle: {
    fontSize: 17,
    color: '#45494E',
  },
  overlayItemDescription: {
    fontSize: 15,
    color: '#808080',
  },
  video: {
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: 'black',
  },
  stimulusVw: {
    paddingVertical: 7,
    marginTop: 25,
    marginBottom: 10,
    marginLeft: -70,
    shadowColor: 'rgba(62,123,250,0.6)',
    shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(62,123,250,0.9)',
  },
  classText: {
    fontSize: 18,
    width: '100%',
    marginBottom: 5,
    elevation: 5,
    color: 'grey',
    fontFamily: 'SF Pro Text',
  },
  bottomLineVw: {
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: '6%',
    alignSelf: 'center',
    backgroundColor: '#007ff6',
  },
  TrainingTab: {
    position: 'absolute',
    marginTop: 15,
    bottom: 0,
    width: 50,
    height: '8%',
    alignSelf: 'center',
    backgroundColor: '#007ff6',
  },
  SquareShapStimView: {
    backgroundColor: Color.white,
    margin: 10,
    marginBottom: 10,
    padding: 10,
    paddingLeft: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: Color.gray,
  },
  tabView: {
    padding: 5,
    marginLeft: 15,
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  selectedTabView: {
    color: '#3E7BFA',
    borderBottomWidth: 2,
    borderBottomColor: '#3E7BFA',
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionTargetScreen);
