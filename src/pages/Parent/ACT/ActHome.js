import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity, Modal, Alert,
} from 'react-native';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import MaskedView from '@react-native-community/masked-view';

import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload, setAutismScreening, setAssessmentData } from '../../../redux/actions/index';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import ImageHelper from '../../../helpers/ImageHelper';
import StudentHelper from '../../../helpers/StudentHelper';
import ActCourseCard from '../../../components/ActCourseCard';
import ActExerciseCard from '../../../components/ActExerciseCard';
import ParentRequest from '../../../constants/ParentRequest';
import LoadingIndicator from '../../../components/LoadingIndicator';
import store from '../../../redux/store';
import SimpleModal from '../../../components/SimpleModal';
import ActHomeInfo from './ActHomeInfo';

const width = Dimensions.get('window').width

class ActHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            familyMembers: [],
            selectedMember: 0,
            courses: [],
            exercises: [],
            isShowFamily: false
        };
    }

    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getData();
        this.getFamilyMembersList();
    }

    getData() {
        ParentRequest.actHome().then((result) => {
            console.log("Result", result);
            let courses = result.data.allCourse.edges;
            let exercises = courses.length ? courses[0].node.exerciseSet.edges : [];
            this.setState({
                isLoading: false,
                courses,
                exercises
            })
        }).catch((err) => {
            Alert.alert("Information", err.toString());
            this.setState({
                isLoading: false
            })
        })
    }

    getFamilyMembersList() {
        let variables = {
            student: store.getState().studentId,
        };
        ParentRequest.fetchFamilyMembers(variables).then(result => {
            console.log('fetchFamilyMembers', result);
            let familyMembers = [];
            let edges = result.data.family.edges;
            if (edges.length != 0) {
                familyMembers = edges[0].node.members.edges;
            }
            this.setState({ familyMembers });
        }).catch(error => {

        });
    }

    renderMobile() {
        return (
            <Container>
                <ScrollView>
                    <ActHomeInfo />

                    {this.state.courses.map((course, key) => {
                        return <ActCourseCard
                            key={key}
                            index={key}
                            title={course.node.name}
                            description={course.node.description}
                            onPress={() => {
                                this.props.navigation.navigate("ActCourse", {
                                    id: course.node.id,
                                    title: course.node.name,
                                    imageIndex: key,
                                    description: course.node.description,
                                    lessons: course.node.exerciseSet.edges
                                });
                            }}
                        />
                    })}

                    {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ flex: 1, fontSize: 18, color: Color.blackFont }}>Exercises</Text>
                            <MaterialCommunityIcons name='arrow-right' size={25} color={Color.blackFont} />
                        </TouchableOpacity> */}

                    {/* {this.state.exercises.map((exercise, key) => {
                            return <ActExerciseCard
                                key={key}
                                title={exercise.node.name}
                                description={exercise.node.description}
                                image={require('../../../../android/img/act-exc-1.png')}
                                onPress={() => {
                                    this.props.navigation.navigate("ActExcercise", {
                                        id: exercise.node.id
                                    })
                                }}
                            />
                        })} */}
                </ScrollView>
            </Container>
        );
    }

    renderTablet() {
        return (
            <Container>
                <Row>
                    <Column>
                        <ScrollView>
                            <ActHomeInfo />
                        </ScrollView>
                    </Column>
                    <Column style={{ flex: 2 }}>
                        <ScrollView>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 10 }}>
                                <Text style={{ flex: 1, fontSize: 18, color: Color.blackFont }}>Courses</Text>
                                <MaterialCommunityIcons name='arrow-right' size={25} color={Color.blackFont} />
                            </TouchableOpacity>

                            <ScrollView horizontal={true}>
                                {this.state.courses.map((course, key) => {
                                    return (
                                        <View style={{ width: 400, marginRight: 10 }}>
                                            <ActCourseCard
                                                key={key}
                                                index={key}
                                                title={course.node.name}
                                                description={course.node.description}
                                                onPress={() => {
                                                    this.props.navigation.navigate("ActCourse", {
                                                        id: course.node.id,
                                                        title: course.node.name,
                                                        imageIndex: key,
                                                        description: course.node.description,
                                                        lessons: course.node.exerciseSet.edges
                                                    });
                                                }}
                                            />
                                        </View>
                                    );
                                })}
                            </ScrollView>

                            {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ flex: 1, fontSize: 18, color: Color.blackFont }}>Exercises</Text>
                                <MaterialCommunityIcons name='arrow-right' size={25} color={Color.blackFont} />
                            </TouchableOpacity> */}

                            {/* {this.state.exercises.map((exercise, key) => {
                                return <ActExerciseCard
                                    key={key}
                                    title={exercise.node.name}
                                    description={exercise.node.description}
                                    image={require('../../../../android/img/act-exc-1.png')}
                                    onPress={() => {
                                        this.props.navigation.navigate("ActExcercise", {
                                            id: exercise.node.id
                                        })
                                    }}
                                />
                            })} */}
                        </ScrollView>
                    </Column>
                </Row>

            </Container>
        );
    }

    render() {
        let { familyMembers, selectedMember } = this.state;

        let selectedFamily = null;
        if (familyMembers.length != 0) {
            selectedFamily = familyMembers[selectedMember];
            console.log("selectedFamily", selectedFamily);
        }

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="ACT"
                    backPress={() => this.props.navigation.goBack()}
                // dotsPress={() => {
                //     this.setState({ isShowFamily: true })
                // }}
                // materialCommunityIconsName='account-switch'
                />

                <SimpleModal visible={this.state.isShowFamily} onRequestClose={() => {
                    this.setState({ isShowFamily: false })
                }}>
                    {this.state.familyMembers.map((familyMember, key) => {
                        return (
                            <TouchableOpacity style={styles.modalList} key={key} activeOpacity={0.8} onPress={() => {
                                this.setState({ isShowFamily: false, selectedMember: key });
                            }}>
                                <Image source={{ uri: ImageHelper.getImage("") }} style={styles.photo} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.headerText}>{familyMember.node.memberName}</Text>
                                    <Text style={styles.subheaderText}>{StudentHelper.getStudentName()}'s {familyMember.node.relationship.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </SimpleModal>

                {this.state.isLoading && <LoadingIndicator />}
                {!this.state.isLoading && (
                    <>
                        {OrientationHelper.getDeviceOrientation() == 'portrait' && this.renderMobile()}
                        {OrientationHelper.getDeviceOrientation() == 'landscape' && this.renderTablet()}
                    </>
                )}
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.white,
        flex: 1
    },
    header: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center'
    },
    sectionDescription: {
        backgroundColor: Color.primaryTransparent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 10,
        borderRadius: 5
    },
    sectionDescriptionText: {
        fontSize: 17,
        color: Color.blackFont,
        marginVertical: 5
    },
    modalList: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center'
    },
    photo: {
        marginRight: 10,
        width: 50,
        height: 50,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        // elevation: 4,
    },
    headerText: {
        fontSize: 18,
        color: Color.blackFont
    },
    subheaderText: {
        fontSize: 14,
        color: Color.grayDarkFill
    },
    spectrumWrapper: {
        width: 300,
        height: 330,
        // backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shape: {
        width: 250,
        height: 280
    },
    spectrumText: {
        position: 'absolute',
        fontSize: 16,
        color: Color.blackFont
    }
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
    dispatchSetAutismScreening: (data) => dispatch(setAutismScreening(data)),
    dispatchSetAssessmentData: (data) => dispatch(setAssessmentData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActHome);
