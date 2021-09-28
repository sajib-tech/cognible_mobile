import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Image,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeCard from '../../components/HomeCard';
import {
  client,
  getStudentSessions,
  targetSummary,
  getStudentSummary,
} from '../../constants/index';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import SessionPreviewScreen from './SessionPreviewScreen';
import TherapyHomeBehaviouralItem from '../../components/TherapyHomeBehaviouralItem';
import TherapyHomeMorningSessionVideoItem from '../../components/TherapyHomeMorningSessionVideoItem';
import {connect} from 'react-redux';
import store from '../../redux/store';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import Color from '../../utility/Color';
import Styles from '../../utility/Style';
import Button from '../../components/Button';
import StudentHelper from '../../helpers/StudentHelper';
import LoadingIndicator from '../../components/LoadingIndicator';
import {getStr} from '../../../locales/Locale';
import ActionSheet from 'react-native-actionsheet';
import ParentRequest from '../../constants/ParentRequest';
import TherapistRequest from '../../constants/TherapistRequest';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class TherapyHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,

      targetsAllocated: 0,
      targetsMastered: 0,
      inTherapy: 0,
      sessions: [],
      studentId: '',
      showPreview: false,
      sessionPreviewData: {},
      summaryData: '',
      selectedSession: {},
      selectedIndex: 0,
      graphs: [
        {
          title: getStr('ExtraAdd.ProgressOverview'),
          description: getStr('ExtraAdd.ProgressDes'),
          targetScreen: 'StudentProgressOverview',
        },
        {
          title: getStr('ExtraAdd.DailyResponseRate'),
          description: getStr('ExtraAdd.ProgressDes'),
          targetScreen: 'StudentDailyResponseRate',
        },
      ],
    };
    this.getResultData = this.getResultData.bind(this);
    this.getResultListView = this.getResultListView.bind(this);
    // this.gotoSessionPreview = this.gotoSessionPreview.bind(this);
    this.gotoSessionTargetList = this.gotoSessionTargetList.bind(this);
    this.getTherapySessions = this.getTherapySessions.bind(this);

    if (DeviceInfo.isTablet()) {
      Orientation.lockToLandscape();
    }
  }
  async componentDidMount() {
    this.setState({studentId: store.getState().studentId});

    try {
      await TokenRefresher.refreshTokenIfNeeded(
        this.props.dispatchSetToken,
        this.props.dispatchSetTokenPayload,
      )
      
      AsyncStorage.getItem("summary").then((index) => {
        console.log("index async", index)
        this.getTherapySessions()
        if(index != "NaN") {
          this.getSummaryCounts(parseInt(index));
        } else {
          this.getSummaryCounts(0);
        }
      }).catch((err) => {
        this.getSummaryCounts(0)
        console.log("Error",err)
        
      })
    } catch (error) {
      console.log("error in token refresher", error)
    }

    


    // await TokenRefresher.refreshTokenIfNeeded(
    //   this.props.dispatchSetToken,
    //   this.props.dispatchSetTokenPayload,
    // )
    //   .then(() => {
    //     this.getTherapySessions();

    //     AsyncStorage.getItem('summary')
    //       .then((index) => {
    //         if (index != 'NaN') {
    //           this.getSummaryCounts(parseInt(index));
    //         } else {
    //           this.getSummaryCounts(0);
    //         }
    //       })
    //       .catch((err) => {
    //         this.getSummaryCounts(0);
    //         console.log(err);
    //       });
    //   })
    //   .catch((error) => {
    //     console.log('TokenRefresher Error: ' + JSON.stringify(error));
    //     this.setState({isLoading: false});
    //   });
  }
  getTargetSummary(date, endDate) {
    console.log('getTargetSummary() is called:' + store.getState().studentId);

    console.log(store.getState().studentId)
    console.log(date),
    console.log(date.toString()),
    console.log(endDate.toString())

    client
      .query({
        query: targetSummary,
        variables: {
          studentId: store.getState().studentId,
          date: date,
          endDate: endDate
        },
      })
      .then((result) => {
        console.log("targetsData-------:"+JSON.stringify(result))
        this.setState({targetsAllocated: result?.data?.targetAllocates?.edgeCount, targetsMastered: result?.data?.targetAllocates?.masteredCount, inTherapy: result?.data?.targetAllocates?.interventionCount});
        
        return result.data;
      })
      .then((data) => {
        console.log("========"+JSON.stringify(data));
         
        // if(data.session.edges) {
        //     this.setState({sessions: data.session.edges});
        //     console.log("========"+JSON.stringify(this.state.sessions[0].node.sessionName.id));
        //     console.log("========"+JSON.stringify(this.state.sessions[0].node.sessionName.name));
        //     // console.log("========"+(typeof this.state.sessions[0].node.targetAllocateSet.edges));
        //     // console.log("========"+(Object.keys(this.state.sessions[0].node.targetAllocateSet.edges).length));
        // }
      })
      .catch((error) => {
        console.log('Target summary api error; ' + JSON.stringify(error));
      });
  }

  getStudentSessionStatus(sessions) {
    sessions.forEach((element, index) => {
      let variables = {
        sessionId: element.node.id,
      };
      TherapistRequest.getStudentSessionStatus(variables)
        .then((sessionStatusData) => {
          let sessions = this.state.sessions;
          let session = sessions[index];
          session.sessionStatus = 'Pending';
          if (sessionStatusData.data.getChildSession.edges.length > 0) {
            session.sessionStatus =
              sessionStatusData.data.getChildSession.edges[0].node.status;
          }
          sessions[index] = session;
          this.setState({sessions: sessions});
        })
        .catch((error) => {
          console.log(error);
          this.setState({isLoading: false});
        });
    });
  }

  getTherapySessions() {
    this.setState({isLoading: false});
    console.log(
      'getTherapySessions() is called',
      store.getState().user.student.id,
    );

    client
      .query({
        query: getStudentSessions,
        variables: {
          studentId: store.getState().user.student.id,
        },
      })
      .then((result) => {
        // console.log("sessionData-------:"+JSON.stringify(result))
        return result.data;
      })
      .then((data) => {
        if (data.GetStudentSession && data.GetStudentSession.edges) {
          this.setState(
            {
              sessions: data.GetStudentSession.edges,
              selectedSession: data.GetStudentSession.edges[0],
            },
            () => {
              this.getStudentSessionStatus(this.state.sessions);
            },
          );
        }
        this.setState({isLoading: false});
      })
      .catch((error) => {
        console.log('TherapySessions error: ' + JSON.stringify(error));
      });
  }
  getResultData() {
    let childName = StudentHelper.getStudentName();
    let mandDescription =
      getStr('AutismTherapy.Record') +
      childName +
      getStr('AutismTherapy.mandDesc');
    let medicalDescription = getStr('AutismTherapy.MediDec');
    let toiletDescription = getStr('AutismTherapy.TilDec');
    let behaviourDescription = getStr('AutismTherapy.behDsc');
    let abcDescription = getStr('NewChanges.abcdess');

    let data = [
      {
        title: getStr('AutismTherapy.MealData'),
        description: getStr('AutismTherapy.Mealdesc'),
      },
      {title: getStr('AutismTherapy.MandData'), description: mandDescription},
      {
        title: getStr('AutismTherapy.MedicalData'),
        description: medicalDescription,
      },
      {
        title: getStr('AutismTherapy.ToiletData'),
        description: toiletDescription,
      },
      {
        title: getStr('AutismTherapy.BehaviorData'),
        description: behaviourDescription,
      },
      // { title: getStr('NewChanges.ABCData'), description: abcDescription }
    ];
    return data;
  }
  getResultListView() {
    let data = this.getResultData();
    let resList = [];
    for (let x = 0; x < data.length; x++) {
      resList.push(
        <TherapyHomeBehaviouralItem
          key={x}
          title={data[x].title}
          description={data[x].description}
          callbackFunction={this.callbackTherapyHomeBehaviouralItem}
        />,
      );
    }
    return (
      <>
        <Text style={{color: '#000', fontSize: 16, marginBottom: 5}}>
          {getStr('ExtraAdd.DailyVitals')}
        </Text>
        {resList}
      </>
    );
  }
  callbackTherapyHomeBehaviouralItem = (title) => {
    console.log('TherapyHomeBehavioralItem : ' + title);
    // this.setState({showCorrectResponse: isExpanded});
    if (title === getStr('AutismTherapy.MealData')) {
      this.gotoDataRecordingScreen('BehaviourDecelMealScreen');
    } else if (title === getStr('AutismTherapy.MedicalData')) {
      this.gotoDataRecordingScreen('BehaviourDecelMedicalScreen');
    } else if (title === getStr('AutismTherapy.MandData')) {
      this.gotoDataRecordingScreen('BehaviourDecelMandScreen');
    } else if (title === getStr('AutismTherapy.ToiletData')) {
      this.gotoDataRecordingScreen('BehaviourDecelToiletScreen');
    } else if (title === getStr('AutismTherapy.BehaviorData')) {
      this.gotoDataRecordingScreen('BehaviourDecelDataScreen');
    } else if (title === getStr('NewChanges.ABCData')) {
      this.gotoDataRecordingScreen('AbcList');
    }
  };
  gotoDataRecordingScreen(title) {
    let {navigation} = this.props;
    let student = store.getState().user.student;
    // console.log("gotoDataRecordingScreen", store.getState());
    navigation.navigate(title, {
      student: student,
      studentId: store.getState().user.student.id,
    });
  }
  gotoSessionPreview(type, index) {
    console.log('type:' + type + ', index=' + index);
    let student = store.getState().user.student;
    console.log('Student : ' + JSON.stringify(student));
    let targetsLength = this.state.sessions[index].node.targets.edges.length;
    let data = {};
    if (targetsLength > 0) {
      let {navigation} = this.props;
      if (type == 'Morning') {
        data = {
          pageTitle: 'Morning Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      } else if (type == 'Afternoon') {
        data = {
          pageTitle: 'Afternoon Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      } else if (type == 'Evening') {
        data = {
          pageTitle: 'Evening Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      } else if (type == 'Default') {
        data = {
          pageTitle: 'Default Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      }

      if (OrientationHelper.getDeviceOrientation() == 'portrait') {
        navigation.navigate('SessionPreview', data);
      } else {
        //navigation.navigate('SessionPreview', data);
        this.setState({sessionPreviewData: data, showPreview: true});
        console.log('ShowData', data);
      }
    } else {
      Alert.alert(
        'Start Session',
        'This session is not having any targets',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }
  gotoSessionTargetList(type, index) {
    let student = store.getState().user.student;
    let {navigation} = this.props;
    let targetsLength = this.state.sessions[index].node.targets.edges.length;
    let data = {};
    if (targetsLength > 0) {
      if (type == 'Morning') {
        data = {
          pageTitle: 'Morning Session',
          sessionData: this.state.sessions[index],
          fromPage: 'TherapyHome',
          studentId: store.getState().studentId,
          student: student,
        };
      } else if (type == 'Afternoon') {
        data = {
          pageTitle: 'Afternoon Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      } else if (type == 'Evening') {
        data = {
          pageTitle: 'Evening Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      } else if (type == 'Default') {
        data = {
          pageTitle: 'Default Session',
          sessionData: this.state.sessions[index],
          studentId: store.getState().studentId,
          student: student,
          fromPage: 'TherapyHome',
        };
      }
      navigation.navigate('SessionTargetList', data);
    } else {
      Alert.alert(
        'Start Session',
        'This session is not having any targets',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }
  renderAcceptance() {
    return (
      <TouchableOpacity
        style={styles.cardMargin}
        activeOpacity={0.9}
        onPress={() => {
          this.props.navigation.navigate('ActHome');
        }}>
        <HomeCard
          title={getStr('AutismTherapy.Acceptance')}
          descr={getStr('AutismTherapy.DESCR_BUild')}
          bgcolor="#12B8BF"
          bgimage={'screening'}
        />
      </TouchableOpacity>
    );
  }
  renderParent() {
    return (
      <TouchableOpacity
        style={styles.cardMargin}
        activeOpacity={0.9}
        onPress={() => {
          let {navigation} = this.props;
          navigation.navigate('ParentCommunity');
        }}>
        <HomeCard
          title={getStr('ExtraAdd.ParentCommunity')}
          descr={getStr('ExtraAdd.ParentDesc')}
          bgcolor="#0095B6"
          newFlag={true}
          bgimage={'community'}
        />
      </TouchableOpacity>
    );
  }
  renderDoctor() {
    return (
      <TouchableOpacity
        style={styles.cardMargin}
        activeOpacity={0.9}
        onPress={() => {
          let {navigation} = this.props;
          navigation.navigate('VerifiedDoctors');
        }}>
        <HomeCard
          title={getStr('BegaviourData.VerifiedDoctors')}
          descr={getStr('ExtraAdd.VerifiedDes')}
          bgcolor="#426ED9"
          newFlag={true}
          bgimage={'doctors'}
        />
      </TouchableOpacity>
    );
  }
  renderTarget() {
    return (
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <View style={{width: 16}} />
          )}
          <View style={styles.dashboardBox}>
            <MaterialCommunityIcons
              style={{width: 60, paddingLeft: 10}}
              name={'medal'}
              color={'orange'}
              size={60}
            />
            <View style={{marginLeft: 10}}>
              <Text style={styles.total}>
                {getStr('ExtraAdd.TotalTargets')}
              </Text>
              <Text style={styles.allocated}>
                {this.state.targetsAllocated}
              </Text>
              <Text style={styles.allocatedText}>
                {getStr('ExtraAdd.Allocated')}
              </Text>
            </View>
          </View>
          <View style={styles.dashboardBox}>
            <MaterialCommunityIcons
              style={{width: 60, paddingLeft: 10}}
              name={'medal'}
              color={'orange'}
              size={60}
            />
            <View style={{marginLeft: 10}}>
              <Text style={styles.total}>{getStr('ExtraAdd.Target')}</Text>
              <Text style={styles.allocated}>{this.state.inTherapy}</Text>
              <Text style={styles.allocatedText}>
                {getStr('ExtraAdd.InTherapy')}
              </Text>
            </View>
          </View>
          <View style={styles.dashboardBox}>
            <MaterialCommunityIcons
              style={{width: 60, paddingLeft: 10}}
              name={'medal'}
              color={'orange'}
              size={60}
            />
            <View style={{marginLeft: 10}}>
              <Text style={styles.total}>{getStr('ExtraAdd.Target')}</Text>
              <Text style={styles.allocated}>{this.state.targetsMastered}</Text>
              <Text style={styles.allocatedText}>
                {getStr('ExtraAdd.Mastered')}
              </Text>
            </View>
          </View>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <View style={{width: 8}} />
          )}
        </ScrollView>
      </View>
    );
  }
  getSummaryCounts = (index) => {
    var newDate = '';
    var endDate = '';
    if (index === 0) {
      this.setState({summaryData: getStr('NewChanges.​week')});
      var days = 7; // Days you want to subtract
      var date = new Date();
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
      var day =
        last.getDate() <= 9
          ? '0' + last.getDate().toString()
          : last.getDate().toString();
      var month =
        last.getMonth() + 1 <= 9
          ? '0' + (last.getMonth() + 1).toString()
          : (last.getMonth() + 1).toString();
      var year = last.getFullYear();
      newDate = moment(date).format("YYYY-MM-DD")
      endDate = year.toString() + '-' + month + '-' + day;
    } else if (index === 1) {
      this.setState({summaryData: getStr('NewChanges.​Month')});
      var last = new Date();
      var day =
        last.getDate() <= 9
          ? '0' + last.getDate().toString()
          : last.getDate().toString();
      var month =
        last.getMonth() <= 9
          ? '0' + last.getMonth().toString()
          : last.getMonth().toString();
      var year = last.getFullYear();
      newDate = moment(last).format("YYYY-MM-DD")
      endDate = year.toString() + '-' + month + '-' + day;
      // moment().subtract(30, 'days').format("YYYY-MM-DD")
      
    } else if (index === 2) {
      this.setState({summaryData: getStr('NewChanges.​Year')});
      var last = new Date();
      var day =
        last.getDate() <= 9
          ? '0' + last.getDate().toString()
          : last.getDate().toString();
      var month =
        last.getMonth() <= 9
          ? '0' + (last.getMonth() + 1).toString()
          : (last.getMonth() + 1).toString();
      var year = last.getFullYear() - 1;
      newDate = moment().format("YYYY-MM-DD")
      endDate = year.toString() + '-' + month + '-' + day;
    }
    this.getTargetSummary(newDate, endDate);
    AsyncStorage.setItem('summary', index.toString());
  };

  renderHeader() {
    return (
      <>
        <View
          style={{
            marginHorizontal: -16,
            paddingHorizontal: 16,
            paddingTop: 20,
            backgroundColor: '#426ED9',
          }}>
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title={'select One'}
            options={[
              getStr('NewChanges.​week'),
              getStr('NewChanges.​Month'),
              getStr('NewChanges.​Year'),
              getStr('NewChanges.​Cancel'),
            ]}
            cancelButtonIndex={3}
            onPress={(index) => {
              if (index !== 3) {
                this.getSummaryCounts(index);
              }
            }}
          />
          <TouchableOpacity onPress={() => this.ActionSheet.show()}>
            <Text
              style={{
                fontFamily: 'SF Pro Text',
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 34,
                color: '#FFFFFF',
              }}>
              {getStr('AutismTherapy.Home')}{' '}
            </Text>

            <Text style={styles.summaryText}>
              { getStr('AutismTherapy.this')+
                ' ' +
                this.state.summaryData + " " + getStr('AutismTherapy.SummaryFor')}{' '}
              <FontAwesome5 name={'chevron-down'} size={18} />
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: -16,
            backgroundColor: '#426ED9',
            paddingBottom: 10,
            marginBottom: 10,
          }}>
          {this.renderTarget()}
        </View>
      </>
    );
  }
  renderModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.showPreview}
        onRequestClose={() => {
          this.setState({showPreview: false});
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.setState({showPreview: false});
              }}>
              <Text style={{color: Color.primary, fontSize: 15}}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.headerText}>Session Preview</Text>
          </View>
          <View style={styles.modalContent}>
            <SessionPreviewScreen
              route={{params: this.state.sessionPreviewData}}
              navigation={this.props.navigation}
              parent={this}
              disabledTitle
            />
          </View>
        </View>
      </Modal>
    );
  }
  renderSession() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {this.state.sessions.map((element, index) => (
            <View
              style={{
                paddingBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              key={index}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  ...styles.therapySessionBox,
                  marginRight: 8,
                  backgroundColor:
                    element.node.id == this.state.selectedSession.node.id
                      ? Color.grayWhite
                      : 'white',
                }}
                onPress={() => {
                  this.setState({
                    selectedSession: element,
                    selectedIndex: index,
                  });
                  //this.gotoSessionTargetList(element.node.sessionName.name, index)
                }}>
                <Text style={styles.morningSession}>
                  {element.node.sessionName.name} Session
                </Text>
                <Text
                  style={{
                    color:
                      element.sessionStatus == 'COMPLETED'
                        ? Color.success
                        : element.sessionStatus == 'PROGRESS'
                        ? Color.danger
                        : Color.warning,
                    marginLeft: 5,
                    fontSize: 10,
                  }}>
                  {element.sessionStatus}
                </Text>
                <View
                  style={{flex: 1, flexDirection: 'row', paddingVertical: 10}}>
                  <Text style={styles.minutes}>
                    {element.node.duration != 'null'
                      ? element.node.duration
                      : ''}
                  </Text>
                  <View style={styles.dotSeparator}></View>
                  <Text style={styles.targets}>
                    {element.node.targets.edges.length} Targets
                  </Text>
                  <View style={styles.dotSeparator}></View>
                  <Text style={styles.relative}>
                    {element.node.sessionHost.edges.length > 0
                      ? element.node.sessionHost.edges[0].node.relationship.name
                      : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {this.state.sessions?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              this.gotoSessionTargetList(
                this.state.selectedSession.node.sessionName.name,
                this.state.selectedIndex,
              );
            }}>
            <Text style={styles.viewAll}>
              {getStr("AutismTherapy.ViewAll")}
              {/* View All{' '} */}
              <FontAwesome5
                name={'arrow-right'}
                style={{padding: 20, fontSize: 20, color: '#63686E'}}
              />
            </Text>
          </TouchableOpacity>
        )}
        <View style={{marginVertical: 5}}>
          <ScrollView horizontal={true}>
            {this.state.selectedSession?.node?.targets?.edges.map(
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
        </View>
        {this.state.sessions?.length > 0 && (
          <View
            style={{
              ...styles.continueView,
              marginBottom: 10,
              width:
                OrientationHelper.getDeviceOrientation() == 'portrait'
                  ? '100%'
                  : '60%',
              alignSelf: 'center',
            }}>
            <Button
              labelButton={getStr('Therapy.StartSession')}
              onPress={() => {
                console.log(
                  'session name -->' +
                    this.state.selectedSession.node.sessionName.name,
                );
                this.gotoSessionPreview(
                  this.state.selectedSession.node.sessionName.name,
                  this.state.selectedIndex,
                );
              }}
            />
          </View>
        )}
      </>
    );
  }
  renderGraphList() {
    let student = store.getState().user.student;
    return (
      <>
        <Text
          style={{color: '#000', fontSize: 16, marginBottom: 5, marginTop: 5}}>
          {getStr('ExtraAdd.LearnerGraphs')}
        </Text>
        {this.state.graphs.map((item, key) => {
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => {
                this.props.navigation.navigate(item.targetScreen, {
                  node: {id: student.id},
                });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 20,
                borderRadius: 4,
                marginVertical: 8,
                paddingHorizontal: 20,
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
              <View style={{width: 55}}>
                <MaterialCommunityIcons
                  name="chart-line-variant"
                  size={40}
                  color={Color.black}
                />
              </View>

              <View style={{flex: 1, marginHorizontal: 8}}>
                <Text
                  style={{
                    fontFamily: 'SF Pro Text',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: 19,
                    color: '#45494E',
                  }}>
                  {item.title}
                </Text>
                <Text style={[Styles.smallGrayText, {fontSize: 12}]}>
                  {item.description}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={'arrow-right'}
                color={Color.primary}
                size={24}
              />
            </TouchableOpacity>
          );
        })}
      </>
    );
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Container>
              {this.renderHeader()}
              {this.renderAcceptance()}
              {this.renderSession()}
              {this.getResultListView()}
              {this.renderGraphList()}
              {this.renderParent()}
              {this.renderDoctor()}
            </Container>
          </ScrollView>
        )}

        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
          <Container>
            <View style={{paddingTop: 30, paddingBottom: 10}}>
              <Text style={styles.title}>Home</Text>
            </View>
            <Row>
              <Column>{this.renderAcceptance()}</Column>
              <Column>{this.renderDoctor()}</Column>
              <Column>{this.renderParent()}</Column>
            </Row>
            <Row style={{flex: 1, marginTop: 15}}>
              <Column style={{flex: 4}}>
                <ScrollView>
                  <ActionSheet
                    ref={(o) => (this.ActionSheet = o)}
                    title={'select One'}
                    options={[
                      getStr('NewChanges.​week'),
                      getStr('NewChanges.Month'),
                      getStr('NewChanges.Year'),
                      getStr('NewChanges.Cancel'),
                    ]}
                    cancelButtonIndex={3}
                    onPress={(index) => {
                      if (index !== 3) {
                        this.getSummaryCounts(index);
                      }
                    }}
                  />
                  <TouchableOpacity onPress={() => this.ActionSheet.show()}>
                    <Text style={[styles.summaryText, {color: '#45494E'}]}>
                      {getStr('AutismTherapy.SummaryFor') +
                        ' ' +
                        this.state.summaryData}
                      <FontAwesome5
                        name={'chevron-down'}
                        size={18}
                        style={{marginLeft: 10}}
                      />
                    </Text>
                  </TouchableOpacity>
                  {this.renderTarget()}

                  <View style={{height: 10}} />

                  {this.renderSession()}
                </ScrollView>
              </Column>

              <Column style={{flex: 3}}>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                  {this.getResultListView()}

                  {this.renderGraphList()}
                </ScrollView>
              </Column>
            </Row>
            {this.renderModal()}
          </Container>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 24,
    color: '#FFFFFF',
    paddingBottom: 10,
  },
  cardMargin: {
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    color: '#45494E',
    fontWeight: 'bold',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    width: '80%',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
  },
  modalContent: {
    width: '80%',
    height: '70%',
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  morningSession: {
    textAlign: 'left',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 17,
    color: '#3E7BFA',
  },
  viewAll: {
    textAlign: 'right',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#63686E',
  },
  minutes: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  dotSeparator: {
    backgroundColor: '#C4C4C4',
    margin: 8,
    width: 5,
    justifyContent: 'center',
    height: 5,
    alignItems: 'center',
    borderRadius: 50,
  },
  targets: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  relative: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  continueViewTouchable: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    paddingTop: 20,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  dashboardBox: {
    flexDirection: 'row',
    paddingTop: 20,
    width: 162,
    height: 126,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginTop: 3,
    marginLeft: 3,
    marginBottom: 3,
  },
  total: {
    color: '#1D253C',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: 80,
  },
  allocated: {
    color: '#1D253C',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 26,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: 80,
  },
  allocatedText: {
    color: 'rgba(95, 95, 95, 0.75)',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: 80,
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
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TherapyHome);
