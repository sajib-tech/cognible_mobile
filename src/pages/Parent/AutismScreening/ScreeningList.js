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

class ScreeningList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      screenings: [],
      menus: [
        {id: 0, phase: 'ALL', label: getStr('homeScreenAutism.All')},
        {id: 1, phase: 'START', label: getStr('homeScreenAutism.NewAssesment')},
        {id: 2, phase: 'PROCESS', label: getStr('homeScreenAutism.InProgress')},
        {id: 3, phase: 'COMPLETE', label: getStr('homeScreenAutism.Complete')},
      ],
      selectedMenu: 'ALL',
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {

		console.log("props", store.getState())
    //Call this on every page
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});

    let id = store.getState().user.id;

    let variables = {
      id,
    };

    // UHJlbGltaW5hcnlBc3Nlc3NtZW50VHlwZTozMDU=

    ParentRequest.screeningGetAllData(variables)
      .then((dataResult) => {
        console.log('screeningGetAllData', JSON.stringify(dataResult));
        let screenings = dataResult.data.getPreAssess.edges.map((item) => {
          let text = 'Complete';
          let color = Color.success;
          let phase = 'COMPLETE';
          if (item.node.assessmentQuestions.edges.length == 0) {
            text = 'Question Not Complete';
            color = Color.warning;
            phase = 'START';
          } else {
            if (item.node.assessmentAreas.edges.length == 0) {
              text = getStr('homeScreenAutism.Process');
              color = Color.primary;
              phase = 'PROCESS';
            } else {
              text = getStr('homeScreenAutism.Complete');
              color = Color.success;
              phase = 'COMPLETE';
            }
          }
          item.text = text;
          item.color = color;
          item.phase = phase;
          return item;
        });
        screenings = screenings.reverse();
        this.setState({isLoading: false, screenings});
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  renderStatus(item) {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            paddingHorizontal: 6,
            paddingVertical: 2,
            backgroundColor: item.color,
            borderRadius: 5,
            marginTop: 5,
          }}>
          <Text style={{color: '#fff', fontSize: 12}}>{item.text}</Text>
        </View>
      </View>
    );
  }

  renderList() {
		let {screenings} = this.state;
		
		console.log("screenings", this.state.screenings)
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
              {this.state.screenings.length == 0 && (
                <NoData>No Data Available</NoData>
              )}

              {this.state.screenings.map((item, key) => {
                // console.log("Item", item.phase, this.state.selectedMenu, key)
                if (
                  this.state.selectedMenu == 'ALL' ||
                  item.phase == this.state.selectedMenu
                ) {
                  return (
                    <TouchableOpacity
                      style={styles.listItem}
                      key={key}
                      activeOpacity={0.8}
                      onPress={() => {
                        this.props.navigation.navigate('ScreeningHome', 
                        {
                          item: item,
                          fromParent: this.props.route.params.fromParent,
                          student: this.props.route.params.student
                        }
                        );
                      }}>
                      <View style={{flex: 1, justifyContent: 'center'}}>
										<Text>{item.node.name}</Text>
                        <Text style={styles.listItemDate}>
                          {moment(item.node.date).format('DD MMM YYYY')}
                        </Text>
                        {this.renderStatus(item)}
                      </View>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  );
                }
              })}
            </>
          )}
        </ScrollView>
      </>
    );
  }

  render() {
    let {screenings} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={getStr('homeScreenAutism.AutismScreening')}
          backPress={() => this.props.navigation.goBack()}
          materialCommunityIconsName="plus"
          dotsPress={() => {
            this.props.navigation.navigate('ScreeningHome', {
              fromParent: this.props.route.params.fromParent,
              student: this.props.route.params.student
            });
          }}
        />

        <View style={{height: 50}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                paddingLeft: 16,
                paddingRight: 16,
              }}>
              {this.state.menus.map((menu) => {
                let style = styles.menuButton;
                let styleText = styles.menuButtonText;
                if (menu.phase == this.state.selectedMenu) {
                  style = styles.menuButtonActive;
                  styleText = styles.menuButtonTextActive;
                }
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={style}
                    key={menu.id}
                    onPress={() => {
                      this.setState({selectedMenu: menu.phase});
                    }}>
                    <Text style={styleText}>{menu.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <Container>
          {this.state.isLoading && <LoadingIndicator />}

          {!this.state.isLoading && this.renderList()}
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
  listItem: {
    margin: 3,
    marginTop: 10,
    backgroundColor: Color.white,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemDate: {
    color: Color.primary,
    fontSize: 15,
  },
  listItemStatus: {
    color: Color.white,
    backgroundColor: Color.primary,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
    marginTop: 5,
    fontSize: 12,
  },
  dot: {
    height: 5,
    width: 5,
    backgroundColor: Color.silver,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  menuButton: {
    backgroundColor: Color.gray,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
    justifyContent: 'center',
  },
  menuButtonActive: {
    backgroundColor: Color.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
    justifyContent: 'center',
  },
  menuButtonText: {
    color: Color.blackFont,
  },
  menuButtonTextActive: {
    color: Color.white,
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

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningList);
