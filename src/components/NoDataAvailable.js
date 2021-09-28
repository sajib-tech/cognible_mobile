/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';

const NoDataAvailable = () => (
  <View
    style={{
      padding: 10,
      height: 200,
      backgroundColor: '#fcfcfc',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>No data Available</Text>
  </View>
);

export default NoDataAvailable;
