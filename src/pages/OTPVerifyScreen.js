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
  Text,TextInput,TouchableOpacity,
  StatusBar, TouchableHighlight
} from 'react-native';
import {Image} from 'react-native-elements';
//import crImg from './ChainReaction1.png';

class OTPVerifyScreen extends Component {
	constructor(props) {
		super(props);
		this.state = { t1: '1', t2: '2', t3: '', t4: ''};
	}
	
	render() {
	  return (
		<>
			<View style={styles.body}>
				<Text style={styles.title} >Verification</Text>
				<Text style={styles.descr}>Enter OTP to verify phone number</Text>
				<View style={styles.row}>
					<TextInput style={[styles.input, styles.firstinput, '']} value={this.state.t1}/>
					<TextInput style={styles.input} value={this.state.t2}/>
					<TextInput style={styles.input} value={this.state.t3}/>
					<TextInput style={[styles.input, styles.lastinput]} value={this.state.t4}/>
				</View>
				<View style={styles.timerRow}>
					<Text style={styles.timer}>00:59</Text>
					<Text style={styles.resend}>Send Again</Text>
				</View>
				<View style={styles.continueView}>
					<TouchableOpacity	style={styles.continueViewTouchable} activeOpacity={ .5 } onPress={ this.ButtonClickCheckFunction }>
						<Text style={styles.continueViewText}> Continue </Text>  
					</TouchableOpacity>
				</View>
				<View style={styles.otpByCall}>
					<Text style={{textAlign:'center', color: '#3E7BFA'}}>Request OTP by Call</Text>
				</View>
			</View>
		</>
	  );
	}
};

const styles = StyleSheet.create({
  body: {
	flex: 1,
    backgroundColor: '#fff',
  },
  title: {
	fontSize: 25,
	fontWeight: "600",
	marginTop: 50,
	marginBottom: 20,
	color: '#10253C',
	width: '100%',
	textAlign: 'center',
  },
  descr: {
	  marginBottom: 20,
	  textAlign: 'center',
	  width: '100%'
  },
  row: {
	  flexDirection: 'row',
	  justifyContent: 'center',
  },
  input: {
	  width: 65,
	  height: 65,
	  padding: 19,
	  margin: 19,
	  marginLeft: 0,
	  textAlign: 'center',
	  fontStyle: 'normal',
	  fontWeight: 'normal',
	  fontSize: 25,
	  borderWidth: 0.5,
	  borderRadius: 6,
	  flexDirection: 'column',
	  backgroundColor: '#F3F5F9',
	  color: '#3E7BFA'
  },
  filledinput: {
	backgroundColor: '#3E7BFA',
	opacity: 0.1
  },
  firstinput: {
	  marginLeft: 0
  },
  lastinput: {
	  marginRight: 0
  },
  timerRow: {
	  flexDirection: 'row',
	  paddingLeft: 45,
	  paddingRight: 45,
	  width: '100%'
  },
  timer: {
	  width: '50%',
    textAlign: 'left'
  },
  resend: {
	width: '50%',
    textAlign: 'right',
	color: '#3E7BFA'
  },
  
  continueViewTouchable:{
    marginTop:40,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:40,
    marginRight:40,
    backgroundColor:'#1E90FF',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  continueView:{  
    width:'100%',
  },
  continueViewText:{
     color:'#fff',
     fontSize: 20,
     textAlign:'center',
  },
  otpByCall: {
	  paddingTop: 25
  }
});

export default OTPVerifyScreen;
