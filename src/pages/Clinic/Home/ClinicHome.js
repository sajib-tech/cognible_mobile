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
  Linking,
} from 'react-native';
import Styles from '../../../utility/Style';
import Color from '../../../utility/Color';
import {Button} from 'react-native-elements';
import TimelineView from '../../../components/TimelineView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import {
  client,
  getStudentSessions,
  getTherapyLongTermGoals,
  GetVimeoProjects,
  GetVimeoProjectVideos,
  getTherapyProgramDetails,
} from '../../../constants/index';
import store from '../../../redux/store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const width = Dimensions.get('window').width;
import HomeCard from '../../../components/HomeCard';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import ClinicRequest from '../../../constants/ClinicRequest';
import ImageHelper from '../../../helpers/ImageHelper';
import DateHelper from '../../../helpers/DateHelper';
import WS from 'react-native-websocket';
import {getStr} from '../../../../locales/Locale';
import {Thumbnail} from 'react-native-thumbnail-video';
import axios from 'axios';
import FeedbackButton from '../../../components/FeedbackButton';
import VideoThumbnail from '../../../components/VideoThumbnail';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ParentRequest from '../../../constants/ParentRequest';

class ClinicHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      appointments: [],
      tasks: [],
      staffs: [],
      studentIID: '',
      vimeoVideos: [],
      vimeoProjects: [],
      student: '',
      clinicVideo: [],
      appo: [],

      isLoadingVideo: true,
      tutorialVideos: [],
      notifications: [],
      unreadCount: 0,
    };
    this.showCommunity = this.showCommunity.bind(this);

    this.navigateToTutorialVideoList = this.navigateToTutorialVideoList.bind(
      this,
    );
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    //Call this on every page
    ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);

    this.props.navigation.addListener("focus", () => {
      this.getData();
    })

  }

  getNotificationList() {
    this.setState({isLoading: true});
    // console.log('store data==', store.getState().user.student.id);
    console.log('sarthak==', store.getState().user.id);

    let variables = {
      student: store.getState().user.id,
      // student: 'VXNlclR5cGU6MTk4',
    };
    console.log('Notificationa==', variables);
    ParentRequest.fetchNotifications(variables)
      .then((profileData) => {
        this.setState({isLoading: false});
        let notificationArray = [];
				let notifications = profileData.data.notification.edges;
				console.error("profiledata", profileData)
        console.error('Notification==', notifications);
        for (let i = 0; i < notifications.length; i++) {
          let noti = notifications[i].node;
          notificationArray.push(noti);
          if(noti?.read === false) {
						this.setState({unreadCount: this.state.unreadCount + 1})
					}
        }
        console.log('Notification==', notificationArray);
        this.setState({notifications: notificationArray});
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.log(error, error.response);
        //
        Alert.alert('Information', error.toString());
      });
  }

  getData() {
    this.setState({isLoading: true});

    let vars = {
      date: moment().format('YYYY-MM-DD'),
      dateFrom: moment().format('YYYY-MM-DD') ,
      dateTo: moment().format('YYYY-MM-DD')
    };

    ClinicRequest.getHomeData(vars)
      .then((dashboardResult) => {
        // console.log(
        //   'Data from dashboard1 -->' + JSON.stringify(dashboardResult),
        // );

        console.log(dashboardResult)
        

        let appointments = [];
        dashboardResult.data.upcoming_appointment.edges.forEach(
          (appointment) => {
            let start = moment(appointment.node.start).format('YYYY-MM-DD');
            let now = moment().format('YYYY-MM-DD');
            if (moment(start).isSameOrAfter(now)) {
              appointments.push(appointment);
            }
          },
        );

        console.log('pushed appointment size-->' + appointments.length);

        this.setState(
          {
            isAttendanceLoading: false,
            appointments,
            studentIID: dashboardResult.data.schoolDetail.id,
            tasks: dashboardResult.data.tasks.edges,
            staffs: dashboardResult.data.schoolDetail.staffSet.edges,
          },
          () => {
            this.fetchClinicVideo();
          },
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false, isAttendanceLoading: false});
        Alert.alert(
          'Information',
          'Cannot Fetch Today Data\n' + error.toString(),
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
        style={styles.cardHome}>
        <HomeCard
          title="Parent Community"
          descr="Discuss and learn from parents on how they are taking care of their child."
          newFlag={true}
          bgcolor="#0095B6"
          bgimage="community"
        />
        {/* <HomeCard title={getStr('homeScreenAutism.ParentCommunity')}
                    descr={getStr('homeScreenAutism.parentDesription')}
                    newFlag={true}
                    bgcolor="#0095B6"
                    bgimage={'community'} /> */}
      </TouchableOpacity>
    );
  }

  showAutismScreening() {
    let {navigation} = this.props;
    navigation.navigate('ScreeningList');
  }

  renderAutism() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showAutismScreening();
        }}
        activeOpacity={0.8}
        style={styles.cardHome}>
        <HomeCard
          title={getStr('homeScreenAutism.AutismScreening')}
          descr={getStr('homeScreenAutism.description')}
          // startText="Start Screening"
          startText={getStr('homeScreenAutism.startScreening')}
          bgcolor="#254056"
          bgimage={'screening'}
        />
      </TouchableOpacity>
    );
  }

  fetchClinicVideo() {
    let variables = {
      clinic: this.state.studentIID,
    };
    TherapistRequest.GetClinicVideo(variables)
      .then((dataResult) => {
        let allData = dataResult.data.getClinicLibrary.edges;

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
    // console.log("gdgdggd", this.state.clinicVideo)
    navigation.navigate('VimeoProjectsList', {
      clinicVideo: this.state?.clinicVideo,
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
        // <TouchableOpacity onPress={this.navigateToTutorialVideoList}>
        <VideoThumbnail
          key={index}
          videoUrl={video.videoUrl}
          imageUrl={video.thumbnailUrl}
          title={video.name}
          description={video.description}
        />
        // </TouchableOpacity>
      );
    });
  }

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
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}>
          <Text style={styles.text}>Upcoming Appointments</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        {this.state.appointments.map((appointment, key) => {
          console.log('djdjdjd', appointment.node.isApproved);
          console.log('data__', appointment);
          let isApprooved =
            appointment?.node?.isApproved == true ? 'Open' : 'Close';

          let phoneNumber =
            appointment.node.student != null
              ? appointment.node.student.mobileno
              : 0;
          return (
            <View
              style={[styles.contentBox, {margin: 3, paddingHorizontal: 16}]}
              key={key}>
              <TouchableOpacity
                style={[styles.row, {alignItems: 'center'}]}
                onPress={() => {
                  if (phoneNumber) {
                    if (Linking.canOpenURL('tel:' + phoneNumber)) {
                      Linking.openURL('tel:' + phoneNumber);
                    } else {
                      Alert.alert(
                        'Information',
                        "Sorry, your device can't make a phone call",
                      );
                    }
                  }
                }}>
                <Text style={[styles.textSmall, {flex: 1}]}>
                  {moment(appointment.node.start).format('MMM DD, YYYY')},{' '}
                  {moment(appointment.node.start).format('hh:mm A')} -{' '}
                  {moment(appointment.node.end).format('hh:mm A')}
                </Text>
                {/*{OrientationHelper.getDeviceOrientation() == 'landscape' && (*/}
                {/*    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>*/}
                {/*        <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>*/}
                {/*        <View style={styles.dot} />*/}
                {/*        <Text style={[styles.textSmall, {}]}>{appointment.node.location.location}</Text>*/}
                {/*    </View>*/}
                {/*)}*/}
                {phoneNumber != '' && (
                  <MaterialCommunityIcons name="phone" size={20} />
                )}
              </TouchableOpacity>
              <View style={styles.line} />

              <View
                style={[styles.row, {alignItems: 'center', marginVertical: 4}]}>
                <Image
                  style={styles.smallImage}
                  source={require('../../../../android/img/Image.png')}
                />
                <View style={{marginHorizontal: 8, flex: 1}}>
                  {appointment.node.student != null && (
                    <Text style={styles.text}>
                      {appointment.node.student.firstname}{' '}
                      <Text style={{color: Color.primary}}>
                        ({appointment.node.therapist.name})
                      </Text>
                    </Text>
                  )}
                  <Text style={[styles.textSmall, {color: Color.grayFont}]}>
                    {appointment.node.title}
                  </Text>
                </View>
                {OrientationHelper.getDeviceOrientation() == 'landscape' &&
                  this.renderFeedback(appointment)}
              </View>
              {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                <View
                  style={[
                    styles.row,
                    {alignItems: 'center', marginVertical: 4},
                  ]}>
                  <Text
                    style={[styles.textSmall, {color: Color.primaryButton}]}>
                    {appointment.node.purposeAssignment}
                  </Text>
                  <View style={styles.dot} />
                  <Text style={[styles.textSmall, {flexDirection: 'row'}]}>
                    {appointment?.node?.location?.location}
                  </Text>
                  <Text
                    style={[
                      styles.textBig2,
                      {
                        color: isApprooved == 'Open' ? 'green' : 'red',
                        marginLeft: 7,
                      },
                    ]}>
                    {isApprooved}
                  </Text>
                  <View style={{flex: 1}} />
                  {this.renderFeedback(appointment)}
                </View>
              )}
            </View>
          );
        })}

        {this.state.appointments.length == 0 && (
          <NoData>No Upcoming Appointments</NoData>
        )}
      </>
    );
  }

  closeTask(task) {
    let variables = {
      id: task.node.id,
      taskType: task.node.taskType.id,
      taskName: task.node.taskName,
      description: task.node.description,
      priority: task.node?.priority?.id,
      startDate: task.node.startDate,
      dueDate: task.node.dueDate,
    };
    console.log('variable___', JSON.stringify(variables));
    ClinicRequest.closeTask(variables)
      .then((profileData) => {
        Alert.alert('Information', 'Task successfully closed');
        this.getData();
      })
      .catch((error) => {
        console.log('Error', JSON.stringify(error));

        Alert.alert('Information', error.toString());
      });
  }

  renderTask() {
    let tasks = this.state.tasks;
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            let parent = this.props.navigation.dangerouslyGetParent();
            parent.navigate('Profile');
          }}
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}>
          <Text style={styles.text}>Tasks</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        {tasks?.map((task, index) => {
          console.log('taskx-->' + JSON.stringify(task));
          let assignWork = task.node.assignWork.edges;
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
          let taskColor = Color.success;
          if (task?.node?.status?.colorCode == 'danger') {
            taskColor = Color.danger;
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                let parent = this.props.navigation.dangerouslyGetParent();
                parent.navigate('Profile');
              }}
              activeOpacity={0.9}
              style={styles.taskStyle}>
              <View style={Styles.column}>
                <Text style={styles.taskStyleTitle}>
                  {task?.node?.taskName}
                </Text>
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

              {task?.node?.status?.taskStatus == 'Open' && (
                <TouchableOpacity
                  style={{padding: 5}}
                  onPress={() => {
                    Alert.alert(
                      'Information',
                      'Are you sure want to close this task?',
                      [
                        {text: 'No', onPress: () => {}, style: 'cancel'},
                        {
                          text: 'Yes',
                          onPress: () => {
                            this.closeTask(task);
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={30}
                    color={Color.success}
                  />
                </TouchableOpacity>
              )}

              {/* <View style={{ justifyContent: 'center' }}>
                                {assignWork.map((assign, key) => {
                                    return <Image source={{ uri: ImageHelper.getImage(assign.node.image) }} style={styles.assignThumbnail} key={index + '_' + key} />;
                                })}
                            </View> */}
            </TouchableOpacity>
          );
        })}

        {tasks.length == 0 && <NoData>No Task Available</NoData>}
      </>
    );
  }

  renderStaff() {
    let staffs = this.state.staffs;
    let temp = staffs.filter((staff) => staff.node.isActive)
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            let parent = this.props.navigation.dangerouslyGetParent();
            parent.navigate('ClinicStaffs');
          }}
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}>
          <Text style={styles.text}>Staff</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        {temp.map((staff, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={styles.studentItem}
              onPress={() => {
                this.props.navigation.navigate('ClinicStaffDetail', staff);
              }}>
              <View style={[styles.studentImage, {backgroundColor: '#ddd'}]}>
                <Image
                  style={styles.studentImage}
                  source={{uri: ImageHelper.getImage(staff.node.image)}}
                />
              </View>
              <View style={{marginHorizontal: 8, flex: 1}}>
                <Text style={styles.text}>{staff.node.name}</Text>
                {staff.node.userRole && (
                  <Text style={styles.studentSubject}>
                    {staff.node.userRole.name}
                  </Text>
                )}
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={Color.grayFill}
              />
            </TouchableOpacity>
          );
        })}

        {staffs.length == 0 && <NoData>No Staff Available</NoData>}
      </>
    );
  }

  renderBanner() {
    return (
      <>
        <TouchableOpacity style={styles.card}>
          <View style={{flex: 1, justifyContent: 'center', paddingLeft: 5}}>
            <Text
              style={[styles.textBig, {color: Color.white, flexWrap: 'wrap'}]}>
              Acceptance & Commitment
            </Text>
            <Text
              style={[
                styles.textSmall,
                {color: Color.white, flexWrap: 'wrap', marginVertical: 8},
              ]}>
              Build a more constructive relationship
            </Text>
          </View>
          <Image
            style={styles.bigImage}
            source={require('../../../../android/img/screening-card.png')}
          />
        </TouchableOpacity>
      </>
    );
  }

  render() {
    let url =
      'wss://application.cogniable.us/ws/notification/' +
      store.getState().user.id;
    // console.log("url_notification====", url);
    return (
      <ScrollView>
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
                  <Column></Column>
                  <Column>
                    {/* <View style={{position: 'absolute', right: 10}}>
                      <View style={{flexDirection: 'row'}}>
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
                        <View
                          style={{
                            height: 15,
                            width: 15,
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
														borderRadius: 7,
														marginLeft: -7
                          }}>
                          <Text style={{color: 'white', fontWeight: 'bold'}}>
                            {this.state.unreadCount}
                          </Text>
                        </View>
                      </View>
                    </View> */}
                  </Column>
                </Row>
                {this.renderAppointment()}
                {this.renderTask()}

                {/* <TouchableOpacity onPress={() => {
                                // let parent = this.props.navigation.dangerouslyGetParent();
                                // parent.navigate("Profile");
                                let { navigation } = this.props;
                                navigation.navigate('Group');
                            }}
                                style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }]}>
                                <Text style={styles.text}>Add Groups</Text>
                                <MaterialCommunityIcons
                                    name='arrow-right'
                                    size={20}
                                />
                            </TouchableOpacity> */}

                {/*<Thumbnail url="https://www.youtube.com/watch?v=10ElLE8UyXM&list=RD10ElLE8UyXM&start_radio=1"*/}
                {/*           showPlayIcon={false}*/}
                {/*           onPress={() => {}}>*/}

                {/*</Thumbnail>*/}

                {this.renderStaff()}

                {this.renderVideos()}

                {/* {this.renderAutism()} */}

                {this.renderCommunity()}
              </ScrollView>
            )}

            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              // <>
              //     <Row style={{ paddingTop: 30, paddingBottom: 10 }}>
              //         <Column>
              //             <Text style={styles.title}>Home</Text>
              //         </Column>
              //         <Column>
              //
              //         </Column>
              //     </Row>
              //     <Row style={{ flex: 1 }}>
              //         <Column style={{ flex: 2 }}>
              //             <ScrollView keyboardShouldPersistTaps='handled'
              //                 showsVerticalScrollIndicator={false}
              //                 contentInsetAdjustmentBehavior="automatic">
              //                 {this.renderAppointment()}
              //                 {this.renderTask()}
              //             </ScrollView>
              //         </Column>
              //         <Column>
              //             <ScrollView keyboardShouldPersistTaps='handled'
              //                 showsVerticalScrollIndicator={false}
              //                 contentInsetAdjustmentBehavior="automatic"
              //                 refreshControl={
              //                     <RefreshControl
              //                         refreshing={this.state.isLoading}
              //                         onRefresh={this._refresh.bind(this)}
              //                     />
              //                 }>
              //                 {this.renderStaff()}
              //
              //                 {this.renderVideos()}
              //
              //                 {this.renderCommunity()}
              //             </ScrollView>
              //         </Column>
              //     </Row>
              // </>

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
                  <Column></Column>
                  <Column>
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
                  </Column>
                </Row>
                {this.renderAppointment()}
                {this.renderTask()}

                {/* <TouchableOpacity onPress={() => {
                                // let parent = this.props.navigation.dangerouslyGetParent();
                                // parent.navigate("Profile");
                                let { navigation } = this.props;
                                navigation.navigate('Group');
                            }}
                                style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }]}>
                                <Text style={styles.text}>Add Groups</Text>
                                <MaterialCommunityIcons
                                    name='arrow-right'
                                    size={20}
                                />
                            </TouchableOpacity> */}

                {/*<Thumbnail url="https://www.youtube.com/watch?v=10ElLE8UyXM&list=RD10ElLE8UyXM&start_radio=1"*/}
                {/*           showPlayIcon={false}*/}
                {/*           onPress={() => {}}>*/}

                {/*</Thumbnail>*/}

                {this.renderStaff()}

                {this.renderVideos()}

                {this.renderCommunity()}
              </ScrollView>
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
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
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
    marginBottom: 12,
    marginHorizontal: 3,
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
  assignThumbnail: {
    width: 20,
    height: 20,
    borderRadius: 2,
  },

  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 5,
    margin: 3,
    marginBottom: 10,
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  cardHome: {
    marginBottom: 16,
  },
  card: {
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

export default connect(mapStateToProps, mapDispatchToProps)(ClinicHome);
