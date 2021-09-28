import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import DateHelper from '../../../helpers/DateHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TimelineView from '../../../components/TimelineView';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setAssessmentData,
} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import store from '../../../redux/store';
import axios from 'axios';
import {getStr} from '../../../../locales/Locale';
import DateInput from '../../../components/DateInput';

const width = Dimensions.get('window').width;

class ScreeningPreliminaryAssess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,

      name: '',
      age: '',
      sex: '',
      phone: '',
      email: '',
      address: '',
      dob: moment().subtract(1, 'year').format('YYYY-MM-DD'),

      currentLanguage: 'English',

      // name: 'Arif',
      // age: '10 yrs',
      // sex: 'Male',
      // phone: '123456789',
      // email: 'niteesh@cogniable.com',
      // address: 'Jakarta, Indonesia',

      isSavingInitialData: false,
      isStartedPreAssess: false,
      preAssessId: null,

      questionNum: 1,
      questions: [],
			answers: [],
			showWarning: false,
			showemailWarning: false
    };

    let parentScreen = store.getState().autismScreening;
    console.log("parent screen =-=-=-=-=-=-=-=-=-=-=-=-",parentScreen);
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    //Call this on every page
    console.log("store", store.getState())
    console.log("student", this.props.route.params.student)
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getLanguage();
  }

  getLanguage() {
    let variables = {
      studentId: this.props.route.params.student ? this.props.route.params.student.node.id : store.getState().user.student.id,
    };
    console.log('Vars', variables);
    ParentRequest.fetchUserProfile(variables)
      .then((profileData) => {
        console.log('fetchUserProfile', profileData);
        this.setState(
          {
            currentLanguage: profileData.data.student.language
              ? profileData.data.student.language.name
              : 'English',
          },
          () => {
            this.getData();
          },
        );
      })
      .catch((error) => {
        console.log(error, error.response);

        Alert.alert('Information', error.toString());
      });
  }

  getData() {
    this.setState({isLoading: true});

    let vars = {
      language: this.state.currentLanguage,
    };

    console.log('Vars', vars);

    ParentRequest.screeningGetPreAssessQuestion(vars)
      .then((dataResult) => {
        console.log('screeningGetPreAssessQuestion', dataResult);

        let answers = [];
        let questions = dataResult.data.preAssessQuestions.map((question) => {
          answers.push(null);
          return question;
        });

        this.setState({
          isLoading: false,
          questions,
          answers,
          // questionNum: 7
        });

        if (questions.length == 0) {
          Alert.alert(
            'Information',
            'No Question data retrieved from server.',
            [
              {
                text: 'Go Back',
                onPress: () => {
                  if (this.props.disableNavigation) {
                    let parentScreen = store.getState().autismScreening;
                    if (parentScreen) {
                      parentScreen.setState({
                        activeNumber: 0,
                        tabletView: 'assessment',
                        tabletIsStartShowingContent: true,
                      });
                    }
                  } else {
                    this.props.navigation.goBack();
                  }
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          this.getSubmittedData();
        }
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  getSubmittedData() {
    let parentScreen = store.getState().autismScreening;
    if (parentScreen) {
      let screeningId = parentScreen.state.screeningId;
      if (screeningId != null) {
        this.setState({isLoading: true});

        let variables = {
          id: parentScreen.state.screeningId,
        };

        ParentRequest.screeningGetRecordedAssess(variables)
          .then((dataResult) => {
            console.log('screeningGetRecordedAssess', dataResult);

            let detail = dataResult.data.getPreAssessDetail;

            this.setState({
              questionNum: 7,
              preAssessId: screeningId,
              isLoading: false,
              isSavingInitialData: false,
              name: detail.name,
              age: detail.age,
              sex: detail.sex,
              phone: detail.phone,
              email: detail.email,
              address: detail.address,
            });

            if (detail.assessmentQuestions.edges.length != 0) {
              let submittedQuestions = detail.assessmentQuestions.edges;
              console.log('Questions', this.state.questions);
              console.log('Submitted Questions', submittedQuestions);

              let answers = [];
              this.state.questions.forEach((question) => {
                let ada = false;
                let answer = null;

                for (let j = 0; j < submittedQuestions.length; j++) {
                  let submittedQuestion = submittedQuestions[j];
                  if (question.id == submittedQuestion.node.question.id) {
                    ada = true;
                    answer = submittedQuestion.node.answer.id;
                    break;
                  }
                }

                answers.push(answer);
              });

              this.setState({answers});
            }
          })
          .catch((err) => {});
      } else {
        console.log('ScreeningID is null');
      }
    }
  }

  startPreAssess() {
    if (this.state.preAssessId == null) {
      this.setState({isStartedPreAssess: true, isSavingInitialData: true});

      let a = moment();
      let b = moment('1990-02-08');
      let age = moment.duration(a.diff(b));
      let years = age.years();
      let months = age.months();
      let days = age.days();

      let ageLong = years + 'y ' + months + 'm ' + days + 'd';

      let variables = {
        name: this.state.name,
        age: ageLong,
        sex: this.state.sex,
        phone: this.state.phone,
        email: this.state.email,
        address: this.state.address,
      };

      ParentRequest.screeningStartPreAssess(variables)
        .then((dataResult) => {
          console.log('screeningStartPreAssess', dataResult);
          let preAssessId = dataResult.data.startPreAssess.details.id;
          this.props.dispatchSetAssessmentData(preAssessId);

          let parentScreen = store.getState().autismScreening;
          if (parentScreen) {
            parentScreen.setState({screeningId: preAssessId});
          }

          this.setState({preAssessId, isSavingInitialData: false});
        })
        .catch((error) => {
          console.log(error, error.response);
          Alert.alert('Error', error.toString());
          this.setState({isSavingInitialData: false, questionNum: 6});
        });
    }
  }

  recordPreAssess(question, answerId, answerNumber) {
    let variables = {
      pk: this.state.preAssessId,
      question: question.id,
      // answer: answer.node.id,
      answer: answerId,
    };
    return ParentRequest.screeningRecordPreAssess(variables);
  }

  renderAssessment() {
    let {
      name,
      age,
      sex,
      phone,
      email,
      address,
      questionNum,
      questions,
      answers,
      isSaving,
    } = this.state;

    let indexArr = 0;
    let selectedQuestion = null;
    let selectedAnswer = null;
    if (questionNum > 6) {
      indexArr = questionNum - 7;
      selectedQuestion = questions[indexArr];
      selectedAnswer = answers[indexArr];
    }

    if (this.state.isSavingInitialData) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={Color.primary} />
        </View>
      );
    }

    return (
      <>
        {questionNum == 1 && (
          <View style={styles.contentCenter}>
            <Text style={Styles.bigBlackText}>
              {getStr('ScreeningPreliAss.FullName')}
            </Text>
            <Text style={[Styles.grayText, {fontSize: 12}]}>
              {getStr('ScreeningPreliAss.EnterFullName')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={getStr('ScreeningPreliAss.FullName')}
              autoFocus={true}
              defaultValue={name}
              onChangeText={(name) => this.setState({name})}
            />
          </View>
        )}
        {questionNum == 2 && (
          <View style={styles.contentCenter}>
            <Text style={Styles.bigBlackText}>
              {getStr('ScreeningPreliAss.Gender')}
            </Text>
            <Text style={[Styles.grayText, {fontSize: 12, marginBottom: 8}]}>
              {getStr('ScreeningPreliAss.SelectGender')}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  styles.genderBox,
                  {backgroundColor: '#F5F8FF', borderColor: Color.blueFill},
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  this.setState({sex: 'Male'});
                  this.nextQuestion();
                }}>
                <Image
                  source={require('../../../../android/img/screening-male.png')}
                  style={{width: 100, height: 100}}
                />
                <Text
                  style={[
                    Styles.grayText,
                    {fontSize: 16, color: Color.blueFill},
                  ]}>
                  MALE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderBox,
                  {backgroundColor: '#FFF8F9', borderColor: '#FA98AF'},
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  this.setState({sex: 'Female'});
                  this.nextQuestion();
                }}>
                <Image
                  source={require('../../../../android/img/screening-female.png')}
                  style={{width: 100, height: 100}}
                />
                <Text
                  style={[Styles.grayText, {fontSize: 16, color: '#FA98AF'}]}>
                  FEMALE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {questionNum == 3 && (
          <View style={styles.contentCenter}>
            <Text style={Styles.bigBlackText}>
              {getStr('ScreeningPreliAss.Age')}
            </Text>
            <Text style={[Styles.grayText, {fontSize: 12}]}>
              {' '}
              {getStr('ScreeningPreliAss.enterage')}
            </Text>
            {/* <TextInput style={styles.input}
                            placeholder={getStr('ScreeningPreliAss.Age')}
                            defaultValue={age}
                            autoFocus={true}
                            keyboardType='numeric'
                            onChangeText={(age) => this.setState({ age })}
                        /> */}
            <DateInput
              format="YYYY-MM-DD"
              displayFormat="DD MMM YYYY"
							value={this.state.dob}
              minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 5))}
              maxDate={new Date()}
              onChange={(dob) => {
                console.log('result', dob);
                console.log('result', new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
                if(new Date(dob) > new Date(new Date().setFullYear(new Date().getFullYear() - 5)) ) {
                  this.setState({dob, age: dob});
                }
              }}
            />
          </View>
        )}
        {questionNum == 4 && (
          <View style={styles.contentCenter}>
            <Text style={Styles.bigBlackText}>
              {getStr('ScreeningPreliAss.Phone')}
            </Text>
            <Text style={[Styles.grayText, {fontSize: 12}]}>
              {getStr('ScreeningPreliAss.enterNo')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={getStr('ScreeningPreliAss.Phone')}
              defaultValue={phone}
							autoFocus={true}
							maxLength={12}
              keyboardType="phone-pad"
              onChangeText={(phone) => {
								const reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

								console.log("regex test", reg.test(phone))
								this.setState({phone})

								if(reg.test(phone) === true) {
									if(phone && phone.length > 9) {
										this.setState({showWarning: false})
									} else {
										this.setState({showWarning: true})
									}
								} else {
									if(phone && phone.length > 5) {
										this.setState({showWarning: true})
									} else {
										this.setState({showWarning: false})
									}
								}
							}}
            />
						{this.state.showWarning && <Text style={{color: 'red'}}>please enter valid number</Text>}
          </View>
        )}
        {questionNum == 5 && (
          <View style={styles.contentCenter}>
            <Text style={Styles.bigBlackText}>
              {getStr('ScreeningPreliAss.Email')}
            </Text>
            <Text style={[Styles.grayText, {fontSize: 12}]}>
              {getStr('ScreeningPreliAss.enterEmail')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={getStr('ScreeningPreliAss.Email')}
              defaultValue={email}
              autoFocus={true}
							onChangeText={(email) => {
								const emailReg =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
								
								this.setState({email})

								console.log("email reg",emailReg.test(email))

								if(emailReg.test(email) === true) {
									this.setState({showemailWarning: false})
								} else {
									this.setState({showemailWarning: true})
								}
							}}
            />
						{this.state.showemailWarning && <Text style={{color: 'red'}}>enter valid email</Text>}
          </View>
        )}
        {questionNum == 6 && (
          <View style={styles.contentCenter}>
            <Text style={Styles.bigBlackText}>
              {getStr('ScreeningPreliAss.Address')}
            </Text>
            <Text style={[Styles.grayText, {fontSize: 12}]}>
              {getStr('ScreeningPreliAss.enterAddress')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={getStr('ScreeningPreliAss.Address')}
              defaultValue={address}
              autoFocus={true}
              onChangeText={(address) => this.setState({address})}
            />
          </View>
        )}
        {selectedQuestion && (
          <ScrollView>
            <Text style={[Styles.bigBlackText, {fontSize: 18}]}>
              {selectedQuestion.question}
            </Text>
            <Image
              source={require('../../../../android/img/autism-screening.jpeg')}
              style={{
                width: '100%',
                height: 200,
                resizeMode: 'cover',
                marginVertical: 8,
                borderRadius: 8,
              }}
            />
            {/* {isSaving && (
                            <View style={{ marginVertical: 30 }}>
                                <ActivityIndicator color={Color.blueFill} size='large' />
                            </View>
                        )} */}
            {selectedQuestion.options.edges.map((answer, index) => {
              let numbers = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
              let hasDescription =
                answer.node.description != null &&
                answer.node.description != '';
              if (selectedAnswer == answer.node.id) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.selectAnswer(selectedQuestion, answer, indexArr)
                    }
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
                        style={[
                          styles.answerBoxTitle,
                          {color: Color.blueFill},
                        ]}>
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
                    onPress={() =>
                      this.selectAnswer(selectedQuestion, answer, indexArr)
                    }
                    key={index}
                    activeOpacity={0.7}
                    style={styles.answerBox}>
                    <View style={styles.answerBoxNumber}>
                      <Text style={styles.answerBoxNumbeText}>
                        {numbers[index]}
                      </Text>
                    </View>
                    <View style={styles.answerBoxContent}>
                      <Text style={styles.answerBoxTitle}>
                        {answer.node.name}
                      </Text>
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
        )}
      </>
    );
  }

  selectAnswer(question, answer, index) {
    let answers = this.state.answers;
    // if (answers[index]) {
    //     Alert.alert("Warning", "Sorry you cannot change answer");
    // } else {
    answers[index] = answer.node.id;
    this.setState({answers});

    //this.recordPreAssess(question, answer);

    this.nextQuestion();
    // }
  }

  async submitAssessment() {
    this.setState({isSaving: true});

    let {questions, answers} = this.state;

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let answer = answers[i];

      try {
        let data = await this.recordPreAssess(question, answer, i);

        console.log(data);
      } catch (err) {
        Alert.alert('Warning', err.toString());
        this.setState({isSaving: false});
        return;
      }
    }

    this.setState({isSaving: false});

    //refresh list screen
    // let parentScreen = store.getState().autismScreening;
    // if (parentScreen) {
    //     parentScreen.setState({ activeNumber: 1, tabletView: 'instruction' });
    // }
    let parentScreen = store.getState().autismScreening;


    if (parentScreen) {
      // parentScreen.setState({ activeNumber: 3, tabletView: 'result' });
      parentScreen.getData();
    }

    if (this.props.disableNavigation) {
    } else {
      this.props.navigation.goBack();

      setTimeout(() => {
        this.props.navigation.navigate('ScreeningResultWaiting', {
          screeningId: store.getState().autismScreening?.state?.screeningId,
          student: this.props.route.params.student
        });
      }, 1000);
    }
  }

  prevQuestion() {
    let questionNum = this.state.questionNum;
    questionNum--;
    if (questionNum < 1) {
      questionNum = 1;
    }
    this.setState({questionNum});
  }

  nextQuestion() {
    let questionNum = this.state.questionNum;

    if (questionNum == 6 && this.state.isStartedPreAssess == false) {
      this.startPreAssess();
    }

    questionNum++;
    if (questionNum > this.state.questions.length + 6) {
      questionNum = this.state.questions.length + 6;
    }
    this.setState({questionNum});
  }

  isLastAnswerFilled() {
    let {
      name,
      age,
      sex,
      phone,
      email,
      address,
      questionNum,
      answers,
    } = this.state;

    if (questionNum == 1) {
      return name != '';
    } else if (questionNum == 2) {
      return sex != '';
    } else if (questionNum == 3) {
      return age != '';
    } else if (questionNum == 4) {
      return phone != '' && phone.length > 9 && !this.state.showWarning;
    } else if (questionNum == 5) {
      return email != '' && !this.state.showemailWarning;
    } else if (questionNum == 6) {
      return address != '';
    } else {
      let indexArr = questionNum - 7;
      let lastAnswer = answers[indexArr];
      return lastAnswer != null;
    }
  }

  renderFooter() {
    let {questionNum, questions, answers} = this.state;

    let lastAnswerStatus = this.isLastAnswerFilled();

    let indexArr = questionNum - 7;
    let lastAnswer = answers[indexArr];

    let isFirst = questionNum == 1;
    let isLast = questionNum == questions.length + 6;
    let isCanNext = isLast || lastAnswerStatus;

    //console.log({ isLast, lastAnswerStatus, isCanNext });

    let percentage = (questionNum / (questions.length + 6)) * 100;

    if (questionNum == questions.length + 6 && lastAnswerStatus) {
      return (
        <>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <Button
              isLoading={this.state.isSaving}
              labelButton="Submit Assessment"
              onPress={() => {
                this.submitAssessment();
              }}
              style={{marginBottom: 10}}
            />
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <Row>
              <Column></Column>
              <Column>
                <Button
                  isLoading={this.state.isSaving}
                  labelButton="Submit Assessment"
                  onPress={() => {
                    this.submitAssessment();
                  }}
                  style={{marginBottom: 10}}
                />
              </Column>
            </Row>
          )}
        </>
      );
    }

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
                {questionNum} of {questions.length + 6}{' '}
                {getStr('ScreeningPreliAss.Answered')}
              </Text>
              <View
                style={{width: '100%', height: 2, backgroundColor: Color.gray}}>
                <View
                  style={{
                    width: percentage + '%',
                    height: 2,
                    backgroundColor: Color.blueFill,
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              disabled={isFirst ? true : false}
              onPress={() => this.prevQuestion()}
              style={[
                styles.buttonNav,
                {backgroundColor: isFirst ? Color.grayWhite : Color.blueFill},
              ]}>
              <MaterialCommunityIcons
                name="chevron-left"
                color={isFirst ? Color.gray : Color.white}
                size={24}
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isCanNext ? true : false}
              onPress={() => this.nextQuestion()}
              style={[
                styles.buttonNav,
                {
                  backgroundColor: !isCanNext
                    ? Color.grayWhite
                    : Color.blueFill,
                },
              ]}>
              <MaterialCommunityIcons
                name="chevron-right"
                color={!isCanNext ? Color.gray : Color.white}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={getStr('homeScreenAutism.PreliminaryAssessment')}
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
        />

        {this.state.isLoading && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <ActivityIndicator color={Color.primary} size="large" />
          </View>
        )}

        {!this.state.isLoading && (
          <Container enablePadding={this.props.disableNavigation != true}>
            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
              <>
                {this.renderAssessment()}

                {this.renderFooter()}
              </>
            )}

            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <>
                {this.renderAssessment()}

                {this.renderFooter()}
              </>
            )}
          </Container>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
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
    height: 50,
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
    textAlign: 'center',
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
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
  dispatchSetAssessmentData: (data) => dispatch(setAssessmentData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScreeningPreliminaryAssess);
