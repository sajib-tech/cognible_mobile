import React, { Component } from 'react';
import Timer from 'react-compound-timer';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Image,
    FlatList,
    Alert,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Dimensions,
    BackHandler,
    Platform,
    processColor,
  } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color from '../../utility/Color';
import TrialsList from './TrialsList'
import {client,recordSBTTrial,updateSBTtrial} from '../../constants/parent';
import DateHelper from '../../helpers/DateHelper';

  let timer=null
class SBTBlock extends Component {
    constructor(props) {
      // const {targetList,currentTargetIndex}=this.props
        super(props);
        this.state = { 
            isCorrect:false,
            isPrompt:false,
            showTimer:'00 min 30 sec',
            SBTStepActiveIndex:this.props.SBTStepActiveIndex,
            SBTTrialACtiveIndex:0,
            SBTStepActiveId:'',
            autoRecordNone: true,
            totalSeconds:0,
            reload:false,
            trialStartTime:0

         }
         this.timerRef=React.createRef()
    }

    componentDidMount(){
      const {targetList,currentTargetIndex,currentSessionTime}=this.props
      console.log("length of sbt>>>>>>>>>>>>",targetList[currentTargetIndex].node?.sbtSteps);
        this.startThirdExtraTimer(30)
        this.setState({
          SBTStepActiveId:targetList[currentTargetIndex].node?.sbtSteps?.edges.length>0 ? targetList[currentTargetIndex].node?.sbtSteps?.edges[0].node.id :'',
          trialStartTime:currentSessionTime
        })
    }

    componentWillUnmount(){
        clearInterval(timer)
    }

