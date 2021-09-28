
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Alert,
    Text, TextInput, TouchableOpacity, RefreshControl
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleSwitch from 'toggle-switch-react-native';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader.js';


import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult, getLeaveRequestList } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import { Row, Container, Column } from '../../../components/GridSystem';
import DateRangePicker from '../../../components/DateRangePicker.js';
import TherapistRequest from '../../../constants/TherapistRequest.js';
import DateInput from '../../../components/DateInput.js';

class LeaveRequestNew extends Component {
    constructor(props) {
        super(props)
        //set value in state for initial date
        this.state = {
            isLoading: false,
            isSaving: false,

            dates: [],
            start_date: moment(),
            end_date: moment(),
            displayedDate: moment(),
            description: '',

            descriptionErrorMessage: ''
        }
    }

    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        //Call this on every page
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    }

    requestLeave() {
        if (this.state.description == '') {
            this.setState({ descriptionErrorMessage: 'Please fill description' });
            return;
        }

        let queryString = {
            start: this.state.start_date.format("YYYY-MM-DD"),
            end: this.state.end_date.format("YYYY-MM-DD"),
            description: this.state.description,
        };

        console.log(queryString);

        this.setState({ isSaving: true });

        TherapistRequest.leaveRequestNew(queryString).then(leaveResult => {
            console.log('leaveResult', leaveResult);

            this.setState({
                isSaving: false,
            });

            Alert.alert('Information', 'Leave Request Submitted Successfully.');

            if (this.props.disableNavigation) {
                this.setState({
                    description: '',
                })
            } else {
                this.props.navigation.goBack();
            }

            //refresh list request
            let parentScreen = this.props.route.params.parent;
            console.log('parentScreen', parentScreen);
            setTimeout(() => {
                if (parentScreen) {
                    parentScreen.getData();
                }
            }, 2000);
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isSaving: false });

            Alert.alert('Information', error.toString());
        });
    }

    render() {
        let { displayedDate, start_date, end_date, description } = this.state

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title={"Leave Request"}
                />

                <Container enablePadding={this.props.disableNavigation != true}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this._refresh.bind(this)}
                            />
                        }
                    >
                        <Text style={[Styles.grayText, { marginVertical: 8 }]}>Start &amp; End Date</Text>

                        {/* <DateRangePicker
                            backdropStyle={{ width: '100%', height: '100%' }}
                            onChange={(data) => {
                                console.log(data);
                                if (data.startDate) {
                                    this.setState({ start_date: data.startDate });
                                }
                                if (data.endDate) {
                                    this.setState({ end_date: data.endDate });
                                }
                            }}
                            endDate={end_date}
                            startDate={start_date}
                            displayedDate={displayedDate}
                            range
                        >
                            <View style={[Styles.rowCenter, { justifyContent: 'flex-start', borderRadius: 4, borderColor: Color.gray, borderWidth: 1, padding: 8 }]}>
                                <MaterialCommunityIcons
                                    name='calendar'
                                    size={24}
                                    color={Color.grayFill}
                                />
                                <Text style={[Styles.grayText, { paddingHorizontal: 8 }]}>{moment(start_date).format('ddd, DD MMM YYYY') + " - " + moment(end_date).format('ddd, DD MMM YYYY')}</Text>
                            </View>
                        </DateRangePicker> */}

                        <Row>
                            <Column>
                                <DateInput
                                    format='YYYY-MM-DD'
                                    displayFormat='DD MMM YYYY'
                                    value={this.state.start_date}
                                    onChange={(start_date) => {
                                        this.setState({ start_date });
                                    }} />
                            </Column>
                            <Column>
                                <DateInput
                                    format='YYYY-MM-DD'
                                    displayFormat='DD MMM YYYY'
                                    value={this.state.end_date}
                                    onChange={(end_date) => {
                                        this.setState({ end_date });
                                    }} />
                            </Column>
                        </Row>

                        <View style={{ height: 10 }}></View>

                        <Text style={Styles.grayText}>Description</Text>
                        {this.state.descriptionErrorMessage != '' && <Text style={{ color: Color.danger }}>{this.state.descriptionErrorMessage}</Text>}
                        <TextInput style={[Styles.input, { height: 80, }]}
                            multiline={true}
                            placeholder={'Description'}
                            defaultValue={description}
                            onChangeText={(description) => this.setState({ description })}
                        />
                    </ScrollView>
                    <Button
                        labelButton="Submit Leave Request"
                        onPress={() => this.requestLeave()}
                        isLoading={this.state.isSaving}
                        style={{ marginVertical: 10 }}
                    />
                </Container>
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
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaveRequestNew);
