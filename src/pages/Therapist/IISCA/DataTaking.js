import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import TextInput from '../../../components/TextInput';
import DateInput from '../../../components/DateInput.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import {random, cloneDeep} from 'lodash';
import {
  client,
  CREATE_TANTRUM,
  CREATE_FLOPPING_TANTRUM,
  RECORD_TANTRUM_FREQUENCY,
} from '../../../constants/therapist';

import moment from 'moment';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tools from './Tools';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import Timer from 'react-compound-timer';
import RNPickerSelect from 'react-native-picker-select';

import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';
import * as Progress from 'react-native-progress';

import actions from '../../../redux/sagas/iisca/iisca.actions';
import LoadingIndicator from '../../../components/LoadingIndicator.js';

import Questions from './Questions';
import {getAssessmentDetails} from '../../../constants/parent';

const DataTaking = (props) => {
  const {studentId,currentPos,setTimer} = props;
  const testCases = ['EO', 'SR'];
  const [tCase, setTCase] = useState('EO');
  // const [prevTestCase, setPrevTestCase] = useState('');
  const [r1Value, setR1Value] = useState();
  const [r1Error, setR1Error] = useState('');
  const [r2Value, setR2Value] = useState();
  const [r2Error, setR2Error] = useState('');
  const [object, setObject] = useState(false);
  const [behaviorList, setBehaviorList] = useState([]);
  const [iconDisplay, setIconDisplay] = useState(true);
  const chunkSize = 5;
  const totalObservationInput = useRef();
  const arrayContinue = useRef([]);
  const selTestCase = useRef('EO');
  const pTestCase = useRef('');
  const swipableRef = [];
  const timerRef = useRef();
  const remainingTimerRef = useRef();
  const tableRef = useRef();
  const [isSaving, setIsSaving] = useState(false);
  const [isStart,setIsStart]=useState(true)
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
  const [observationTime, setObservationTime] = useState(30);
  const [editObservationTime, setEditObservationTime] = useState(false);
  const [textInputObservationTime, setTextInputObservationTime] = useState(0);
  const [checkboxesStatus, setCheckboxesStatus] = useState(
    Array(parseInt(observationTime / selectedLengthOfInterval, 10)).fill(false),
  );
  const [currTime, setCurrTime] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [resetFlag, setResetFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [recordedObject, setRecordedObject] = useState(null);
  const [r1, setR1] = useState(null);
  const [r2, setR2] = useState(null);
  const [reaction, setReaction] = useState([]);
  const [isTimer,setIsTimer]=useState(false)
  // [{percentage: 8.333333333333332, reaction: "R1", testCase: "SR"}
  // ,{percentage: 11.666666666666666, reaction: "R1", testCase: "SR"}
  // ,{percentage: 13.333333333333334, reaction: "R1", testCase: "SR"}]
  const [observedTime, setObservedTime] = useState(0);
  const [continuousArray, setContinuousArray] = useState([]);
  const [timeInterval, setTimeInterval] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [percent, setPercent] = useState(0);
  const [percentData, setPercentData] = useState([]);
  const [behaviorStarted, setBehaviorStarted] = useState(false);
  const [behaviorStartTime, setBehaviorStartTime] = useState(null);
  const [startInterval, setStartInterval] = useState(null);
  let t = 'EO';
  //let timerRef=0;

  useEffect(() => {
    setTCase('EO');
  }, []);
  useEffect(() => {
    getBehavior();
    arrayContinue.current.value = [];
    pTestCase.current.value = '';
    console.log('inEffect>>>>', arrayContinue.current.value);
  }, []);

  useEffect(()=>{
    return ()=>{
      console.log("unmount",selTestCase.current.value);
      // stopTimer()
    }
  })

  // useEffect(()=>{
  //   if(props.route.params.currentRecord){

  //     const data=props.route.params.currentRecord
  //     let sec = pad(data.duration % 60);
  //       let min = pad(parseInt(data.duration / 60));
  //       setShowTimer(min + ':' + sec);
  //       setTotalSeconds(data.duration);
  //     setDuration(data.duration)
  //     setDate(data.date)

  //   }

  // },[])

  const getBehavior = () => {
    const variables = {
      studentId,
    };
    TherapistRequest.getBehaviour(variables).then((res) => {
      console.log('Behavior>>>', res.data.getBehaviour.edges);
      if (res.data.getBehaviour.edges.length > 0) {
        const options = res.data.getBehaviour.edges.map(({node}) => {
          return {
            label: node.behaviorName,
            id: node.id,
          };
        });
        setBehaviorList(options);
      }
    });
  };

  // useEffect(()=>{
  //   if(r1Value){
  //     const r1=behaviorList.find(x=>x.id===r1Value)
  //     console.log("r1>>>",r1);
  //     setR1(r1)
  //   }
  //   if(r2Value){
  //     const r2=behaviorList.find(x=>x.id===r1Value)
  //     console.log("r2>>>",r2);
  //     setR2(r2)
  //   }

  // },[r1Value,r2Value])

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
              // afterTimerStarts();
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

  const stopTimer = () => {
    setTimer(false)
    remainingTimerRef.current.setTime(timerRef.current.getTime());
    console.log(
      'remaining>>>',
      parseInt(timerRef.current.getTime() / 1000, 10),
    );
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
    return x;
  };
  const openDuration = () => {
    setStartTime(moment().format('HH:mm:ss'));
    startTimer();
  };
  
  useEffect(() => {
    // afterTimerStarts()
    if (tCase) {
      selTestCase.current.value = tCase;
      console.log('selTestCase>>>', selTestCase.current.value);
      // pTestCase.current.value=tCase
    }
  }, [tCase]);

  const afterTimerStarts = () => {
    let x = false;
    let startTime = null;
    let endTime = null;
    setTimer(true)
    setTimeInterval(
      setInterval(() => {
        // setPercent(
        //   parseInt((observationTime * 60 * 1000 - timerRef.current.getTime()) / 1000, 10)
        // );

        const test = selTestCase.current.value !== undefined ? selTestCase.current.value :tCase;
        console.log('tcasein after>>>.', test, '***', pTestCase.current.value);

        const currentTime =
          timerRef && timerRef.current
            ? parseInt(
                (observationTime * 60 * 1000 - timerRef?.current?.getTime()) /
                  1000,
                10,
              )
            : currTime;
        const currInterval = parseInt(
          (currentTime - 1) / (selectedLengthOfInterval * 60),
          10,
        );
        const percentage =
          (currentTime / (selectedLengthOfInterval * 60)) * 100 -
          100 * currInterval;
        let newContinousArray = [...arrayContinue.current.value];
        console.log(
          'currTime',
          newContinousArray,
          arrayContinue.current.value,
          percentage,
        );
        const prevTestCase =
          pTestCase.current.value !== undefined
            ? pTestCase.current.value
            : test;
        if (currInterval >= 0) {
          if (!prevTestCase || prevTestCase === test) {
            if (typeof newContinousArray[currInterval] === 'object') {
              const cAL = newContinousArray[currInterval].length;
              const cACurrentPos = cAL - 1;
              newContinousArray[currInterval][cACurrentPos] = {
                percentage,
                label: test,
              };
              console.log(
                '1',
                currInterval,
                cACurrentPos,
                newContinousArray[currInterval][cACurrentPos],
              );
            } else {
              console.log('2');

              newContinousArray[currInterval] = [{percentage, label: test}];
            }
          } else if (typeof newContinousArray[currInterval] === 'object') {
            console.log('3');

            newContinousArray[currInterval] = [
              ...newContinousArray[currInterval],
              {percentage, label: test},
            ];
          } else {
            console.log('4');

            newContinousArray[currInterval] = [{percentage, label: test}];
          }
        } else newContinousArray = [];

        // setPrevTestCase(test);
        pTestCase.current.value = test;
        setCurrTime(currentTime);
        setCurrentInterval(currInterval);
        // setContinuousArray(newContinousArray)
        arrayContinue.current.value = cloneDeep(newContinousArray);
        setPercent(percentage);

        console.log(
          'newArray>>>',
          newContinousArray,
          cloneDeep(newContinousArray),
          pTestCase.current.value,
        );
      }, 500),
    );
  };

  const afterTimerStops = () => {
    clearInterval(timeInterval);
    // clearInterval()
  };

  const startTimer = () => {
    // timerRef.current.setTime(remainingTimerRef.current.getTime());
    timerRef.current.start();
    afterTimerStarts();

    // remainingTimerRef.start();
  };

  const pad = (val) => {
    let valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
  };

  // console.log(
  //   'percentage>>>',
  //   percent,
  //   observationTime,t,
  //   timerRef?.current?.getTime(),
  // );

  const startAssessment = () => {
    client
      .mutate({
        mutation: CREATE_FLOPPING_TANTRUM,
        variables: {
          studentId: studentId,
          totalObsTime: observationTime,
          lengthOfInterval: selectedLengthOfInterval,
          numberOfIntervals: parseInt(
            observationTime / selectedLengthOfInterval,
            10,
          ),
        },
        fetchPolicy: 'no-cache',
      })
      .then((result) => {
        setObject(true);
        setRecordedObject(result.data.createFlappingTantrum.details);
        setIsStart(false)
        // this.timerRef.current.start()
      })
      .catch((error) => console.log(error));
  };

  const recordTantrumFrequency = (tantrumId) => {
    client
      .mutate({
        mutation: RECORD_TANTRUM_FREQUENCY,
        variables: {
          tantrumId,
          time: observationTime * 60000 - timerRef.current.getTime(),
          type: tCase.toLowerCase(),
          interval: currentInterval,
        },
        fetchPolicy: 'no-cache',
      })
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => console.log(error));
  };

  const handleBehavior = () => {
    console.log('handle', r1Value, r2Value);
    if (!r1Value) {
      setR1Error('Behavior is Required!!');
      return;
    }
    if (!r2Value) {
      setR2Error('Behavior is Required!!');
      return;
    } else {
      setIconDisplay(false);
      if (recordedObject.tantrum && recordedObject.tantrum.length > 0) {
        let r1TantrumId = '';
        let r2TantrumId = '';
        recordedObject.tantrum.map(
          (item) => item.name === 'R1' && (r1TantrumId = item.id),
        );
        recordedObject.tantrum.map(
          (item) => item.name === 'R2' && (r2TantrumId = item.id),
        );

        // write update tantrum query
      } else {
        // write create tantrum query

        // create R1
        client
          .mutate({
            mutation: CREATE_TANTRUM,
            variables: {
              behaviorId: r1Value,
              name: 'R1',
              objectId: recordedObject.id,
            },
            fetchPolicy: 'no-cache',
          })
          .then((result) => {
            setRecordedObject({
              ...recordedObject,
              tantrum: [
                ...recordedObject.tantrum,
                result.data.createTantrum.details,
              ],
            });
            setR1(result.data.createTantrum.details);
          })
          .catch((errors) => console.log(errors));

        // create R2
        client
          .mutate({
            mutation: CREATE_TANTRUM,
            variables: {
              behaviorId: r2Value,
              name: 'R2',
              objectId: recordedObject.id,
            },
            fetchPolicy: 'no-cache',
          })
          .then((result) => {
            setRecordedObject({
              ...recordedObject,
              tantrum: [
                ...recordedObject.tantrum,
                result.data.createTantrum.details,
              ],
            });
            setR2(result.data.createTantrum.details);
          })
          .catch((errors) => console.log(errors));
      }
      // this.setState({
      //   isStop: true,
      // })
      // this.timerRef.current.start()
    }
  };

  const saveRecord = () => {
    console.log('saving');

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
    // ParentRequest.addDurationBehaviorRecord(variables)
    //   .then((res) => {
    //     console.log('response--->', res);
    //     setIsSaving(false);
    //     Alert.alert(
    //       getStr('BegaviourData.BehaviorDR'),
    //       'Successfully Saved',
    //       [
    //         {
    //           text: 'OK',
    //           onPress: () => {
    //             console.log('OK Pressed');
    //             if (props.disableNavigation) {
    //             } else {
    //               props.navigation.goBack();
    //             }
    //           },
    //         },
    //       ],
    //       {cancelable: false},
    //     );
    //   })
    //   .catch((error) => {
    //     setIsSaving(false);
    //     Alert.alert('Information', error.toString());
    //   });

    setIsSaving(false);
  };
  const resetRecord = () => {
    setDuration(0);
    setShowTimer('00:00');
  };

  const data =
    arrayContinue.current.value !== undefined
      ? arrayContinue.current.value
      : [];
  console.log('data>>>', data);
  const newContinousArray = [...data];
  const continuousArrayLength = data.length;
  const currentPosition = continuousArrayLength - 1;
  const lastEntryContinuousArray = newContinousArray.pop();
  // [{percentage: 16.666666666666664, label: "EO"}
  // , {percentage: 40, label: "SR"}
  // , {percentage: 55.00000000000001, label: "EO"}
  // , {percentage: 63.33333333333333, label: "SR"}
  // , {percentage: 75, label: "EO"}]
  console.log(
    'last continues array>>>',
    lastEntryContinuousArray,
    
    newContinousArray
  );
  let R1EO = 0;
  let R1SR = 0;
  let R2EO = 0;
  let R2SR = 0;

  let EOPercentage = 0;
  let SRPercentage = 0;

  console.log('reaction=======>', reaction);

  if (reaction && reaction.length > 0)
    reaction.map((d) => {
      if (d.length > 0)
        d.map((r) => {
          const currConcat = r.reaction + r.tCase;
          if (currConcat === 'R1EO') R1EO += 1;
          else if (currConcat === 'R2EO') R2EO += 1;
          else if (currConcat === 'R2SR') R2SR += 1;
          else if (currConcat === 'R1SR') R1SR += 1;
          return true;
        });
      return true;
    });

  if (data && data.length > 0)
    data.map((d) => {
      console.log(">>>>data>>>",d);
      if (d?.length > 0)
        d?.map((r, i) => {
          console.log("****>>>>r",r);
          const prev = i - 1;
          const prevPercentage = prev >= 0 ? d[prev].percentage : 0;
          const currPercentage = r.percentage - prevPercentage;
          if (r.label === 'EO') EOPercentage += currPercentage;
          else if (r.label === 'SR') SRPercentage += currPercentage;
          return true;
        });
      return true;
    });

  // console.log('lat entry', lastEntryContinuousArray)
  console.log(
    'R1SR, R1EO, R2EO, R2SR',
    R1SR,
    R1EO,
    R2EO,
    R2SR,
    EOPercentage,
    SRPercentage,
    observationTime,
  );
  console.log("seltesctCase>>>",selTestCase.current.value);

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView>
        {isStart &&<View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Button
            style={{
              width: '40%',
              backgroundColor: Color.greenFill,
              margin: 5,
              padding: 2,
              height: 40,
            }}
            labelButton={'Start Recording'}
            onPress={() => {
              startAssessment();
              setIconDisplay(false);
            }}
          />
        </View>}
        {!iconDisplay && (
          <>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                flex: 1,
              }}>
              <View
                style={{
                  ...styles.card,
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text style={styles.actionText}>R1</Text>
                <PickerModal
                  label={''}
                  error={r1Error}
                  placeholder={'Behavior'}
                  data={behaviorList}
                  onValueChange={(value, itemIndex) => {
                    setR1Value(value);
                    setR1Error('');
                  }}
                  style={{
                    width: '100%',
                    height: 35,
                    marginTop: 0,
                    backgroundColor: 'white',
                  }}
                />
              </View>
              <View
                style={{
                  ...styles.card,
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '100%',
                }}>
                <Text style={styles.actionText}>R2</Text>
                <PickerModal
                  style={{
                    width: '100%',
                    height: 35,
                    marginTop: 0,
                    backgroundColor: 'white',
                  }}
                  label={''}
                  error={r2Error}
                  placeholder={'Behavior'}
                  data={behaviorList}
                  onValueChange={(value, itemIndex) => {
                    console.log('behaviour Value>>', value);
                    setR2Value(value);
                    setR2Error('');
                  }}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Button
                style={{
                  width: '40%',
                  backgroundColor: Color.greenFill,
                  margin: 5,
                  padding: 2,
                  height: 40,
                }}
                labelButton={'Save Behaviours'}
                onPress={handleBehavior}
              />
            </View>
          </>
        )}

        <View
          style={{
            display: 'none',
          }}>
          <TextInput
            style={{color: Color.white, fontSize: 18}}
            placeholder="00"
            placeholderTextColor="#ccc"
            ref={selTestCase}
            // value={selTestCase.current.value}
            maxLength={2}
            onChangeText={(text) => {
              console.log('text----', text);
            }}
          />
          <TextInput
            style={{color: Color.white, fontSize: 18}}
            placeholder="00"
            placeholderTextColor="#ccc"
            ref={pTestCase}
            // value={selTestCase.current.value}
            maxLength={2}
            onChangeText={(text) => {
              console.log('text----', text);
            }}
          />
          <TextInput
            style={{color: Color.white, fontSize: 18}}
            placeholder="00"
            placeholderTextColor="#ccc"
            ref={arrayContinue}
            // value={selTestCase.current.value}
            maxLength={2}
            onChangeText={(text) => {
              console.log('text----', text);
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
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
              disabled={!iconDisplay}
              onValueChange={(value) => {
                console.log('changed>>');
                // setResetFlag(!resetFlag);
                setSelectedLengthOfInterval(parseInt(value));
              }}
              items={generateLengthOfIntervals(observationTime)}
            />
            {/* <PickerModal 
            label={'Length of Interval'}             
              style={{height:25,width:'100%',marginTop:2}}
              selectedValue={selectedLengthOfInterval}
              value={selectedLengthOfInterval}
              disable={!iconDisplay}
              onValueChange={(value) => {
                console.log('changed>>');
                // setResetFlag(!resetFlag);
                setSelectedLengthOfInterval(parseInt(value));
              }}
              data={generateLengthOfIntervals(observationTime)}
            /> */}
          </View>

          <View
            style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{marginLeft: 3, marginTop: 0}}>Intervals</Text>
            <Text style={{marginLeft: 3, marginTop: 3}}>
              {parseInt(observationTime / selectedLengthOfInterval, 10)}
            </Text>
          </View>
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
            !iconDisplay && startTimer();
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
                    // afterTimerStarts()
                  }}
                  onResume={() => console.log('onResume hook')}
                  onPause={() => console.log('onPause hook')}
                  onStop={() => {
                    // stopTimer()
                    // this.setState({
                    //   duration: this.timerRef.current.getTime(),
                    //   behaving: false,
                    //   timerRunning: false,
                    // });
                    // this.handleChange(this.timerRef.current.getTime());
                    // const dur=timerRef && timerRef.current ? timerRef.current.getTime():0
                    // setDuration(dur)
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
            {!editObservationTime && iconDisplay && (
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
            flexDirection: 'row',
            margin: 5,
            justifyContent: 'center',
          }}>
          {testCases.map((b) => {
            const disabled = tCase === b;
            const primaryColor = b === 'EO' ? Color.red : Color.greenFill;
            return (
              <Button
                key={b}
                labelButton={b}
                disabled={disabled}
                style={{
                  backgroundColor: disabled ? 'grey' : primaryColor,
                  color: 'white',
                  width: '20%',
                  margin: 5,
                  padding: 2,
                  height: 40,
                }}
                onPress={() => {
                  setTCase(b);
                  // afterTimerStarts()
                  t = b;
                  console.log('t>>>>', t);
                }}
              />
            );
          })}
        </View>
        {!iconDisplay && r1 && r2 && (
          <>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                margin: 3,
              }}>
              <Button
                style={{
                  width: '50%',
                  backgroundColor: Color.bluejay,
                  margin: 3,
                  padding: 2,
                  height: 40,
                }}
                labelButton={`R1 : ${r1 && r1.behavior.behaviorName}`}
                onPress={() => {
                  const newReaction = cloneDeep(reaction);
                  newReaction[currentPosition] = reaction[currentPosition]
                    ? [
                        ...reaction[currentPosition],
                        {
                          percentage: percent,
                          reaction: 'R1',
                          tCase,
                        },
                      ]
                    : [
                        {
                          percentage: percent,
                          reaction: 'R1',
                          tCase,
                        },
                      ];
                  console.log('r1>>>', percent, reaction, ...newReaction);

                  setReaction(newReaction);
                  recordTantrumFrequency(r1.id);
                }}
              />
              <Button
                style={{
                  width: '50%',
                  backgroundColor: Color.bluejay,
                  margin: 3,
                  padding: 2,
                  height: 40,
                }}
                labelButton={`R2 : ${r2 && r2.behavior.behaviorName}`}
                onPress={() => {
                  const newReaction = cloneDeep(reaction);
                  newReaction[currentPosition] = reaction[currentPosition]
                    ? [
                        ...reaction[currentPosition],
                        {
                          percentage: percent,
                          reaction: 'R2',
                          tCase,
                        },
                      ]
                    : [
                        {
                          percentage: percent,
                          reaction: 'R2',
                          tCase,
                        },
                      ];
                  setReaction(newReaction);
                  recordTantrumFrequency(r2.id);
                }}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                margin: 2,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 15,
                }}>
                Interval Number {currentInterval + 1}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                flexDirection: 'row',
                borderWidth: 1,
                borderRadius: 0,
                height: 10,
                borderColor: Color.bluejay,
              }}>
              {lastEntryContinuousArray &&
                lastEntryContinuousArray.map((d, i) => {
                  const previousPos = i - 1;
                  console.log(
                    'd>>>',
                    d,
                    currentPosition,
                    reaction[currentPosition],
                  );
                  const currentPosReactions = reaction[currentPosition];
                  const newPercentage =
                    previousPos >= 0
                      ? d.percentage -
                        lastEntryContinuousArray[previousPos].percentage
                      : d.percentage;
                  console.log(
                    'newPercentage>>',
                    newPercentage,
                    currentPosReactions,
                  );
                  return (
                    <>
                      <View
                        key={String(i)}
                        style={{
                          flexDirection: 'row',
                          height: 8,
                          backgroundColor:
                            d.label === 'EO' ? Color.red : Color.greenFill,
                          width: `${newPercentage}%`,
                        }}></View>
                      {currentPosReactions &&
                        currentPosReactions.map((r, ind) => {
                          console.log('r>>>', r);
                          const sI = String(ind) + r.percentage;
                          return (
                            <Text
                              key={sI}
                              style={{
                                position: 'absolute',
                                fontSize: 12,
                                fontWeight: 'bold',
                                top: -12,
                                left: `${r.percentage}%`,
                              }}>
                              *
                            </Text>
                          );
                        })}
                    </>
                  );
                })}
            </View>
            <View>
              <View
                style={{
                  ...styles.card,
                  marginTop:5,
                  margin:0,
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <View style={{width: '100%', flexDirection: 'row',marginTop:5,marginBottom:0,borderWidth:1,borderColor:'white'}}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.actionText}>{''}</Text>
                  </View>
                  <View style={{width: '25%', alignItems: 'center',borderLeftWidth: 1,
                      borderColor: 'white',}}>
                    <Text style={styles.actionText}>R1</Text>
                  </View>
                  <View style={{width: '25%', alignItems: 'center',borderLeftWidth: 1,
                      borderColor: 'white',}}>
                    <Text style={styles.actionText}>R2</Text>
                  </View>
                </View>
                <View style={{width: '100%', flexDirection: 'row',borderWidth:1,borderColor:'white'}}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.actionText}>{''}</Text>
                  </View>
                  <View
                    style={{
                      width: '25%',
                      alignItems: 'center',
                      borderLeftWidth: 1,
                      borderColor: 'white',
                    }}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        margin: 0,
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={styles.actionText}>EO</Text>
                      </View>
                      <View>
                        <Text style={styles.actionText}>SR</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: '25%',
                      alignItems: 'center',
                      borderLeftWidth: 1,
                      borderColor: 'white'}}>
                  <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        margin: 0,
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={styles.actionText}>EO</Text>
                      </View>
                      <View>
                        <Text style={styles.actionText}>SR</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', flexDirection: 'row',borderWidth:1,borderColor:'white'}}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.actionText}>Frequency</Text>
                  </View>
                  <View style={{width: '25%', alignItems: 'center',borderLeftWidth: 1,
                      borderColor: 'white',}}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        margin: 0,
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={styles.actionText}>{R1EO}</Text>
                      </View>
                      <View>
                        <Text style={styles.actionText}>{R1SR}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: '25%', alignItems: 'center',borderLeftWidth: 1,
                      borderColor: 'white',}}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        margin: 0,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{alignItems:'center'}}>
                        <Text style={styles.actionText}>{R2EO}</Text>
                      </View>
                      <View>
                        <Text style={styles.actionText}>{R2SR}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', flexDirection: 'row',marginBottom:5,borderWidth:1,borderColor:'white'}}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.actionText}>Cond Duration(sec)</Text>
                  </View>
                  <View style={{width: '25%', alignItems: 'center',borderLeftWidth: 1,
                      borderColor: 'white',}}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        margin: 0,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{alignItems:'center'}}>
                        <Text style={styles.actionText}>{parseInt((EOPercentage / 100) * 60, 10)}</Text>
                      </View>
                      <View>
                        <Text style={styles.actionText}>{parseInt((SRPercentage / 100) * 60, 10)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: '25%', alignItems: 'center',borderLeftWidth: 1,
                      borderColor: 'white',}}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        margin: 0,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{alignItems:'center'}}>
                        <Text style={styles.actionText}>{parseInt((EOPercentage / 100) * 60, 10)}</Text>
                      </View>
                      <View>
                        <Text style={styles.actionText}>{parseInt((SRPercentage / 100) * 60, 10)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
        {/* <View style={{height: 20}} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 0,
          }}>
          <Button
            style={{width: '40%'}}
            labelButton={'Save'}
            isLoading={isSaving}
            onPress={() => saveRecord()}
          />
          <Button
            style={{width: '40%'}}
            labelButton={'Reset'}
            onPress={() => {
              resetRecord();
            }}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    margin: 5,
    flex: 1,
    backgroundColor: Color.bluejay,
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
    marginVertical: 2,
    padding: 8,
    borderWidth: 1,
    borderColor: Color.gray,
  },
  actionText: {
    color: 'white',
    paddingHorizontal: 10,
    fontWeight: '600',
    margin: 3,
    marginBottom: 0,
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

export default connect(mapStateToProps, mapDispatchToProps)(DataTaking);
