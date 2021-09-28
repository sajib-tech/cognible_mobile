import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    Alert, RefreshControl,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchInput, { createFilter } from 'react-native-search-filter';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';

const KEYS_TO_FILTERS = ['name', 'subject'];

import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import CalendarHeader from '../../../components/CalendarHeader';
import TimelineView from '../../../components/TimelineView';

import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import DateHelper from '../../../helpers/DateHelper';
import moment from 'moment';
import _ from 'lodash';
import ImageHelper from '../../../helpers/ImageHelper.js';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import store from '../../../redux/store/index.js';
import ClinicRequest from '../../../constants/ClinicRequest';
import { ActivityIndicator } from 'react-native';

const width = Dimensions.get('window').width;


class ClinicStaffDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            weekDates: DateHelper.getCurrentWeekDates(),

            staff: this.props.route.params,

            menu: [
                { id: 0, title: 'Timesheets', page: 'Timesheets' },
                { id: 1, title: 'Attendance', page: 'Attendance' },
                { id: 2, title: 'Appointments', page: 'Appointments' },
            ],

            isLoadingTimesheet: false,
            isLoadingAttendance: false,
            isLoadingAppointment: false,

            leaveRequests: [],
            timesheets: [],
            attendances: [],
            appointments: [],

            timesheetDate: moment().format("YYYY-MM-DD"),
            appointmentDate: moment().format("YYYY-MM-DD"),
            attendanceDate: moment().format("YYYY-MM-DD"),

            tabSelected: 0,
            isApproveLeave: false,
        }
    }

    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);

        this.getTimesheet();
        this.getAttendance();
        this.getAppointment();
    }

    getTimesheet() {
        this.setState({ isLoadingTimesheet: true });

        console.log("getTimesheet");

        let vars = {
            date: this.state.timesheetDate,
            staffId: this.state.staff.node.id
        };

        ClinicRequest.getEmployeeTimesheet(vars).then((result) => {
            console.log('getEmployeeTimesheet', result);
            this.setState({
                isLoadingTimesheet: false,
                timesheets: result.data.timesheets.edges
            });
        }).catch((error) => {
            console.log("getTimesheet Err", error);
            this.setState({ isLoadingTimesheet: false });
            //Alert.alert("Information", error.toString());
        })
    }

    getAttendance() {
        this.setState({ isLoadingAttendance: true });

        console.log("getAttendance");

        let vars = {
            staffId: this.state.staff.node.id,
            date: this.state.attendanceDate,
        };

        ClinicRequest.getEmployeeAttendance(vars).then((result) => {
            console.log('getEmployeeAttendance', result);

            this.setState({
                isLoadingAttendance: false,
                attendances: result.data.attendances.edges,
                leaveRequests: result.data.leaveRequest.edges
            });
        }).catch((error) => {
            console.log("getAttendance Err", error);
            this.setState({ isLoadingAttendance: false });
            //Alert.alert("Information", error.toString());
        })
    }

    getAppointment() {
        this.setState({ isLoadingAppointment: true });

        console.log("getAppointment");

        let vars = {
            date: this.state.appointmentDate,
            staffId: this.state.staff.node.id
        };

        ClinicRequest.getEmployeeAppointment(vars).then((result) => {
            console.log('getEmployeeAppointment', result);
            this.setState({
                isLoadingAppointment: false,
                appointments: result.data.appointments.edges
            });
        }).catch((error) => {
            console.log("getAppointment Err", error);
            this.setState({ isLoadingAppointment: false });
            //Alert.alert("Information", error.toString());
        })
    }

    onSelectTimesheet(timesheetDate) {
        console.log("onSelectTimesheet", timesheetDate);
        this.setState({ timesheetDate }, () => {
            this.getTimesheet();
        });
    }

    onSelectAppointment(appointmentDate) {
        this.setState({ appointmentDate }, () => {
            this.getAppointment();
        });
    }

    onSelectAttendance(attendanceDate) {
        this.setState({ attendanceDate }, () => {
            this.getAttendance();
        });
    }

    approveRequest(id, status) {
        Alert.alert(
            'Information',
            status == 1 ? 'Are you sure want to Approve this Leave ?' : 'Are you sure want to Reject this Leave ?',
            [
                { text: 'No', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        this.setState({ isApproveLeave: true });

                        let vars = {
                            id: id,
                            status: status
                        };

                        ClinicRequest.approveLeaveRequest(vars).then((result) => {
                            console.log('approveLeaveRequest', result);
                            this.setState({
                                isApproveLeave: false
                            });

                            this.getAttendance();

                        }).catch((error) => {
                            console.log("getAppointment Err", error);
                            this.setState({ isApproveLeave: false });
                            //Alert.alert("Information", error.toString());
                        })
                    }
                },
            ],
            { cancelable: false }
        );
    }

    renderProfile() {
        let staff = this.state.staff;

        return (
            <>
                <View style={styles.employeeItem}>
                    <View style={styles.employeeImageWrapper}>
                        <Image style={styles.employeeImage} source={{ uri: ImageHelper.getImage(staff.node.image) }} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center' }}>
                        <Text style={styles.textBig}>{staff.node.name}</Text>
                        {staff.node.userRole && <Text style={styles.employeeSubject}>{staff.node.userRole.name}</Text>}
                    </View>
                </View>

            </>
        );
    }

    renderTabMenu() {
        let { menu, tabSelected } = this.state
        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    {menu.map((menu, index) => {
                        return (
                            <TouchableOpacity onPress={() => this.changePage(menu)} key={index}>
                                <Text style={[styles.tabMenuText, { color: tabSelected != menu.id ? Color.grayFill : Color.primary }]}>{menu.title}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

            </>
        );
    }

    changePage(menu) {
        this.setState({ tabSelected: menu.id })
    }

    renderPageTimesheet() {
        let { timesheets } = this.state
        return (
            <>
                <CalendarHeader selectedValue={this.state.timesheetDate} parentCallback={(date) => this.onSelectTimesheet(date)} />

                {this.state.isLoadingTimesheet && (
                    <View style={{ alignItems: 'center' }}>
                        <ActivityIndicator color={Color.primary} size='large' />
                    </View>
                )}

                {this.state.isLoadingTimesheet == false && (
                    <>
                        {timesheets.map((timesheet, key) => {
                            return (
                                <View key={key} style={[styles.contentBox, { paddingHorizontal: 16, marginVertical: 8 }]}>
                                    <Text style={styles.textBig}>{timesheet.node.title}</Text>
                                    <Text style={styles.textSmall}>{timesheet.node.location.location}</Text>
                                    <TimelineView
                                        dotColor={Color.blueFill}
                                        dotColor2={Color.noActiveBlueDot}
                                        textColor={Color.blackFont}
                                        texts={[
                                            moment(timesheet.node.start).format("hh:mm A"),
                                            moment(timesheet.node.end).format("hh:mm A"),
                                        ]} />
                                </View>
                            );
                        })}

                        {timesheets.length == 0 && (
                            <NoData>No Timesheet on Selected Date</NoData>
                        )}
                    </>
                )}
            </>
        );
    }

    renderPageAttendance() {
        let { attendances, leaveRequests } = this.state;

        return (
            <>
                <CalendarHeader selectedValue={this.state.attendanceDate} parentCallback={(date) => this.onSelectAttendance(date)} />

                {this.state.isLoadingAttendance && (
                    <View style={{ alignItems: 'center' }}>
                        <ActivityIndicator color={Color.primary} size='large' />
                    </View>
                )}

                {this.state.isLoadingAttendance == false && (
                    <>
                        {leaveRequests.map((leaveRequest, key) => {
                            let time = moment(leaveRequest.node.start).format("MMM DD") + " - " +
                                moment(leaveRequest.node.end).format("MMM DD");
                            let status = null;
                            if (leaveRequest.node.status == 0) {
                                status = <Text style={[styles.textSmall, { color: Color.warning }]}>Pending</Text>
                            } else if (leaveRequest.node.status == 1) {
                                status = <Text style={[styles.textSmall, { color: Color.success }]}>Approved</Text>
                            } else if (leaveRequest.node.status == 1) {
                                status = <Text style={[styles.textSmall, { color: Color.danger }]}>Cancelled</Text>
                            }
                            return (
                                <View style={styles.card} key={'lr' + key}>
                                    <Text style={styles.textBig}>{leaveRequest.node.description}</Text>
                                    <View style={[Styles.row, { alignItems: 'center', marginBottom: 8 }]}>
                                        <Text style={styles.textSmall}>{time}</Text>
                                        <View style={styles.dot} />
                                        <Text style={[styles.textSmall, { color: Color.warning }]}>{status}</Text>
                                    </View>
                                    {/* <Text style={[styles.textSmall, { color: Color.blackOpacity }]}>{'description description description description description description description description'}</Text> */}
                                    {leaveRequest.node.status == 0 &&
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Button
                                                    labelButton="Approve Request"
                                                    onPress={() => { this.approveRequest(leaveRequest.node.id, 1) }}
                                                // isLoading={this.state.isApproveLeave}
                                                />
                                            </View>
                                            <View style={{ width: 10 }} />
                                            <View style={{ flex: 1 }}>
                                                <Button
                                                    labelButton="Reject Request"
                                                    theme="secondary"
                                                    onPress={() => { this.approveRequest(leaveRequest.node.id, 1) }}
                                                // isLoading={this.state.isApproveLeave}
                                                />
                                            </View>
                                        </View>
                                    }
                                </View>
                            );
                        })}


                        {attendances.map((attendance, key) => {
                            return (
                                <View key={key} style={[styles.contentBox, { paddingHorizontal: 16, marginVertical: 8 }]}>
                                    <Text style={styles.textBig}>{moment(attendance.node.checkIn).format("MMM DD")}</Text>
                                    <Text style={styles.textSmall}>{attendance.node.checkInLocation}</Text>
                                    <TimelineView
                                        dotColor={Color.blueFill}
                                        dotColor2={Color.noActiveBlueDot}
                                        textColor={Color.blackFont}
                                        texts={[
                                            moment(attendance.node.checkIn).format("hh:mm A"),
                                            attendance.node.checkOut ? moment(attendance.node.checkOut).format("hh:mm A") : "__:__",
                                        ]} />
                                </View>
                            );
                        })}

                        {attendances.length == 0 && (
                            <NoData>No Attendance on Selected Date</NoData>
                        )}
                    </>
                )}
            </>
        );
    }

    renderPageAppointments() {
        let { appointments } = this.state
        return (
            <>
                <CalendarHeader selectedValue={this.state.appointmentDate} parentCallback={(date) => this.onSelectAppointment(date)} />

                {this.state.isLoadingAppointment && (
                    <View style={{ alignItems: 'center' }}>
                        <ActivityIndicator color={Color.primary} size='large' />
                    </View>
                )}

                {this.state.isLoadingAppointment == false && (
                    <>
                        {appointments.map((appointment, key) => {
                            return (
                                <View style={[styles.contentBox, { paddingHorizontal: 16, marginVertical: 8 }]} key={key}>
                                    <TouchableOpacity style={[styles.row, { alignItems: 'center' }]} onPress={() => {

                                    }}>
                                        <Text style={[styles.textSmall, { flex: 1 }]}>{moment(appointment.node.start).format("hh:mm A")} - {moment(appointment.node.end).format("hh:mm a")}</Text>
                                        {/* {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                                                <View style={styles.dot} />
                                                <Text style={[styles.textSmall, {}]}>{appointment.node.location.location}</Text>
                                            </View>
                                        )} */}
                                        {/* <MaterialCommunityIcons
                                            name='phone'
                                            size={18}
                                        /> */}
                                    </TouchableOpacity>
                                    <View style={styles.line} />

                                    <View style={[styles.row, { alignItems: 'center', marginVertical: 4 }]}>
                                        <Image style={styles.smallImage} source={require('../../../../android/img/Image.png')} />
                                        <View style={{ marginHorizontal: 8 }}>
                                            <Text style={styles.text}>{appointment.node.student.firstname}</Text>
                                            <Text style={[styles.textSmall, { color: Color.grayFont }]}>{appointment.node.title}</Text>
                                        </View>
                                    </View>
                                    {/* {OrientationHelper.getDeviceOrientation() == 'portrait' && ( */}
                                    <View style={[styles.row, { alignItems: 'center', marginVertical: 4 }]}>
                                        <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                                        <View style={styles.dot} />
                                        <Text style={[styles.textSmall, {}]}>{appointment?.node?.location?.location}</Text>
                                    </View>
                                    {/* )} */}
                                </View>
                            );
                        })}

                        {appointments.length == 0 && (
                            <NoData>No Appointment on Selected Date</NoData>
                        )}
                    </>
                )}
            </>
        );
    }

    render() {
        let { tabSelected } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title={"Employee Profile"}
                    disabledTitle={true}
                />

                <Container enablePadding={this.props.disableNavigation != true}>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            {this.renderProfile()}

                            {this.renderTabMenu()}

                            <ScrollView keyboardShouldPersistTaps='handled'
                                showsVerticalScrollIndicator={false}
                                contentInsetAdjustmentBehavior="automatic"
                            >
                                {tabSelected == 0 && this.renderPageTimesheet()}
                                {tabSelected == 1 && this.renderPageAttendance()}
                                {tabSelected == 2 && this.renderPageAppointments()}
                            </ScrollView>
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row>
                            <Column>
                                {this.renderProfile()}

                                {this.renderTabMenu()}

                                <ScrollView keyboardShouldPersistTaps='handled'
                                    showsVerticalScrollIndicator={false}
                                    contentInsetAdjustmentBehavior="automatic">
                                    {tabSelected == 0 && this.renderPageTimesheet()}
                                    {tabSelected == 1 && this.renderPageAttendance()}
                                    {tabSelected == 2 && this.renderPageAppointments()}
                                </ScrollView>
                            </Column>
                        </Row>
                    )}
                </Container>
            </SafeAreaView >
        )
    }
}
const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    recentImage: {
        width: width / 11, height: width / 11,
        borderRadius: 20
    },
    employeeImageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        backgroundColor: '#fff'
    },
    employeeImage: {
        width: 60,
        height: 60,
        borderRadius: 8
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 3,
        marginTop: 5,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 5
    },
    contentBox: {
        backgroundColor: 'white',
        marginHorizontal: 3,
        marginTop: 5,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 5
    },
    smallImage: {
        width: width / 15, height: width / 15, borderRadius: 2,
    },
    bigImage: {
        width: width / 3, height: width / 3.3,
        resizeMode: 'contain',
        // backgroundColor: 'red'
    },
    row: {
        flex: 1, flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    recentBox: {
        marginHorizontal: 8, height: 60, alignItems: 'center'
    },
    title: {
        fontSize: 28, fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
    },
    textBig: {
        fontSize: 16,
        color: '#000'
    },
    textSmall: {
        fontSize: 10,
    },
    newCount: {
        backgroundColor: Color.primary, padding: 2,
        width: 16, height: 16, borderRadius: 4, justifyContent: 'center'
    },
    textCount: {
        color: Color.white, fontSize: 10, textAlign: 'center'
    }
    ,
    buttonStart: {
        flex: 1, backgroundColor: Color.primary, borderRadius: 8,
        alignItems: 'center', paddingVertical: 12
    },
    buttonStartText: {
        color: Color.white
    },
    buttonEnd: {
        flex: 1, borderColor: Color.primary, borderWidth: 1, borderRadius: 8,
        alignItems: 'center', paddingVertical: 12
    },
    buttonEndText: {
        color: Color.primary
    },
    line: {
        height: 1, width: width / 1.2, backgroundColor: Color.silver,
        marginVertical: 4
    },
    dot: {
        height: 4, width: 4, backgroundColor: Color.silver, borderRadius: 2,
        marginHorizontal: 8
    },
    employeeItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingBottom: 20
    },
    employeeSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
    tabMenuText: {
        fontSize: 14,
        fontWeight: 'bold',
    }
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClinicStaffDetail);
