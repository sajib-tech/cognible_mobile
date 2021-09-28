/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, TouchableHighlight
} from 'react-native';
import {Image} from 'react-native-elements';
//import crImg from './ChainReaction1.png';

class SplashScreen extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
	  return (
		<>
			<View style={styles.body}>
				{/* <Image source={require('../../android/img/Cogniable.png')} style={styles.logo} />
				<Text style={styles.logoText}>Developing Skills the data way</Text> */}
			</View>
		</>
	  );
	}
};

const styles = StyleSheet.create({
  body: {
	  flex: 1,
	  justifyContent: 'center',
	  padding: 45
  },
  logo: {
	  margin: 45,
	  
	},
	logoText: {
		color: '#FF4673',
		fontStyle: 'normal',
		fontWeight: '600',
		fontSize: 18
	}
});

export default SplashScreen;
