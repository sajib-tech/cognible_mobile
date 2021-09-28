/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
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
  TextInput,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  BackHandler,
  processColor,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Overlay} from 'react-native-elements';
import Video from 'react-native-video';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart} from 'react-native-charts-wrapper';

import BehaviourDecelTemplateScreen from '../../../pages/therapy/BehaviourDecelTemplateScreen';
import BehaviourNewTemplateScreen from '../../../pages/therapy/BehaviourNewTemplateScreen';
import BehaviourDecelMandScreen from '../../../pages/therapy/BehaviourDecelMandScreen';
import NewToiletDataScreen from '../../../pages/therapy/NewToiletDataScreen';
import TargetResponse from '../../../components/TargetResponse';
import TargetProgress from '../../../components/TargetProgress';
import TrialProgressNew from '../../../components/TrialProgressNew';
import {
  client,
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
} from '../../../constants/parent';

import Carousel from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import DateHelper from '../../../helpers/DateHelper';
import TokenRefresher from '../../../helpers/TokenRefresher';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';
import Color from '../../../utility/Color';
import NoData from '../../../components/NoData';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
class PreviousSessionTarget extends Component {
  constructor(props) {
    super(props);
    // ////console.log("SessionTarget() :"+this.props);

    this.state = {
      student: {},
      studentId: '',
      isExitVisible: false,
      isInstrVisible: false,
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
      incorrectData: [
        {key: 'Child responded to a gesture', isSelected: false},
        {key: 'Child responded to verbal cue', isSelected: false},
        {key: 'Child responded to a visual cue', isSelected: false},
        {key: 'Child responded to a physical cue', isSelected: false},
        {key: 'Child did not respond', isSelected: false},
      ],

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

      currentThumbnail: null,
      currentPeakSkillId: 0,
      peakAllSd: [],
      block: [],
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
  }

  fetchThumbnail() {
    this.setState({
      currentThumbnail: null,
    });
    let currentTarget = this.state.targetList[this.state.currentTargetIndex];
    if (currentTarget && currentTarget.node.videos.edges.length > 0) {
      console.log(currentTarget);
      let videoNode = currentTarget.node.videos.edges[0];
      let videoUrl = videoNode.node.url;
      let videoId = videoUrl.split('/')[3];
      console.log('videoUrl', videoUrl);

      let url = `https://player.vimeo.com/video/${videoId}/config`;
      console.log('URL', url);
      axios
        .get(url)
        .then((result) => {
          console.log('ResultAx', result);
          let res = result.data;
          console.log('VideoThumb', res.video.thumbs.base);
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
      let videoId = videoUrl.split('/')[3];
      //var videoId = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
      console.log('videoUrl', videoUrl);

      let url = `https://player.vimeo.com/video/${videoId}/config`;
      console.log('URL', url);
      axios
        .get(url)
        .then((result) => {
          console.log('ResultAx', result);
          let res = result.data;
          let cdn = res.request.files.hls.default_cdn;
          let videoUrlNew = res.request.files.hls.cdns[cdn].url;
          console.log('videoUrlNew', videoUrlNew);
          this.setState({
            videoTitle: currentTarget.node.targetAllcatedDetails.targetName,
            videoUrl: videoUrlNew,
            isVideoPlayVisible: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            videoTitle: null,
            videoUrl: null,
            isVideoPlayVisible: false,
          });

          Alert.alert('Information', 'Cannot fetch video data');
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
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.isVideoPlayVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
          this.setState({isVideoPlayVisible: false});
        }}>
        <View
          style={{width: '100%', height: '100%', backgroundColor: Color.white}}>
          <NavigationHeader
            backPress={() => this.setState({isVideoPlayVisible: false})}
            title="Video Instruction"
          />
          <Container>
            <Text
              style={{color: Color.black, fontSize: 16, marginVertical: 10}}>
              {this.state.videoTitle}
            </Text>

            {isVideoAvailable && (
              <Video
                source={{uri: videoUrl}}
                controls={true}
                style={styles.video}
                resizeMode="cover"
              />
            )}
            {!isVideoAvailable && <NoData>No Video Available</NoData>}
          </Container>
        </View>
      </Modal>
    );
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    //console.log("handleBackButtonClick is called")
    this.setState({isShowBehaviour: false, showDataRecordingModal: false});
    return true;
    // this.props.navigation.goBack(null);
    // return true;
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
    this.props.navigation.goBack();
  }

  startTimer(seconds) {
    let self = this;
    setInterval(function () {
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
      //console.log(min+":"+sec);
      let totalDuration = min + ' : ' + sec;
      self.setState({showTimer: totalDuration, totalSeconds: seconds});
    }, 1000);
  }

  componentDidMount() {
    // this.startTimer();
    let {route} = this.props;
    console.log('route.params: ' ,this.props);
    let sessionId = route.params.sessionId;
    let fromPage = route.params.fromPage;
    let student = route.params.student;
    let studentId = route.params.studentId; // this.state.studentId;

    // let targetLength = (Object.keys(node.targetAllocateSet.edges)).length;
    // //console.log(route.params.sessionId);
    let correctResponseText = this.state.correctResponseText.replace(
      'child',
      student.firstname,
    );
    console.warn('correctResponseText:' + correctResponseText);
    this.setState({
      pageTitle: route.params.pageTitle,
      fromPage: route.params.fromPage,
      sessionId: sessionId,
      student: student,
      studentId: studentId,
      parentSessionInfo: route.params.parentSessionInfo,
      correctResponseText: correctResponseText,
    });

    // this.setState({targetsCount: targetList.length});
    // this.getRefreshToken(studentId, sessionId);
    // if(this.state.targetList && this.state.targetList)
    // this.getTargetSessionRecordings(this.state.parentSessionInfo.id, this.state.targetList[0].node.id);
    // this.startTimer();
    TokenRefresher.refreshTokenIfNeeded(
      this.props.dispatchSetToken,
      this.props.dispatchSetTokenPayload,
    )
      .then(() => {
        this.getSessionTargets(studentId, sessionId);
      })
      .catch((error) => {
        //console.log(error);
        this.setState({isLoading: false});
      });
  }

  getSessionTargets(studentId, sessionId) {
    console.log('sessionID===', studentId + ',' + sessionId);
    client
      .query({
        query: getSessionTargetsBySessionId,
        fetchPolicy: 'no-cache',
        variables: {
          sessionId: sessionId,
        },
      })
      .then((result) => {
        ////console.log("sessionTargetData-------:"+result)
        return result.data;
      })
      .then((data) => {
        if (data.getsession.targets.edges) {
          // console.log("========" + (Object.keys(data.getsession.targets.edges).length));
          // console.log("========" + JSON.stringify(data.getsession.targets.edges));
          // console.log("getSessionTargetsBySessionId", data.getsession.targets.edges)
          let targetLength = Object.keys(data.getsession.targets.edges).length;
          let allEdges = data.getsession.targets.edges;
          allEdges.map((edge) => {
            edge.node.trialsInfo = [];
          });
          // data.targetAllocates.edges.map(object => {
          this.setState({targetList: allEdges}, () => {
            this.fetchThumbnail();
          });
          // })
          this.setState({targetsCount: targetLength});
          // ////console.log("========"+JSON.stringify(this.state.targetList[2]));

          this.setTrailBoxes(targetLength);
          let durationStartTime = this.state.showTimer;
          this.setState({
            durationStartTime: durationStartTime,
            isContentLoaded: true,
          });
        }
        if (data.getChildSession.edges.length > 0) {
          const milli = data.getChildSession.edges[0].node.duration;
          console.log('miliseconds===', milli);
          var seconds = parseInt(milli / 1000);
          console.log('seconds===', seconds);

          // if(data.getChildSession.edges[0].node.status === 'COMPLETED'){
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
          //console.log(min+":"+sec);
          let totalDuration = min + ' : ' + sec;
          this.setState({
            showTimer: totalDuration,
            totalSeconds: seconds,
            status: 'COMPLETED',
          });
          // } else {
          //     this.startTimer(seconds);
          // }
        } else {
          this.startTimer(0);
        }
      })
      .catch((error) => {
        //console.log(JSON.stringify(error))
        console.log('session error===', error);
        this.setState({loading: false, isContentLoaded: true});
        Alert.alert(
          'Server Error',
          'Please try again after sometime',
          [
            {
              text: 'OK',
              onPress: () => {
                //console.log('OK Pressed');
              },
            },
          ],
          {cancelable: false},
        );
      });
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
    this.getTargetSessionRecordings(
      this.state.parentSessionInfo.id,
      this.state.targetList[0].node.id,
      this.state.currentTargetIndex,
    );
    // ////console.log("========"+JSON.stringify(this.state.targetList[1]));
  }
  getTargetSessionRecordings(childSessionId, targetId, currentTargetIndex) {
    console.log('========' + childSessionId);
    console.log('========' + targetId);
    console.log('========' + currentTargetIndex);

    client
      .query({
        query: getTargetIdSessionRecordings,
        fetchPolicy: 'no-cache',
        variables: {
          childSessionId: childSessionId,
          targetId: targetId,
        },
      })
      .then((result) => {
        ////console.log("sessionTargetData-------:"+result)
        return result.data;
      })
      .then((data) => {
        this.setState({loading: false});
        //console.log("Data: getTargetSessionRecordings-------:" + JSON.stringify(data))
        // //console.log(currentTargetIndex)
        // //console.log("Data: getTargetSessionRecordings-------:"+JSON.stringify(this.state.targetList))

        let targetList = this.state.targetList;
        let trialsInfo = targetList[currentTargetIndex].node.trialsInfo;
        let sdLength = targetList[currentTargetIndex].node.sd.edges.length;
        let stepsLength =
          targetList[currentTargetIndex].node.steps.edges.length;
        let trialsInfoLength = trialsInfo.length;
        console.log('sd===', targetList);
        if (
          data.getSessionRecordings.edges &&
          data.getSessionRecordings.edges.length > 0
        ) {
          let sessRecordings =
            data.getSessionRecordings.edges[0].node.sessionRecord.edges;
          let sessRecordLength = sessRecordings.length;
          if (sdLength > 0) {
            let stimulusId = this.getStimulusId();
            let allStimData =
              data.getSessionRecordings.edges[0].node.sessionRecord.edges;
            let filterData = allStimData.filter(
              (e) => e.node.sd.id === stimulusId,
            );
            console.log('filterData===', filterData);
            sessRecordings = filterData;
            sessRecordLength = filterData.length;
          } else if (stepsLength > 0) {
            let stepId = this.getStepId();
            let allStimData =
              data.getSessionRecordings.edges[0].node.sessionRecord.edges;
            console.log('allStimdata==', allStimData);
            let filterData = allStimData.filter(
              (e) => e.node.step.id === stepId,
            );
            console.log('filterData===', filterData);
            sessRecordings = filterData;
            sessRecordLength = filterData.length;
          }
          //console.log(trialsInfoLength + "=" + sessRecordings.length)
          if (trialsInfoLength >= sessRecordLength) {
            for (let i = 0; i < trialsInfoLength; i++) {
              if (sessRecordLength > i) {
                trialsInfo[i].sessionRecord = sessRecordings[i].node;
                if (sessRecordings[i].node && sessRecordings[i].node.id) {
                  if (sessRecordings[i].node.trial === 'CORRECT') {
                    trialsInfo[i].result = 'positive';
                    trialsInfo[i].isFilled = true;
                  } else if (
                    sessRecordings[i].node.trial === 'ERROR' ||
                    sessRecordings[i].node.trial === 'PROMPT'
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
                } else if (sessRecordings[index].node.trial === 'ERROR') {
                  trialsInfo[j].result = 'nuetral';
                  trialsInfo[j].isFilled = true;
                  trialsInfo[j].inCorrectOptionIndex = 0;
                }
              }
              index--;
            }
          }
          targetList[currentTargetIndex].node.trialsInfo = trialsInfo;

          let peakRecord = data.getSessionRecordings.edges[0].node.peak.edges;
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
                  ? peakRecord[this.state.currentPeakStimIndex].node.trial.edges
                  : []
                : [];
            console.log('marks ==', totalScore);
            this.setState({
              currentPeak: peakRecord,
              totalMarks: totalScore,
              currentPeakTrial: trials.length == 10 ? 10 : trials.length + 1,
            });
          }
          let block = this.state.targetList[this.state.currentTargetIndex].node
            .peakBlocks;
          let arr = [];
          for (let i = 0; i < block; i++) {
            arr.push({
              block: this.createStimulusList(
                targetList[currentTargetIndex].node.sd.edges,
              ),
            });
          }

          this.setState({peakAllSd: arr});
          // console.log("TargetList", targetList);
          // //console.log("--------------------------------------------------"+JSON.stringify(targetList[currentTargetIndex].node.trialsInfo));
          this.setState({
            targetList: targetList,
            currentTrialNo: sessRecordLength,
            currentPeakSkillId: data.getSessionRecordings.edges[0].node.id,
          });

          this.setupBorder(currentTargetIndex);
          this.setResponseCounts(currentTargetIndex);
        } else {
          if (
            targetList[currentTargetIndex] != undefined &&
            targetList[currentTargetIndex].node.targetAllcatedDetails.targetType
              .typeTar === 'Peak'
          ) {
            this.createSessionPeak(
              targetId,
              childSessionId,
              targetList[currentTargetIndex].node.targetStatus.id,
            );
          }
          this.setState({currentTrialNo: 0});
        }
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log('Error: getTargetSessionRecordings-------:', error);
      });
  }
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
        ////console.log("sessionTargetData-------:"+result)
        return result.data;
      })
      .then((data) => {
        console.log('Data===', data);
        this.getTargetSessionRecordings(
          this.state.parentSessionInfo.id,
          this.state.targetList[this.state.currentTargetIndex].node.id,
          this.state.currentTargetIndex,
        );
      })
      .catch((error) => {
        //console.log(JSON.stringify(error))
        console.log('session error===', error);
        this.setState({loading: false, isContentLoaded: true});
        Alert.alert(
          'Server Error',
          'Please try again after sometime',
          [
            {
              text: 'OK',
              onPress: () => {
                //console.log('OK Pressed');
              },
            },
          ],
          {cancelable: false},
        );
      });
  }
  updatePeakSession(pkId, sdId, mark) {
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    client
      .query({
        query: updatePeakRecord,
        fetchPolicy: 'no-cache',
        variables: {
          pkId: pkId,
          sd: sdId,
          start: startTimeInSeconds,
          end: endTimeInSeconds,
          mark: mark,
        },
      })
      .then((result) => {
        ////console.log("sessionTargetData-------:"+result)
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
        //console.log(JSON.stringify(error))
        console.log('session error===', error);
        this.setState({loading: false, isContentLoaded: true});
        Alert.alert(
          'Server Error',
          'Please try again after sometime',
          [
            {
              text: 'OK',
              onPress: () => {
                //console.log('OK Pressed');
              },
            },
          ],
          {cancelable: false},
        );
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
        //console.log(JSON.stringify(error))
        console.log('session error===', JSON.stringyf);
        this.setState({loading: false, isContentLoaded: true});
        Alert.alert(
          'Server Error',
          'Please try again after sometime',
          [
            {
              text: 'OK',
              onPress: () => {
                //console.log('OK Pressed');
              },
            },
          ],
          {cancelable: false},
        );
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
    console.log(queryParams);
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
        this.createBlock(data.sessionRecording.details.id);
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log('saveSessionRecord -> err', JSON.stringify(err));
      });
  };
  getCurrentTargetTrialsInfo() {
    return this.state.targetList[this.state.currentTargetIndex].node.trialsInfo;
    // return (<TrialProgressNew data={this.state.targetList[index].node.trialsInfo} />)
  }
  moveTrailTo(direction) {
    ////console.log("moveTrailTo: "+direction);
    if (direction === 'previous') {
      if (this.state.currentTrialNumber > 1) {
        let activeTrialNumber = this.state.currentTrialNumber - 1;
        let durationStartTime = this.state.showTimer;

        this.setState({
          currentTrialNumber: activeTrialNumber,
          currentTrialNo: activeTrialNumber,
          durationStartTime: durationStartTime,
        });
        this.prePopulateIncorrectData(
          activeTrialNumber,
          this.state.currentTargetIndex,
        );
      }
    } else if (direction === 'next') {
      console.log(
        '123==',
        this.state.currentTargetIndex,
        this.state.targetList,
      );
      const {currentTargetIndex, targetList, currentTrialNumber} = this.state;
      const currentTarget =
        targetList[currentTargetIndex].node.trialsInfo[currentTrialNumber - 1];

      if (
        this.state.currentTrialNumber < this.state.totalTrials &&
        currentTarget.isFilled
      ) {
        let activeTrialNumber = this.state.currentTrialNumber + 1;
        let durationStartTime = this.state.showTimer;
        this.setState({
          currentTrialNumber: activeTrialNumber,
          currentTrialNo: activeTrialNumber,
          showCorrectResponseBorder: false,
          durationStartTime: durationStartTime,
          showCorrectResponse: true,
        });
        this.prePopulateIncorrectData(
          activeTrialNumber,
          this.state.currentTargetIndex,
        );
      }
    }
  }
  setResponseCounts(targetIndex) {
    // let index = this.state.currentTargetIndex;
    ////console.log("setResponseCounts: "+targetIndex);
    let targetList = this.state.targetList;
    let trialsInfo = targetList[targetIndex].node.trialsInfo;
    let correctResponseCount = 0;
    let inCorrectResponseCount = 0;
    for (let i = 0; i < trialsInfo.length; i++) {
      if (trialsInfo[i].result === 'positive') {
        correctResponseCount++;
      } else if (
        trialsInfo[i].result === 'negative' ||
        trialsInfo[i].result === 'nuetral'
      ) {
        inCorrectResponseCount++;
      }
    }
    this.setState({currentTargetCorrectNumer: correctResponseCount});
    ////console.log(correctResponseCount+","+inCorrectResponseCount);
    if (this.correctResponseRef.current != null) {
      ////console.log("Setting correct response count");
      this.correctResponseRef.current.changeCount(correctResponseCount);
    }
    if (this.inCorrectResponseRef.current != null) {
      this.inCorrectResponseRef.current.changeCount(inCorrectResponseCount);
    }
  }
  setupBorder(currentTargetIndex) {
    //console.log("setupBorder is called:" + currentTargetIndex)
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
      //console.log(trialData.inCorrectOptionIndex);
      if (trialData.inCorrectOptionIndex > -1) {
        incorrectList[trialData.inCorrectOptionIndex].isSelected = true;
        ////console.log(JSON.stringify(incorrectList));
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
    //console.log("prePopulateIncorrectData:activeTrialNumber: " + activeTrialNumber)
    //console.log("prePopulateIncorrectData:currentTargetIndex: " + currentTargetIndex)
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
        ////console.log(JSON.stringify(incorrectList));
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
    let index = number - 1;
    let dailyTrails = this.state.targetList[index].node.targetAllcatedDetails
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

    this.getTargetSessionRecordings(
      this.state.parentSessionInfo.id,
      this.state.targetList[index].node.id,
      index,
    );
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
      if (this.state.targetsCount == this.state.currentTargetNumber) {
        this.completeSession();
      } else if (this.state.targetsCount > this.state.currentTargetNumber) {
        this.showTarget(this.state.currentTargetNumber + 1);
        let index = this.state.currentTargetIndex + 1;
        //console.log(this.state.currentTargetIndex);
        //console.log(index);
        let durationStartTime = this.state.showTimer;
        let dailyTrails = this.state.targetList[index].node
          .targetAllcatedDetails.DailyTrials;
        if (dailyTrails === 0) {
          dailyTrails = 1;
        }
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
    ////console.log("completeTrail() is called:");
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
    this.doSessionRecord(targetList[index].node, 'Correct', inCorrectItemIndex);
  }
  doSessionRecord(targetNode, responseType, inCorrectItemIndex) {
    // //console.log(JSON.stringify(targetNode));
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
      this.saveSessionRecord(targetNode, responseType);
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
    };
    console.log(queryParams);
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
        this.setState({loading: false});
        console.log('updateSessionRecord:' + JSON.stringify(data));
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
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log('updateSessionRecord -> err', JSON.stringify(err));
      });
  }
  getStimulusId() {
    let activeId = '';
    let {targetList, currentTargetIndex, stimulusCurrentIndex} = this.state;
    let currentTarget = targetList[currentTargetIndex];
    console.log('currentTarget:' + currentTarget);
    if (
      currentTarget.node.sd &&
      currentTarget.node.sd.edges &&
      currentTarget.node.sd.edges.length > 0
    ) {
      console.log(currentTarget.node.sd.edges);
      let cStimulus = currentTarget.node.sd.edges[stimulusCurrentIndex];
      console.log(cStimulus.node.id + ',' + cStimulus.node.sd);
      activeId = cStimulus.node.id;
    }
    console.log('activeId:' + activeId);
    return activeId;
  }
  getStepId() {
    let activeId = '';
    let {targetList, currentTargetIndex, stepsCurrentIndex} = this.state;
    let currentTarget = targetList[currentTargetIndex];
    console.log('currentTarget:' + currentTarget);
    if (
      currentTarget.node.steps &&
      currentTarget.node.steps.edges &&
      currentTarget.node.steps.edges.length > 0
    ) {
      console.log(currentTarget.node.steps.edges);
      let cStep = currentTarget.node.steps.edges[stepsCurrentIndex];
      console.log(cStep.node.id + ',' + cStep.node.step);
      activeId = cStep.node.id;
    }
    console.log('activeId:' + activeId);
    return activeId;
  }
  saveSessionRecord(targetNode, responseType) {
    this.setState({loading: true});
    let stimulusId = '';
    let stepId = '';
    if (targetNode.sd.edges.length > 0) {
      stimulusId = this.getStimulusId();
    } else {
      stepId = this.getStepId();
    }
    //console.log(targetNode.id);
    //console.log(targetNode.targetStatus.id);
    //console.log(this.state.parentSessionInfo.id);
    //console.log("durationStartTime: "+this.state.durationStartTime)
    let startTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.durationStartTime,
    );
    let endTimeInSeconds = DateHelper.caluculateTimeInSeconds(
      this.state.showTimer,
    );
    let queryParams = {
      targetId: targetNode.id,
      childSessionId: this.state.parentSessionInfo.id,
      targetStatus: targetNode.targetStatus.id,
      trial: responseType,
      sd: stimulusId,
      step: stepId,
      durationStart: startTimeInSeconds,
      durationEnd: endTimeInSeconds,
    };
    console.log(queryParams);
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
        return response.data;
      })
      .then((data) => {
        this.setState({loading: false});
        console.log('saveSessionRecord:' + JSON.stringify(data));
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
          //console.log(1)
          if (edges.length > 0) {
            //console.log(2 + "," + edges.length);
            //console.log(2 + "," + JSON.stringify(edges));
            let sessionObject = edges[edges.length - 1];
            //console.log(3)
            let targetList = this.state.targetList;
            //console.log(4)
            let index = this.state.currentTargetIndex;
            //console.log(5)
            let trialsInfo = targetList[index].node.trialsInfo;
            //console.log(6)
            let trialData = trialsInfo[this.state.currentTrialNumber - 1];
            //console.log(7)
            trialData.isFilled = true;
            //console.log(8)
            trialData.sessionRecord = sessionObject.node;
            //console.log(9 + "," + JSON.stringify(trialData.sessionRecord))
            //console.log(9)
            trialsInfo[this.state.currentTrialNumber - 1] = trialData;
            //console.log(10)
            targetList[
              this.state.currentTargetIndex
            ].node.trialsInfo = trialsInfo;
            //console.log(11)
            this.setState({targetList: targetList});
            //console.log(12)
          }
          //console.log(13)
        }
      })
      .catch((err) => {
        this.setState({loading: false});
        console.log('saveSessionRecord -> err', JSON.stringify(err));
      });
  }
  pauseSession() {
    this.setState({loading: true});
    console.log(
      'this.state.parentSessionInfo.id===',
      this.state.parentSessionInfo.id,
    );
    let queryParams = {
      pk: this.state.parentSessionInfo.id,
      duration: this.state.totalSeconds * 1000,
    };
    console.log(queryParams);
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
        ////console.log("navigate to SessionFeedbackScreen");
        console.log('new data===', data);
      })
      .catch((err) => {
        this.setState({loading: false});
        //console.log('saveSessionRecord -> err', JSON.stringify(err));
        Alert.alert('Information', err.toString());
      });
  }
  completeSession() {
    this.setState({loading: true});
    let queryParams = {
      pk: this.state.parentSessionInfo.id,
      duration: this.state.totalSeconds * 1000,
    };
    console.log(queryParams);
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
        ////console.log("navigate to SessionFeedbackScreen");
        navigation.navigate('SessionFeedbackScreen', {
          pageTitle: this.state.pageTitle,
          fromPage: this.state.fromPage,
          sessionId: this.state.sessionId,
          childSeesionId: this.state.parentSessionInfo.id,
        });
      })
      .catch((err) => {
        this.setState({loading: false});
        //console.log('saveSessionRecord -> err', JSON.stringify(err));
        Alert.alert('Information', err.toString());
      });
  }
  removeSelectionIncorrectData() {
    let incorrectList = this.state.incorrectData;
    incorrectList.map((el, i) => (el.isSelected = false));
  }
  selectIncorrectItem = (inCorrectItemIndex) => {
    let incorrectList = this.state.incorrectData;
    incorrectList.map((el, i) => (el.isSelected = false));
    incorrectList[inCorrectItemIndex].isSelected = true;
    // ////console.log(JSON.stringify(incorrectList));
    this.setState({incorrectData: incorrectList});

    let targetList = this.state.targetList;
    let index = this.state.currentTargetIndex;
    let trialsInfo = targetList[index].node.trialsInfo;
    let trialData = trialsInfo[this.state.currentTrialNumber - 1];
    trialData.isFilled = true;
    trialData.result = inCorrectItemIndex == 4 ? 'negative' : 'nuetral';
    trialData.inCorrectOptionIndex = inCorrectItemIndex;
    trialsInfo[this.state.currentTrialNumber - 1] = trialData;
    targetList[this.state.currentTargetIndex].node.trialsInfo = trialsInfo;
    ////console.log(JSON.stringify(trialsInfo));
    this.setState({
      targetList: targetList,
      showCorrectResponseBorder: false,
      showInCorrectResponseBorder: true,
    });
    this.setResponseCounts(index);
    this.doSessionRecord(targetList[index].node, 'Error', inCorrectItemIndex);
    if (this.inCorrectResponseRef.current != null) {
      this.inCorrectResponseRef.current.changeSelected(true);
    }
  };
  handleOpen = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    console.log(this.state.currentTargetInstructions);

    this.setState({sidebarMode: 'instruction'});
  };
  handleClose = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  renderView(item, index) {
    let rstyle = '',
      iconName = 'circle';
    // ////console.log("=================================");
    // ////console.log("item:"+JSON.stringify(item));
    // ////console.log("=================================");
    if (item.isSelected) {
      rstyle = eval('styles.incorrectItemSelected');
      iconName = 'dot-circle';
    }
    let childName = this.state.student.firstname;
    item.key = item.key.replace('Child', childName);
    return (
      <TouchableOpacity
        onPress={() => this.selectIncorrectItem(index)}
        activeOpacity={0.8}
        style={[styles.itemView, rstyle]}>
        <FontAwesome5 name={iconName} style={[styles.itemIcon, rstyle]} />
        <Text style={[styles.itemText, rstyle]}>{item.key}</Text>
      </TouchableOpacity>
    );
  }
  renderItem = ({item, index}) => {
    const {backgroundColor} = item;
    return (
      <TouchableOpacity
        style={[styles.item, {backgroundColor}]}
        onPress={() => {
          console.log('index:' + index);
          this._carousel.scrollToIndex(index);
        }}>
        <Text>STIMULUS {index + 1}</Text>
        <Text style={{width: '100%', fontSize: 20}}>{item.node.sd}</Text>
      </TouchableOpacity>
    );
  };
  renderHeader() {
    let {targetsCount, targetList, showTimer} = this.state;

    if (targetsCount > 0) {
      if (OrientationHelper.getDeviceOrientation() == 'portrait') {
        return (
          <View style={styles.targetInstructionView}>
            <Text style={{width: '100%', fontSize: 24, textAlign: 'center'}}>
              {this.state.showTimer}
            </Text>
            <Text style={styles.targetInstructionTitle}>
              Target Instruction
            </Text>
            {targetList.map((element, index) => {
              if (this.state.currentTargetNumber - 1 == index) {
                return (
                  <View style={styles.targetInstructionInformation} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        this.getVideoInfo();
                      }}>
                      {this.state.currentThumbnail != null && (
                        <>
                          <Image
                            style={styles.instructionImage}
                            source={
                              this.state.currentThumbnail
                                ? {uri: this.state.currentThumbnail}
                                : require('../../../../android/img/Image.png')
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
                      )}
                      {this.state.currentThumbnail == null && (
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
                      )}
                    </TouchableOpacity>

                    <View style={styles.instructions}>
                      <TouchableOpacity onPress={this.handleOpen}>
                        <Text style={styles.instructionsText}>
                          {element.node.targetAllcatedDetails.targetName}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.videoTime}>6 min</Text>
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
            {targetList.map((element, index) => {
              if (this.state.currentTargetNumber - 1 == index) {
                return (
                  <TouchableOpacity onPress={this.handleOpen}>
                    <Image
                      style={{
                        width: '100%',
                        height: 200,
                        borderWidth: 2,
                        borderColor: '#ccc',
                        borderRadius: 4,
                        marginBottom: 10,
                      }}
                      source={require('../../../../android/img/Image.png')}
                    />

                    <Text style={styles.instructionsText}>
                      {element.node.targetAllcatedDetails.targetName}
                    </Text>
                    <Text style={styles.videoTime}>6 min</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        );
      }
    }
    return null;
  }
  _renderItem = ({item, index}) => {
    let {targetList, currentTargetIndex} = this.state;
    const total = targetList[currentTargetIndex].node.sd.edges.length;
    return (
      <View style={{height: 50, marginTop: 25, marginBottom: 10}}>
        <Text style={{color: '#63686E', fontSize: 12}}>
          STIMULUS {index + 1} - {total}
        </Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          {item.node.sd}
        </Text>
      </View>
    );
  };
  _renderStepItem = ({item, index}) => {
    let {targetList, currentTargetIndex} = this.state;
    const total = targetList[currentTargetIndex].node.steps.edges.length;
    return (
      <View style={{height: 50, marginTop: 25, marginBottom: 10}}>
        <Text style={{color: '#63686E', fontSize: 12}}>STEP {index + 1}</Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          {item.node.step}
        </Text>
      </View>
    );
  };
  renderStimulus() {
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
                    data={element.node.sd.edges}
                    renderItem={this._renderItem}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth}
                    onSnapToItem={(index) => {
                      this.setState(
                        {stimulusCurrentIndex: index, currentTrialNumber: 1},
                        () => {
                          console.log('abc==');
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
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth - 10}
                    onSnapToItem={(index) => {
                      this.setState(
                        {stepsCurrentIndex: index, currentTrialNumber: 1},
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
    let {targetsCount, targetList, status} = this.state;
    return (
      <>
        {/* Trail Progress */}
        <View style={styles.trailProgressTitle}>
          <Text style={styles.trailProgressText}>
            Trial {this.state.currentTrialNo} of {this.state.totalTrials}
          </Text>
          {status !== 'COMPLETED' && (
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
                <TrialProgressNew data={element.node.trialsInfo} />
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

    // let cText = correctResponseText.replace('child', student.firstname);
    // console.log(cText);
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
            r
            responseType="incorrect"
            response="Incorrect"
            message="Describe what verbally fluent means in a line"
            count={0}
            callbackFunction={this.callbackTargetResponse}
          />
          {!this.state.showCorrectResponse && (
            <View style={{paddingTop: 10}}>
              <FlatList
                data={incorrectData}
                renderItem={({item, index}) => this.renderView(item, index)}
              />
            </View>
          )}
        </View>

        <View style={{height: 80}} />
      </>
    );
  }
  renderExitModal() {
    return (
      <Overlay isVisible={this.state.isExitVisible} style={{borderRadius: 25}}>
        <Container>
          <Text
            style={{
              fontFamily: 'SF Pro Text',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: 19,
              color: '#63686E',
            }}>
            Are you sure you want to exit the session early
          </Text>
          <Text
            style={{
              marginTop: 20,
              fontFamily: 'SF Pro Text',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: 16,
              color: '#63686E',
              marginBottom: 10,
            }}>
            Describe your reason
          </Text>
          <View style={{flex: 1}}>
            <TextInput
              style={{
                borderWidth: 0.75,
                borderColor: '#9E9E9E',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                flex: 1,
                textAlignVertical: 'top',
              }}
              underlineColorAndroid="transparent"
              placeholder={'Write Something.....'}
              placeholderTextColor={'#9E9E9E'}
              numberOfLines={10}
              multiline={true}
              value={this.state.exitReason}
              onChangeText={(exitReason) => {
                this.setState({exitReason});
              }}
            />
          </View>
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
        </Container>
      </Overlay>
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
                  style={{width: '100%'}}
                  source={require('../../../../android/img/Image.png')}
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
    return (
      <View style={{flex: 1}}>
        <BehaviourNewTemplateScreen
          disableNavigation={true}
          route={{params: {studentId: this.state.studentId}}}
          navigation={{
            goBack() {
              this.setState({
                isBehaviourNewActive: false,
                isBehaviourActive: true,
              });
            },
          }}
        />
        <Button
          labelButton="Cancel"
          theme="secondary"
          style={{marginBottom: 10}}
          onPress={() => {
            this.setState({
              isBehaviourNewActive: false,
              isBehaviourActive: true,
            });
          }}
        />
      </View>
    );
  }
  displayBehaviourPage() {
    return (
      <View style={{flex: 1}}>
        <BehaviourDecelTemplateScreen
          disableNavigation={true}
          route={{params: {studentId: this.state.studentId}}}
          navigation={{
            goBack() {},
          }}
          isFromSession={true}
        />
        <Button
          labelButton="New Template"
          style={{marginBottom: 10}}
          onPress={() =>
            this.setState({
              isBehaviourNewActive: true,
              isBehaviourActive: false,
            })
          }
        />
      </View>
    );
  }
  displayMandPage() {
    return (
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
        isFromSession={true}
      />
    );
  }
  displayToiletPage() {
    return (
      <NewToiletDataScreen
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
        isFromSession={true}
      />
    );
  }
  renderDataRecordingModal() {
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.showDataRecordingModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
          this.setState({
            isShowBehaviour: false,
            showDataRecordingModal: false,
          });
        }}>
        <View style={{flex: 1, height: screenHeight}}>
          {this.renderBehaviourData()}
        </View>
      </Modal>
    );
  }
  switchDataRecordingTab(type) {
    if (type === 'behaviour') {
      this.setState({
        isBehaviourActive: true,
        isBehaviourNewActive: false,
        isMandActive: false,
        isToiletActive: false,
      });
    } else if (type === 'mand') {
      this.setState({
        isBehaviourActive: false,
        isBehaviourNewActive: false,
        isMandActive: true,
        isToiletActive: false,
      });
    } else if (type === 'toilet') {
      this.setState({
        isBehaviourActive: false,
        isBehaviourNewActive: false,
        isMandActive: false,
        isToiletActive: true,
      });
    }
  }
  renderBehaviourData() {
    let {
      isBehaviourActive,
      isBehaviourNewActive,
      isMandActive,
      isToiletActive,
    } = this.state;
    if (this.state.isShowBehaviour) {
      return (
        <View style={{flex: 1}}>
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
              showsHorizontalScrollIndicator={false}>
              <Text
                style={
                  isBehaviourActive || isBehaviourNewActive
                    ? styles.overlayTitleActive
                    : styles.overlayTitle
                }
                onPress={() => {
                  this.switchDataRecordingTab('behaviour');
                }}>
                Behavior Data
              </Text>
              <Text
                style={
                  isMandActive ? styles.overlayTitleActive : styles.overlayTitle
                }
                onPress={() => {
                  this.switchDataRecordingTab('mand');
                }}>
                Mand Data
              </Text>
              <Text
                style={
                  isToiletActive
                    ? styles.overlayTitleActive
                    : styles.overlayTitle
                }
                onPress={() => {
                  this.switchDataRecordingTab('toilet');
                }}>
                Toilet Data
              </Text>
            </ScrollView>
            <View style={{flex: 1}} />
          </View>
          <Container>
            {this.state.isBehaviourActive && this.displayBehaviourPage()}
            {this.state.isBehaviourNewActive &&
              this.displayBehaviourNewTemplate()}
            {this.state.isMandActive && this.displayMandPage()}
            {this.state.isToiletActive && this.displayToiletPage()}
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
                  source={require('../../../../android/img/Image.png')}
                />

                <Text style={styles.instructionsText}>
                  {element.node.targetAllcatedDetails.targetName}
                </Text>
                <Text style={styles.videoTime}>6 min</Text>
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
                ////console.log("navigate to SessionFeedbackScreen");
                navigation.navigate('SessionFeedbackScreen', {
                  pageTitle: this.state.pageTitle,
                  fromPage: this.state.fromPage,
                  sessionId: this.state.sessionId,
                  childSeesionId: this.state.parentSessionInfo.id,
                });
              }}
            />
          </View>
        )}
      </>
    );
  }
  managePickNextPrevious(text) {
    const {currentPeak, currentPeakStimIndex, currentPeakTrial} = this.state;
    const trials =
      currentPeak[currentPeakStimIndex] != undefined
        ? currentPeak[currentPeakStimIndex].node.trial != undefined
          ? currentPeak[currentPeakStimIndex].node.trial.edges
          : []
        : [];

    if (text == 'Next') {
      if (trials.length > currentPeakTrial - 1 && currentPeakTrial < 10) {
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
      peakAllSd,
    } = this.state;
    let sd = peakAllSd[currentPeakStimIndex].block[currentPeakTrial].sd;
    let block = this.state.currentPeak[this.state.currentPeakStimIndex];

    if (previousMark == -1) {
      this.recordPeakSession(block.node.id, sd.id, currentMak);
    } else {
      const trials =
        currentPeak[currentPeakStimIndex] != undefined
          ? currentPeak[currentPeakStimIndex].node.trial != undefined
            ? currentPeak[currentPeakStimIndex].node.trial.edges
            : []
          : [];
      const currentTrial = trials[currentPeakTrial - 1];
      this.updatePeakSession(currentTrial.node.id, sd.id, currentMak);
    }
  };
  renderScoreItem = (item, index) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const {currentPeak} = this.state;
    const trials =
      currentPeak.length > item.index
        ? currentPeak[item.index].node.trial != undefined
          ? currentPeak[item.index].node.trial.edges
          : []
        : [];
    return (
      <TouchableOpacity
        onPress={() => {
          this._carouselA.snapToItem(item.index, true, () => {});
          if (currentPeak[item.index] == undefined) {
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
            currentPeakTrial: trials.length < 10 ? trials.length + 1 : 10,
          });
        }}
        style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.scoreItemVw}>
          <Text>B-{item.index + 1}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                          : '#FF9C52',
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
      </View>
    );
  };
  renderQuestionItem = ({index, item}) => {
    const {
      currentPeak,
      currentPeakStimIndex,
      currentPeakTrial,
      peakAllSd,
    } = this.state;
    const trials =
      currentPeak[currentPeakStimIndex] != undefined
        ? currentPeak[currentPeakStimIndex].node.trial != undefined
          ? currentPeak[currentPeakStimIndex].node.trial.edges
          : []
        : [];
    const marks =
      trials.length > 0 && trials.length > currentPeakTrial - 1
        ? trials[currentPeakTrial - 1].node.marks
        : -1;
    console.log(
      'astha sd==',
      peakAllSd[currentPeakStimIndex].block[currentPeakTrial - 1],
    );
    const currentSd =
      peakAllSd[currentPeakStimIndex] != undefined
        ? peakAllSd[currentPeakStimIndex].block[currentPeakTrial - 1] !=
          undefined
          ? peakAllSd[currentPeakStimIndex].block[currentPeakTrial - 1].sd.sd
          : ''
        : '';

    return (
      <View style={styles.scoreboardView}>
        <Text style={styles.TrialText}>
          B{index + 1} TRIAL {currentPeakTrial} of {10}
        </Text>
        <View style={{marginTop: 5}}>
          <Text style={styles.questionText}>{currentSd}</Text>
          <Text style={[styles.scoreText, {marginBottom: 10, marginTop: 20}]}>
            Scoring
          </Text>
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
        sliderWidth={screenWidth - 40}
        itemWidth={screenWidth - 40}
        onSnapToItem={(index) => {
          if (currentPeak[index] == undefined) {
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
            currentPeakTrial: trials.length < 10 ? trials.length + 1 : 10,
          });
        }}
      />
    );
  };
  renderPeak = () => {
    return (
      <View style={styles.peakView}>
        {this.renderPeakQuestion()}
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => {
              this.managePickNextPrevious('Previous');
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
              this.managePickNextPrevious('Next');
            }}>
            <Text style={styles.arrowButton}>
              <FontAwesome5
                name={'chevron-right'}
                style={styles.arrowButtonText}
              />
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderPeakscorecard()}
      </View>
    );
  };

  render() {
    const {route} = this.props;
    // ////console.log("render():"+JSON.stringify(route.params));

    console.log(
      'previos session props-*-*-***-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*',
      route.params,
    );

    let pageTitle = route.params.pageTitle;
    let {
      correctResponseText,
      student,
      isContentLoaded,
      targetList,
      currentTargetIndex,
    } = this.state;
    let cText = '';
    if (student && student.firstname) {
      cText = correctResponseText.replace('child', student.firstname);
    }
    console.log('123');

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
          />
        )}

        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}>
                {this.renderHeader()}
                {targetList[currentTargetIndex] != undefined ? (
                  targetList[currentTargetIndex].node.targetAllcatedDetails
                    .targetType.typeTar === 'Peak' ? (
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
                {this.renderExitModal()}
                {this.renderVideoPlayer()}
              </ScrollView>
              {this.renderDataRecordingModal()}

              {this.renderInstructions()}
              {this.renderTargetProgress()}
            </>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>\
              <Row style={{flex: 1}}>
                <Column style={{flex: 2}}>
                  <Row style={{flex: 1}}>
                    <Column>
                      {this.renderHeader()}
                      {targetList[currentTargetIndex] != undefined ? (
                        targetList[currentTargetIndex].node
                          .targetAllcatedDetails.targetType.typeTar ===
                        'Peak' ? (
                          this.renderPeak()
                        ) : (
                          <>
                            {this.renderTrial()}
                            {this.renderStimulus()}
                            {this.renderSteps()}
                            <Column>
                              <Text
                                style={{
                                  width: '100%',
                                  fontSize: 24,
                                  textAlign: 'center',
                                }}>
                                {this.state.showTimer}
                              </Text>
                            </Column>
                          </>
                        )
                      ) : (
                        <View />
                      )}
                      {this.renderTargetProgressInLandscape()}
                    </Column>
                    {/*<Column>*/}
                    {/*	<Text style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>{this.state.showTimer}</Text>*/}
                    {/*	{isContentLoaded && this.renderResponse(cText)}*/}
                    {/*</Column>*/}
                  </Row>
                  <Row>
                    <Column>{this.renderBehaviourData()}</Column>
                  </Row>
                </Column>
                <Column>
                  {this.state.sidebarMode == 'normal' &&
                    this.renderUpcomingTarget()}
                  {this.state.sidebarMode == 'instruction' &&
                    this.renderInstructions()}
                </Column>
              </Row>
              {this.renderExitModal()}
              {this.renderVideoPlayer()}
            </>
          )}
        </Container>

        {this.renderLoading()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  peakView: {
    flex: 1,
    flexDirection: 'column',
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
    paddingTop: 16,
  },
  targetInstructionTitle: {
    color: '#63686E',
    fontSize: 18,
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
    height: 90,
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 5,
  },
  instructions: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
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
)(PreviousSessionTarget);
