import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken} from '../../../redux/actions/index';
import {connect} from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TherapistRequest from '../../../constants/TherapistRequest';
import LoadingIndicator from '../../../components/LoadingIndicator';
import Button from '../../../components/Button';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class PeakScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      program: {},
      isLoading: false,
      current: 1,
      total: 10,
      isImageAvailale: true,
      correctResponseText: '',
      inCorrectResponseText: '',
      questionaireData: [],
      currentQuestionNumber: 1,
      isInLandscape: false,
      isFetchedData: false,
      trails: [],
      currentTrailNumber: 1,
      trailQuestionText:
        'Present Kunal with a toy and ask “What do you do with this toy?”',
      trailDescription:
        'Describing the question in a couple of text lines to explain Describing the question in a',
      expectedResponseText:
        'Describing the question in a couple of text lines to explain Describing the question in a couple of text lines',

      correctResponses: [],
      incorrectResponses: [],
      currentQuestionStatus: {},
    };
  }

  _refresh() {
    this.setState({isLoading: false});
    // this.componentDidMount();
  }

  componentDidMount() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;

    let studentName = 'Child';
    if (student) {
      studentName = student.node.firstname;
    }

    let isInLandscape = false;
    if (this.props.route.params && this.props.route.params.isInLandscape) {
      isInLandscape = this.props.route.params.isInLandscape;
    }

    this.setState({
      program: program,
      student: student,
      isInLandscape: isInLandscape,
      correctResponseText: studentName + ' gave an expected response',
      inCorrectResponseText: studentName + ' gave an unexpected response',
    });

    this.processTrails();
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getPeakDirectQuestionaire();
  }

  getPeakDirectQuestionaire() {
    this.setState({isLoading: true});

    const {category, programID} = this.props.route.params;
    this.setState({isLoading: true});
    let variables = {
      peakType: category,
    };
    let currentQuestion = 1;

    TherapistRequest.getPeakDirectQuestionaire(variables)
      .then((questionsData) => {
        let questions = questionsData.data.peakGetCodes.edges;
        console.log('peak questionaire:' + questions.length);
        if (questions.length > 0) {
          // isFetchedData: false,
          this.setState({
            questionaireData: questionsData.data.peakGetCodes.edges,
            isFetchedData: true,
            total: questions.length,
          });
          let {correctResponses, incorrectResponses} = this.state;
          let vars = {
            program: programID,
          };
          TherapistRequest.peakScoreDetails(vars)
            .then((result) => {
              console.log(JSON.stringify(result));
              let yes = result.data.peakDataSummary.edges[0].node.yes.edges;
              let no = result.data.peakDataSummary.edges[0].node.no.edges;
              for (let y = 0; y < yes.length; y++) {
                correctResponses.push(yes[y].node.id);
                this.isQuestionAnswered(yes[y].node.id);
              }
              for (let z = 0; z < no.length; z++) {
                incorrectResponses.push(no[z].node.id);
                this.isQuestionAnswered(no[z].node.id);
              }
              /*this.setState({
                        correctResponses: correctResponses,
                        incorrectResponses: incorrectResponses
                    })*/
              for (let x = 0; x < questions.length; x++) {
                console.log('Question ID: ', questions[x].node.id);
                console.log('Correct Responses: ', correctResponses);
                console.log('Incorrect Responses: ', incorrectResponses);
                if (
                  correctResponses.includes(questions[x].node.id) ||
                  incorrectResponses.includes(questions[x].node.id)
                ) {
                  currentQuestion += 1;
                }
              }
              this.setState({
                currentQuestionNumber: currentQuestion,
                isLoading: false,
              });
            })
            .catch((err) => {
              this.setState({isLoading: false});
            });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  processTrails() {
    let tempTrailsArray = [];
    for (let index = 0; index < 10; index++) {
      let trail = {};
      trail.index = index;
      trail.trailQuestionText = this.state.trailQuestionText;
      trail.trailDescription = this.state.trailDescription;
      trail.expectedResponseText = this.state.expectedResponseText;
      tempTrailsArray.push(trail);
    }
    this.setState({trails: tempTrailsArray});
  }

  renderQuestionaireLandscape() {
    let {
      questionaireData,
      currentQuestionNumber,
      correctResponseText,
      inCorrectResponseText,
      isImageAvailale,
      currentQuestionStatus,
    } = this.state;
    // console.log(currentQuestionNumber + "==============" + questionaireData.length)
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: '#FFFFFF'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._refresh.bind(this)}
          />
        }>
        {questionaireData.map((question, index) => {
          if (currentQuestionNumber - 1 == index) {
            return (
              <>
                <View style={styles.questionView}>
                  {isImageAvailale && (
                    <Image
                      style={[styles.peakImage, {resizeMode: 'stretch'}]}
                      source={require('../../../../android/img/peak.jpg')}
                    />
                  )}

                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 16, fontWeight: '700'}}>
                        {question.node.code}
                      </Text>
                    </View>
                    <Text style={[styles.questionText, {width: '40%'}]}>
                      {question.node.instructions}
                    </Text>
                  </View>
                  <Text>{'T - ' + (index + 1)}</Text>
                  <Text style={styles.trailDescription}>
                    {question.node.description}
                  </Text>
                  <Text style={styles.expectedResponseTitle}>
                    Expected Response
                  </Text>
                  <Text style={styles.expectedResponseText}>
                    {question.node.expRes}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.selectResponse('correct', question.node.id);
                    }}>
                    <Text
                      style={[
                        styles.correct,
                        currentQuestionStatus.isCorrectSelected
                          ? styles.correctSelected
                          : '',
                      ]}>
                      {correctResponseText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.selectResponse('incorrect', question.node.id);
                    }}>
                    <Text
                      style={[
                        styles.incorrect,
                        currentQuestionStatus.isIncorrectSelected
                          ? styles.inCorrectSelected
                          : '',
                      ]}>
                      {inCorrectResponseText}
                    </Text>
                  </TouchableOpacity>
                  <View style={{width: '100%'}}>{this.renderProgress()}</View>
                  <TouchableOpacity
                    style={{
                      width: 150,
                      position: 'absolute',
                      right: 0,
                      bottom: -50,
                    }}
                    onPress={() => {
                      this.submitAssessment();
                      this.props.navigation.navigate('PeakPrograms', {
                        student: this.state.student,
                        program: this.state.program,
                      });
                    }}>
                    <Text
                      style={{
                        backgroundColor: Color.blueFill,
                        paddingTop: 10,
                        color: '#FFFF',
                        borderRadius: 4,
                        height: 40,
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      Quit Assessment
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          }
        })}
      </ScrollView>
    );
  }
  selectResponse(type, questionId) {
    const {programID} = this.props.route.params;
    let {correctResponses, incorrectResponses} = this.state;
    if (type === 'correct') {
      const index = incorrectResponses.indexOf(questionId);
      if (index > -1) {
        incorrectResponses.splice(index, 1);
      }
      console.log(correctResponses.indexOf(questionId));
      if (correctResponses.indexOf(questionId) == -1) {
        correctResponses.push(questionId);
      }
      this.isQuestionAnswered(questionId);
    }
    if (type === 'incorrect') {
      const index = correctResponses.indexOf(questionId);
      if (index > -1) {
        correctResponses.splice(index, 1);
      }
      console.log(incorrectResponses.indexOf(questionId));
      if (incorrectResponses.indexOf(questionId) == -1) {
        incorrectResponses.push(questionId);
      }
      this.isQuestionAnswered(questionId);
    }
    let vars = {
      programId: programID,
      correctIds: correctResponses,
      inCorrectIds: incorrectResponses,
    };

    TherapistRequest.submitPeakAssessment(vars).then((result) => {
      console.log('After Marking Question: ', result);
    });
    this.moveTrail('next');
  }

  isQuestionAnswered(questionId) {
    let {correctResponses, incorrectResponses} = this.state;
    let response = {
      isQuestionAnswered: false,
      isCorrectSelected: false,
      isIncorrectSelected: false,
    };
    console.log(correctResponses.indexOf(questionId));
    if (correctResponses.indexOf(questionId) > -1) {
      response.isQuestionAnswered = true;
      response.isCorrectSelected = true;
    } else if (incorrectResponses.indexOf(questionId) > -1) {
      response.isQuestionAnswered = true;
      response.isIncorrectSelected = true;
    }
    this.setState({currentQuestionStatus: response});
    // return response;
  }
  renderQuestionaire() {
    let {
      questionaireData,
      student,
      currentQuestionNumber,
      correctResponseText,
      inCorrectResponseText,
      isImageAvailale,
      currentQuestionStatus,
    } = this.state;
    //  console.log(currentQuestionNumber+","+questionaireData.length)

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: '#FFFFFF'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._refresh.bind(this)}
          />
        }>
        {questionaireData.map((question, index) => {
          if (currentQuestionNumber - 1 == index) {
            // let questionStatus = this.isQuestionAnswered(question.node.id);
            return (
              <>
                <View style={styles.questionView}>
                  <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        fontFamily: 'SF Pro Text',
                      }}>
                      {'Learner : ' +
                        student.node.firstname +
                        ' ' +
                        student.node.lastname}
                    </Text>
                  </View>
                  {isImageAvailale && (
                    <View
                      style={{
                        backgroundColor: '#eee',
                        elevation: 12,
                        borderRadius: 5,
                        marginBottom: 20,
                      }}>
                      <Image
                        style={[styles.peakImage, {resizeMode: 'stretch'}]}
                        source={require('../../../../android/img/peak.jpg')}
                      />
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        fontFamily: 'SF Pro Text',
                      }}>
                      {question.node.code + ' - ' + question.node.instructions}
                    </Text>
                    {/* <Text style={styles.questionText}>{question.node.instructions}</Text> */}
                  </View>

                  <Text style={styles.trailDescription}>
                    {question.node.description}
                  </Text>

                  <Text style={styles.expectedResponseTitle}>
                    Expected Response
                  </Text>
                  <Text style={styles.expectedResponseText}>
                    {question.node.expRes}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.selectResponse('correct', question.node.id);
                    }}>
                    <Text
                      style={[
                        styles.correct,
                        currentQuestionStatus.isCorrectSelected
                          ? styles.correctSelected
                          : '',
                      ]}>
                      {correctResponseText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.selectResponse('incorrect', question.node.id);
                    }}>
                    <Text
                      style={[
                        styles.incorrect,
                        currentQuestionStatus.isIncorrectSelected
                          ? styles.inCorrectSelected
                          : '',
                      ]}>
                      {inCorrectResponseText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          }
        })}
      </ScrollView>
    );
  }
  renderTrail() {
    let {
      trails,
      currentTrailNumber,
      correctResponseText,
      inCorrectResponseText,
      isImageAvailale,
    } = this.state;
    // console.log(currentTrailNumber+","+trails.length)
    return trails.map((element, index) => {
      if (currentTrailNumber - 1 == index) {
        return (
          <>
            <View style={styles.trailView}>
              <View style={{flexDirection: 'row'}}>
                <Text>{'T - ' + (element.index + 1)}</Text>
                <View style={styles.dot} />
                <Text style={{color: 'rgba(95, 95, 95, 0.75)'}}>
                  {'TRIAL 6 OF 10'}
                </Text>
              </View>
              <Text style={styles.questionText}>
                {element.trailQuestionText}
              </Text>
              <Text style={styles.trailDescription}>
                {element.trailDescription}
              </Text>
              {isImageAvailale && (
                <Image
                  style={styles.peakImage}
                  source={require('../../../../android/img/Image.png')}
                />
              )}
              <Text style={styles.expectedResponseTitle}>
                Expected Response
              </Text>
              <Text style={styles.expectedResponseText}>
                {element.expectedResponseText}
              </Text>

              <Text style={styles.correct}>{correctResponseText}</Text>
              <Text style={styles.incorrect}>{inCorrectResponseText}</Text>
            </View>
          </>
        );
      }
    });
  }
  moveTrail(type) {
    let {
      trails,
      current,
      currentQuestionNumber,
      currentTrailNumber,
      total,
      questionaireData,
    } = this.state;
    if (type === 'previous') {
      if (currentQuestionNumber > 1) {
        let previousQuestionNumber = currentQuestionNumber - 1;
        this.setState(
          {
            currentQuestionNumber: previousQuestionNumber,
            current: current - 1,
            currentQuestionStatus: {},
          },
          () => {
            console.log('Previous:' + previousQuestionNumber);
            let currentIndex = previousQuestionNumber - 1;
            console.log('Previous:' + currentIndex);
            let currentQuestion = questionaireData[currentIndex];
            this.isQuestionAnswered(currentQuestion.node.id);
          },
        );
      }
    } else if (type === 'next') {
      console.log(currentQuestionNumber, total, 'kkkkkkkkkkkkkkkkkkkkkkkkk');
      if (currentQuestionNumber === total) {
        this.props.navigation.navigate('PeakScoreScreen', {
          student: this.state.student,
          program: this.state.program,
        });
      }
      if (currentQuestionNumber < total) {
        let nextQuestionNumber = currentQuestionNumber + 1;
        this.setState(
          {
            currentQuestionNumber: nextQuestionNumber,
            current: current + 1,
            currentQuestionStatus: {},
          },
          () => {
            console.log('Next:' + nextQuestionNumber);
            let currentIndex = nextQuestionNumber - 1;
            console.log('Next:' + currentIndex);
            let currentQuestion = questionaireData[currentIndex];
            this.isQuestionAnswered(currentQuestion.node.id);
          },
        );
      }
    }
  }
  renderProgress() {
    let {current, total, correctResponses, incorrectResponses} = this.state;
    console.log('correctResponses.length --> ', correctResponses.length);
    console.log('incorrectResponses.length --> ', incorrectResponses.length);
    let answered = correctResponses.length + incorrectResponses.length;
    let percentage = 100 / total;
    let progressPercentage = answered * percentage;
    const {student, program} = this.props.route.params;

    return (
      <>
        <View style={styles.targetBlock}>
          <View style={styles.targetView}>
            <Text style={styles.targetText}>
              Answered {answered} of {this.state.total}
            </Text>
            <View style={styles.targetProgress}>
              <View
                style={[
                  styles.targetProgressColor,
                  {width: progressPercentage + '%'},
                ]}></View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.moveTrail('previous');
            }}>
            <Text style={styles.arrowButton}>
              <FontAwesome5
                name={'chevron-left'}
                style={styles.arrowButtonText}
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.moveTrail('next');
            }}>
            <Text style={styles.arrowButton}>
              <FontAwesome5
                name={'chevron-right'}
                style={styles.arrowButtonText}
              />
            </Text>
          </TouchableOpacity>
        </View>
        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
          <Button
            labelButton="Quit Assessment"
            onPress={() => {
              this.submitAssessment();
              this.props.navigation.navigate('PeakPrograms', {
                student: student,
                program: program,
              });
            }}
          />
        )}
      </>
      // </View>
    );
  }

  showNextQuestions() {
    let {
      questionaireData,
      currentQuestionNumber,
      correctResponseText,
      inCorrectResponseText,
      isImageAvailale,
    } = this.state;
    // console.log(currentQuestionNumber+","+questionaireData.length)
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: '#FFFFFF'}}>
        <Text style={{marginVertical: 10, color: Color.blackFont}}>
          Next Questions
        </Text>
        {questionaireData.map((question, index) => {
          if (currentQuestionNumber - 1 < index) {
            return (
              <>
                <View style={styles.questionView}>
                  {isImageAvailale && (
                    <Image
                      style={styles.peakImage}
                      source={require('../../../../android/img/peak.jpg')}
                    />
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <Text>{'T - ' + (index + 1)}</Text>
                  </View>
                  <Text style={styles.questionText}>
                    {question.node.instructions}
                  </Text>
                </View>
              </>
            );
          }
        })}
      </ScrollView>
    );
  }
  callSubmitAssessment() {
    const {programID} = this.props.route.params;
    const {correctResponses, incorrectResponses} = this.state;
    console.log('Program is in  peek screen is -->' + programID);
    this.setState({isLoading: true});
    let vars = {
      programId: programID,
      correctIds: correctResponses,
      inCorrectIds: incorrectResponses,
    };

    TherapistRequest.submitPeakAssessment(vars)
      .then((result) => {
        let variables = {
          program: programID,
        };

        TherapistRequest.peakFinishAssessment(variables)
          .then((response) => {
            this.setState({isLoading: false});
            console.log('peak submit response:' + JSON.stringify(response));
            /*let data = {
                    student: this.state.student,
                    targets: response.data.peakSubmitResponse.details
                };*/
            //this.props.navigation.navigate("PeakSuggestedTargets", data)

            console.log(
              'before peakscore screen forward student -->' +
                JSON.stringify(this.state.student),
            );
            console.log(
              'before peakscore screen forward  program-->' +
                JSON.stringify(this.state.program),
            );

            this.props.navigation.navigate('PeakScoreScreen', {
              student: this.state.student,
              program: this.state.program.node,
              pk: this.state.program.node.id,
            });
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
            this.setState({isLoading: false});
          });
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.setState({isLoading: false});
      });
  }

  submitAssessment() {
    let {navigation, route} = this.props;
    let data = {student: this.state.student};
    console.log(data);
    Alert.alert(
      'Submit Assessment',
      'Are you sure want to submit assessment ?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('No Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            console.log('Yes Pressed');
            //this.props.navigation.navigate('PeakScoreScreen', data)
            this.callSubmitAssessment();
          },
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    let {
      isLoading,
      isInLandscape,
      isFetchedData,
      currentQuestionNumber,
    } = this.state;
    console.log('currentQuestionNumber ---> ', currentQuestionNumber);
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="PEAK"
          enable={this.props.disableNavigation != true}
          disabledTitle={true}
        />

        {isLoading && <LoadingIndicator />}

        {!isLoading && (
          <Container enablePadding={this.props.disableNavigation != true}>
            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
              <>
                {this.renderQuestionaire()}

                {this.renderProgress()}
              </>
            )}

            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <>
                <Row style={{flex: 1}}>
                  <Column style={{flex: 2}}>
                    {isFetchedData && this.renderQuestionaireLandscape()}
                  </Column>
                  <Column style={{flex: 1}}>
                    {isFetchedData && this.showNextQuestions()}
                  </Column>
                </Row>
              </>
            )}
          </Container>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  trailView: {
    // margin: 10,
    borderColor: '#000',
    borderWidth: 0.2,
    marginTop: 10,
    marginBottom: 100,
    padding: 10,
    borderRadius: 5,
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
  trailDescription: {
    paddingVertical: 10,
  },
  questionText: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    // lineHeight: 12,
    color: '#45494E',
    // paddingVertical: 10,
    fontFamily: 'SF Pro Text',
    // paddingLeft:10
  },
  expectedResponseTitle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#63686E',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  expectedResponseText: {
    // paddingVertical: 10
  },
  dot: {
    height: screenWidth / 55,
    width: screenWidth / 55,
    backgroundColor: Color.silver,
    borderRadius: screenWidth / 55,
    marginHorizontal: 8,
    marginTop: 5,
  },
  questionView: {
    marginTop: 10,
    marginBottom: 100,
  },

  peakImage: {
    width: '98%',
    height: OrientationHelper.getDeviceOrientation() == 'landscape' ? 300 : 200,
    borderRadius: 5,
    paddingVertical: 16,
    padding: 5,
    alignSelf: 'center',
    resizeMode: 'cover',
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
  correctSelected: {
    backgroundColor: '#4BAEA0',
    color: '#FFF',
  },
  inCorrectSelected: {
    backgroundColor: '#FF8080',
    color: '#FFF',
  },

  // Target blocks
  targetBlock: {
    flexDirection: 'row',
    width: '94%',
    paddingVertical: 10,
  },
  targetView: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 40,

    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    borderColor: 'rgba(62, 123, 250, 0.05)',
    //borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
  },
  targetText: {
    paddingBottom: 5,
    color: '#3E7BFA',
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  targetProgress: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(95, 95, 95, 0.1)',
  },
  targetProgressColor: {
    height: 2,
    backgroundColor: '#3E7BFA',
  },
  arrowButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
  arrowButtonText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeakScreen);
