import React from 'react';
import {View, Text} from 'react-native';

const CelerationChart = props => {
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '50%',
        }}>
        <View>
          <View>
            <Text>Date: {props.chart.date}</Text>
          </View>

          <View>
            <Text>Title: {props.chart.title}</Text>
          </View>

          <View>
            <Text>Category: {props.chart.category.name}</Text>
          </View>
        </View>
        <View>
          <Text>Recording Parameters:</Text>
          <Text>{props.chart.pointsTypeLables.type1}</Text>
          <Text>{props.chart.pointsTypeLables.type2}</Text>
          <Text>{props.chart.pointsTypeLables.type3}</Text>
        </View>
      </View>
      <View>
        <Text>Notes: {props.chart.notes}</Text>
      </View>
    </View>
  );
};

export default CelerationChart;
