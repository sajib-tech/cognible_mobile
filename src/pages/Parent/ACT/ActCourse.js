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
import store from '../../../redux/store';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ActImageCollection from '../../../components/ActImageCollection';
import ActHomeInfo from './ActHomeInfo';

const width = Dimensions.get('window').width

class ActCourse extends Component {

    constructor(props) {
        super(props);

        let { id, title, description, imageIndex } = props.route.params;

        this.state = {
            id,
            view: 'lesson',
            title,
            description,
            activeLesson: null,
            lessons: [],
            isLoading: true,
            imageIndex
        };
    }

    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.props.navigation.addListener('focus', () => {
            this.getData();
        });
    }

    getData() {
        let user = store.getState().user;
        let vars = {
            id: this.state.id,
            user: user.id
        };
        this.setState({ isLoading: true });
        console.log("Vars", vars);
        ParentRequest.actCourse(vars).then((result) => {
            console.log("Result::actCourse", result);

            let activeLesson = null;
            let isBreak = false;
            let lessons = result.data.course.exerciseSet.edges;
            lessons.forEach((exercise, key) => {
                if (isBreak == false) {
                    let userResponse = exercise.node.userresponsesSet.edges;
                    if (userResponse.length != 0) {

                    } else {
                        activeLesson = exercise.node.id;
                        isBreak = true;
                    }
                }
            });
            this.setState({ activeLesson, lessons, isLoading: false })
        }).catch((err) => {
            console.log(">>>>>>>>>>>>>>>",JSON.parse(JSON.stringify(err)));
            Alert.alert("Information", err.toString());
            this.setState({
                isLoading: false
            })
        })
    }

    isDone(exercise) {
        // console.log("isDone", exercise);
        let exerciseName = exercise.node.exercisetype?.name;
        if (exerciseName) {
            console.log(exerciseName, exercise);
            if (exerciseName == "Questionnaire") {
                let isComplete = true;
                exercise.node.questionsSet.edges.forEach((question) => {
                    if (question.node.questionresponsesSet.edges.length == 0) {
                        isComplete = false
                    }
                });

                return isComplete;
            }

            if (exerciseName == "Screen") {
                return exercise.node.seen;
            }

            if (exerciseName == "Lesson") {
                return exercise.node.seen;
            }
        }

        return false;
    }

    renderMobile() {
        let { isLoading, imageIndex } = this.state;
        let imageSource = ActImageCollection.getImage()[imageIndex ? imageIndex : 0];
        return (
            <Container>
                <ScrollView>
                    <Image source={imageSource}
                        style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 5, marginTop: 10 }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Text style={styles.titleMinute}>30-45 minutes</Text>
                    </View>
                    <Text style={styles.subtitle}>{this.state.description}</Text>

                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => { this.setState({ view: 'lesson' }) }}>
                            <Text style={[styles.tab, { color: this.state.view == 'lesson' ? Color.blackFont : Color.grayDarkFill }]}>Lessons</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ view: 'about' }) }}>
                            <Text style={[styles.tab, { color: this.state.view == 'about' ? Color.blackFont : Color.grayDarkFill }]}>About this Course</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.view == 'lesson' && (
                        <>
                            {this.state.lessons.map((lesson, key) => {
                                let isDone = this.isDone(lesson);

                                return (
                                    <TouchableOpacity key={key} activeOpacity={0.8} style={styles.lessonNotActive} onPress={() => {
                                        this.props.navigation.navigate("ActExcercise", {
                                            id: lesson.node.id,
                                            imageIndex: imageIndex
                                        })
                                    }}>
                                        {isDone && (
                                            <View style={styles.checkCircle}>
                                                <MaterialCommunityIcons name='check' color={Color.white} size={23} />
                                            </View>
                                        )}

                                        {!isDone && (
                                            <View style={styles.checkCircleGray}>
                                                <MaterialCommunityIcons name='check' color={Color.gray} size={23} />
                                            </View>
                                        )}

                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.lessonHeader}>{lesson.node.name}</Text>
                                                <Text style={styles.lessonMinute}>{lesson.node.minEstimatedTime}-{lesson.node.maxEstimatedTime}min</Text>
                                            </View>
                                            <Text style={styles.lessonDescription}>{lesson.node.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </>
                    )}

                    {this.state.view == 'about' && (
                        <View>
                            <Text>Take the first step on a journey towards a more constructive relationship with yourself</Text>
                        </View>
                    )}
                </ScrollView>
                {/* {this.state.activeLesson && <Button labelButton='Start Course'
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                this.props.navigation.navigate("ActExcercise", {
                                    id: this.state.activeLesson
                                })
                            }} />} */}
            </Container>
        );
    }

    renderTablet() {
        let { isLoading, imageIndex } = this.state;
        let imageSource = ActImageCollection.getImage()[imageIndex ? imageIndex : 0];
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
                            <Image source={imageSource}
                                style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 5, marginTop: 10 }} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.title}>{this.state.title}</Text>
                                <Text style={styles.titleMinute}>30-45 minutes</Text>
                            </View>
                            <Text style={styles.subtitle}>{this.state.description}</Text>

                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => { this.setState({ view: 'lesson' }) }}>
                                    <Text style={[styles.tab, { color: this.state.view == 'lesson' ? Color.blackFont : Color.grayDarkFill }]}>Lessons</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ view: 'about' }) }}>
                                    <Text style={[styles.tab, { color: this.state.view == 'about' ? Color.blackFont : Color.grayDarkFill }]}>About this Course</Text>
                                </TouchableOpacity>
                            </View>

                            {this.state.view == 'lesson' && (
                                <>
                                    {this.state.lessons.map((lesson, key) => {
                                        let isDone = this.isDone(lesson);

                                        return (
                                            <TouchableOpacity key={key} activeOpacity={0.8} style={styles.lessonNotActive} onPress={() => {
                                                this.props.navigation.navigate("ActExcercise", {
                                                    id: lesson.node.id,
                                                    imageIndex: imageIndex
                                                })
                                            }}>
                                                {isDone && (
                                                    <View style={styles.checkCircle}>
                                                        <MaterialCommunityIcons name='check' color={Color.white} size={23} />
                                                    </View>
                                                )}

                                                {!isDone && (
                                                    <View style={styles.checkCircleGray}>
                                                        <MaterialCommunityIcons name='check' color={Color.gray} size={23} />
                                                    </View>
                                                )}

                                                <View style={{ flex: 1 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={styles.lessonHeader}>{lesson.node.name}</Text>
                                                        <Text style={styles.lessonMinute}>{lesson.node.minEstimatedTime}-{lesson.node.maxEstimatedTime}min</Text>
                                                    </View>
                                                    <Text style={styles.lessonDescription}>{lesson.node.description}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </>
                            )}

                            {this.state.view == 'about' && (
                                <View>
                                    <Text>Take the first step on a journey towards a more constructive relationship with yourself</Text>
                                </View>
                            )}
                        </ScrollView>
                        {/* {this.state.activeLesson && <Button labelButton='Start Course'
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                this.props.navigation.navigate("ActExcercise", {
                                    id: this.state.activeLesson
                                })
                            }} />} */}
                    </Column>
                </Row>
            </Container>
        );
    }

    render() {
        let { isLoading, imageIndex } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="Course"
                    backPress={() => this.props.navigation.goBack()}
                />

                {isLoading && <LoadingIndicator />}
                {!isLoading && (
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
    title: {
        fontSize: 21,
        color: Color.blackFont,
        marginVertical: 10,
        flex: 1
    },
    titleMinute: {
        fontSize: 12,
        color: Color.grayDarkFill
    },
    subtitle: {
        fontSize: 13,
        color: Color.grayDarkFill,
        marginBottom: 20
    },
    tab: {
        fontSize: 18,
        color: Color.blackFont,
        marginRight: 10
    },
    lessonActive: {
        backgroundColor: Color.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10
    },
    lessonNotActive: {
        flexDirection: 'row',
        backgroundColor: Color.white,
        paddingRight: 16,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    lessonHeader: {
        fontSize: 16,
        flex: 1
    },
    lessonMinute: {
        fontSize: 12,
    },
    lessonDescription: {
        fontSize: 13,
        marginTop: 5
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.success,
        marginHorizontal: 10
    },
    checkCircleGray: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        marginHorizontal: 10
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(ActCourse);
