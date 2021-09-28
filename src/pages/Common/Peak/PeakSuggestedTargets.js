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
  Modal,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import {Button} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {therapistGetLongTermGoals} from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';
import LoadingIndicator from '../../../components/LoadingIndicator.js';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const KEYS_TO_FILTERS = ['node.targetMain.targetName'];
class PeakSuggestedTargets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      shortTermGoalId: '',
      targets: [],
      searchTarget: '',
      student: {},
      program: {},
      animation: new Animated.Value(0),
      domainList: [],
      showSearchFilter: false,
      isFilterOpened: false,
      domainDropdownList: [],
      targetAreaDropdownList: [],
      selectedDomain: '',
      selectedTargetArea: '',
      noDataText: '',
      alreadyAllocated: [],
      newPageParams: null,
      isShowDomainModal: false,
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  searchUpdated(term) {
    this.setState({searchTarget: term});
  }

  componentDidMount() {
    const {program, pk} = this.props.route.params;
    console.log(pk, 'pkkkkkkkkkkkkkkk');
    this.setState({isLoading: true});
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    let variables = {
      program: pk,
    };
    TherapistRequest.peakSuggestedTargets(variables)
      .then((result) => {
        console.log(JSON.stringify(result));
        let suggestedTargets = result.data.suggestPeakTargets.details;
        let tempTargets = [];
        for (let i = 0; i < suggestedTargets?.length; i++) {
          tempTargets.push(suggestedTargets[i]);
        }
        this.setState({targets: tempTargets, isLoading: false});
      })
      .catch((error) => {
        console.log(error);
        console.log(JSON.stringify(error));
      });
    let student = this.props.route.params.student;
    this.getAlreadyAllocatedTargets();
    // let suggestedTargets = this.props.route.params.targets;
    // let tempTargets = [];
    // for (let i = 0; i < suggestedTargets?.length; i++) {
    //     const element = suggestedTargets[i];
    //     let targets = element.targets.edges;
    //     for (let j = 0; j < targets.length; j++) {
    //         tempTargets.push(targets[j]);
    //     }
    // }
    //this.setState({ student: student,  targets: tempTargets });
    this.setState({student: student});
  }

  getAlreadyAllocatedTargets() {
    const {student} = this.props.route.params;
    let v = {
      student: student.node.id,
    };
    TherapistRequest.alreadyAllocatedTargetsForStudent(v)
      .then((result) => {
        this.setState({
          alreadyAllocated: result.data.targetAllocates.edges,
        });
      })
      .catch((error) => console.log(error));
  }

  getTargetView = (target, index) => {
    const {student, program} = this.props.route.params;
    const {alreadyAllocated} = this.state;
    let backgroundColor = Color.white;
    let titleColor = Color.black;
    let subtitleColor = '#999';

    if (this.state.newPageParams) {
      if (target.id == this.state.newPageParams.target.id) {
        backgroundColor = Color.primary;
        titleColor = Color.white;
        subtitleColor = Color.white;
      }
    }

    for (let x = 0; x < alreadyAllocated.length; x++) {
      if (
        target?.node?.targetMain?.targetName ===
        alreadyAllocated[x].node.targetAllcatedDetails.targetName
      ) {
        backgroundColor = Color.red;
        break;
      }
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.card, {backgroundColor: backgroundColor}]}
        key={index}
        onPress={() => {
          this.props.navigation.navigate('PeakTargetAllocateNewAssess', {
            target: target,
            student: student,
            program: program,
            shortTermGoalId: this.state.shortTermGoalId,
          });
        }}>
        {/* <Image style={styles.targetViewImage} source={require('../../../../android/img/peakx.jpg')} /> */}
        <Text style={[styles.targetViewTitle, {color: titleColor}]}>
          {target.code +
            ' - ' +
            target.targets?.edges[0]?.node?.targetMain?.targetName}
        </Text>
      </TouchableOpacity>
    );
  };

  renderList() {
    let {targets, noDataText} = this.state;
    console.log(targets);
    const filteredTargets = targets.filter(
      createFilter(this.state.searchTarget, KEYS_TO_FILTERS),
    );
    filteredTargets.sort();

    return (
      <>
        {this.state.showSearchFilter && (
          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons
              name="account-search-outline"
              size={24}
              color={Color.gray}
            />
            <SearchInput
              onChangeText={(term) => {
                this.searchUpdated(term);
              }}
              style={styles.searchInput}
              placeholder="Search Targets"
              // clearIcon
            />
          </View>
        )}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic">
          {filteredTargets?.length == 0 && (
            <NoData>No Suggested Target Available</NoData>
          )}

          {filteredTargets.map((target, index) => {
            return this.getTargetView(target, index);
          })}
        </ScrollView>
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="Peak Suggested Targets"
        />

        {this.state.isLoading && <LoadingIndicator />}

        {!this.state.isLoading && (
          <>
            <Container>
              {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                <>{this.renderList()}</>
              )}
              {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                <>{this.renderList()}</>
              )}
            </Container>
          </>
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
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 40,
    marginVertical: 10,
    backgroundColor: Color.grayWhite,
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

  targetViewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
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
    paddingTop: 5,
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Color.white,
    width: 300,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeakSuggestedTargets);
