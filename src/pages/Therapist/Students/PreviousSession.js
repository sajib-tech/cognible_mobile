import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import Color from '../../../utility/Color.js';
import NavigationHeader from '../../../components/NavigationHeader.js';
import {Container} from '../../../components/GridSystem';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import Styles from '../../../utility/Style';
import DateInput from '../../../components/DateInput';
import NoData from '../../../components/NoData';
import {client, startSession} from '../../../constants';
import {getSessionTargetsBySessionId} from '../../../constants/parent';
import {getDateSessions, getSessionStatus} from '../../../constants/therapist';
import moment from 'moment';
import LoadingIndicator from '../../../components/LoadingIndicator.js';

const width = Dimensions.get('window').width;

class PreviousSession extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      isLoading: false,
      therapySessions: [],
      isTheraphySession: false,
      student: {},
      studentId: '',
      date: moment().format('YYYY-MM-DD'),
      fromPage: 'StudentMenuDetail',
    };
  }

  componentDidMount() {
    let {route} = this.props;
    this.setState({
      student: route.params.student.node,
      studentId: route.params.studentId,
    });

    this.fetchStudentSessions(this.state.date);

  }

  fetchStudentSessions(date) {
    let student = this.props.route.params.student;
    console.log('date coming to fetch student session ' + date);
    console.log('Student id is ' + student.node.id);

    let variables = {
      studentId: student.node.id,
      date: date,
    };
    this.setState({isLoading: true});
    client
      .query({
        query: getDateSessions,
        fetchPolicy: 'no-cache',
        variables: variables,
      })
      .then((result) => {
        this.setState({date: date});
        return result.data;
      })
      .then((studentSessionsData) => {
        console.error("studentsession data=-=-=-===-=-=-=-=-=-=-==-=-=-=-", JSON.stringify(studentSessionsData))
        let dateSessions = studentSessionsData.getDateSessions;
        this.setState({therapySessions: dateSessions});
        let therapySessions = dateSessions.map((element, i) => {
          // this.getStudentSessionStatus(i, element.id);
          console.warn(
            'Date sessions element id for selected date -->' +
              this.state.date +
              '---->' +
              JSON.stringify(element.id),
          );
          //console.log("child session x --->"+JSON.stringify(element.childsessionSet.edges[0].node))

          // let sessions = dateSessions;
          // console.error("session", dateSessions)
          // let session = sessions[i];
          // console.error("session selected ", session)
          // session.sessionStatus = 'Pending';
          // if (session.childsessionSet.edges.length > 0) {
          //   // console.log("child session", sessionStatusData.getChildSession.edges)
          //   session.sessionStatus =
          //   session.childsessionSet.edges[0].node.status;
          // }
          // sessions[index] = session;
          // console.log(
          //   'In get student session object -->' + JSON.stringify(sessions),
          // );


          return {
            index: i,
            session: element,
            sessionStatus: '',
          };
        }
        );

        therapySessions.forEach((sess) => {
          if (sess.session.targets.edges.length > 0) {
            this.setState({isTheraphySession: true});
          }
        });

        this.setState({therapySessions, isLoading: false});
      })
      .catch((err) => {
        console.log(err);
        this.setState({isLoading: false});
      });
  }

  getStudentSessionStatus(index, sessionId) {
    let variables = {
      sessionId: sessionId,
    };
    console.log(
      'In get student session status -->' + JSON.stringify(variables),
    );
    client
      .query({
        query: getSessionStatus,
        fetchPolicy: 'no-cache',
        variables: variables,
      })
      .then((result) => {
        return result.data;
      })
      .then((sessionStatusData) => {
        console.warn(
          'In get student session data ======================-->' + JSON.stringify(sessionStatusData),
        );

        let sessions = this.state.therapySessions;
        let session = sessions[index];
        session.sessionStatus = 'Pending';
        if (sessionStatusData.getChildSession.edges.length > 0) {
          console.log("child session", sessionStatusData.getChildSession.edges)
          session.sessionStatus =
            sessionStatusData.getChildSession.edges[0].node.status;
        }
        sessions[index] = session;
        console.log(
          'In get student session object -->' + JSON.stringify(sessions),
        );

        console.log(sessions);
        this.setState({therapySessions: sessions});
      })
      .catch((err) => {
        console.log(err);
        this.setState({isLoading: false});
      });
  }
  getSessionSummary(targets, sessionData, status, name) {
    if (targets.length > 0) {
      this.setState({loading: true});
      let param = {
        sessionId: sessionData.id,
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
            parentSessionId: sessionData.id,
            status: status === 'COMPLETED' ? 'completed' : 'progress',
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
              // console.log("start session:"+JSON.stringify(result));
              return result.data;
            })
            .then((data) => {
              this.setState({loading: false});
              console.log('start session:' + JSON.stringify(data));
              if (data.startSession && data.startSession.details) {
                let {navigation} = this.props;
                // console.log("******"+JSON.stringify(sessionData));

                if (this.props.parent) {
                  this.props.parent.setState({showPreview: false});
                }
                console.log('session data====', data.startSession.details);
                navigation.navigate('SessionSummaryScreen', {
                  pageTitle: name,
                  sessionId: sessionData.id,
                  fromPage: this.state.fromPage,
                  childSeesionId: data?.startSession?.details?.id,
                });
              }
            })
            .catch((error) => {
              this.setState({loading: false});
              console.log('start session error:' + JSON.stringify(error));
            });
        })
        .catch((error) => {
          this.setState({loading: false});
          console.log('start session error:' + JSON.stringify(error));
        });
    } else {
      // Alert.alert(
      //     'Start Session',
      //     'This session is not having any targets',
      //     [{
      //         text: 'OK', onPress: () => {
      //             console.log('OK Pressed');
      //         }
      //     }],
      //     { cancelable: false }
      // );
    }
  }
  getClickedSession(targets, sessionData, status, name) {
    if (targets.length > 0) {
      console.log(
        'child sessions for clicked session --->' +
          JSON.stringify(sessionData.childsessionSet?.edges[0]?.node),
      );
      this.setState({loading: true});
      let param = {
        sessionId: sessionData.id,
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
            parentSessionId: sessionData.id,
            status: status === 'COMPLETED' ? 'completed' : 'progress',
            duration:
              data.getChildSession.edges.length > 0
                ? data.getChildSession.edges[0].node.duration != null
                  ? data.getChildSession.edges[0].node.duration
                  : 0
                : 123,
            date: this.state.date,
          };
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
              this.setState({loading: false});
              if (data.startSession && data.startSession.details) {
                let {navigation} = this.props;

                if (this.props.parent) {
                  this.props.parent.setState({showPreview: false});
                }
                console.log(
                  'session data sent dec ',
                  JSON.stringify(data.startSession.details),
                );
                navigation.navigate('SessionTarget', {
                  pageTitle: name,
                  sessionId: sessionData.id,
                  fromPage: this.state.fromPage,
                  studentId: this.state.studentId,
                  student: this.state.student,
                  parentSessionInfo: sessionData.childsessionSet?.edges[0]?.node
                    ? sessionData.childsessionSet.edges[0].node
                    : data.startSession.details,
                  fromEdit: status == 'COMPLETED' ? true : false,
                  date: this.state.date,
                });
              }
            })
            .catch((error) => {
              this.setState({loading: false});
              console.log('start session error:' + JSON.stringify(error));
            });
        })
        .catch((error) => {
          this.setState({loading: false});
          console.log('start session error:' + JSON.stringify(error));
        });
    } else {
      // Alert.alert(
      //     'Start Session',
      //     'This session is not having any targets',
      //     [{
      //         text: 'OK', onPress: () => {
      //             console.log('OK Pressed');
      //         }
      //     }],
      //     { cancelable: false }
      // );
    }
  }

  render() {
    let {therapySessions, isTheraphySession} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="Previous Session"
        />

        <Container style={{marginVertical: 10}}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic">
            <Text style={Styles.grayText}>Select Previous Session Date</Text>
            <DateInput
              format="YYYY-MM-DD"
              displayFormat="dddd, DD MMM YYYY"
              value={this.state.date}
              onChange={(date) => {
                this.setState({date: date}, () => {
                  let today = moment().format('YYYY-MM-DD');

                  // this.fetchStudentSessions(date);
                  if (moment(date).isSameOrBefore(today)) {
                    this.fetchStudentSessions(date);
                  } else {
                    Alert.alert(
                      'Information',
                      'Date should be less than today date',
                    );
                  }
                });
              }}
            />

            {this.state.isLoading && (
              <View style={{height: 300}}>
                <LoadingIndicator />
              </View>
            )}

            {!this.state.isLoading && (
              <>
                {therapySessions.length == 0 && (
                  <NoData>No Therapy Session Data</NoData>
                )}
                {therapySessions.map((item, index) => {
                  console.error("therapysesion", item)
                  return item.session.targets.edges.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.session.targets.edges.length > 0 > 0) {
                          this.getClickedSession(
                            item.session.targets.edges,
                            item.session,
                            item.sessionStatus,
                            item.session.sessionName.name,
                          );
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
                      }}>
                      <View key={index} style={styles.therapySessionBox}>
                        <Text style={styles.text}>
                          {item.session.sessionName.name}
                        </Text>
                        <View
                          style={[
                            Styles.rowCenter,
                            {marginVertical: 4, justifyContent: 'flex-start'},
                          ]}>
                          <Text style={styles.textSmall}>
                            {item.session.targets.edges.length} Targets
                          </Text>
                          <View style={styles.dot} />
                          <Text style={styles.textSmall}>
                            {item.session.duration != null
                              ? item.session.duration
                              : '0 min'}
                          </Text>
                          <View style={styles.dot} />
                          <Text
                            style={[
                              styles.textSmall,
                              {
                                color:
                                  item.session?.childsessionSet?.edges[0]?.node?.status == 'COMPLETED'
                                    ? Color.success
                                    : item.session?.childsessionSet?.edges[0]?.node?.status == 'PROGRESS'
                                    ? Color.danger
                                    : Color.warning,
                              },
                            ]}>
                            {item?.session?.childsessionSet?.edges.length > 0 ? item.session.childsessionSet?.edges[0]?.node?.status : "PENDING" }
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  );
                })}
              </>
            )}
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  therapySessionBox: {
    paddingHorizontal: 8,
    height: 60,
    paddingVertical: 8,
    borderColor: Color.gray,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    color: Color.primary,
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSmall: {
    fontSize: 10,
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 3,
    backgroundColor: Color.silver,
    marginHorizontal: 8,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviousSession);
