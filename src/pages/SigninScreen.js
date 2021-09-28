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
  View, Image,
  Text, Button, TextInput,
  StatusBar, TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { connect } from 'react-redux';
import {signin} from '../redux/actions/index';
import {getAuthResult} from '../redux/reducers/index';

class SigninScreen extends Component {
	constructor(props) {
		  super(props);
      this.state = { pressed: false, emailTxt: '', pwdTxt: '', authResult: props.authResult };
      this.selectLang = this.selectLang.bind(this);
      this.showSignin = this.showSignin.bind(this);
      this.login = this.login.bind(this);
      this.showHome = this.showHome.bind(this);
	}
	componentDidUpdate(updateProps) {
      //console.log("signing, comp update: ", updateProps);
  }
	render() {
    console.log("ye hai kya screen");
    //console.log("render, props : ", this.props);
    if(this.props.authResult) {
        //this.showHome();
    }
    //console.log("render, authResult:", this.state.authResult);
		return (

			  <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={styles.wrapper}>
              <Image source={require('../../android/img/image_9.png')} style={{width: 400, height: 300 }}/>
              <TextInput style={styles.input} placeholder="Email" value={this.state.emailTxt}/>
              <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
              <View style={styles.continueView}>
                  <TouchableOpacity	style={styles.continueViewTouchable} activeOpacity={ .5 } onPress={ this.login }>
                      <Text style={styles.continueViewText}> Sign In </Text>  
                  </TouchableOpacity>
              </View>
              <View style={styles.securityText}>
                <Image source={require('../../android/img/security.jpg')} 
                  style={{width: 15, height: 15}}/>
                <Text style={{textAlign:'center'}}>Your information is safe with us</Text>
              </View>       
              <View style={styles.signupButtons}>
                  <View style={styles.signupButton}>
                      <TouchableOpacity activeOpacity={ .5 } onPress={ ()=>{ this.selectSignupType('phone'); } }>
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
              <View style={styles.continueView}>
                  <TouchableOpacity	style={styles.continueViewTouchable} activeOpacity={ .5 } onPress={ this.showSignin }>
                      <Text style={styles.continueViewText}> Register </Text>  
                  </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
			  </SafeAreaView>

		);
	}
    login() {
        let data = {uname: "LSAG", pwd: "123456"};
        //console.log("props auth = ", this.props.authResult);
        //console.log("state auth = ", this.state.authResult);
        if(!this.props.authResult && !this.state.authResult) {
            this.props.dispatchSignin(data);
        } else {
            this.showHome();
        }
    }
    showHome() {
        let {navigation} = this.props;
        navigation.navigate('HomeScreening');
    }
    selectLang(lang) {
        console.log("lang:"+lang);
        this.setState({language: lang});
    }
    selectSignupType(type) {
        let {navigation} = this.props;
        if(type === 'phone') {
          navigation.navigate('SignupMobile');
        } else if (type === 'google') {
          navigation.navigate('SignupEmail');
        }        
    }
    showSignin() {
        let {navigation} = this.props;
        navigation.navigate('SignupEmail');
    }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,    
    backgroundColor: '#ecf0f1',
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

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSignin: (data) => dispatch(signin(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SigninScreen);
