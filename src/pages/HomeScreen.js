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
  View, Image,FlatList,
  Text, TextInput,
  StatusBar, TouchableOpacity
} from 'react-native';
import { Card, List, ListItem, Button, Icon } from 'react-native-elements';


import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
//import {NavigationContainer} from '@react-navigation/native';
//import {createStackNavigator} from '@react-navigation/stack';
const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  }
]
class HomeScreen extends Component {
	constructor(props) {
		  super(props);
      this.state = { pressed: false, emailTxt: '', pwdTxt: '' };
      
	}
	render() {
		return (

			  <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={styles.wrapper}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.backIcon}>
                  <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
                </Text>
                <Text style={styles.headerTitle}>Morning Session</Text>
                <Text style={styles.rightIcon}>
                  <FontAwesome5 name={'chevron-right'} style={styles.backIconText}/></Text>
              </View>
              {/* Traget instruction */}
              <View style={styles.targetInstructionView}>
                <Text style={styles.targetInstructionTitle}>Target Instruction</Text>
                <View style={styles.targetInstructionInformation}>
                  <FontAwesome5 name={'play-circle'} style={styles.videoPlay}/>
                  <Image style={styles.instructionImage} source={require('../../android/img/Image.png')}/>
                  <View style={styles.instructions}>
                    <Text  style={styles.instructionsText}>Kunal names the presented complex action appropriately.</Text>
                    <Text  style={styles.videoTime}>Visual Perception . 4 min</Text>
                  </View>
                </View>
              </View>
              {/* Trail Progress */}
              <View style={styles.trailProgressSection}>
                <View style={styles.trailProgressTitle}>
                  <Text style={styles.trailProgressText}>Trail 5 of 8</Text>
                  <Text style={{textAlign: 'right', width: '15%'}}>
                    <FontAwesome5 name={'chevron-left'}  style={{fontSize: 22}}/>
                  </Text>
                  <Text style={{textAlign: 'right',  width: '15%',}}>
                    <FontAwesome5 name={'chevron-right'} style={{fontSize: 22}}/>
                  </Text>
                </View>
                <View style={styles.trailProgress}>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                    <Text style={styles.progressBox}></Text>
                </View>
              </View>
              {/* Correct Response */}
              <View style={styles.sessionSuccessResponse}>
                <View style={styles.sessionSuccessText}>
                  <Text style={styles.sessionSuccessTitle}>Correct Response</Text>
                  <Text style={styles.sessionSuccessDescription}>Describe what verbally fluent means in a line</Text>
                </View>
                <Text style={styles.sessionSuccessCount}>2</Text>
              </View>
              {/* InCorrect Response */}
              <View style={styles.sessionSuccessResponse}>
                <View style={styles.sessionSuccessText}>
                  <Text style={styles.sessionSuccessTitle}>Incorrect Response</Text>
                  <Text style={styles.sessionSuccessDescription}>Describe what verbally fluent means in a line</Text>
                </View>
                <Text style={styles.sessionSuccessCount}>1</Text>
              </View>
              
              <View style={{flexDirection: 'row',height: 50, marginTop: 190}}>
                <View style={styles.targetView}>
                  <Text style={styles.targetText}>Target 1 of 8</Text>
                  <Text style={styles.targetProgress}></Text>
                  <Text style={styles.targetProgressColor}></Text>
                </View>
                <Text style={styles.arrowButton}>
                  <FontAwesome5 name={'chevron-up'} style={styles.arrowButtonText}/>
                </Text>
                <Text style={styles.arrowButton}>
                  <FontAwesome5 name={'chevron-down'} style={styles.arrowButtonText} />
                </Text>
              </View>
            </View> 
          </ScrollView>
			  </SafeAreaView>

        // <View style={styles.screeningCard}>
        //         <View style={styles.screeningCardTextView}>
        //           <Text style={styles.screeningCardTitle}>
        //             Autism Screening
        //           </Text>
        //           <Text style={styles.screeningCardDescription}>
        //             Indian Academy of Pediatrics recommends every child should be screened before the age of 5.
        //           </Text>
        //           <Text style={styles.screeningCardLink}>Start Screening -></Text>
        //         </View>
        //         <Image style={styles.screeningCardImage} source={require('../android/img/screening-card.png')}/>
        //       </View>

		);
	}
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,    
    backgroundColor: '#ecf0f1',
    padding: 10
  },
  header: {
    flexDirection: 'row',
    height: 50,    
    width: '100%'
  },
  backIcon: {
    fontSize: 50, 
    fontWeight: 'normal', 
    color: '#fff',
    width: '10%',
    paddingTop: 15
  },
  backIconText: {
    fontSize: 20, 
    fontWeight: 'normal', 
    color: '#63686E'
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E'
  },
  rightIcon: {
    fontSize: 50, 
    fontWeight: 'normal', 
    color: '#fff',
    width: '10%',
    paddingTop: 15
  },
  // Target Instruction
  targetInstructionView:{
    paddingTop: 20
  },
  targetInstructionTitle:{
    color: '#63686E',
    fontSize: 22,
    fontWeight: '500'
  },
  targetInstructionInformation: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20
  },
  videoPlay: {
    position: 'absolute',
    left: 40,
    top: 40,
    fontSize: 26,
    color: '#fff',
    zIndex: 99999
  },
  instructionImage: {
    width: '30%',
    height: 64,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4
  },
  instructions: {
    width: '65%',
    paddingLeft: 10,
  },
  instructionsText: {
    color: '#63686E',
    fontSize: 16,
    fontWeight: '500'
  },
  videoTime: {
    paddingTop: 5,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: '500'
  },
  // trailProgress
  trailProgressSection:{
    marginTop: 30,
  },
  trailProgressTitle: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginRight: 10
  },
  trailProgressText: {
    textAlign: 'left', 
    width: '70%', 
    color: '#63686E', 
    fontSize: 16, 
    fontWeight: '500'
  },
  trailProgress: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
  },
  progressBox: {
    height: 15,
    width: 40,
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: '#4BAEA0'
  },
  screeningCard: {
    flexDirection: 'row',
    backgroundColor: '#254056',
    height: 180
  },
  screeningCardTextView: {
    width: '65%',
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  screeningCardTitle: {
    color: '#ffffff',
    fontSize: 22,
    paddingBottom: 10
  },
  screeningCardDescription: {
    color: '#ffffff',
    paddingBottom: 10
  },
  screeningCardLink: {
    color: '#ffffff',
    fontSize: 22
  },

  sessionSuccessResponse: {
    marginTop: 20,
    padding: 15,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '1px solid rgba(0, 0, 0, 0.075)',
    borderRadius: 4
  },
  sessionSuccessText: {
    width: '85%',
  },
  sessionSuccessTitle: {
    fontSize: 19,
    color: '#45494E',
    lineHeight: 35
  },
  sessionSuccessDescription: {
    fontSize: 13,
    fontWeight: 'normal',
    color: 'rgba(95, 95, 95, 0.75)'
  },
  sessionSuccessCount: {
    fontSize: 17,
    fontWeight: '500',
    width: 40,
    height: 40,
    paddingTop: 10,
    color: '#63686E',
    borderRadius: 4,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 104, 110, 0.05)'
  },
  targetView: {
    width: '68%',
    height: 50,
    padding: 10, 
    marginBottom: 20, 
    backgroundColor: 'rgba(62, 123, 250, 0.05)'
    // backgroundColor: 'orange'
  },
  targetText: {
    paddingBottom: 5, 
    color: '#3E7BFA',
    fontSize: 13,
    fontWeight: '500'
  },
  targetProgress: {
    height: 2,
    width: '100%',
    borderWidth: 2,
    borderColor: '#cfcfcf',
  },
  targetProgressColor: {
    position: 'absolute',
    top: 33,
    left: 10,
    width: '20%',
    height: 4,
    backgroundColor: '#3E7BFA'
  },
  arrowButton: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 5,
    paddingTop: 14,
    textAlign: 'center'
  },
  arrowButtonText:{
    fontSize: 20, 
    fontWeight: 'normal', 
    color: '#fff'
  }
});

export default HomeScreen;
