
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Alert,
    Text, TouchableOpacity, RefreshControl
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';

import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import { Row, Container, Column } from '../../../components/GridSystem';
import moment from 'moment';
import TherapistRequest from '../../../constants/TherapistRequest.js';
import store from '../../../redux/store/index.js';
import DateInput from '../../../components/DateInput.js';
import TextInput from '../../../components/TextInput';

class WorkLogNew extends Component {
    constructor(props) {
        super(props)
        //set value in state for initial date
        this.state = {
            isLoading: false,
            isSaving: false,

            titleErrorMessage: '',
            locationErrorMessage: '',
            notesErrorMessage: '',

            date: moment().format("YYYY-MM-DD"),
            title: '',
            time: [],
            time_start: "08:00",
            time_end: "17:00",
            geolocations: [],
            geolocations_selected: null,
            notes: '',
        }

        console.log(this.props.disableNavigation);
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

        TherapistRequest.getLocationList().then(locationListData => {
            console.log('locationListData', locationListData);

            let geolocations = locationListData.data.schoolLocation.edges.map((loc) => {
                return {
                    id: loc.node.id,
                    label: loc.node.location
                };
            })

            this.setState({
                isLoading: false,
                geolocations
            });
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
        });
    }

    validateForm() {
        let anyError = false;

        this.setState({
            titleErrorMessage: '',
            locationErrorMessage: '',
            notesErrorMessage: '',
        });

        if (this.state.title == '') {
            this.setState({ titleErrorMessage: 'Please fill title' });
            anyError = true;
        }

        if (this.state.geolocations_selected == null) {
            this.setState({ locationErrorMessage: 'Please choose location' });
            anyError = true;
        }

        if (this.state.notes == '') {
            this.setState({ notesErrorMessage: 'Please fill note' });
            anyError = true;
        }

        return anyError;
    }

    submitWorkLog() {
        if (this.validateForm()) {
            return;
        }

        //YYYY-MM-DDTHH:mm:ssZ
        let date = this.state.date;
        let start = moment(date + " " + this.state.time_start + ":00").utc().format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
        let end = moment(date + " " + this.state.time_end + ":00").utc().format("YYYY-MM-DDTHH:mm:ss") + ".000Z";

        let queryString = {
            title: this.state.title,
            location: this.state.geolocations_selected,
            start: start,
            end: end,
            note: this.state.notes,
            isApproved: true,
            isBillable: true
        };
        console.log(queryString);

        this.setState({ isSaving: true });

        TherapistRequest.worklogNew(queryString).then(dataResult => {
            console.log(dataResult);
            this.setState({
                isSaving: false
            });

            if (this.props.disableNavigation) {
                Alert.alert('Information', 'Submit Work Log Success.');

                this.setState({
                    title: '',
                    note: '',
                    geolocations_selected: null,
                })

            } else {
                this.props.navigation.goBack();
            }

            //refresh list screen
            let parentScreen = store.getState().worklogList;
            if (parentScreen) {
                parentScreen._refresh();
            }
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isSaving: false });

            Alert.alert('Information', error.toString());
        });
    }

    render() {
        let { title, geolocations, geolocations_selected, notes } = this.state

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title={"New Work Log"}
                />

                <Container enablePadding={this.props.disableNavigation != true}>

                    <ScrollView keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior="automatic"
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this._refresh.bind(this)}
                            />
                        }>

                        <View style={Styles.column}>

                            <TextInput
                                label="Title"
                                error={this.state.titleErrorMessage}
                                placeholder={'Title'}
                                value={title}
                                onChangeText={(title) => this.setState({ title })}
                            />

                            <Text style={Styles.grayText}>Date</Text>
                            <DateInput
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
                                label="Geolocation"
                                error={this.state.locationErrorMessage}
                                iconLeft={'map-marker'}
                                placeholder='Select Geolocation'
                                selectedValue={geolocations_selected}
                                data={geolocations}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ geolocations_selected: itemValue });
                                }}
                            />

                            <Text style={Styles.grayText}>Notes</Text>
                            {this.state.notesErrorMessage != '' && <Text style={{ color: Color.danger }}>{this.state.notesErrorMessage}</Text>}
                            <TextInput style={styles.input}
                                multiline={true}
                                placeholder={'Notes'}
                                defaultValue={notes}
                                onChangeText={(notes) => this.setState({ notes })}
                            />

                        </View>
                    </ScrollView>

                    <Button
                        labelButton="Submit Work Log"
                        onPress={() => this.submitWorkLog()}
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
        borderColor: '#DCDCDC',
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row'
    },


});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkLogNew);
