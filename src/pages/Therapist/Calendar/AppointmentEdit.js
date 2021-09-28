
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Alert,
    Text, TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleSwitch from 'toggle-switch-react-native';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';

import { Row, Container, Column } from '../../../components/GridSystem';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import TherapistRequest from '../../../constants/TherapistRequest.js';
import DateInput from '../../../components/DateInput.js';
import TextInput from '../../../components/TextInput';

class AppointmentEdit extends Component {
    constructor(props) {
        super(props)
        //set value in state for initial date
        this.state = {
            isLoading: false,
            isSaving: false,

            students: [],
            selectedStudent: null,

            title: '',
            purpose: '',
            note: '',
            locations: [],
            selectedLocation: null,

            date: moment().format("YYYY-MM-DD"),
            time_start: "08:00",
            time_end: "17:00",

            showDatepicker: false,
            datepickerMode: 'date',
            timePickerType: 'start',
            selectedStatus: true,
            status: [{ id: true, label: "Canceled" }, { id: false, label: "Completed" }],
            id: '',
            studentError: '',
        }
    }

    _refresh() {
        this.componentDidMount()
    }

    componentDidMount() {
        this.refreshForm();

        //Call this on every page
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getData();
    }

    refreshForm() {
        let appointment = this.props.route.params;
        console.log('Params Data', appointment);

        this.setState({
            selectedStudent: appointment ?.node ?.student ?.id,
            selectedLocation: appointment ?.node ?.location ?.id,
            title: appointment.node.title,
            purpose: appointment.node.purposeAssignment,
            note: appointment.node.note,
            date: moment(appointment.node.start).format("YYYY-MM-DD"),
            time_start: moment(appointment.node.start).format("HH:mm"),
            time_end: moment(appointment.node.end).format("HH:mm"),
            id: appointment.node.id,

        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.route.params.node.id != this.props.route.params.node.id) {
            this.refreshForm();
        }
    }

    getData() {
        this.setState({ isLoading: true });
        TherapistRequest.getAppointmentData().then(appointmentData => {
            console.log('Data', appointmentData);

            let locations = appointmentData.data.schoolLocation.edges.map((loc) => {
                return {
                    id: loc.node.id,
                    label: loc.node.location
                };
            })

            let students = appointmentData.data.students.edges.map((student) => {
                return {
                    id: student ?.node ?.id,
                    label: student.node.firstname + ' ' + student.node.lastname
                };
            });

            this.setState({
                isLoading: false,
                locations,
                students
            });
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false, isAttendanceLoading: false });
        });
    }

    validasiForm() {
        let anyError = false;

        this.setState({
            studentError: '',
        });


        if (this.state.selectedStudent == null) {
            this.setState({ studentError: 'Please select Student' });
            anyError = true;
        }


        return anyError;
    }

    saveAppointment() {

        if (this.validasiForm()) {
            return;
        }
        let date = this.state.date;
        if (moment(date + " " + this.state.time_start + ":00").isAfter(moment(date + " " + this.state.time_end + ":00"))) {
            Alert.alert("Warning", "Start time cannot higher than end time");
            return;
        }

        let start = moment(date + " " + this.state.time_start + ":00").utc().format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
        let end = moment(date + " " + this.state.time_end + ":00").utc().format("YYYY-MM-DDTHH:mm:ss") + ".000Z";

        // let therapist_id = store.getState().user.staffSet.id;

        let queryString = {
            // therapist: therapist_id,
            student: this.state.selectedStudent,
            location: this.state.selectedLocation,
            title: this.state.title,
            purposeAssignment: this.state.purpose,
            note: this.state.note,
            start: start,
            end: end,
            isApproved: this.state.selectedStatus,
            id: this.state.id
        };
        console.log("lalalalaalalalalal edit -->", JSON.stringify(queryString));
        // return;

        this.setState({ isSaving: true });

        TherapistRequest.appointmentEdit(queryString).then(dataResult => {
            console.log("dataResult after edit"+JSON.stringify(dataResult));
            this.setState({
                isSaving: false,
            });

            if (this.props.disableNavigation) {

                Alert.alert('Information', 'Update Appointment Success.');
                if (this.props.refreshParent) {
                    this.props.refreshParent();
                }

                this.setState({
                    selectedStudent: null,
                    selectedLocation: null,
                    title: '',
                    purpose: '',
                    note: ''
                })
            } else {
                this.props.navigation.goBack();
            }

            //refresh list screen
            let parentScreen = store.getState().calendarHome;
            if (parentScreen) {
                parentScreen._refresh();
            }
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isSaving: false });

            Alert.alert('Information', error);
        });
    }

    render() {
        let { students, selectedStudent, title, purpose, date,
            showDatepicker, timePickerType, selectedStatus, status, time_start, time_end, locations, selectedLocation, note } = this.state

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title={"Edit Appointment"}
                    disabledTitle
                />

                {!this.state.isLoading && (
                    <Container enablePadding={this.props.disableNavigation != true}>
                        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isLoading}
                                    onRefresh={this._refresh.bind(this)}
                                />
                            }
                        >
                            <TextInputit 
                                label='Title'
                                placeholder={'Title'}
                                defaultValue={title}
                                onChangeText={(title) => this.setState({ title })}
                            />

                            <TextInput
                                label='Appointment Reason'
                                placeholder={'Purpose'}
                                defaultValue={purpose}
                                onChangeText={(purpose) => this.setState({ purpose })}
                            />

                            <PickerModal
                                label='Learner'
                                placeholder="Select Learner"
                                selectedValue={selectedStudent}
                                error={this.state.studentError}
                                data={students}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ selectedStudent: itemValue });
                                }}
                            />

                            <DateInput
                                label='Date'
                                format='YYYY-MM-DD'
                                displayFormat='dddd, DD MMM YYYY'
                                value={this.state.date}
                                onChange={(date) => {
                                    this.setState({ date });
                                }} />

                            <Text style={Styles.grayText}>Start & End Time</Text>
                            <Row>
                                <Column>
                                    <DateInput
                                        format='HH:mm'
                                        mode='time'
                                        displayFormat='hh:mm A'
                                        value={this.state.time_start}
                                        onChange={(time_start) => {
                                            this.setState({ time_start });
                                        }} />
                                </Column>
                                <Column>
                                    <DateInput
                                        format='HH:mm'
                                        mode='time'
                                        displayFormat='hh:mm A'
                                        value={this.state.time_end}
                                        onChange={(time_end) => {
                                            this.setState({ time_end });
                                        }} />
                                </Column>
                            </Row>

                            <PickerModal
                                label="Clinic Location"
                                selectedValue={selectedLocation}
                                data={locations}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ selectedLocation: itemValue });
                                }}
                            />

                            <PickerModal
                                label='Status'
                                placeholder="Select Status"
                                selectedValue={selectedStatus}
                                data={status}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ selectedStatus: itemValue });
                                }}
                            />

                            <TextInput
                                label='Private Notes'
                                placeholder={'Private Notes'}
                                defaultValue={note}
                                onChangeText={(note) => this.setState({ note })}
                            />

                        </ScrollView>
                        <Button
                            labelButton="Save Appointment"
                            onPress={() => this.saveAppointment()}
                            isLoading={this.state.isSaving}
                            style={{ marginVertical: 10 }}
                        />
                    </Container>
                )}

                {this.state.isLoading && <ActivityIndicator color={Color.primary} />}
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
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
        paddingTop: 15
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 22,
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#45494E'
    },

    TextStyle: {
        marginTop: 24,
        marginBottom: 16,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
    input: {
        marginVertical: 10,
        padding: 6,
        borderRadius: 6,
        borderColor: Color.gray,
        borderWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 16
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
        flexDirection: 'row', paddingLeft: 15
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
        borderColor: '#fff'
    },
    continueView: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        marginTop: 500

    },
    continueViewText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
    text1: {
        marginLeft: 10, marginRight: 19
    }

});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentEdit);
