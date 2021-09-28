import React, { Component } from 'react';

import { Dimensions, Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProgressCircle from 'react-native-progress-circle'
import store from '../../redux/store';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import moment from 'moment';
import ParentRequest from '../../constants/ParentRequest';

import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class UserProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            student: {},
            headerTitle: "",
            therapyGoals: {},
            therapyLongTermGoalsCount: 0,
            therapyShortTermGoalsCount: 0,
            longTermMastered: 0,
            shortTermMastered: 0,
        };
    }
    componentDidMount() {
        let student = store.getState().user.student;
        // store.getState().user.student.firstname
        let linkText = student.firstname + " Program"
        this.setState({ student: student, headerTitle: linkText })
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.fetchLongTermGoals();
    }
    fetchLongTermGoals() {
        let { route } = this.props;
        console.log(JSON.stringify(route));
        if (route.params && route.params.therapyId) {
            this.setState({ isLoading: true });
            let id = route.params.therapyId;
            let variables = {
                student: store.getState().studentId,
                program: id
            };
            console.log("------------------------------" + JSON.stringify(variables))
            ParentRequest.fetchGoalsData(variables).then(goalsData => {
                // console.log("goalsData: "+JSON.stringify(goalsData));
                this.setState({ isLoading: false });
                this.setState({ therapyGoals: goalsData.data.programDetails });
                this.processGoals(goalsData.data.programDetails.longtermgoalSet);
            }).catch(error => {
                console.log("Error: " + JSON.stringify(error));
                this.setState({ isLoading: false });
            });
        }
    }
    processGoals(goalSet) {
        if (goalSet && goalSet.edges && goalSet.edges.length > 0) {
            console.log("Long term goals:" + goalSet.edges.length);
            this.setState({ therapyLongTermGoalsCount: goalSet.edges.length });
            let shortTermGoalsCount = 0;
            let longTermMasterdCount = 0;
            let longTermGoals = goalSet.edges;
            let longTermGoalsLength = longTermGoals.length;
            for (let i = 0; i < longTermGoalsLength; i++) {
                let goal = longTermGoals[i].node;
                if (this.isLongTermGoalMastered(goal)) {
                    longTermMasterdCount = longTermMasterdCount + 1;
                }
                if (goal.shorttermgoalSet && goal.shorttermgoalSet.edges && goal.shorttermgoalSet.edges.length > 0) {
                    shortTermGoalsCount = shortTermGoalsCount + goal.shorttermgoalSet.edges.length;
                }
            }
            console.log("short term goals:" + shortTermGoalsCount);
            this.setState({ therapyShortTermGoalsCount: shortTermGoalsCount, longTermMastered: longTermMasterdCount });
        }
    }
    isLongTermGoalMastered(goal) {
        let isMastered = false;
        if (goal.goalStatus && goal.goalStatus.status && goal.goalStatus.status === "Met") {
            isMastered = true;
        }
        return isMastered;
    }
    getGoalsView() {
        let { student, programDetails, longTermMastered, therapyLongTermGoalsCount, shortTermMastered, therapyShortTermGoalsCount } = this.state;

        let longPercentage = 0;
        if (therapyLongTermGoalsCount > 0) {
            longPercentage = Math.floor((longTermMastered / therapyLongTermGoalsCount) * 100);
        }
        let shortPercentage = 0;
        if (therapyShortTermGoalsCount > 0) {
            shortPercentage = Math.floor((shortTermMastered / therapyShortTermGoalsCount) * 100);
        }
        // console.log(Math.floor(longPercentage));
        return (
            <View style={styles.therapyGoals}>
                <Text style={styles.therapyGoalTitle}>Therapy Goals</Text>
                <Text style={styles.therapyGoalDescription}>Short Term & Long Term Goals for {student.firstname} therapy program.</Text>

                <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
                    <Text style={styles.progressCheckMark}>
                        <FontAwesome5 name={'check'} style={{ color: '#FFFFFF' }} />
                    </Text>
                    <ProgressCircle
                        percent={shortPercentage}
                        radius={40}
                        borderWidth={8}
                        color="#4BAEA0"
                        shadowColor="#D4DCE7"
                        bgColor="#fff"                                >
                        <Text style={{ fontSize: 22, color: '#344356' }}>{shortPercentage + '%'}</Text>
                    </ProgressCircle>
                    <TouchableOpacity>
                        <View style={{ padding: 10 }}>
                            <Text style={{ color: '#63686E', fontSize: 19 }}>Short Term Goals</Text>
                            <Text style={{ color: 'rgba(95, 95, 95, 0.75)', fontSize: 13 }}>0/{this.state.therapyShortTermGoalsCount} Targets Mastered</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ padding: 15 }}>
                        <MaterialCommunityIcons name={'arrow-right'} style={styles.backIconText} />
                    </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.progressCheckMark}>
                        <FontAwesome5 name={'check'} style={{ color: '#FFFFFF' }} />
                    </Text>
                    <ProgressCircle
                        percent={longPercentage}
                        radius={40}
                        borderWidth={8}
                        color="#4BAEA0"
                        shadowColor="#D4DCE7"
                        bgColor="#fff"                                >
                        <Text style={{ fontSize: 22, color: '#344356' }}>{longPercentage + '%'}</Text>
                    </ProgressCircle>
                    <TouchableOpacity>
                        <View style={{ padding: 10 }}>
                            <Text style={{ color: '#63686E', fontSize: 19 }}>Long Term Goals</Text>
                            <Text style={{ color: 'rgba(95, 95, 95, 0.75)', fontSize: 13 }}>
                                {this.state.longTermMastered}/{this.state.therapyLongTermGoalsCount} Targets Mastered</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ padding: 15 }}>
                        <MaterialCommunityIcons name={'arrow-right'} style={styles.backIconText} />
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        let { headerTitle } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    title={headerTitle}
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                        <View style={styles.listItemImageView}>
                            <FontAwesome5
                                name={'play-circle'}
                                style={{
                                    position: 'absolute',
                                    top: 55,
                                    left: 135,
                                    zIndex: 99999,
                                    fontSize: 60,
                                    color: '#FFFFFF',
                                }}
                            />
                            <Image source={require('../../../android/img/Image.png')} style={styles.instructionImage} />
                        </View>
                        {this.getGoalsView()}
                    </ScrollView>
                    <Button labelButton='Go to Home'
                        style={{ marginBottom: 10 }}
                        onPress={() => {
                            // let { navigation, route } = this.props;
                            // let id = route.params.therapyId;
                            // navigation.navigate('TherapyRoadMap', { therapyId: id });
                            this.props.navigation.popToTop();
                        }} />
                </Container>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 60,
        width: '100%'
    },
    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        paddingLeft: 10
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 18,
        paddingTop: 10,
        color: '#45494E',
        fontWeight: 'bold'
    },
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        paddingRight: 10
    },
    scrollView: {
        padding: 10,
        backgroundColor: "#FFFFFF",
        marginBottom: 120,
        height: screenHeight
    },
    continueView: {
        width: '100%',
        position: 'absolute',
        bottom: 220
    },
    continueViewTouchable: {
        // margin: 16,
        // marginTop: 28,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 50,
        backgroundColor: '#3E7BFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3E7BFA'
    },
    continueViewText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    // therapyGoals
    therapyGoals: {
        padding: 10,
        borderWidth: 0.5,
        margin: 10,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    therapyGoalTitle: {
        color: '#45494E',
        fontSize: 18,
        fontWeight: '700',
        paddingBottom: 5
    },
    therapyGoalDescription: {
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 16,
        paddingBottom: 10
    },
    progressCheckMark: {
        position: 'absolute',
        zIndex: 999999,
        fontSize: 20,
        backgroundColor: '#4BAEA0',
        padding: 5,
        borderRadius: 50,
        left: 30,
        top: -5
    },
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetMedicalData: (data) => dispatch(setMedicalData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProgram);
