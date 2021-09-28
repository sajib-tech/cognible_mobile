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

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetInstructions from '../../components/TargetInstructions';
import {getStr} from '../../../locales/Locale';

class SessionPreviewSceen extends Component {
	constructor(props) {
		  super(props);
      // console.log(this.props);
      this.state = { pageTitle: "", sessionData: {}, noOfTargets:0, pressed: false, emailTxt: '', pwdTxt: '' };
      this.gotoSessionTarget = this.gotoSessionTarget.bind(this);
  }
  getData() {
    let data = [
        {sno: 1, descr: 'This is the first point about the session & how it should be done.'},
        {sno: 2, descr: 'Continuing with a second point and explaining what is to be done in the assessment.'},
        {sno: 3, descr: 'Keep steps short, two to three lines max otherwise it\'ll be confusing.'}
    ];
    return data;
  }
	render() {
    const { route } = this.props;
    let pageTitle = route.params.pageTitle;
    let targetLength = (Object.keys(route.params.sessionData.node.targetAllocateSet.edges)).length;
    let sessionData = route.params.sessionData;
    let sessionNode = sessionData.node;
    let host = "";
    let duration = "";
    let itemRequired = "";
    let instruction = "";
    let isInstructionListAvailable = false;
    if(sessionNode) {
      host = sessionNode.sessionHost.relationship.name;
      duration = sessionNode.sessionHost.timeSpent.edges[0].node.duration; 
      itemRequired = sessionNode.itemRequired;
      instruction = sessionNode.instruction;
    }
    // console.log(JSON.stringify(route.params));
		return (
        <View>
        {/* Header */}
            <View style={styles.header}>
              <Text style={styles.backIcon}>
                <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
              </Text>
              {/* <Text style={styles.headerTitle}>{getStr('sessionPreview.morningSessionTitle')}</Text> */}
              <Text style={styles.headerTitle}>{pageTitle}</Text>

            </View>
          <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
              {/* <View style={styles.wrapper}> */}
                
                <Image source={require('../../../android/img/Image.png')} style={styles.instructionImage}/>
                <Text  style={styles.videoTime}>
                  {duration} .
                  {targetLength} Targets . 
                  14 Trails</Text>
                <View style={styles.sessionSuccessResponse}>
                  <View style={styles.sessionSuccessText}>
                    <Text style={styles.sessionSuccessTitle}>
                      <Image source={require('../../../android/img/profile.jpg')} style={{height:30,width:30}} />
                      {getStr('sessionPreview.sessionHost')}
                    </Text>
                    <Text style={styles.sessionSuccessDescription}>This session is to be Taken by <Text style={{color:'#6495ED', marginLeft: 10}}>{host}</Text></Text>
                    </View>
                </View>

                <View style={styles.sessionSuccessResponse}>
                  <View style={styles.sessionSuccessText}>
                    <Text style={styles.sessionSuccessTitle}>
                        <Image source={require('../../../android/img/items.png')} style={{height:30,width:30}} />  Items Required</Text>
                    <Text style={styles.sessionSuccessDescription}>{itemRequired}</Text>
                  </View>
                </View>

                <TargetInstructions data={this.getData()} isList={isInstructionListAvailable} description={instruction}/>
      
                <View style={styles.continueView}>
                  <TouchableOpacity	style={styles.continueViewTouchable} activeOpacity={ .5 } onPress={ () => this.gotoSessionTarget(pageTitle, sessionData) }>
                      <Text style={styles.continueViewText}> Start Session </Text>  
                  </TouchableOpacity>
                </View>

              {/* </View>  */}
            </ScrollView>
          </SafeAreaView>
        </View>
		);
  }
  gotoSessionTarget(pageTitle, sessionData) {
    let {navigation} = this.props;
    // console.log("******"+JSON.stringify(sessionData));
    navigation.navigate('SessionTarget', {
        pageTitle: pageTitle, sessionData: sessionData
    });
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,    
    //backgroundColor: '#ecf0f1',
    backgroundColor: '#FFFFFF',
    padding: 5
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
    color: '#45494E',
    fontWeight:'bold'
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
  // {width: 350, height: 200,borderRadius:50,backgroundColor:'black',border:5,margin:5}
  instructionImage: {
    width: '95%',
    height: 200,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius:10,
    marginTop:20,
    marginLeft:10,
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
    marginTop: 12,
    marginLeft:12,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: 'bold',
   // letterSpacing:0.5,
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
    marginTop: 10,
    margin: 5,
    flexDirection: 'row',
 
    // borderWidth: 1,
    // borderColor: '1px solid rgba(0, 0, 0, 0.075)',
    // borderRadius: 4
  },
  sessionSuccessText: {
    width: '85%',
  //  marginTop:'0.10'
  },
  sessionSuccessTitle: {
    fontSize: 20,
    color: '#1E90FF',
    alignItems:"flex-end"
  //  lineHeight: 35,
   // fontWeight:'bold'
  },
  sessionSuccess: {
    fontSize: 15,
    fontWeight: 'normal',
   // marginTop:15,
   marginLeft:10,
    color: 'rgba(95, 95, 95, 0.75)',letterSpacing:0.1
  },
  sessionSuccessDescription: {
    fontSize: 15,
    fontWeight: 'normal',
    marginTop:15,
    color: 'rgba(95, 95, 95, 0.75)',letterSpacing:0.1
  },
  sessionSuccessCount: {
    fontSize: 17,
    fontWeight: '500',
    width: 40,
    height: 40,
    paddingTop: 10,
    color: '#6495ED',
    borderRadius: 4,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'powderblue'
  },
  continueViewTouchable:{
    marginTop:28,
    paddingTop:10,
    paddingBottom:10,
    marginLeft:12,
    marginRight:12,
    marginBottom:15,
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

export default SessionPreviewSceen;
