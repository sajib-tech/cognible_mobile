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
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../utility/Color';
import LoadingIndicator from './LoadingIndicator';
import AddEnvironmentContainer from './AddEnvironmenContainer';

const BehaviorFRScreen = (props) => {
  console.log("props>>>>",props.route);
  const [tempId, setTempId] = useState(props.route.params.tempId);
  const [startTime, setStartTime] = useState(moment().format('HH:mm:ss'));
  const [endTime, setEndTime] = useState(moment().format('HH:mm:ss'));
  const [isLoading, setIsLOading] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [showModalTimer, setShowModalTimer] = useState(false);
  const [showTimer, setShowTimer] = useState('00:00');
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [environment, setEnvironment] = useState(null);
  const [isPendingRes, setIsPendingRes] = useState(false);
  const swipableRef = [];
  const [timerRef, setTimerRef] = useState();
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [duration, setDuration] = useState(0);
  const [calculatedRate, setCalculatedRate] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [isStop,setIsStop]=useState(true)
  const textInput1 = useRef(null);
  const textInput2 = useRef(null);
  const textInput3 = useRef(null);
  const textInput4 = useRef(null);
  const data = [
    {id: 'SC', label: 'Seconds'},
    {id: 'MN', label: 'Minutes'},
    {id: 'HR', label: 'Hours'},
    {id: 'DY', label: 'Days'},
  ];

  const [unit, setUnit] = useState('SC');
  //let timerRef=0;

  // console.log("props fr=>",props);

  useEffect(()=>{
    if(props.route.params.currentRecord){
      console.log("<<<currentRecord",props.route.params.currentRecord);
      const data=props.route.params.currentRecord
      let sec = pad(data.duration % 60);
        let min = pad(parseInt(data.duration / 60));
        setShowTimer(min + ':' + sec);
        setTotalSeconds(data.duration);
      setDuration(data.duration)
      setFrequency(data.frequency)
      setCalculatedRate(data.rate.toFixed(2))
      setUnit(data.rateUnit)
      setDate(data.date)

    }

  },[])

  const leftDurationActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={{
          ...styles.actionitems,
          backgroundColor: Color.azureblue,
          elevation: 5,
        }}>
        <Animated.Text
          style={{
            ...styles.actionText,
            fontSize: 18,
            transform: [{scale}],
          }}>
          {showTimer}
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

  const stopTimer = () => {
    console.log('stopping-->', timerRef);
    if (timerRef) {
      clearInterval(timerRef);
      setDuration(totalSeconds);
      setRate(frequency, totalSeconds, unit);
      console.log('clear', totalSeconds);
      setIsStop(true)
      setEndTime(moment().format('HH:mm:ss'));
    }
    // setShowTimer(true);
  };

  const openDuration = () => {
    setStartTime(moment().format('HH:mm:ss'));
    startTimer();
  };

  const startTimer = () => {
    let seconds = totalSeconds ? totalSeconds : 0;
    console.log("totalsesonds>>>",totalSeconds,seconds);
    setIsStop(false)
    setTimerRef(
      setInterval(() => {
        ++seconds;
        let sec = pad(seconds % 60);
        let min = pad(parseInt(seconds / 60));
        setShowTimer(min + ':' + sec);
        setTotalSeconds(seconds);
      }, 1000),
    );
  };

  const pad = (val) => {
    let valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
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

  const setRate = (frequency, duration, rateUnit) => {
    console.log('*****', frequency, duration, rateUnit);
    if (duration > 0) {
      duration = parseInt(duration, 10)*1000;
      let calculatedRate = null;
      switch (rateUnit) {
        case 'SC':
          calculatedRate = (frequency * 1000) / duration;
          break;
        case 'MN':
          calculatedRate = (frequency * 100) / (duration * 6);
          break;
        case 'HR':
          calculatedRate = (frequency * 10) / (duration * 36);
          break;
        case 'DY':
          calculatedRate = (frequency * 10) / (duration * 36 * 24);
          break;
        default:
          break;
      }
      console.log('calculated rate--->', calculatedRate.toFixed(3));
      setCalculatedRate(calculatedRate.toFixed(3));
    }
  };

  const saveRecord = () => {
    console.log('saving');
    if (unit === null) {
      setErrMsg(getStr('BegaviourData.PleaseRateunit'));
    } else {
      if (frequency === 0) {
        Alert.alert('Information', 'Frequency is required');
      } else {
        
        if(props.route.params.currentRecord){
          const variables = {
            date,
            startTime,
            endTime,
            duration,
            frequency,
            environment,
            rate: calculatedRate,
            rateUnit: unit,
            studentTemplate: tempId,
            id:props.route.params.currentRecord.id,
          };
          console.log("<<<update variables",variables);
          setIsSaving(true);
        ParentRequest.updateFrequencyRateBehaviorRecord(variables)
          .then((res) => {
            console.log('response--->', res);
            setIsSaving(false);
            Alert.alert(
              getStr('BegaviourData.BehaviorFR'),
              'Behavior Record Successfully Saved',
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
            session:props.route.params.sessionId?props.route.params.sessionId:null,
            startTime,
            endTime,
            duration,
            frequency,
            environment,
            rate: calculatedRate,
            rateUnit: unit,
            studentTemplate: tempId,
          };
          setIsSaving(true);
        ParentRequest.addFrequencyRateBehaviorRecord(variables)
          .then((res) => {
            console.log('response--->', res);
            setIsSaving(false);
            Alert.alert(
              getStr('BegaviourData.BehaviorFR'),
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

              }
    }
  };
  const resetRecord = () => {
    setDuration(0);
    setFrequency(0);
    stopTimer()
    setTotalSeconds(0)
    // clearInterval(timerRef);
    setShowTimer('00:00');
    setCalculatedRate(0);
  };
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <NavigationHeader
        title={getStr('BegaviourData.BehaviorFR')}
        backPress={() => props.navigation.goBack()}
      />
      {/* {isLoading && <LoadingIndicator />} */}
      {!props.route.params.sessionId && <View style={{padding: 5, margin: 5}}>
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
      </View>}

      <Swipeable
        ref={(ref) => {
          swipableRef['duration'] = ref; //or this.refsArray[item.id]
        }}
        renderLeftActions={leftDurationActions}
        onSwipeableLeftOpen={() => {
          openDuration();
        }}
        onSwipeableClose={() => {stopTimer()}}>
        <View
          style={{
            ...styles.item,
            height: 90,
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

          {/* <TouchableOpacity
                onPress={() => this.setState({showModalTimer: true})}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}> */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 18, paddingHorizontal: 10, color: Color.white}}>
              Duration
            </Text>
            {showModalTimer ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: Color.white}}>Min </Text>
                <TextInput
                  style={{color: Color.white}}
                  placeholder="00"
                  ref={textInput1}
                  value={min}
                  keyboardType="number-pad"
                  maxLength={2}
                  onChangeText={(text) => {
                    console.log('text----', text);
                    if (text) {
                      setMin(text);
                      setShowTimer(text + ':' + sec);
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      textInput1.current.clear();
                      setMin('');
                    }
                  }}
                />
                <Text style={{color: Color.white}}> : </Text>
                <TextInput
                  style={{color: Color.white}}
                  placeholder="00"
                  ref={textInput2}
                  keyboardType="number-pad"
                  autoFocus
                  value={sec}
                  maxLength={2}
                  onChangeText={(text) => {
                    console.log('text sec----->', text);
                    if (text) {
                      setSec(text);
                      setShowTimer(min + ':' + text);
                      textInput1.current.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      textInput2.current.clear();
                      textInput1.current.focus();
                      setSec('');
                    }
                  }}
                />
                <Text style={{color: Color.white}}> Sec</Text>
              </View>
            ) : totalSeconds > 0 ? (
              <Text
                style={{
                  fontSize: 20,
                  paddingHorizontal: 10,
                  alignSelf: 'center',
                  color: Color.white,
                }}>
                {' '}
                {showTimer}
              </Text>
            ) : (
              totalSeconds <= 0 && (
                <Text
                  style={{
                    fontSize: 14,
                    paddingHorizontal: 10,
                    color: Color.white,
                  }}>
                  Slide to start timer
                </Text>
              )
            )}
            {totalSeconds > 0 && (
              <Text
                style={{
                  fontSize: 14,
                  paddingHorizontal: 10,
                  color: Color.white,
                }}>
                Slide to continue timer
              </Text>
            )}
          </View>
          {/* </TouchableOpacity> */}
          <View style={{margin: 10, width: 30}}></View>
          {showModalTimer ? (
            <TouchableOpacity
              onPress={() => {
                console.log('total secondes', min * 60 + sec);
                setTotalSeconds(Number(min) * 60 + Number(sec));
                setShowModalTimer(false);
                setDuration(Number(min)*60+Number(sec))
                setRate(frequency,Number(min)*60+Number(sec),unit)
              }}>
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={Color.white}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowModalTimer(true)}>
              <MaterialCommunityIcons
                name="circle-edit-outline"
                size={24}
                color={Color.white}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          )}
        </View>
      </Swipeable>
      <View style={{height: 10}} />

      <Swipeable
        ref={(ref) => {
          swipableRef['frequency'] = ref; //or this.refsArray[item.id]
        }}
        leftThreshold={10}
        rightThreshold={10}
        renderLeftActions={leftFrequencyActions}
        renderRightActions={rightFrequencyActions}
        onSwipeableLeftWillOpen={() => {
          // setFrequency(frequency + 1), () => {
          //   this.updateFrequency();
          //   this.setState({isPendingRes: true});
          // }));
          setFrequency(frequency + 1);
          setRate(frequency+1, duration, unit);
          //updateFrequency();
          //setIsPendingRes(true);
          swipableRef['frequency'].close();
        }}
        onSwipeableRightWillOpen={() => {
          // frequency > 0
          //   ? this.setState({frequency: frequency - 1}, () => {
          //       this.updateFrequency();
          //       this.setState({isPendingRes: true});
          //     })
          //   : null;
          if (frequency >= 0) {
            setFrequency(frequency - 1);
            setRate(frequency-1, duration, unit);

            console.log('inside', frequency);
            //updateFrequency()
            //setIsPendingRes(true) ;
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
      <View style={{height: 10}} />
      <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
        <View
          style={{
            ...styles.item,
            width: '40%',
            justifyContent: 'center',
            backgroundColor: '#151B54',
            elevation: 5,
            marginLeft: 5,
            height: 80,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 18, paddingHorizontal: 10, color: Color.white}}>
              Calcuted Rate
            </Text>
            <Text
              style={{fontSize: 20, paddingHorizontal: 10, color: Color.white}}>
              {calculatedRate}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '55%',
            marginLeft: 5,
            marginRight: 10,
          }}>
          <PickerModal
            style={{fontSize: 18}}
            label={getStr('BegaviourData.BehaviorUnit')}
            error={errMsg}
            selectedValue={unit}
            placeholder={getStr('BegaviourData.BehaviorUnit')}
            data={data}
            onValueChange={(unitValue, itemIndex) => {
              console.log('unit-->', frequency, duration, unitValue);
              setRate(frequency, duration, unitValue);
              setUnit(unitValue);
            }}
          />
        </View>
      </View>
      {/* <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
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
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Button
          style={{width: '40%',backgroundColor:isStop?Color.primary:'grey'}}
          isLoading={isSaving}
          disabled={!isStop}
          labelButton={getStr('BegaviourData.save')}
          onPress={() => saveRecord()}
        />
        <Button
          style={{width: '40%'}}
          labelButton={getStr('BegaviourData.reset')}
          onPress={() => {
            resetRecord();
          }}
        />
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(BehaviorFRScreen);
