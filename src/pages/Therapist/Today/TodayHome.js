import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Alert,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Styles from '../../../utility/Style';
import {
  client,
  getStudentSessions,
  getTherapyLongTermGoals,
  GetVimeoProjects,
  GetVimeoProjectVideos,
  getTherapyProgramDetails,
} from '../../../constants/index';
import store from '../../../redux/store';

import Color from '../../../utility/Color';
import {Button} from 'react-native-elements';
import TimelineView from '../../../components/TimelineView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import DateHelper from '../../../helpers/DateHelper';
import HomeCard from '../../../components/HomeCard';
const width = Dimensions.get('window').width;

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import WS from 'react-native-websocket';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getStr} from '../../../../locales/Locale';
import axios from 'axios';
import {Thumbnail} from 'react-native-thumbnail-video';

import _ from 'lodash';
import FeedbackButton from '../../../components/FeedbackButton';
import AppointmentCard from '../../../components/AppointmentCard';
import VideoThumbnail from '../../../components/VideoThumbnail';
import LoadingIndicator from '../../../components/LoadingIndicator';

class TodayHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAttendanceLoading: true,
      startWork: false,

      attendance: null,
      appointments: [],
      timeSheets: [],
      tasks: [],
      vimeoVideos: [],
      vimeoProjects: [],
      clinicVideo: [],
      studentId: '',
      student: '',

      isLoadingVideo: true,
      tutorialVideos: [],
    };
    this.showCommunity = this.showCommunity.bind(this);
    this.navigateToTutorialVideoList = this.navigateToTutorialVideoList.bind(
      this,
    );

    if (DeviceInfo.isTablet()) {
      Orientation.lockToLandscape();
    }
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    let student = store.getState().user.student;
    this.setState({student: student});

    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);

    //Call this on every page
    this.props.navigation.addListener('focus', () => {
      this.getData();
    });

    this.getStudentData();
  }

  getStudentData() {
    TherapistRequest.GetStudent()
      .then((RResult) => {
        this.setState({studentId: RResult.data.schoolDetail.id}, () => {
          this.fetchClinicVideo();
        });
      })
      .catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        this.setState({isLoading: false, isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  fetchClinicVideo() {
    let variables = {
      clinic: this.state.studentId,
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

  navigateToTutorialVideoList() {
    let {navigation} = this.props;
    console.log('gdgdggd', this.state.studentId);
    navigation.navigate('VimeoProjectsList', {
      clinicVideo: this.state.clinicVideo,
    });
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

  showCommunity() {
    let {navigation} = this.props;
    navigation.navigate('ParentCommunity');
  }

  renderCommunity() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showCommunity();
        }}
        activeOpacity={0.8}
        style={styles.cardhome}>
        <HomeCard
          title={getStr('homeScreenAutism.ParentCommunity')}
          descr={getStr('homeScreenAutism.parentDesription')}
          newFlag={true}
          bgcolor="#0095B6"
          bgimage={'community'}
        />
      </TouchableOpacity>
    );
  }

  renderVideos() {
    let {student, tutorialVideos} = this.state;
    let watchedVideoCount = 0; //this must get from server
    let percentage = 0;
    let borderWidthNumber = 0;
    if (watchedVideoCount > 0) {
      percentage = Math.floor(
        (tutorialVideos.length / watchedVideoCount) * 100,
      );
      borderWidthNumber = 2;
    }
    return (
      <View style={styles.cardVideo}>
        <TouchableOpacity onPress={this.navigateToTutorialVideoList}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.cardTitle, {flex: 1}]}>Tutorial Videos</Text>
            <FontAwesome5 name={'arrow-right'} style={styles.backIconText} />
          </View>
        </TouchableOpacity>
        <Text style={styles.cardDescription}>
          Watch behavior & language tutorial videos on how to complete targets
          with .
        </Text>
        <View style={styles.targetView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.targetText}>
              {watchedVideoCount} of {tutorialVideos.length} Videos watched{' '}
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
  getData() {
    this.setState({isLoading: true});

    let vars = {
      therapist: store.getState().user.staffSet.id,
    };

    console.log('Vars', vars);

    console.log('Store', store.getState().user);

    TherapistRequest.getHomeData(vars)
      .then((dashboardResult) => {
        console.log('DashboardResult', dashboardResult);

        let attendance = null;
        let today = moment();
        let startDate = null;
        let attendanceExist = false;
        if (dashboardResult.data.lastStatus.edges.length != 0) {
          attendanceExist = true;

          let lastStatus = dashboardResult.data.lastStatus.edges[0].node;

          let checkIn = lastStatus.checkIn;
          let checkOut = lastStatus.checkOut;
          startDate = moment(checkIn);

          let diff = today.diff(startDate, 'days');
          // if (diff == 0) {
          attendance = dashboardResult.data.lastStatus.edges[0];
          // }
        }

        let tasks = dashboardResult.data.tasks.edges;

        let appointments = [];
        dashboardResult.data.upcoming_appointment.edges.forEach(
          (appointment) => {
            console.log('Appointment', appointment);
            let start = moment(appointment.node.start);
            let now = moment();
            if (moment(start).isSameOrAfter(now)) {
              console.log('OK');
              appointments.push(appointment);
            }
          },
        );

        let timeSheets = [];
        dashboardResult.data.timesheet.edges.forEach((ts) => {
          let start = moment(ts.node.start).format('YYYY-MM-DD');
          let now = moment().format('YYYY-MM-DD');
          if (moment(start).isSameOrAfter(now)) {
            timeSheets.push(ts);
          }
        });

        this.setState({
          isLoading: false,
          isAttendanceLoading: false,
          appointments,
          timeSheets: timeSheets,
          attendance,
          tasks,
        });
      })
      .catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        this.setState({isLoading: false, isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  startEndWork() {
    this.setState({isAttendanceLoading: true});

    let queryString = {
      lng: '-7.3771645',
      lat: '112.6443217',
    };

    console.log(queryString);

    TherapistRequest.startEndWorkDay(queryString)
      .then((attendanceResult) => {
        console.log('startEndWorkDay', attendanceResult);

        this.setState({
          isAttendanceLoading: false,
        });

        this.getData();
      })
      .catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        this.setState({isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  startWork() {
    this.setState({isAttendanceLoading: true});

    let queryString = {
      checkIn: moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
      checkInLongitude: '-7.3771645',
      checkInLatitude: '112.6443217',
    };

    console.log(queryString);

    TherapistRequest.startWorkDay(queryString)
      .then((attendanceResult) => {
        console.log('attendanceResult', attendanceResult);

        this.setState({
          isAttendanceLoading: false,
        });

        this.getData();
      })
      .catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        this.setState({isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  endWork() {
    this.setState({isAttendanceLoading: true});

    let queryString = {
      id: this.state.attendance.node.id,
      checkOut: moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
      checkOutLongitude: '-7.3771645',
      checkOutLatitude: '112.6443217',
    };

    console.log(queryString);

    TherapistRequest.endWorkDay(queryString)
      .then((attendanceResult) => {
        console.log('attendanceResult', attendanceResult);

        this.setState({
          isAttendanceLoading: false,
        });

        this.getData();
      })
      .catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        this.setState({isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  renderAttendance() {
    let {attendance, isAttendanceLoading} = this.state;
    return (
      <>
        <Text style={[styles.text, {marginTop: 16}]}>Attendance</Text>

        {isAttendanceLoading && (
          <View style={{alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Color.primary} />
          </View>
        )}

        {!isAttendanceLoading && (
          <>
            {attendance == null && (
              <TouchableOpacity
                style={styles.buttonStart}
                onPress={() => {
                  Alert.alert(
                    'Information',
                    'Are you sure want to start workday ?',
                    [
                      {text: 'No', onPress: () => {}, style: 'cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          //start workday
                          this.startEndWork();
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <Text style={styles.buttonStartText}>Start Workday</Text>
              </TouchableOpacity>
            )}

            {attendance && (
              <View style={styles.contentBox}>
                <View style={{marginHorizontal: 8}}>
                  <View
                    style={[
                      styles.row,
                      {paddingVertical: 8, justifyContent: 'space-between'},
                    ]}>
                    <View>
                      <Text style={[styles.textSmall, {color: Color.grayFont}]}>
                        Start time
                      </Text>
                      <Text style={styles.text}>
                        {moment(attendance.node.checkIn).format('hh:mm A')}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.textSmall, {color: Color.grayFont}]}>
                        Stop time
                      </Text>
                      <Text style={[styles.text, {textAlign: 'right'}]}>
                        {attendance.node.checkOut
                          ? moment(attendance.node.checkOut).format('hh:mm A')
                          : '__:__'}
                      </Text>
                    </View>
                  </View>
                  {attendance.node.checkOut == null && (
                    <TouchableOpacity
                      style={styles.buttonEnd}
                      onPress={() => {
                        Alert.alert(
                          'Information',
                          'Are you sure want to end workday ?',
                          [
                            {text: 'No', onPress: () => {}, style: 'cancel'},
                            {
                              text: 'Yes',
                              onPress: () => {
                                //start workday
                                this.startEndWork();
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      }}>
                      <Text style={styles.buttonEndText}>End Workday</Text>
                    </TouchableOpacity>
                  )}

                  {attendance.node.status == 1 && (
                    <TouchableOpacity
                      style={styles.buttonStart}
                      onPress={() => {
                        Alert.alert(
                          'Information',
                          'Are you sure want to start workday ?',
                          [
                            {text: 'No', onPress: () => {}, style: 'cancel'},
                            {
                              text: 'Yes',
                              onPress: () => {
                                //start workday
                                this.startEndWork();
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      }}>
                      <Text style={styles.buttonStartText}>Start Workday</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </>
    );
  }

  renderFeedback(appointment) {
    return (
      <FeedbackButton
        appointment={appointment}
        onPress={() => {
          this.props.navigation.navigate('AppointmentFeedback', appointment);
        }}
      />
    );
  }

  renderAppointment() {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            let parent = this.props.navigation.dangerouslyGetParent();
            parent.navigate('Calendar');
          }}
          style={[
            styles.row,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={styles.text}>Upcoming Appointments</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        {this.state.appointments.map((appointment, key) => {
          return (
            <AppointmentCard
              key={key}
              appointment={appointment}
              onPress={() => {}}
              onFeedbackPress={() => {
                this.props.navigation.navigate(
                  'AppointmentFeedback',
                  appointment,
                );
              }}
            />
          );
        })}

        {this.state.appointments.length == 0 && (
          <NoData>No Upcoming Appointments</NoData>
        )}

        <View style={{height: 14}} />
      </>
    );
  }

  renderTimeSheet() {
    return (
      <>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('WorkLogList')}
          style={[
            styles.row,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={styles.text}>Timesheet</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        {this.state.timeSheets.map((attendance, key) => {
          return (
            <View
              style={[styles.contentBox, {paddingHorizontal: 16}]}
              key={'ts' + key}>
              <Text style={styles.textBig}>{attendance.node.title}</Text>
              <Text style={styles.textSmall}>
                {attendance.node.location.location}
              </Text>
              <TimelineView
                dotColor={Color.activeBlueDot}
                dotColor2={Color.noActiveBlueDot}
                textColor={Color.blackFont}
                texts={[
                  moment(attendance.node.start).format('hh:mm A'),
                  moment(attendance.node.end).format('hh:mm A'),
                ]}
              />
            </View>
          );
        })}

        {this.state.timeSheets.length == 0 && (
          <NoData>No Attendance Available</NoData>
        )}
      </>
    );
  }

  renderTask() {
    return (
      <>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('TaskList')}
          style={[
            styles.row,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={styles.text}>Task</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        {this.state.tasks.map((task, index) => {
          let priorityColor = Color.success;
          if (task?.node?.priority?.name == 'Super High') {
            priorityColor = Color.danger;
          } else if (task?.node?.priority?.name == 'High') {
            priorityColor = Color.warning;
          } else if (task?.node?.priority?.name == 'Medium') {
            priorityColor = Color.info;
          }
          let taskColor = Color.success;
          if (task?.node?.status?.colorCode == 'danger') {
            taskColor = Color.danger;
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.props.navigation.navigate('TaskDetail', task);
              }}
              activeOpacity={0.9}
              style={styles.taskStyle}>
              <View style={Styles.column}>
                <Text style={styles.taskStyleTitle}>{task.node.taskName}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[styles.taskStylePriority, {color: priorityColor}]}>
                    {task?.node?.priority?.name}
                  </Text>
                  <View style={{marginHorizontal: 5}}>
                    <Text>•</Text>
                  </View>
                  <Text style={[styles.taskStylePriority, {color: taskColor}]}>
                    {task?.node?.status?.taskStatus}
                  </Text>
                </View>
              </View>
              {/* <View style={{ justifyContent: 'center' }}>
                                {assignWork.map((assign, key) => {
                                    return <Image source={{ uri: ImageHelper.getImage(assign.node.image) }} style={styles.assignThumbnail} key={index + '_' + key} />;
                                })}
                            </View> */}
            </TouchableOpacity>
          );
        })}

        {this.state.tasks.length == 0 && <NoData>No Task Available</NoData>}
      </>
    );
  }

  renderBanner() {
    return (
      <TouchableOpacity
        onPress={() => {}}
        activeOpacity={0.8}
        style={styles.cardhome}>
        <HomeCard
          title="Acceptance & Commitment"
          descr="Build a more constructive relationship"
          newFlag={false}
          bgcolor={Color.purpleCard}
          bgimage="screening"
        />
      </TouchableOpacity>
    );
    // return (
    //     <>
    //         <TouchableOpacity style={styles.card}>
    //             <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 5 }} >
    //                 <Text style={[styles.textBig, { color: Color.white, flexWrap: 'wrap' }]}>Acceptance & Commitment</Text>
    //                 <Text style={[styles.textSmall, { color: Color.white, flexWrap: 'wrap', marginVertical: 8 }]}>Build a more constructive relationship</Text>
    //             </View>
    //             <Image style={styles.bigImage} source={require('../../../../android/img/screening-card.png')} />
    //         </TouchableOpacity>
    //     </>
    // );
  }

  render() {
    let url =
      'wss://application.cogniable.us/ws/notification/' +
      store.getState().user.id;
    // console.log("url_notification====", url);
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={this._refresh.bind(this)}
                />
              }>
              <Row style={{paddingTop: 30, paddingBottom: 10}}>
                <Column>
                  <Text style={styles.title}>Home</Text>
                </Column>
                <Column style={{flex: 0}}>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('NotificationScreen')
                      }>
                      <MaterialCommunityIcons
                        name="bell-circle"
                        size={30}
                        style={{alignSelf: 'flex-end'}}
                      />
                    </TouchableOpacity>
                  </View> */}
                </Column>
              </Row>

              {this.renderAttendance()}
              {this.renderAppointment()}
              {this.renderTimeSheet()}
              {this.renderTask()}
              {this.renderVideos()}
              {this.renderCommunity()}
              {this.renderBanner()}
            </ScrollView>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <Row style={{paddingTop: 30, paddingBottom: 10}}>
                <Column>
                  <Text style={styles.title}>Home</Text>
                </Column>
                <Column>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('TherapistProfile');
                    }}>
                    <Image
                      style={styles.headerImage}
                      source={require('../../../../android/img/Image.png')}
                    />
                  </TouchableOpacity>
                </Column>
              </Row>
              <Row style={{flex: 1}}>
                <Column>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic">
                    {this.renderAttendance()}
                    {this.renderTask()}
                    {this.renderBanner()}
                  </ScrollView>
                </Column>
                <Column style={{flex: 2}}>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic"
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this._refresh.bind(this)}
                      />
                    }>
                    {this.renderAppointment()}
                    {this.renderTimeSheet()}
                  </ScrollView>
                </Column>
              </Row>
            </>
          )}
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
              console.log('onError', err.message, url);
            }}
            onClose={(err) => {
              console.log('onClose', err);
            }}
            reconnect // Will try to reconnect onClose
          />
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  headerImage: {
    width: 32,
    height: 32,
    alignSelf: 'flex-end',
    borderRadius: 16,
  },
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
  },
  bigImage: {
    width: 100,
    height: 120,
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentBox: {
    marginVertical: 5,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 8,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  textBig: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 10,
  },
  textBig2: {
    fontSize: 10,
  },
  buttonStart: {
    backgroundColor: Color.primaryButton,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 10,
  },
  buttonStartText: {
    color: Color.white,
  },
  buttonEnd: {
    flex: 1,
    borderColor: Color.primaryButton,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonEndText: {
    color: Color.primaryButton,
  },
  line: {
    height: 1,
    width: width / 1.2,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  dot: {
    height: 5,
    width: 5,
    backgroundColor: Color.silver,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  card: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Color.purpleCard,
    borderRadius: 8,
  },
  taskStyle: {
    flexDirection: 'row',
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
  cardVideo: {
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
    backgroundColor: Color.white,
    borderRadius: 5,
    padding: 10,
    margin: 3,
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
  cardhome: {
    marginBottom: 16,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodayHome);