    startThirdExtraTimer = (seconds, type) => {
        console.log("inside timer",seconds);
        timer = setInterval(() => {
          seconds=seconds-1;
          let pSeconds = (seconds % 60) + '';
          // console.log(">>>>",typeof(pSeconds));
          if (pSeconds.length < 2) {
            pSeconds = '0' + pSeconds;
          }
          if(parseInt(pSeconds)===0){
              console.log("true>>");
              seconds=30
              this.recordResponse('Error','','','','')
          }
          let sec = pSeconds;
    
          let pMinutes = parseInt(seconds / 60) + '';
          if (pMinutes.length < 2) {
            pMinutes = '0' + pMinutes;
          }
          let min = pMinutes;
    
          let totalDuration = `${min} min ${sec} sec`;
    
          this.setState({
            showTimer: totalDuration,
            totalSeconds: (30-seconds)*1000,
          });
        }, 1000);
      };
    
     
    moveSBTstepTo(direction) {
        const {
          currentTargetIndex,
          targetList, 
          currentSessionTime         
          
        } = this.props;
        const {SBTStepActiveIndex,SBTTrialACtiveIndex}=this.state
       
        this.setState({
          trialStartTime:currentSessionTime
        })
        console.log("SBTActive Index",SBTStepActiveIndex,currentSessionTime);
        if (direction === 'previous') {
          if (SBTStepActiveIndex > 0) {
            this.setState({
              SBTStepActiveIndex: SBTStepActiveIndex - 1,
              SBTTrialACtiveIndex:0,
              SBTStepActiveId:targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex-1].node
              .id,
              
            },()=>{
                clearInterval(timer)
              this.startThirdExtraTimer(31)
    
              });
          }
        } else if (direction === 'next') {
          if(SBTStepActiveIndex === targetList[currentTargetIndex].node.sbtSteps.edges.length){
            this.setState({SBTStepActiveIndex:SBTStepActiveIndex-1})
          }
          if(SBTStepActiveIndex < targetList[currentTargetIndex].node.sbtSteps.edges.length-1){
          this.setState({
            SBTStepActiveIndex: SBTStepActiveIndex + 1,
            SBTTrialACtiveIndex:0,
            SBTStepActiveId:targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex+1].node
              .id,
              
            
          },()=>{
            clearInterval(timer)
          this.startThirdExtraTimer(31)

          });
          
        }
        }
      }

      moveSBTtrialTo(direction) {
        const {
          currentTargetIndex,
          targetList, 
          
        } = this.props;
        const {SBTTrialACtiveIndex,SBTStepActiveIndex}=this.state
        console.log("SBTActive Index",SBTTrialACtiveIndex);
        if (direction === 'previous') {
          if (SBTTrialACtiveIndex > 0) {
            this.setState({
              SBTTrialACtiveIndex: SBTTrialACtiveIndex - 1,
              
            },()=>{
                clearInterval(timer)
              this.startThirdExtraTimer(31)
    
              });
          }
        } else if (direction === 'next') {
          if(SBTTrialACtiveIndex+1 === targetList[currentTargetIndex].node.targetAllcatedDetails?.DailyTrials){
            this.setState({SBTStepActiveIndex:SBTStepActiveIndex+1,
            SBTTrialACtiveIndex:0})
          }
          if(SBTTrialACtiveIndex < targetList[currentTargetIndex].node.targetAllcatedDetails?.DailyTrials-1){
          this.setState({
            SBTTrialACtiveIndex: SBTTrialACtiveIndex + 1,
            
          },()=>{
            clearInterval(timer)
          this.startThirdExtraTimer(31)

          });
          
        }
        }
      }

      recordResponse=(response, r1 = '', r2 = '', promptId = '', reinforceId = '')=>{
        const {targetList,currentTargetIndex,childSessionId,currentSessionTime,getSessionRecordings}=this.props
        const {SBTStepActiveId,SBTTrialACtiveIndex,trialStartTime}=this.state
        let currentTimeInSecond=DateHelper.caluculateTimeInSeconds(
          currentSessionTime
        );
        let trialStartTimeInSecond=DateHelper.caluculateTimeInSeconds(
          trialStartTime
        );
        let duration=(currentTimeInSecond-trialStartTimeInSecond)*1000
        let variables={
          targets:targetList[currentTargetIndex].node.id,
          childSession:childSessionId.id,
          status:targetList[currentTargetIndex].node.targetStatus.id,
          trial:response,
          duration,
          r1:r1,
          r2:r2,
          sbtStep:SBTStepActiveId,
          prompt:promptId,
          reinforce:reinforceId

        }
        console.log("variables>>>",this.state.totalSeconds,currentTimeInSecond,trialStartTime,variables);
        console.log(".getChildSession",childSessionId);
        let sessionEditable=childSessionId.status==='COMPLETED'?false:true
        let Disable=!sessionEditable
        console.log("session Editable>>>",r1,r2);
        if(sessionEditable){

          if(targetList[currentTargetIndex].node.sbt!==undefined && targetList[currentTargetIndex].node.sbt[SBTStepActiveId]?.[SBTTrialACtiveIndex]){
            console.log("if>>");
            const trialObject=targetList[currentTargetIndex].node.sbt?targetList[currentTargetIndex].node.sbt[SBTStepActiveId]?.[SBTTrialACtiveIndex]:undefined
            client.mutate({
              mutation:updateSBTtrial,
              variables:{
                pk:trialObject.id,
                trial:response,
                r1:r1,
                r2:r2,
                prompt:promptId,
                reinforce:reinforceId         
                
              }

            })
            .then(res=>{
              console.log("resupdate>>>",JSON.stringify(res.data));
              getSessionRecordings()
              this.moveSBTtrialTo('next');

              // this.getButtonsStyle('r1')
            })
          }
          else{
            console.log("else>>>");
            this.setState({
              reload:true
            })
            client.mutate({
                mutation: recordSBTTrial,
                variables:{
      
                  targets:targetList[currentTargetIndex].node.id,
                  childSession:childSessionId.id,
                  status:targetList[currentTargetIndex].node.targetStatus.id,
                  trial:response,
                  duration,
                  r1:r1===''?"":r1,
                  r2:r2===''?"":r2,
                  sbtStep:SBTStepActiveId,
                  prompt:promptId,
                  reinforce:reinforceId
      
                }
              })
              .then(res=>{
                console.log("res>>",JSON.stringify(res.data));
                getSessionRecordings()
                this.moveSBTtrialTo('next');

                this.setState({
                  reload:false
                })

                // this.getButtonsStyle('r1')
              })
          }
        }
        else{
          console.log("else");
                
      }
      }

      getButtonsStyle = type => {
        const {
          targetList,
          currentTargetIndex,          
        } = this.props

        const {SBTTrialACtiveIndex,SBTStepActiveId}=this.state
        const item= targetList[currentTargetIndex].node.sbt !==undefined? targetList[currentTargetIndex].node.sbt[SBTStepActiveId]?.[SBTTrialACtiveIndex] :undefined
        // console.log("item>>>>",item);
        let r1Style = { backgroundColor: '#fff', borderColor: '#d9d9d9', color: 'rgba(0,0,0,0.65)' }
        let r2Style = { backgroundColor: '#fff', borderColor: '#d9d9d9', color: 'rgba(0,0,0,0.65)' }
        let noneStyle = { backgroundColor: '#fff', borderColor: '#d9d9d9', color: 'rgba(0,0,0,0.65)' }
        let promptStyle = { backgroundColor: '#fff', borderColor: '#d9d9d9', color: 'rgba(0,0,0,0.65)' }
        let reinforceStyle = { backgroundColor: '#fff', borderColor: '#d9d9d9', color: 'rgba(0,0,0,0.65)' }
        if (item) {
    
          if (item.trial === 'INCORRECT') {
            if (item.r1) r1Style = { backgroundColor: '#2457c7', borderColor: '#d9d9d9', color: '#fff' }
            if (item.r2) r2Style = { backgroundColor: '#2457c7', borderColor: '#d9d9d9', color: '#fff' }
          }
          if (item.trial === 'ERROR') noneStyle = { backgroundColor: '#FF8080', borderColor: '#d9d9d9', color: '#fff' }
          if (item.trial === 'PROMPT') promptStyle = { backgroundColor: '#FF9C52', borderColor: '#d9d9d9', color: '#fff' }
          if (item.trial === 'CORRECT') reinforceStyle = { backgroundColor: '#4BAEA0', borderColor: '#d9d9d9', color: '#fff' }
    
        }
    
        let returnStyle = { backgroundColor: '#fff', borderColor: '#d9d9d9', color: 'rgba(0,0,0,0.65)' }
        if (type === 'r1') returnStyle = r1Style
        if (type === 'r2') returnStyle = r2Style
        if (type === 'none') returnStyle = noneStyle
        if (type === 'prompt') returnStyle = promptStyle
        if (type === 'reinforce') returnStyle = reinforceStyle
    
        return returnStyle
      }

      getButtonsCounts = type => {
        const {
          targetList,
          currentTargetIndex,
            
          
        } = this.props
        const {SBTStepActiveIndex,SBTStepActiveId}=this.state
        const recording = targetList[currentTargetIndex]?.node?.sbt ? targetList[currentTargetIndex].node?.sbt[SBTStepActiveId] :undefined
        let r1Count = 0
        let r2Count = 0
        let noneCount = 0
        let promptCount = 0
        let reinforceCount = 0
        if (recording && recording.length > 0) {
          recording.map(item => {
            // console.log("ite****m>>>",item.r1);
            if (item.trial === 'INCORRECT') {
              if (item.r1) r1Count += 1
              if (item.r2) r2Count += 1
            }
            if (item.trial === 'ERROR') noneCount += 1
            if (item.trial === 'PROMPT') promptCount += 1
            if (item.trial === 'CORRECT') reinforceCount += 1
          })
        }
    
        let returnCount = 0
        if (type === 'r1') returnCount = r1Count
        if (type === 'r2') returnCount = r2Count
        if (type === 'none') returnCount = noneCount
        if (type === 'prompt') returnCount = promptCount
        if (type === 'reinforce') returnCount = reinforceCount
    
        return returnCount
      }
    
    

     
    render() {
        const {isPrompt,isCorrect,SBTStepActiveId,SBTTrialACtiveIndex,SBTStepActiveIndex,showTimer} = this.state;
        const {targetList,currentTargetIndex}=this.props
    return (
      <View style={{padding: 15}}>
        <View style={styles.trailProgressTitle}>
          <Text style={styles.trailProgressText}>
            {targetList[currentTargetIndex].node.sbtSteps?.edges?.length>0?targetList[currentTargetIndex]?.node.sbtSteps?.edges[SBTStepActiveIndex].node.description:<Text>No Steps Found</Text>}
          </Text>
        <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTstepTo('previous');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-left'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
              <Text style={{
                marginTop:5
              }}>Step {targetList[currentTargetIndex].node.sbtSteps?.edges?.length===0?0:SBTStepActiveIndex+1}/{targetList[currentTargetIndex].node.sbtSteps?.edges?.length}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTstepTo('next');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-right'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
            </View>
</View>
{targetList[currentTargetIndex].node.sbtSteps?.edges?.length!==0 &&
<View style={{justifyContent:'center',...styles.cardTarget}}>
<View style={{flexDirection: 'row',justifyContent:'center'}}>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTtrialTo('previous');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-left'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
              <Text style={{
                marginTop:5
              }}>Trial {SBTTrialACtiveIndex+1}/{targetList[currentTargetIndex].node.targetAllcatedDetails?.DailyTrials}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.moveSBTtrialTo('next');
                }}>
                <Text style={styles.arrowButton}>
                  <FontAwesome5
                    name={'chevron-right'}
                    style={styles.arrowButtonText}
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <View
          style={{
            backgroundColor: Color.bluejay,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {/* <Timer
                            key={SBTStepActiveIndex+Math.random()}
                            ref={this.timerRef}
                            initialTime={30000}
                            direction="backward"
                            checkpoints={[
                              {
                                time: 0,
                                callback: () => {
                                  console.log('Checkpoint 30 sec - call record none response query')
                                  // autoRecordNone && this.recordResponse('Error', '', '', '', '')
                                },
                              },
                            ]}
                          >
                            {() => (
                              <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                              }}>
                              <Text style={{margin: 5, fontSize: 16, color: Color.white}}>
                                <Timer.Minutes /> min
                              </Text>
                              <Text style={{margin: 5, fontSize: 16, color: Color.white}}>
                                <Timer.Seconds /> sec
                              </Text>
                            </View>
                            )}
                          </Timer> */}
                         
            <Text style={{fontSize: 18,color:Color.white}}>{showTimer}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            margin:5,
            width:'50%'
          }}>
          <TouchableOpacity
            style={{
              flex:1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              ...this.getButtonsStyle('r1')

            }}
            onPress={()=>{
              this.recordResponse(
                'Incorrect',
                targetList[currentTargetIndex]?.node?.r1?.id,
                '', // r2 null
                '', // prompt null
                '', // reinforcer null
              )
            }}>
            <Text style={{fontSize: 15,...this.getButtonsStyle('r1')}}>
              R1:{' '}
                {targetList[currentTargetIndex]?.node?.r1?.behaviorName}({this.getButtonsCounts('r1')})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 10,width:'50%'}}>
          <TouchableOpacity
            
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 7,
                borderRadius: 5,
                borderWidth:1,
                ...this.getButtonsStyle('r2')
  
              }}
              onPress={()=>{
                this.recordResponse(
                  'Incorrect',
                  '', // r1 null
                  targetList[currentTargetIndex]?.node?.r2?.id,
                  '', // prompt null
                  '', // reinforcer null
                )
              }}
            >
            <Text style={{...this.getButtonsStyle('r2'),fontSize: 15}}>
              R2:{' '}
                {targetList[currentTargetIndex]?.node?.r2?.behaviorName}({this.getButtonsCounts('r2')})
              
            </Text>
          </TouchableOpacity>
        </View>
        
        </View>
        
        
        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            width:'30%',
            margin:5
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              ...this.getButtonsStyle('none')

            }}

            onPress={()=>{
              this.recordResponse(
                'Error',
                '', // r1 null
                '', //r2 null
                '', // prompt null
                '', // reinforcer null
              )
            }}
            >
            <Text style={{...this.getButtonsStyle('none'),fontSize: 15}}>
              None({this.getButtonsCounts('none')})              
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            width:'30%',
            margin:5
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              ...this.getButtonsStyle('prompt')

            }}
            onPress={()=>{
              this.setState({
                isPrompt:!isPrompt,
                isCorrect:false
              })

            }}>
            <Text style={{...this.getButtonsStyle('prompt'),fontSize: 15}}>
              Prompt({this.getButtonsCounts('prompt')})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 10,margin:8,width:'30%'}}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1,
              ...this.getButtonsStyle('reinforce')

            }}
            onPress={()=>{
              this.setState({
                isPrompt:false,
                isCorrect:!isCorrect
              })

            }}>
            <Text style={{...this.getButtonsStyle('reinforce'),fontSize: 15}}>
              Correct({this.getButtonsCounts('reinforce')}){' '}
              
            </Text>
          </TouchableOpacity>
        </View>
        </View>
        <View style={{flexDirection:'column'}}>
        {isPrompt && targetList[currentTargetIndex]?.node.targetAllcatedDetails?.promptCodes.edges.length>0 && <>
          {
            targetList[currentTargetIndex]?.node.targetAllcatedDetails?.promptCodes.edges.map(({node})=>{
              return <View style={{
                marginBottom:5
              }}>
                <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1
            }}
            onPress={()=>{
              this.recordResponse(
                'Prompt',
                '', // r1 null
                '', //r2 null
                node.id, // prompt null
                '', // reinforcer null
              )
            }}
            
            >
            <Text style={{color: Color.bluejay, fontSize: 15}}>
              {node.promptName}
              
            </Text>
            </TouchableOpacity>

              </View>
            })
          }

          </>}
          </View>
          <View>
          {isCorrect && targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex].node.reinforce.edges.length>0 && <>
          {
            targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex].node.reinforce.edges.map(({node})=>{
              return <View style={{
                marginBottom:5
              }}>
                <TouchableOpacity
            style={{
              backgroundColor: Color.white,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: 5,
              borderWidth:1
            }}
            onPress={()=>{
              this.recordResponse(
                'Correct',
                '', // r1 null
                '', //r2 null
                '', // prompt null
                node.id, // reinforcer null
              )
            }}
            >
            <Text style={{color: Color.bluejay, fontSize: 15}}>
              {node.name}
              
            </Text>
            </TouchableOpacity>

              </View>
            })
          }

          </>}
          </View>
