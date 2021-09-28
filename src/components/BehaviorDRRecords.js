import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import NavigationHeader from './NavigationHeader';
import {getStr} from '../../locales/Locale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateInput from './DateInput.js';
import PickerModal from './PickerModal';
import Button from './Button';
import moment from 'moment';
import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../redux/actions/index';
import {getAuthResult, getAuthTokenPayload} from '../redux/reducers/index';
import ParentRequest from '../constants/ParentRequest';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../utility/Color';
import LoadingIndicator from './LoadingIndicator';
import NoData from './NoData';

import AddEnvironmentContainer from './AddEnvironmenContainer';
import DateRangePicker from './DateRangePicker';

const BehaviorDRRecords = (props) => {
  console.log('<<<props>>>', props);
  const [tempId, setTempId] = useState(props.route.params.tempId);
  const [startDate, setStartDate] = useState(
    moment().subtract(4, 'weeks').format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  const [isLoading, setIsLoading] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [behaviorName, setBehaviorName] = useState('');
  const displayedDate = moment();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (templateData.length !== 0) {
      const filtered = templateData.filter((x) => x.date === date);
      setFilteredData(filtered);
    }
  }, [date, templateData]);

  const getData = () => {
    setIsLoading(true);
    let tempid;
    let variables = {
      // date: this.state.selectedDate,
      student: props.route.params.studentId,
    };
    ParentRequest.getBehaviorTemplate(variables)
      .then((result) => {
        setIsLoading(true);
        result.data.getBehaviorTemplates.edges.map((element, index) => {
          if (element.node.id === tempId) {

            const {
              behavior,
              behaviorType,
              frequencyratebehaviorrecordSet,
              durationbehaviorrecordSet,
              latencybehaviorrecordSet,
              partialintervalbehaviorrecordSet,
              wholeintervalbehaviorrecordSet,
              momentarytimebehaviorrecordSet,
              statusrecordSet,
            } = element.node;
            setBehaviorName(behavior.behaviorName);

            if (behaviorType.includes('DR')) {
              if (durationbehaviorrecordSet) {
                const behaviorRecords = durationbehaviorrecordSet.edges.map(
                  ({node}) => ({
                    id: node.id,
              date: node.date,
              startTime: node.startTime,
              endTime: node.endTime,
              duration: node.duration,
              behaviorType: 'DR',
              behavior: behavior.behaviorName,
                  }),
                );

                setTemplateData(behaviorRecords);
                setIsLoading(false);
              }
            }
          }
        });
      })
      .catch((error) => {
        console.log('Err', error);
        Alert.alert('Warning', error.toString());
        setIsLoading(false);
      });
  };


  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <NavigationHeader
        title={`${getStr('BegaviourData.BehaviorDR')}-${behaviorName}`}
        backPress={() => props.navigation.goBack()}
      />
      <View style={{padding: 5, margin: 0}}>
        <DateInput
          label="Date"
          //error={this.state.dateErrorMessage}
          format="YYYY-MM-DD"
          displayFormat="dddd, DD MMM YYYY"
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
        />
      </View>
      {/* {isLoading && <LoadingIndicator />} */}
      {/* <View style={{padding: 5, margin: 5}}>
        <DateRangePicker
      onChange={handleDate}
      endDate={endDate}
      startDate={startDate}      
      range
       >
         <Text>Select DAte Range</Text>
         </DateRangePicker> 
      </View> */}
      {isLoading && <LoadingIndicator />}
      <ScrollView>
        {filteredData && filteredData.length === 0 ? (
          <NoData>No Data Available</NoData>
        ) : (
          filteredData.map((item, index) => {
            return (
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.title, {flex: 1}]}>{item.date}</Text>

                  <TouchableOpacity
                   style={{marginRight: 8}}
                    onPress={() => {
                      console.log('pressed', item);
                      props.navigation.navigate('BehaviorDRScreen', {
                        studentId: props.route.params.studentId,
                        currentRecord: item,
                        tempId,
                        getData,
                      });
                      // onEdit();
                    }}>
                    <MaterialCommunityIcons
                      name="lead-pencil"
                      size={20}
                      color={Color.blackOpacity}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const variables = {
                        record: item.id,
                        behaviorType: item.behaviorType,
                      };
                      Alert.alert('Information', 'Are you sure ?', [
                        {text: 'No', onPress: () => {}, style: 'cancel'},
                        {
                          text: 'Yes',
                          onPress: () => {
                            setIsLoading(true);
                            ParentRequest.removeStudentBehaviorRecord(variables)
                              .then((result) => {
                                getData();
                                Alert.alert(
                                  'Information',
                                  'Record Successfully Deleted!!.',
                                );
                                setIsLoading(false);
                              })
                              .catch((error) => {
                                setIsDeleting(false);
                              });
                          },
                        },
                      ]);

                      // onEdit();
                    }}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color={Color.blackOpacity}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{color: '#63686E', fontSize: 13}}>
                      StartTime:{' '}
                    </Text>
                    <Text
                      style={{
                        color: Color.black,
                        fontSize: 13,
                        paddingBottom: 8,
                        fontWeight: 'bold',
                      }}>
                      {item.startTime}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{color: '#63686E', fontSize: 13}}>
                      EndTime:{' '}
                    </Text>
                    <Text
                      style={{
                        color: Color.black,
                        fontSize: 13,
                        paddingBottom: 8,
                        fontWeight: 'bold',
                      }}>
                      {item.endTime}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{color: '#63686E', fontSize: 13}}>
                      Duration:{' '}
                    </Text>
                    <Text
                      style={{
                        color: Color.black,
                        fontSize: 13,
                        paddingBottom: 8,
                        fontWeight: 'bold',
                      }}>
                      {item.duration}
                    </Text>
                  </View>                  
                </View>
                {/* <View style={{flex:1}}>
              <Text style={styles.title}>Date:{item.date}</Text>
           </View> */}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: Color.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.blackFont,
    marginRight: 17,
  },
  description: {
    paddingTop: 10,
    paddingBottom: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 14,
    fontWeight: 'normal',
  },
  actionitems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    height: 75,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  arrow: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(BehaviorDRRecords);
