import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Linking,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../../../utility/Color.js';
import Styles from '../../../utility/Style.js';
const KEYS_TO_FILTERS = ['name', 'subject'];
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader.js';
import ImageHelper from '../../../helpers/ImageHelper.js';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import DateHelper from '../../../helpers/DateHelper';
import NoData from '../../../components/NoData.js';
import TherapyHomeMorningSessionVideoItem from '../../../components/TherapyHomeMorningSessionVideoItem';

import Svg, {Defs, LinearGradient, Stop, Rect, Circle} from 'react-native-svg';

import {getStr} from '../../../../locales/Locale';

import LoadingIndicator from '../../../components/LoadingIndicator.js';
import _ from 'lodash';
import store from '../../../redux/store/index.js';

const width = Dimensions.get('window').width;
class StudentMenuDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      program: {},
      shortTermGoals: [],
      longTermGoals: [],
      detailsEducation: [
        {
          id: 0,
          key: 'longTerm',
          title: 'Long Term Goals',
          color: Color.greenCyan,
          dateRange: '',
          value: 0,
        },
        {
          id: 1,
          key: 'shortTerm',
          title: 'Short Term Goals',
          color: Color.purple,
          dateRange: '',
          value: 0,
        },
      ],
      assesments: [
        {
          id: 0,
          title: 'PEAK',
          color: '#275BFE',
          colorTop: 'rgba(27, 156, 228, 0.72)',
        },
        {id: 1, title: 'VB-MAPP', color: '#FF1A7A', colorTop: '#DE14D6'},
        {id: 2, title: 'CogniAble', color: '#1AC8FF', colorTop: '#07A7CA'},
        // { id: 3, title: 'Behavioral Assesments', color: '#F93005', colorTop: '#E64725' },
        {id: 4, title: 'ABC Assessment', color: '#e67e22', colorTop: '#d35400'},
        {
          id: 5,
          title: 'Preferred Items',
          color: '#2ecc71',
          colorTop: '#27ae60',
        },
        {
          id: 6,
          title: 'IISCA',
          color: '#275BFE',
          colorTop: 'rgba(27, 156, 228, 0.72)',
        },
      ],
      selectedTherapySession: {},
      therapySession: [
        {
          id: 1,
          title: 'Evening Session',
          dateRange: 'March 06',
          status: 'Pending Review',
          statusId: 2,
        },
        {
          id: 2,
          title: 'Afternoon Session',
          dateRange: 'March 06',
          status: 'Feedback Submitted',
          statusId: 1,
        },
        {
          id: 3,
          title: 'Morning Session',
          dateRange: 'March 06',
          status: 'Feedback Submitted',
          statusId: 1,
        },
      ],
      modalShow: false,
      therapySessions: [],
      isLoadingSession: false,
      therapyLongTermGoalsCount: 0,
      therapyShortTermGoalsCount: 0,
      longTermMastered: 0,
      shortTermMastered: 0,
      showContactModal: false,
      isTheraphySession: false,
      showShortTermModal: false,
      selectedType: '',
    };
  }
  _refresh() {
    this.setState({isLoading: false});
    this.componentDidMount();
  }
  componentDidMount() {
    const student = this.props?.route?.params?.student;
    let program = this.props?.route?.params?.program;
    this.setState({student: student, program: program});
    this.fetchLongTermGoals();
    this.fetchStudentSessions();
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.fetchLongTermGoals();
      this.fetchStudentSessions();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  fetchStudentSessions() {
    this.setState({isLoadingSession: true});
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let variables = {
      studentId: student.node.id,
      date: DateHelper.getTodayDate(),
    };
    TherapistRequest.getStudentSessions(variables)
      .then((studentSessionsData) => {
        if (studentSessionsData.data.GetStudentSession.edges.length > 0) {
          let sessionsArray = [];
          for (
            let i = 0;
            i < studentSessionsData.data.GetStudentSession.edges.length;
            i++
          ) {
            const element = studentSessionsData.data.GetStudentSession.edges[i];
            let sessionObject = {
              index: i,
              session: element,
              sessionStatus: '',
            };
            sessionsArray.push(sessionObject);
            this.getStudentSessionStatus(i, element.node.id);
          }
          this.setState(
            {
              therapySessions: sessionsArray,
              selectedTherapySession: sessionsArray[0],
              isLoadingSession: false,
            },
            () => {
              console.log(
                'selected session------------------>',
                this.state.selectedTherapySession,
              );
            },
          );
          sessionsArray.map((item, index) => {
            if (item.session.node.targets.edges.length > 0) {
              this.setState({isTheraphySession: true}, () => {
                return;
              });
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false, isLoadingSession: false});
      });
  }
  getStudentSessionStatus(index, sessionId) {
    let variables = {
      sessionId: sessionId,
    };
    TherapistRequest.getStudentSessionStatus(variables)
      .then((sessionStatusData) => {
        let sessions = this.state.therapySessions;
        let session = sessions[index];
        session.sessionStatus = 'Pending';
        if (sessionStatusData.data.getChildSession.edges.length > 0) {
          session.sessionStatus =
            sessionStatusData.data.getChildSession.edges[0].node.status;
        }
        sessions[index] = session;
        this.setState({therapySessions: sessions});
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  fetchLongTermGoals() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let variables = {
      student: student.node.id,
      program: program.id,
    };
    TherapistRequest.getStudentProgramLongTermGoals(variables)
      .then((longTermGoalsData) => {
        if (
          longTermGoalsData &&
          longTermGoalsData.data &&
          longTermGoalsData.data.programDetails &&
          longTermGoalsData.data.programDetails.longtermgoalSet &&
          longTermGoalsData.data.programDetails.longtermgoalSet.edges
        ) {
          if (
            longTermGoalsData.data.programDetails.longtermgoalSet.edges.length >
            0
          ) {
            this.setState({
              longTermGoals:
                longTermGoalsData.data.programDetails.longtermgoalSet.edges,
            });
            this.processGoals(
              longTermGoalsData.data.programDetails.longtermgoalSet,
            );
            this.processLongTermGoals(
              longTermGoalsData.data.programDetails.longtermgoalSet.edges,
            );
          }
        }
        //
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  processLongTermGoals(longTermGoals) {
    let ltLength = longTermGoals.length;
    for (let i = 0; i < ltLength; i++) {
      let longTermGoal = longTermGoals[i].node;
      if (longTermGoal.shorttermgoalSet.edges.length > 0) {
        this.processShortTermGoals(longTermGoal.shorttermgoalSet.edges);
      }
    }
  }
  processShortTermGoals(shortTermGoalSet) {
    let stLength = shortTermGoalSet.length;
    let stateShortTermGoals = this.state.shortTermGoals;
    for (let i = 0; i < stLength; i++) {
      let shortTermGoal = shortTermGoalSet[i].node;
      stateShortTermGoals.push(shortTermGoal);
    }
    stateShortTermGoals = _.orderBy(
      stateShortTermGoals,
      ['dateInitialted'],
      ['desc'],
    );
    this.setState({shortTermGoals: stateShortTermGoals});
  }
  processGoals(goalSet) {
    if (goalSet && goalSet.edges && goalSet.edges.length > 0) {
      this.setState({therapyLongTermGoalsCount: goalSet.edges.length});
      let shortTermGoalsCount = 0;
      let longTermMasterdCount = 0;
      let longTermGoals = goalSet.edges;
      let longTermGoalsLength = longTermGoals.length;
      for (let i = 0; i < longTermGoalsLength; i++) {
        let goal = longTermGoals[i].node;
        if (this.isGoalMastered(goal)) {
          longTermMasterdCount = longTermMasterdCount + 1;
        }
        if (
          goal.shorttermgoalSet &&
          goal.shorttermgoalSet.edges &&
          goal.shorttermgoalSet.edges.length > 0
        ) {
          shortTermGoalsCount =
            shortTermGoalsCount + goal.shorttermgoalSet.edges.length;
        }
        this.checkShortTermGoalMastered(goal);
      }
      this.setState({
        therapyShortTermGoalsCount: shortTermGoalsCount,
        longTermMastered: longTermMasterdCount,
      });
    }
  }
  isGoalMastered(goal) {
    let isMastered = false;
    if (
      goal.goalStatus &&
      goal.goalStatus.status &&
      goal.goalStatus.status === 'Met'
    ) {
      isMastered = true;
    }
    return isMastered;
  }
  checkShortTermGoalMastered(goal) {
    let targetEdges = goal.shorttermgoalSet.edges;
    for (let j = 0; j < targetEdges.length; j++) {
      let shortTermMasteredCount = this.state.shortTermMastered;
      if (this.isGoalMastered(targetEdges[j].node)) {
        shortTermMasteredCount = shortTermMasteredCount + 1;
      }
      this.setState({shortTermMastered: shortTermMasteredCount});
    }
  }
  searchUpdated(term) {
    this.setState({searchStudent: term});
  }
  studentDetail() {}
  bookAppointment() {
    let parent = this.props.navigation.dangerouslyGetParent();
    parent.navigate('Calendar');

    let student = this.props.route.params.student;

    setTimeout(() => {
      parent.navigate('AppointmentNew', {studentId: student.node.id, selectedDate: moment().format("YYYY-MM-DD")});
    }, 100);
  }
  gotoSessionPreview(type, index) {
    let student = this.props.route.params.student;
    let studentObj = student.node;
    let {navigation} = this.props;
    let sessionInfo = this.state.therapySessions[index];

    if (sessionInfo.sessionStatus.length > 0) {
      if (type == 'Morning') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Morning Session',
          sessionData: sessionInfo.session,
          studentId: student.node.id,
          student: studentObj,
          fromPage: 'StudentMenuDetail',
          status: sessionInfo.sessionStatus,
        });
      } else if (type == 'Afternoon') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Afternoon Session',
          sessionData: sessionInfo.session,
          studentId: student.node.id,
          student: studentObj,
          fromPage: 'StudentMenuDetail',
          status: sessionInfo.sessionStatus,
        });
      } else if (type == 'Evening') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Evening Session',
          sessionData: sessionInfo.session,
          studentId: student.node.id,
          student: studentObj,
          fromPage: 'StudentMenuDetail',
          status: sessionInfo.sessionStatus,
        });
      } else if (type == 'Default') {
        navigation.navigate('SessionPreview', {
          pageTitle: 'Default',
          sessionData: sessionInfo.session,
          studentId: student.node.id,
          student: studentObj,
          fromPage: 'StudentMenuDetail',
          status: sessionInfo.sessionStatus,
        });
      }
    }
  }
  modal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalShow}
        onRequestClose={() => this.setState({modalShow: false})}
        style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => this.setState({modalShow: false})}
          style={{flex: 1, backgroundColor: Color.blackOpacity}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Color.white,
              padding: 16,
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <TouchableOpacity
              style={[
                styles.row,
                {justifyContent: 'space-between', alignItems: 'center'},
              ]}>
              <Text style={[styles.text, {marginVertical: 8}]}>
                Target allocation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.row,
                {justifyContent: 'space-between', alignItems: 'center'},
              ]}>
              <Text style={[styles.text, {marginVertical: 8}]}>
                Student details
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
  renderProfile() {
    let student = this.props.route.params.student;
    let location = 'N/A';
    if (student.node.clinicLocation && student.node.clinicLocation.location) {
      location = student.node.clinicLocation.location;
    }

    let phoneNumber = student.node.mobileno;
    if (phoneNumber == null || phoneNumber == '') {
      phoneNumber = null;
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => this.studentDetail()}
          key={student.node.id}
          style={styles.studentItem}>
          <Image
            style={styles.studentImage}
            source={{uri: ImageHelper.getImage(student.node.image)}}
          />
          <View
            style={{flex: 1, marginHorizontal: 8, justifyContent: 'center'}}>
            <Text style={styles.textBig}>
              {student.node.firstname} {student.node.lastname}
            </Text>
            <Text style={styles.studentSubject}>{location}</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <View style={{flex: 1}}>
            <Button
              labelButton="Contact Student"
              onPress={() => {
                this.setState({showContactModal: true});
              }}
              iconRight={true}
              materialCommunityIconRightName="chevron-down"
            />
          </View>
          <View style={{width: 5}} />
          <View style={{flex: 1}}>
            <Button
              theme="secondary"
              labelButton="Book Appointment"
              onPress={() => {
                this.bookAppointment();
              }}
              // iconRightt={true}
              // iconLeftName="md-eye"
            />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showContactModal}
          onRequestClose={() => {
            this.setState({showContactModal: false});
          }}>
          <TouchableOpacity
            style={styles.modalRoot}
            activeOpacity={1}
            onPress={() => {
              this.setState({showContactModal: false});
            }}>
            <View style={styles.modalContent}>
              {phoneNumber == '' && (
                <View style={{flexDirection: 'row'}}>
                  <AntDesign name="warning" size={20} color={Color.primary} />
                  <Text style={{marginLeft: 10, color: Color.primary}}>
                    No Contact Available
                  </Text>
                </View>
              )}
              {phoneNumber != '' && (
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (Linking.canOpenURL('tel:' + phoneNumber)) {
                      Linking.openURL('tel:' + phoneNumber);
                    } else {
                      Alert.alert(
                        'Information',
                        "Sorry, your device can't make a phone call",
                      );
                    }
                  }}>
                  <AntDesign name="phone" size={20} color={Color.primary} />
                  <Text style={{marginLeft: 10, color: Color.primary}}>
                    Call This Student
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }
  shortTermModal() {
    let {shortTermGoals} = this.state;
    return (
      <>
        <Text style={styles.sectionTitle}>Direct Target Allocation</Text>
        <ScrollView
          style={{marginVertical: 5, flexDirection: 'row'}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.targetVw,
              {width: width * 0.68, marginRight: 5, backgroundColor: '#275BFE'},
            ]}
            onPress={() => {
              this.props.navigation.navigate('TargetAllocate', {
                program: this.state.program,
                student: this.state.student,
                shortTermGoalId: shortTermGoals[0]?.id,
                defaults: false,
              });
            }}>
            <Text style={{width: '90%', textAlign: 'center', color: '#fff'}}>
              {getStr('Therapy.ChoosefromLibrary')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.targetVw,
              {width: width * 0.68, marginRight: 5, backgroundColor: '#FF1A7A'},
            ]}
            onPress={() => {
              this.props.navigation.navigate('ManualTargetAllocationNew', {
                target: [],
                student: this.state.student,
                program: this.state.program,
                shortTermGoalId: shortTermGoals[0]?.id,
                isAllocate: true,
                defaults: false,
              });
            }}>
            <Text style={{width: '90%', textAlign: 'center', color: '#fff'}}>
              {getStr('Therapy.AddManually')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.targetVw,
              {width: width * 0.68, backgroundColor: '#1AC8FF'},
            ]}
            onPress={() => {
              this.props.navigation.navigate('PeakEquSuggesTarget', {
                target: [],
                student: this.state.student,
                program: this.state.program,
                shortTermGoalId: shortTermGoals[0]?.id,
                isAllocate: true,
                defaults: false,
              });
            }}>
            <Text style={{width: '90%', textAlign: 'center', color: '#fff'}}>
              Peak Equivalence Category
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  }
  renderProgress() {
    let {
      detailsEducation,
      assesments,
      therapySession,
      longTermGoals,
      longTermMastered,
      therapyLongTermGoalsCount,
      shortTermMastered,
      therapyShortTermGoalsCount,
    } = this.state;
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    return (
      <>
        <Text style={styles.sectionTitle}>Goals</Text>

        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <View style={{flexDirection: 'row', flex: 1, marginVertical: 4}}>
            {detailsEducation.map((menu, index) => {
              let longPercentage = 0;

              let shortPercentage = 0;
              let pageName = '';
              let percentage = 0;
              if (menu.key === 'shortTerm') {
                pageName = 'ShortTermGoals';
                if (therapyShortTermGoalsCount > 0) {
                  percentage = Math.floor(
                    (shortTermMastered / therapyShortTermGoalsCount) * 100,
                  );
                  // console("*******"+ percentage)
                }
              } else if (menu.key === 'longTerm') {
                pageName = 'LongTermGoals';
                if (therapyLongTermGoalsCount > 0) {
                  percentage = Math.floor(
                    (longTermMastered / therapyLongTermGoalsCount) * 100,
                  );
                  // console("*******"+ percentage)
                }
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    // menu.key === 'longTerm' ?
                    // this.props.navigation.navigate(pageName, {
                    //   student: this.props.route.params.student,
                    //   program,
                    //   longTermGoals,
                    // })
                    // : this.setState({ showShortTermModal: true })
                    this.props.navigation.navigate(pageName, {
                      student: this.props.route.params.student,
                      program,
                      longTermGoals,
                    });
                  }}
                  style={[
                    styles.goals,
                    {backgroundColor: menu.color, marginRight: 5},
                  ]}>
                  <View style={[Styles.rowBetween, {width: width * 0.6}]}>
                    <View>
                      <Text style={{...Styles.bigWhiteTextBold}}>
                        {menu.title}
                      </Text>
                      <Text
                        style={[
                          Styles.whiteText,
                          {fontSize: 12, marginVertical: 8},
                        ]}>
                        {menu.dateRange}
                      </Text>
                    </View>
                  </View>
                  {/*<View style={styles.progressBar}>*/}
                  {/*    <View style={[styles.progressBarActive, { width: percentage + '%' }]} />*/}
                  {/*</View>*/}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  }
  renderAssessment() {
    let {
      detailsEducation,
      assesments,
      therapySessions,
      isTheraphySession,
      selectedTherapySession,
    } = this.state;
    const {student, program} = this.props.route.params;
    return (
      <>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text style={styles.sectionTitle}>Assesments</Text>
          {/* <MaterialCommunityIcons
                        name='arrow-right'
                        size={20}
                    /> */}
        </TouchableOpacity>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <View style={{flexDirection: 'row', flex: 1, marginVertical: 4}}>
            {assesments.map((menu, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  onPress={() => {
                    if (menu.title === 'VB-MAPP') {
                      this.props.navigation.navigate('AssessmentsList', {
                        student: student,
                        program: program,
                      });
                    } else if (menu.title === 'PEAK') {
                      this.props.navigation.navigate('PeakPrograms', {
                        student: student,
                        program: program,
                      });
                    } else if (menu.title === 'CogniAble') {
                      this.props.navigation.navigate(
                        'CogniableAssessmentsList',
                        {
                          student: student,
                          program: program,
                        },
                      );
                    } else if (menu.title === 'Behavioral Assesments') {
                      this.props.navigation.navigate('BehaviouralStartPage', {
                        student: student,
                        program: program,
                      });
                    } else if (menu.title === 'ABC Assessment') {
                      // this.props.navigation.navigate('AbcDataScreen', {
                      //     studentId: student.node.id
                      // })
                      this.props.navigation.navigate('AbcList', {
                        studentId: student.node.id,
                        student: student.node,
                      });
                    } else if (menu.title === 'Preferred Items') {
                      let program = this.props.route.params.program;
                      this.props.navigation.navigate('PreferredItemsScreen', {
                        therapyId: program.id,
                        student: student,
                      });
                    } else if(menu.title === "IISCA") {
                      this.props.navigation.navigate('IiscaMain', {
                        student: student,
                        program:program
                      })
                    }
                  }}
                  style={{
                    width: 150,
                    height: 180,
                    justifyContent: 'flex-end',
                    marginRight: 8,
                    borderRadius: 20,
                    marginVertical: 4,
                    padding: 8,
                    paddingBottom: 10,
                  }}>
                  <Svg
                    width="150"
                    height="180"
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      borderRadius: 20,
                    }}>
                    <Defs>
                      <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
                        <Stop
                          offset="0"
                          stopColor={menu.color}
                          stopOpacity="1"
                        />
                        <Stop
                          offset="1"
                          stopColor={menu.colorTop}
                          stopOpacity="1"
                        />
                      </LinearGradient>
                    </Defs>
                    <Rect
                      width="150"
                      height="180"
                      fill="url(#grad)"
                      style={{borderRadius: 20}}
                    />
                    <Circle
                      cx="140"
                      cy="10"
                      r="80"
                      fill="transparent"
                      opacity={0.2}
                      stroke="#fff"
                      strokeWidth={20}
                    />
                  </Svg>
                  <Text style={[Styles.bigWhiteTextBold, {fontSize: 16}]}>
                    {menu.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('PreviousSession', {
              student: this.props.route.params.student,
              studentId: this.props.route.params.student.node.id,
            })
          }
          style={[
            styles.row,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={[styles.sectionTitle, {flex: 1, marginVertical: 8}]}>
            Therapy Session
          </Text>
          <View
            style={{
              backgroundColor: '#0090e4',
              height: 40,
              width: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="white"
            />
          </View>
        </TouchableOpacity>

        {this.state.isLoadingSession && (
          <View style={{height: 200}}>
            <LoadingIndicator />
          </View>
        )}

        {!this.state.isLoadingSession && (
          <>
            {therapySessions.length == 0 && (
              <NoData>No Therapy Session Data</NoData>
            )}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              <View style={{flexDirection: 'row', flex: 1, marginVertical: 4}}>
                {therapySessions.map((item, index) => {
                  return item.session.node.targets.edges.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.session.node.targets.edges.length > 0) {
                          this.setState({selectedTherapySession: item});
                        } else {
                          Alert.alert(
                            'Start Session',
                            "This session doesn't have targets",
                          );
                        }
                      }}>
                      <View
                        key={index}
                        style={{
                          ...styles.therapySessionBox,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          marginRight: 5,
                          backgroundColor:
                            index == selectedTherapySession.index
                              ? Color.grayWhite
                              : 'white',
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.text}>
                            {item.session.node.sessionName.name}
                          </Text>
                          <Text
                            style={[
                              styles.textSmall,
                              {
                                color:
                                  item.sessionStatus == 'COMPLETED'
                                    ? Color.success
                                    : item.sessionStatus == 'PROGRESS'
                                    ? Color.danger
                                    : Color.warning,
                                marginLeft: 5,
                              },
                            ]}>
                            {item.sessionStatus?.toUpperCase()}
                          </Text>
                        </View>
                        <View
                          style={[
                            Styles.rowCenter,
                            {marginVertical: 10, justifyContent: 'flex-start'},
                          ]}>
                          <Text style={styles.textSmall}>
                            {item.session.node.targets.edges.length} Targets
                          </Text>
                          <View style={styles.dot} />
                          <Text style={styles.textSmall}>
                            {item.session.node.duration != null
                              ? item.session.node.duration
                              : '0 min'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  );
                })}
              </View>
            </ScrollView>

            {selectedTherapySession && (
              <View>
                <ScrollView style={{marginVertical: 15}} horizontal={true}>
                  {selectedTherapySession?.session?.node?.targets?.edges.map(
                    (targetEdge, targetEdgeIndex) => {
                      let domain = targetEdge.node.targetId
                        ? targetEdge.node.targetId.domain.domain
                        : '';
                      return (
                        <TherapyHomeMorningSessionVideoItem
                          key={targetEdgeIndex}
                          domainName={domain}
                          targetName={
                            targetEdge.node.targetAllcatedDetails.targetName
                          }
                          dailyTrials={
                            targetEdge.node.targetAllcatedDetails.DailyTrials
                          }
                        />
                      );
                    },
                  )}
                </ScrollView>

                {!therapySessions.length == 0 && (
                  <Button
                    labelButton={
                      selectedTherapySession.sessionStatus === 'PROGRESS'
                        ? 'Resume Session'
                        : selectedTherapySession.sessionStatus === 'COMPLETED'
                        ? 'View/Edit Session'
                        : 'Start Session'
                    }
                    style={{
                      width:
                        OrientationHelper.getDeviceOrientation() == 'portrait'
                          ? '100%'
                          : '60%',
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      this.gotoSessionPreview(
                        selectedTherapySession.session.node.sessionName.name,
                        selectedTherapySession.index,
                      );
                    }}
                  />
                )}
              </View>
            )}
          </>
        )}
      </>
    );
  }

  /*
  .####.####..######...######.....###...
  ..##...##..##....##.##....##...##.##..
  ..##...##..##.......##........##...##.
  ..##...##...######..##.......##.....##
  ..##...##........##.##.......#########
  ..##...##..##....##.##....##.##.....##
  .####.####..######...######..##.....##
  */

  renderIisca = () => {
    let student = this.props.route.params.student;

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('StudentIisca')}
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderRadius: 4,
            marginVertical: 4,
            padding: 8,
            borderWidth: 1,
            borderColor: Color.gray,
            backgroundColor: '#275BFE',
          },
          styles.targetVw,
        ]}>
        <View style={{flex: 1, marginHorizontal: 8}}>
          <Text
            style={{color: '#fff'}}>{`${student.node.firstname}'s IISCA`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let {detailsEducation, assesments, therapySession} = this.state;
    let {route} = this.props;

    let student = route.params.student;
    let program = route.params.program;

    let location = 'N/A';
    if (student.node.clinicLocation && student.node.clinicLocation.location) {
      location = student.node.clinicLocation.location;
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          // dotsPress={() => this.setState({ modalShow: true })}
          title={program.name}
          // title="db"
        />

        {this.modal()}
        {/* {this.shortTermModal()} */}

        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
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
              {this.renderProfile()}

              {this.renderProgress()}

              {this.shortTermModal()}

              {this.renderAssessment()}
            </ScrollView>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
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
              {this.renderProfile()}

              {this.renderProgress()}

              {this.shortTermModal()}

              {this.renderAssessment()}
            </ScrollView>
          )}
          {/*    <Row>*/}
          {/*        <Column>*/}
          {/*            <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"*/}
          {/*                refreshControl={*/}
          {/*                    <RefreshControl*/}
          {/*                        refreshing={this.state.isLoading}*/}
          {/*                        onRefresh={this._refresh.bind(this)}*/}
          {/*                    />*/}
          {/*                }*/}
          {/*            >*/}
          {/*                {this.renderProfile()}*/}

          {/*                {this.renderProgress()}*/}
          {/*            </ScrollView>*/}
          {/*        </Column>*/}
          {/*        <Column>*/}
          {/*            <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"*/}
          {/*                refreshControl={*/}
          {/*                    <RefreshControl*/}
          {/*                        refreshing={this.state.isLoading}*/}
          {/*                        onRefresh={this._refresh.bind(this)}*/}
          {/*                    />*/}
          {/*                }*/}
          {/*            >*/}
          {/*                {this.renderAssessment()}*/}
          {/*            </ScrollView>*/}
          {/*        </Column>*/}
          {/*    </Row>*/}

          {/*)}*/}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    color: Color.blackFont,
    flex: 1,
  },
  header: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  recentImage: {
    width: width / 11,
    height: width / 11,
    borderRadius: 20,
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
  },
  bigImage: {
    width: width / 3,
    height: width / 3.3,
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  therapySessionBox: {
    paddingHorizontal: 8,
    //height: 60,
    paddingVertical: 8,
    borderColor: Color.gray,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 4,
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
  newCount: {
    backgroundColor: Color.primary,
    padding: 2,
    width: 16,
    height: 16,
    borderRadius: 4,
    justifyContent: 'center',
  },
  textCount: {
    color: Color.white,
    fontSize: 10,
    textAlign: 'center',
  },
  buttonStart: {
    flex: 1,
    backgroundColor: Color.primary,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonStartText: {
    color: Color.white,
  },
  buttonEnd: {
    flex: 1,
    borderColor: Color.primary,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonEndText: {
    color: Color.primary,
  },
  line: {
    height: 1,
    width: width / 1.2,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 3,
    backgroundColor: Color.silver,
    marginHorizontal: 8,
  },
  studentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  goals: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressBarActive: {
    height: 4,
    backgroundColor: Color.white,
  },
  modalRoot: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: Color.white,
    borderRadius: 5,
    padding: 16,
  },
  targetVw: {
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentMenuDetail);
