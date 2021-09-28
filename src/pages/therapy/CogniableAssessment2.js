
import React, { Component } from 'react';

import { Alert, ActivityIndicator, Dimensions, Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import Color from '../../utility/Color';
import Styles from '../../utility/Style';
import { getStr } from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetProgress from '../../components/TargetProgress';
import QuestionSelectOption from '../../components/screening/QuestionSelectOption';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import ParentRequest from '../../constants/ParentRequest';

import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { setToken } from '../../redux/actions/index';
import Button from '../../components/Button';
import LoadingIndicator from '../../components/LoadingIndicator';

import NoData from '../../components/NoData';

const screenHeight = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

class CogniableAssessment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSaving: false,
            questions: [],
            totalQuestions: 10,
            answers: [],
            answeredCount: 0,
            questionNum: 1,
            currentIndex: 0,
            preAssessId: null,
            assessmentObject: null
        }
        this.callBack = this.callBack.bind(this);
    }
    _refresh() {
        this.setState({ isLoading: false });
        this.componentDidMount();
    }

    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        console.log(JSON.stringify(this.props))
        console.log( this.props.route.params.pk)
        this.setState({ preAssessId: this.props.route.params.pk }, ()=>{
            this.getAssessmentDetails()
        });
        
        // this.fetchQuestions();
        
    }

    getAssessmentDetails() {
        this.setState({ isLoading: true });
        let variables = {
            id: this.state.preAssessId
        }
        console.log(variables)
        ParentRequest.getAssessmentDetails(variables).then(assessmentData => {
            console.log("assessmentData", JSON.stringify( assessmentData));
            this.setState({ isLoading: false });
            let assessment = assessmentData.data.getCogniableAssessDetail;
            let len = 10;//assessment.assessmentQuestions.edges.length;
            console.log(len)
            this.setState({
                assessmentObject: assessment,
                totalQuestions: len
            })
            if(len > 0) {
                this.getFirstQuestion();
            } else {
                Alert.alert(
					'Information',
					'Unable to get Assessment Question at the moment',
					[{
						text: 'OK', onPress: () => {
							console.log('OK Pressed');
                            this.props.navigation.goBack();
						}
					}],
					{ cancelable: false }
				);
            }
            

        }).catch(error => {
            console.log("-----------"+error, error.response);
            this.setState({ isLoading: false });
        });
    }
    getFirstQuestion() {
        this.setState({ isLoading: true });
        let { route } = this.props;
        let variables = {
            studentId: route.params.studentId
        }
        console.log(variables)
        ParentRequest.getCogniFirstQuestion(variables).then(firstQuestionData => {
            console.log("firstQuestionData", firstQuestionData);
            this.setState({ isLoading: false });
            if(firstQuestionData 
                && firstQuestionData.data
                && firstQuestionData.data.getCogQuestion
                && firstQuestionData.data.getCogQuestion.question != null) {
                    let questions = this.state.questions;
                    // questions.push(firstQuestionData.data.getCogQuestion.question);

                    // Temp logic
                    for(let i=0; i<10; i++) {
                        questions.push(firstQuestionData.data.getCogQuestion.question);
                    }


                    this.setState({questions: questions})
            } else {
                Alert.alert(
					'Information',
					'Unable to get Assessment Question at the moment',
					[{
						text: 'OK', onPress: () => {
							console.log('OK Pressed');
                            this.props.navigation.goBack();
						}
					}],
					{ cancelable: false }
				);
            }
            // this.setState({assessmentObject: assessmentData.data.getCogniableAssessDetail})

        }).catch(error => {
            console.log("-----------"+error, error.response);
            this.setState({ isLoading: false });
        });
    }
    fetchQuestions() {
        this.setState({ isLoading: true });

        ParentRequest.fetchCogniableAssessmentQuestions().then(dataResult => {
            console.log("dataResult", dataResult);

            let answers = [];
            let tempQuestions = [];
            dataResult.data.cogniableAssessQuestions.map((question) => {
                // console.log(question.options.edges.length);
                if (question.options.edges.length > 0) {
                    answers.push(null);
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
            });
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
    recordPreAssess(question, answer, index, isSkipped) {
        let variables = {};
        if(isSkipped) {
            variables.pk = this.state.preAssessId;
            variables.question = question.id;
            variables.answer = "null";
        } else {
            variables.pk = this.state.preAssessId;
            variables.question = question.id;
            variables.answer = answer.node.id;
        }

        this.setState({ isSaving: true })
        
        ParentRequest.getNextQuestion(variables).then(dataResult => {
            console.log("screeningRecordPreAssess", JSON.stringify(dataResult));
            let recordCogQuestion = dataResult.data.recordCogQuestion;
            console.log(recordCogQuestion.status)
            let stateQuestions = this.state.questions;
            if(recordCogQuestion.nextQuestion) {
                console.log("Next Question: "+JSON.stringify( recordCogQuestion.nextQuestion))
                
                stateQuestions[index + 1] = recordCogQuestion.nextQuestion;
                console.log(1);
            }
            console.log(2);
            this.setState({ isSaving: false, questions: stateQuestions });
            console.log(3);
        }).catch(error => {
            console.log("Next question error: "+error, error.response);
            this.setState({ isSaving: false });
        });
    }
    selectAnswer(question, answer, index) {
        let answers = this.state.answers;
        // if (answers[index]) {
        //     Alert.alert("Warning", "Sorry you cannot change answer");
        // } else {
            console.log("answer.node.id: "+answer.node.id)
            answers[index] = answer.node.id;

            this.setState({ answers });

            this.recordPreAssess(question, answer, index);

            this.nextQuestion();
            this.setAnsweredCount();
        // }
    }

    skipAssessment() {
        let { navigation, route } = this.props;
        let data = {
            pk: this.state.preAssessId,
            therapyId: route.params.therapyId,
            studentId: route.params.studentId
        }
        console.log(data)
        Alert.alert(
            'Skip Assessment',
            'Are you sure want to skip assessment ?',
            [{
                text: 'Yes', onPress: () => {
                    console.log('OK Pressed');
                    // this.props.navigation.navigate("AssessmentResults", data)
                }
            },{ text: 'No', onPress: () => { } }],
            { cancelable: false }
        );
    }
    setAnsweredCount() {
        let answers = this.state.answers;
        let count = 0;    
        for (let index = 0; index < answers.length; index++) {
            console.log(typeof(answers[index]))
            if(typeof(answers[index]) === 'string'){
                console.log("increase the count")
                count++;
            }            
        }
        console.log("increase the count:"+count)
        this.setState({answeredCount: count})
        // return count;
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
        this.setAnsweredCount();
    }

    nextQuestion() {
        let questionNum = this.state.questionNum;
        let questions = this.state.questions;
        if (questionNum < questions.length) {
            let currentIndex = this.state.currentIndex;
            console.log(questionNum);
            let question = questions[currentIndex];
            let isSkipped = true;
            this.recordPreAssess(question, null, currentIndex, isSkipped)
            questionNum++;
            currentIndex++;

            this.setState({ questionNum, currentIndex });

            console.log(this.state.answers.length)
        } else if (questionNum === questions.length) {
            let { navigation, route } = this.props;
            let data = {
                pk: this.state.preAssessId,
                therapyId: route.params.therapyId,
                studentId: route.params.studentId
            }
            console.log(data)

            Alert.alert(
                'Cogniable Assessment',
                "Thank you for performing assessment",
                [{
                    text: 'OK', onPress: () => {
                        console.log('OK Pressed');
                        this.props.navigation.navigate("AssessmentResults", data)
                    }
                }],
                { cancelable: false }
            );


        }
    }

    renderQuestion() {
        let { questionNum, questions, answers, isSaving, currentIndex, answeredCount } = this.state;

        let indexArr = currentIndex;
        let selectedQuestion = null;
        let selectedAnswer = null;
        selectedQuestion = questions[currentIndex];
        selectedAnswer = answers[currentIndex];
        return (
            <>
                {selectedQuestion && (
                    <ScrollView style={styles.scrollView}>
                        <Text style={[Styles.bigBlackText, { fontSize: 18 }]}>{currentIndex + 1} - {selectedQuestion.question}</Text>
                        <Image source={require('../../../android/img/question.png')}
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
        let { questionNum, totalQuestions, answers, answeredCount } = this.state;
        console.log(answers)
        let lastAnswerStatus = this.isLastAnswerFilled();

        let indexArr = questionNum - 1;
        let lastAnswer = answers[indexArr];

        let isFirst = questionNum == 1;
        let isLast = (questionNum == totalQuestions);

        let isCanNext = isLast || lastAnswerStatus;
        // console.log(isFirst)
        // console.log(isLast)
        // console.log(isCanNext)
        // console.log({ isLast, lastAnswerStatus, isCanNext });

        let percentage = answeredCount / totalQuestions * 100;

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
                        <TouchableOpacity style={{flex: 1}} onPress={()=> {
                            this.skipAssessment()
                        }}>
                            <Text style={{backgroundColor:Color.blueFill, paddingTop: 10, color: '#FFFF', borderRadius: 4, height: 40, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
                                Skip Assessment
                            </Text>
                        </TouchableOpacity>
                        {/* <View style={{ flex: 1, backgroundColor: Color.grayWhite, height: 40, padding: 8 }}>
                            <Text style={{ color: Color.blueFill }}>{answeredCount} of {totalQuestions} Answered</Text>
                            <View style={{ width: '100%', height: 2, backgroundColor: Color.gray }}>
                                <View style={{ width: percentage + '%', height: 2, backgroundColor: Color.blueFill }} />
                            </View>
                        </View> */}
                        <TouchableOpacity
                            onPress={() => this.prevQuestion()}
                            style={[styles.buttonNav, { backgroundColor:Color.blueFill }]}>
                            <MaterialCommunityIcons
                                name="chevron-left"
                                color={Color.white}
                                size={24}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            
                            onPress={() => this.nextQuestion()}
                            style={[styles.buttonNav, { backgroundColor: Color.blueFill }]}>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                color={Color.white}
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
                                <Image source={require('../../../android/img/question.png')}
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
                                {this.renderQuestion()}
                                {this.state.isLoading && <LoadingIndicator />}
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

export default connect(mapStateToProps, mapDispatchToProps)(CogniableAssessment);