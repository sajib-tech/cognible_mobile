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

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetProgress from '../../components/TargetProgress';

class SessionTargetCorrectScreen extends Component {
	constructor(props) {
		  super(props);
      this.state = { pressed: false, emailTxt: '', pwdTxt: '' };
      
	}
	renderView(item) {
    return(
      <View style={{borderColor: '#ccc', flexDirection: 'row', borderWidth: 1, borderRadius: 4, padding: 20}}>
        {/* <FontAwesome5 name={'circle'} style={{fontSize: 16}}/> */}
        <FontAwesome5 name={'dot-circle'} style={{fontSize: 16}}/>
        <Text style={{paddingLeft: 10,color: '#63686E', fontSize: 16, fontWeight: '500'}}>{item.key}</Text>
      </View>
    )
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
                <Text style={styles.targetInstructionTitle}>Target Instructions</Text>
                <View style={styles.targetInstructionInformation}>
                  <FontAwesome5 name={'play-circle'} style={styles.videoPlay}/>
                  <Image style={styles.instructionImage} source={require('../../../android/img/Image.png')}/>
                  <View style={styles.instructions}>
                    <Text  style={styles.instructionsText}>child_name names the presented complex action appropriately.</Text>
                    <Text  style={styles.videoTime}>6 min</Text>
                  </View>
                </View>
              </View>
              {/* Trail Progress */}
              <View style={styles.trailProgressSection}>
                <View style={styles.trailProgressTitle}>
                  <Text style={styles.trailProgressText}>Trail 4 of 5</Text>
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
                </View>
              </View>
              {/* Target Response */}
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={{width: '50%', color: '#63686E', fontSize: 22, fontWeight: '500', textAlign: 'left'}}>Target Response</Text>
                <Text style={{width: '50%', textAlign: 'right', paddingTop:5, paddingRight:5}}>
                  <FontAwesome5 name={'circle'} style={{fontSize: 20}}/>
                </Text>
                {/* <FontAwesome5 name={'dot-circle'} style={{fontSize: 16}}/> */}
              </View>
              {/* Correct Response */}
              <View style={styles.sessionSuccessResponse}>
                <View style={styles.sessionSuccessText}>
                  <Text style={styles.sessionSuccessTitle1}>Correct Response</Text>
                  <Text style={styles.sessionSuccessDescription1}>Describe what verbally fluent means in a line</Text>
                </View>
                <Text style={styles.sessionSuccessCount1}>2</Text>
              </View>
              {/* InCorrect Response */}
              <View style={styles.sessionSuccessResponse1}>
                <View style={{flexDirection: 'row',}}> 
                  <View style={styles.sessionSuccessText}>
                    <Text style={styles.sessionSuccessTitle}>Incorrect Response</Text>
                    <Text style={styles.sessionSuccessDescription}>Describe what verbally fluent means in a line</Text>
                  </View>
                  <Text style={styles.sessionSuccessCount}>1</Text>
                </View>
              </View>

              {/* Prompt with Help */}
              <View style={styles.sessionSuccessResponse1}>
                <View style={{flexDirection: 'row',}}> 
                  <View style={styles.sessionSuccessText}>
                    <Text style={styles.sessionSuccessTitle}>Prompt with Help</Text>
                    <Text style={styles.sessionSuccessDescription}>Describe what verbally fluent means in a line</Text>
                  </View>
                  <Text style={styles.sessionSuccessCount}>1</Text>
                </View>
              </View>
              <TargetProgress current={5} total={15} />
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
    width: '19%',
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
    marginTop: 10,
    padding: 15,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#3E7BFA',
    borderRadius: 4
  },
  sessionSuccessResponse1: {
    marginTop: 20,
    padding: 15,
    // flexDirection: 'row',
    borderWidth: 1,
    borderColor: '1px solid rgba(0, 0, 0, 0.075)',
    borderRadius: 4
  },
  sessionSuccessText: {
    width: '85%',
  },
  sessionSuccessTitle1: {
    fontSize: 19,
    color: '#3E7BFA',
    lineHeight: 35
  },
  sessionSuccessDescription1: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#3E7BFA'
  },
  sessionSuccessCount1: {
    fontSize: 17,
    fontWeight: '500',
    width: 40,
    height: 40,
    paddingTop: 10,
    color: '#3E7BFA',
    borderRadius: 4,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 104, 110, 0.05)'
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
    borderWidth: 0.5,
    marginBottom: 20,
    borderRadius: 6,
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

export default SessionTargetCorrectScreen;
