import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback, RefreshControl,
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
import ImageHelper from '../../../helpers/ImageHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import DateHelper from '../../../helpers/DateHelper';
import CalendarHeader from '../../../components/CalendarHeader';
import NoData from '../../../components/NoData';
import TimelineView from '../../../components/TimelineView';
import moment from 'moment';
const width = Dimensions.get('window').width
class EmployeeProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            weekDates: DateHelper.getCurrentWeekDates(),
            menu: [
                { id: 0, title: 'Timesheets', page: 'Timesheets' },
                { id: 1, title: 'Attendance', page: 'Attendance' },
                { id: 2, title: 'Appointments', page: 'Appointments' },
            ],
            TimesheetsData: [
                { node: { title: 'Consultation Appointment', location: { location: 'Athena Health, Kurmangala' }, start: new Date(), end: new Date() } },
                { node: { title: 'Consultation Appointment', location: { location: 'Athena Health, Kurmangala' }, start: new Date(), end: new Date() } },
            ],
            AttendanceData: [
                { node: { title: 'March 31', location: { location: 'Athena Health, Kurmangala' }, start: new Date(), end: new Date() } },
                { node: { title: 'March 30', location: { location: 'Athena Health, Kurmangala' }, start: new Date(), end: new Date() } },
            ],
            AppointmentsData: [
                { node: { purposeAssignment: 'Consultation', student: { firstname: 'Isha chaturvedi', lastname: '' }, title: 'Consultation Appointment', location: { location: 'Athena Health, Kurmangala' }, start: new Date(), end: new Date() } },
                { node: { purposeAssignment: 'Consultation', student: { firstname: 'Isha chaturvedi', lastname: '' }, title: 'Consultation Appointment', location: { location: 'Athena Health, Kurmangala' }, start: new Date(), end: new Date() } },
            ],
            tabSelected: 0
        }
    }
    _refresh() {

    }
    componentDidMount() {

    }
    searchUpdated(term) {
        this.setState({ searchEmployee: term })
    }
    employeeDetail() {

    }
    callBackFromCalendar = (selectedDateFromCalendar) => {
        console.log(selectedDateFromCalendar);
    }


    renderProfile() {
        let empployee = this.props.route.params;

        return (
            <>
                <TouchableOpacity onPress={() => this.employeeDetail()} style={styles.employeeItem}>
                    <Image style={styles.employeeImage} source={{ uri: '' }} />
                    <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center' }}>
                        <Text style={styles.textBig}>Kshizits Kumar</Text>
                        <Text style={styles.employeeSubject}>Kormangala bangaluru</Text>
                    </View>
                </TouchableOpacity>

            </>
        );
    }
    renderTabMenu() {
        let { menu, tabSelected } = this.state
        return (
            <>
                <View style={[Styles.rowBetween, { paddingHorizontal: 16 }]}>
                    {menu.map((menu, index) => {
                        return (
                            <TouchableOpacity onPress={() => this.changePage(menu)} style={{ flex: 1 }} key={index}>
                                <Text style={[Styles.primaryText, { color: tabSelected != menu.id ? Color.grayFill : Color.primary }]}>{menu.title}</Text>
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
    callBackFromCalendar(selectedDate) {
        console.log(selectedDate);
        // this.setState({ selectedDate }, () => {
        //     this.getData();
        // });
    }
    renderPageTimesheet() {
        let { weekDates, TimesheetsData } = this.state
        return (
            <>
                <CalendarHeader dates={weekDates} parentCallback={(date) => this.callBackFromCalendar(date)} />
                {TimesheetsData != null && TimesheetsData.length > 0 && TimesheetsData.map((timesheet, key) => {

                    return (
                        <View key={key} style={[styles.contentBox, { paddingHorizontal: 16, marginVertical: 8 }]}>
                            <Text style={styles.textBig}>{timesheet.node.title}</Text>
                            <Text style={styles.textSmall}>{timesheet.node.location.location}</Text>
                            <TimelineView
                                dotColor={Color.blueFill}
                                dotColor2={Color.noActiveBlueDot}
                                textColor={Color.blackFont}
                                texts={[
                                    moment(timesheet.node.start).format("HH:mm A"),
                                    moment(timesheet.node.end).format("HH:mm A"),
                                ]} />
                        </View>
                    );
                })}
                {TimesheetsData.length == 0 && (
                    <NoData>No Upcoming Timesheets</NoData>
                )}

            </>
        );
    }

    renderPageAttendance() {
        let { AttendanceData } = this.state
        return (
            <>
                <Container style={{ marginTop: 16, marginHorizontal: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Color.grayWhite }}>
                    <Text style={styles.textBig}>{'Leave Requested'}</Text>
                    <View style={[Styles.row, { alignItems: 'center', marginBottom: 8 }]}>
                        <Text style={styles.textSmall}>{'March 21 - April 4'}</Text>
                        <View style={styles.dot} />
                        <Text style={[styles.textSmall, { color: Color.warning }]}>{'Pending'}</Text>
                    </View>
                    <Text style={[styles.textSmall, { color: Color.blackOpacity }]}>{'description description description description description description description description'}</Text>
                    <Button
                        labelButton="Approve Request"
                        onPress={() => { this.props.navigation.navigate('LeaveRequestNew') }}
                        isLoading={this.state.isLoading}
                        textStyle={{ color: Color.blueFill }}
                        style={{ marginVertical: 10, backgroundColor: Color.white, borderColor: Color.blueFill, borderWidth: 1 }}
                    />
                </Container>
                {AttendanceData != null && AttendanceData.length > 0 && AttendanceData.map((timesheet, key) => {

                    return (
                        <View key={key} style={[styles.contentBox, { paddingHorizontal: 16, marginVertical: 8 }]}>
                            <Text style={styles.textBig}>{timesheet.node.title}</Text>
                            <Text style={styles.textSmall}>{timesheet.node.location.location}</Text>
                            <TimelineView
                                dotColor={Color.blueFill}
                                dotColor2={Color.noActiveBlueDot}
                                textColor={Color.blackFont}
                                texts={[
                                    moment(timesheet.node.start).format("HH:mm A"),
                                    moment(timesheet.node.end).format("HH:mm A"),
                                ]} />
                        </View>
                    );
                })}
                {AttendanceData.length == 0 && (
                    <NoData>No Upcoming Attendance</NoData>
                )}
            </>
        );
    }
    renderPageAppointments() {
        let { weekDates, AppointmentsData } = this.state
        return (
            <>
                <CalendarHeader dates={weekDates} parentCallback={(date) => this.callBackFromCalendar(date)} />
                {AppointmentsData != null && AppointmentsData.length > 0 && AppointmentsData.map((appointment, key) => {
                    return (
                        <View style={[styles.contentBox, { paddingHorizontal: 16, marginVertical: 8 }]} key={key}>
                            <TouchableOpacity style={[styles.row, { alignItems: 'center' }]}>
                                <Text style={[styles.textSmall, { flex: 1 }]}>{moment(appointment.node.start).format("HH:mm")} - {moment(appointment.node.start).format("HH:mm a")}</Text>
                                {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                        <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                                        <View style={styles.dot} />
                                        <Text style={[styles.textSmall, {}]}>{appointment?.node?.location?.location}</Text>
                                    </View>
                                )}
                                <MaterialCommunityIcons
                                    name='phone'
                                    size={18}
                                />
                            </TouchableOpacity>
                            <View style={styles.line} />

                            <View style={[styles.row, { alignItems: 'center', marginVertical: 4 }]}>
                                <Image style={styles.smallImage} source={require('../../../../android/img/Image.png')} />
                                <View style={{ marginHorizontal: 8 }}>
                                    <Text style={styles.text}>{appointment.node.student.firstname}</Text>
                                    <Text style={[styles.textSmall, { color: Color.grayFont }]}>{appointment.node.title}</Text>
                                </View>
                            </View>
                            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                                <View style={[styles.row, { alignItems: 'center', marginVertical: 4 }]}>
                                    <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                                    <View style={styles.dot} />
                                    <Text style={[styles.textSmall, {}]}>{appointment?.node?.location?.location}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
                {AppointmentsData.length == 0 && (
                    <NoData>No Upcoming Appointments</NoData>
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

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isLoading}
                                    onRefresh={this._refresh.bind(this)}
                                />
                            }
                        >
                            {this.renderProfile()}
                            {this.renderTabMenu()}
                            {tabSelected == 0 && this.renderPageTimesheet()}
                            {tabSelected == 1 && this.renderPageAttendance()}
                            {tabSelected == 2 && this.renderPageAppointments()}
                        </ScrollView>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row>
                            <Column>
                                <ScrollView keyboardShouldPersistTaps='always'
                                    showsVerticalScrollIndicator={false}
                                    contentInsetAdjustmentBehavior="automatic">
                                    {this.renderProfile()}
                                </ScrollView>
                            </Column>

                            <Column>
                                <ScrollView keyboardShouldPersistTaps='always'
                                    showsVerticalScrollIndicator={false}
                                    contentInsetAdjustmentBehavior="automatic">
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
    employeeImage: {
        width: 60,
        height: 60,
        borderRadius: 8
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
        height: width / 55, width: width / 55, backgroundColor: Color.silver, borderRadius: width / 55,
        marginHorizontal: 8
    },
    employeeItem: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center',
        paddingBottom: 10
    },
    employeeSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
});
export default EmployeeProfile;
