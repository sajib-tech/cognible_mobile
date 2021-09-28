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
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import DateHelper from '../../../helpers/DateHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TimelineView from '../../../components/TimelineView';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setAutismScreening,
  setAssessmentData,
} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import ScreeningPreliminaryAssess from './ScreeningPreliminaryAssess';
import ScreeningInstruction from './ScreeningInstruction';
import ScreeningVideo from './ScreeningVideo';
import ScreeningResult from './ScreeningResult';
import store from '../../../redux/store';
import StudentHelper from '../../../helpers/StudentHelper';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {getStr} from '../../../../locales/Locale';

const width = Dimensions.get('window').width;

class ScreeningHome extends Component {
  constructor(props) {
    super(props);

    console.log('user -=-=-=-=-=', store.getState());
    let studentName = 'Child';

    if (this.props.route.params.fromParent) {
      studentName = StudentHelper.getStudentName();
    } else {
      studentName = this.props.route.params.student.firstName;
    }

    let screeningId = null;
    console.log('Params screening', this.props.route.params);
    if (this.props.route.params.item) {
      screeningId = this.props.route.params.item.node.id;
    }

    this.state = {
      isLoading: false,
      screeningId,

      videoData: null,

      steps: {
        //not yet autism screening
        0: {
          1: 'active',
          2: '',
          3: '',
          4: '',
          button: {
            label: getStr('homeScreenAutism.StartAssessment'),
            onPress: () => {
              this.startAssesment(0);
            },
          },
        },
        //not complete preliminary assessment
        X: {
          1: 'notcomplete',
          2: '',
          3: '',
          4: '',
          button: {
            label: getStr('NewChanges.​continueAssessment'),
            onPress: () => {
              this.startAssesment(0);
            },
          },
        },
        //complete preliminary assessment
        1: {
          1: 'done:canclick',
          2: 'active',
          3: '',
          4: '',
          button: {
            label: getStr('NewChanges.ViewInstruction'),
            onPress: () => {
              this.startAssesment(1);
            },
          },
        },
        //complete instruction, can record video
        2: {
          1: 'done:canclick',
          2: 'done:canclick',
          3: 'active',
          4: '',
          button: {
            label: getStr('NewChanges.recordVideo'),
            onPress: () => {
              this.startAssesment(2);
            },
          },
        },
        //complete all
        3: {
          1: 'done',
          2: 'done',
          3: 'done:canclick',
          4: 'active',
          button: {
            label: getStr('NewChanges.viewResult'),
            onPress: () => {
              this.startAssesment(3);
            },
          },
        },
      },

      autismSteps: [
        {
          name: getStr('homeScreenAutism.PreliminaryAssessment'),
          duration: '8-10 Mins',
          description: getStr('homeScreenAutism.PreliminaryDescription', {
            name: this.props.route.params.student ? this.props.route.params.student.firstName: StudentHelper.getStudentName() ,
          }),
          tabletView: 'assessment',
          text: getStr('homeScreenAutism.StartAssessment'),
          active: (
            <Text style={{color: Color.blueFill}}>
              {getStr('homeScreenAutism.StartAssessment')}{' '}
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={Color.blueFill}
              />
            </Text>
          ),
          done: (
            <Text style={{color: Color.greenFill}}>
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={Color.greenFill}
              />{' '}
              {getStr('homeScreenAutism.AssessmentComplete')}{' '}
            </Text>
          ),
          notcomplete: (
            <Text style={{color: Color.warning}}>
              <AntDesign name="warning" size={20} color={Color.warning} />{' '}
              {getStr('homeScreenAutism.AssessmentIncomplete')}
            </Text>
          ),
        },
        {
          name: getStr('homeScreenAutism.ScreeningResults'),
          duration: '8-10 Mins',
          description:
            getStr('homeScreenAutism.ScreeningDesc') +
            studentName +
            getStr('homeScreenAutism.ScreenDesc'),
          tabletView: 'result',
          text: getStr('NewChanges.viewResult'),
          active: (
            <Text style={{color: Color.blueFill}}>
              {getStr('NewChanges.viewResult')}{' '}
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={Color.blueFill}
              />
            </Text>
          ),
          done: (
            <Text style={{color: Color.greenFill}}>
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={Color.greenFill}
              />{' '}
              {getStr('NewChanges.viewResult')}
            </Text>
          ),
        },
        {
          name: getStr('homeScreenAutism.VideobasedAssessmentInstruction'),
          duration: '8-10 Mins',
          description: getStr('homeScreenAutism.ScreeningDescription', {
            name: this.props.route.params.student ? this.props.route.params.student.firstName: StudentHelper.getStudentName(),
          }),
          tabletView: 'instruction',
          text: getStr('NewChanges.ViewInstruction'),
          active: (
            <Text style={{color: Color.blueFill}}>
              {getStr('NewChanges.ViewInstruction')}{' '}
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={Color.blueFill}
              />
            </Text>
          ),
          done: (
            <Text style={{color: Color.greenFill}}>
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={Color.greenFill}
              />{' '}
              {getStr('ExtraAdd.instructionComplete')}
            </Text>
          ),
        },
        {
          name: getStr('homeScreenAutism.RecordaVideo'),
          duration: '8-10 Mins',
          description: getStr('homeScreenAutism.ScreeningDescription', {
            name: this.props.route.params.student ? this.props.route.params.student.firstName: StudentHelper.getStudentName(),
          }),
          tabletView: 'video',
          text: getStr('NewChanges.recordVideo'),
          active: (
            <Text style={{color: Color.blueFill}}>
              {getStr('NewChanges.recordVideo')}{' '}
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={Color.blueFill}
              />
            </Text>
          ),
          done: (
            <Text style={{color: Color.greenFill}}>
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={Color.greenFill}
              />{' '}
              {getStr('NewChanges.recordVideo')}
            </Text>
          ),
        },
        {
          name: getStr('homeScreenAutism.VideoAssessmentResult'),
          duration: '8-10 Mins',
          description:
            getStr('homeScreenAutism.ScreeningDesc') +
            studentName +
            getStr('homeScreenAutism.ScreenDesc'),
          tabletView: 'result',
          text: getStr('NewChanges.viewResult'),
          active: (
            <Text style={{color: Color.blueFill}}>
              {getStr('NewChanges.viewResult')}{' '}
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={Color.blueFill}
              />
            </Text>
          ),
          done: (
            <Text style={{color: Color.greenFill}}>
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={Color.greenFill}
              />{' '}
              {getStr('NewChanges.viewResult')}
            </Text>
          ),
        },
      ],

      activeNumber: 0,

      tabletView: 'assessment', //instruction, video, result
      tabletIsStartShowingContent: true,

      isInstructions: false,
      dataScreening: {},
      student: this.props.route.params.student ? this.props.route.params.student.firstName: StudentHelper.getStudentName()
    };
    this.props.dispatchSetAutismScreening(this);
  }

  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetAutismScreening(null);
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    //Call this on every page
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    console.log("screening id", store.getState())
    this.getData();
  }

  getData() {
    if (this.state.screeningId == null) {
      this.setState({
        isLoading: false,
        dataScreening: {},
        activeNumber: 0,
        tabletView: 'assessment',
      });
      return;
    }


    this.setState({isLoading: true});

    // let userId = store.getState().user.id;

    let variables = {
      id: this.state.screeningId,
    };

    ParentRequest.screeningGetRecordedAssess(variables)
      .then((dataResult) => {
        console.log('Data Screening', dataResult);
        let dataScreening = dataResult.data.getPreAssessDetail;

        let activeNumber = 0;
        let tabletView = 'assessment';
        let isDone = true;
        if (dataScreening.status == 'PROGRESS') {
          if (dataScreening.assessmentQuestions.edges.length == 0) {
            activeNumber = 'X';
          } else {
            isDone = false;
          }
        }
        //  else if (dataScreening.status == "QUESTIONSCOMPLETED") {
        //     activeNumber = "1";
        //     tabletView = "instruction";
        // }

        if (isDone) {
          this.setState({
            isLoading: false,
            dataScreening,
            activeNumber,
            tabletView,
          });
        } else {
          this.props.dispatchSetAssessmentData(dataScreening.id);

          let userId = store.getState().user.id;
          let queryStatus = {
            id: this.state.screeningId,
          };

          console.log(queryStatus);

          //If not done yet, find video upload status
          ParentRequest.screeningGetVideoStatusSingle(queryStatus)
            .then((dataResult) => {
              console.log('screeningGetVideoStatus', dataResult);
              let videoStatus = dataResult.data.getScreeningVideoStatus.status;
              let videoData = dataResult.data.getScreeningVideoStatus.details;

              if (videoStatus == false) {
                this.setState({
                  isLoading: false,
                  dataScreening,
                  activeNumber: 2,
                  tabletView: 'video',
                  videoData,
                });
              } else {
                this.setState({
                  isLoading: false,
                  dataScreening,
                  activeNumber: 3,
                  tabletView: 'result',
                  videoData,
                });
              }
            })
            .catch((error) => {
              console.log(error, error.response);
              this.setState({isLoading: false});
            });
        }
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });

    // ParentRequest.screeningGetPreAssessQuestion().then(dataResult => {
    //     console.log("screeningGetPreAssessQuestion", dataResult);
    //     this.setState({ isLoading: false });
    // }).catch(error => {
    //     console.log(error, error.response);
    //     this.setState({ isLoading: false });
    // });
  }

  getAssessmentData(item) {
    var qs = {
      id: item.id,
    };
    console.log(qs);
    ParentRequest.screeningGetRecordedAssess(qs)
      .then((dataResult) => {
        console.log('screeningGetRecordedAssess', dataResult);
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  renderButton() {
    let currentStep = this.state.steps[this.state.activeNumber];
    let buttonInfo = currentStep['button'];
    return (
      <Button
        // labelButton={autismSteps[activeNumber].text}
        labelButton={buttonInfo.label}
        onPress={buttonInfo.onPress}
        style={{marginVertical: 10, backgroundColor: Color.blueFill}}
      />
    );
  }

  renderList() {
    let {activeNumber, autismSteps} = this.state;
    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._refresh.bind(this)}
            />
          }>
          {this.state.isLoading == false && (
            <>
              {this.state.autismSteps.length == 0 && (
                <NoData>No Data Available</NoData>
              )}

              <View style={styles.wrapperStyle}>
                {this.state.autismSteps.map((step, key) => {
                  let textColor = Color.blackFont;
                  if (textColor == null) {
                    textColor = '#000';
                  }

                  let dotColor = Color.blueFill;
                  if (dotColor == null) {
                    dotColor = '#7480FF';
                  }

                  let canClick = false;
                  let label = null;

                  let activeStep = this.state.steps[
                    this.state.activeNumber + ''
                  ];
                  let currentNumber = key + 1;
                  let currentStatus = activeStep[currentNumber + ''];
                  if (currentStatus == 'active') {
                    label = step.active;
                    canClick = true;
                  } else if (currentStatus == 'done') {
                    label = step.done;
                  } else if (currentStatus == 'done:canclick') {
                    label = step.done;
                    canClick = true;
                  } else if (currentStatus == 'notcomplete') {
                    label = step.notcomplete;
                    canClick = true;
                  } else {
                    label = null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (canClick) {
                          this.startAssesment(key);
                        }
                      }}
                      style={[styles.row, {}]}
                      key={key}
                      activeOpacity={0.8}>
                      <View>
                        <View
                          style={[
                            styles.dotStyle,
                            {backgroundColor: dotColor},
                          ]}></View>
                        {key < this.state.autismSteps.length - 1 && (
                          <View
                            style={[
                              styles.connectionStyle,
                              {backgroundColor: Color.noActiveBlueDot},
                            ]}></View>
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          padding: 8,
                          marginBottom: 16,
                          marginLeft: 8,
                          borderRadius: 4,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.22,
                          shadowRadius: 2.22,

                          elevation: 3,
                          backgroundColor: Color.white,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={[
                              styles.textStyle,
                              {fontSize: 12, color: textColor},
                            ]}>
                            { getStr('homeScreenAutism.Step') + (key + 1)}{' '}
                          </Text>
                          <View style={styles.dot} />
                          <Text
                            style={[
                              styles.textStyle,
                              {fontSize: 12, color: textColor},
                            ]}>
                            {step.duration}
                          </Text>
                        </View>
                        <Text style={Styles.bigBlackText}>{step.name}</Text>
                        <Text
                          style={[
                            Styles.grayText,
                            {marginVertical: 4, fontSize: 12},
                          ]}>
                          {step.description}
                        </Text>

                        <TouchableOpacity
                          style={[Styles.row, {alignItems: 'center'}]}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (canClick) {
                              this.startAssesment(key);
                            }
                          }}>
                          {label}
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                  // } else {
                  //     let dotColor = null;
                  //     if (dotColor == null) {
                  //         dotColor = Color.noActiveBlueDot;
                  //     }
                  //     return (
                  //         <View style={[styles.row, { opacity: 0.4 }]} key={key}>
                  //             <View>
                  //                 <View style={[styles.dotStyle, { backgroundColor: dotColor }]}></View>
                  //                 {key + 1 < this.state.autismsheets.length && (
                  //                     <View style={[styles.connectionStyle, { backgroundColor: Color.noActiveBlueDot }]}></View>
                  //                 )}
                  //             </View>
                  //             <View style={{ flex: 1, padding: 8, marginBottom: 16, marginLeft: 8, borderRadius: 4, borderWidth: 0.5, borderColor: Color.gray }}>
                  //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  //                     <Text style={[styles.textStyle, { fontSize: 12, color: textColor }]}>{"STEP " + (key + 1)} </Text>
                  //                     <View style={styles.dot} />
                  //                     <Text style={[styles.textStyle, { fontSize: 12, color: textColor }]}> {autismsheet.node.start} - {autismsheet.node.end} MIN</Text>
                  //                 </View>
                  //                 <Text style={Styles.bigBlackText}>{autismsheet.node.title}</Text>
                  //                 <Text style={[Styles.grayText, { marginVertical: 4 }]}>{autismsheet.node.description.description}</Text>
                  //             </View>
                  //         </View>
                  //     );
                  // }
                })}
              </View>
            </>
          )}
        </ScrollView>

        {this.state.isLoading == false && this.renderButton()}
      </>
    );
  }

  renderListTablet() {
    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._refresh.bind(this)}
            />
          }>
          {this.state.isLoading == false && (
            <>
              {this.state.autismSteps.length == 0 && (
                <NoData>No Data Available</NoData>
              )}

              {this.state.autismSteps.map((step, key) => {
                let textColor = Color.blackFont;
                let backgroundColor = Color.white;

                if (step.tabletView == this.state.tabletView) {
                  textColor = Color.white;
                  backgroundColor = Color.primary;
                }

                let canClick = false;
                let label = null;

                let activeStep = this.state.steps[this.state.activeNumber + ''];
                let currentNumber = key + 1;
                let currentStatus = activeStep[currentNumber + ''];
                if (currentStatus == 'active') {
                  label = step.active;
                  canClick = true;
                } else if (currentStatus == 'done') {
                  label = step.done;
                } else if (currentStatus == 'done:canclick') {
                  label = step.done;
                  canClick = true;
                } else if (currentStatus == 'notcomplete') {
                  label = step.notcomplete;
                  canClick = true;
                } else {
                  label = null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (canClick) {
                        this.setState({
                          tabletView: step.tabletView,
                          tabletIsStartShowingContent: true,
                        });
                      }
                    }}
                    style={{}}
                    key={key}
                    activeOpacity={0.8}>
                    <View
                      style={{
                        padding: 10,
                        margin: 3,
                        marginBottom: 16,
                        borderRadius: 4,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,

                        elevation: 3,
                        backgroundColor: backgroundColor,
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={[
                            styles.textStyle,
                            {fontSize: 12, color: textColor},
                          ]}>
                          {'STEP ' + (key + 1)}{' '}
                        </Text>
                        <View style={styles.dot} />
                        <Text
                          style={[
                            styles.textStyle,
                            {fontSize: 12, color: textColor},
                          ]}>
                          {step.duration}
                        </Text>
                      </View>
                      <Text style={[Styles.bigBlackText, {color: textColor}]}>
                        {step.name}
                      </Text>
                      <Text
                        style={[
                          Styles.grayText,
                          {marginVertical: 4, fontSize: 12, color: textColor},
                        ]}>
                        {step.description}
                      </Text>
                      <TouchableOpacity
                        style={[Styles.row, {alignItems: 'center'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (canClick) {
                            this.setState({
                              tabletView: step.tabletView,
                              tabletIsStartShowingContent: true,
                            });
                          }
                        }}>
                        <View
                          style={{
                            backgroundColor: Color.white,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {label}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>
      </>
    );
  }

  renderAssessmentStart() {
    return (
      <>
        <ScrollView>
          <Image
            source={require('../../../../android/img/Image.png')}
            style={{
              width: '100%',
              height: 300,
              borderRadius: 5,
              marginTop: 2,
              marginBottom: 10,
            }}
            resizeMode="cover"
          />
          <Text style={{fontSize: 18, color: Color.blackFont}}>
            Preliminary Assessment
          </Text>
          <Text
            style={{fontSize: 13, color: Color.blackFont, marginVertical: 5}}>
            ext ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
          <Text
            style={{fontSize: 13, color: Color.blackFont, marginVertical: 5}}>
            ext ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
        </ScrollView>
        <Row>
          <Column></Column>
          <Column>
            <Button
              labelButton="Start Assessment"
              onPress={() =>
                this.setState({tabletIsStartShowingContent: false})
              }
              style={{marginBottom: 10}}
            />
          </Column>
        </Row>
      </>
    );
  }

  startAssesment(number) {
    if (number == 0) {
      this.props.navigation.navigate('ScreeningPreliminaryAssess', {
        student: this.props.route.params.student
      });
    } else if (number == 1) {
      this.props.navigation.navigate('ScreeningResultWaiting', {
        screeningId: this.state.screeningId,
        student: this.props.route.params.student 
      });
    } else if (number == 2) {
      this.props.navigation.navigate('ScreeningInstruction', {
        student: this.props.route.params.student
      });
    } else if (number == 3) {
      this.props.navigation.navigate('ScreeningVideo', this.state.videoData);
    } else if (number == 4) {
      this.props.navigation.navigate('ScreeningResult');
    }
    // this.getAssessmentData(item);
  }

  render() {
    let {activeNumber, autismSteps} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={getStr('homeScreenAutism.AutismScreening')}
          backPress={() => this.props.navigation.goBack()}
        />

        <Container>
          {this.state.isLoading && <LoadingIndicator />}

          {!this.state.isLoading && (
            <>
              {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                <View style={{flex: 1}}>{this.renderList()}</View>
              )}

              {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                <Row style={{flex: 1}}>
                  <Column>{this.renderListTablet()}</Column>
                  <Column style={{flex: 2}}>
                    {this.state.tabletView == 'assessment' && (
                      <>
                        {this.state.tabletIsStartShowingContent &&
                          this.renderAssessmentStart()}
                        {!this.state.tabletIsStartShowingContent && (
                          <ScreeningPreliminaryAssess disableNavigation />
                        )}
                      </>
                    )}
                    {this.state.tabletView == 'instruction' && (
                      <ScreeningInstruction disableNavigation />
                    )}
                    {this.state.tabletView == 'video' && (
                      <ScreeningVideo
                        disableNavigation
                        route={{params: null}}
                      />
                    )}
                    {this.state.tabletView == 'result' && (
                      <ScreeningResult disableNavigation />
                    )}
                  </Column>
                </Row>
              )}
            </>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  wrapperStyle: {
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    height: 5,
    width: 5,
    backgroundColor: Color.silver,
    borderRadius: 3,
    marginHorizontal: 8,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
  dispatchSetAutismScreening: (data) => dispatch(setAutismScreening(data)),
  dispatchSetAssessmentData: (data) => dispatch(setAssessmentData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningHome);
