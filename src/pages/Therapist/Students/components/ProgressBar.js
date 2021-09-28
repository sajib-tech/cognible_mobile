import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

// colors
const clr1 = [
  '#7C63D9',
  '#439AE0',
  '#BF4E99',
  '#F9A437',
  '#4CBB9A',
  '#90ED7D',
  '#B3B2B2',
  '#7CB5EC',
  '#439AE0',
  '#E2C033',
  '#91C7BA',
  '#91C7BA',
  '#4CBB9A',
  '#439AE0',
];

const ProgressBar = ({targetData}) => {
  const [renderData, setRenderData] = useState(null);

  useEffect(() => {
    if (targetData && targetData.length > 0) {
      const temp = [];
      let total = 0;
      targetData.forEach((item) => {
        total += Number(item.value);
      });

      console.log(total);

      targetData.forEach((item, index) => {
        temp.push({
          key: Math.random(),
          width: Number((Number(item.value) / total) * 95).toFixed(2),
          text: item.text,
          value: item.value,
          color: clr1[index],
        });
      });

      setRenderData(temp);
    }
  }, [targetData]);

  return (
    <View>
      <View style={{marginTop: 7}}>
        <View style={{flexDirection: 'row'}}>

        {renderData &&
          renderData.map((item) => {
            return (
              <View
              style={{
                width: `${item.width}%`,
                marginRight: 2,
                height: 6,
                backgroundColor: item.color,
              }}
              />
              );
            })}
            </View>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {renderData &&
          renderData.map((item) => {
            return (
              <View
                style={{
                  marginTop: 7,
                  borderLeftWidth: 5,
                  borderLeftColor: item.color,
                  paddingLeft: 5,
                  marginLeft: 5,
                  padding: 0,
                  marginRight: 16
                }}>
                <Text>
                  {item.value} {item.text}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
