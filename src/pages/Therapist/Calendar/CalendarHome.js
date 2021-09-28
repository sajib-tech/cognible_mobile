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
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import Color from '../../../utility/Color.js';
import Styles from '../../../utility/Style.js';
import CalendarView from '../../../components/CalendarView';
import DateHelper from '../../../helpers/DateHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button.js';

import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setCalendarHome,
} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import _ from 'lodash';
import ImageHelper from '../../../helpers/ImageHelper.js';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import AppointmentNew from './AppointmentNew.js';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest.js';
import AppointmentEdit from './AppointmentEdit.js';
import FeedbackButton from '../../../components/FeedbackButton.js';
import AppointmentCard from '../../../components/AppointmentCard.js';

const width = Dimensions.get('window').width;
class CalendarHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,

      selectedDate: moment().format('YYYY-MM-DD'),
      appointments: [],
      selectedAppointment: null,

      modalConsultantShow: false,
      modalTherapySession: false,
      weekDates: DateHelper.getCurrentWeekDates(),
      dataPerDay: [
        {id: 0, time: '10 AM'},
        {id: 1, time: '11 AM'},
        {id: 2, time: '12 AM'},
      ],
      students: [
        {
          id: 0,
          name: 'Kshitiz Umar',
          image: require('../../../../android/img/Image.png'),
          newCount: '',
          status: 'Student',
        },
        {
          id: 0,
          name: 'Nathan Fox',
          image: require('../../../../android/img/Image.png'),
          newCount: '2',
          status: 'Pediatrician(You)',
        },
      ],
      private_notes: '',

      tabletSideScreen: 'today',
    };
    //save to redux for access inside LeaveRequestNew screen
    this.props.dispatchSetCalendarHome(this);
  }

  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetCalendarHome(null);
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {

		console.error("props calendarhome 101", this.props)
    //Call this on every page
    this.props.navigation.addListener('focus', () => {
      TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
      this.getData();
    });
  }

  getData() {
    this.setState({isLoading: true});
    TherapistRequest.getCalendarList({date: this.state.selectedDate})
      .then((dataResult) => {
        console.log(
          'Data result in calender home -->' + JSON.stringify(dataResult),
        );
        let appointments = {};

        let rawAppointments = dataResult.data.upcoming_appointment.edges;
        rawAppointments = _.orderBy(rawAppointments, ['node.start'], ['asc']);

        rawAppointments.forEach((appointment, key) => {
          let startHour = moment(appointment.node.start).format('hh A') + '';

          if (appointments.hasOwnProperty(startHour) == false) {
            appointments[startHour] = [];
          }

          appointments[startHour].push(appointment);
          console.log('pushed appointments -->' + JSON.stringify(appointments));
        });

        this.setState({
          isLoading: false,
          appointments,
        });
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  modalTherapySession() {
    let appointment = this.state.selectedAppointment;
    return (
      <Modal
        animationType="slide"
        transparent={true}
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

              <TouchableOpacity
                onPress={() => {
                  if (appointment.node.student.mobileno) {
                    if (
                      Linking.canOpenURL(
                        'tel:' + appointment.node.student.mobileno,
                      )
                    ) {
                      Linking.openURL(
                        'tel:' + appointment.node.student.mobileno,
                      );
                    } else {
                      Alert.alert(
                        'Information',
                        "Sorry, your device can't make a phone call",
                      );
                    }
                  }
                }}
                style={styles.studentItem}>
                <Image
                  style={styles.studentImage}
                  source={{
                    uri: ImageHelper.getImage(
                      appointment?.node?.student?.image,
                    ),
                  }}
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
                      {appointment.node?.student?.firstname}{' '}
                      {appointment.node?.student?.lastname}
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
              </TouchableOpacity>

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

  changeAppointment() {
    this.setState({modalConsultantShow: false});
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
        this.getData();
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

  callBackFromCalendar(selectedDate) {
    this.setState({selectedDate}, () => {
      this.getData();
    });
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

  closeAppointment() {
    this.setState({tabletSideScreen: 'today'});
  }

  renderToday() {
    return (
      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
          Today's Agenda
        </Text>
        <Text style={{fontSize: 16, marginBottom: 10}}>Morning Session</Text>

        <View
          activeOpacity={0.9}
          style={[
            styles.contentBoxTablet,
            {width: '100%', marginHorizontal: 0},
          ]}>
          <Image
            style={styles.contentBoxImage}
            source={require('../../../../android/img/Image.png')}
          />
          <Text style={styles.contentBoxTitle}>Appointment Title</Text>
          <Text style={styles.contentBoxSubtitle}>Purpose Assignment</Text>
          <Text style={styles.contentBoxLocation}>
            <MaterialCommunityIcons
              name="map-marker"
              size={15}
              color={Color.primary}
            />
            Location
          </Text>
        </View>

        <Button
          labelButton="Start Session"
          onPress={() => {
            Alert.alert('Information', 'This Feature Not Implemented Yet');
          }}
          style={{marginVertical: 10}}
        />
      </View>
    );
  }

  renderList() {
    let {appointments} = this.state;

    if (OrientationHelper.getDeviceOrientation() == 'portrait') {
      return (
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
          {Object.keys(appointments).map((hour, index) => {
            return (
              <>
                <Text style={Styles.smallGrayText} key={hour}>
                  {hour}
                </Text>
                {appointments[hour].map((appointment, idx) => {
                  return (
                    <AppointmentCard
                      key={idx}
                      appointment={appointment}
                      onPress={() => {
                        this.setState({
                          selectedAppointment: appointment,
                          modalTherapySession: true,
                        });
                      }}
                      onFeedbackPress={() => {
                        this.props.navigation.navigate(
                          'AppointmentFeedback',
                          appointment,
                        );
                      }}
                    />
                  );
                })}
                <View style={{height: 14}} />
              </>
            );
          })}

          {Object.keys(appointments).length == 0 && (
            <NoData>No Data Available on This Date</NoData>
          )}
        </ScrollView>
      );
    } else {
      return (
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
          {Object.keys(appointments).map((hour, index) => {
            return (
              <>
                <Text style={Styles.smallGrayText} key={hour}>
                  {hour}
                </Text>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  contentInsetAdjustmentBehavior="automatic">
                  {appointments[hour].map((appointment, idx) => {
                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.9}
                        style={styles.contentBoxTablet}
                        onPress={() =>
                          this.setState({
                            selectedAppointment: appointment,
                            modalTherapySession: true,
                          })
                        }>
                        <Image
                          style={styles.contentBoxImage}
                          source={require('../../../../android/img/Image.png')}
                        />
                        <Text style={styles.contentBoxTitle}>
                          {appointment.node.title}
                        </Text>
                        <Text style={styles.contentBoxSubtitle}>
                          {appointment.node.purposeAssignment}
                        </Text>
                        <Text style={styles.contentBoxLocation}>
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={15}
                            color={Color.primary}
                          />
                          {appointment?.node?.location?.location}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            );
          })}

          {Object.keys(appointments).length == 0 && (
            <NoData>No Data Available on This Day</NoData>
          )}
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          {this.modalTherapySession()}

          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              <Row style={{paddingTop: 30, paddingBottom: 10}}>
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
                parentCallback={(date) => this.callBackFromCalendar(date)}
              />

              <View
                style={[styles.line, {marginVertical: 16, marginTop: 24}]}
              />

              {this.renderList()}
            </>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <Row style={{paddingTop: 30, paddingBottom: 10}}>
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
              <Row style={{flex: 1}}>
                <Column style={{flex: 2}}>
                  <CalendarView
                    dates={this.state.weekDates}
                    parentCallback={(date) => this.callBackFromCalendar(date)}
                  />

                  <View
                    style={[styles.line, {marginVertical: 16, marginTop: 24}]}
                  />

                  {this.renderList()}
                </Column>
                <Column>
                  {/* {this.state.tabletSideScreen == 'today' && this.renderToday()} */}
                  {this.state.tabletSideScreen == 'new' && (
                    <>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            flex: 1,
                            color: '#000',
                            fontSize: 16,
                            marginBottom: 5,
                          }}>
                          New Appointment
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.closeAppointment()}>
                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={Color.blackFont}
                          />
                        </TouchableOpacity>
                      </View>
                      <AppointmentNew
                        disableNavigation
                        refreshParent={() => {
                          this.closeAppointment();
                          this.callBackFromCalendar(this.state.selectedDate);
                        }}
                      />
                    </>
                  )}
                  {this.state.tabletSideScreen == 'edit' && (
                    <>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            flex: 1,
                            color: '#000',
                            fontSize: 16,
                            marginBottom: 5,
                          }}>
                          Edit Appointment
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.closeAppointment()}>
                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={Color.blackFont}
                          />
                        </TouchableOpacity>
                      </View>
                      <AppointmentNew
                        disableNavigation
                        refreshParent={() => {
                          this.closeAppointment();
                          this.callBackFromCalendar(this.state.selectedDate);
                        }}
                        route={{
                          params: {appointment: this.state.selectedAppointment},
                        }}
                      />
                    </>
                  )}
                </Column>
              </Row>
            </>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  headerImage: {
    width: width / 12,
    height: width / 12,
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
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
  contentBoxTablet: {
    marginVertical: 12,
    marginHorizontal: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    width: 300,
  },
  contentBoxImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  contentBoxTitle: {
    fontSize: 17,
    color: '#344356',
    marginBottom: 5,
  },
  contentBoxSubtitle: {
    fontSize: 14,
    color: '#808080',
  },
  contentBoxLocation: {
    fontSize: 14,
    color: Color.primary,
    marginTop: 5,
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
    color: '#000',
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 10,
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
  line: {
    height: 1,
    width: width / 1.2,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  dot: {
    height: 4,
    width: 4,
    backgroundColor: Color.silver,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  screenTitle: {
    color: '#000',
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
  dispatchSetCalendarHome: (data) => dispatch(setCalendarHome(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHome);
