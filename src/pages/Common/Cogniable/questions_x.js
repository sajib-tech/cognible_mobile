
import React, { Component } from 'react';

import { Alert, ActivityIndicator, Dimensions, Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import { getStr } from '../../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetProgress from '../../../components/TargetProgress';
import QuestionSelectOption from '../../../components/screening/QuestionSelectOption';
import { getAuthResult, getAuthTokenPayload } from '../../../redux/reducers/index';
import DateHelper from '../../../helpers/DateHelper';
import TokenRefresher from '../../../helpers/TokenRefresher';
import TherapistRequest from '../../../constants/TherapistRequest';

import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { setToken } from '../../../redux/actions/index';
import Button from '../../../components/Button';
import NoData from '../../../components/NoData';

const screenHeight = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

class QuestionsCogniable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSaving: false,
            questions: [],
            recorded: [],
            answers: [],
            questionNum: 1,
            currentIndex: 0,
            preAssessId: null
        }
        this.callBack = this.callBack.bind(this);
    }
    _refresh() {
        this.setState({ isLoading: false });
        this.componentDidMount();
    }

    componentDidMount() {
        console.log(JSON.stringify(this.props))
        this.setState({ 
            preAssessId: this.props.route.params.pk 
        });
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.fetchQuestions();
    }

    fetchQuestions() {
        this.setState({ isLoading: true });
        const { pk } = this.props.route.params;

        TherapistRequest.fetchCogniableAssessmentQuestions().then(dataResult => {
            console.log("dataResult", JSON.stringify(dataResult));
            let answers = [];
            let tempQuestions = [];
            let variables = {
                pk: pk
            };
            TherapistRequest.getRecordedAssessmentAreaCogniable(variables).then(result => {
                console.log("Recorded", JSON.stringify(result));
                let recordedAnswers = result.data.getCogniableAssessDetail.assessmentQuestions.edges;
                dataResult.data.cogniableAssessQuestions.map((question) => {
                    if(question.options.edges.length > 0) {
                        tempQuestions.push(question);
                        if(recordedAnswers.length > 0) {
                            let found = 0;
                            for(let x=0;x<recordedAnswers.length;x++) {
                                if(recordedAnswers[x].node.question.id === question.id) {
                                    answers.push(recordedAnswers[x].node.answer.id);
                                    found = 1;
                                    break;
                                }
                            }
                            if(found === 0) {
                                answers.push(null);
                            }
                        } else {
                            answers.push(null);
                        }
                    }
                })
                this.setState({
                    isLoading: false,
                    questions: tempQuestions,
                    answers
                })

                console.log("Questions : ", tempQuestions);
                console.log("Answers : ", answers);
            })

            

            /*let answers = [];
            let tempQuestions = [];
            dataResult.data.cogniableAssessQuestions.map((question) => {
                // console.log(question.options.edges.length);
                if (question.options.edges.length > 0) {
                    
                    //return question;  
                    tempQuestions.push(question);
                }
                // return null;
            });

            this.setState({
                isLoading: false,
                questions: tempQuestions,
                answers,
                // questionNum: 7
            });*/
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isLoading: false });
        });
    }
    getQuestionData() {
        let data = [
            { index: "A", title: "Verbally fluent", descr: 'Describe what verbally fluent means in a line', selected: false },
            { index: "B", title: "Phrase speech", descr: 'Describe what verbally fluent means in a line', selected: false },
            { index: "C", title: "Single words", descr: 'Describe what verbally fluent means in a line', selected: false },
            { index: "D", title: "Little to no language", descr: 'Describe what verbally fluent means in a line', selected: false }
        ];
        return data;
    }
    callBack = () => {
        console.log("callBack() is called");
        let { navigation, route } = this.props;
        let id = route.params.therapyId;
        navigation.navigate('AssessmentResults', { therapyId: id });
    }
    isLastAnswerFilled() {
        let { questionNum, answers } = this.state;
        let indexArr = questionNum - 1;
        let lastAnswer = answers[indexArr];
        return lastAnswer != null;

    }
    recordPreAssess(question, answer) {
        this.setState({ isSaving: true })
        let variables = {
            pk: this.state.preAssessId,
            question: question.id,
            answer: answer.node.id,
        };
        TherapistRequest.saveCogniableAssessmentAnswer(variables).then(dataResult => {
            console.log("screeningRecordPreAssess", dataResult);
            this.setState({ isSaving: false });
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isSaving: false });
        });
    }
    selectAnswer(question, answer, index) {
        let answers = this.state.answers;
        // if (answers[index]) {
        //     Alert.alert("Warning", "Sorry you cannot change answer");
        // } else {
            answers[index] = answer.node.id;
            this.setState({ answers });

            this.recordPreAssess(question, answer);

            this.nextQuestion();
        // }
    }

    prevQuestion() {
        let questionNum = this.state.questionNum;
        let currentIndex = this.state.currentIndex;
        questionNum--;
        currentIndex--;
        if (questionNum < 1) {
            questionNum = 1;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }
        this.setState({ questionNum, currentIndex });
    }

    nextQuestion() {
        let questionNum = this.state.questionNum;
        let questions = this.state.questions;
        if (questionNum < questions.length) {
            let currentIndex = this.state.currentIndex;
            console.log(questionNum);
            questionNum++;
            currentIndex++;

            this.setState({ questionNum, currentIndex });
        } else if (questionNum === questions.length) {
            let { navigation, route } = this.props;
            let data = {
                pk: this.state.preAssessId,
                therapyId: route.params.therapyId,
                student: route.params.student
            }
            console.log(data)

            Alert.alert(
                'Cogniable Assessment',
                "Thank you for performing assessment",
                [{
                    text: 'OK', onPress: () => {
                        console.log('OK Pressed');
                        this.props.navigation.navigate("AssessmentResultCogniable", data)
                    }
                }],
                { cancelable: false }
            );


        }
    }

    renderQuestion() {
        let { questionNum, questions, answers, isSaving, currentIndex } = this.state;

        let indexArr = currentIndex;
        let selectedQuestion = null;
        let selectedAnswer = null;
        selectedQuestion = questions[currentIndex];
        selectedAnswer = answers[currentIndex];
        return (
            <>
                {selectedQuestion && (
                    <ScrollView style={styles.scrollView}>
                        <Text style={[Styles.bigBlackText, { fontSize: 18 }]}>{selectedQuestion.question}</Text>
                        <Image source={require('../../../../android/img/question.png')}
                            style={{ width: "100%", height: 200, resizeMode: 'cover', marginVertical: 8, borderRadius: 8 }} />
                        {isSaving && (
                            <View style={{ marginVertical: 30 }}>
                                <ActivityIndicator color={Color.blueFill} size='large' />
                            </View>
                        )}
                        {!isSaving && selectedQuestion.options.edges.map((answer, index) => {
                            let numbers = ["A", "B", "C", "D", "E", "F", "G"];
                            let hasDescription = (answer.node.description != null && answer.node.description != "");
                            if (selectedAnswer == answer.node.id) {
                                return (
                                    <TouchableOpacity onPress={() => this.selectAnswer(selectedQuestion, answer, indexArr)} key={index}
                                        activeOpacity={0.7}
                                        style={[styles.answerBox, { borderColor: Color.blueFill }]}>
                                        <View style={styles.answerBoxNumber}>
                                            <Text style={[styles.answerBoxNumbeText, { color: Color.blueFill }]}>{numbers[index]}</Text>
                                        </View>
                                        <View style={styles.answerBoxContent}>
                                            <Text style={[styles.answerBoxTitle, { color: Color.blueFill }]}>{answer.node.name}</Text>
                                            {hasDescription && <Text style={[styles.answerBoxSubtitle, { color: Color.blueFill }]}>{answer.node.description}</Text>}
                                        </View>
                                    </TouchableOpacity>
                                )
                            } else {
                                return (
                                    <TouchableOpacity onPress={() => this.selectAnswer(selectedQuestion, answer, indexArr)} key={index}
                                        activeOpacity={0.7}
                                        style={styles.answerBox}>
                                        <View style={styles.answerBoxNumber}>
                                            <Text style={styles.answerBoxNumbeText}>{numbers[index]}</Text>
                                        </View>
                                        <View style={styles.answerBoxContent}>
                                            <Text style={styles.answerBoxTitle}>{answer.node.name}</Text>
                                            {hasDescription && <Text style={styles.answerBoxSubtitle}>{answer.node.description}</Text>}
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        })}
                    </ScrollView>
                )}
            </>
        );
    }

    renderFooter() {
        let { questionNum, questions, answers } = this.state;

        let lastAnswerStatus = this.isLastAnswerFilled();

        let indexArr = questionNum - 1;
        let lastAnswer = answers[indexArr];

        let isFirst = questionNum == 1;
        let isLast = (questionNum == (questions.length));

        let isCanNext = isLast || lastAnswerStatus;
        // console.log(isFirst)
        // console.log(isLast)
        // console.log(isCanNext)
        // console.log({ isLast, lastAnswerStatus, isCanNext });

        let percentage = questionNum / (questions.length) * 100;

        // if ((questionNum == (questions.length)) && lastAnswerStatus) {
        //     return (
        //         <Button
        //             labelButton='Submit Assessment'
        //             onPress={() => this.submitAssessment()}
        //             style={{ marginVertical: 10 }}
        //         />
        //     );
        // }

        return (
            <>
                <View style={styles.footer}>
                    <View style={Styles.rowBetween}>
                        <View style={{ flex: 1, backgroundColor: Color.grayWhite, height: 40, padding: 8 }}>
                            <Text style={{ color: Color.blueFill }}>Question {questionNum} of {questions.length}</Text>
                            <View style={{ width: '100%', height: 2, backgroundColor: Color.gray }}>
                                <View style={{ width: percentage + '%', height: 2, backgroundColor: Color.blueFill }} />
                            </View>
                        </View>
                        <TouchableOpacity
                            disabled={isFirst ? true : false}
                            onPress={() => this.prevQuestion()}
                            style={[styles.buttonNav, { backgroundColor: isFirst ? Color.grayWhite : Color.blueFill }]}>
                            <MaterialCommunityIcons
                                name="chevron-up"
                                color={isFirst ? Color.gray : Color.white}
                                size={24}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={!isCanNext ? true : false}
                            onPress={() => this.nextQuestion()}
                            style={[styles.buttonNav, { backgroundColor: !isCanNext ? Color.grayWhite : Color.blueFill }]}>
                            <MaterialCommunityIcons
                                name="chevron-down"
                                color={!isCanNext ? Color.gray : Color.white}
                                size={24}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        )
    }

    renderSidebar() {
        let { questions, currentIndex } = this.state;
        console.log("questions", questions);
        return (
            <>
                <Text style={styles.sidebarTitle}>Upcoming Questions</Text>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    {questions.length == 0 && (
                        <NoData>No Questions Available</NoData>
                    )}

                    {questions.map((question, key) => {
                        let borderColor = key == currentIndex ? Color.primary : Color.white;
                        return (
                            <TouchableOpacity style={[styles.card, { borderColor }]} key={key} activeOpacity={0.8}
                                onPress={() => {
                                    this.setState({ questionNum: key + 1, currentIndex: key });
                                }}>
                                <Image source={require('../../../../android/img/question.png')}
                                    style={styles.questionImage} />
                                <Text style={styles.questionTitle}>{question.question}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </>
        );
    }

    render() {
        const { questions, isLoading } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    title="Cogniable Assessment"
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <ScrollView contentInsetAdjustmentBehavior="automatic">
                                {isLoading && <ActivityIndicator />}
                                {questions && questions.length > 0 && this.renderQuestion()}
                            </ScrollView>
                            {this.renderFooter()}
                        </>
                    )}
                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row style={{ flex: 1 }}>
                            <Column style={{ flex: 2 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    {this.renderQuestion()}
                                </ScrollView>
                            </Column>
                            <Column>
                                {this.renderSidebar()}
                            </Column>
                        </Row>
                    )}

                </Container>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    sidebarTitle: {
        fontSize: 16,
        marginVertical: 5,
        color: Color.black
    },
    card: {
        backgroundColor: Color.white,
        margin: 3,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderWidth: 1,
        borderColor: Color.white
    },
    questionImage: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        marginBottom: 5
    },
    questionTitle: {
        fontSize: 16,
        color: Color.black
    },

    scrollView: {
        padding: 10,
        marginBottom: 50
    },
    wrapperStyle: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    contentCenter: {
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 10,
        padding: 6,
        borderRadius: 6,
        borderColor: '#DCDCDC',
        borderWidth: 1,
        flexDirection: 'row'
    },
    genderBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        margin: 5,
        borderWidth: 1,
        paddingVertical: 30
    },
    footer: {
        height: 42,
        margin: 10,
        // backgroundColor: 'rgba(62, 123, 250, 0.05)',
        // position: 'absolute',
        borderColor: '#ccc',
        borderWidth: 0.5,
    },
    buttonNav: {
        borderRadius: 5,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },

    answerBox: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 5,
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 10
    },
    answerBoxNumber: {
        borderRadius: 5,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.grayWhite
    },
    answerBoxNumbeText: {
        color: "#63686E",
        fontSize: 20,
        fontWeight: 'bold'
    },
    answerBoxContent: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center'
    },
    answerBoxTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#45494E",
    },
    answerBoxSubtitle: {
        fontSize: 14,
        color: "#63686E",
    },


    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dotStyle: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    textStyle: {
        fontSize: 14,
        // paddingLeft: 5
    },
    connectionStyle: {
        backgroundColor: 'red',
        width: 2,
        flex: 1,
        // marginVertical: -4,
        marginLeft: 5
    },
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
    dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsCogniable);