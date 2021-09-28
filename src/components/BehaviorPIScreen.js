import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Button from './Button';
import moment from 'moment';
import NavigationHeader from './NavigationHeader';
import {getStr} from '../../locales/Locale';
import {connect} from 'react-redux';
import DateInput from './DateInput.js';
import {setToken, setTokenPayload} from '../redux/actions/index';
import ParentRequest from '../constants/ParentRequest';
import {getAuthResult, getAuthTokenPayload} from '../redux/reducers/index';
import Color from '../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PickerModal from './PickerModal';
import Timer from 'react-compound-timer';
import * as Progress from 'react-native-progress';
import RNPickerSelect from 'react-native-picker-select';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BehaviorIntervalTable from './BehaviorIntervalTable';
import AddEnvironmentContainer from './AddEnvironmenContainer';

import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';

const BehaviorPIScreen = (props) => {
  const [tempId, setTempId] = useState(props.route.params.tempId);
  const chunkSize = 5;
  const totalObservationInput = useRef();
  const swipableRef = [];
  const timerRef = useRef();
  const remainingTimerRef = useRef();
  const tableRef = useRef();
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [environment, setEnvironment] = useState(null);
  const [isPendingRes, setIsPendingRes] = useState(false);
  const [frequency, setFrequency] = useState(0);
  const [errMsg, setErrMsg] = useState(null);
  const [recordingType, setRecordingType] = useState('CT');
  const [lengthOfIntervals, setLengthOfIntervals] = useState([
    {label: '1', value: 1},
  ]);
  const [selectedLengthOfInterval, setSelectedLengthOfInterval] = useState(1);
  const [totalSeconds, setTotalSeconds] = useState(1800);
  const [observationTime, setObservationTime] = useState(props.route.params.currentRecord ? props.route.params.currentRecord.totalObservationTime : 30 );
  const [editObservationTime, setEditObservationTime] = useState(false);
  const [textInputObservationTime, setTextInputObservationTime] = useState(0);
  const [checkboxesStatus, setCheckboxesStatus] = useState(   
    Array(parseInt(observationTime / selectedLengthOfInterval, 10)).fill(false),
  );
  const [resetFlag, setResetFlag] = useState(false);
  const [count, setCount] = useState(0);
  const recordingTypes = [
    {id: 'CT', label: 'Continous'},
    {id: 'DS', label: 'Discrete'},
  ];
  const [currentTable, setCurrentTable] = useState(1);
  const [observedTime, setObservedTime] = useState(0);
  const [continuousArray, setContinuousArray] = useState([]);
  const [hitCheckbox, setHitCheckbox] = useState([]);
  const [timeInterval, setTimeInterval] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [percent, setPercent] = useState(0);

  const [behaviorStarted, setBehaviorStarted] = useState(false);
  const [behaviorStartTime, setBehaviorStartTime] = useState(null);
  const [startInterval, setStartInterval] = useState(null);
  // const [behaviorEndTime, setBehaviorEndTime] = useState(null);
  console.log("count>>>",count);
  useEffect(()=>{
    if(props.route.params.currentRecord){
      const data=props.route.params.currentRecord
      console.log("dataPI>>>",data);
      let totalDuration = 0
      const continuousArray = data.durationRecords.edges.map(({ node }) => {
        if (node.startTime != null && node.endTime != null) {
          totalDuration += node.endTime - node.startTime
        }
        return { startTime: node.startTime, endTime: node.endTime, isSuccessful: node.isSuccessful }
      })
      setDate(data.date)
      setContinuousArray(continuousArray)
      setFrequency(data.frequency)
      setSelectedLengthOfInterval(data.intervalLength)
      setObservationTime(data.totalObservationTime)
      const checkboxes = []
      const hited=[]
      for (let i = 0; i < data.intervalChecks.length; i += 1) {
        if (data.intervalChecks[i] === '1') {
          hited.push(i+1)
          checkboxes.push(true)
        } else {
          checkboxes.push(false)
        }
      }
      setCheckboxesStatus(checkboxes)
      setHitCheckbox(hited)
      setCount(data.count)
      console.log('>>>>>>>', checkboxes,hited, '>>>', data.intervalChecks)
      // tableRef.current.state.checkboxesStatus = checkboxesStatus
      remainingTimerRef.current.setTime(data.observedTime * 1000)
      timerRef.current.setTime(data.observedTime*1000)
    }
  },[])

  

  useEffect(() => {
    const currentTime = parseInt(
      (observationTime * 60 * 1000 - timerRef?.current?.getTime()) / 1000,
      10,
    );
    const currentInterval = parseInt(
      (currentTime - 1) / (selectedLengthOfInterval * 60),
      10,
    );

    if (behaviorStarted) {
      setBehaviorStartTime(currentTime);
      // setHitCheckbox(currentInterval + 1);
      setStartInterval(currentInterval + 1);
    } else {
      // setBehaviorEndTime(currentTime);
      if (behaviorStartTime != null) {
        const temp = continuousArray;
        setFrequency(frequency + 1);
        setTotalDuration(totalDuration + currentTime - behaviorStartTime);
        temp.push({
          startTime: behaviorStartTime,
          endTime: currentTime,
          isSuccessful: true,
        });
        console.log(startInterval, currentInterval + 1);
        const x = [];
        for (let i = startInterval; i <= currentInterval + 1; i++) {
          console.log(i);
          x.push(i);
        }
        setStartInterval(null);
        setHitCheckbox(x);
        setContinuousArray(temp);
        setBehaviorStartTime(null);
      }
    }
  }, [behaviorStarted]);

  useEffect(() => {
    if (checkboxesStatus) {
      console.log("checkboxes 1>>>",checkboxesStatus);
      setCount(checkboxesStatus.filter((element) => element).length);
    }
  }, [checkboxesStatus]);

  const getIntervalChecks = (checkboxesStatus) => {
    let string = '';
    checkboxesStatus.map((element, index) => {
      if (element) {
        string += '1';
      } else {
        string += '0';
      }
    });
    return string;
  };

  const saveRecord = () => {
    console.log('saving');
    if(props.route.params.currentRecord){

      const variables = {
        date,
        totalObservationTime: observationTime,
        observedTime:parseInt(remainingTimerRef.current.getTime() / 1000, 10),
        intervalLength: selectedLengthOfInterval,
        intervals: parseInt(observationTime / selectedLengthOfInterval, 10),
        frequency,
        environment,
        recordingType,
        intervalChecks: getIntervalChecks(checkboxesStatus),
        durationRecords: continuousArray,
        studentTemplate: tempId,
        id:props.route.params.currentRecord.id,
        
      };
      console.log('variables------->',continuousArray);
      setIsSaving(true);
      ParentRequest.updatePIBehaviorRecord(variables)
        .then((res) => {
          console.log('response--->', res);
          setIsSaving(false);
          Alert.alert(
            getStr('BegaviourData.BehaviorPI'),
            'Successfully Saved',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  if (props.disableNavigation) {
                  } else {
                    props.route.params.getData()                    
                    props.navigation.goBack();
                  }
                },
              },
            ],
            {cancelable: false},
          );
        })
        .catch((error) => {
          setIsSaving(false);
          Alert.alert('Information', error.toString());
        });
      setIsSaving(false);

    }
    else{

      const variables = {
        date,
        totalObservationTime: observationTime,
        observedTime:parseInt(timerRef.current.getTime() / 1000, 10),
        intervalLength: selectedLengthOfInterval,
        intervals: parseInt(observationTime / selectedLengthOfInterval, 10),
        frequency,
        environment,
        recordingType,
        intervalChecks: getIntervalChecks(checkboxesStatus),
        durationRecords: continuousArray,
        studentTemplate: tempId,
      };
      console.log('variables------->', variables);
      setIsSaving(true);
      ParentRequest.addPIBehaviorRecord(variables)
        .then((res) => {
          console.log('response--->', res);
          setIsSaving(false);
          Alert.alert(
            getStr('BegaviourData.BehaviorPI'),
            'Successfully Saved',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  if (props.disableNavigation) {
                  } else {
                    props.navigation.goBack();
                  }
                },
              },
            ],
            {cancelable: false},
          );
        })
        .catch((error) => {
          setIsSaving(false);
          Alert.alert('Information', error.toString());
        });
      setIsSaving(false);

    }
    
  };

  // useEffect(()=>{
  //   if(behaviorStarted){

  //   }
  // }, [])

  const afterTimerStarts = () => {
    let x = false;
    let startTime = null;
    let endTime = null;

    setTimeInterval(
      setInterval(() => {
        setPercent(
          1 - timerRef?.current?.getTime() / (observationTime * 60 * 1000),
        );

        const currentTime = parseInt(
          (observationTime * 60 * 1000 - timerRef?.current?.getTime()) / 1000,
          10,
        );
        const currentInterval = parseInt(
          (currentTime - 1) / (selectedLengthOfInterval * 60),
          10,
        );
        setCurrentTable(Math.floor(currentInterval / chunkSize) + 1);
      }, 100),
    );
  };

  const afterTimerStops = () => {
    clearInterval(timeInterval);
  };

  const startTimer = () => {
    timerRef.current.setTime(remainingTimerRef.current.getTime());
    timerRef.current.start();

    // remainingTimerRef.start();
  };

  const stopTimer = () => {
    remainingTimerRef.current.setTime(timerRef.current.getTime());
    console.log("remaining>>>",parseInt(timerRef.current.getTime() / 1000, 10));
    timerRef.current.stop();
  };

  const generateLengthOfIntervals = (n) => {
    const x = [];
    let counter = 0;
    for (let i = 1; i <= n; i++) {
      if (n % i == 0) {
        counter++;
        x.push({value: i.toString(), label: i.toString(), key: counter});
      }
    }
    console.log(x, '================');
    return x;
  };

  const handleDiscrete = () => {
    // const { observationTime, continuousArray, frequency, intervals, lengthInterval } = this.state
    const currentTime = parseInt(
      (observationTime * 60 * 1000 - timerRef.current.getTime()) / 1000,
      10,
    );
    const temp = continuousArray;
    temp.push({startTime: currentTime});
    const currentInterval = parseInt(
      (currentTime - 1) / (selectedLengthOfInterval * 60),
      10,
    );
    // console.log(intervals, currentInterval)
    setContinuousArray(temp);
    setFrequency(frequency + 1);
    setHitCheckbox([currentInterval + 1]);
  };

  const leftFrequencyActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.bluejay}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
          }}>
          {frequency}
        </Animated.Text>
      </View>
    );
  };

  const leftDiscreteBehavingActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.bluejay}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
          }}>
          Behaved
        </Animated.Text>
      </View>
    );
  };

  const leftBehaviorActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.greenCyan}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
            fontSize: 18,
          }}>
          Behaving...
        </Animated.Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
          }}>
          <Text
            style={{...styles.actionText, fontSize: 14, paddingHorizontal: 10}}>
            Slide to stop timer
          </Text>
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={30}
            color="white"
          />
        </View>
      </View>
    );
  };

  const rightFrequencyActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.bluejay}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
            textAlign: 'right',
          }}>
          {frequency}
        </Animated.Text>
      </View>
    );
  };

  const changeFrequency = (boolean) => {
    if (boolean) {
      setFrequency(frequency + 1);
    } else {
      setFrequency(frequency - 1);
    }
  };

  const leftTimerAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={{
          ...styles.item,
          justifyContent: 'center',
          backgroundColor: Color.bluejay,
          elevation: 5,
        }}>
        <Animated.Text
          style={{
            ...styles.actionText,
            fontSize: 18,
            transform: [{scale}],
          }}>
          <Timer
            ref={timerRef}
            initialTime={observationTime * 60 * 1000}
            direction="backward"
            startImmediately={false}
            onStart={() => {
              // console.log('onStart hook');
              // this.setState({timerRunning: true});
              // this.startPercentage();
              afterTimerStarts();
            }}
            onResume={() => console.log('onResume hook')}
            onPause={() => console.log('onPause hook')}
            onStop={() => {
              setBehaviorStarted(false);
              afterTimerStops();
              // this.stopPercentage();
              // this.setState({
              //   duration: this.timerRef.current.getTime(),
              //   behaving: false,
              //   timerRunning: false,
              // });
              // this.handleChange(this.timerRef.current.getTime());
            }}
            onReset={() => {
              // this.timerRef.current.setTime(observationTime * 60 * 1000);
              // this.tableRef.current.resetCheckboxes();
              // form.setFieldsValue({
              //   frequency: 0,
              //   totalDuration: 0,
              // });
              // this.setState({frequency: 0});
            }}>
            {({start, resume, pause, stop, reset, timerState}) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Text style={{margin: 5, fontSize: 16, color: Color.white}}>
                  <Timer.Minutes /> min
                </Text>
                <Text style={{margin: 5, fontSize: 16, color: Color.white}}>
                  <Timer.Seconds /> sec
                </Text>
              </View>
            )}
          </Timer>
        </Animated.Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
          }}>
          <Text
            style={{...styles.actionText, fontSize: 14, paddingHorizontal: 10}}>
            Slide to stop timer
          </Text>
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={30}
            color="white"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <NavigationHeader
        title={getStr('BegaviourData.BehaviorPI')}
        backPress={() => props.navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        <View style={{padding: 5, margin: 5}}>
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
        <Swipeable
          style={{marginTop: 10}}
          leftThreshold={10}
          rightThreshold={10}
          renderLeftActions={leftTimerAction}
          onSwipeableWillClose={() => {
            stopTimer();
          }}
          onSwipeableLeftWillOpen={() => {
            // openDuration();
            startTimer();
          }}
          onSwipeableClose={() => console.log('swipeable close')}>
          <View
            style={{
              ...styles.item,
              justifyContent: 'center',
              backgroundColor: Color.bluejay,
              elevation: 5,
            }}>
            <View style={{margin: 10}}>
              <MaterialCommunityIcons
                name="chevron-double-right"
                size={30}
                color={Color.white}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              {editObservationTime && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <TextInput
                    style={{color: Color.white, fontSize: 18}}
                    placeholder="00"
                    placeholderTextColor="#ccc"
                    ref={totalObservationInput}
                    value={observationTime}
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={(text) => {
                      console.log('text----', text);
                      setHitCheckbox([])
                      setCheckboxesStatus( Array(parseInt(observationTime / selectedLengthOfInterval, 10)).fill(false))
                      if (text != '') {
                        setTextInputObservationTime(parseInt(text, 10));
                      } else {
                        setTextInputObservationTime(0);
                      }
                    }}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        totalObservationInput.current.clear();
                        setObservationTime(0);
                      }
                    }}
                  />
                  <Text
                    style={{color: Color.white, fontSize: 18, marginLeft: 10}}>
                    Minutes{' '}
                  </Text>
                </View>
              )}
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.titleText}>Remaining Time</Text>
                <Timer
                  ref={remainingTimerRef}
                  initialTime={observationTime * 60 * 1000}
                  direction="backward"
                  startImmediately={false}
                  onStart={() => {
                    // console.log('onStart hook');
                    // this.setState({timerRunning: true});
                    // this.startPercentage();
                  }}
                  onResume={() => console.log('onResume hook')}
                  onPause={() => console.log('onPause hook')}
                  onStop={() => {
                    // this.stopPercentage();
                    // this.setState({
                    //   duration: this.timerRef.current.getTime(),
                    //   behaving: false,
                    //   timerRunning: false,
                    // });
                    // this.handleChange(this.timerRef.current.getTime());
                  }}
                  onReset={() => {
                    // this.timerRef.current.setTime(observationTime * 60 * 1000);
                    // this.tableRef.current.resetCheckboxes();
                    // form.setFieldsValue({
                    //   frequency: 0,
                    //   totalDuration: 0,
                    // });
                    // this.setState({frequency: 0});
                  }}>
                  {({start, resume, pause, stop, reset, timerState}) => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      <Text
                        style={{margin: 5, fontSize: 16, color: Color.white}}>
                        <Timer.Minutes /> min
                      </Text>
                      <Text
                        style={{margin: 5, fontSize: 16, color: Color.white}}>
                        <Timer.Seconds /> sec
                      </Text>
                    </View>
                  )}
                </Timer>
              </View>
            </View>
            {!editObservationTime && (
              <TouchableOpacity onPress={() => setEditObservationTime(true)}>
                <MaterialCommunityIcons
                  name="circle-edit-outline"
                  size={24}
                  color={Color.white}
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
            )}
            {editObservationTime && (
              <TouchableOpacity
                onPress={() => {
                  if (textInputObservationTime != 0) {
                    timerRef.current.setTime(
                      textInputObservationTime * 60 * 1000,
                    );
                    remainingTimerRef.current.setTime(
                      textInputObservationTime * 60 * 1000,
                    );
                    setEditObservationTime(false);
                    setObservationTime(textInputObservationTime);
                    setPercent(0);
                    setCurrentTable(1);
                  } else {
                    setEditObservationTime(false);
                  }
                }}>
                <MaterialCommunityIcons
                  name="check"
                  size={24}
                  color={Color.white}
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
            )}
          </View>
        </Swipeable>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Text>LengthOfInterval</Text>
            <RNPickerSelect
              placeholder={{
                label: 'Select Interval Length...',
                value: null,
                color: '#9EA0A4',
              }}
              textInputProps={{textAlign: 'center'}}
              value={selectedLengthOfInterval.toString()}
              onValueChange={(value) =>{
                console.log("changed>>");
                setHitCheckbox([])
                setCheckboxesStatus( Array(parseInt(observationTime / value, 10)).fill(false))
                // setResetFlag(!resetFlag);
                setSelectedLengthOfInterval(parseInt(value))
              }
              }
              items={generateLengthOfIntervals(observationTime)}
            />
          </View>

          <View
            style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Text>Intervals</Text>
            <Text style={{marginTop: 15}}>
              {parseInt(observationTime / selectedLengthOfInterval, 10)}
            </Text>
          </View>
        </View>
        <View style={{marginVertical: 10}}>
          <Swipeable
            ref={(ref) => {
              swipableRef['frequency'] = ref; //or this.refsArray[item.id]
            }}
            leftThreshold={10}
            rightThreshold={10}
            renderLeftActions={leftFrequencyActions}
            renderRightActions={rightFrequencyActions}
            onSwipeableLeftWillOpen={() => {
              setFrequency(frequency + 1);
              swipableRef['frequency'].close();
            }}
            onSwipeableRightWillOpen={() => {
              if (frequency > 0) {
                setFrequency(frequency - 1);
                // setRate(frequency, duration, unit);

                console.log('inside', frequency);
              } else {
                null;
              }
              swipableRef['frequency'].close();
            }}>
            {isPendingRes ? (
              <View
                style={{
                  ...styles.item,
                  justifyContent: 'space-between',
                  backgroundColor: Color.lapisblue,
                  elevation: 5,
                }}>
                <LoadingIndicator color="white" />
              </View>
            ) : (
              <View
                style={{
                  ...styles.item,
                  justifyContent: 'space-between',
                  backgroundColor: Color.lapisblue,
                  elevation: 5,
                }}>
                <View style={{...styles.arrow, alignItems: 'center'}}>
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    size={30}
                    color={Color.white}
                  />
                  <Text style={{fontSize: 10, color: Color.white}}>+1</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingHorizontal: 10,
                      color: Color.white,
                    }}>
                    Frequency
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      paddingHorizontal: 10,
                      color: Color.white,
                    }}>
                    {frequency}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.arrow,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={{fontSize: 10, color: Color.white}}>-1</Text>
                  <MaterialCommunityIcons
                    name="chevron-double-left"
                    size={30}
                    color={Color.white}
                  />
                </View>
              </View>
            )}
          </Swipeable>
        </View>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <Text>Recording Type</Text>
          <RNPickerSelect
            placeholder={{
              label: 'Select Recording Type',
              value: null,
              color: '#9EA0A4',
            }}
            value={recordingType}
            onValueChange={(value) => {
              setRecordingType(value);
              setContinuousArray([]);
            }}
            items={[
              {label: 'Continuous', value: 'CT'},
              {label: 'Discrete', value: 'DS'},
            ]}
          />
        </View>
        <View style={{marginVertical: 10}}>
          {recordingType == 'CT' && (
            <Swipeable
              leftThreshold={10}
              rightThreshold={10}
              renderLeftActions={leftBehaviorActions}
              onSwipeableLeftWillOpen={() => {
                // setFrequency(frequency + 1);
                // swipableRef['frequency'].close();
                setBehaviorStarted(true);
              }}
              onSwipeableWillClose={() => {
                setBehaviorStarted(false);
              }}>
              <View
                style={{
                  ...styles.item,
                  justifyContent: 'center',
                  backgroundColor: Color.bluejay,
                  elevation: 5,
                }}>
                <View style={{margin: 10}}>
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    size={30}
                    color={Color.white}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingHorizontal: 10,
                      color: Color.white,
                    }}>
                    Behavior Started
                  </Text>
                </View>
              </View>
            </Swipeable>
          )}
          {recordingType == 'DS' && (
            <Swipeable
              ref={(ref) => {
                swipableRef['behaving'] = ref; //or this.refsArray[item.id]
              }}
              leftThreshold={10}
              rightThreshold={10}
              renderLeftActions={leftDiscreteBehavingActions}
              onSwipeableLeftWillOpen={() => {
                handleDiscrete();
                swipableRef['behaving'].close();
              }}>
              <View
                style={{
                  ...styles.item,
                  justifyContent: 'space-between',
                  backgroundColor: Color.lapisblue,
                  elevation: 5,
                }}>
                <View style={{...styles.arrow, alignItems: 'center'}}>
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    size={30}
                    color={Color.white}
                  />
                  <Text style={{fontSize: 10, color: Color.white}}></Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingHorizontal: 10,
                      color: Color.white,
                    }}>
                    Behaving
                  </Text>
                </View>
              </View>
            </Swipeable>
          )}
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            width: '100%',
            flex: 1,
          }}>
          <AddEnvironmentContainer
            onChange={(value) => {
              console.log('set env out', value);
              setEnvironment(value);
            }}
            studentId={props.route.params.studentId}
          />
        </View> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}>
          <Text>Duration: {totalDuration} seconds</Text>
          <Text>Total Count: {count}</Text>
        </View>
        <BehaviorIntervalTable
          ref={tableRef}
          percent={percent}
          resetFlag={resetFlag}
          currentTable={currentTable}
          changeFrequency={changeFrequency}
          checkboxesStatus={checkboxesStatus}
          updateCheckboxes={(x) => {
            setCheckboxesStatus(x);
            console.log(x);
          }}
          hitCheckbox={hitCheckbox}
          observationTime={observationTime}
          intervalLength={selectedLengthOfInterval}
        />
        {/* <Button
          labelButton="title"
          onPress={() => console.log(tableRef)}></Button> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 0,
          }}>
          <Button
            style={{width: '40%'}}
            labelButton={getStr('BegaviourData.save')}
            isLoading={isSaving}
            onPress={() => {
              remainingTimerRef.current.setTime(timerRef.current.getTime());
              timerRef.current.stop();
              saveRecord();
            }}
          />
          <Button
            style={{width: '40%'}}
            labelButton={getStr('BegaviourData.reset')}
            onPress={() => {
              timerRef.current.setTime(observationTime * 60 * 1000);
              remainingTimerRef.current.setTime(observationTime * 60 * 1000);
              setResetFlag(!resetFlag);
              setFrequency(0);
              setContinuousArray([]);
              setCurrentTable(1);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    margin: 5,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    marginVertical: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: Color.gray,
  },
  actionText: {
    color: 'white',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  actionitems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
  },
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {textAlign: 'center'},
  scrollView: {
    marginHorizontal: 0,
  },
  titleText: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: Color.white,
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

export default connect(mapStateToProps, mapDispatchToProps)(BehaviorPIScreen);
