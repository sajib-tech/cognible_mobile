import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { internalToExternal } from '../../utility/PointType';

const CelerationChartOtherPoints = props => {
  
  return (
    <View>
      <View>
        <Text>Day: {props.point.day}</Text>
      </View>
      <View>
        <Text>Count: {props.point.count}</Text>
      </View>

      <View>
        <Text>Type: {internalToExternal(props.point.dataType)}</Text>
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontWeight: 'bold',
  },
  innerText: {
    color: 'red',
  },
});
export default CelerationChartOtherPoints;
