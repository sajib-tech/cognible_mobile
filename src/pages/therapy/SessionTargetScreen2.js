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
  StatusBar, TouchableOpacity,
  Animated, Dimensions
} from 'react-native';
import { Card, List, ListItem, Button, Icon } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';


import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetResponse from '../../components/TargetResponse';
import TargetProgress from '../../components/TargetProgress';
import TrialProgress from '../../components/TrialProgress';
import TrialProgressNew from '../../components/TrialProgressNew';
import { client, getSessionTargetsByStudentIdAndSessionId} from '../../constants/index';

import { useQuery } from '@apollo/react-hooks';
import Carousel from 'react-native-anchor-carousel';

import SessionTargetOverlay from "../../pages/therapy/SessionTargetOverlay";
import store from '../../redux/store';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class SessionTargetScreen extends Component {
	constructor(props) {
		  super(props);
      this.state = { 
        pageTitle: "", 
        animation: new Animated.Value(0),
        targetsCount: 0,
        targetList: [],
        currentTargetIndex: 0,
        currentTrialNumber: 1
      };
      this.goBack = this.goBack.bind(this);
      this.changeTrial = this.changeTrial.bind(this);
	}
  goBack(){
    this.props.navigation.goBack();
  }
  componentDidMount(){
    let {route} = this.props;
      let sessionId = route.params.sessionId;
      let studentId = store.getState().studentId;
      console.log(sessionId+", "+route.params.pageTitle);
      this.getSessionTargets(studentId, sessionId);
  }
  getSessionTargets(studentId, sessionId) {
    client.query({
      query: getSessionTargetsByStudentIdAndSessionId,
      variables: {
          studentId: studentId,
          sessionId: sessionId
      }
    })
    .then(result => {
        console.log("sessionTargetData-------:"+result)
        return result.data;
    })
    .then(data=> {
        if(data.targetAllocates.edges) {
          // this.setState({sessions: data.targetAllocates.edges});
          console.log("========"+(typeof data.targetAllocates.edges)); 
          console.log("========"+(Object.keys(data.targetAllocates.edges).length));
          let targetLength = Object.keys(data.targetAllocates.edges).length;
          let allEdges = data.targetAllocates.edges;
          allEdges.map(edge => {
              edge.node.trailsInfo = []
          })
          this.setState({targetsCount: targetLength, targetList: allEdges});
        }
    });
  }
  changeTrial(type, totalTrails) {
    if(type == "back") {
      if(this.state.currentTrialNumber != 1) {
        this.setState({currentTrialNumber: this.state.currentTrialNumber - 1});
      }
    } else if(type == "forward") {
      if(this.state.currentTrialNumber < totalTrails) {
        this.setState({currentTrialNumber: this.state.currentTrialNumber + 1});
      }
    }
  }
	render() {
    const { route } = this.props;
    // console.log("render():"+JSON.stringify(route.params));
    let pageTitle = route.params.pageTitle;
    let {targetsCount, targetList} = this.state;
		return (
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.backIcon} onPress={this.goBack}>
              <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
            </Text>
            <Text style={styles.headerTitle}>{pageTitle}</Text>
          </View>
          <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                <View style={styles.targetInstructionView}>
                  <Text style={styles.targetInstructionTitle}>Target Instruction</Text>
                  { (
                      (targetsCount > 0) && targetList.map((element, index) => (
                        ((this.state.currentTargetIndex == index) &&
                          <View style={styles.targetInstructionInformation}>
                            <FontAwesome5 name={'play-circle'} style={styles.videoPlay}/>
                            <Image style={styles.instructionImage} source={require('../../../android/img/Image.png')}/>
                            
                              <View style={styles.instructions}>
                                <TouchableOpacity onPress={this.handleOpen}>
                                  <Text  style={styles.instructionsText}>{element.node.targetAllcatedDetails.targetName}</Text>
                                </TouchableOpacity>
                                <Text  style={styles.videoTime}>6 min</Text>
                              </View>                            
                          </View> 
                        )
                      ))
                    )
                  }
                </View>
                {/* Trail Progress */}
                {
                  (
                    (targetsCount > 0) &&
                    targetList.map((element, index)=>(
                        ((this.state.currentTargetIndex == index) && (
                          <View style={styles.trailProgressSection}>
                            <View style={styles.trailProgressTitle}>
                              <Text style={styles.trailProgressText}>
                                Trial {this.state.currentTrialNumber} of {element.node.targetAllcatedDetails.DailyTrials}
                              </Text>
                              <TouchableOpacity>
                                <Text style={{textAlign: 'right', width: '15%'}}>
                                  <FontAwesome5 name={'chevron-left'}  style={{fontSize: 22}}/>
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <Text style={{textAlign: 'right',  width: '15%',}}>
                                  <FontAwesome5 name={'chevron-right'} style={{fontSize: 22}}/>
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {/* {this.getTrailBoxes(index)}    */}  
                            <TrialProgressNew data={element.node.trailsInfo} />                         
                          </View>
                        ))
                    ))
                  )
                }
                {/* ACT Placeholder */}
                {/* <View style={{height: 240, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EDEDED', marginBottom: 100, marginTop: 10, }}>
                    <Text style={{fontFamily: 'SF Pro Text',fontStyle: 'normal',fontWeight: '600',
                        fontSize: 19, color: '#cccccc'}}>ACT PLACEHOLDER</Text>
                </View> */}
                
            </ScrollView>
          </SafeAreaView>
          <View style={{position: 'absolute',padding: 10,bottom: 25}} >
             {  
              (targetList &&
                targetList.map((element, index) => (
                    (((this.state.currentTargetNumber-1) == index) &&
                      <TargetProgress 
                        current={this.state.currentTargetNumber} 
                        total={targetList.length} 
                        parentCallback = {this.callbackTarggetProgress}/>
                    )
                ))
              )
            }
          </View>
        </View>
		);
	}  
}

const styles = StyleSheet.create({
  carousel: {
    	    // height: 200, 
          // borderColor: 'red',
          // borderWidth: 1
		} ,
  scrollView: {
    // flex: 1,    
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 100
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
    paddingTop: 15,
    paddingLeft: 15
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
  
  progressBox: {
    height: 15,
    width: '19%',
    marginRight: 2,
    borderRadius: 4,
    backgroundColor: '#4BAEA0'
  },
  
  // scorebaord
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
  

  // Popup
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  sheet: {
    position: "absolute",
    top: (Dimensions.get("window").height + 10),
    left: 0,
    right: 0,
    height: "90%",
    justifyContent: "flex-end",
    paddingTop: 10,
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    paddingTop: 20,
    // borderTopLeftRadius: 5,
    // borderBottomLeftRadius:
    // borderTopRightRadius: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    // minHeight: 330,
    height: '75%'
  },

});

export default SessionTargetScreen;
