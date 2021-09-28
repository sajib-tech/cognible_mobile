import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput, ActivityIndicator,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.firstname', 'node.lastname'];
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import { therapistGetLongTermGoals } from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';
import Button from '../../../components/Button.js';

const width = Dimensions.get('window').width
const screenHeight = Dimensions.get("window").height;

class BehaviouralNewPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            student: {},
            program: {},
            isLoading: false,
            showLoading: false,
            goalTitle: '',
            goalDescription: '',
            startDate: moment().toDate(),
            endDate: moment().toDate(),
            minimumDate: moment().toDate(),
            isStartDateSelected: false,
            showStartDatepicker: false,
            showEndDatepicker: false,
            assessments: [],
            selectedAssessment: '',


            responsibilities: [],
            selectedResponsibility: null,

            goalStatus: [],
            selectedStatus: null,

            titleErrorMessage: '',
            statusErrorMessage: '',
            responsibilityErrorMessage: '',
            descriptionErrorMessage: '',
        }
    }
    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        let student = this.props.route.params.student;
        let program = this.props.route.params.program;
        console.log("=====================" + JSON.stringify(program));
        this.setState({ student: student, program: program });
        //Call this on every page
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getResponsibilityData();
        this.getAssessmentData();
        this.getStatusData();
    }
    getResponsibilityData() {
        this.setState({ isLoading: true });

        TherapistRequest.getGoalResponsibility().then(responsibilityData => {
            console.log('responsibilityData', JSON.stringify(responsibilityData));
            let respList = responsibilityData.data.goalResponsibility.map((goal) => {
                return {
                    id: goal.id,
                    label: goal.name
                };
            })
            console.log(respList);
            this.setState({ responsibilities: respList });
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
        });
    }
    getStatusData() {
        this.setState({ isLoading: true });

        TherapistRequest.getGoalStatus().then(goalStatusData => {
            console.log('goalStatusData', JSON.stringify(goalStatusData));
            let statusList = goalStatusData.data.goalStatus.map((goal) => {
                return {
                    id: goal.id,
                    label: goal.status
                };
            })
            console.log(statusList);
            this.setState({ goalStatus: statusList });
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
        });
    }
    getAssessmentData() {
        this.setState({ isLoading: true });

        TherapistRequest.getGoalAssessment().then(goalAssessmentData => {
            console.log('goalAssessmentData', JSON.stringify(goalAssessmentData));
            let assessments = goalAssessmentData.data.goalsAssessment.map((res) => {
                return {
                    id: res.id,
                    label: res.name
                };
            })
            console.log(assessments);
            this.setState({ assessments: assessments });
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
        });
    }

    validateForm() {
        let anyError = false;

        this.setState({
            titleErrorMessage: '',
            statusErrorMessage: '',
            responsibilityErrorMessage: '',
            descriptionErrorMessage: '',
        });

        if (this.state.goalTitle == '') {
            this.setState({ titleErrorMessage: 'Please fill title' });
            anyError = true;
        }

        if (this.state.selectedStatus == null) {
            this.setState({ statusErrorMessage: 'Please choose status' });
            anyError = true;
        }

        if (this.state.selectedResponsibility == null) {
            this.setState({ responsibilityErrorMessage: 'Please choose responsibiity' });
            anyError = true;
        }

        if (this.state.goalDescription == '') {
            this.setState({ descriptionErrorMessage: 'Please fill description' });
            anyError = true;
        }

        return anyError;
    }

    addNewGoal() {
        if (this.validateForm()) {
            return;
        }

        this.setState({ showLoading: true });
        let { student, program } = this.state;
        let queryString = {
            student: this.state.student.node.id,
            goalName: this.state.goalTitle,
            description: this.state.goalDescription,
            dateInitialted: moment(this.state.startDate).format("YYYY-MM-DD"),
            dateEnd: moment(this.state.endDate).format("YYYY-MM-DD"),
            programArea: this.state.program.id,
            responsibility: this.state.selectedResponsibility,
            goalStatus: this.state.selectedStatus
        };

        console.log(queryString);
        let refetchQueries = [];
        refetchQueries.push({
            query: therapistGetLongTermGoals,
            variables: {
                student: this.state.student.node.id,
                program: this.state.program.id
            },
            fetchPolicy: 'network-only'
        });
        console.log(refetchQueries);
        TherapistRequest.createLongTerm(queryString, refetchQueries).then(longTerm => {
            console.log('longTerm', JSON.stringify(longTerm));
            this.setState({ showLoading: false });
            if (longTerm.data.createLongTerm.details.id) {
                //refresh list request
                let parentScreen = store.getState().longTermsGoals;
                if (parentScreen) {
                    parentScreen._refresh();
                }
                Alert.alert(
                    'Behavioral Assessments',
                    "Successfully Added",
                    [{
                        text: 'OK', onPress: () => {
                            console.log('OK Pressed');
                            if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                                this.props.navigation.goBack();
                            } else {
                                this.setState({
                                    goalTitle: '',
                                    goalDescription: '',
                                })
                            }
                        }
                    }],
                    { cancelable: false }
                );
            }
        }).catch(error => {
            this.setState({ showLoading: false });
            console.log(error, error.response);
            this.setState({ isSaving: false });

            Alert.alert('Information', error.toString());
        });
    }
    render() {
        let {
            goalTitle, goalDescription, showStartDatepicker, showEndDatepicker, startDate, endDate, minimumDate, isStartDateSelected, goalStatus, assessments, responsibilities
        } = this.state

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="Behavioral Assessments"
                    enable={this.props.disableNavigation != true}
                />
                <Container enablePadding={this.props.disableNavigation != true}>
                    <ScrollView keyboardShouldPersistTaps='handled'
                                showsVerticalScrollIndicator={false}
                                contentInsetAdjustmentBehavior="automatic"
                    >


                                {/* <PickerModal
                            label="Assessment"
                            iconLeft='folder-open'
                            // selectedValue={selectedCategory}
                            data={assessments}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedAssessment: itemValue });
                            }}
                        /> */}

                                <PickerModal
                                    label="What behavior are challenging to you and bobby "
                                    error={this.state.statusErrorMessage}
                                    iconLeft='folder-open'
                                    // selectedValue={selectedCategory}
                                    data={goalStatus}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectedStatus: itemValue });
                                    }}
                                />
                                <PickerModal
                                    label="select one behavior to focus"
                                    error={this.state.responsibilityErrorMessage}
                                    iconLeft='folder-open'
                                    // selectedValue={selectedCategory}
                                    data={responsibilities}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectedResponsibility: itemValue });
                                    }}
                                />
                        <PickerModal
                            label="frequency of the behavior in a day "
                            error={this.state.statusErrorMessage}
                            iconLeft='folder-open'
                            // selectedValue={selectedCategory}
                            data={goalStatus}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedStatus: itemValue });
                            }}
                        />
                        <PickerModal
                            label="why did you select the behavior "
                            error={this.state.responsibilityErrorMessage}
                            iconLeft='folder-open'
                            // selectedValue={selectedCategory}
                            data={responsibilities}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedResponsibility: itemValue });
                            }}
                        />

                    </ScrollView>
                    <Button labelButton='Start Behavioral Assessments'
                            style={{ marginBottom: 10 }}
                            loading={this.state.showLoading}
                            onPress={() => {
                                this.addNewGoal();
                            }} />
                </Container>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end',
    },
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    continueViewTouchable: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#1E90FF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fff'
    },
    continueView: {
        width: '100%',
        position: 'absolute',
        bottom: 20
    },
    continueViewText: {
        color: '#fff',
        fontSize: 17,
        textAlign: 'center',
    }
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BehaviouralNewPage);
