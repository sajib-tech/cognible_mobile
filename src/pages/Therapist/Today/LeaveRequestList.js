
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput, TouchableOpacity, RefreshControl
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';

import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload, setLeaveRequestList } from '../../../redux/actions/index';
import { client, therapistLeaveRequestList, } from '../../../constants/therapist';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import LeaveRequestNew from './LeaveRequestNew.js';
import TherapistRequest from '../../../constants/TherapistRequest.js';

class LeaveRequestList extends Component {
    constructor(props) {
        super(props)
        //set value in state for initial date
        this.state = {
            isLoading: false,
            leaveRequests: []
        }

        //save to redux for access inside LeaveRequestNew screen
        this.props.dispatchSetLeaveRequestList(this);
    }

    componentWillUnmount() {
        //remove from redux
        this.props.dispatchSetLeaveRequestList(null);
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

        TherapistRequest.getLeaveRequestList().then(leaveRequestData => {
            console.log('leaveRequestData', leaveRequestData);

            this.setState({
                isLoading: false,
                leaveRequests: leaveRequestData.data.leaveRequest.edges
            });
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
        });
    }

    newRequest() {
        this.props.navigation.navigate('LeaveRequestNew', { parent: this });
    }

    renderList() {
        let { leaveRequests } = this.state;
        return (
            <ScrollView keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this._refresh.bind(this)}
                    />
                }>
                {leaveRequests.map((leaveRequest, index) => {
                    let dateMoment = moment(leaveRequest.node.start);
                    let statusText = "";
                    let statusColor = Color.success;

                    if (leaveRequest.node.status == 0) {
                        statusText = "Pending";
                        statusColor = Color.warning;
                    } else if (leaveRequest.node.status == 1) {
                        statusText = "Approved";
                        statusColor = Color.success;
                    } else if (leaveRequest.node.status == 2) {
                        statusText = "Cancelled";
                        statusColor = Color.danger;
                    }

                    return (
                        <TouchableOpacity key={index} activeOpacity={0.9}
                            style={[Styles.row, { marginVertical: 4, marginHorizontal: 4, padding: 8, borderWidth: 0.5, borderColor: Color.gray }]}>
                            <View style={{ width: 44, height: 56, padding: 8, backgroundColor: Color.primary, borderRadius: 4, }}>
                                <Text style={{ color: Color.white, fontSize: 16, textAlign: 'center' }}>{dateMoment.format("DD")}</Text>
                                <Text style={{ color: Color.white, fontSize: 12, textAlign: 'center' }}>{dateMoment.format("MMM")}</Text>
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 8 }}>
                                <Text style={Styles.grayText}>{leaveRequest.node.description}</Text>
                                <Text style={{ color: statusColor, fontSize: 12 }}>{statusText}</Text>
                            </View>
                            <View>

                            </View>
                        </TouchableOpacity>
                    )
                })}

                {leaveRequests.length == 0 && (
                    <NoData>Leave Request Data Not Available</NoData>
                )}
            </ScrollView>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title={"Leave Request"}
                />

                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            {this.renderList()}

                            <Button
                                labelButton="Leave Request"
                                onPress={() => { this.newRequest() }}
                                isLoading={this.state.isSaving}
                                style={{ marginVertical: 10 }}
                            />
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row style={{ flex: 1 }}>
                            <Column style={{ flex: 2 }}>
                                {this.renderList()}
                            </Column>
                            <Column style={{ flex: 1 }}>
                                <LeaveRequestNew disableNavigation
                                    //faking data for parent parameter
                                    route={{ params: { parent: this } }} />
                            </Column>
                        </Row>
                    )}
                </Container>
            </SafeAreaView >
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    header: {
        flexDirection: 'row',
        height: 50,
        width: '100%',

    },
    screenTitle: {
        color: '#000',
        fontSize: 16,
        paddingLeft: 16
    }
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
    dispatchSetLeaveRequestList: (data) => dispatch(setLeaveRequestList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaveRequestList);
