import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Image,
  FlatList,
  Dimensions,
  Text,
  TextInput,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import TargetInstructions from '../../components/TargetInstructions';
import { getStr } from '../../../locales/Locale';
import { client, startSession, getChildSession } from '../../constants';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Color from '../../utility/Color';
import Button from '../../components/Button';
import { getSessionTargetsBySessionId } from '../../constants/parent';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class SessionPreviewSceen extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      student: {},
      studentId: '',
      loading: false,
      pageTitle: '',
      sessionData: {},
      noOfTargets: 0,
      pressed: false,
      emailTxt: '',
      pwdTxt: '',
    };
    this.goBack = this.goBack.bind(this);
    this.gotoSessionTarget = this.gotoSessionTarget.bind(this);
  }

  componentDidMount() {
    let { route } = this.props;
    console.log('PreviewScreenProps', route.params);
    this.setState({
      student: route.params.student,
      studentId: route.params.studentId,
    });
  }

  goBack() {
    this.props.navigation.goBack();
  }

  getData() {
    let data = [
      {
        sno: 1,
        descr:
          'This is the first point about the session & how it should be done.',
      },
      {
        sno: 2,
        descr:
          'Continuing with a second point and explaining what is to be done in the assessment.',
      },
      {
        sno: 3,
        descr:
          "Keep steps short, two to three lines max otherwise it'll be confusing.",
      },
    ];
    return data;
  }

  gotoSessionTarget(targetLength, pageTitle, sessionData, fromPage, fromEdit = false) {
    let { route } = this.props;

    console.log('session Id====', route.params.status);
    if (targetLength > 0) {
      this.setState({ loading: true });
      let param = {
        sessionId: sessionData ?.node ?.id,
      };

      client
        .query({
          query: getSessionTargetsBySessionId,
          fetchPolicy: 'no-cache',
          variables: param,
        })
        .then((result) => {
          return result.data;
        })
        .then((data) => {
          let params = {
            parentSessionId: sessionData.node ?.id,
            status:
              route.params.status === 'COMPLETED' ? 'completed' : 'progress',
            duration:
              data.getChildSession.edges.length > 0
                ? data.getChildSession.edges[0].node.duration != null
                  ? data.getChildSession.edges[0].node.duration
                  : 0
                : 123,
          };
          //console.log("params for start session -->" + JSON.strigify(params));
          client
            .mutate({
              mutation: startSession,
              variables: params,
              fetchPolicy: 'no-cache',
            })
            .then((result) => {
              // console.log("start session:"+JSON.stringify(result));
              return result.data;
            })
            .then((data) => {
              this.setState({ loading: false });
              console.error('start session:' + JSON.stringify(data));
              if (data.startSession && data.startSession.details) {
                let { navigation } = this.props;
                // console.log("******"+JSON.stringify(sessionData));

                if (this.props.parent) {
                  this.props.parent.setState({ showPreview: false });
                }
                console.log('session data====', data.startSession.details);
                console.error('parent session info to session target 1--->' + JSON.stringify(data))

                navigation.navigate('SessionTarget', {
                  pageTitle: pageTitle,
                  sessionId: sessionData.node ?.id,
                  fromPage: fromPage,
                  studentId: this.state.studentId,
                  student: this.state.student,
                  parentSessionInfo: data.startSession.details,
                  fromEdit: fromEdit,
                  sessiontype: data.startSession.details.sessions.id
                });
              }
            })
            .catch((error) => {
              this.setState({ loading: false });
              console.log('start session error:' + JSON.stringify(error));
            });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log('start session error:' + JSON.stringify(error));
        });
      // Call session start api, make the session status as (in)progress
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
        { cancelable: false },
      );
    }
  }
  getButtonTitle = () => {
    let { route } = this.props;

    let status = route.params.status;
    if (status == 'PENDING') {
      return getStr('Therapy.StartSession');
    } else if (status == 'COMPLETED') {
      return getStr('Therapy.ViewSession');
    } else if (status == 'PROGRESS') {
      return getStr('Therapy.ResumeSession');
    } else {
      return getStr('Therapy.StartSession');
    }
  };

  handleSessionButtonClick = (fromEdit = false) => {
    let { route } = this.props;
    let status = route.params.status;
    let pageTitle = route.params.pageTitle;
    let sessionData = route.params.sessionData;
    let sessionNode = sessionData ?.node;
    let targetLength = sessionNode ?.targets.edges.length;
    let fromPage = route.params.fromPage;

    if (status == 'COMPLETED' && !fromEdit) {
      this.gotoSessionSummary();
    } else {
      this.gotoSessionTarget(targetLength, pageTitle, sessionData, fromPage, fromEdit);
    }
  };
  gotoSessionSummary() {
    let { navigation, route } = this.props;
    let pageTitle = route.params.pageTitle;
    let sessionData = route.params.sessionData;
    let fromPage = route.params.fromPage;

    this.setState({ loading: true });

    console.log("summary of sesion id --->" + sessionData ?.node ?.id)
    let param = {
      sessionId: sessionData ?.node ?.id,
    };

    client
      .query({
        query: getSessionTargetsBySessionId,
        fetchPolicy: 'no-cache',
        variables: param,
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        let params = {
          parentSessionId: sessionData.node ?.id,
          status:
            route.params.status === 'COMPLETED' ? 'completed' : 'progress',
          duration:
            data.getChildSession.edges.length > 0
              ? data.getChildSession.edges[0].node.duration != null
                ? data.getChildSession.edges[0].node.duration
                : 0
              : 123,
        };
        client
          .mutate({
            mutation: startSession,
            variables: params,
            fetchPolicy: 'no-cache',
          })
          .then((result) => {
            return result.data;
          })
          .then((data) => {
            this.setState({ loading: false });
            console.log('start session:' + JSON.stringify(data));
            if (data.startSession && data.startSession.details) {
              // console.log("******"+JSON.stringify(sessionData));

              if (this.props.parent) {
                this.props.parent.setState({ showPreview: false });
              }
              console.log('session data====', data.startSession.details);

              navigation.navigate('SessionSummaryScreen', {
                pageTitle: pageTitle,
                fromPage: fromPage,
                sessionId: sessionData.node ?.id,
                childSeesionId: data ?.startSession ?.details ?.id,
                studentId: this.state.studentId
              });
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.log('start session error:' + JSON.stringify(error));
          });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('start session error:' + JSON.stringify(error));
      });
  }

  renderContent() {
    const { route } = this.props;
    let pageTitle = route.params.pageTitle;
    let targetLength = 0; //(Object.keys(route.params.sessionData.node.targetAllocateSet.edges)).length;
    let sessionData = route.params.sessionData;
    // console.log("-----------"+JSON.stringify(sessionData))
    let fromPage = route.params.fromPage;
    let sessionNode = sessionData ?.node;
    // console.log("-----------"+JSON.stringify(sessionNode))
    let status = route.params.status;
    let host = '';
    let duration = '';
    let itemRequired = '';
    let instruction = '';
    let isInstructionListAvailable = false;
    let totalTrials = 0;
    let instructions = [];
    if (sessionNode) {
      if (
        sessionNode.sessionHost.edges &&
        sessionNode.sessionHost.edges.length > 0
      ) {
        host = sessionNode.sessionHost.edges[0].node.relationship.name;
      }
      duration = sessionNode.duration;
      itemRequired = sessionNode.itemRequired;
      targetLength = sessionNode ?.targets.edges.length;
      for (let i = 0; i < targetLength; i++) {
        let edge = sessionNode ?.targets.edges[i];
        totalTrials = totalTrials + edge.node.targetAllcatedDetails.DailyTrials;
      }
      let instructionEdges = sessionNode.instruction.edges;
      for (let j = 0; j < instructionEdges.length; j++) {
        let instructionNode = instructionEdges[j].node;
        instructions.push({
          sno: j + 1,
          id: instructionNode.id,
          descr: instructionNode.instruction,
        });
      }
      console.log(JSON.stringify(instructions));

      // host = sessionNode.sessionHost.edges.relationship.name;
      // if(sessionNode.sessionHost.timeSpent && sessionNode.sessionHost.timeSpent.edges.length > 0) {
      //   duration = sessionNode.sessionHost.timeSpent.edges[0].node.duration;
      // }

      // instruction = sessionNode.instruction;
    }

    let arrInfo = [];
    if (duration != null) {
      arrInfo.push(duration + (duration > 1 ? ' mins' : ' min'));
    }
    arrInfo.push(targetLength + (targetLength > 1 ? ' targets' : ' target'));
    arrInfo.push(totalTrials + (totalTrials > 1 ? ' trials' : ' trial'));

    if (host == null || host == '') {
      host = 'N/A';
    }

    if (itemRequired == null) {
      itemRequired = 'N/A';
    }

    return (
      <>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Image
            source={require('../../../android/img/Image.png')}
            style={styles.instructionImage}
          />

          <Text style={styles.videoTime}>{arrInfo.join(' • ')}</Text>

          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons
              name="account-multiple-outline"
              size={20}
              color={Color.blueFill}
            />{' '}
            {getStr('sessionPreview.sessionHost')}
          </Text>

          <Text style={styles.sectionText}>
            {getStr('Therapy.ToiletDes')}
            <Text style={{ color: '#6495ED', marginLeft: 10 }}>{host}</Text>
          </Text>

          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons
              name="shopping"
              size={20}
              color={Color.blueFill}
            />{' '}
            {getStr('Therapy.ItemsRequired')}
          </Text>

          <Text style={styles.sectionText}>{itemRequired}</Text>

          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={Color.blueFill}
            />{' '}
            {getStr('sessionPreview.instructions')}
          </Text>

          <TargetInstructions
            data={instructions}
            isList={isInstructionListAvailable}
            description={instruction}
          />
        </ScrollView>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {
            status == 'COMPLETED' &&
            <View style={{ padding: 10, flex: 1 }}>
              <Button
                labelButton="Edit Session"
                onPress={() => {
                  this.handleSessionButtonClick(true);
                }}
              />
            </View>
          }

          <View style={{ padding: 10, flex: 1 }}>
            <Button
              labelButton={this.getButtonTitle()}
              onPress={() => {
                this.handleSessionButtonClick();
              }}
            />
          </View>
        </View>
      </>
    );
  }

  render() {
    const { route } = this.props;
    let pageTitle = route.params.pageTitle;
    return (
      <SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
        <NavigationHeader
          title={pageTitle}
          backPress={() => this.props.navigation.goBack()}
          disabledTitle={this.props.disabledTitle}
          enable={this.props.disabledTitle != true}
        />

        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>{this.renderContent()}</>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>{this.renderContent()}</>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 50,
    width: '95%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingLeft: 10,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
    fontWeight: 'bold',
  },
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingRight: 10,
  },
  scrollView: {
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  // Target Instruction
  targetInstructionView: {
    paddingTop: 20,
  },
  targetInstructionTitle: {
    color: '#63686E',
    fontSize: 22,
    fontWeight: '500',
  },
  targetInstructionInformation: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
  },
  videoPlay: {
    position: 'absolute',
    left: 40,
    top: 40,
    fontSize: 26,
    color: '#fff',
    zIndex: 99999,
  },

  instructionImage: {
    height: 200,
    width: '100%',
    borderRadius: 5,
    marginVertical: 15,
    borderColor: Color.gray,
    borderWidth: 1,
  },
  instructions: {
    width: '65%',
    paddingLeft: 10,
  },
  instructionsText: {
    color: '#63686E',
    fontSize: 16,
    fontWeight: '500',
  },
  videoTime: {
    color: Color.grayDarkFill,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    color: Color.primary,
    marginVertical: 15,
  },
  sectionText: {
    fontSize: 15,
    color: Color.grayDarkFill,
  },
  // trailProgress
  trailProgressSection: {
    marginTop: 30,
  },
  trailProgressTitle: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginRight: 10,
  },
  trailProgressText: {
    textAlign: 'left',
    width: '70%',
    color: '#63686E',
    fontSize: 16,
    fontWeight: '500',
  },
  trailProgress: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
  },
  progressBox: {
    height: 15,
    width: 40,
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: '#4BAEA0',
  },
  screeningCard: {
    flexDirection: 'row',
    backgroundColor: '#254056',
    height: 180,
  },
  screeningCardTextView: {
    width: '65%',
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  screeningCardTitle: {
    color: '#ffffff',
    fontSize: 22,
    paddingBottom: 10,
  },
  screeningCardDescription: {
    color: '#ffffff',
    paddingBottom: 10,
  },
  screeningCardLink: {
    color: '#ffffff',
    fontSize: 22,
  },

  sessionSuccessResponse: {
    marginTop: 10,
    margin: 5,
    flexDirection: 'row',

    // borderWidth: 1,
    // borderColor: '1px solid rgba(0, 0, 0, 0.075)',
    // borderRadius: 4
  },
  sessionSuccessText: {
    width: '85%',
    //  marginTop:'0.10'
  },
  sessionSuccessTitle: {
    fontSize: 20,
    color: '#1E90FF',
    textAlign: 'left',
    //  lineHeight: 35,
    // fontWeight:'bold'
  },
  sessionSuccess: {
    fontSize: 15,
    fontWeight: 'normal',
    // marginTop:15,
    marginLeft: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    letterSpacing: 0.1,
  },
  sessionSuccessDescription: {
    fontSize: 15,
    fontWeight: 'normal',
    marginTop: 15,
    color: 'rgba(95, 95, 95, 0.75)',
    letterSpacing: 0.1,
  },
  sessionSuccessCount: {
    fontSize: 17,
    fontWeight: '500',
    width: 40,
    height: 40,
    paddingTop: 10,
    color: '#6495ED',
    borderRadius: 4,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'powderblue',
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    marginBottom: 150,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  targetView: {
    width: '68%',
    height: 50,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    // backgroundColor: 'orange'
  },
  targetText: {
    paddingBottom: 5,
    color: '#3E7BFA',
    fontSize: 13,
    fontWeight: '500',
  },
  targetProgress: {
    height: 2,
    width: '100%',
    borderWidth: 2,
    borderColor: '#cfcfcf',
  },
  targetProgressColor: {
    position: 'absolute',
    top: 33,
    left: 10,
    width: '20%',
    height: 4,
    backgroundColor: '#3E7BFA',
  },
  arrowButton: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 5,
    paddingTop: 14,
    textAlign: 'center',
  },
  arrowButtonText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',
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
});

export default SessionPreviewSceen;
