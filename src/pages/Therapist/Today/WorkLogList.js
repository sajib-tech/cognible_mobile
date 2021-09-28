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
    TouchableOpacity, Modal,
} from 'react-native';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import CalendarView from '../../../components/CalendarView';
import DateHelper from '../../../helpers/DateHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TimelineView from '../../../components/TimelineView';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';

import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload, setWorklogList } from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import WorkLogNew from './WorkLogNew';
import TherapistRequest from '../../../constants/TherapistRequest';

const width = Dimensions.get('window').width

class WorkLogList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            weekDates: DateHelper.getCurrentWeekDates(),
            selectedDate: moment().format("YYYY-MM-DD"),
            appointments: [],
            timesheets: []
        }
        //save to redux for access inside LeaveRequestNew screen
        this.props.dispatchSetWorklogList(this);
    }

    componentWillUnmount() {
        //remove from redux
        this.props.dispatchSetWorklogList(null);
    }

    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        //Call this on every page
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getData();
    }

    getData() {
        this.setState({ isLoading: true });

        console.log("Fetching ", this.state.selectedDate);

        TherapistRequest.getWorklogList({ date: this.state.selectedDate }).then(dataResult => {
            console.log('Appointment', dataResult.data.timesheet.edges.length, dataResult.data.upcoming_appointment.edges.length);
            console.log(dataResult);

            this.setState({
                isLoading: false,
                appointments: dataResult.data.upcoming_appointment.edges,
                timesheets: dataResult.data.timesheet.edges
            });
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isLoading: false });
        });
    }

    callBackFromCalendar(selectedDate) {
        console.log(selectedDate);
        this.setState({ selectedDate }, () => {
            this.getData();
        });
    }

    renderList() {
        return (
            <>
                <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._refresh.bind(this)}
                        />
                    }
                >
                    {(this.state.appointments.length == 0 && this.state.timesheets.length == 0) && (
                        <NoData>No Data Available</NoData>
                    )}

                    {this.state.appointments.map((appointment, key) => {
                        return (
                            <View style={[styles.contentBox, { paddingHorizontal: 16 }]}>
                                <Text style={styles.textBig}>{appointment.node.title}</Text>
                                <Text style={styles.textSmall}>{appointment?.node?.location?.location}</Text>
                                <TimelineView
                                    dotColor={Color.activeBlueDot}
                                    dotColor2={Color.noActiveBlueDot}
                                    textColor={Color.blackFont}
                                    texts={[
                                        moment(appointment.node.start).format("hh:mm A"),
                                        moment(appointment.node.end).format("hh:mm A"),
                                    ]} />
                            </View>
                        );
                    })}

                    {this.state.timesheets.map((timesheet, key) => {
                        return (
                            <View style={[styles.contentBox, { paddingHorizontal: 16 }]} key={key}>
                                <Text style={styles.textBig}>{timesheet.node.title}</Text>
                                <Text style={styles.textSmall}>{timesheet.node.location.location}</Text>
                                <TimelineView
                                    dotColor={Color.activeBlueDot}
                                    dotColor2={Color.noActiveBlueDot}
                                    textColor={Color.blackFont}
                                    texts={[
                                        moment(timesheet.node.start).format("hh:mm A"),
                                        moment(timesheet.node.end).format("hh:mm A"),
                                    ]} />
                            </View>
                        );
                    })}

                </ScrollView>
            </>
        )
    }

    render() {
        let { dataPerDay } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="Work Done"
                    backPress={() => this.props.navigation.goBack()}
                    dotsPress={() => {
                        this.props.navigation.navigate('LeaveRequestList')
                    }}
                    materialCommunityIconsName={'calendar-today'}
                />

                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <Text style={styles.title}>Calendar</Text>
                            <CalendarView dates={this.state.weekDates} parentCallback={(date) => this.callBackFromCalendar(date)} />
                            <View style={[styles.line, { marginVertical: 10 }]} />

                            {this.renderList()}

                            <Button
                                labelButton="Log Work"
                                onPress={() => this.props.navigation.navigate('WorkLogNew')}
                                style={{ marginVertical: 10 }}
                            />
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <>
                            <Row style={{ flex: 1 }}>
                                <Column style={{ flex: 2 }}>
                                    <Text style={styles.title}>Calendar</Text>
                                    <CalendarView dates={this.state.weekDates} parentCallback={(date) => this.callBackFromCalendar(date)} />

                                    <View style={[styles.line, { marginVertical: 16, marginTop: 24 }]} />

                                    {this.renderList()}
                                </Column>
                                <Column>
                                    <WorkLogNew disableNavigation />
                                </Column>
                            </Row>
                        </>
                    )}
                </Container>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    headerImage: {
        width: width / 12, height: width / 12,
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    smallImage: {
        width: width / 15, height: width / 15, borderRadius: 2,
    },
    row: {
        flex: 1, flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    contentBox: {
        flex: 1, marginVertical: 12, marginHorizontal: 2, paddingVertical: 8, borderRadius: 8,
        backgroundColor: Color.white,
        shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
    },
    title: {
        fontSize: 28, fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
    },
    textBig: {
        fontSize: 16
    },
    textSmall: {
        fontSize: 10,
    },
    studentItem: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center',
        // borderBottomWidth: 0.5,
        // borderColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 8,
        // padding: 10
    },
    studentSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
    studentImage: {
        width: width / 10, height: width / 10,
        borderRadius: 4
    },
    line: {
        height: 1, width: '100%', backgroundColor: Color.silver,
    },
    dot: {
        height: width / 55, width: width / 55, backgroundColor: Color.silver, borderRadius: width / 55,
        marginHorizontal: 8
    },

});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
    dispatchSetWorklogList: (data) => dispatch(setWorklogList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkLogList);