</View>}
<View style={{...styles.scoreboardView}}>
  <Text style={{...styles.scoreText}}>ScoreBoard</Text>
  {/* {this.renderTrial()} */}

  <TrialsList
            key={targetList[currentTargetIndex]?.node.id}
            sbtStepKey={targetList[currentTargetIndex].node.sbtSteps.edges[SBTStepActiveIndex]?.node.id}
            dailyTrails={targetList[currentTargetIndex].node.targetAllcatedDetails.DailyTrials}
            boxWidth={35}
            targetList={targetList}
            currentTargetIndex={currentTargetIndex}
          />


</View>
        
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.3,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Color.gray,
              borderRadius: 5,
              marginHorizontal: 7,
              paddingVertical: 5,
              backgroundColor: Color.success,
            }}>
            <MaterialCommunityIcons name="plus" size={25} color={Color.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.3,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Color.gray,
              borderRadius: 5,
              marginHorizontal: 7,
              paddingVertical: 5,
              backgroundColor: Color.redFill,
            }}>
            <MaterialCommunityIcons
              name="minus"
              size={25}
              color={Color.white}
            />
          </TouchableOpacity>
        </View> */}
      </View>
     );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
    },
    modalTitle: {
      fontSize: 16,
      color: Color.blackFont,
      borderBottomColor: Color.gray,
      borderBottomWidth: 1,
      paddingBottom: 10,
    },
    peakView: {
      flex: 1,
      marginTop: 20,
      flexDirection: 'column',
      shadowColor: 'rgba(0, 0, 0, 0.06)',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      borderRadius: 5,
      backgroundColor: 'white',
      width: '100%',
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    scoreItemVw: {
      height: 24,
      width: 43,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreItemTextVw: {
      height: 20,
      marginLeft: 5,
      width: 20,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    scoreText: {
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 12,
      marginTop: 5,
      color: 'black',
    },
    questionText: {
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 16,
      marginTop: 10,
      color: '#45494E',
    },
    TrialText: {
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 13,
      marginTop: 5,
      color: 'rgba(95, 95, 95, 0.75)',
    },
    containerPeak: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: 'white',
    },
  
    SquareShapeView: {
      width: 40,
      height: 40,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    peakNumber: {
      alignItems: 'center',
      justifyContent: 'center',
      color: 'black',
    },
    totalScore: {
      position: 'absolute',
      right: 20,
      top: 20,
      color: '#3E7BFA',
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 16,
    },
    scoreboardView: {
      marginTop: 10,
      shadowColor: 'rgba(0, 0, 0, 0.06)',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      borderRadius: 5,
      backgroundColor: 'white',
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    carousel: {
      // height: 200,
      // borderColor: 'red',
      // borderWidth: 1
    },
    heading:{
      backgroundColor:Color.gray,
      color:'white',
      borderTopWidth:1,
      borderBottomWidth:1,
      borderColor:Color.gray,
      
    },
    scrollView: {
      // flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 10,
      marginBottom: 100,
    },
    header: {
      flexDirection: 'row',
      height: 50,
      width: '100%',
    },
    backIcon: {
      fontSize: 50,
      fontWeight: 'normal',
      color: '#fff',
      width: '10%',
      paddingTop: 15,
      paddingLeft: 15,
    },
    backIconText: {
      fontSize: 20,
      fontWeight: 'normal',
      color: '#63686E',
    },
    headerTitle: {
      textAlign: 'center',
      width: '85%',
      fontSize: 22,
      paddingTop: 10,
      color: '#45494E',
    },
    rightIcon: {
      fontSize: 50,
      fontWeight: 'normal',
      color: '#fff',
      width: '10%',
      paddingTop: 15,
    },
    // Target Instruction
    targetInstructionView: {
      paddingTop: 10,
    },
    targetInstructionTitle: {
      color: '#63686E',
      fontSize: 18,
      fontWeight: '500',
    },
    graphTitle: {
      color: '#63686E',
      fontSize: 12,
      fontWeight: '500',
    },
    targetInstructionInformation: {
      flexDirection: 'row',
      width: '100%',
      paddingTop: 20,
    },
    videoPlay: {
      position: 'absolute',
      left: 80,
      top: 30,
      fontSize: 30,
      color: '#fff',
      zIndex: 99999,
    },
    instructionImage: {
      width: 180,
      height: 100,
      borderWidth: 1,
      borderColor: Color.gray,
      borderRadius: 5,
    },
    videoImage: {
      width: '100%',
      height: 120,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightgray',
    },
    instructions: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    instructionsText: {
      color: '#45494E',
      fontSize: 16,
      fontWeight: '500',
    },
    videoTime: {
      paddingTop: 5,
      color: 'rgba(95, 95, 95, 0.75)',
      fontSize: 13,
      fontWeight: '500',
    },
  
    progressBox: {
      height: 15,
      width: '19%',
      marginRight: 2,
      borderRadius: 4,
      backgroundColor: '#4BAEA0',
    },
    correct: {
      borderColor: '#4BAEA0',
      color: '#4BAEA0',
    },
    incorrect: {
      borderColor: '#FF9C52',
      color: '#FF9C52',
    },
  
    // scorebaord
    // trailProgress
    trailProgressSection: {
      marginTop: 30,
    },
    trailProgressTitle: {
      flexDirection: 'row',
      // paddingTop: 10,
      // paddingBottom: 10,
      // paddingBottom: 10,
      // marginRight: 10,
      // borderColor: 'red',
      // borderWidth: 1
    },
    arrowButton: {
      justifyContent: 'center',
      width: 40,
      height: 40,
      // backgroundColor: '#3E7BFA',
      borderRadius: 4,
      marginLeft: 8,
      paddingTop: 10,
      textAlign: 'center',
    },
    arrowButtonText: {
      fontSize: 20,
      fontWeight: 'normal',
      // color: '#fff'
    },
    trailProgressText: {
      paddingTop: 10,
      textAlign: 'left',
      flex: 1,
      color: '#63686E',
      fontSize: 16,
      fontWeight: '500',
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
      backgroundColor: '#4BAEA0',
    },
    headingText: {
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 14,
      color: '#45494E',
    },
  
    // Popup
    cover: {
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    sheet: {
      position: 'absolute',
      top: Dimensions.get('window').height + 10,
      left: 0,
      right: 0,
      height: '90%',
      justifyContent: 'flex-end',
      paddingTop: 10,
    },
    popup: {
      backgroundColor: '#FFF',
      marginHorizontal: 10,
      paddingTop: 20,
      // borderTopLeftRadius: 5,
      // borderBottomLeftRadius:
      // borderTopRightRadius: 5,
      borderRadius: 5,
      // alignItems: "center",
      // justifyContent: "center",
      // minHeight: 330,
      height: '100%',
    },
  
    instructionContent: {
      padding: 10,
      position: 'absolute',
    },
  
    itemView: {
      borderColor: '#ccc',
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 4,
      padding: 16,
      marginBottom: 12,
    },
    itemIcon: {
      fontSize: 16,
      marginTop: 2,
    },
    itemText: {
      marginLeft: 12,
      color: '#63686E',
      fontSize: 16,
      fontWeight: '500',
      fontStyle: 'normal',
    },
    incorrectItemSelected: {
      borderColor: '#FF9C52',
      color: '#FF9C52',
    },
    outsideBlock: {
      marginTop: 16,
      paddingVertical: 10,
      paddingHorizontal: 16,
      // flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
    },
  
    // Exit
  
    exitViewTouchable: {
      paddingTop: 10,
      paddingBottom: 10,
      marginBottom: 15,
      backgroundColor: '#FF8080',
      borderRadius: 8,
    },
    exitView: {
      width: '100%',
    },
    exitViewText: {
      color: '#fff',
      fontSize: 17,
      textAlign: 'center',
    },
    cancelViewTouchable: {
      paddingTop: 10,
      paddingBottom: 10,
      marginBottom: 15,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: 'rgba(95, 95, 95, 0.75)',
    },
    cancelView: {
      width: '100%',
      marginTop: 20,
    },
    cancelViewText: {
      color: 'rgba(95, 95, 95, 0.75)',
      fontSize: 17,
      textAlign: 'center',
    },
  
    titleUpcoming: {
      marginTop: 16,
      color: '#45494E',
      fontSize: 16,
      marginBottom: 10,
    },
    cardTarget: {
      borderRadius: 5,
      padding: 16,
      margin: 3,
      marginBottom: 8,
      backgroundColor: Color.white,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      elevation: 3,
      borderWidth: 1,
      borderColor: Color.white,
    },
    cardTargetSelected: {
      borderRadius: 5,
      padding: 16,
      margin: 3,
      marginBottom: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      elevation: 3,
      borderWidth: 1,
      borderColor: Color.primary,
    },
  
    // Overlay Bottom
    overlayWrapper: {
      borderRadius: 5,
      padding: 16,
      margin: 3,
      marginBottom: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      elevation: 3,
    },
  
    overlayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingBottom: 10,
      backgroundColor: Color.white,
    },
    overlayCard: {
      borderRadius: 5,
      padding: 16,
      margin: 3,
      marginBottom: 16,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      elevation: 3,
      flexDirection: 'row',
    },
    overlayTitle: {
      fontSize: 18,
      // fontWeight: 'bold',
      color: '#45494E',
      marginLeft: 16,
    },
    overlayTitleActive: {
      fontSize: 18,
      // fontWeight: 'bold',
      color: Color.primary,
      marginLeft: 16,
    },
    overlayItemTitle: {
      fontSize: 17,
      color: '#45494E',
    },
    overlayItemDescription: {
      fontSize: 15,
      color: '#808080',
    },
    video: {
      width: Dimensions.get('window').width - 32,
      height: Dimensions.get('window').width * (9 / 16),
      backgroundColor: 'black',
    },
    stimulusVw: {
      paddingVertical: 7,
      marginTop: 25,
      marginBottom: 10,
      marginLeft: -70,
      shadowColor: 'rgba(62,123,250,0.6)',
      shadowOffset: {width: 0, height: 1},
      // shadowOpacity: 0.8,
      shadowRadius: 2,
      // elevation: 5,
      borderRadius: 5,
      backgroundColor: 'white',
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: 'rgba(62,123,250,0.9)',
    },
    classText: {
      fontSize: 18,
      width: '100%',
      marginBottom: 5,
      elevation: 5,
      color: 'grey',
      fontFamily: 'SF Pro Text',
    },
    bottomLineVw: {
      borderRadius: 5,
      position: 'absolute',
      bottom: 0,
      width: 80,
      height: '6%',
      alignSelf: 'center',
      backgroundColor: '#007ff6',
    },
    TrainingTab: {
      position: 'absolute',
      marginTop: 15,
      bottom: 0,
      width: 50,
      height: '8%',
      alignSelf: 'center',
      backgroundColor: '#007ff6',
    },
    SquareShapStimView: {
      backgroundColor: Color.white,
      margin: 10,
      marginBottom: 10,
      padding: 10,
      paddingLeft: 10,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 1,
      borderWidth: 0.5,
      borderColor: Color.gray,
    },
    tabView: {
      padding: 5,
      marginLeft: 15,
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 16,
      color: 'rgba(95, 95, 95, 0.75)',
    },
    selectedTabView: {
      color: '#3E7BFA',
      borderBottomWidth: 2,
      borderBottomColor: '#3E7BFA',
    },
  });
  

export default SBTBlock;