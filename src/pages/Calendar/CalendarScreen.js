import React, {Component} from 'react';

import {
  ActivityIndicator,
  Text,
  View,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal
} from 'react-native';
import {getStr} from '../../../locales/Locale';
import Color from '../../utility/Color'; //'../../../utility/Color.js';
import Styles from '../../utility/Style.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TherapyHomeMorningSessionVideoItem from '../../components/TherapyHomeMorningSessionVideoItem';
import {connect} from 'react-redux';
import store from '../../redux/store';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import ParentRequest from '../../constants/ParentRequest';
import moment from 'moment';
import Button from '../../components/Button';
import NoData from '../../components/NoData';
import CalendarView from '../../components/CalendarView';
import SimpleModal from '../../components/SimpleModal';
import questions from '../Common/Cogniable/questions';
import StarRating from '../../components/StarRating';
import TextInput from '../../components/TextInput';
import FeedbackButton from '../../components/FeedbackButton';
import ImageHelper from '../../helpers/ImageHelper.js';
import TherapistRequest from '../../constants/TherapistRequest.js';


const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      weekDates: DateHelper.getCurrentWeekDates(),
      sessions: [],
      noSessionsDataText: '',
      noAppointmentDataText: '',
      appointments: [],
      selectedDate: DateHelper.getTodayDate(),
      selectedSessionIndex: 0,
      showReview: false,
      selectedAppointment: null,
      feedbackQuestions: [],
      currentQuestionIndex: 0,
      feedbackAnswers: [],
      questionErrorMessage: '',
      isSendingFeedback: false,
      modalTherapySession: false,
    };
    this.gotoSessionPreview = this.gotoSessionPreview.bind(this);
  }
  componentDidMount() {

    console.log(this.props)
    

    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getTherapySessions();

    this.props.navigation.addListener('focus', () => {
      this.fetchAppointments();
    });

  }
  gotoSessionPreview(type, index) {
    console.log('type:' + type + ', index=' + index);
    let student = store.getState().user.student;
    let targetsLength = this.state.sessions[index].node.targets.edges.length;
    if (targetsLength > 0) {
      let {navigation} = this.props;
      if (type == 'Morning') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Morning Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        });
      } else if (type == 'Afternoon') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Afternoon Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        });
      } else if (type == 'Evening') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Evening Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        });
      }
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
  fetchAppointments() {
    this.setState({showLoading: true});
    console.log('fetchAppointments() is called');
    let variables = {
      student: store.getState().studentId,
      date: this.state.selectedDate,
    };
    ParentRequest.fetchStudentAppointments(variables)
      .then((appointmentsData) => {
        this.setState({showLoading: false});
        console.log(appointmentsData);
        if (
          appointmentsData.data.appointments &&
          appointmentsData.data.appointments.edges.length === 0
        ) {
          this.setState({
            noAppointmentDataText: getStr('TargetAllocate.NoAppointmentsFound'),
          });
        }
        if (
          appointmentsData.data.appointments &&
          appointmentsData.data.appointments.edges
        ) {
          this.setState({
            appointments: appointmentsData.data.appointments.edges,
          });
        }
      })
      .catch((error) => {
        this.setState({showLoading: false});
        console.log(error, error.response);

        Alert.alert('Information', error.toString());
      });
  }
  getTherapySessions() {
    this.setState({showLoading: true});
    console.log('getTherapySessions() is called');
    let variables = {
      studentId: store.getState().studentId,
      date: this.state.selectedDate,
    };
    console.log('getTherapySessions() is called: ' + JSON.stringify(variables));
    ParentRequest.fetchStudentSessions(variables)
      .then((sessionData) => {
        // console.log("sessionData:"+JSON.stringify( sessionData.data))
        this.setState({showLoading: false});
        if (
          sessionData.data.GetStudentSession &&
          sessionData.data.GetStudentSession.edges.length === 0
        ) {
          this.setState({
            noSessionsDataText: getStr('TargetAllocate.NoSessionFound'),
          });
        }
        if (
          sessionData.data.GetStudentSession &&
          sessionData.data.GetStudentSession.edges
        ) {
          this.setState({sessions: sessionData.data.GetStudentSession.edges});
        }
      })
      .catch((error) => {
        this.setState({showLoading: false});
        console.log(error, error.response);

        Alert.alert('Information', error.toString());
      });
  }

  callBackFromCalendar = (selectedDate) => {
    console.log(selectedDate);
    this.setState({noSessionsDataText: '', noAppointmentDataText: ''});
    this.setState({selectedDate}, () => {
      this.getTherapySessions();
      this.fetchAppointments();
    });
  };
  renderNoAppoinments() {
    let {
      showLoading,
      sessions,
      appointments,
      noSessionsDataText,
      noAppointmentDataText,
    } = this.state;

    if (appointments.length == 0 && showLoading == false) {
      return <NoData>{noAppointmentDataText}</NoData>;
    }

    return null;
  }
  renderNoSessions() {
    let {
      showLoading,
      sessions,
      appointments,
      noSessionsDataText,
      noAppointmentDataText,
    } = this.state;
    return (
      sessions.length === 0 && (
        <View
          style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{width: '100%', textAlign: 'center'}}>
            {noSessionsDataText}
          </Text>
        </View>
      )
    );
  }

  modalTherapySession() {
    let appointment = this.state.selectedAppointment;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        // visible={this.state.modalTherapySession}
        visible={this.state.modalTherapySession}
        onRequestClose={() => this.setState({modalTherapySession: false})}
        style={{flex: 1}}>
        {appointment && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState({modalTherapySession: false})}
            style={{flex: 1, backgroundColor: Color.blackOpacity}}>
            <View
              style={{
                flex: 1,
                backgroundColor: Color.white,
                padding: 16,
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
              }}>
              <Text style={[styles.textBig, {marginVertical: 8}]}>
                {appointment.node.title}
              </Text>
              <View style={[Styles.row, {alignItems: 'center'}]}>
                <Text
                  style={[styles.text, {fontSize: 12, color: Color.grayFill}]}>
                  {moment(appointment.node.start).format('MMM DD')}
                </Text>
                <View style={styles.dot} />
                <Text
                  style={[styles.text, {fontSize: 12, color: Color.grayFill}]}>
                  {moment(appointment.node.start).format('hh:mm A')} -{' '}
                  {moment(appointment.node.end).format('hh:mm A')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={30}
                  color={Color.primary}
                />
                <Text
                  style={{fontSize: 14, marginLeft: 5, color: Color.primary}}>
                  {appointment?.node?.location?.location}
                </Text>
              </View>

              {/* <Text style={[styles.textSmall, { color: Color.grayFill }]}>{appointment.node.location.location}</Text>
                            <View style={{ flex: 1, marginVertical: 4, backgroundColor: Color.whiteOpacity, padding: 10, alignItems: 'center', borderColor: Color.greenCyan, borderWidth: 0.5 }}>
                                <MaterialCommunityIcons
                                    name="google-maps"
                                    color={Color.greenCyan}
                                    size={24}
                                />
                            </View> */}

              <View
                style={styles.studentItem}>
                <Image
                  style={[styles.studentImage, {resizeMode: 'contain'}]}
                  source={{
                    uri: 
                      appointment?.node?.student?.image}}
                />
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.text}>
                      {appointment.node?.student.firstname || ""}{' '}
                      {appointment.node?.student?.lastname || ""}
                    </Text>
                    {appointment?.node?.student?.mobileno && (
                      <MaterialCommunityIcons
                        name="phone"
                        color={Color.grayFill}
                        size={16}
                      />
                    )}
                  </View>
                  <Text style={styles.studentSubject}>Student</Text>
                </View>
              </View>

              <Text style={[Styles.grayText, {marginTop: 8}]}>
                Private Notes
              </Text>
              <TextInput
                style={[Styles.input, {height: 80}]}
                placeholder={'Private Notes'}
                multiline={true}
                editable={false}
                defaultValue={appointment.node.note}
              />

              <Button
                labelButton="Edit Appointment"
                onPress={() => this.editAppointment()}
                backgroundColor={Color.primary}
              />

              <Button
                style={{marginTop: 5, marginBottom: 20}}
                theme="secondary"
                labelButton="Cancel Appointment"
                onPress={() => this.cancelAppointment()}
              />
            </View>
          </TouchableOpacity>
        )}
      </Modal>
    );
  }

  editAppointment() {
    if (OrientationHelper.getDeviceOrientation() == 'landscape') {
      this.setState({modalTherapySession: false, tabletSideScreen: 'edit'});
    } else {
      this.props.navigation.navigate('AppointmentNew', {
        appointment: this.state.selectedAppointment,
        isFromEdit: true
      });
      this.setState({modalTherapySession: false});
    }
  }

  deleteAppointment() {
    let appointment = this.state.selectedAppointment;

    TherapistRequest.appointmentDelete({id: appointment.node.id})
      .then((dataResult) => {
        Alert.alert('Information', 'Cancel Appointment Success');
        // this.getData();
        this.fetchAppointments()
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  cancelAppointment() {
    // this.setState({ modalTherapySession: false });

    Alert.alert(
      'Information',
      'Are you sure want to cancel this appointment ?',
      [
        {
          text: 'No',
          onPress: () => {
            this.setState({modalTherapySession: false});
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.deleteAppointment();
            this.setState({modalTherapySession: false});
          },
        },
      ],
      {cancelable: false},
    );
  }

  newAppointment() {
    if (OrientationHelper.getDeviceOrientation() == 'landscape') {
      this.setState({tabletSideScreen: 'new'});
    } else {
      this.props.navigation.navigate('AppointmentNew', {
        selectedDate: this.state.selectedDate
      });
    }
  }

  renderAppoinments() {
    let {
      showLoading,
      sessions,
      appointments,
      noSessionsDataText,
      noAppointmentDataText,
    } = this.state;
    return appointments.map((appointment, index) => {
      return (
        <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => this.setState({modalTherapySession: true, selectedAppointment: appointment})}>
          <View style={[styles.contentBox, {paddingHorizontal: 16}]}>
            <TouchableOpacity
              style={[
                Styles.row,
                {
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                },
              ]}
              onPress={() => {}}>
              <Text style={styles.textSmall}>
                {moment(appointment.node.start).format('hh:mm A')} -{' '}
                {moment(appointment.node.end).format('hh:mm A')}
              </Text>
              {/* <MaterialCommunityIcons
                                name='phone'
                                size={20}
                            /> */}
            </TouchableOpacity>
            <View style={styles.line} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 4,
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <Image
                style={styles.smallImage}
                source={require('../../../android/img/Image.png')}
              />
              <View
                style={{
                  fontFamily: 'SF Pro Text',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 19,
                  color: '#63686E',
                  paddingLeft: 10,
                }}>
                <Text style={styles.text}>
                  {appointment.node.therapist.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'SF Pro Text',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 13,
                    color: 'rgba(95, 95, 95, 0.75)',
                  }}>
                  Pediatrician
                </Text>
              </View>
            </View>
            <View
              style={[Styles.row, {alignItems: 'center', marginVertical: 4}]}>
              {/* <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                            <View style={styles.dot} /> */}
              <Text style={{fontSize: 13, flex: 1}}>
                {appointment?.node?.location?.location}
              </Text>

              <FeedbackButton
                appointment={appointment}
                onPress={() => {
                  this.props.navigation.navigate(
                    'AppointmentFeedback',
                    appointment,
                  );
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }

  renderSessions() {
    let {sessions} = this.state;
    return sessions.map((element, index) => {
      let targetEdges = element.node.targets.edges;
      // console.log("TargetEdges", targetEdges);
      let therapyList = [];
      targetEdges.forEach((targetEdge, targetIndex) => {
        let domain = 'N/A';
        if (targetEdge.node.targetId) {
          domain = targetEdge.node.targetId.domain.domain;
        }
        therapyList.push(
          <TherapyHomeMorningSessionVideoItem
            key={targetIndex}
            domainName={domain}
            targetName={targetEdge.node.targetAllcatedDetails.targetName}
            dailyTrials={targetEdge.node.targetAllcatedDetails.DailyTrials}
          />,
        );
      });
      return (
        <View style={{paddingBottom: 30}} key={index}>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.gotoSessionTargetList}>
              <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
                <Text style={styles.morningSession}>
                  {element.node.sessionName.name} Session
                </Text>
                {/* <Text style={styles.viewAll}>View All <FontAwesome5 name={'arrow-right'} style={{padding: 20, fontSize: 20, color:'#63686E'}}/></Text>         */}
              </View>
            </TouchableOpacity>
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.setState({selectedSessionIndex: index});
              }}>
              <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
                <Text style={styles.morningSession}>
                  {element.node.sessionName.name} Session
                </Text>
                {/* <Text style={styles.viewAll}>View All <FontAwesome5 name={'arrow-right'} style={{padding: 20, fontSize: 20, color:'#63686E'}}/></Text>         */}
              </View>
            </TouchableOpacity>
          )}
          <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
            <Text style={styles.minutes}>{element.node.duration}</Text>
            <View style={styles.dotSeparator}></View>
            <Text style={styles.targets}>
              {element.node.targets.edges.length} Targets
            </Text>
            <View style={styles.dotSeparator}></View>
            <Text style={styles.relative}>
              {element.node.sessionHost.edges.length > 0
                ? element.node.sessionHost.edges[0].node.relationship.name
                : ''}
            </Text>
          </View>
          <ScrollView horizontal={true}>{therapyList}</ScrollView>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <Button
              labelButton={getStr('Therapy.StartSession')}
              onPress={() =>
                this.gotoSessionPreview(element.node.sessionName.name, index)
              }
              style={{marginTop: 16}}
            />
          )}
        </View>
      );
    });
  }

  renderCurrentSession() {
    let {
      showLoading,
      sessions,
      appointments,
      noSessionsDataText,
      noAppointmentDataText,
      selectedSessionIndex,
    } = this.state;
    if (sessions.length > 1) {
      let index = 1;
      let currentSession = sessions[selectedSessionIndex];

      return (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={{paddingBottom: 30}} key={selectedSessionIndex}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.gotoSessionTargetList}>
              <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
                <Text style={styles.morningSession}>
                  {currentSession.node.sessionName.name} Session
                </Text>
                {/* <Text style={styles.viewAll}>View All <FontAwesome5 name={'arrow-right'} style={{padding: 20, fontSize: 20, color:'#63686E'}}/></Text>         */}
              </View>
            </TouchableOpacity>
            <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
              <Text style={styles.minutes}>{currentSession.node.duration}</Text>
              <View style={styles.dotSeparator}></View>
              <Text style={styles.targets}>
                {currentSession.node.targets.edges.length} Targets
              </Text>
              <View style={styles.dotSeparator}></View>
              <Text style={styles.relative}>
                {currentSession.node.sessionHost.edges.length > 0
                  ? currentSession.node.sessionHost.edges[0].node.relationship
                      .name
                  : ''}
              </Text>
            </View>
            <ScrollView horizontal={true}>
              {currentSession.node.targets.edges.map(
                (targetEdge, targetEdgeIndex) => {
                  let domain = targetEdge.node.targetId
                    ? targetEdge.node.targetId.domain.domain
                    : 'N/A';
                  return (
                    <TherapyHomeMorningSessionVideoItem
                      domainName={domain}
                      targetName={
                        targetEdge.node.targetAllcatedDetails.targetName
                      }
                      dailyTrials={
                        targetEdge.node.targetAllcatedDetails.DailyTrials
                      }
                    />
                  );
                },
              )}
            </ScrollView>
            <Button
              labelButton={getStr('Therapy.StartSession')}
              onPress={() =>
                this.gotoSessionPreview(
                  currentSession.node.sessionName.name,
                  index,
                )
              }
              style={{marginTop: 16}}
            />
          </View>
        </ScrollView>
      );
    }
  }

  render() {
    let {
      showLoading,
      sessions,
      appointments,
      noSessionsDataText,
      noAppointmentDataText,
    } = this.state;
    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
                {/* <Text style={styles.title}>{getStr('ExtraAdd.Calendar')}</Text> */}
                <Row style={{paddingTop: 30, paddingBottom: 10, alignItems: 'center'}}>
                <Column>
                  <Text style={styles.title}>Calendar</Text>
                </Column>
                <Column>
                  <TouchableOpacity
                    style={styles.header}
                    onPress={() => this.newAppointment()}>
                    <MaterialCommunityIcons
                      name="plus"
                      size={24}
                      color={Color.primary}
                    />
                  </TouchableOpacity>
                </Column>
              </Row>
                <CalendarView
                  dates={this.state.weekDates}
                  parentCallback={this.callBackFromCalendar}
                />
                {this.renderNoAppoinments()}
                {this.renderNoSessions()}
                {this.renderAppoinments()}
                {this.renderSessions()}
              </ScrollView>
              {showLoading && (
                <ActivityIndicator
                  size="large"
                  color="black"
                  style={{
                    zIndex: 9999999,
                    // backgroundColor: '#ccc',
                    opacity: 0.9,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: screenHeight,
                    justifyContent: 'center',
                  }}
                />
              )}
            </>
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <Text style={styles.title}>Calendar</Text>
              <Row style={{flex: 1}}>
                <Column style={{flex: 2}}>
                  <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <CalendarView
                      dates={this.state.weekDates}
                      parentCallback={this.callBackFromCalendar}
                    />
                    {this.renderNoAppoinments()}
                    {this.renderNoSessions()}
                    {this.renderAppoinments()}
                    {this.renderSessions()}
                  </ScrollView>
                </Column>
                <Column>
                  <Text>Today’s Agenda</Text>
                  {this.renderCurrentSession()}
                </Column>
              </Row>
            </>
          )}
        </Container>
        {this.modalTherapySession()}
      </SafeAreaView>
    );
  }
  render1() {
    let {
      showLoading,
      sessions,
      appointments,
      noSessionsDataText,
      noAppointmentDataText,
    } = this.state;
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text
            style={{
              fontFamily: 'SF Pro Text',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 34,
              color: '#45494E',
            }}>
            Calendar
          </Text>
          <CalendarView
            dates={this.state.weekDates}
            parentCallback={this.callBackFromCalendar}
          />
          {appointments.length === 0 && (
            <View
              style={{
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{width: '100%', textAlign: 'center'}}>
                {noAppointmentDataText}
              </Text>
            </View>
          )}
          {sessions.length === 0 && (
            <View
              style={{
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{width: '100%', textAlign: 'center'}}>
                {noSessionsDataText}
              </Text>
            </View>
          )}
          {this.state.appointments.map((appointment, index) => (
            <TouchableOpacity key={index} activeOpacity={0.9}>
              <View style={[styles.contentBox, {paddingHorizontal: 16}]}>
                <TouchableOpacity
                  style={[
                    Styles.row,
                    {
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 10,
                    },
                  ]}>
                  <Text style={styles.textSmall}>
                    {moment(appointment.node.start).format('hh:mm A')} -{' '}
                    {moment(appointment.node.end).format('hh:mm A')}
                  </Text>
                  {/* <MaterialCommunityIcons
                                            name='phone'
                                            size={20}
                                        /> */}
                </TouchableOpacity>
                <View style={styles.line} />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 4,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={styles.smallImage}
                    source={require('../../../android/img/Image.png')}
                  />
                  <View
                    style={{
                      fontFamily: 'SF Pro Text',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: 19,
                      color: '#63686E',
                      paddingLeft: 10,
                    }}>
                    <Text style={styles.text}>
                      {appointment.node.therapist.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'SF Pro Text',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 13,
                        color: 'rgba(95, 95, 95, 0.75)',
                      }}>
                      Pediatrician
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    Styles.row,
                    {alignItems: 'center', marginVertical: 4},
                  ]}>
                  {/* <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                                            <View style={styles.dot} /> */}
                  <Text
                    style={{
                      fontFamily: 'SF Pro Text',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: 13,
                    }}>
                    {appointment?.node?.location?.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {this.state.sessions.map((element, index) => (
            <View style={{paddingBottom: 30}} key={index}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.gotoSessionTargetList}>
                <View
                  style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
                  <Text style={styles.morningSession}>
                    {element.node.sessionName.name} Session
                  </Text>
                  {/* <Text style={styles.viewAll}>View All <FontAwesome5 name={'arrow-right'} style={{padding: 20, fontSize: 20, color:'#63686E'}}/></Text>         */}
                </View>
              </TouchableOpacity>
              <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
                <Text style={styles.minutes}>{element.node.duration}</Text>
                <View style={styles.dotSeparator}></View>
                <Text style={styles.targets}>
                  {element.node.targets.edges.length} Targets
                </Text>
                <View style={styles.dotSeparator}></View>
                <Text style={styles.relative}>
                  {element.node.sessionHost.edges.length > 0
                    ? element.node.sessionHost.edges[0].node.relationship.name
                    : ''}
                </Text>
              </View>
              <ScrollView horizontal={true}>
                {element.node.targets.edges.map(
                  (targetEdge, targetEdgeIndex) => (
                    <TherapyHomeMorningSessionVideoItem
                      domainName={targetEdge.node.targetId.domain.domain}
                      targetName={
                        targetEdge.node.targetAllcatedDetails.targetName
                      }
                      dailyTrials={
                        targetEdge.node.targetAllcatedDetails.DailyTrials
                      }
                    />
                  ),
                )}
              </ScrollView>

              <Button
                labelButton={getStr('Therapy.StartSession')}
                onPress={() =>
                  this.gotoSessionPreview(element.node.sessionName.name, index)
                }
                style={{marginTop: 16}}
              />
            </View>
          ))}
        </ScrollView>
        {showLoading && (
          <ActivityIndicator
            size="large"
            color="black"
            style={{
              zIndex: 9999999,
              // backgroundColor: '#ccc',
              opacity: 0.9,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: screenHeight,
              justifyContent: 'center',
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  scrollView: {
    backgroundColor: '#FFFFFF',
    height: screenHeight,
    // borderWidth: 1,
    // borderColor: 'red'
  },
  bookAppointment: {},
  morningSession: {
    width: '70%',
    textAlign: 'left',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#3E7BFA',
  },
  viewAll: {
    width: '30%',
    textAlign: 'right',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#63686E',
  },
  minutes: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  dotSeparator: {
    backgroundColor: '#C4C4C4',
    margin: 8,
    width: 5,
    justifyContent: 'center',
    height: 5,
    alignItems: 'center',
    borderRadius: 50,
  },
  targets: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  relative: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(95, 95, 95, 0.75)',
  },

  continueViewTouchable: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    paddingTop: 20,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  contentBox: {
    flex: 1,
    marginVertical: 12,
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
  smallImage: {
    width: 44,
    height: 44,
    borderRadius: 2,
  },
  text: {
    fontSize: 14,
  },
  textSmall: {
    fontSize: 10,
  },
  line: {
    height: 1,
    width: width / 1.2,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  header: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  studentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 0.5,
    // borderColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
    // padding: 10
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
});

const mapStateToProps = (state) => {
  console.log("state", state)
  return ({
authResult: getAuthResult(state),
authTokenPayload: getAuthTokenPayload(state),
user: state.user
});
}

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
