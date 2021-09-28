import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CelerationChartBehaviourPoints = props => {
  return (
    <View>
      <View>
        <Text>Day: {props.point.day}</Text>
      </View>
      <View>
        <Text>Count: {props.point.frequency}</Text>
      </View>

      <View>
        <Text>Type: {props.point.behaviour}</Text>
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
export default CelerationChartBehaviourPoints;
