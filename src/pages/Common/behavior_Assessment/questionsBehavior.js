
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

class QuestionsBehavior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            questions: [],
            questionNum: 0,
            complete:0,
            areas:{},
            result: {},
            answered: 0,
            currentIndex:0,
            adjustment:1,
            recAnswer:''
        }
    }
    /*_refresh() {
        this.setState({ isLoading: false });
        this.componentDidMount();
    }*/

    componentDidMount() {
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getAssessmentDetails();
    }

    handleEdit() {


    }

    getAssessmentDetails() {
        const { result } = this.state;
        const { pk, areas } = this.props.route.params;
        const areasObj = {}
        const resObject = {}
        let nextQuestion = null
        this.setState({
            isLoading: true
        });

        if(areas.length > 0){
            for(let i=0; i<areas.length; i++){
                areasObj[areas[i].id] = {recorded: false, response: null}
            }
        }

        this.setState({
            areas: areasObj
        })

        let variables = {
            pk: pk
        }

        TherapistRequest.getBehaQuestion(variables).then(result => {
            console.log("999ugdhdd"+JSON.stringify(result.data.behQuestions.edges[1].questions));
            let questions = result.data.behQuestions.edges;
            if(questions.length > 0) {
                for(let i=0; i< questions.length; i++){
                    resObject[questions[i].node.question.id] = {recorded: true, response: questions[i].node}
                }

                let lastQuestionId = questions[questions.length - 1].node.question.id;
                let vars = {
                    pk: pk,
                    questionId: lastQuestionId
                }
                TherapistRequest.recordResponseCogniable(vars).then(result => {
                    nextQuestion  = result.data.recordCogQuestion.nextQuestion
                    if(nextQuestion) {
                        resObject[nextQuestion.id] = {recorded: false, response: null}
                    } else {
                        this.setState({
                            complete:1
                        })
                    }
                    this.setState({
                        result: resObject,
                        question: nextQuestion,
                        answered: questions.length,
                        questions: questions
                    })
                }).catch(error => console.log(error))
            } else {
                const { student } = this.props.route.params;
                let variables = {
                    studentId: student.node.id
                }
                TherapistRequest.getCogniableFirstQuestion(variables).then(result => {
                    nextQuestion = result.data.getCogQuestion.question;
                    resObject[nextQuestion.id] = { recorded: false, response: null }
                    this.setState({
                        result: resObject,
                        question: nextQuestion
                    })
                }).catch(error => console.log(error))
            }
        }).catch(error => console.log(error))
        this.setState({
            isLoading: false
        })
    }

    recordResponse = (questionId, answerId) => {
        const { pk } = this.props.route.params;
        let { result, answered, adjustment } = this.state;
        const newAnswered = answered + 1;
        let variables = {
            pk: pk,
            questionId: questionId,
            answerId: answerId
        }

        TherapistRequest.recordResponseCogniable(variables).then(result => {
            console.log(result.data)
            let nextQuestion  = result.data.recordCogQuestion.nextQuestion
            if(nextQuestion) {
                result[nextQuestion.id] = {recorded: false, response: null}
            } else {
                this.setState({
                    complete: 1
                })
            }
            this.setState({
                result: result,
                question: nextQuestion,
                answered: newAnswered
            })
        })
    }

    prevQuestion = () => {
        const { questions, question, adjustment } = this.state;
        let newAdjustment = adjustment + 1;
        console.log("Questions: ", JSON.stringify(questions));
        this.setState({
            question: questions[questions.length - newAdjustment].node.question,
            recAnswer: questions[questions.length - newAdjustment].node.answer.id,
            adjustment: newAdjustment
        })
    }

    nextQuestion = () => {
        const { questions, question, adjustment } = this.state;
        let newAdjustment = adjustment - 1;
        console.log("Questions: ", JSON.stringify(questions));
        if(adjustment > 1) {
            this.setState({
                question: questions[questions.length - newAdjustment].node.question,
                recAnswer: questions[questions.length - newAdjustment].node.answer.id,
                adjustment: newAdjustment
            })
        } else {
            this.setState({
                question: questions[questions.length - newAdjustment].node.question,
                recAnswer: '',
                adjustment: newAdjustment
            })
        }
    }

    renderQuestion() {
        const { question, answered, result, recAnswer } = this.state;
        const { pk, student, areas, program } = this.props.route.params;

        console.log("Question: ", JSON.stringify(question));

        return(
            <ScrollView style={styles.scrollView}>
                <View style={{ flexDirection:'row', justifyContent:'space-between',marginBottom:10 }}>
                    <Text style={[Styles.bigBlackText, { fontSize: 18,fontWeight:'bold'}]}>{"Learner : "+student.node.firstname+" "+student.node.lastname}</Text>

                    <View>
                        <Text style={{fontSize:10}}>Age: { question.age}</Text>
                        <Text style={{fontSize:10}}>Area: {question.area.name}</Text>
                    </View>

                </View>
                <Text style={[Styles.bigBlackText, { fontSize: 18 ,marginBottom:5}]}>{question.code+" - "+question.question}</Text>
                <View style={{elevation:11,backgroundColor:'#eee',marginBottom:20}}>
                    <Image source={require('../../../../android/img/cog.jpg')}
                           style={{ width: "100%", height: 200,padding:5, resizeMode: 'contain', marginVertical: 8, borderRadius: 8 }} />
                </View>

                {question.options.edges.map((answer, index) => {
                    let numbers = ["A", "B", "C", "D", "E", "F", "G"];
                    let hasDescription = (answer.node.description != null && answer.node.description != "");
                    if (recAnswer == answer.node.id) {
                        return (
                            <TouchableOpacity onPress={() => this.recordResponse(question.id, answer.node.id)} key={index}
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
                            <TouchableOpacity onPress={() => this.recordResponse(question.id, answer.node.id)} key={index}
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
        )
    }

    endQuestions = () => {
        const { pk, student, areas, program } = this.props.route.params;
        let variables = {
            pk: pk,
            status: 'QuestionsCompleted'
        }
        TherapistRequest.endQuestionsAssessmentCogniable(variables).then(result=> {
            this.props.navigation.navigate('AssessmentResultCogniable', {
                student: student,
                areas: areas,
                pk: pk,
                status:'QuestionsCompleted',
                program: program
            });
        })
    }

    renderFooter() {
        let { questionNum, questions, answered, adjustment } = this.state;
        return (
            <>
                <View style={styles.footer}>
                    <View style={Styles.rowBetween}>
                        <View style={{ flex: 1, backgroundColor: Color.grayWhite, height: 40, padding: 8 }}>
                            <Text style={{ color: Color.blueFill }}>Answered {answered} Questions</Text>
                        </View>
                        <TouchableOpacity
                            disabled={questions.length <= 1 || adjustment >= questions.length ? true : false}
                            onPress={() => this.prevQuestion()}
                            style={[styles.buttonNav, { backgroundColor: questions.length <= 1 || adjustment >= questions.length ? Color.grayFill : Color.blueFill }]}>
                            <MaterialCommunityIcons
                                name="chevron-left"
                                color={Color.white}
                                size={24}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={adjustment <= 1 ? true: false}
                            onPress={() => this.nextQuestion()}
                            style={[styles.buttonNav, { backgroundColor: adjustment <= 1 ? Color.grayFill : Color.blueFill }]}>
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

    renderCompleteScreen() {
        return(
            <View style={{ justifyContent:'center', alignItems:'center', marginTop:40 }}>
                <Text style={{ flex:1, fontSize:24, fontWeight:'700',}}>Congratulations!!</Text>
                <Text style={{ fontSize:20 }}>You have answered all the questions</Text>
                <TouchableOpacity onPress={this.endQuestions} style={{ borderWidth:2, marginVertical:20, borderColor:Color.blueFill }}>
                    <Text style={{ padding:10, fontSize:24, color:Color.blueFill}}>Move to Next Segment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this.setState({complete:0});
                    this.componentDidMount()
                }} style={{ borderWidth:2, marginVertical:20, borderColor:Color.blueFill }}>
                    <Text style={{ padding:10, fontSize:20, color:Color.blueFill }}>Click here to Edit Responses</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { question, isLoading, complete } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    title="Behaviourl Assessment"
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <ScrollView contentInsetAdjustmentBehavior="automatic">
                                {isLoading && <ActivityIndicator />}
                                {complete === 0 && question && this.renderQuestion()}
                                {complete === 1 && this.renderCompleteScreen()}
                            </ScrollView>
                            {complete === 0 && this.renderFooter()}
                        </>
                    )}
                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row style={{ flex: 1 }}>
                            <Column style={{ flex: 2 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    {isLoading && <ActivityIndicator />}
                                    {question && this.renderQuestion()}
                                </ScrollView>
                            </Column>
                            <Column>

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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsBehavior);
