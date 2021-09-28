import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import BehaviourDecelToiletCard from '../../components/BehaviourDecelToiletCard';
import CalendarWeekView from '../../components/CalendarWeekView';
import BehaviourDecelVideoCard from '../../components/BehaviourDecelVideoCard';
import DateTimePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';
import store from '../../redux/store';
import DateHelper from '../../helpers/DateHelper';
import Color from '../../utility/Color';
import Styles from '../../utility/Style';
import {Row, Container, Column} from '../../components/GridSystem';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setBehaviourDecelToilet,
} from '../../redux/actions/index';
import NavigationHeader from '../../components/NavigationHeader';
import MultiSelectComponent from '../../components/MultiSelectComponent';
import OrientationHelper from '../../helpers/OrientationHelper';
import Button from '../../components/Button';
import ParentRequest from '../../constants/ParentRequest';

import NewToiletDataScreen from '../../pages/therapy/NewToiletDataScreen';
import NoData from '../../components/NoData';
import {getStr} from '../../../locales/Locale';
import CalendarView from '../../components/CalendarView';
import moment from 'moment/min/moment-with-locales';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class BehaviourDecelToiletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEnabled: false,
      toiletDataItems: [],
      noDataText: '',
      selectedDate: DateHelper.getTodayDate(),
      reminder: 'Time',
      reminderShow: false,
      selectedReminderDays: [],
      multiSelectShow: false,
      items: [
        {id: 'SU', name: 'Sunday'},
        {id: 'MO', name: 'Monday'},
        {id: 'TU', name: 'Tuesday'},
        {id: 'WE', name: 'Wednesday'},
        {id: 'TH', name: 'Thursday'},
        {id: 'FR', name: 'Friday'},
        {id: 'SA', name: 'Saturday'},
      ],
    };
    this.props.dispatchSetToiletData(this);
  }

  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetToiletData(null);
  }

  _refresh() {
    console.log('_refresh() is called');
    this.getData();
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    //Call this on every page
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    let studentId = this.props.route.params.studentId;
    let selectedDate = this.state.selectedDate;
    console.log(studentId + ',' + selectedDate);
    this.getToiletData(studentId, selectedDate);
  }

  getToiletData(studentId, selectedDate) {
    this.setState({isLoading: true, toiletDataItems: []});
    let variables = {
      studentId: studentId,
      date: selectedDate,
    };
    ParentRequest.fetchToiletData(variables)
      .then((toiletData) => {
        console.log('Toilet Data: ', toiletData);
        if (toiletData.data.getToiletData.edges.length === 0) {
          this.setState({noDataText: 'No data found'});
        }
        this.setState({
          toiletDataItems: toiletData.data.getToiletData.edges,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log('Error: ' + JSON.stringify(error));
        this.setState({isLoading: false});
      });
  }

  callBackFromCalendar = (selectedDateFromCalendar) => {
    console.log(JSON.stringify(this.state));
    console.log(selectedDateFromCalendar + '==' + this.state.selectedDate);
    if (selectedDateFromCalendar === this.state.selectedDate) {
      console.log('reselected same date');
    } else {
      console.log('selectedDate:' + selectedDateFromCalendar);
    }
    let studentId = this.props.route.params.studentId;
    let selectedDate = this.state.selectedDate;
    this.setState({
      isLoading: true,
      noDataText: '',
      selectedDate: selectedDateFromCalendar,
      toiletDataItems: [],
    });
    console.log(studentId + ',' + selectedDateFromCalendar);
    this.getToiletData(studentId, selectedDateFromCalendar);
  };

  renderToiletDataItems() {
    let {toiletDataItems} = this.state;
    let studentId = this.props.route.params.studentId;
    return toiletDataItems.map((toiletItem, index) => {
      let title = '';
      if (toiletItem.node.urination && toiletItem.node.bowel) {
        title = 'Urination & Bowel Movement';
      } else if (toiletItem.node.bowel) {
        title = 'Bowel Movement';
      } else if (toiletItem.node.urination) {
        title = 'Urination';
      } else {
        title = 'No response';
      }

      let prompted = toiletItem.node.prompted
        ? 'Independent Request'
        : 'Prompted to Request';
      return (
        <BehaviourDecelToiletCard
          key={toiletItem.node.id}
          title={title}
          time={moment(toiletItem.node.time, ['h:mm A']).format('hh:mm A')}
          riskType={prompted}
          onPress={() => {
            this.props.navigation.navigate('NewToiletDataScreen', {
              toilet: toiletItem,
              studentId: studentId,
              parent: this,
            });
          }}
        />
      );
    });
  }

  showReminderTimeDays() {
    let {multiSelectShow, selectedReminderDays} = this.state;
    let days = selectedReminderDays.join(' , ');
    return (
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <View style={styles.reminderTime}>
          <TouchableOpacity
            style={{textAlign: 'center', width: '100%'}}
            onPress={() => {
              this.setState({reminderShow: true});
            }}>
            <Text
              style={{
                width: '100%',
                paddingTop: 10,
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.reminder}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reminderDays}>
          <TouchableOpacity
            onPress={() => {
              this.setState({multiSelectShow: true});
            }}>
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {days == '' ? 'select days' : days}
            </Text>
          </TouchableOpacity>

          {multiSelectShow && (
            <MultiSelectComponent
              items={this.state.items}
              modalHide={() => this.setState({multiSelectShow: false})}
              selectedItems={this.state.selectedReminderDays}
              selectItems={(selectedReminderDays) =>
                this.setState({selectedReminderDays, multiSelectShow: false})
              }
            />
          )}
        </View>
      </View>
    );
  }

  renderHeader() {
    if (!this.props.isFromSession) {
      return (
        <View>
          <CalendarView
            parentCallback={this.callBackFromCalendar}
            selectedDate={this.state.selectedDate}
          />

          {/* <View style={{ marginVertical: 10 }}>
                        <BehaviourDecelVideoCard
                            title={this.getMedicalVideoData()[0].title}
                            videoDuration={this.getMedicalVideoData()[0].videoDuration}
                        />
                    </View> */}
        </View>
      );
    }

    return null;
  }

  renderToiletList() {
    let {isLoading, isEnabled, toiletDataItems, noDataText} = this.state;
    let studentId = this.props.route.params.studentId;
    return (
      <>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {/* <View style={styles.toiletReminder}>
                            <View style={{width: '75%'}}>
                                <Text style={{color: '#63686E', fontSize: 16}}>Toilet Reminders</Text>
                                <Text style={{color: 'rgba(95, 95, 95, 0.75)', fontSize: 16}}>Reminder to use the toilet</Text>
                            </View>
                            <View style={{width: '20%'}}>
                                <ToggleSwitch
                                    isOn={isEnabled}
                                    onColor={Color.primary}
                                    offColor={Color.gray}
                                    size="large"
                                    onToggle={isEnabled => {
                                        this.setState({ isEnabled });
                                    }}
                                />
                            </View>
                        </View>
                        { isEnabled &&
                            this.showReminderTimeDays()
                        } */}

          {!this.state.isLoading && toiletDataItems.length == 0 && (
            <NoData>No Data on This Date</NoData>
          )}

          {!this.state.isLoading && this.renderToiletDataItems()}

          {this.state.reminderShow && (
            <DateTimePicker
              testID="dateTimePicker2"
              value={new Date()}
              mode="time"
              display="default"
              onChange={this.onRemainderChange}
            />
          )}
        </ScrollView>
        {OrientationHelper.getDeviceOrientation() == 'portrait' &&
          !this.props.isFromSession && (
            <View style={{marginBottom: 10}}>
              <Button
                labelButton={getStr('NewToiletData.NewToiletData')}
                onPress={() => {
                  this.props.navigation.navigate('NewToiletDataScreen', {
                    studentId: studentId,
                    parent: this,
                    isNew: true,
                  });
                }}
              />
            </View>
          )}
      </>
    );
  }

  onRemainderChange = (event, selectedValue) => {
    if (selectedValue != undefined) {
      this.setState({
        reminder: DateHelper.getTimeFromDatetime(selectedValue),
        reminderError: '',
        reminderShow: false,
      });
    }
  };

  getMedicalVideoData() {
    let data = [
      {title: getStr('NewToiletData.ToiletDes'), videoDuration: '5 Min'},
    ];
    return data;
  }

  render() {
    let {isLoading} = this.state;
    let studentId = this.props.route.params.studentId;
    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          title={getStr('NewToiletData.ToiletData')}
          backPress={() => this.props.navigation.goBack()}
        />
        <Container enablePadding={this.props.disableNavigation != true}>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              {this.renderHeader()}
              {this.renderToiletList()}
            </>
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <Row style={{flex: 1}}>
              <Column style={{flex: 2}}>
                {this.renderHeader()}
                {this.renderToiletList()}
              </Column>
              <Column>
                <NewToiletDataScreen
                  disableNavigation
                  route={{
                    params: {
                      studentId: studentId,
                      parent: this,
                    },
                  }}
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
  toiletReminder: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  reminderTime: {
    flexDirection: 'row',
    width: '25%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    // padding: 10,
    marginRight: 10,
    height: 40,
  },
  reminderDays: {
    flexDirection: 'row',
    width: '65%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    padding: 10,
    marginLeft: 10,
    height: 40,
  },
  continueViewTouchable: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 5,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
  dispatchSetToiletData: (data) => dispatch(setBehaviourDecelToilet(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourDecelToiletScreen);
