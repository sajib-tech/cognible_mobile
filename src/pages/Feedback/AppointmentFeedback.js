import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Modal,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Slider from 'react-native-slider';

import store from '../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';

import _ from 'lodash';
import NavigationHeader from '../../components/NavigationHeader';
import Color from '../../utility/Color';
import {Container} from '../../components/GridSystem';
import ParentRequest from '../../constants/ParentRequest';
import LoadingIndicator from '../../components/LoadingIndicator';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Tab from '../../components/Tab';

class AppointmentFeedback extends Component {
  constructor(props) {
    super(props);

    let userType = store.getState().user.userType.name;
    console.log('UserType', userType);

    this.state = {
      isLoading: false,
      isSendingFeedback: false,
      feedbackQuestions: [],

      parentQuestions: [],
      parentAnswers: [],
      therapistQuestions: [],
      therapistAnswers: [],
      appointment: this.props.route.params,
      tabNum: 0,
      type: userType,
      isEdit: false,
    };
  }

  componentDidMount() {
    console.log(this.props.route.params);
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});
    let vars = {
      appointmentId: this.state.appointment.node.id,
    };
    console.log('Vars', vars);
    ParentRequest.getFeedbackQuestion(vars)
      .then((result) => {
        console.log('getFeedbackQuestion', result);
        let feedbackQuestions = result.data.feedbackQuestions.edges;
        let parentQuestions = [];
        let therapistQuestions = [];
        let parentAnswers = [];
        let therapistAnswers = [];

        feedbackQuestions.forEach((item) => {
          if (item.node.group.name == 'therapist') {
            therapistQuestions.push(item);

            if (this.state.type == 'therapist') {
              if (item.node.type == 'rating') {
                therapistAnswers.push(5);
              } else {
                therapistAnswers.push('');
              }
            }
          } else {
            parentQuestions.push(item);

            if (this.state.type == 'parents') {
              if (item.node.type == 'rating') {
                parentAnswers.push(5);
              } else {
                parentAnswers.push('');
              }
            }
          }
        });

        this.setState(
          {
            feedbackQuestions,
            parentQuestions,
            therapistQuestions,
            parentAnswers,
            therapistAnswers,
            isLoading: false,
          },
          () => {
            //fill existing feedback
            let appointment = this.state.appointment;
            let answerSet = appointment.node.feedbackanswersSet;
            let isEdit = false;
            answerSet.forEach((answer, key) => {
              if (answer.feedbackUser.id == store.getState().user.id) {
                isEdit = true;
              }

              console.log('Answer', answer);
              if (answer.question.group.name == 'therapist') {
                //find question
                therapistQuestions.forEach((question, keyQ) => {
                  if (question.node.id == answer.question.id) {
                    therapistAnswers[keyQ] =
                      answer.question.type == 'rating'
                        ? answer.answerRating
                        : answer.answerText;
                  }
                });
              }

              if (answer.question.group.name == 'parents') {
                //find question
                parentQuestions.forEach((question, keyQ) => {
                  if (question.node.id == answer.question.id) {
                    parentAnswers[keyQ] =
                      answer.question.type == 'rating'
                        ? answer.answerRating
                        : answer.answerText;
                  }
                });
              }
            });

            this.setState({therapistAnswers, parentAnswers, isEdit});
          },
        );
      })
      .catch((error) => {
        console.log('Err', JSON.parse(JSON.stringify(error)));
        Alert.alert('Information', error.toString());
        this.setState({isLoading: false});
      });
  }

  submitAnswer() {
    this.setState({isSendingFeedback: true});
    let feedbackQuestions =
      this.state.type == 'therapist'
        ? this.state.therapistQuestions
        : this.state.parentQuestions;
    let feedbackAnswers =
      this.state.type == 'therapist'
        ? this.state.therapistAnswers
        : this.state.parentAnswers;
    let variables = {
      appointmentId: this.state.appointment.node.id,
      answers: feedbackAnswers.map((answer, key) => {
        let question = feedbackQuestions[key];
        if (question.node.type == 'rating') {
          return {
            questionId: question.node.id,
            answerRating: parseInt(answer),
          };
        } else {
          return {
            questionId: question.node.id,
            answerText: answer,
          };
        }
      }),
    };
    console.log('Vars', variables);

    let promise = null;
    if (this.state.isEdit) {
      promise = ParentRequest.updateAppointmentFeedback(variables);
    } else {
      promise = ParentRequest.createAppointmentFeedback(variables);
    }

    // console.log("VarsStr", JSON.stringify(variables));
    promise
      .then((res) => {
        this.setState({isSendingFeedback: false});
        if (this.state.isEdit) {
          Alert.alert('Information', 'Feedback successfully updated');
        } else {
          Alert.alert('Information', 'Feedback successfully sent');
        }
        this.props.navigation.goBack();
      })
      .catch((error) => {
        this.setState({isSendingFeedback: false});
        console.log(error, JSON.parse(JSON.stringify(error)));

        Alert.alert('Information', error.toString());
      });
  }

  render() {
    let {
      isLoading,
      therapistQuestions,
      parentQuestions,
      parentAnswers,
      therapistAnswers,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="Feedback"
        />
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <Container>
            <Tab
              labels={['Parent', 'Therapist']}
              activeTab={this.state.tabNum}
              onChangeTab={(tabNum) => {
                this.setState({tabNum});
              }}
            />

            {this.state.tabNum == 0 && (
              <>
                <ScrollView>
                  {parentQuestions.map((question, key) => {
                    let answer = parentAnswers[key];
                    return (
                      <View key={key} style={styles.questionWrapper}>
                        <Text style={styles.questionTitle}>
                          {question.node.question}
                        </Text>
                        {question.node.type == 'rating' && (
                          <>
                            <Slider
                              step={1}
                              value={answer}
                              minimumValue={1}
                              maximumValue={5}
                              minimumTrackTintColor={Color.primaryTransparent}
                              thumbStyle={styles.thumbStyle}
                              thumbTintColor={Color.primary}
                              trackStyle={styles.trackStyle}
                              onValueChange={(val) => {
                                parentAnswers[key] = val;
                                this.setState({parentAnswers});
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              {[1, 2, 3, 4, 5].map((item, key) => {
                                return (
                                  <View
                                    key={key}
                                    style={{width: 40, alignItems: 'center'}}>
                                    <Text style={{fontSize: 13}}>{item}</Text>
                                  </View>
                                );
                              })}
                            </View>
                          </>
                        )}

                        {question.node.type == 'text' && (
                          <TextInput
                            value={answer}
                            onChangeText={(val) => {
                              parentAnswers[key] = val;
                              this.setState({parentAnswers});
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
                {this.state.type == 'parents' && (
                  <Button
                    labelButton="Submit"
                    style={{marginBottom: 10}}
                    isLoading={this.state.isSendingFeedback}
                    onPress={() => {
                      this.submitAnswer();
                    }}
                  />
                )}
              </>
            )}

            {this.state.tabNum == 1 && (
              <>
                <ScrollView>
                  {therapistQuestions.map((question, key) => {
                    let answer = therapistAnswers[key];
                    let canEdit = this.state.type == 'therapist';
                    let thumbStyle = styles.thumbStyle;
                    let trackStyle = styles.trackStyle;
                    if (!canEdit) {
                      thumbStyle = [styles.thumbStyle, {opacity: 0.6}];
                      trackStyle = [styles.trackStyle, {opacity: 0.6}];
                    }
                    return (
                      <View key={key} style={styles.questionWrapper}>
                        <Text style={styles.questionTitle}>
                          {question.node.question}
                        </Text>
                        {question.node.type == 'rating' && (
                          <>
                            <Slider
                              disabled={!canEdit}
                              step={1}
                              value={answer}
                              minimumValue={1}
                              maximumValue={5}
                              minimumTrackTintColor={Color.primaryTransparent}
                              thumbStyle={thumbStyle}
                              thumbTintColor={Color.primary}
                              trackStyle={trackStyle}
                              onValueChange={(val) => {
                                therapistAnswers[key] = val;
                                this.setState({therapistAnswers});
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              {[1, 2, 3, 4, 5].map((item, key) => {
                                return (
                                  <View
                                    key={key}
                                    style={{width: 40, alignItems: 'center'}}>
                                    <Text style={{fontSize: 13}}>{item}</Text>
                                  </View>
                                );
                              })}
                            </View>
                          </>
                        )}

                        {question.node.type == 'text' && (
                          <TextInput
                            value={answer}
                            editable={canEdit}
                            onChangeText={(val) => {
                              therapistAnswers[key] = val;
                              this.setState({therapistAnswers});
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
                {this.state.type == 'therapist' && (
                  <Button
                    labelButton="Submit"
                    style={{marginBottom: 10}}
                    isLoading={this.state.isSendingFeedback}
                    onPress={() => {
                      this.submitAnswer();
                    }}
                  />
                )}
              </>
            )}
          </Container>
        )}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  questionWrapper: {
    marginTop: 10,
    marginBottom: 15,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.blackFont,
  },
  thumbStyle: {
    width: 40,
    height: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  trackStyle: {
    height: 10,
    backgroundColor: Color.gray,
    borderRadius: 5,
  },
};

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentFeedback);
