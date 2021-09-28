import React, {Component, useState} from 'react';

import {useMutation} from '@apollo/react-hooks';
import {Overlay} from 'react-native-elements';
import { client, newToiletData, getToiletData} from '../../constants';

import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import {Input} from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getStr} from '../../../locales/Locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/min/moment-with-locales';
import DateHelper from '../../helpers/DateHelper';
import store from '../../redux/store';

const NewToiletDataScreen = props => {
  const [studentId, setStudentId] = useState(props.route.params.studentId);
  let date = DateHelper.getTodayDate();
  const [newToilet, {loading, error, data}] = useMutation(newToiletData, {
    client,
    variables: {
      studentId: studentId
    },
    refetchQueries: [
      {
        query: getToiletData,
        variables: {studentId: studentId, date},
      },
    ],
  });
  if (loading) {
    return (
      <Overlay isVisible fullScreen>
        <ActivityIndicator size="large" color="blue" />
      </Overlay>
    );
  } else if (error) {
    return <Text>Error</Text>;
  } else {
    return (
      <NewToiletDataScreenP {...props} data={data} newToilet={newToilet} />
    );
  }
};
class DateTimer extends Component {
  state = {
    datevar: '',
    time: '',
  };
  interval = '';
  componentDidMount() {
    this.interval = setInterval(() => {
      let date = new Date().toLocaleString();
      let arraydate = date.split(' ');
      let time = arraydate[3];
      let datevar = arraydate[2] + ' ' + arraydate[1] + ' ' + arraydate[4];
      console.log('date', arraydate[0]);
      this.setState({time, datevar});
    }, 1000);
  }
  componentWillUnmount() {
    console.log('interval', this.interval);
    clearInterval(this.interval);
  }
  render() {
    let {time, datevar} = this.state;
    return (
      <View style={styles.formContainer}>
        <Text style={{color: '#63686E', fontSize: 16, fontWeight: '700'}}>
          Time
        </Text>
        <View style={styles.formElement}>
          <View style={styles.formButton}>
            <Text style={{fontSize: 16, color: '#3E7BFA'}}>{time}</Text>
          </View>
          <View style={styles.formButton}>
            <Text style={{fontSize: 16, color: '#3E7BFA'}}>{datevar}</Text>
          </View>
        </View>
      </View>
    );
  }
}
class NewToiletDataScreenP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urination: true,
      bowel: true,
      prompted: true,
      lastWater: '100 ml',
      lastWaterTime: '',
      show: false,
      time: '',
      date: '',
    };
  }

  handleSubmit = () => {
    console.log('handle submit');
    let {
      urination,
      bowel,
      prompted,
      lastWater,
      show,
      lastWaterTime,
      time,
      date,
    } = this.state;
    let {newToilet, data} = this.props;
    newToilet({
      variables: {
        urination,
        bowel,
        prompted,
        lastWater,
        lastWaterTime,
        time,
        date,
      },
    });
  };

  onChange = (event, selectedValue) => {
    let datetime = selectedValue.toString();
    let time = datetime.split(' ');
    this.setState({
      lastWaterTime: time[4],
      show: false,
      time: moment().format('HH:mm:ss'),
      date: moment().format('YYYY-MM-DD'),
    });
  };

  render() {
    console.log('date fromating', moment().format('YYYY-MM-DD'));
    let {
      urination,
      bowel,
      prompted,
      lastWater,
      lastWaterTime,
      show,
      time,
      date,
    } = this.state;
    let {newToilet, data} = this.props;
    console.log('newToilet->mutation', data);
    console.log('time', lastWaterTime);
    if (data) {
      Alert.alert('Data Saved successfully')
      this.props.navigation.navigate('BehaviourDecelToiletScreen', {
        newData: true,
      });
    }
    

    return (
      <SafeAreaView>
        <KeyboardAwareScrollView
          style={styles.scrollView}>
          <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backIcon}
                onPress={() => this.props.navigation.goBack()}>
                <Text>
                  <FontAwesome5
                    name={'chevron-left'}
                    style={styles.backIconText}
                  />
                </Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>New Toilet Data</Text>
            </View>
          </View>
          <View style={{padding: 10, marginBottom: 100}}>
            {/* <DateTimer /> */}
            <View style={styles.formContainer}>
              <Text style={{color: '#63686E', fontSize: 16, fontWeight: '700'}}>
                Urination
              </Text>
              <View style={styles.formElement}>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => this.setState({urination: true})}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: urination ? '#3E7BFA' : '#8F90A6',
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => this.setState({urination: false})}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: !urination ? '#3E7BFA' : '#8F90A6',
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: '#63686E',
                  fontSize: 16,
                  fontWeight: '700',
                  paddingTop: 10,
                }}>
                Bowel Movement
              </Text>
              <View style={styles.formElement}>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => this.setState({bowel: true})}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: bowel ? '#3E7BFA' : '#8F90A6',
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => this.setState({bowel: false})}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: !bowel ? '#3E7BFA' : '#8F90A6',
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: '#63686E',
                  fontSize: 16,
                  fontWeight: '700',
                  paddingTop: 10,
                }}>
                Independent Request
              </Text>
              <View style={styles.formElement}>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => this.setState({prompted: true})}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: prompted ? '#3E7BFA' : '#8F90A6',
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => this.setState({prompted: false})}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: !prompted ? '#3E7BFA' : '#8F90A6',
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: '#63686E',
                  fontSize: 16,
                  fontWeight: '700',
                  paddingTop: 10,
                }}>
                Water Intake in ml
              </Text>
              <View style={styles.formElement}>
                <TextInput
                  style={styles.formInput}
                  onChangeText={text =>
                    this.setState({lastWater: text + ' ml'})
                  }
                />
              </View>
              <Text
                style={{
                  color: '#63686E',
                  fontSize: 16,
                  fontWeight: '700',
                  paddingTop: 10,
                }}>
                Water Intake time
              </Text>
              <View style={styles.formElement}>
                <TouchableOpacity
                  style={styles.formInput}
                  onPress={() => this.setState({show: true})}
                  title="Show time picker!">
                  <Text>{lastWaterTime}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={this.onChange}
            />
          )}
        </KeyboardAwareScrollView>
        <View style={styles.continueView}>
          <TouchableOpacity
            style={styles.continueViewTouchable}
            activeOpacity={0.5}
            onPress={this.handleSubmit}>
            <Text style={styles.continueViewText}>Save Data</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
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
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '80%',
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
    // marginRight: 10
  },

  //
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
    position: 'absolute',
    bottom: 0,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  formElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    marginTop: 10,
    borderWidth: 1.25,
    borderStyle: 'solid',
    borderColor: '#D5D5D5',
    elevation: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 150,
    backgroundColor: '#ffffff',
  },
  formInput: {
    marginTop: 10,
    borderWidth: 1.25,
    borderStyle: 'solid',
    borderColor: '#D5D5D5',
    elevation: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    backgroundColor: '#ffffff',
  },
});
export default NewToiletDataScreen;
