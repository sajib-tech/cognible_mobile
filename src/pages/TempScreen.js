/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text, Button,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

class TempScreen extends Component {
	constructor(props) {
		super(props);
		//console.log("props=", props);
    this.showOTPVerify = this.showOTPVerify.bind(this);
    this.showSelectLang = this.showSelectLang.bind(this);
    this.showSignin = this.showSignin.bind(this);
    this.showSignupMobile = this.showSignupMobile.bind(this);
    this.showSignupEmail = this.showSignupEmail.bind(this);
    this.showHome = this.showHome.bind(this);
	}
	
	render() {
		return (
			<>
			  <StatusBar barStyle="dark-content" />
			  <SafeAreaView>
				<ScrollView
				  contentInsetAdjustmentBehavior="automatic"
				  style={styles.scrollView}>
				  <Header />
				  {global.HermesInternal == null ? null : (
					<View style={styles.engine}>
					  <Text style={styles.footer}>Engine: Hermes</Text>
					</View>
				  )}
				  <View style={styles.body}>
					<View style={styles.sectionContainer}>
					  <Text style={styles.sectionTitle}>Step One</Text>
					  <Text style={styles.sectionDescription}>
						Edit <Text style={styles.highlight}>App.js</Text> to change this
						screen and then come back to see your edits.
					  </Text>
					  <Button style={styles.button} onPress={this.showOTPVerify} title="OTP Verify"/>
					  <Button style={styles.button} onPress={this.showSelectLang} title="Select Lang"/>
            <Button style={styles.button} onPress={this.showSignin} title="Sign In"/>
            <Button style={styles.button} onPress={this.showSignupMobile} title="Sign Up Mobile"/>
            <Button style={styles.button} onPress={this.showSignupEmail} title="Sign Up Email"/>
            <Button style={styles.button} onPress={this.showHome} title="GOTO HOME"/>
					</View>
					
				  </View>
				</ScrollView>
			  </SafeAreaView>
			</>
		);
	}
	
	showOTPVerify() {
		let {navigation} = this.props;
		navigation.navigate("OTP");
	}
	showSelectLang() {
		let {navigation} = this.props;
		navigation.navigate("SelectLang");
  }
  showSignin() {
		let {navigation} = this.props;
		navigation.navigate("Signin");
	}
  showSignupMobile() {
		let {navigation} = this.props;
		navigation.navigate("SignupMobile");
	}
  showSignupEmail() {
		let {navigation} = this.props;
		navigation.navigate("SignupEmail");
	}
  showHome() {
		let {navigation} = this.props;
		navigation.navigate("HomeScreening");
	}
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    marginBottom: 10,
    marginTop: 5,
    padding: 10
  }
});

export default TempScreen;
