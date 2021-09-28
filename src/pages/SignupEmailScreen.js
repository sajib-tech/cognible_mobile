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
  ScrollView,Platform ,
  View, Image, Picker,
  Text, TextInput,
  StatusBar, TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements'
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
//import {NavigationContainer} from '@react-navigation/native';
//import {createStackNavigator} from '@react-navigation/stack';

class SignupEmailScreen extends Component {
	constructor(props) {
		  super(props);
      this.state = { pressed: false, mobileTxt: '' };
      this.selectSignupType = this.selectSignupType.bind(this);
      this.showSignin = this.showSignin.bind(this);
	}
	
	render() {
		return (

			  <SafeAreaView>
				<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.wrapper}>       
            <Image source={require('../../android/img/image_9.png')} style={{width: 400, height: 300 }}/>
            <Text style={{textAlign: 'center'}}>Note: If you are Clinic, then do SignUp</Text>
            <TextInput style={styles.input} placeholder="Email" value={this.state.emailTxt}/>
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
            <View style={styles.continueView}>
                <TouchableOpacity	style={styles.continueViewTouchable} activeOpacity={ .5 } onPress={ this.showSignin }>
                    <Text style={styles.continueViewText}> Sign Up </Text>  
                </TouchableOpacity>
            </View>
            <View style={styles.securityText}>
              <Image source={require('../../android/img/security.jpg')} 
                style={{width: 15, height: 15}}/>
              <Text style={{textAlign:'center'}}>Your information is safe with us</Text>
            </View>       
            <View style={styles.signupButtons}>
                <View style={styles.signupButton}>
                    <TouchableOpacity activeOpacity={ .5 } onPress={ ()=>{ this.selectSignupType('email'); } }>
                        <Text style={styles.signupButtonText}> <Image 
                          source={require('../../android/img/phone.jpg')} 
                          style={styles.signupButtonImage}/>  Phone </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.signupButton}>
                    <TouchableOpacity activeOpacity={ .5 } onPress={ () => { this.selectSignupType('google'); } }>
                        <Text style={styles.signupButtonText}>
                          <Image 
                          source={require('../../android/img/google.jpg')}
                          style={styles.signupButtonImage}/>Google
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
              <TouchableOpacity	 activeOpacity={ .5 } onPress={ this.showSignin }>
                <Text style={styles.contactUsText}> Need help?   
                <Text style={{color:'blue', marginLeft: 10}}> Contact Us</Text> </Text>  
              </TouchableOpacity>
            </View>
          </View>
				</ScrollView>
			  </SafeAreaView>

		);
	}
    ButtonClickCheckFunction() {}
    selectSignupType(lang) {
        console.log("lang:"+lang);
        // this.setState({language: lang});
    }
    showSignin() {
        let {navigation} = this.props;
        navigation.navigate('SignupMobile');
    }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  inputView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 2,
    margin: 20,
    padding: 5
  },
  input:{
    margin: 20,
    marginBottom: 10,
    padding: 10,
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '500',
    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF'
  },
  continueViewTouchable:{
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:20,
    marginRight:20,
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
  securityText: {
    flex: 1,
    flexDirection: 'row', 
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10, 
    paddingBottom: 40
  },
  signupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    height: 50,
    marginBottom: 120
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    color: '#10253C',
    width: '47%',
    height: 50,
    borderRadius:3,
    textAlign: 'center'
  },
  signupButtonText:{
     color:'#10253C',
     textAlign:'center',
     paddingTop:10
  },
  signupButtonImage: {
      width: 20, 
      height: 20 , 
      marginTop:10
  },
  contactUsText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
    paddingBottom: 30
  }
});

export default SignupEmailScreen;
