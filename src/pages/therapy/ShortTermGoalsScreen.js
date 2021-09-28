import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Image,
  FlatList,
  Text,
  TextInput,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import PreferredItemView from '../../components/PreferredItemView';
import {connect} from 'react-redux';
import {client, refreshToken, getShortTermGoals} from '../../constants';
import store from '../../redux/store';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getStr} from '../../../locales/Locale';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class ShortTermGoalsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      therapyId: '',
      noDataText: '',
      shortTermGoals: [],
      studestudentNew: {},
      categories: [
        {id: 1, name: 'Acquisition'},
        {id: 2, name: 'Reduction'},
        {id: 3, name: 'Maintenance'},
      ],
      currentTabIndex: 0,
    };
  }
  componentDidMount() {
      console.log("props shorttermgoalscreen 56", this.props)
    let {navigation, route} = this.props;
    // // debugger;
    let id = route.params.therapyId;
    this.setState({therapyId: id});
    this.setState({
      shortTermGoals: route.params.shortTermGoals,
      studentNew: route.params.studentNew,
    });
    TokenRefresher.refreshTokenIfNeeded(
      this.props.dispatchSetToken,
      this.props.dispatchSetTokenPayload,
    )
      .then(() => {
        // this.fetchShortTermGoals();
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }

  selectTab(index) {
    this.setState({currentTabIndex: index});
  }
  render() {
    console.log('props shortterm goal screen 64', this.props);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          backPress={() => {
            this.props.navigation.goBack();
          }}
          title={getStr('Therapy.ShortTerm')}
          enable={this.props.disableNavigation != true}
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            // showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            refreshControl={
              <RefreshControl refreshing={this.state.isLoading} />
            }>
            {/* <ScrollView  horizontal={true}>
                            {
                                this.state.categories.map((el, index) => (
                                <TouchableOpacity onPress={()=> this.selectTab(index)} key={index}>
                                    <Text style={[styles.tabView, (this.state.currentTabIndex === index) ? styles.selectedTabView : ""]}>{el.name}</Text>
                                </TouchableOpacity>
                                ))
                            }
                        </ScrollView> */}

            {this.state.shortTermGoals.length == 0 && (
              <NoData>{this.state.noDataText}</NoData>
            )}

            {this.state.shortTermGoals.map((el, index) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AlreadyTargetAllocate', {
                    program: this.props.route.params.program,
                    student: this.props.route.params.student,
                    shortTermGoalId: el.id,
                    studentNew: this.state.studentNew,
                    domain: this.props.route.params.domain,
                  });
                }}
                style={styles.preferredItemView}
                key={index}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.preferredItemTitle}>{el.goalName}</Text>
                  <Text style={styles.targetCount}>
                    {el.targetCount} Targets
                  </Text>
                </View>
                <Text style={styles.preferredItemDescription}>
                  {el.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingLeft: 15,
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
  },
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
  },
  tabView: {
    padding: 5,
    marginLeft: 15,
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  selectedTabView: {
    color: '#3E7BFA',
    borderBottomWidth: 2,
    borderBottomColor: '#3E7BFA',
  },
  preferredItemView: {
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  preferredItemTitle: {
    fontSize: 19,
    color: '#63686E',
    lineHeight: 35,
    width: '70%',
  },
  targetCount: {
    paddingTop: 5,
    textAlign: 'center',
    height: 30,
    width: '30%',
    color: '#FF9C52',
    fontSize: 13,
    fontStyle: 'normal',
    backgroundColor: 'rgba(255, 156, 82, 0.1)',
  },
  preferredItemDescription: {
    fontSize: 13,
    fontWeight: 'normal',
    color: 'rgba(95, 95, 95, 0.75)',
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShortTermGoalsScreen);
