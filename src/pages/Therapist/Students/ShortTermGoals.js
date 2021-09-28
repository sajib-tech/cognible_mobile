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
  ActivityIndicator,
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
  Overlay,
} from 'react-native';
import Modal from 'react-native-modalbox';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.firstname', 'node.lastname'];
import NavigationHeader from '../../../components/NavigationHeader.js';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setShortTermGoals,
} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import TherapistRequest from '../../../constants/TherapistRequest';
import Button from '../../../components/Button';
import ShortTermGoalNew from './ShortTermGoalNew';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {getStr} from '../../../../locales/Locale';

import _ from 'lodash';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class ShortTermGoals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      longTermGoals: [],
      shortTermGoals: [],
      newShortTermGoal: false,
      noDataFound: '',
      loadedLongTermGoals: false,
      isAllocateDirectly: false,
      targets: [],
      shortTermGoalId: '',
      program: [],
      showSelectionModal: false,
    };
    //save to redux for access inside LeaveRequestNew screen
    this.props.dispatchSetShortTermGoals(this);
  }

  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetShortTermGoals(null);
  }

  _refresh() {
    console.log('short term goals _refresh() is called');
    this.componentDidMount();
  }

  componentDidMount() {
    console.log('props shortterms goals 64', JSON.stringify(this.props));
    
    //Call this on every page
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.props.navigation.addListener('focus', () => {
      if (this.state.isAllocateDirectly) {
        this.getDefaultGoals();
      }
      this.fetchLongTermGoals();
    });
    let student = this.props.route.params.student;
    // let longTermGoals = this.props.route.params.longTermGoals;
    // this.setState({longTermGoals: longTermGoals});
  }

  fetchLongTermGoals() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;

    const {isAllocateDirectly} = this.state;

    let variables = {
      studentId: student.node ? student.node.id : student.id,
      program: student.node ? program.id : program,
    };
    this.setState({isLoading: true});
    console.error('params', variables);

    if (!isAllocateDirectly) {
      TherapistRequest.getFilteredShortTermGoals(variables)
        .then((longTermGoalsData) => {
          console.error('longTermGoalsData', JSON.stringify(longTermGoalsData));
          this.setState({isLoading: false});
          this.processShortTermGoals(longTermGoalsData?.data?.shortTerm?.edges);
        })
        .catch((error) => {
          console.log(error);
          this.setState({isLoading: false});
        });
    } else {
    }
  }

  getDefaultGoals = () => {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;

    const {isAllocateDirectly} = this.state;

    let variables = {
      studentId: student.node ? student.node.id : student.id,
      program: student.node ? program.id : program,
    };
    TherapistRequest.getDefaultGoals(variables)
      .then((longTermGoalsData) => {
        // console.error('longTermGoalsData', JSON.stringify(longTermGoalsData));
        console.log(longTermGoalsData);
        this.setState(
          {
            isLoading: false,
            shortTermGoalId:
              longTermGoalsData?.data?.shortTerm?.edges[0]?.node?.id,
            program:
              longTermGoalsData?.data?.shortTerm?.edges[0]?.node?.longTerm
                ?.program,
          },
          () => {
            this.fetchTargets(
              longTermGoalsData?.data?.shortTerm?.edges[0]?.node?.id,
            );
          },
        );
        // this.processShortTermGoals(longTermGoalsData?.data?.shortTerm?.edges);
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  };

  fetchTargets(shortTermGoalId) {
    console.log(
      'student in already allocte -*/*/*/**/*/*/*/->' +
        JSON.stringify(this.state.student),
    );
    this.setState({isLoading: true, targets: [], noDataText: ''});
    let variables = {
      shortTerm: shortTermGoalId,
    };
    console.log(
      'target allocation variablea===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-',
      variables,
    );
    TherapistRequest.getAllocateTargets(variables)
      .then((targetsData) => {
        this.setState({isLoading: false});

        let targets = targetsData?.data?.targetAllocates?.edges;
        console.log('Targets/////////////////\\\\\\\\\\\\\\\\', targets);
        if (targets) {
          this.setState({targets});
        }
      })
      .catch((error) => {
        console.log('fetchTargets error:' + JSON.stringify(error));
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
    if (stLength === 0) {
      this.setState({noDataFound: 'No data found'});
    }
    let stateShortTermGoals = this.state.shortTermGoals;
    for (let i = 0; i < stLength; i++) {
      let shortTermGoal = shortTermGoalSet[i].node;
      console.log(shortTermGoal);
      if (shortTermGoal?.goalStatus?.status !== 'Discontinued') {
        if (i === 0) {
          this.setState({selectedGoal: shortTermGoal});
        }
        stateShortTermGoals.push(shortTermGoal);
      }
    }
    stateShortTermGoals = _.orderBy(
      stateShortTermGoals,
      ['dateInitialted'],
      ['desc'],
    );
    console.log('stateShortTermGoals', stateShortTermGoals);
    this.setState({shortTermGoals: stateShortTermGoals});
  }

  getGoalView(goal, index) {
    // console.log("Goal : ", goal);
    // let duration = goal.node.dateInitialted
    let startDate = moment(goal.dateInitialted).format('MMMM DD');
    let endDate = moment(goal.dateEnd).format('MMMM DD');
    let year = moment(goal.dateEnd).format('YYYY');
    let percentage =
      goal.percentageCorr != null ? goal.percentageCorr + '%' : '0%';
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          //this.setState({ selectedGoal: goal, newShortTermGoal: false });
          let {student} = this.props.route.params;
          let {program} = this.props.route.params;
          console.log(
            'Student from short term xy-->' + JSON.stringify(student),
          );
          this.props.navigation.navigate('AlreadyTargetAllocate', {
            program: program,
            student: student,
            shortTermGoalId: goal.id,
          });
        }}>
        <View style={styles.goalView}>
          <Text style={styles.goalName}>{goal.goalName}</Text>
          <Text style={{color: '#909090', lineHeight: 20}}>
            {startDate} - {endDate}, {year}
          </Text>
          <Text>{goal.description}</Text>
          <View
            style={{
              height: 4,
              width: '100%',
              backgroundColor: Color.gray,
              marginVertical: 8,
            }}>
            <View
              style={{height: 4, width: percentage, backgroundColor: '#4BAEA0'}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderGoalTargets() {
    let {selectedGoal} = this.state;
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <Text>{selectedGoal && selectedGoal.goalName}</Text>
        {selectedGoal &&
          selectedGoal.targetAllocateSet.edges.map((goalTarget, index) =>
            this.getGoalTargetView(goalTarget, index),
          )}
      </ScrollView>
    );
  }
  getGoalTargetView(target, index) {
    console.log(JSON.stringify(target));
    return (
      <View style={styles.targetView}>
        <Image
          style={{width: '100%'}}
          source={require('../../../../android/img/Image.png')}
        />
        <Text style={styles.targetViewTitle}>
          {target.node.targetAllcatedDetails.targetName}
        </Text>
        {/* <Text style={styles.targetViewDomain}>{target.node.domain.domain}</Text> */}
      </View>
    );
  }

  renderShortTermGoals() {
    let {shortTermGoals, noDataFound} = this.state;
    if (shortTermGoals.length == 0) {
      return <NoData>No Data Found</NoData>;
    }

    return shortTermGoals.map((goal, index) => this.getGoalView(goal, index));
  }

  getTargetView(target, index) {
    // const { alreadyAllocated } = this.state;
    let backgroundColor = Color.white;
    let titleColor = Color.black;
    let subtitleColor = '#999';
    // if (this.state.newPageParams) {
    // 	// // ;
    // 	if (target.node.id == this.state.newPageParams.target[0].node.id) {
    // 		backgroundColor = Color.primary;
    // 		titleColor = Color.white;
    // 		subtitleColor = Color.white;
    // 	}
    // }
    // for (let x = 0; x < alreadyAllocated.length; x++) {
    // 	if (target ?.node ?.targetMain ?.targetName === alreadyAllocated[x].node.targetAllcatedDetails.targetName) {
    // 		backgroundColor = Color.red;
    // 		break;
    // 	}
    // }
    return (
      <TouchableOpacity
        style={[styles.card, {backgroundColor}]}
        key={index}
        onPress={() => {
          this.props.navigation.navigate('TargetStatusChange', {
            target: target,
            student: this.props.route.params.student,
            program: this.props.route.params.program,
            shortTermGoalId: this.state.shortTermGoalId,
            isAllocate: true,
          });

          // if (OrientationHelper.getDeviceOrientation() == 'portrait') {
          // 	this.props.navigation.navigate('TargetStatusChange', {
          // 		target: target,
          // 		student: this.state.student,
          // 		program: this.state.program,
          // 		shortTermGoalId: this.state.shortTermGoalId,
          // 		isAllocate: true,
          // 	});
          // } else {
          // 	this.props.navigation.navigate('TargetStatusChange', {
          // 		target: target,
          // 		student: this.state.student,
          // 		program: this.state.program,
          // 		shortTermGoalId: this.state.shortTermGoalId,
          // 		isAllocate: true,
          // 	});
          // }
        }}>
        <Text style={[styles.targetViewTitle, {color: titleColor}]}>
          {target.node.targetAllcatedDetails.targetName}
        </Text>
        <Text style={[styles.targetViewDomain, {color: subtitleColor}]}>
          {target.node.targetStatus.statusName}
        </Text>
      </TouchableOpacity>
    );
  }

  renderselectionModal = () => {
    const {showSelectionModal} = this.state;

    return (
      <Modal
        isOpen={showSelectionModal}
        onClosed={() => this.setState({showSelectionModal: false})}
        coverScreen
        position="center"
        style={{
          height: screenHeight / 3.3,
          backgroundColor: Color.white,
          borderRadius: 10,
          width: '80%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <>
            <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginVertical: 15 }}>Select Option</Text>
          <View>
            <TouchableOpacity
              style={styles.targetVw}
              onPress={() => {
                this.setState({showSelectionModal: false})
                this.props.navigation.navigate('TargetAllocate', {
                  program: this.props.route.params.program,
                  student: this.props.route.params.student,
                  defaults: false,
                });
              }}>
              <Text style={{width: '90%', textAlign: 'center', color: 'black'}}>
                {getStr('Therapy.ChoosefromLibrary')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.targetVw, {marginTop: 10}]}
              onPress={() => {
                this.setState({showSelectionModal: false})
                // if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                this.props.navigation.navigate('ManualTargetAllocationNew', {
                  target: [],
                  student: this.props.route.params.student,
                  program: this.props.route.params.program,
                  shortTermGoalId: this.state.shortTermGoalId,
                  isAllocate: true,
                  defaults: true,
                });
              }}>
              <Text style={{ textAlign: 'center', color: 'black'}}>
                {getStr('Therapy.AddManually')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.targetVw, {marginTop: 10}]}
              onPress={() => {
                this.setState({showSelectionModal: false})
                this.props.navigation.navigate('PeakEquSuggesTarget', {
                  target: [],
                  student: this.props.route.params.student,
                  program: this.props.route.params.program,
                  shortTermGoalId: this.state.shortTermGoalId,
                  isAllocate: true,
                  defaults: true,
                });
              }}>
              <Text style={{ textAlign: 'center', color: 'black'}}>
                Peak Equivalence Category
              </Text>
            </TouchableOpacity>
          </View>
        </>
      </Modal>
    );
  };

  renderDefaultTargets = () => {
    const {targets} = this.state;

    return targets.map((item, index) => this.getTargetView(item, index));
  };

  newAdded = () => {
    this.fetchLongTermGoals();
  };

  render() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let {
      isLoading,
      shortTermGoals,
      longTermGoals,
      newShortTermGoal,
      isAllocateDirectly,
    } = this.state;
    // console.log("longTermGoals: "+ JSON.stringify(longTermGoals));
    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <NavigationHeader
          title="Short Term Goals"
          backPress={() => this.props.navigation.goBack()}
          enable={this.props.disableNavigation != true}
        />
        <Container enablePadding={this.props.disableNavigation != true}>
          {isLoading && <LoadingIndicator />}

          {!isLoading && (
            <>
              {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 0.7,
                      borderColor: 'grey',
                      borderRadius: 7,
                      marginVertical: 7,
                      overflow: 'hidden',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.setState({isAllocateDirectly: false})}
                      activeOpacity={0.7}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: !isAllocateDirectly
                          ? Color.primary
                          : Color.white,
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          color: !isAllocateDirectly
                            ? Color.white
                            : Color.primary,
                        }}>
                        Goal
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({isAllocateDirectly: true}, () =>
                          this.getDefaultGoals(),
                        )
                      }
                      activeOpacity={0.7}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: isAllocateDirectly
                          ? Color.primary
                          : Color.white,
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          color: isAllocateDirectly
                            ? Color.white
                            : Color.primary,
                        }}>
                        Direct
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {!isAllocateDirectly && (
                    <ScrollView>{this.renderShortTermGoals()}</ScrollView>
                  )}

                  {isAllocateDirectly && (
                    <ScrollView>{this.renderDefaultTargets()}</ScrollView>
                  )}

                  {!isAllocateDirectly && (
                    <Button
                      style={{marginVertical: 10}}
                      labelButton="New Short Term Goal"
                      onPress={() => {
                        this.props.navigation.navigate('ShortTermGoalNew', {
                          student,
                          program,
                          longTermGoals,
                          newAdded: this.newAdded,
                        });
                      }}
                    />
                  )}

                  {isAllocateDirectly && (
                    <Button
                      style={{marginVertical: 10}}
                      labelButton="Target Allocate"
                      onPress={() => {
                        this.setState({showSelectionModal: true});
                        // this.props.navigation.navigate('ShortTermGoalNew', {
                        //   student,
                        //   program,
                        //   longTermGoals,
                        //   newAdded: this.newAdded
                        // });
                      }}
                    />
                  )}
                </>
              )}
              {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                <Row style={{flex: 1}}>
                  <Column style={{flex: 2}}>
                    <ScrollView>{this.renderShortTermGoals()}</ScrollView>
                  </Column>
                  <Column>
                    {this.state.loadedLongTermGoals && (
                      <ShortTermGoalNew
                        disableNavigation
                        route={{params: {student, program, longTermGoals}}}
                        navigation={this.props.navigation}
                      />
                    )}
                  </Column>
                </Row>
              )}
            </>
          )}
        </Container>
        {this.renderselectionModal()}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  continueViewTouchable: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
  scrollView: {
    marginBottom: 70,
  },
  goalName: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    color: '#45494E',
    lineHeight: 20,
  },
  goalView: {
    flex: 1,
    borderRadius: 4,
    marginVertical: 4,
    padding: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Color.gray,
  },
  targetView: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  targetViewTitle: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#45494E',
    paddingTop: 10,
  },
  targetViewDomain: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#7480FF',
    paddingTop: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 5,
    margin: 3,
    marginTop: 10,
    padding: 10,
  },
  targetVw: {
    height: 50,
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 1,
    padding: 15,
    borderRadius: 7
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetShortTermGoals: (data) => dispatch(setShortTermGoals(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShortTermGoals);
