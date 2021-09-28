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

const BehaviorDRScreen = (props) => {
  const [tempId, setTempId] = useState(props.route.params.tempId);
  const [startTime, setStartTime] = useState(moment().format('HH:mm:ss'));
  const [endTime, setEndTime] = useState(moment().format('HH:mm:ss'));
  const [environment, setEnvironment] = useState(null);
  const [isLoading, setIsLOading] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [showModalTimer, setShowModalTimer] = useState(false);
  const [showTimer, setShowTimer] = useState('00:00');
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPendingRes, setIsPendingRes] = useState(false);
  const swipableRef = [];
  const [timerRef, setTimerRef] = useState();
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [duration, setDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const textInput1 = useRef(null);
  const textInput2 = useRef(null);
  const [isStop,setIsStop]=useState(true)


  //let timerRef=0;

  console.log('props dr=>', props);

  useEffect(()=>{
    if(props.route.params.currentRecord){

      const data=props.route.params.currentRecord
      let sec = pad(data.duration % 60);
        let min = pad(parseInt(data.duration / 60));
        setShowTimer(min + ':' + sec);
        setTotalSeconds(data.duration);
      setDuration(data.duration)      
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
      setEndTime(moment().format('HH:mm:ss'));
      setIsStop(true)
    }
    // setShowTimer(true);
  };

  const openDuration = () => {
    setStartTime(moment().format('HH:mm:ss'));
    startTimer();
  };

  const startTimer = () => {
    let seconds = totalSeconds ? totalSeconds : 0;
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

  const saveRecord = () => {
    console.log('saving');
    if(props.route.params.currentRecord){

      setIsSaving(true);
    const variables = {
      date,
      startTime,
      endTime,
      environment,
      duration,
      tempId,
      id:props.route.params.currentRecord.id,

    };
    console.log('variables------->', variables);
    ParentRequest.updateDurationBehaviorRecord(variables)
      .then((res) => {
        console.log('response--->', res);
        setIsSaving(false);
        Alert.alert(
          getStr('BegaviourData.BehaviorDR'),
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

      setIsSaving(true);
    const variables = {
      date,
      startTime,
      endTime,
      environment,
      duration,
      tempId,
    };
    console.log('variables------->', variables);
    ParentRequest.addDurationBehaviorRecord(variables)
      .then((res) => {
        console.log('response--->', res);
        setIsSaving(false);
        Alert.alert(
          getStr('BegaviourData.BehaviorDR'),
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
  const resetRecord = () => {
    setDuration(0);
    setShowTimer('00:00');
  };
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <NavigationHeader
        title={getStr('BegaviourData.BehaviorDR')}
        backPress={() => props.navigation.goBack()}
      />
      <View style={{height: 10}}></View>
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
        ref={(ref) => {
          swipableRef['duration'] = ref; //or this.refsArray[item.id]
        }}
        renderLeftActions={leftDurationActions}
        onSwipeableLeftWillOpen={() => {
          openDuration();
        }}
        onSwipeableClose={() => stopTimer()}>
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

      <View style={{height: 20}} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 0,
        }}>
        <Button
          style={{width: '40%',backgroundColor:isStop?Color.primary:'grey'}}
          labelButton={getStr('BegaviourData.save')}
          isLoading={isSaving}
          disabled={!isStop}
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

export default connect(mapStateToProps, mapDispatchToProps)(BehaviorDRScreen);
