import React, {Component} from 'react';

import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import {getStr} from '../../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetProgress from '../../../components/TargetProgress';
import QuestionSelectOption from '../../../components/screening/QuestionSelectOption';
import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';
import DateHelper from '../../../helpers/DateHelper';
import TokenRefresher from '../../../helpers/TokenRefresher';
import TherapistRequest from '../../../constants/TherapistRequest';

import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {setToken} from '../../../redux/actions/index';
import Button from '../../../components/Button';
import NoData from '../../../components/NoData';
import Carousel from 'react-native-snap-carousel';
import TargetResponse from '../../../components/TargetResponse';
import {peakEquReport} from '../../../constants/therapist';

const screenHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const screenWidth = Dimensions.get('window').width;

class equiquestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      questions: [],
      questionNum: 0,
      complete: 0,
      areas: {},
      result: {},
      student: {},
      firstName: '',
      lastName: '',
      answered: 0,
      currentIndex: 0,
      testIndex: 0,
      adjustment: 1,
      recAnswer: '',
      type: '',
      id: '',
      equiID: '',
      scoreEquivalance: 0,
      scoreReflexivity: 0,
      scoreSymmetry: 0,
      scoreTransivity: 0,
      equiQuestion: [],
      testQuestion: '',
      testId: '',
      programId: '',
      recordData: [],
      setAnsColor: -1,
      correctResponseText: '',
      inCorrectResponseText: '',
      category: '',
      selectedId: '',
      PKIDGRAPH: '',
      scoreTransivityReport: '',
      scoreEquivalanceReport: '',
      scoreReflexivityReport: '',
      scoreSymmetryReport: '',
    };
  }

  /*_refresh() {
        this.setState({ isLoading: false });
        this.componentDidMount();
    }*/

  componentDidMount() {
    let student = this.props.route.params.student;
    let pk = this.props.route.params.pk;
    let category = this.props.route.params.category;
    let selectedId = this.props.route.params.selectedId;
    let PKIDGRAPH = this.props.route.params.PKIDGRAPH;

    this.setState(
      {
        student: student,
        firstName: JSON.stringify(student.node.firstname),
        lastName: JSON.stringify(student.node.lastname),
        type: this.props.route.params.type,
        id: this.props.route.params.id,
        equiID: this.props.route.params.equiID,
        programId: pk,
        PKIDGRAPH: PKIDGRAPH,
        category: category,
        selectedId: selectedId,
      },
      () => {
        this.fetchEquiEquestion();
        this.fetchRecordData();
        this.fetchPeakEquiReport();
        this.PeakEquiGraph();
      },
    );

    console.log('SSSHSHSHSfff', +JSON.stringify(student.node.firstname));
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getAssessmentDetails();
  }

  handleEdit() {}

  getAssessmentDetails() {}
  PeakEquiGraph() {
    const {equiID, type} = this.state;

    let variables = {
      pk: equiID,
      peakType: type,
    };

    TherapistRequest.getEquiGraph(variables)
      .then((peakGraph) => {
        this.setState(
          {
            scoreTransivity: peakGraph.data.peakEquData[0].scoreTransivity,
            scoreEquivalance: peakGraph.data.peakEquData[0].scoreEquivalance,
            scoreReflexivity: peakGraph.data.peakEquData[0].scoreReflexivity,
            scoreSymmetry: peakGraph.data.peakEquData[0].scoreSymmetry,
          },
          () => {
            this.setState(
              {
                scoreTransivityReport:
                  this.state.scoreTransivity >= 2 ? true : false,
                scoreEquivalanceReport:
                  this.state.scoreEquivalance >= 2 ? true : false,
                scoreReflexivityReport:
                  this.state.scoreReflexivity >= 2 ? true : false,
                scoreSymmetryReport:
                  this.state.scoreSymmetry >= 2 ? true : false,
              },
              () => {},
            );

            // scoreTransivityReport = this.state.scoreTransivity == 2 ? true : false
            // scoreEquivalanceReport = this.state.scoreEquivalance == 2 ? true : false
            // scoreReflexivityReport = this.state.scoreReflexivity == 2 ? true : false
            // scoreSymmetryReport = this.state.scoreSymmetry == 2 ? true : false

            // //  ;

            // this.setState({finalStatus:[]},()=>{
            //
            //     status.push(scoreReflexivityReport)
            //     status.push(scoreSymmetryReport)
            //     status.push(scoreTransivityReport)
            //     status.push(scoreEquivalanceReport)
            //
            //     this.setState({finalStatus:status})
            // })
          },
        );

        //Adding Items To Array.

        // Showing the complete Array on Screen Using Alert.
        // Alert.alert(this.state.finalStatus.toString());
        console.log('thfddjsbnsm', this.state.scoreSymmetryReport);

        //   Alert.alert(JSON.stringify(peakPrograms))
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        // //  ;
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('GRAPGGGGHH', error.toString());
      });
  }

  fetchPeakEquiReport() {
    const {programId, id, type} = this.state;

    console.log('gydgidhdkd', type);

    let variables = {
      program: programId,
      peakType: type,
      domainid: id,
    };

    TherapistRequest.peakEquReport(variables)
      .then((peakEquReport) => {
        console.log('rerererertty', peakEquReport.data.peakEquivalance.edges);
      })
      .catch((error) => {
        console.log('EOEOEOEO', JSON.stringify(error));
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('Information', error.toString());
      });
  }

  fetchRecordData() {
    const {programId, equiID} = this.state;
    console.log('abcddd', programId, equiID);
    let variables = {
      pk: equiID,
    };

    TherapistRequest.peakEquData(variables)
      .then((peakEquData) => {
        this.setState(
          {recordData: peakEquData.data.peakEquDetails.records.edges},
          () => {
            const {
              currentIndex,
              equiQuestion,
              recordData,
              testIndex,
            } = this.state;
            let response = undefined;
            if (recordData.length > 0 && equiQuestion.length > 0) {
              let filterData = recordData.filter(
                (item) =>
                  item.node.test.id ==
                  equiQuestion[currentIndex].node.test.edges[testIndex].node.id,
              );
              if (filterData.length > 0) {
                response = filterData[0].node.response;
                this.setState({
                  setAnsColor:
                    response != undefined ? (response == true ? 0 : 1) : -1,
                });
              } else {
                this.setState({setAnsColor: -1});
              }
            }
          },
        );
      })
      .catch((error) => {
        console.log('EOEOEOEO', JSON.stringify(error));
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('Information', error.toString());
      });
  }

  fetchEquiEquestion() {
    let variables = {
      questionType: this.state.type,
      domain: this.state.id,
    };
    // //  ;
    TherapistRequest.getEquivilanceQuestion(variables)
      .then((peakPrograms) => {
        this.setState({equiQuestion: peakPrograms.data.peakEquQuestions.edges});
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('Information', error.toString());
      });
  }

  recordResponse = (questionId, answerId) => {
    const {pk} = this.props.route.params;
    let {result, answered, adjustment} = this.state;
    const newAnswered = answered + 1;
    let variables = {
      pk: pk,
      questionId: questionId,
      answerId: answerId,
    };

    TherapistRequest.recordResponseCogniable(variables).then((result) => {
      console.log(result.data);
      let nextQuestion = result.data.recordCogQuestion.nextQuestion;
      if (nextQuestion) {
        result[nextQuestion.id] = {recorded: false, response: null};
      } else {
        this.setState({
          complete: 1,
        });
      }
      this.setState({
        result: result,
        question: nextQuestion,
        answered: newAnswered,
      });
    });
  };

  prevQuestion = () => {
    this._carousel.snapToItem(0, false, () => {});
    // this.setState({setAnsColor: -1})

    const {recordData, currentIndex, equiQuestion, testIndex} = this.state;
    // console.log('index ==> ', testIndex - 1);
    if (testIndex == 1 || testIndex == 0) {
      this.setState({testIndex: 0});
    } else {
      this.setState({testIndex: testIndex - 1});
    }

    let newCurrentIndex = currentIndex - 1;
    // //  ;
    let response = undefined;
    if (recordData.length > 0 && equiQuestion.length > 0) {
      let filterData = recordData.filter(
        (item) =>
          item.node.test.id ==
          equiQuestion[newCurrentIndex].node.test.edges[testIndex].node.id,
      );
      if (filterData.length > 0) {
        response = filterData[0].node.response;
        this.setState({
          setAnsColor: response != undefined ? (response == true ? 0 : 1) : -1,
        });
      } else {
        this.setState({setAnsColor: -1});
      }
    }

    this.setState({
      currentIndex: newCurrentIndex,
      // question: equiquestion[equiquestion.length - newAdjustment].node.question,
      // recAnswer: questions[questions.length - newAdjustment].node.answer.id,
      // adjustment: newAdjustment
    });
  };

  nextQuestion = () => {
    this._carousel.snapToItem(0, false, () => {});
    // this.setState({setAnsColor: -1})

    const {
      equiQuestion,
      recordData,
      testIndex,
      currentIndex,
      adjustment,
    } = this.state;
    // console.log('index ==> ', testIndex + 1);
    this.setState({testIndex: testIndex + 1});
    let newCurrentIndex = currentIndex + 1;
    let response = undefined;
    // //  ;
    if (recordData.length > 0 && equiQuestion.length > 0) {
      let filterData = recordData.filter(
        (item) => {
          console.log("item", item)
          console.log("testIndex", testIndex)
            
          return item.node.test.id ==
          equiQuestion[newCurrentIndex].node.test.edges[testIndex].node.id
        }
      );
      if (filterData.length > 0) {
        response = filterData[0].node.response;
        this.setState({
          setAnsColor: response != undefined ? (response == true ? 0 : 1) : -1,
        });
      } else {
        this.setState({setAnsColor: -1});
      }
    }

    this.setState({setTextColor: -1});

    console.log('qqqqqqqqq ', newCurrentIndex);
    if (currentIndex >= 0 || currentIndex < equiQuestion.length) {
      this.setState({
        currentIndex: newCurrentIndex,
        testIndex: 0,
        // question: questions[questions.length - newAdjustment].node.question,
        // recAnswer: questions[questions.length - newAdjustment].node.answer.id,
        // adjustment: newAdjustment
      });
      //   //  ;
    } else {
    }
  };

  renderQuestion() {
    const {question, answered, result, recAnswer} = this.state;
    const {pk, student, areas, program} = this.props.route.params;

    console.log('Question: ', JSON.stringify(question));

    return (
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text
            style={[
              Styles.bigBlackText,
              {
                fontSize: 18,
                fontWeight: 'bold',
              },
            ]}>
            {'Learner : ' +
              student.node.firstname +
              ' ' +
              student.node.lastname}
          </Text>

          <View>
            <Text style={{fontSize: 10}}>Age: {question.age}</Text>
            <Text style={{fontSize: 10}}>Area: {question.area.name}</Text>
          </View>
        </View>
        {/* <Text>{JSON.stringify(question)}</Text> */}
        <Text
          style={[
            Styles.bigBlackText,
            {
              fontSize: 18,
              marginBottom: 5,
            },
          ]}>
          {question.code + ' - ' + question.question}
        </Text>
        <View
          style={{elevation: 11, backgroundColor: '#eee', marginBottom: 20}}>
          <Image
            source={require('../../../../android/img/cog.jpg')}
            style={{
              width: '100%',
              height: 200,
              padding: 5,
              resizeMode: 'contain',
              marginVertical: 8,
              borderRadius: 8,
            }}
          />
        </View>

        {question.options.edges.map((answer, index) => {
          let numbers = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
          let hasDescription =
            answer.node.description != null && answer.node.description != '';
          if (recAnswer == answer.node.id) {
            return (
              <TouchableOpacity
                onPress={() => this.recordResponse(question.id, answer.node.id)}
                key={index}
                activeOpacity={0.7}
                style={[styles.answerBox, {borderColor: Color.blueFill}]}>
                <View style={styles.answerBoxNumber}>
                  <Text
                    style={[
                      styles.answerBoxNumbeText,
                      {color: Color.blueFill},
                    ]}>
                    {numbers[index]}
                  </Text>
                </View>
                <View style={styles.answerBoxContent}>
                  <Text
                    style={[styles.answerBoxTitle, {color: Color.blueFill}]}>
                    {answer.node.name}
                  </Text>
                  {hasDescription && (
                    <Text
                      style={[
                        styles.answerBoxSubtitle,
                        {color: Color.blueFill},
                      ]}>
                      {answer.node.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                onPress={() => this.recordResponse(question.id, answer.node.id)}
                key={index}
                activeOpacity={0.7}
                style={styles.answerBox}>
                <View style={styles.answerBoxNumber}>
                  <Text style={styles.answerBoxNumbeText}>
                    {numbers[index]}
                  </Text>
                </View>
                <View style={styles.answerBoxContent}>
                  <Text style={styles.answerBoxTitle}>{answer.node.name}</Text>
                  {hasDescription && (
                    <Text style={styles.answerBoxSubtitle}>
                      {answer.node.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    );
  }

  endQuestions = () => {
    const {pk, student, areas, program} = this.props.route.params;
    let variables = {
      pk: pk,
      status: 'QuestionsCompleted',
    };
    TherapistRequest.endQuestionsAssessmentCogniable(variables).then(
      (result) => {
        this.props.navigation.navigate('AssessmentResultCogniable', {
          student: student,
          areas: areas,
          pk: pk,
          status: 'QuestionsCompleted',
          program: program,
        });
      },
    );
  };

  renderFooter() {
    let {
      category,
      type,
      equiID,
      PKIDGRAPH,
      programId,
      selectedId,
      scoreTransivityReport,
      scoreReflexivityReport,
      scoreEquivalanceReport,
      scoreSymmetryReport,
      student,
    } = this.state;

    console.log('DATATDATAD', category, programId);
    return (
      <>
        <View style={styles.footer}>
          <View style={Styles.rowBetween}>
            <View
              style={{
                flex: 1,
                backgroundColor: Color.grayWhite,
                height: 40,
                padding: 8,
              }}>
              <Text style={{color: Color.blueFill}}>
                Question {this.state.currentIndex + 1} of{' '}
                {this.state.equiQuestion.length}
              </Text>
            </View>
            <TouchableOpacity
              disabled={this.state.currentIndex <= 0 ? true : false}
              onPress={() => this.prevQuestion()}
              style={[
                styles.buttonNav,
                {
                  backgroundColor:
                    this.state.currentIndex > 0
                      ? Color.blueFill
                      : Color.grayFill,
                },
              ]}>
              <MaterialCommunityIcons
                name="chevron-left"
                color={Color.white}
                size={24}
              />
            </TouchableOpacity>

            <TouchableOpacity
              // disabled={(this.state.currentIndex + 2) > this.state.equiQuestion.length ? true : false}
              onPress={() => {
                if (
                  this.state.currentIndex + 2 >
                  this.state.equiQuestion.length
                ) {
                  this.PeakEquiGraph();

                  if (
                    scoreTransivityReport == true &&
                    scoreEquivalanceReport == true &&
                    scoreReflexivityReport == true &&
                    scoreSymmetryReport == true
                  ) {
                    this.props.navigation.navigate('EquiResult', {
                      student: student,
                      type: type,
                      equiID: equiID,
                      PKIDGRAPH: PKIDGRAPH,
                      selectID:
                        type == 'Basic' ? 0 : type == 'Intermediate' ? 1 : 2,
                    });
                  } else {
                    Alert.alert(
                      '',
                      'Are you want to continue Assessment for other types ?',
                      [
                        {
                          text: 'No',
                          onPress: () => {
                            this.props.navigation.navigate('EquiResult', {
                              student: student,
                              type: type,
                              PKIDGRAPH: PKIDGRAPH,
                              equiID: programId,
                              selectID:
                                type == 'Basic'
                                  ? 0
                                  : type == 'Intermediate'
                                  ? 1
                                  : 2,
                            });
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => {
                            this.props.navigation.navigate(
                              'equivalanceOption',
                              {
                                student: student,
                                category: category,
                                program: programId,
                                selectedId:
                                  type == 'Basic'
                                    ? 0
                                    : type == 'Intermediate'
                                    ? 1
                                    : 2,
                              },
                            );
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }
                } else {
                  this.nextQuestion();
                }
              }}
              style={[
                styles.buttonNav,
                {
                  backgroundColor:
                    this.state.currentIndex + 2 > this.state.equiQuestion.length
                      ? Color.blueFill
                      : Color.blueFill,
                },
              ]}>
              <MaterialCommunityIcons
                name="chevron-right"
                color={Color.white}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  renderCompleteScreen() {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
        <Text style={{flex: 1, fontSize: 24, fontWeight: '700'}}>
          Congratulations!!
        </Text>
        <Text style={{fontSize: 20}}>You have answered all the questions</Text>
        <TouchableOpacity
          onPress={this.endQuestions}
          style={{
            borderWidth: 2,
            marginVertical: 20,
            borderColor: Color.blueFill,
          }}>
          <Text style={{padding: 10, fontSize: 24, color: Color.blueFill}}>
            Move to Next Segment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({complete: 0});
            this.componentDidMount();
          }}
          style={{
            borderWidth: 2,
            marginVertical: 20,
            borderColor: Color.blueFill,
          }}>
          <Text style={{padding: 10, fontSize: 20, color: Color.blueFill}}>
            Click here to Edit Responses
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderStepItem = ({item, index}) => {
    const {testIndex, currentIndex, equiQuestion, recordData} = this.state;
    const currentQuestionData =
      equiQuestion.length > 0
        ? equiQuestion[currentIndex].node
        : {
            questionText: '',
            test: [],
          };

    return (
      <View style={{marginTop: 25, marginBottom: 5, width: screenWidth - 40}}>
        <Text
          style={{
            width: '100%',
            fontSize: 16,
            color: '#45494E',
            marginBottom: 10,
          }}>
          {currentQuestionData.questionText}
        </Text>
        <Text
          style={{
            color: '#63686E',
            fontSize: 12,
            marginBottom: 10,
          }}>
          TEST {index + 1} of {currentQuestionData.test.edges.length}
        </Text>
        <Text style={{width: '100%', fontSize: 16, color: '#45494E'}}>
          {item.node.name}{' '}
        </Text>
      </View>
    );
  };

  Item(props) {
    const {item, index, onPress, setColor} = props;

    console.log('ggguguuu', index);
    // this.setState({setAnsColor:-1})
    //quiQuestions[currentIndex].node.test.edges[testIndex].node.id

    return (
      <TouchableOpacity
        style={{marginHorizontal: 7}}
        onPress={() => onPress(index)}>
        <View
          style={[
            styles.correct,
            {
              marginTop: 1,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              // borderColor: setColor == index ? setColor == 0 ? Color.greenFill : Color.red : Color.white
              backgroundColor:
                setColor == index
                  ? setColor == 0
                    ? '#4BAEA0'
                    : '#FF8080'
                  : Color.white,
              borderColor: index == 0 ? '#4BAEA0' : '#FF8080',
            },
          ]}>
          <Text
            style={[
              styles.questionTitle,
              {
                color:
                  setColor != index
                    ? index == 1
                      ? '#FF8080'
                      : '#4BAEA0'
                    : Color.white,
              },
            ]}>
            {props.item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderView(item, index) {
    let rstyle = '',
      iconName = 'circle';
    // ////console.log("=================================");
    // ////console.log("item:"+JSON.stringify(item));
    // ////console.log("=================================");
    if (item.isSelected) {
      rstyle = eval('styles.incorrectItemSelected');
      iconName = 'dot-circle';
    }
    let childName = this.state.student.firstname;
    // item.key = item.key.replace('Child', childName);
    return (
      <TouchableOpacity
        onPress={() => this.selectIncorrectItem(index)}
        activeOpacity={0.8}
        style={[styles.itemView, rstyle]}>
        <FontAwesome5 name={iconName} style={[styles.itemIcon, rstyle]} />
        <Text style={[styles.itemText, rstyle]}>{item.key}</Text>
      </TouchableOpacity>
    );
  }

  PeakEquiResponse(boolean, questionID, testID) {
    console.log('ProgramIDDD', this.state.programId);
    const {targetList, currentIndex, equiID, testIndex} = this.state;
    // console.log('index ==> ', testIndex);
    let variables = {
      pk: equiID,
      question: questionID,
      test: testID,
      response: boolean,
    };

    TherapistRequest.recordPeakEquivalance(variables)
      .then((peakPrograms) => {
        console.log(
          'abcd',
          peakPrograms.data.recordPeakEquivalance.details.records.edges[0],
        );
        this.fetchRecordData();
      })
      .catch((error) => {
        // //  ;
        console.log('EOEOEOEO' + JSON.stringify(error));
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('Information', error.toString());
      });

    console.log('12121212' + boolean + questionID + testID);
  }

  render() {
    const {student} = this.props.route.params;

    console.log("current index", this.state.currentIndex)
     

    const {
      question,
      isLoading,
      complete,
      firstName,
      equiQuestion,
      testIndex,
    } = this.state;
    const Data = [1, 2, 3, 4, 5, 6];
    const Data1 = [
      student.node.firstname + 'gave an expected response',
      student.node.firstname + 'gave an unexpected response',
    ];
    // console.log('Data1 ---> ', Data1);
    // console.log('equiQuestion ---> ', equiQuestion);
    console.log('index ==> ', testIndex);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          title="Equivalance Assessment"
          backPress={() => this.props.navigation.goBack()}
        />
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 8,
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      marginTop: 5,
                      fontFamily: 'SF Pro Text',
                    }}>
                    {'Learner : ' +
                      student.node.firstname +
                      ' ' +
                      student.node.lastname}
                  </Text>

                  {/*<View>*/}
                  {/*    <Text style={{marginRight: 10, marginTop: 4, fontSize: 10}}>Age: 10 </Text>*/}
                  {/*    /!*<Text style={{fontSize:10}}>Area: {question.area.name}</Text>*!/*/}
                  {/*</View>*/}
                </View>

                <View
                  style={{
                    backgroundColor: '#eee',
                    elevation: 12,
                    borderRadius: 5,
                    marginBottom: 20,
                    marginTop: 10,
                  }}>
                  <Image
                    style={styles.peakImage}
                    source={require('../../../../android/img/peak.jpg')}
                  />
                </View>

                <Carousel
                  layout={'default'}
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={
                    this.state.equiQuestion.length > 0
                      ? this.state.equiQuestion[this.state.currentIndex].node
                          .test.edges
                      : []
                  }
                  renderItem={this._renderStepItem}
                  sliderWidth={screenWidth}
                  // firstItem={0}
                  itemWidth={screenWidth - 10}
                  onSnapToItem={(index) => {
                    // console.log('index ==> ', index);
                    this.setState({testIndex: index});
                    const {currentIndex, equiQuestion, recordData} = this.state;
                    let response = undefined;
                    if (recordData.length > 0 && equiQuestion.length > 0) {
                      let filterData = recordData.filter(
                        (item) =>
                          item.node.test.id ==
                          equiQuestion[currentIndex].node.test.edges[index].node
                            .id,
                      );
                      if (filterData.length > 0) {
                        response = filterData[0].node.response;
                        this.setState({
                          setAnsColor:
                            response != undefined
                              ? response == true
                                ? 0
                                : 1
                              : -1,
                        });
                      } else {
                        this.setState({setAnsColor: -1});
                      }
                    }
                  }}
                />

                <FlatList
                  style={{marginTop: 30}}
                  bounces
                  data={Data1}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <this.Item
                      item={item}
                      index={index}
                      setColor={this.state.setAnsColor}
                      onPress={(index) => {
                        if (index == 0) {
                          this.PeakEquiResponse(
                            true,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.id,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.test.edges[this.state.testIndex].node.id,
                          );
                        } else {
                          this.PeakEquiResponse(
                            false,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.id,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.test.edges[this.state.testIndex].node.id,
                          );
                        }
                      }}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />

                {isLoading && <ActivityIndicator />}
                {complete === 0 && question && this.renderQuestion()}
                {complete === 1 && this.renderCompleteScreen()}
              </ScrollView>
              {this.renderFooter()}
            </>
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 8,
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      marginTop: 5,
                      fontFamily: 'SF Pro Text',
                    }}>
                    {'Learner : ' +
                      student.node.firstname +
                      ' ' +
                      student.node.lastname}
                  </Text>

                  {/*<View>*/}
                  {/*    <Text style={{marginRight: 10, marginTop: 4, fontSize: 10}}>Age: 10 </Text>*/}
                  {/*    /!*<Text style={{fontSize:10}}>Area: {question.area.name}</Text>*!/*/}
                  {/*</View>*/}
                </View>

                <View
                  style={{
                    backgroundColor: '#eee',
                    elevation: 12,
                    borderRadius: 5,
                    marginBottom: 20,
                    marginTop: 10,
                  }}>
                  <Image
                    style={styles.peakImage}
                    source={require('../../../../android/img/peak.jpg')}
                  />
                </View>

                <Carousel
                  layout={'default'}
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={
                    this.state.equiQuestion.length > 0
                      ? this.state.equiQuestion[this.state.currentIndex].node
                          .test.edges
                      : []
                  }
                  renderItem={this._renderStepItem}
                  sliderWidth={screenWidth}
                  // firstItem={0}
                  itemWidth={screenWidth - 10}
                  onSnapToItem={(index) => {
                    this.setState({testIndex: index});
                    const {currentIndex, equiQuestion, recordData} = this.state;
                    let response = undefined;
                    if (recordData.length > 0 && equiQuestion.length > 0) {
                      let filterData = recordData.filter(
                        (item) =>
                          item.node.test.id ==
                          equiQuestion[currentIndex].node.test.edges[index].node
                            .id,
                      );
                      if (filterData.length > 0) {
                        response = filterData[0].node.response;
                        this.setState({
                          setAnsColor:
                            response != undefined
                              ? response == true
                                ? 0
                                : 1
                              : -1,
                        });
                      } else {
                        this.setState({setAnsColor: -1});
                      }
                    }
                  }}
                />

                <FlatList
                  style={{marginTop: 30}}
                  bounces
                  data={Data1}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <this.Item
                      item={item}
                      index={index}
                      setColor={this.state.setAnsColor}
                      onPress={(index) => {
                        if (index == 0) {
                          this.PeakEquiResponse(
                            true,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.id,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.test.edges[this.state.testIndex].node.id,
                          );
                        } else {
                          this.PeakEquiResponse(
                            false,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.id,
                            this.state.equiQuestion[this.state.currentIndex]
                              .node.test.edges[this.state.testIndex].node.id,
                          );
                        }
                      }}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />

                {isLoading && <ActivityIndicator />}
                {complete === 0 && question && this.renderQuestion()}
                {complete === 1 && this.renderCompleteScreen()}
              </ScrollView>
              {this.renderFooter()}
            </>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sidebarTitle: {
    fontSize: 16,
    marginVertical: 5,
    color: Color.black,
  },
  outsideBlock: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    // flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  card: {
    backgroundColor: Color.white,
    margin: 3,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderWidth: 1,
    borderColor: Color.white,
  },
  questionImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  questionTitle: {
    fontSize: 16,
    color: Color.black,
  },

  scrollView: {
    padding: 10,
    marginBottom: 50,
  },
  wrapperStyle: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
    padding: 6,
    borderRadius: 6,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flexDirection: 'row',
  },
  genderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
    borderWidth: 1,
    paddingVertical: 30,
  },
  footer: {
    height: 42,
    margin: 10,
    // backgroundColor: 'rgba(62, 123, 250, 0.05)',
    // position: 'absolute',
    borderColor: '#ccc',
    borderWidth: 0.5,
  },

  SquareShapeView: {
    backgroundColor: Color.white,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: Color.gray,
  },
  buttonNav: {
    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  answerBox: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 5,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  answerBoxNumber: {
    borderRadius: 5,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.grayWhite,
  },
  answerBoxNumbeText: {
    color: '#63686E',
    fontSize: 20,
    fontWeight: 'bold',
  },
  answerBoxContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  answerBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#45494E',
  },
  answerBoxSubtitle: {
    fontSize: 14,
    color: '#63686E',
  },

  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    marginLeft: 5,
  },
  header: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  headerImage: {
    width: width / 12,
    height: width / 12,
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentBox: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  textBig: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 10,
  },
  studentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 0.5,
    // borderColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
    // padding: 10
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  studentImage: {
    width: width / 10,
    height: width / 10,
    borderRadius: 4,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: Color.silver,
  },
  dot: {
    height: width / 55,
    width: width / 55,
    backgroundColor: Color.silver,
    borderRadius: width / 55,
    marginHorizontal: 8,
  },
  correct: {
    paddingVertical: 16,
    marginVertical: 10,
    textAlign: 'center',
    borderWidth: 1.2,
    borderColor: '#4BAEA0',
    borderRadius: 4,
    // backgroundColor: '#ffffff',
    color: '#4BAEA0',
    fontSize: 13,
  },
  incorrect: {
    paddingVertical: 16,
    marginVertical: 10,
    textAlign: 'center',
    borderWidth: 1.2,
    borderColor: '#FF8080',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    color: '#FF8080',
    fontSize: 13,
  },
  peakImage: {
    width: '85%',
    height: OrientationHelper.getDeviceOrientation() == 'landscape' ? 250 : 200,
    borderRadius: 5,
    paddingVertical: 16,
    padding: 5,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(equiquestion);
