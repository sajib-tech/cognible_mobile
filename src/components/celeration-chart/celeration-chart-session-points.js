import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CelerationChartSessionPoints = (props) => {
  return (
    <View>
      <View>
        <Text>Correct: {props.point.correct}</Text>
      </View>
      <View>
        <Text>Incorrect: {props.point.error}</Text>
      </View>

      <View>
        <Text>Prompt: {props.point.prompt}</Text>
      </View>

      <View>
        <Text>Date: {props.point.date}</Text>
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
export default CelerationChartSessionPoints;
