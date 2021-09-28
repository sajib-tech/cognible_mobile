import React, {Component} from 'react';

import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TherapySessionLink from '../../components/TherapySessionLink';
import ProgressCircle from 'react-native-progress-circle';
import {connect} from 'react-redux';
import {
  client,
  getStudentSessions,
  getTherapyLongTermGoals,
  GetVimeoProjects,
  GetVimeoProjectVideos,
  getTherapyProgramDetails,
} from '../../constants/index';
import store from '../../redux/store';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';

import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import AbcDataScreen from './AbcDataScreen';
import PreferredItemsScreen from './PreferredItemsScreen';
import ShortTermGoalsScreen from './ShortTermGoalsScreen';
import LongTermGoalsScreen from './LongTermGoalsScreen';
import TherapistRequest from '../../constants/TherapistRequest';
import axios from 'axios';
import {Thumbnail} from 'react-native-thumbnail-video';
import Svg, {Defs, LinearGradient, Stop, Rect, Circle} from 'react-native-svg';
import ParentRequest from '../../constants/ParentRequest';
import NoData from '../../components/NoData';
import LoadingIndicator from '../../components/LoadingIndicator';
import VideoThumbnail from '../../components/VideoThumbnail';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class TherapyRoadMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      sessions: [],
      tasks: [],
      clinicID: '',
      vimeoProjects: [],
      vimeoProjectDescriptions: [
        {
          description:
            'Components of behavior, environment and the ABC of the behavior.',
        },
        {description: 'Functions of behavior'},
        {description: 'Generalization, Incidental teaching, Token economy'},
        {description: 'Ethics, documentation and reporting'},
        {
          description:
            'Ethical Responsibility to the Field od behavior Analysis, society and client',
        },
        {description: '(No videos present)'},
        {
          description:
            'General description of verbal operants available in 3 languages(English, Hindi and Marathi)',
        },
        {
          description:
            'Guide to the different functionality offered in the tool',
        },
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
      ],
      vimeoVideos: [],
      programDetails: {},
      therapyGoals: {},
      therapyLongTermGoalsCount: 0,
      therapyShortTermGoalsCount: 0,
      longTermMastered: 0,
      shortTermMastered: 0,

      showSideModal: false,
      modalContent: null,
      modalContentParams: {},

      longTermGoals: [],
      shortTermGoals: [],
      clinicVideo: [],

      isLoadingTask: false,

      isLoadingVideo: true,
      tutorialVideos: [],
    };
    this.navigateToAbcDataScreen = this.navigateToAbcDataScreen.bind(this);
    this.goBack = this.goBack.bind(this);
    this.navigateToAssessmentInstructions = this.navigateToAssessmentInstructions.bind(
      this,
    );
    this.navigateToPrefferedItems = this.navigateToPrefferedItems.bind(this);
    this.navigateToLongTermGoals = this.navigateToLongTermGoals.bind(this);
    this.navigateToShortTermGoals = this.navigateToShortTermGoals.bind(this);
    this.navigateToTutorialVideoList = this.navigateToTutorialVideoList.bind(
      this,
    );
    this.sessionItemCallback = this.sessionItemCallback.bind(this);
    this.getTherapySessions = this.getTherapySessions.bind(this);
    this.renderVideoItem = this.renderVideoItem.bind(this);
  }

  componentDidMount() {
    console.log('props therapy road map 130', this.props);
    let student = store.getState().user.student;
    this.setState({student: student}, () => {});

    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

    this.getTherapyProgramDetails();
    this.getTherapySessions();
    this.fetchVimeoProjects();
    this.fetchLongTermGoals();
    this.fetchClinicID();
    this.getTask();
  }

  componentDidUpdate(prevProps) {
    let prevId = prevProps.route.params.therapyId;
    let currId = this.props.route.params.therapyId;
    if (prevId != currId) {
      this.componentDidMount();
    }
  }

  getTask() {
    this.setState({isLoadingTask: true});
    ParentRequest.getTask()
      .then((result) => {
        console.log('GetTask', result);
        let studentID = store.getState().user.student.id;
        let tasks = [];
        result.data.tasks.edges.map((task, key) => {
          let exist = false;
          task.node.students.edges.map((student) => {
            // console.log("Comparing", student.node.id, studentID, student.node.id == studentID)
            if (student.node.id == studentID) {
              exist = true;
            }
          });

          if (exist) {
            tasks.push(task);
          }
        });
        // console.log("Tasks", tasks);
        this.setState({tasks, isLoadingTask: false});
      })
      .catch((error) => {
        console.log(error, error.response);
        Alert.alert('Error', 'Cannot Load Task');
        this.setState({isLoadingTask: false});
      });
  }

  fetchClinicID() {
    let variables = {
      studentId: this.state.student.id,
    };
    TherapistRequest.GetStudent()
      .then((dataResult) => {
        this.setState({clinicID: dataResult.data.schoolDetail.id}, () => {
          this.fetchClinicVideo();
        });
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isSaving: false});

        Alert.alert('Information', error.toString());
      });
  }

  fetchClinicVideo() {
    let variables = {
      clinic: this.state.clinicID,
    };

    TherapistRequest.GetClinicVideo(variables)
      .then((dataResult) => {
        let allData = dataResult.data.getClinicLibrary.edges;
        console.log('GetClinicVideo', allData);

        let tutorialVideos = [];

        allData.forEach((video) => {
          let array = video.node.videos.edges;
          array.forEach((item) => {
            tutorialVideos.push({
              videoUrl: item.node.url,
              thumbnailUrl: null,
              description: item.node.description,
              name: item.node.name,
            });
          });
        });

        this.setState({tutorialVideos}, () => {
          this.fetchVimeoProjects();
        });
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isSaving: false});

        Alert.alert('Information', error.toString());
      });
  }

  fetchVimeoProjects() {
    TherapistRequest.getVimeoProjectVideo()
      .then((res) => {
        let data = res.data;
        console.log('getVimeoProjectVideo', data);

        let vimeoProjects = data.VimeoProject?.edges;
        if (vimeoProjects) {
          let vimeoProject = vimeoProjects[0]?.node;
          if (vimeoProject) {
            this.fetchVimeoProjectVideos(vimeoProject.projectId);
          }
        }
      })
      .catch((err) => {});
  }

  fetchVimeoProjectVideos(id) {
    fetch(
      `https://api.vimeo.com/users/100800066/projects/${id}/videos?sort=last_user_action_event_date&page=1`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/vnd.vimeo.*+json',
          Authorization: 'Bearer 57fe5b03eac21264d45df680fb335a42',
        }),
      },
    )
      .then((res) => res.json())
      .then((res) => {
        let projectVideos = res.data;
        console.log('projectVideos', projectVideos);

        let tutorialVideos = this.state.tutorialVideos;

        projectVideos.forEach((vid) => {
          if (vid.pictures?.sizes?.length != 0) {
            let picsArr = vid.pictures.sizes;
            let maxIndex = picsArr.length >= 4 ? 3 : picsArr.length - 1;
            let image = picsArr[maxIndex].link;

            tutorialVideos.push({
              videoUrl: null,
              thumbnailUrl: image,
              name: vid.name,
              description: vid.description,
            });
          }
        });

        console.log('tutorialVideos', tutorialVideos);

        this.setState({
          isLoading: false,
          tutorialVideos,
          isLoadingVideo: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  navigate(screenName, params) {
    if (OrientationHelper.getDeviceOrientation() == 'portrait') {
      this.props.navigation.navigate(screenName, params);
    } else {
      this.setState({
        showSideModal: true,
        modalContent: screenName,
        modalContentParams: params,
      });
    }
  }

  navigateToAbcDataScreen() {
    //this.navigate("AbcDataScreen", {});

    let student = store.getState().user.student;
    this.props.navigation.navigate('AbcList', {
      studentId: student.id,
      student: student,
    });
  }

  navigateToAssessmentInstructions() {
    const {program} = this.props.route.params;
    let {navigation, route} = this.props;

    this.props.navigation.navigate('CogniableAssessmentsList', {
      student: {
        node: {
          id: store.getState().studentId,
        },
      },
      program: {
        id: route.params.therapyId,
      },
    });
  }

  navigateToPrefferedItems() {
    let {navigation, route} = this.props;
    let id = route.params.therapyId;

    this.navigate('PreferredItemsScreen', {therapyId: id});
  }

  navigateToShortTermGoals() {
    if (this.state.therapyShortTermGoalsCount > 0) {
      let {navigation, route} = this.props;
      let id = route.params.therapyId;
      this.navigate('ShortTermGoalsScreen', {
        shortTermGoals: this.state.shortTermGoals,
        student: store.getState().studentId,
        program: route.params.therapyId,
        studentNew: this.state.student,
        domain: this.state.programDetails.domain,
      });
    } else {
      Alert.alert(
        'Short Term Goals',
        'No short term goals found',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }

  navigateToLongTermGoals() {
    if (this.state.therapyLongTermGoalsCount > 0) {
      let {navigation, route} = this.props;
      let id = route.params.therapyId;
      this.navigate('LongTermGoalsScreen', {
        studentNew: this.state.student,
        longTermGoals: this.state.longTermGoals,
      });
    } else {
      Alert.alert(
        'Long Term Goals',
        'No long term goals found',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }
  navigateToTutorialVideoList() {
    let {navigation} = this.props;
    navigation.navigate('VimeoProjectsList', {
      clinicVideo: this.state.clinicVideo,
    });
  }

  sessionItemCallback(type, index) {
    let {navigation} = this.props;
    let targetsLength = this.state.sessions[index].node.targets.edges.length;
    let sessionInfo = this.state.sessions[index];
    let student = store.getState().user.student;

    if (targetsLength > 0) {
      navigation.navigate('SessionPreview', {
        pageTitle: type + ' Session',
        sessionData: sessionInfo,
        studentId: store.getState().studentId,
        student: student,
        fromPage: 'TherapyProgramScreen',
      });
    } else {
      Alert.alert(
        'Start Session',
        'This session is not having any targets',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }

  getTherapySessions = () => {
    client
      .query({
        query: getStudentSessions,
        variables: {
          studentId: store.getState().studentId,
        },
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        if (data.GetStudentSession.edges.length > 0) {
          let sessionsPromiseArray = [];
          for (let i = 0; i < data.GetStudentSession.edges.length; i++) {
            const element = data.GetStudentSession.edges[i];
            sessionsPromiseArray.push(this.getStudentSessionStatus(element));
          }
          Promise.all(sessionsPromiseArray)
            .then((sessions) => {
              console.log('final sessions => ', sessions);

              this.setState({
                sessions: sessions,
                isLoadingSession: false,
              });
            })
            .catch((e) =>
              console.log('error of fetching session Status => ', e),
            );
        }
      });
  };

  getStudentSessionStatus = (session) => {
    let variables = {
      sessionId: session.node.id,
    };
    return new Promise((resolve, reject) => {
      TherapistRequest.getStudentSessionStatus(variables)
        .then((sessionStatusData) => {
          session.sessionStatus = 'PENDING';
          if (sessionStatusData.data.getChildSession.edges.length > 0) {
            session.sessionStatus =
              sessionStatusData.data.getChildSession.edges[0].node.status;
            console.log(
              '123456',
              sessionStatusData.data.getChildSession.edges[0].node,
            );
            resolve(session);
          } else {
            console.log('789');

            resolve(session);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  goBack() {
    this.props.navigation.goBack();
  }

  fetchLongTermGoals() {
    let {route} = this.props;
    if (route.params && route.params.therapyId) {
      let id = route.params.therapyId;
      let queryParams = {
        student: store.getState().studentId,
        program: id,
      };
      console.log('Query params', queryParams);
      client
        .query({
          query: getTherapyLongTermGoals,
          variables: queryParams,
        })
        .then((result) => {
          return result.data;
        })
        .then((data) => {
          if (data.programDetails) {
            this.setState({therapyGoals: data.programDetails});
            this.processGoals(data.programDetails.longtermgoalSet);
          }
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
    }
  }

  processGoals(goalSet) {
    if (goalSet && goalSet.edges && goalSet.edges.length > 0) {
      this.setState({therapyLongTermGoalsCount: goalSet.edges.length});
      let shortTermGoalsCount = 0;
      let longTermMasterdCount = 0;
      let longTermGoals = goalSet.edges;
      let longTermGoalsLength = longTermGoals.length;
      let longTermGoalsArray = [];
      for (let i = 0; i < longTermGoalsLength; i++) {
        let goal = longTermGoals[i].node;
        if (this.isGoalMastered(goal)) {
          longTermMasterdCount = longTermMasterdCount + 1;
        }
        if (
          goal.shorttermgoalSet &&
          goal.shorttermgoalSet.edges &&
          goal.shorttermgoalSet.edges.length > 0
        ) {
          shortTermGoalsCount =
            shortTermGoalsCount + goal.shorttermgoalSet.edges.length;
        }

        longTermGoalsArray.push(this.saveLongTermGoal(goal));
      }
      this.setState({
        longTermGoals: longTermGoalsArray,
        therapyShortTermGoalsCount: shortTermGoalsCount,
        longTermMastered: longTermMasterdCount,
      });
    }
  }

  saveLongTermGoal(goal) {
    let newObject = {
      id: goal.id,
      goalName: goal.goalName,
      description: goal.description,
      targetCount: 0,
    };
    let targetEdges = goal.shorttermgoalSet.edges;
    let count = 0;
    for (let j = 0; j < targetEdges.length; j++) {
      count = count + targetEdges[j].node.targetAllocateSet.edges.length;
      this.saveShortTermGoal(targetEdges[j].node);
    }
    newObject.targetCount = count;
    return newObject;
  }

  saveShortTermGoal(shortTermGoal) {
    let shortTermGoalsArray = this.state.shortTermGoals;
    let newObject = {
      id: shortTermGoal.id,
      goalName: shortTermGoal.goalName,
      description: shortTermGoal.description,
      targetCount: shortTermGoal.targetAllocateSet.edges.length,
    };
    shortTermGoalsArray.push(newObject);

    let shortTermMasteredCount = this.state.shortTermMastered;
    if (this.isGoalMastered(shortTermGoal)) {
      shortTermMasteredCount = shortTermMasteredCount + 1;
    }
    this.setState({
      shortTermGoals: shortTermGoalsArray,
      shortTermMastered: shortTermMasteredCount,
    });
  }

  isGoalMastered(goal) {
    let isMastered = false;
    if (
      goal.goalStatus &&
      goal.goalStatus.status &&
      goal.goalStatus.status === 'Met'
    ) {
      isMastered = true;
    }
    return isMastered;
  }

  getTherapyProgramDetails() {
    let {route} = this.props;
    if (route.params && route.params.therapyId) {
      let id = route.params.therapyId;
      client
        .query({
          query: getTherapyProgramDetails,
          variables: {
            therapyId: id,
          },
        })
        .then((result) => {
          return result.data;
        })
        .then((data) => {
          if (data.programDetails) {
            console.log(
              'program details therapyroadmap 626',
              data.programDetails,
            );
            this.setState({programDetails: data.programDetails});
          }
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
    }
  }

  renderThumbNail(item) {
    let video = item?.node.videos.edges[0]?.node.url;
    if (video) {
      return !video.split('/')[2].includes('youtu') ? (
        <View style={{width: 250, height: 150, borderRadius: 8}}>
          <Image
            style={{
              flex: 1,
              borderRadius: 8,
              width: undefined,
              height: undefined,
            }}
            source={{uri: item.thumbnail}}
          />
          <Text
            style={{
              color: '#FF8080',
              fontSize: 12,
              width: '50%',
              textAlign: 'left',
              marginLeft: 10,
              marginTop: 10,
            }}>
            Receptive Language
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: 250,
            height: 150,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: 'lightgray',
          }}>
          <Thumbnail
            url={video}
            imageHeight={150}
            imageWidth={230}
            showPlayIcon={false}
            onPress={() => {}}
            containerStyle={{borderRadius: 30}}
          />
        </View>
      );
    }
    return null;
  }

  renderVideoItem() {
    if (this.state.isLoadingVideo) {
      return (
        <View style={{height: 200}}>
          <LoadingIndicator />
        </View>
      );
    }
    let tutorialVideos = this.state.tutorialVideos;

    return tutorialVideos.map((video, index) => {
      return (
        <VideoThumbnail
          key={index}
          videoUrl={video.videoUrl}
          imageUrl={video.thumbnailUrl}
          title={video.name}
          description={video.description}
        />
      );
    });
  }

  getProgramAssessments() {
    return (
      <TouchableOpacity onPress={this.navigateToAssessmentInstructions}>
        <View style={{flexDirection: 'row'}}>
    <Text style={styles.arrowButton}>{getStr("TargetAllocate.CogniableAssesment")}</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={Color.blackFont}
          />
        </View>
      </TouchableOpacity>
    );
    // let { programDetails } = this.state;
    // return (
    //     <>
    //         {
    //             programDetails.assessments && programDetails.assessments.edges.map((element, index) => {
    //                 if (element.node.name === "Cogniable Assessment") {
    //                     return (
    //                         <TouchableOpacity key={index} onPress={this.navigateToAssessmentInstructions}>
    //                             <View style={{ flexDirection: 'row' }}>
    //                                 <Text style={{ color: 'rgba(95, 95, 95, 0.75)', fontSize: 18, paddingRight: 10 }}>{element.node.name}</Text>
    //                                 <FontAwesome5 name={'arrow-right'} style={styles.backIconText} />
    //                             </View>
    //                         </TouchableOpacity>
    //                     )
    //                 }
    //             })
    //         }
    //     </>
    // )
  }

  getAbcDataView() {
    return (
      <TouchableOpacity onPress={this.navigateToAbcDataScreen}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.arrowButton}>
            {getStr('Therapy.ABCAssessment')}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={Color.blackFont}
          />
        </View>
      </TouchableOpacity>
    );
  }

  getPreferredItemsView() {
    return (
      <TouchableOpacity onPress={this.navigateToPrefferedItems}>
        <View style={{flexDirection: 'row', paddingBottom: 10}}>
          <Text style={styles.arrowButton}>
            {getStr('Therapy.PreferredItems')}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={Color.blackFont}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderAssessment() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {getStr('Therapy.BehaviorAssessments')}
        </Text>
        <Text style={styles.cardDescription}>
          {getStr('Therapy.BehaviorDes')}
        </Text>

        <View style={{height: 10}} />

        {this.getProgramAssessments()}

        <View style={styles.therapySessionDivider} />

        {this.getAbcDataView()}

        <View style={styles.therapySessionDivider} />

        {this.getPreferredItemsView()}
      </View>
    );
  }

  renderGoals() {
    let {
      student,
      programDetails,
      longTermMastered,
      therapyLongTermGoalsCount,
      shortTermMastered,
      therapyShortTermGoalsCount,
    } = this.state;

    let longPercentage = 0;
    if (therapyLongTermGoalsCount > 0) {
      longPercentage = Math.floor(
        (longTermMastered / therapyLongTermGoalsCount) * 100,
      );
    }
    let shortPercentage = 0;
    if (therapyShortTermGoalsCount > 0) {
      shortPercentage = Math.floor(
        (shortTermMastered / therapyShortTermGoalsCount) * 100,
      );
    }
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{getStr('Therapy.TherapyGoals')}</Text>
        <Text style={styles.cardDescription}>
          {getStr('Therapy.TherapyDes')} {student.firstname}{' '}
          {getStr('Therapy.TherapyDess')}
        </Text>

        <View style={{height: 20}} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Text style={styles.progressCheckMark}>
            <FontAwesome5 name={'check'} style={{color: '#FFFFFF'}} />
          </Text>
          <ProgressCircle
            percent={shortPercentage}
            radius={40}
            borderWidth={8}
            color="#4BAEA0"
            shadowColor="#D4DCE7"
            bgColor="#fff">
            <Text style={{fontSize: 22, color: '#344356'}}>
              {shortPercentage + '%'}
            </Text>
          </ProgressCircle>
          <TouchableOpacity
            onPress={this.navigateToShortTermGoals}
            style={{flex: 1}}>
            <View style={{padding: 10}}>
              <Text style={{color: '#63686E', fontSize: 19}}>
                {getStr('Therapy.ShortTerm')}
              </Text>
              <Text style={{color: 'rgba(95, 95, 95, 0.75)', fontSize: 13}}>
                0/{this.state.therapyShortTermGoalsCount}{' '}
                {getStr('Therapy.TargetsMastered')}
              </Text>
            </View>
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="arrow-right"
            size={25}
            color={Color.blackFont}
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.progressCheckMark}>
            <FontAwesome5 name={'check'} style={{color: '#FFFFFF'}} />
          </Text>
          <ProgressCircle
            percent={longPercentage}
            radius={40}
            borderWidth={8}
            color="#4BAEA0"
            shadowColor="#D4DCE7"
            bgColor="#fff">
            <Text style={{fontSize: 22, color: '#344356'}}>
              {longPercentage + '%'}
            </Text>
          </ProgressCircle>
          <TouchableOpacity
            onPress={this.navigateToLongTermGoals}
            style={{flex: 1}}>
            <View style={{padding: 10}}>
              <Text style={{color: '#63686E', fontSize: 19}}>
                {getStr('Therapy.LongTerm')}
              </Text>
              <Text style={{color: 'rgba(95, 95, 95, 0.75)', fontSize: 13}}>
                {this.state.longTermMastered}/
                {this.state.therapyLongTermGoalsCount}
                {getStr('Therapy.TargetsMastered')}{' '}
              </Text>
            </View>
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="arrow-right"
            size={25}
            color={Color.blackFont}
          />
        </View>
      </View>
    );
  }

  /*
  .########..####.########..########..######..########
  .##.....##..##..##.....##.##.......##....##....##...
  .##.....##..##..##.....##.##.......##..........##...
  .##.....##..##..########..######...##..........##...
  .##.....##..##..##...##...##.......##..........##...
  .##.....##..##..##....##..##.......##....##....##...
  .########..####.##.....##.########..######.....##...
  */

  renderTargeAllocation = () => {
    return (
      <View style={{marginVertical: 10}}>
        <Text style={{marginVertical: 10}}>{getStr("Therapy.DirecttargetAllocation")}</Text>
        <ScrollView horizontal>
          <TouchableOpacity
            style={[
              styles.targetVw,
              {width: width * 0.68, marginRight: 5, backgroundColor: '#275BFE'},
            ]}
            onPress={() => {
              this.setState({isChart: false});
              this.props.navigation.navigate('TargetAllocate', {
                program: this.props.route.params.therapyId,
                student: this.state.student,
                shortTermGoalId: "",
                defaults: false,
                fromParent: true,
                newPrograms: this.state.programDetails.domain,
                studentNew: this.state.student,
                
                // shortTermGoals: this.state.shortTermGoals,
                // student: store.getState().studentId,
                // program: route.params.therapyId,
                // studentNew: this.state.student,
                // domain: this.state.programDetails.domain,
              });
              // this.props.navigation.navigate('TargetAllocate', {
              // 	program: this.state.program,
              // 	student: this.state.student,
              // 	shortTermGoalId: shortTermGoals[0]?.id,
              // 	defaults: false,
              // });
            }}>
            <Text style={{width: '90%', textAlign: 'center', color: '#fff'}}>
              {getStr('Therapy.ChoosefromLibrary')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.targetVw,
              {width: width * 0.68, marginRight: 5, backgroundColor: '#FF1A7A'},
            ]}
            onPress={() => {
              this.setState({isChart: false});
              this.props.navigation.navigate('ManualTargetAllocationNew', {
                program: this.props.route.params.therapyId,
                student: this?.state?.student,
                shortTermGoalId: this?.state?.shortTermGoalId,
                studentNew: this.state.student,
                isAllocate: true,
                defaults: false,
                fromParent: true,
                newPrograms: this.state.programDetails.domain,
              });
            }}>
            <Text style={{width: '90%', textAlign: 'center', color: '#fff'}}>
              {getStr('Therapy.AddManually')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  renderVideos() {
    let {student, vimeoVideos} = this.state;
    let watchedVideoCount = 0;
    let percentage = 0;
    let borderWidthNumber = 0;
    if (watchedVideoCount > 0) {
      percentage = Math.floor((vimeoVideos.length / watchedVideoCount) * 100);
      borderWidthNumber = 2;
    }
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={this.navigateToTutorialVideoList}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.cardTitle, {flex: 1}]}>
              {getStr('Therapy.TutorialVideos')}
            </Text>
            <FontAwesome5 name={'arrow-right'} style={styles.backIconText} />
          </View>
        </TouchableOpacity>
        <Text style={styles.cardDescription}>
          {getStr('Therapy.TutorialVideosDes')} {student.firstname}.
        </Text>
        <View style={styles.targetView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.targetText}>
              {watchedVideoCount} of {vimeoVideos.length} Videos watched{' '}
            </Text>
            <Text style={{fontSize: 16, color: '#63686E'}}>{percentage}%</Text>
          </View>
          <Text style={styles.targetProgress}></Text>
          <Text
            style={[
              styles.targetProgressColor,
              {width: percentage + '%', borderWidth: borderWidthNumber},
            ]}></Text>
        </View>
        <ScrollView horizontal={true}>{this.renderVideoItem()}</ScrollView>
      </View>
    );
  }

  renderSessions() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {getStr('Therapy.TherapySessions')}
        </Text>
        <Text style={styles.cardDescription}>
          {store.getState().user.student.firstname}
          {getStr('Therapy.TherapySessionsDes')}
        </Text>
        {this.state.sessions.map((element, index) => {
          return (
            element.node.targets.edges.length > 0 && (
              <TherapySessionLink
                title={element.node.sessionName.name}
                duration={element.node.duration}
                targetCount={element.node.targets.edges.length}
                index={index}
                totalSessions={this.state.sessions.length}
                parentCallback={this.sessionItemCallback}
                sessionStatus={element.sessionStatus}
              />
            )
          );
        })}
      </View>
    );
  }

  renderModal() {
    let data = null;
    let screenName = this.state.modalContent;
    let params = this.state.modalContentParams;

    if (screenName == 'AbcDataScreen') {
      data = (
        <AbcDataScreen
          route={{params: params}}
          disableNavigation
          navigation={this.props.navigation}
        />
      );
    } else if (screenName == 'PreferredItemsScreen') {
      data = (
        <PreferredItemsScreen
          route={{params: params}}
          disableNavigation
          navigation={this.props.navigation}
        />
      );
    } else if (screenName == 'ShortTermGoalsScreen') {
      data = (
        <ShortTermGoalsScreen
          route={{params: params}}
          disableNavigation
          navigation={this.props.navigation}
        />
      );
    } else if (screenName == 'LongTermGoalsScreen') {
      data = (
        <LongTermGoalsScreen
          route={{params: params}}
          disableNavigation
          navigation={this.props.navigation}
        />
      );
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showSideModal}
        onRequestClose={() => {
          this.setState({showSideModal: false});
        }}>
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            style={{flex: 2}}
            activeOpacity={0.9}
            onPress={() => {
              this.setState({showSideModal: false});
            }}
          />
          <View style={styles.modalContent}>{data}</View>
        </View>
      </Modal>
    );
  }

  renderTask() {
    let {tasks} = this.state;

    let content = (
      <View style={{padding: 3}}>
        {tasks.map((task, index) => {
          let assignWork = task?.node.assignWork.edges;
          if (assignWork.length) {
            // console.log(assignWork)
          }
          let priorityColor = Color.success;
          if (task?.node?.priority?.name == 'Super High') {
            priorityColor = Color.danger;
          } else if (task?.node?.priority?.name == 'High') {
            priorityColor = Color.warning;
          } else if (task?.node?.priority?.name == 'Medium') {
            priorityColor = Color.info;
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // this.props.navigation.navigate("ClinicTaskNew", task);
              }}
              activeOpacity={0.9}
              style={styles.taskStyle}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text style={styles.taskStyleTitle}>
                  {task?.node?.taskName}
                </Text>
                <Text
                  style={[styles.taskStylePriority, {color: priorityColor}]}>
                  {task?.node?.priority?.name}
                </Text>
              </View>

              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => {
                  // Alert.alert(
                  //     'Information',
                  //     'Are you sure want to close this task?',
                  //     [
                  //         { text: 'No', onPress: () => { }, style: 'cancel' },
                  //         {
                  //             text: 'Yes', onPress: () => {
                  //                 this.closeTask(task);
                  //             }
                  //         },
                  //     ],
                  //     { cancelable: false }
                  // );
                }}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={30}
                  color={Color.success}
                />
              </TouchableOpacity>

              {/* <View style={{ justifyContent: 'center' }}>
                                {assignWork.map((assign, key) => {
                                    return <Image source={{ uri: ImageHelper.getImage(assign.node.image) }} style={styles.assignThumbnail} key={index + '_' + key} />;
                                })}
                            </View> */}
            </TouchableOpacity>
          );
        })}

        {tasks.length == 0 && <NoData>No Task Available</NoData>}
      </View>
    );

    if (this.state.isLoadingTask) {
      content = (
        <View style={{height: 300}}>
          <LoadingIndicator />
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          onPress={() => {
            this.props.navigation.navigate('TaskList');
          }}>
          <Text style={styles.cardTitle}>{getStr("Therapy.Task")}</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color={Color.blackFont}
          />
        </TouchableOpacity>

        <View style={{height: 5}} />

        {OrientationHelper.getDeviceOrientation() == 'portrait' && content}
        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
          <ScrollView>{content}</ScrollView>
        )}
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => {
            this.props.navigation.goBack();
          }}
          title={getStr('Therapy.BehaviorLanguage')}
          enable={this.props.disableNavigation != true}
          disabledTitle
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              {this.renderAssessment()}

              {this.renderGoals()}

              {this.renderTargeAllocation()}

              {this.renderTask()}

              {this.renderVideos()}

              {this.renderSessions()}
            </ScrollView>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Row>
                  <Column>
                    {this.renderAssessment()}
                    {this.renderTask()}
                    {this.renderVideos()}
                  </Column>
                  <Column>
                    {this.renderGoals()}
                    {this.renderSessions()}
                  </Column>
                </Row>
              </ScrollView>
              {this.renderModal()}
            </>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  card: {
    margin: 3,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: '#45494E',
  },
  cardDescription: {
    fontSize: 13,
    color: '#45494E',
  },

  header: {
    flexDirection: 'row',
    height: 50,
    width: '95%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingLeft: 10,
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
    fontWeight: 'bold',
  },
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingRight: 10,
  },
  scrollView: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  // behaviourAssessments
  behaviourAssessments: {
    borderWidth: 0.5,
    margin: 10,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  behaviourAssessmentTitle: {
    color: '#45494E',
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 5,
  },
  behaviourAssessmentDescription: {
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 16,
    paddingBottom: 10,
  },
  // therapyGoals
  therapyGoals: {
    borderWidth: 0.5,
    margin: 10,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  therapyGoalTitle: {
    color: '#45494E',
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 5,
  },
  therapyGoalDescription: {
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 16,
    paddingBottom: 10,
  },
  progressCheckMark: {
    position: 'absolute',
    zIndex: 999999,
    fontSize: 20,
    backgroundColor: '#4BAEA0',
    padding: 5,
    borderRadius: 50,
    left: 30,
    top: -5,
  },
  // Tutorial videos
  tutorialVideos: {
    borderWidth: 0.5,
    margin: 10,
    padding: 10,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  targetView: {
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 20,
    borderColor: 'rgba(62, 123, 250, 0.05)',
  },
  targetText: {
    width: '90%',
    paddingBottom: 5,
    color: '#3E7BFA',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  targetProgress: {
    height: 2,
    borderWidth: 2,
    borderColor: 'rgba(95, 95, 95, 0.1)',
  },
  targetProgressColor: {
    position: 'absolute',
    top: 32,
    // width: '25%',
    height: 2,
    // borderWidth: 1,
    borderColor: '#3E7BFA',
  },
  scrollViewItem: {
    // borderWidth: 0.1,
    backgroundColor: '#ffffff',
    // height: 210,
    width: 250,
    margin: 3,
    marginRight: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  // TherapySessions
  therapySessions: {
    borderWidth: 0.5,
    margin: 10,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 150,
  },
  therapySessionsTitle: {
    color: '#45494E',
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingBottom: 5,
  },
  therapySessionsDescription: {
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    paddingBottom: 10,
  },
  therapySessionDivider: {
    marginVertical: 10,
    backgroundColor: Color.primary,
    opacity: 0.1,
    height: 1,
  },
  modalWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  modalContent: {
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  arrowButton: {
    fontSize: 16,
    color: Color.blackFont,
    flex: 1,
    //textDecorationLine: 'underline'
  },
  taskStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Color.gray,
    backgroundColor: Color.white,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  taskStyleTitle: {
    color: Color.black,
    fontSize: 14,
  },
  taskStylePriority: {
    color: Color.greenPie,
    fontSize: 12,
  },
  targetVw: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(TherapyRoadMap);
