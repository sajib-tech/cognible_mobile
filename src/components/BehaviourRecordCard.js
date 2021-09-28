import React, {Component, createRef} from 'react';

import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DatetimePicker from 'react-native-modal-datetime-picker';

import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../redux/actions/index';
import store from '../redux/store';
import Button from './Button';
import {Row, Column} from './GridSystem';
import PickerModal from './PickerModal';
import Color from '../utility/Color';
import {getStr} from '../../locales/Locale';
import LoadingIndicator from './LoadingIndicator';
import ParentRequest from '../constants/ParentRequest';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SimpleModal from './SimpleModal';

class BehaviourRecordCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isPress: false,
      environment:
        props.environments.length > 0
          ? props.environments[0].node.id
          : 'RW52aXJvbm1lbnRUeXBlOjI=',
      primaryKey: '',
      intensity: 'severe',
      frequency: 0,
      irt: 0,
      showTimer: '00:00',
      totalSeconds: 0,
      searchText: '',
      showModalTimer: false,
      text1: 0,
      text2: 0,
      text3: 0,
      text4: 0,
      showdatepicker: false,
      isPendingRes: false,
      min: 0,
      sec: 0,
    };
    this.swipableRef = [];
    this.timerRef;
    this.textInput1 = createRef();
    this.textInput2 = createRef();
    this.textInput3 = createRef();
    this.textInput4 = createRef();
  }

  componentDidMount() {
    console.error(" props behaviour record card 71", this.props)
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
  }

  createDecelObect() {
    let vars = {
      templateId: this.props.id,
      session: this.props.childSessionId === undefined ? "" : this.props.childSessionId
    };

    console.log("variabls", vars)
    ParentRequest.createDecelRecord(vars)
      .then((res) => {
        console.log(
          'ParentRequest.createDecelRecord=90=0=0=-0=-0=-0=-0=-0=-0',
          JSON.stringify(res),
        );
        if (res.data.createDecel.details) {
          this.setState(
            {primaryKey: res.data.createDecel.details.id, isPress: true},
            () => {
              //this.startTimer();
            },
          );
        }
      })
      .catch((err) => {});
  }

  startTimer() {
    let seconds = this.state.totalSeconds ? this.state.totalSeconds : 0;
    this.timerRef = setInterval(() => {
      ++seconds;
      let sec = this.pad(seconds % 60);
      let min = this.pad(parseInt(seconds / 60));
      this.setState({
        showTimer: min + ':' + sec,
        totalSeconds: seconds,
      });
    }, 1000);
  }

  pad(val) {
    let valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
  }

  updateFrequency() {
    let {
      primaryKey,
      environment,
      intensity,
      totalSeconds,
      frequency,
    } = this.state;
    let queryParams = {
      pk: primaryKey,
      time: totalSeconds * 1000,
      count: frequency,
    };
    console.log(
      'query params before update frequency -->',
      JSON.stringify(queryParams),
    );

    ParentRequest.updateDecelFrequency(queryParams)
      .then((res) => {
        if (res.data.updateDecelFrequency.details) {
          console.log(
            'Details after -->',
            JSON.stringify(res.data.updateDecelFrequency.details),
          );
          let freqLength =
            res.data.updateDecelFrequency.details.frequency.edges.length;
          this.setState({frequency: freqLength});
          console.log(
            'Frequency length after saving -->' + JSON.stringify(freqLength),
          );
          this.setState({isPendingRes: false});
        }
      })
      .catch((err) => {
        Alert.alert(
          'Information',
          'Cannot update frequency.\n' + err.toString(),
        );
      });
  }

  handleSubmit() {
    let {
      primaryKey,
      environment,
      intensity,
      totalSeconds,
      frequency,
    } = this.state;
    let queryParams = {
      pk: primaryKey,
      environment: environment,
      // irt: irt,
      intensity: intensity,
      note: '',
      duration: totalSeconds * 1000, //showTimer,
      childSessionId: this.props.childSessionId
    };
    console.log(
      'query params while storing data  -->' + JSON.stringify(queryParams),
      queryParams,
    );
    ParentRequest.updateDecelRecord(queryParams)
      .then((data) => {
        Alert.alert(
          'Information',
          'Data Successfully Saved',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                if (!this.props.fromSession) {
                  this.props.navigation.goBack();
                }

                if (this.props.onSaved) {
                  this.props.onSaved();
                }
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {
       alert(err)
      });
    this.setState({isPress: false});
  }

  leftDurationActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={{
          ...styles.actionitems,
          backgroundColor: Color.darkOrange,
          elevation: 5,
        }}>
        <Animated.Text
          style={{
            ...styles.actionText,
            fontSize: 18,
            transform: [{scale}],
          }}>
          {this.state.showTimer}
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
  leftFrequencyActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.darkGreen}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
          }}></Animated.Text>
      </View>
    );
  };
  leftIrtActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.darkPurple}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
          }}></Animated.Text>
      </View>
    );
  };

  rightIrtActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.darkPurple}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            textAlign: 'right',
            transform: [{scale}],
          }}>
          {/* {this.state.irt > 0 ? this.state.irt - 1 : 0} */}
        </Animated.Text>
      </View>
    );
  };
  rightFrequencyActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
    });
    return (
      <View style={{...styles.actionitems, backgroundColor: Color.darkGreen}}>
        <Animated.Text
          style={{
            ...styles.actionText,
            transform: [{scale}],
            textAlign: 'right',
          }}>
          {this.state.frequency > 0 ? this.state.frequency - 1 : 0}
        </Animated.Text>
      </View>
    );
  };

  stopTimer() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
    this.setState({showModalTimer: false});
  }
  openDuration() {
    this.startTimer();
  }

  renderCustomTimerModal = () => {
    console.log('show timer modal', this.state.showModalTimer);
    return (
      <SimpleModal
        visible={this.state.showModalTimer}
        onRequestClose={() => console.log('close called')}>
        <View
          style={{
            height: 350,
            backgroundColor: 'white',
            marginBottom: 10,
            marginTop: 16,
          }}></View>
      </SimpleModal>
    );
  };

  showLoader = () => {
    if (this.state.isPendingRes) {
      return <LoadingIndicator />;
    } else {
      return null;
    }
  };
  render() {
    let {
      isLoading,
      isPress,
      showTimer,
      environment,
      intensity,
      frequency,
      irt,
    } = this.state;
    let {
      key,
      title,
      description,
      statusName,
      environments,
      measurments,
      id,
      data,
      studentId,
      fromSession,
      onSaved,
      onEdit,
      isActive,
    } = this.props;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (isPress) {
      let environmentPickerList = environments.map((el) => {
        return {
          id: el.node.id,
          label: el.node.name,
        };
      });

      return (
        <View style={{...styles.card}} key={key}>
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("TargetAllocate.Title")}</Text>
            </Column>
            <Column style={{alignItems: 'flex-end'}}>
              <Text style={styles.textLeft}>{title}</Text>
            </Column>
          </Row>
          <View style={{height: 10}} />
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("BegaviourData.Status")}</Text>
            </Column>
            <Column style={{alignItems: 'flex-end'}}>
              <Text style={styles.textLeft}>{statusName}</Text>
            </Column>
          </Row>
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("BegaviourData.Environments")}</Text>
            </Column>
            <Column>
              <PickerModal
                placeholder=""
                selectedValue={environment}
                data={environmentPickerList}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({environment: itemValue});
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("NewChanges.Intensity")}</Text>
            </Column>
            <Column>
              <PickerModal
                placeholder=""
                selectedValue={intensity}
                data={[
                  {id: 'severe', label: getStr("NewChanges.Severe")},
                  {id: 'moderate', label: getStr("NewChanges.Moderate")},
                  {id: 'mild function', label: getStr("NewChanges.MildFunction")},
                ]}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({intensity: itemValue});
                }}
              />
            </Column>
          </Row>
          <View style={{height: 10}} />

          <Swipeable
            ref={(ref) => {
              this.swipableRef['duration'] = ref; //or this.refsArray[item.id]
            }}
            renderLeftActions={this.leftDurationActions}
            onSwipeableLeftWillOpen={this.openDuration.bind(this)}
            onSwipeableClose={this.stopTimer.bind(this)}>
            <View
              style={{
                ...styles.item,
                justifyContent: 'center',
                backgroundColor: Color.lightOrange,
                elevation: 5,
              }}>
              <View style={{margin: 10}}>
                <MaterialCommunityIcons
                  name="chevron-double-right"
                  size={30}
                  color={Color.darkOrange}
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
                <Text style={{fontSize: 18, paddingHorizontal: 10}}>
                  {getStr("TargetAllocate.Duration")}
                </Text>
                {this.state.showModalTimer ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Min </Text>
                    <TextInput
                      placeholder="00"
                      ref={this.textInput1}
                      value={this.state.min}
                      keyboardType="number-pad"
                      maxLength={2}
                      onChangeText={(text) => {
                        if (text && text.length >= 2) {
                          this.setState({min: text}, () => {
                            this.setState({
                              showTimer: text + ':' + this.state.sec,
                            });
                          });
                        }
                      }}
                      onKeyPress={({nativeEvent}) => {
                        if(nativeEvent.key === "Backspace") {
                          this.textInput1.current.clear()
                          this.setState({min: ""})
                        }
                      }}
                    />
                    <Text> : </Text>
                    <TextInput
                      placeholder="00"
                      ref={this.textInput2}
                      keyboardType="number-pad"
                      autoFocus
                      value={this.state.sec}
                      maxLength={2}
                      onChangeText={(text) => {
                        if (text && text.length === 2) {
                          this.setState({sec: text}, () => {
                            this.textInput1.current.focus();
                          });
                        }
                      }}
                      onKeyPress={({nativeEvent}) => {
                        if(nativeEvent.key === "Backspace") {
                          this.textInput2.current.clear()
                          this.textInput1.current.focus()
                          this.setState({sec: ""})
                        }
                      }}
                    />
                    <Text> Sec</Text>
                  </View>
                ) : this.state.totalSeconds > 0 ? (
                  <Text
                    style={{
                      fontSize: 20,
                      paddingHorizontal: 10,
                      alignSelf: 'center',
                    }}>
                    {' '}
                    {this.state.showTimer}
                  </Text>
                ) : (
                  this.state.totalSeconds <= 0 && (
                    <Text style={{fontSize: 14, paddingHorizontal: 10}}>
                      {getStr("TargetAllocate.Slidetostarttimer")}
                    </Text>
                  )
                )}
                 {this.state.totalSeconds > 0 &&<Text style={{fontSize: 14, paddingHorizontal: 10}}>
                 {getStr("TargetAllocate.Slidetocontinuetimer")}
                    </Text>}
              </View>
              {/* </TouchableOpacity> */}
              <View style={{margin: 10, width: 30}}></View>
              {this.state.showModalTimer ? (
                <TouchableOpacity
                  onPress={() => {
                    console.log("total secondes",(this.state.min * 60) + this.state.sec)
                    this.setState({totalSeconds: (Number(this.state.min) * 60) + Number(this.state.sec)})
                    this.setState({showModalTimer: false})
                 }}>
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={Color.darkOrange}
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.setState({showModalTimer: true})}>
                  <MaterialCommunityIcons
                    name="circle-edit-outline"
                    size={24}
                    color={Color.darkOrange}
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Swipeable>
          {/* <TouchableOpacity
            onPress={() => this.setState({showModalTimer: true})}>
            <Text>M</Text>
          </TouchableOpacity> */}

          <View style={{height: 10}} />

          <Swipeable
            ref={(ref) => {
              this.swipableRef['frequency'] = ref; //or this.refsArray[item.id]
            }}
            leftThreshold={10}
            rightThreshold={10}
            renderLeftActions={this.leftFrequencyActions}
            renderRightActions={this.rightFrequencyActions}
            onSwipeableLeftWillOpen={() => {
              this.setState({frequency: frequency + 1}, () => {
                this.updateFrequency();
                this.setState({isPendingRes: true});
              });
              this.swipableRef['frequency'].close();
            }}
            onSwipeableRightWillOpen={() => {
              this.state.frequency > 0
                ? this.setState({frequency: frequency - 1}, () => {
                    this.updateFrequency();
                    this.setState({isPendingRes: true});
                  })
                : null;
              this.swipableRef['frequency'].close();
            }}>
            {this.state.isPendingRes ? (
              <View
                style={{
                  ...styles.item,
                  justifyContent: 'space-between',
                  backgroundColor: Color.lightGreen,
                  elevation: 5,
                }}>
                <LoadingIndicator color="white" />
              </View>
            ) : (
              <View
                style={{
                  ...styles.item,
                  justifyContent: 'space-between',
                  backgroundColor: Color.lightGreen,
                  elevation: 5,
                }}>
                <View style={{...styles.arrow, alignItems: 'center'}}>
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    size={30}
                    color={Color.darkGreen}
                  />
                  <Text style={{fontSize: 10}}>+1</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 18, paddingHorizontal: 10}}>
                    {getStr("TargetAllocate.Frequency")}
                  </Text>
                  <Text style={{fontSize: 20, paddingHorizontal: 10}}>
                    {this.state.frequency}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.arrow,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={{fontSize: 10}}>-1</Text>
                  <MaterialCommunityIcons
                    name="chevron-double-left"
                    size={30}
                    color={Color.darkGreen}
                  />
                </View>
              </View>
            )}
          </Swipeable>
          {/* <TouchableOpacity onPress={() => this.setState({showdatepicker: true})}>
                <Text>custom timer</Text>
          </TouchableOpacity> */}
          {/* <View style={{flexDirection: 'row'}}>

          <TextInput placeholder="0" ref={this.textInput1} onChangeText={(text) => {
            if(text && text.length === 1) {
              this.setState({text1: text}, () => {
                this.textInput2.current.focus()
              })
            }
          }} />
          <TextInput placeholder="0" ref={this.textInput2} onChangeText={(text) => {
            if(text && text.length === 1) {
              this.setState({text2: text}, () => {
                this.textInput3.current.focus()
              })
            }
          }} />
          <Text> : </Text>
          <TextInput placeholder="0" ref={this.textInput3} onChangeText={(text) => {
            if(text && text.length === 1) {
              this.setState({text3: text}, () => {
                this.textInput4.current.focus()
              })
            }
          }} />
          <TextInput placeholder="0" ref={this.textInput4} onChangeText={(text) => {
            if(text && text.length === 1) {
              this.setState({text4: text}, () => {
                this.setState({showTimer: this.state.text1 + this.state.text2 + ":"  + this.state.text3 + text }, () => {
                  this.textInput1.current.blur()
                  this.textInput2.current.blur()
                  this.textInput3.current.blur()
                  this.textInput4.current.blur()
                })
              })
            } else if(text && text.length === 0) {
              this.textInput3.current.focus()
            }
          }} />
          </View> */}

          <View style={{height: 10}} />

          {/* <Swipeable ref={ref => {
                        this.swipableRef['irt'] = ref; //or this.refsArray[item.id] 
                    }}
                        leftThreshold={10}
                        rightThreshold={10}
                        renderLeftActions={this.leftIrtActions}
                        renderRightActions={this.rightIrtActions}
                        onSwipeableLeftWillOpen={() => {
                            this.setState({ irt: irt + 1 });
                            this.swipableRef['irt'].close();
                        }}
                        onSwipeableRightWillOpen={() => {
                            (this.state.irt > 0 ? this.setState({ irt: irt - 1 }) : null);
                            this.swipableRef['irt'].close();
                        }}
                    >
                        <View style={{ ...styles.item, justifyContent: 'space-between', backgroundColor: Color.lightPurple, elevation: 5 }}>
                            <View style={{ ...styles.arrow, alignItems: 'center' }}>
                                <MaterialCommunityIcons name='chevron-double-right' size={30} color={Color.darkPurple} />
                                <Text style={{ fontSize: 10 }}>+1</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, paddingHorizontal: 10, alignSelf: 'center' }}>IRT</Text>
                                <Text style={{ fontSize: 20, paddingHorizontal: 10, alignSelf: 'center' }}>{this.state.irt}</Text>
                            </View>
                            <View style={{ ...styles.arrow, alignItems: 'center' }}>
                                <Text style={{ fontSize: 10 }}>-1</Text>
                                <MaterialCommunityIcons name='chevron-double-left' size={30} color={Color.darkPurple} />
                            </View>
                        </View>
                    </Swipeable> */}

          {/* <View style={{ height: 20 }} /> */}

          <Button
            labelButton={getStr("TargetAllocate.ClickToSubmit")}
            onPress={() => {
              this.handleSubmit();
            }}
          />
        </View>
      );
    }
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => {}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={[styles.title, {flex: 1}]}>{title}</Text>
            {isActive && (
              <TouchableOpacity
                onPress={() => {
                  onEdit();
                }}>
                <MaterialCommunityIcons
                  name="lead-pencil"
                  size={20}
                  color={Color.blackOpacity}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.description}>{description}</Text>

          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={{color: '#63686E', fontSize: 13, fontWeight: '500'}}>
              {statusName}
            </Text>
            <Text
              style={{
                top: -7,
                paddingLeft: 10,
                color: '#C4C4C4',
                fontSize: 18,
                fontWeight: '700',
              }}>
              .
            </Text>
            <Text style={styles.intensity}>
              {environments.length + ' ' + 'Environments'}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  color: '#63686E',
                  fontWeight: '500',
                  marginTop: 10,
                }}>
                <FontAwesome5 name={'clock'} style={{paddingRight: 5}} />
                {' ' + getStr('BegaviourData.BehaviorGraph')}
              </Text>
            </TouchableOpacity>
            <Text style={{color: isActive ? 'green' : 'red'}}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View style={{height: 10}} />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            {isActive && (
              <Button
                labelButton={getStr("TargetAllocate.Deactivate")}
                style={{flex: 1, margin: 5}}
                onPress={() => {
                  this.props.onDeactivate();
                }}
              />
            )}
            {!isActive && (
              <Button
                labelButton={getStr("TargetAllocate.Activate")}
                style={{flex: 1, margin: 5}}
                onPress={() => {
                  this.props.onActivate();
                }}
              />
            )}
            {isActive && (
              <Button
                labelButton={getStr("TargetAllocate.RecordBehaviour")}
                style={{flex: 1, margin: 5}}
                onPress={() => {
                  this.createDecelObect();
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        {/* {this.state.showModalTimer && this.renderCustomTimerModal()}
              <DatetimePicker 
                mode="time"
                isVisible={this.state.showdatepicker}
                date={new Date()}
              /> */}
      </>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    padding: 10,
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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.blackFont,
    marginRight: 17,
  },
  description: {
    paddingTop: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: 'normal',
  },
  intensity: {
    paddingLeft: 10,
    color: '#63686E',
    fontSize: 13,
    fontWeight: '500',
  },
  highIntensity: {
    color: '#FF8080',
  },
  mediumIntensity: {
    color: '#FF9C52',
  },
  lowIntensity: {
    color: '#4BAEA0',
  },
  enviroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  pickerStyleEnviroment: {
    width: 200,
    marginTop: -15,
  },
  textLeft: {
    fontSize: 16,
  },
  counter: {
    flexDirection: 'row',
    marginRight: 17,
  },
  counterText: {
    fontSize: 18,
    color: Color.primary,
    textAlign: 'center',
    marginTop: 10,
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
  actionitems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourRecordCard);
