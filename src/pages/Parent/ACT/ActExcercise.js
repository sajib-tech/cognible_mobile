import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity, Modal, Alert,
} from 'react-native';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';

import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload, setAutismScreening, setAssessmentData } from '../../../redux/actions/index';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import { WebView } from 'react-native-webview';
import { Row, Container, Column } from '../../../components/GridSystem';
import ImageHelper from '../../../helpers/ImageHelper';
import ParentRequest from '../../../constants/ParentRequest';
import LoadingIndicator from '../../../components/LoadingIndicator';
import TextInput from '../../../components/TextInput';
import store from '../../../redux/store';
import NoData from '../../../components/NoData';
import StarRating from '../../../components/StarRating';
import ResponseRating from '../../../components/ResponseRating';
import UrlParser from "js-video-url-parser";
import YoutubePlayer from '../../../components/YoutubePlayer';
import VimeoPlayer from '../../../components/VimeoPlayer';
import ActImageCollection from '../../../components/ActImageCollection';

const width = Dimensions.get('window').width

class ActExcercise extends Component {

    constructor(props) {
        super(props);

        this.params = props.route.params;
        // console.log("Params", this.params);

        this.state = {
            isLoading: true,
            title: '',
            questions: [],
            currentIndex: 0,
            answer: '',
            answers: [],
            page: 'content', //response
            response: '',
            isSaving: false,
            isSubmitResponse: false,

            exercise: null,
            screenResult: {},
        };
    }

    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getData();
        this.updateSeenStatus();
    }

    getData() {
        let user = store.getState().user;
        // console.log("User", user);

        let params = {
            id: this.params.id,
            userId: user.id
        };
        ParentRequest.getExcerciseDetail(params).then((result) => {
            // console.log("Result", result);
            let exercise = result.data.exercise;
            let title = exercise.name;
            let answers = [];
            let questions = exercise.questionsSet.edges;
            console.log("Exercies", exercise);

            questions.map((question, key) => {
                let ans = null;
                question.node.questionresponsesSet.edges.map((questionResponse, key2) => {
                    ans = questionResponse.node;
                });
                answers[key] = ans;
            });

            if (exercise?.exercisetype?.name == "Screen") {
                //continue
                let screenResult = {};

                let content = exercise.content;
                let match = content.match(/\<([a-z])\w+\>/g);
                console.log("Split", match);

                if (match) {
                    match.forEach((keyword, key) => {
                        if (keyword == "<list>") {
                            screenResult[keyword] = [""];
                        } else {
                            screenResult[keyword] = "";
                        }
                    });
                }

                //get result
                let responses = exercise.userresponsesSet.edges;
                if (responses.length != 0) {
                    let selectedResponse = responses[responses.length - 1];
                    screenResult = JSON.parse(selectedResponse.node.content);
                }

                this.setState({ screenResult });
            }

            this.setState({
                isLoading: false, exercise, title, questions, answers
            }, () => {
                this.getCurrentAnswer();
            });
        }).catch((err) => {
            console.log(JSON.parse(JSON.stringify(err)))
            Alert.alert("Information", err.toString());
            this.setState({
                isLoading: false
            })
        });
    }

    updateSeenStatus() {
        let params = {
            id: this.params.id,
        };
        ParentRequest.updateSeenStatus(params).then((result) => {
            console.log("updateSeenStatus", result);
        }).catch((err) => {

        });
    }

    getUrlParams(search) {
        const hashes = search.slice(search.indexOf('?') + 1).split('&')
        const params = {}
        hashes.map(hash => {
            const [key, val] = hash.split('=')
            params[key] = decodeURIComponent(val)
        })
        return params
    }

    submitAnswer(currentIndex, answer) {
        let { questions, answers } = this.state;

        let question = questions[currentIndex];
        let answerObj = answers[currentIndex];

        if (answerObj) {
            //update
            let params = {
                id: answerObj.id,
                response: answer + ""
            };
            console.log("updateQuestionResponse", params);
            return ParentRequest.updateQuestionResponse(params);
        } else {
            let params = {
                id: question.node.id,
                response: answer + ""
            };
            console.log("createQuestionResponse", params);
            return ParentRequest.createQuestionResponse(params);
        }
    }

    getCurrentAnswer() {
        let currentIndex = this.state.currentIndex;
        let answerObj = this.state.answers[currentIndex];
        let answer = "";
        if (answerObj) {
            answer = answerObj.response;
        } else {
            answer = "";
        }
        this.setState({ answer })
    }

    prevPage() {
        let { questions, currentIndex, answer, exercise, page, response } = this.state;
        if (currentIndex == 0) {
            this.props.navigation.goBack();
        } else {
            this.setState({ currentIndex: currentIndex - 1, isSaving: false }, () => {
                this.getCurrentAnswer();
            });
        }
    }

    nextPage() {
        let { questions, currentIndex, answer, exercise, page, response } = this.state;

        if (exercise) {
            let exerciseType = exercise?.exercisetype?.name;
            if (exerciseType == "Questionnaire") {
                //submit answer
                console.log("Questions", questions);
                this.setState({ isSaving: true });
                let question = questions[currentIndex];
                this.submitAnswer(currentIndex, answer).then((res) => {
                    currentIndex++;
                    if (currentIndex == questions.length) {
                        //move next page
                        this.setState({ page: 'response', isSaving: false });
                    } else {
                        this.setState({ currentIndex, isSaving: false }, () => {
                            this.getCurrentAnswer();
                        })
                    }
                }).catch((err) => {
                    Alert.alert("Information", "Cannot submit answer");
                    this.setState({ isSaving: false });
                })
            }

            if (exerciseType == "Screen") {
                this.setState({ page: 'response' });
            }

            if (exerciseType == "Lesson") {
                //continue
                this.setState({ page: 'response' });
            }
        }
    }

    submitResponse(answer) {
        this.setState({ isSubmitResponse: true });
        let params = {
            id: this.params.id,
            response: answer + ""
        };
        ParentRequest.createUserResponse(params).then((result) => {
            this.setState({ isSubmitResponse: false });
            Alert.alert(
                'Information',
                'Submit response success.',
                [
                    {
                        text: 'Ok', onPress: () => {
                            this.props.navigation.goBack();
                        }
                    },
                ],
                { cancelable: false }
            );
        }).catch((err) => {
            Alert.alert("Information", err.toString());
            this.setState({ isSubmitResponse: false });
        });
    }

    isCanContinue() {
        let { answer, exercise } = this.state;
        let exerciseType = exercise?.exercisetype?.name;

        if (exerciseType == "Questionnaire") {
            if (answer == "") {
                return false;
            }
        }
        return true;
    }

    renderScreen(exercise) {
        let content = exercise.content;
        let match = content.match(/\<([a-z])\w+\>/g);
        // console.log("Split", match);

        let screenResult = this.state.screenResult;

        let output = [];

        let lastIndex = 0;

        if (match != null) {
            match.forEach((keyword, key) => {
                let index = content.indexOf(keyword, lastIndex);
                let str = content.substring(lastIndex, index).trim();
                output.push(<Text key={key} style={styles.paragraph}>{str}</Text>);

                if (keyword == "<list>") {
                    output.push((
                        <View key={'input_' + key}>
                            {screenResult[keyword].map((item, k2) => {
                                return (
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.listNumber}>
                                            <Text>{k2 + 1}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <TextInput key={'input_' + key + "_" + k2} value={item}
                                                onChangeText={(text) => {
                                                    screenResult[keyword][k2] = text;
                                                    this.setState({ screenResult });
                                                }} />
                                        </View>
                                        <TouchableOpacity style={styles.listDelete} onPress={() => {
                                            screenResult[keyword].splice(k2, 1);
                                            this.setState({ screenResult });
                                        }}>
                                            <MaterialCommunityIcons name='trash-can' size={30} color={Color.danger} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                            <Button labelButton='Add New'
                                onPress={() => {
                                    screenResult[keyword].push("")
                                    this.setState({ screenResult });
                                }} />
                        </View>
                    ));
                } else {
                    output.push(<TextInput key={'input_' + key} value={screenResult[keyword]}
                        onChangeText={(text) => {
                            screenResult[keyword] = text;
                            this.setState({ screenResult });
                        }} />);
                }

                lastIndex = index + keyword.length;
            });

            return output;
        }

        return <Text style={styles.paragraph}>{content}</Text>;
    }

    render() {
        let imageIndex = this.params.imageIndex;
        let imageSource = ActImageCollection.getImage()[imageIndex ? imageIndex : 0];

        let { questions, currentIndex, answer, exercise, page, response, isSaving, isSubmitResponse } = this.state;

        let question = null;
        if (questions.length != 0) {
            question = questions[currentIndex];
        }

        let exerciseType = exercise?.exercisetype?.name;

        let videoMetaData = null;
        let videoHeight = (width - 20) * 165 / 295;
        if (exerciseType == "Lesson") {
            videoMetaData = UrlParser.parse(exercise.link);
        }

        if (exerciseType == "Screen") {
            //parse content


        }

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title={this.state.title}
                    backPress={() => this.props.navigation.goBack()}
                />

                {this.state.isLoading && <LoadingIndicator />}
                {!this.state.isLoading && (
                    <>
                        {page == 'content' && (
                            <Container>
                                {(exerciseType == "Questionnaire" && questions.length != 0) && (
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        {questions.map((item, key) => {
                                            return (
                                                <View key={key} style={key == currentIndex ? styles.pageBlockActive : styles.pageBlock} />
                                            )
                                        })}
                                    </View>
                                )}

                                <ScrollView>
                                    {exercise && (
                                        <View>
                                            {(exerciseType == "Questionnaire" || exerciseType == "Screen") && (
                                                <Image source={imageSource}
                                                    style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 5, marginTop: 10 }} />
                                            )}

                                            {exerciseType == "Questionnaire" && exercise.questionsSet.edges.map((question, key) => {
                                                if (key == currentIndex) {
                                                    return (
                                                        <View key={key}>
                                                            <Text style={styles.paragraph}>{question.node.question}</Text>

                                                            {question.node.questiontype == "Rating" && (
                                                                <View style={{ marginTop: 20 }}>
                                                                    <ResponseRating value={answer} onChange={(star) => {
                                                                        this.setState({ answer: star });
                                                                    }} />
                                                                </View>
                                                            )}
                                                            {/* <TextInput label='Write it down' value={answer}
                                                                onChangeText={(answer) => {
                                                                    this.setState({ answer })
                                                                }} /> */}
                                                        </View>
                                                    );
                                                }
                                            })}

                                            {(exerciseType == "Questionnaire" && exercise.questionsSet.edges.length == 0) && (
                                                <NoData>No Question Available</NoData>
                                            )}

                                            {/* {exercise.exercisetype?.name == "Screen" && (
                                                <Text style={styles.paragraph}>{exercise.content}</Text>
                                            )} */}

                                            {exerciseType == "Screen" && this.renderScreen(exercise)}

                                            {exerciseType == "Lesson" && (
                                                <>
                                                    <View style={{ marginTop: 10 }}>
                                                        {videoMetaData?.provider == "youtube" && <YoutubePlayer url={exercise.link} height={videoHeight} />}

                                                        {videoMetaData?.provider == "vimeo" && <VimeoPlayer url={exercise.link} height={videoHeight} />}

                                                        {videoMetaData == null && <YoutubePlayer url='https://youtu.be/2U76x2fD_tE' height={videoHeight} />}
                                                    </View>
                                                    <Text style={styles.paragraph}>{exercise.content}</Text>
                                                </>
                                            )}
                                        </View>
                                    )}
                                </ScrollView>

                                {exerciseType == "Questionnaire" && (
                                    <Row>
                                        <Column>
                                            <Button labelButton='Go Back'
                                                theme='secondary'
                                                style={{ marginVertical: 10 }}
                                                onPress={() => {
                                                    this.prevPage();
                                                }} />
                                        </Column>
                                        <Column>
                                            <Button labelButton='Continue'
                                                disabled={!this.isCanContinue()}
                                                style={{ marginVertical: 10, opacity: this.isCanContinue() ? 1 : 0.5 }}
                                                isLoading={isSaving}
                                                onPress={() => {
                                                    this.nextPage();
                                                }} />
                                        </Column>
                                    </Row>

                                )}

                                {exerciseType == "Screen" && (
                                    <Button labelButton='Submit'
                                        style={{ marginVertical: 10 }}
                                        isLoading={isSubmitResponse}
                                        onPress={() => {
                                            let screenResult = this.state.screenResult
                                            let isFilled = true;
                                            Object.keys(screenResult).forEach((key) => {
                                                if (key == "<list>") {
                                                    screenResult[key].forEach((str2) => {
                                                        if (str2 == "") {
                                                            isFilled = false;
                                                        }
                                                    })
                                                } else {
                                                    let str = screenResult[key];
                                                    if (str == "") {
                                                        isFilled = false;
                                                    }
                                                }
                                            });

                                            if (isFilled) {

                                                let jsonAnswer = JSON.stringify(screenResult);
                                                console.log(jsonAnswer);
                                                this.submitResponse(jsonAnswer);
                                            } else {
                                                Alert.alert("Information", "Please fill all empty input");
                                            }
                                        }} />
                                )}
                            </Container>
                        )}
                        {page == 'response' && (
                            <Container>
                                <ScrollView>
                                    <TextInput label='Write your response' value={response}
                                        onChangeText={(response) => {
                                            this.setState({ response })
                                        }} />
                                </ScrollView>
                                <Button labelButton='Submit'
                                    style={{ marginVertical: 10 }}
                                    isLoading={isSubmitResponse}
                                    onPress={() => {
                                        this.submitResponse(response);
                                    }} />
                            </Container>
                        )}
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
    paragraph: {
        marginTop: 10,
        fontSize: 16,
        color: Color.blackFont
    },
    pageBlock: {
        height: 3,
        backgroundColor: Color.gray,
        flex: 1,
        marginHorizontal: 1
    },
    pageBlockActive: {
        height: 3,
        backgroundColor: Color.primary,
        flex: 1,
        marginHorizontal: 1
    },
    listNumber: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 25,
        borderColor: Color.primary,
        marginTop: 6,
        marginRight: 5
    },
    listDelete: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.danger,
        marginTop: 6,
        marginLeft: 5
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

export default connect(mapStateToProps, mapDispatchToProps)(ActExcercise);
