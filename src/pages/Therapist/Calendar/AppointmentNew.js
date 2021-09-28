import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Text,
  TextInput as LegacyTextInput,
  Switch,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';

import {Row, Container, Column} from '../../../components/GridSystem';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import moment from 'moment';
import TherapistRequest from '../../../constants/TherapistRequest.js';
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import DateInput from '../../../components/DateInput.js';
import TextInput from '../../../components/TextInput';
import MultiPickerModal from '../../../components/MultiPickerModal';

class AppointmentNew extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      isLoading: false,
      isSaving: false,

      students: [],
      selectAppointment: [
        {id: true, label: 'Staff'},
        {id: false, label: 'Learner'},
      ],
      selectedStudent: '',

      therapistErrorMessage: '',
      statusErrorMessage: '',
      studentErrorMessage: '',
      appointmentError: '',
      titleErrorMessage: '',
      purposeErrorMessage: '',
      locationErrorMessage: '',
      noteErrorMessage: '',
      dateErrorMessage: '',
      timeErrorMessage: '',
      appoinStatus: 0,
      title: '',
      purpose: '',
      note: '',
      locations: [],
      selectedLocation: null,
      selectedrecuApp: null,
      selectedStatus: true,
      status: [
        {id: true, label: 'Canceled'},
        {id: false, label: 'Completed'},
      ],
      selectedAppoint: false,

      isRecurring: false,

      days: [
        {id: 'Sunday', label: 'Sunday'},
        {id: 'Monday', label: 'Monday'},
        {id: 'Tuesday', label: 'Tuesday'},
        {id: 'Wednesday', label: 'Wednesday'},
        {id: 'Thursday', label: 'Thursday'},
        {id: 'Friday', label: 'Friday'},
        {id: 'Saturday', label: 'Saturday'},
      ],
      selectedDays: [],

      date: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      time_start: moment().add(1, 'hours').format('HH:mm'),
      time_end: moment().add(1, 'hours').format('HH:mm'),

      showDatepicker: false,
      datepickerMode: 'date',
      timePickerType: 'start',

      isTherapistModule: true,
      staffSetId: null,
      staffattenee: [],
      staffs: [],
      selectedStaff: [],
      searchStaffs: [],
      staffValue: '',
      isStaff: true,
      statusList: [],
      selectedStatus: 'QXBwb2ludG1lbnRTdGF0dXNUeXBlOjI=',
    };

    this.studentId = null;
    this.params = this.props.route?.params;

    this.studentId = this.params?.studentId;

    this.appointment = this.params?.appointment?.node;
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    let staffSet = store.getState().user.staffSet;
    this.setState({date: this.props?.route?.params?.selectedDate});
    console.log('appoint ment date 122 appointmentnew', JSON.stringify(this.props.route.params));
    

    

    if (staffSet) {
      console.log("It's Therapist");
      this.setState({
        isTherapistModule: true,
        staffSetId: staffSet.id,
        date: this.props?.route?.params?.selectedDate,
      });
    } else {
      console.log("It's Clinic");
      this.setState({
        isTherapistModule: false,
        staffSetId: null,
        date: this.props?.route?.params?.selectedDate,
      });
    }

    //Call this on every page
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});
    TherapistRequest.getAppointmentData()
      .then((appointmentData) => {
        let locations = appointmentData.data.schoolLocation.edges.map((loc) => {
          return {
            id: loc.node.id,
            label: loc.node.location,
          };
        });

        let students = appointmentData.data.students.edges.map((student) => {
          // if(student.node.isActive) {
          let firstname = student.node.firstname;
          let lastname = student.node.lastname;
          if (firstname == null) {
            firstname = '';
          }
          if (lastname == null) {
            lastname = '';
          }

          return {
            id: student.node.id,
            label: firstname + ' ' + lastname,
            isActive: student.node.isActive,
          };
          // }
        });

        const temp = students.filter((student) => student.isActive);

        this.setState(
          {
            isLoading: false,
            locations,
            students: temp,
            selectedStudent: this.studentId ? this.studentId : '',
          },
          () => {
            //edit data
            console.log(
              'this appointment from edit page',
              JSON.stringify(this.appointment),
            );
            
            if (this.appointment) {
              this.setState({
                title: this.appointment.title,
                selectedLocation: this.appointment.location?.id,
                note: this.appointment.note,
                purpose: this.appointment.purposeAssignment,
                selectedStudent: this.appointment.student?.id,
                staffSetId: this.appointment.therapist?.id,
                selectedStatus: this.appointment.appointmentStatus?.id,
                selectedStaff: this.appointment?.attendee?.edges !== null && this.appointment?.attendee?.edges.length > 0 ? this.appointment.attendee.edges.map(
                  (attendee) => {
                    return attendee.node.id;
                  },
                ): null,
                date: moment(this.appointment.start).format('YYYY-MM-DD'),
                endDate: this.appointment.end
                  ? moment(this.appointment.end).format('YYYY-MM-DD')
                  : moment(this.appointment.start).format('YYYY-MM-DD'),
                time_start: moment(this.appointment.start).format('HH:mm'),
                time_end: moment(this.appointment.end).format('HH:mm'),
                isRecurring: false, //this.appointment.enableRecurring, => not working
                //TODO: recurring days
              });
            }
          },
        );

        TherapistRequest.getClinicStaffList()
          .then((staffData) => {
            // console.log('Staffset', staffData);

            let staffs = staffData.data.staffs.edges.map((staff) => {
              return {
                id: staff.node.id,
                label: staff.node.name,
                isActive: staff.node.isActive,
              };
            });

            const temp = staffs.filter((staff) => staff.isActive);

            this.setState({staffs: temp});
          })
          .catch((error) => {
            console.log('StaffsetErr', error);
          });

        TherapistRequest.getAppointMentStatusList()
          .then((statusData) => {
            console.log('In satus data', JSON.stringify(statusData));

            let statusList = statusData.data.appointmentStatuses.map(
              (status) => {
                return {
                  id: status.id,
                  label: status.appointmentStatus,
                };
              },
            );

            this.setState({statusList: statusList}, () => {
              console.log(
                'status list is x -->' + JSON.stringify(this.state.statusList),
              );
            });
          })
          .catch((error) => {
            console.log('StaffsetErr', error);
          });
      })
      .catch((error) => {
        Alert.alert('Error', error.toString());
        this.setState({isLoading: false, isAttendanceLoading: false});
      });
  }

  validateForm() {

    const {user: {userType}} = this.props

    let anyError = false;

    this.setState({
      appointmentError: '',
      studentErrorMessage: '',
      titleErrorMessage: '',
      purposeErrorMessage: '',
      locationErrorMessage: '',
      noteErrorMessage: '',
      dateErrorMessage: '',
      therapistErrorMessage: '',
      statusErrorMessage: '',
    });

    let today = moment().format('YYYY-MM-DD');
    let compare = moment(this.state.date);
    let endDate = moment(this.state.endDate);

    if(!this.props.route.params.isFromEdit) {
      if (moment(today).isAfter(compare)) {
        console.log(today, 'Today is after ' + this.state.date);
        this.setState({dateErrorMessage: 'Date cannot be the day before today'});
        anyError = true;
      } else {
        console.log(today, 'Today is before ' + this.state.date);
        let start = moment(this.state.date + ' ' + this.state.time_start + ':00');
        let end = moment(this.state.date + ' ' + this.state.time_end + ':00');
        let now = moment();
        if (now.isAfter(start)) {
          this.setState({timeErrorMessage: 'Time cannot be before from now'});
          anyError = true;
        } else if (start.isAfter(end)) {
          this.setState({timeErrorMessage: 'Start time must before end time'});
          anyError = true;
          //check for start must be before end
        }
      }
    }


    if (this.state.enableRecurring) {
      if (endDate.isBefore(today)) {
        this.setState({endDateErrorMessage: 'End date must be after today'});
        anyError = true;
      }

      if (endDate.isBefore(compare)) {
        this.setState({
          endDateErrorMessage: 'End date must be same or after start date',
        });
        anyError = true;
      }
    }

    if (this.state.staffSetId == null) {
      this.setState({therapistErrorMessage: 'Please select staff'});
      anyError = true;
    }

    if (this.state.selectedStatus == null) {
      this.setState({statusErrorMessage: 'Please select status'});
      anyError = true;
    }

    // if (this.state.selectedStudent == null) {
    //     this.setState({ studentErrorMessage: 'Please select Learner' });
    //     anyError = true;
    // }

    if (this.state.title == '') {
      this.setState({titleErrorMessage: 'Please fill title'});
      anyError = true;
    }

    if (this.state.purpose == '') {
      this.setState({purposeErrorMessage: 'Please fill purpose assignment'});
      anyError = true;
    }

    if (userType.name !== "parents" && this.state.selectedLocation == null) {
      this.setState({locationErrorMessage: 'Please select clinic location'});
      anyError = true;
    }

    return anyError;
  }

  saveAppointment() {

    const {user: {userType, student}} = this.props

    if (this.validateForm()) {
      return;
    }

    let date = this.state.date;
    let momentStart = moment(date + ' ' + this.state.time_start + ':00');
    let momentEnd = moment(date + ' ' + this.state.time_end + ':00');
    let start = momentStart.utc().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
    let end = momentEnd.utc().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';

    console.log('momentstart', momentStart);
    console.log('momentend', momentEnd);

    let selectStaff = [];
    {this.state.selectedStaff &&this.state.selectedStaff.length > 0 &&
      this.state.selectedStaff.map((item, i) => {
        selectStaff.push(this.state.selectedStaff[i].id);
      });
    }
    let queryString = {
      title: this.state.title,
      studentId:  userType.name === 'parents' ?  student.id: this.state.selectedStudent,
      therapistId: this.state.staffSetId,
      additionalStaff: this.state.selectedStaff,
      staffToStaff: false,
      locationId: this.state.selectedLocation,
      note: this.state.note,
      purposeAssignment: this.state.purpose,
      startDateAndTime: start,
      endDateAndTime: end,
      enableRecurring: this.state.isRecurring,
      startDate: date,
      endDate: this.state.isRecurring ? this.state.endDate : date,
      startTime: momentStart.format('hh:mm a'),
      endTime: momentEnd.format('hh:mm a'),
      selectedDays: this.state.selectedDays,
      isApproved: true,
      appointmentStatus: this.state.selectedStatus,
    };

    let promise = null;
    if (this.appointment) {
      queryString = {id: this.appointment.id, ...queryString};
      console.log(
        'Query sting for edit appointment -->' + JSON.stringify(queryString),
      );

      promise = TherapistRequest.appointmentEdit(queryString);
    } else {
      console.log(
        '>>>>>>Query sting for new appointment -->' + JSON.stringify(queryString),
      );

      promise = TherapistRequest.appointmentNew(queryString);
    }
    this.setState({isSaving: true});

    promise
      .then((dataResult) => {
        //console.log('this sis result-->'+JSON.stringify(dataResult.data));
        //console.log('Afer Appointment edit1 or save1--->' + JSON.stringify(dataResult.data))

        this.setState({
          isSaving: false,
        });
        Alert.alert('Information', 'New Appointment Submitted Successfully.');
        if (this.props.disableNavigation) {
          //refresh list screen
          let parentScreen = store.getState().calendarHome;
          if (parentScreen) {
            parentScreen._refresh();
          }
          if (this.props.refreshParent) {
            this.props.refreshParent();
          }

          this.setState({
            selectedStudent: null,
            selectedLocation: null,
            title: '',
            purpose: '',
            note: '',
          });
        } else {
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        Alert.alert('Information', error.toString());
        console.log(error, error.response);
        this.setState({isSaving: false});

        this.props.navigation.goBack();
      });
  }

  handleStaffClick = (staff) => {
    this.setState({
      selectedStaff: [...this.state.selectedStaff, staff],
      staffValue: '',
      isStaff: true,
      searchStaffs: [],
    });
  };
  handleRemoveStaff = (staff) => {
    const {selectedStaff} = this.state;
    let updatedSteps = [];
    for (let x = 0; x < selectedStaff.length; x++) {
      if (selectedStaff[x].id !== staff.id) {
        updatedSteps.push(selectedStaff[x]);
      }
    }
    this.setState({
      selectedStaff: updatedSteps,
    });
    if (this.state.selectedStaff.length == 0) {
      this.setState({isStaff: true});
    }
  };

  handleChangeStaff = (text) => {
    if (text === '' || text == ' ') {
      this.setState({
        staff: [],
      });
    } else {
      let filterData = this.state.staffs.filter((item) =>
        item.label.includes(text),
      );
      this.setState({searchStaffs: filterData});
      if (filterData.length > 0) {
        this.setState({isStaff: false});
      }
    }
  };

  render() {
    let {
      students,
      selectedStudent,
      title,
      purpose,
      locations,
      selectedLocation,
      note,
      selectedStaff,
      staffSetId,
      days,
      selectedDays,
      staffs,
      isRecurring,
      statusList,
    } = this.state;

    const {user: {userType, student}} = this.props


    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={this.appointment ? 'Edit Appointment' : 'New Appointment'}
          disabledTitle
        />

        {!this.state.isLoading && (
          <Container enablePadding={this.props.disableNavigation != true}>
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
              <Text style={styles.sectionTitle}>Basic Details</Text>

              <TextInput
                label="Title"
                error={this.state.titleErrorMessage}
                placeholder={'Title'}
                defaultValue={title}
                onChangeText={(title) => this.setState({title})}
              />
               {this.props.user.userType.name === 'parents' ? (
                <View style={styles.pickerWrapper}>
                  <Text style={{color: 'grey'}}>
                    {this.props.user.student.firstname}
                  </Text>
                </View>
              ) : (
                <PickerModal
                  label="Learner"
                  placeholder="Select Learner"
                  selectedValue={selectedStudent}
                  data={students}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedStudent: itemValue});
                  }}
                />
              )}

              <PickerModal
                label="Therapist"
                placeholder="Select Therapist"
                selectedValue={staffSetId}
                error={this.state.therapistErrorMessage}
                data={staffs}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({staffSetId: itemValue});
                }}
              />

             {userType.name !== 'parents' && <><MultiPickerModal
                label="Additional Therapist"
                data={staffs}
                value={selectedStaff || []}
                onSelect={(selectedStaff) => {
                  this.setState({selectedStaff});
                }}
              />

              <PickerModal
                label="Status"
                placeholder="Select Status"
                selectedValue={this.state.selectedStatus}
                error={this.state.statusErrorMessage}
                data={statusList}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedStatus: itemValue});
                }}
              /></>}

              <Text style={styles.sectionTitle}>Date & Time</Text>

              <>
                <DateInput
                  label="Date"
                  error={this.state.dateErrorMessage}
                  format="YYYY-MM-DD"
                  displayFormat="dddd, DD MMM YYYY"
                  value={this.state.date}
                  onChange={(date) => {
                    this.setState({date});
                  }}
                />
              </>

              <Text style={Styles.grayText}>Start & End Time</Text>
              {this.state.timeErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.timeErrorMessage}
                </Text>
              )}
              <Row>
                <Column>
                  <DateInput
                    format="HH:mm"
                    mode="time"
                    displayFormat="hh:mm A"
                    value={this.state.time_start}
                    onChange={(time_start) => {
                      this.setState({time_start});
                    }}
                  />
                </Column>
                <Column>
                  <DateInput
                    format="HH:mm"
                    mode="time"
                    displayFormat="hh:mm A"
                    value={this.state.time_end}
                    onChange={(time_end) => {
                      this.setState({time_end});
                    }}
                  />
                </Column>
              </Row>

              <Row style={{marginVertical: 10}}>
                <Column style={{flex: 0, marginRight: 10}}>
                  <Switch
                    trackColor={{false: Color.gray, true: Color.primary}}
                    thumbColor={
                      this.state.isRecurring ? Color.white : Color.white
                    }
                    // ios_backgroundColor={Color.primary}
                    onValueChange={() => {
                      this.setState({isRecurring: !this.state.isRecurring});
                    }}
                    value={this.state.isRecurring}
                  />
                </Column>
                <Column>
                  <Text style={{paddingTop: 6}}>Repeats</Text>
                </Column>
              </Row>

              {isRecurring && (
                <>
                  <DateInput
                    label="End Date"
                    error={this.state.endDateErrorMessage}
                    format="YYYY-MM-DD"
                    displayFormat="dddd, DD MMM YYYY"
                    value={this.state.endDate}
                    onChange={(date) => {
                      this.setState({endDate: date});
                    }}
                  />

                  <MultiPickerModal
                    label="Choose Days to Repeat"
                    data={days}
                    value={selectedDays}
                    onSelect={(selectedDays) => {
                      this.setState({selectedDays});
                    }}
                  />
                </>
              )}

              <Text style={styles.sectionTitle}>Misc Details</Text>

              {userType.name !== "parents" && <PickerModal
                label="Location"
                placeholder="Select Location"
                error={this.state.locationErrorMessage}
                selectedValue={selectedLocation}
                data={locations}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedLocation: itemValue});
                }}
              />}

              <TextInput
                label="Appointment Reason"
                error={this.state.purposeErrorMessage}
                placeholder={'Purpose'}
                defaultValue={purpose}
                onChangeText={(purpose) => this.setState({purpose})}
              />

              <TextInput
                label="Notes"
                placeholder={'Notes'}
                defaultValue={note}
                onChangeText={(note) => this.setState({note})}
              />
            </ScrollView>
            <Button
              labelButton={
                this.appointment ? 'Edit Appointment' : 'Save Appointment'
              }
              onPress={() => this.saveAppointment()}
              isLoading={this.state.isSaving}
              style={{marginVertical: 10}}
            />
          </Container>
        )}
        {this.state.isLoading && <LoadingIndicator />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    fontWeight: 'bold',
    paddingTop: 10,
    color: '#45494E',
  },

  TextStyle: {
    marginTop: 24,
    marginBottom: 16,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
  input: {
    marginVertical: 10,
    padding: 6,
    borderRadius: 6,
    borderColor: Color.gray,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  input1: {
    marginTop: 10,
    marginBottom: 10,

    fontSize: 15,
    fontStyle: 'normal',

    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },

  backIconText1: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#63686E',
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 20,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginTop: 500,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  text1: {
    marginLeft: 10,
    marginRight: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.primary,
    marginTop: 10,
    marginBottom: 5,
  },
  pickerWrapper: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 4,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
    backgroundColor: Color.grayWhite,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentNew);
