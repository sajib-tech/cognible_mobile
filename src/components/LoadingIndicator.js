import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Color from '../utility/Color';

export default class LoadingIndicator extends Component {
  render() {
    let color = this.props.color ?? Color.primary;
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }
}
