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
} from 'react-native';
import Color from '../../../utility/Color';
import Button from '../../../components/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.firstname', 'node.lastname'];
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader.js';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setLongTermGoals,
} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import TherapistRequest from '../../../constants/TherapistRequest';
import LongTermGoalNew from './LongTermGoalNew';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class LongTermGoals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      longTermGoals: [],
    };
    //save to redux for access inside LeaveRequestNew screen
    this.props.dispatchSetLongTermGoals(this);
  }
  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetLongTermGoals(null);
  }
  _refresh() {
    console.log('_refresh() is called');
    this.componentDidMount();
  }
  componentDidMount() {
    //Call this on every page
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.fetchLongTermGoals();
  }
  fetchLongTermGoals() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let variables = {
      student: student.node.id,
      program: program.id,
    };
    this.setState({isLoading: true});
    TherapistRequest.getStudentProgramLongTermGoals(variables)
      .then((longTermGoalsData) => {
        // console.log('longTermGoalsData', JSON.stringify(longTermGoalsData));
        this.setState({isLoading: false});
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
            console.log(
              longTermGoalsData.data.programDetails.longtermgoalSet.edges
                .length,
            );
            this.setState({
              longTermGoals:
                longTermGoalsData.data.programDetails.longtermgoalSet.edges,
            });
          }
        }
        //
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  getGoalView(goal, index) {
    console.log('Goal : ', goal);
    // let duration = goal.node.dateInitialted
    let startDate = moment(goal.node.dateInitialted).format('MMMM DD');
    let endDate = moment(goal.node.dateEnd).format('MMMM DD');
    let year = moment(goal.node.dateEnd).format('YYYY');
    let percentage =
      goal.node.percentageCorr != null ? goal.node.percentageCorr + '%' : '0%';
    return (
      <View style={styles.goalView}>
        <Text style={styles.goalName}>{goal.node.goalName}</Text>
        <Text style={{color: '#909090', lineHeight: 20}}>
          {startDate} - {endDate}, {year}
        </Text>
        <View
          style={{
            height: 4,
            width: '100%',
            backgroundColor: Color.gray,
            marginVertical: 8,
          }}>
          <View
            style={{
              height: 4,
              width: percentage,
              backgroundColor: Color.primary,
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: 'SF Pro Text',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 13,
            lineHeight: 20,
            color: '#909090',
          }}>
          {goal.node.masterTar} of {goal.node.totalTar} Targets Mastered
        </Text>
      </View>
    );
  }

  renderLongTermGoals() {
    let {longTermGoals, isLoading} = this.state;
    if (longTermGoals.length == 0 && !this.state.isLoading) {
      return <NoData>No Data Found</NoData>;
    }

    return longTermGoals
      .slice(0)
      .reverse()
      .map((goal, index) => {
        return this.getGoalView(goal, index);
      });
  }

  render() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let {isLoading, longTermGoals} = this.state;

    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <NavigationHeader
          title="Long Term Goals"
          backPress={() => this.props.navigation.goBack()}
        />
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic">
                {this.renderLongTermGoals()}
              </ScrollView>
              <View style={{paddingVertical: 10}}>
                <Button
                  labelButton="Create New Goal"
                  onPress={() => {
                    this.props.navigation.navigate('LongTermGoalNew', {
                      student,
                      program,
                    });
                  }}
                />
              </View>
            </>
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <Row style={{flex: 1}}>
              <Column style={{flex: 2}}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentInsetAdjustmentBehavior="automatic">
                  {this.renderLongTermGoals()}
                </ScrollView>
              </Column>
              <Column>
                <LongTermGoalNew
                  disableNavigation
                  route={{params: {student: student, program: program}}}
                />
              </Column>
            </Row>
          )}
        </Container>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="black"
            style={{
              zIndex: 9999999,
              // backgroundColor: '#ccc',
              opacity: 0.9,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: screenHeight,
              justifyContent: 'center',
            }}
          />
        )}
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
    borderRadius: 4,
    marginVertical: 4,
    padding: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Color.gray,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetLongTermGoals: (data) => dispatch(setLongTermGoals(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LongTermGoals);
