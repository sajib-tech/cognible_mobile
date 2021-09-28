import React, {Component, useState} from 'react';

import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import PickerModal from './PickerModal';
import {getStr} from '../../locales/Locale';

import Color from '../utility/Color';

const BehaviourRecordDataCard = ({
  navigation,
  tempId,
  studentId,
  title,
  status,
  behaviorType,
  onEdit,
  onPress,
}) => {
  const [bType, setBehaviorType] = useState(
    JSON.parse(behaviorType.replace(/'/g, '"')),
  );
  const [rType, setRType] = useState();
  const [isRecordPress, setIsRecordPress] = useState(false);
  const [isEyePress, setIsEyePress] = useState(false);

  let recordingType = [];
  const getBehaviorType = (behaviorType) => {
    let x;
    switch (behaviorType) {
      case 'FR':
        x = 'Frequency & Rate Recording';
        break;
      case 'DR':
        x = 'Duration Recording';
        break;
      case 'LT':
        x = 'Latency Recording';
        break;
      case 'PI':
        x = 'Partial Interval Recording';
        break;
      case 'WI':
        x = 'Whole Interval Recording';
        break;
      case 'MT':
        x = 'Momentary Time sample Recording';
        break;
      default:
        x = '';
    }
    return x;
  };

  bType.map((item) => {
    recordingType.push({id: item, label: getBehaviorType(item)});
  });

  const [selectedValue, setSelectedValue] = useState();

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {title != '' && (
            <Text style={[styles.title, {flex: 1}]}>{title}</Text>
          )}

          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => {
              setIsRecordPress(!isRecordPress);
              setIsEyePress(false);

            }}>
            <MaterialCommunityIcons name="record" size={20} color={Color.red} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => {              
              setIsEyePress(!isEyePress);
              setIsRecordPress(false)
            }}>
            <MaterialCommunityIcons
              name="eye-outline"
              size={20}
              color={Color.blackOpacity}
            />
          </TouchableOpacity>
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
        </View>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <Text style={{color: '#63686E', fontSize: 13}}>Status: </Text>
          <Text
            style={{
              color: Color.black,
              fontSize: 13,
              paddingBottom: 8,
              fontWeight: 'bold',
            }}>
            {status}
          </Text>
        </View>

        {isRecordPress &&
          bType.map((item) => {
            return (
              <View style={styles.tag}>
                <TouchableOpacity
                  onPress={() => {
                    if (item === 'FR') {
                      navigation.navigate('BehaviorFRScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'DR') {
                      navigation.navigate('BehaviorDRScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'LT') {
                      navigation.navigate('BehaviorLRScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'PI') {
                      navigation.navigate('BehaviorPIScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'MT') {
                      navigation.navigate('BehaviorMTScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'WI') {
                      navigation.navigate('BehaviorWIScreen', {
                        studentId,
                        tempId,
                      });
                    }
                  }}>
                  <Text>{getBehaviorType(item)}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

        {isEyePress &&
          bType.map((item) => {
            return (
              <View style={styles.tag}>
                <TouchableOpacity
                  onPress={() => {
                    if (item === 'FR') {
                      navigation.navigate('BehaviorFRRecords', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'DR') {
                      navigation.navigate('BehaviorDRScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'LT') {
                      navigation.navigate('BehaviorLRScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'PI') {
                      navigation.navigate('BehaviorPIScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'MT') {
                      navigation.navigate('BehaviorMTScreen', {
                        studentId,
                        tempId,
                      });
                    } else if (item === 'WI') {
                      navigation.navigate('BehaviorWIScreen', {
                        studentId,
                        tempId,
                      });
                    }
                  }}>
                  <Text>{getBehaviorType(item)}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="clock" size={19} />
            <Text style={{fontSize: 15, marginLeft: 5}}>
              {this.state.duration ? this.state.duration : '00:00'}
            </Text>
          </View> */}
      {/* <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              width: '50%',
              textAlign: 'left',
              color: '#63686E',
              fontWeight: '500',
            }}>
            {this.state.time != ''
              ? moment(this.state.time).format('MMM DD, YYYY')
              : ''}
          </Text>
        </View> */}
    </TouchableOpacity>
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
    paddingBottom: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 14,
    fontWeight: 'normal',
  },
  tag: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Color.gray,
    fontSize: 13,
    paddingHorizontal: 10,
    margin: 2,
    paddingVertical: 3,
  },
  intensity: {
    color: '#63686E',
    fontSize: 13,
    fontWeight: 'bold',
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
});
export default BehaviourRecordDataCard;
