import React, {useEffect, useState, useRef} from 'react';
import {ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux'

import TextInput from '../../../components/TextInput';
import DateInput from '../../../components/DateInput.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import TherapistRequest from '../../../constants/TherapistRequest';
import moment from 'moment'
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tools from './Tools';
import {RichEditor,RichToolbar} from 'react-native-pell-rich-editor';



import actions from '../../../redux/sagas/iisca/iisca.actions'
import LoadingIndicator from '../../../components/LoadingIndicator.js';

import Questions from './Questions'
import { getAssessmentDetails } from '../../../constants/parent';

const ParentQuestionaire = (props) => {
  const RichText = useRef();
  const [gender, setGender] = useState([
    {id: 'Male', label: 'Male'},
    {id: 'Female', label: 'Female'},
  ]);
  const {iiscaId,selStudent,setStep,program,onChangeParent} = props
  const [name, setName] = useState(props?.student?.firstname)
  const [date, setDate] = useState(new Date())
  const [respondant, setRespondant] = useState("")
  const [respondantRelation, setRespondantRelation] = useState("")
  const [selGender, setSelGender] = useState()
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState({
    nameErr: '',
    respondantErr: '',
    respondantRelationErr: '',
    genderErr: ''
  })
  const [isLoading,setIsLoading]=useState(false)
  const [currentQuestionNo, setCurrentQuestionNo] = useState(0)
  const [questionareAns,setQuestionareAns]=useState()
  const [isQuestionaireVisible, setIsQuestionaireVisible] = useState(false)
  const [questionList,setQuestionList]=useState()
  const [studentQuestionare, setStudentQuestionare] = useState(null)
  const [questionare, setQuestionare] = useState(null)
  const [answerList, setAnswerList] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentAnswer, setcurrentAnswer] = useState(null)
  const [editorContent, setEditorContent] = useState('')

  // answer states
  const [currentPreferredCategories, setCurrentPreferredCategories] = useState(null)
  const [currentBehaviors, setCurrentBehaviors] = useState(null)
  const [currentBehaviorRanges, setCurrentBehaviorRanges] = useState(null)
  const [currentSituationBehaviors, setCurrentSituationBehaviors] = useState(null)
  const [currentDistractions, setCurrentDistractions] = useState(null)
  const [currentCommunicationMotives, setCurrentCommunicationMotives] = useState(null)
  const [currentBehaviorReasons, setCurrentBehaviorReasons] = useState(null)
  const [currentAntecedents, setCurrentAntecedents] = useState(null)
  const [currentConsequences, setCurrentConsequences] = useState(null)
  const [currentReinforcers, setCurrentReinforcers] = useState(null)
  const [currentTransitionTriggers, setCurrentTransitionTriggers] = useState(null)
  const [currentActivities, setCurrentActivities] = useState(null)
  const [currentMyways, setCurrentMyways] = useState(null)
  const [currentClusters, setCurrentClusters] = useState(null)


  // questionare states
  const [behaviors, setBehaviors] = useState(null)
  const [situations, setSituations] = useState(null)
  const [activities, setActivities] = useState(null)
  const [antecedents, setAntecedents] = useState(null)
  const [consequences, setConsequences] = useState(null)
  const [distractions, setDistractions] = useState(null)
  const [communications, setCommunications] = useState(null)
  const [reasons, setReasons] = useState(null)
  const [triggers, setTriggers] = useState(null)
  const [reactions, setReactions] = useState(null)

  const dispatch = useDispatch()

  useEffect(()=>{

    getQuestionare()
    getQuestionareAnswer()

  },[])

  

  useEffect(()=>{

    if(questionareAns){
      console.log("questionare Gender>>>>>>>>>>>>>",questionareAns.gender);
      setDate(questionareAns.dateOfInterview)
      setRespondant(questionareAns.respondent)
      setRespondantRelation(questionareAns.respondentRelation)
      setSelGender(questionareAns.gender)
    }

  },[questionareAns])

  const getQuestionare=()=>{
    setIsLoading(true)
    const variable={
      name: 'parent_questionare',
    }
    TherapistRequest.getQuestionareByName(variable)
    .then(res=>{
      setIsLoading(false)
      console.log("resParent>>>",res.data.getQuestionareByName);
      setQuestionare(res.data.getQuestionareByName)
      setQuestionList(res.data.getQuestionareByName.questions.edges)
      setCurrentQuestionNo(1)
    })

  }

  const getQuestionareAnswer=()=>{
    const variable={
      iisca: iiscaId,
      name: 'parent_questionare',
    }
    TherapistRequest.getQuestionareAnswer(variable)
    .then(res=>{
      // console.log("resAnswer>>>>>>",res.data.getQuestionareAnswers);
      setQuestionareAns(res.data.getQuestionareAnswers)
      onChangeParent(res.data.getQuestionareAnswers)

      if (res.data.getQuestionareAnswers) {
        setAnswerList(res.data.getQuestionareAnswers.answers.edges)
        // const answerNow = res.data.getQuestionareAnswers.answers.edges.find(({ node }) => {
        //   console.log("quality",node.question.questionNo === currentQuestionNo);
        //   if (node.question.questionNo === currentQuestionNo) {
        //     return node
        //   }
        //   return null
        // })
        // console.log("answerNow>>",answerNow);
        // setcurrentAnswer(answerNow ? answerNow.node : null)
      }
     
    })
  }

  //   currentQuestionNo Change
  useEffect(() => {
    if (currentQuestionNo) {
      // console.log("questionList>>>>",questionList)
      getQuestionareAnswer()
      const current = questionList.find(element => element?.node.questionNo === currentQuestionNo)
      if (current) {
        setCurrentQuestion(current.node)
      }
      const ans = answerList.find(element => element.node.question.questionNo === currentQuestionNo)
      console.log("ans data>>>",ans)
      if (ans) {
      console.log("ans.text>>>",ans.node.text)

        setEditorContent(ans.node.text)
        setcurrentAnswer(ans.node)
      } else {
        console.log("inside>>");
        setEditorContent('')
        setcurrentAnswer(null)
      }
    }
  }, [currentQuestionNo])

  const editorInitializedCallback=()=> {
    RichText.current?.registerToolbar((items)=> {
      // items contain all the actions that are currently active
      console.log(
        "Toolbar click, selected items (insert end callback):",
        items
      );
    });
  }

  const formIsInvalid = () => {    

    if(name === "") {
      setError({nameErr: "Please Enter Name"})
      setIsError(true)
      return false
    }

    if(respondant === "") {
      setError({
        respondantErr: "Please Enter Respondant"
      })
      setIsError(true)
      return false
    }
    if( respondantRelation === "") {
      setError({
        respondantRelationErr: "Please Enter Respondant relation"
      })
      setIsError(true)
      return false
    }

    if( selGender === "") {
      setError({
        genderErr: "Please select gender"
      })
      setIsError(true)
      return false
    }

    return true
  }


  const handleSubmit = () => { 
    const {student, selStudent} = props 
    const values = {}

    if(formIsInvalid()) {
      values.student = selStudent
      values.dob = student?.dob

      dispatch({
        type: actions.LOAD_USER_DATA,
        payload: values
      })
      dispatch({
        type: actions.SET_STATE,
        payload: {
          loading: false
        }
      })

      const variables= {
        dateOfInterview: moment(date).format('YYYY-MM-DD'),
        gender: selGender,
        respondent: respondant,
        respondentRelation: respondantRelation,
        student: selStudent,
        iiscaProgram: iiscaId,
        questionare: questionare.id,
        answer: [
          {
            question: questionare.questions.edges.find(
              element => element.node.questionNo === 1,
            ).node.id,
          },
        ],
      }

      console.log("variables>>>",variables);
      TherapistRequest.createStudentQuestionare(variables)
      .then(res=>{
        // savefirst(res.data)
        console.log("resCreate Questionare>>>",res.data);
        Alert.alert(
          'Personal Details',
          'Successfully Saved',
          [{
            text: 'OK', onPress: () => {
              console.log('OK Pressed');
              
              setIsQuestionaireVisible(true)
              setCurrentQuestionNo(2)

            }
          }],
        );

      })
      .catch(err=>{
        console.log("error>>>",err);
      })
    }
  }

  const savefirst = x => {
    console.log(x)
    setQuestionareAns(x.saveQuestionareAnswer.details)
    const anss = x.saveQuestionareAnswer.details.answers
    onChangeParent(x.saveQuestionareAnswer.details)
    if (anss) {
      setAnswerList(anss.edges)
      // const answerNow = anss.edges.find(({ node }) => {
      //   if (node.question.questionNo === currentQuestionNo) {
      //     return node
      //   }
      //   return null
      // })
      // setcurrentAnswer(answerNow ? answerNow.node : null)
    }
    if (currentQuestionNo <= 19) setCurrentQuestionNo(currentQuestionNo + 1)
  }

  const renderForm = () => {
    return (
      <ScrollView style={{flex: 1}}>
      <TextInput
        label={'Child/Client'}
        error={error.nameErr}
        placeholder={'Please Enter'}
        defaultValue={name}
        onChangeText={(text) => {
          setName(text)
          setError({nameErr: ""})
        }}
      />
      <DateInput
        label="Date of Interview"
        error={''}
        format="YYYY-MM-DD"
        displayFormat="dddd, DD MMM YYYY"
        value={date}
        onChange={(date) => {
            setDate(date)
        }}
      />
      <TextInput
        label={'Respondant'}
        error={error.respondantErr}
        placeholder={'Please Enter'}
        defaultValue={respondant}
        onChangeText={(text) => {
          setRespondant(text)
          setError({respondantErr: ""})
        }}
      />
      <TextInput
        label={"Respondant's relation to child/client"}
        error={error.respondantRelationErr}
        placeholder={'Please Enter'}
        defaultValue={respondantRelation}
        onChangeText={(text) => {
          setRespondantRelation(text)
          setError({respondantRelationErr: ''})
        }
        }
      />
      <View>
        <PickerModal
          label="Select Gender"
          placeholder="Select gender"
          selectedValue={selGender}
          error={error.genderErr}
          data={gender}
          onValueChange={(itemValue, itemIndex) => {
            setSelGender(itemValue)
            setError({genderErr: ""})
          }}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Button
          labelButton={'Start Question'}
          onPress={() => handleSubmit()}
          isLoading={''}
          // style={{alignSelf: "flex-end",}}
        />
      </View>
    </ScrollView>
    )
  }

  const getIISCAParams = param => {
    // switch(param){
    //     case "behaviors":
    //     case "attachments":
    // }
    //
    const ans = studentQuestionare?.answers
    let queNo = 0
    console.log(studentQuestionare)
    switch (param) {
      case 'behaviors':
        return studentQuestionare.behaviors.edges
      case 'categories':
        queNo = 3
        break
      case 'reinforcers':
        queNo = 3
        break
      case 'situations':
        return studentQuestionare.situations.edges
      case 'activities':
        return studentQuestionare.activities.edges
      case 'antecedents':
        return studentQuestionare.antecedents.edges
      case 'consequences':
        return studentQuestionare.consequences.edges
      case 'distractions':
        return studentQuestionare.distractions.edges
      case 'communications':
        return studentQuestionare.communications.edges
      case 'reasons':
        return studentQuestionare.reasons.edges
      case 'triggers':
        return studentQuestionare.triggers.edges
      case 'reactions':
        return studentQuestionare.reactions.edges
      default:
        return null
    }
    if (ans) {
      const reqAns = ans.edges.find(({ node }) => {
        if (node.question.questionNo === queNo) {
          return node
        }
        return null
      })
      console.log(reqAns)
      switch (param) {
        case 'behaviors':
          return reqAns.node.behaviors.edges
        case 'categories':
          return reqAns.node.preferredCategories.edges
        case 'reinforcers':
          return reqAns.node.preferredCategories.edges
        default:
          return null
      }
    }
    console.log(studentQuestionare)
    return null
  }

  const updateMapping = async mapping => {
    console.log(mapping)
    // setCurrentMapping(mapping)
    if (mapping.preferredCategories) {
      setCurrentPreferredCategories(mapping.preferredCategories)
    }
    if (mapping.attached_behaviors) {
      setCurrentBehaviors(mapping.attached_behaviors)
    }

    if (mapping.reinforcersMap) {
      setCurrentReinforcers(mapping.reinforcersMap)
    }

    if (mapping.behaviorRanges) {
      setCurrentBehaviorRanges(mapping.behaviorRanges)
    }
    if (mapping.situationBehaviors) {
      setCurrentSituationBehaviors(mapping.situationBehaviors)
    }
    if (mapping.behaviorReasons) {
      setCurrentBehaviorReasons(mapping.behaviorReasons)
    }
    if (mapping.communicationMotives) {
      setCurrentCommunicationMotives(mapping.communicationMotives)
    }
    if (mapping.distractionsMap) {
      setCurrentDistractions(mapping.distractionsMap)
    }
    if (mapping.consequencesMap) {
      setCurrentConsequences(mapping.consequencesMap)
    }
    if (mapping.transitionTriggersMap) {
      setCurrentTransitionTriggers(mapping.transitionTriggersMap)
    }
    if (mapping.antecedentsMap) {
      setCurrentAntecedents(mapping.antecedentsMap)
    }
    if (mapping.activitiesMap) {
      setCurrentActivities(mapping.activitiesMap)
    }
    if (mapping.myways) {
      setCurrentMyways(mapping.myways)
    }
    if (mapping.clusters) {
      setCurrentClusters(mapping.clusters)
    }

    if (mapping.behaviors) {
      setBehaviors(mapping.behaviors)
    }
    if (mapping.situations) {
      setSituations(mapping.situations)
    }
    if (mapping.activities) {
      setActivities(mapping.activities)
    }
    if (mapping.antecedents) {
      setAntecedents(mapping.antecedents)
    }
    if (mapping.consequences) {
      setConsequences(mapping.consequences)
    }
    if (mapping.distractions) {
      setDistractions(mapping.distractions)
    }
    if (mapping.communications) {
      setCommunications(mapping.communications)
    }
    if (mapping.reasons) {
      setReasons(mapping.reasons)
    }
    if (mapping.triggers) {
      setTriggers(mapping.triggers)
    }
    if (mapping.reactions) {
      setReactions(mapping.reactions)
    }
    // saveAnswerForcefully(mapping.preferredCategories, mapping.behaviors)
  }

  const prev = () => {
    console.log("cureentQuestion in prev>>>",currentQuestionNo)
    const x = saveAnswer(
      null,
      currentQuestion.id,
      selStudent,
      editorContent,
      false,
      currentPreferredCategories,
      currentBehaviors,
      currentBehaviorRanges,
      currentSituationBehaviors,
    )    
    if (currentQuestionNo >= 1) setCurrentQuestionNo(currentQuestionNo - 1)
  }
  const next = () => {
    const x = saveAnswer(
      null,
      currentQuestion.id,
      selStudent,
      editorContent,
      false,
      currentPreferredCategories,
      currentBehaviors,
      currentBehaviorRanges,
      currentSituationBehaviors,
    )
    console.log("x>>>>",x);
    if (currentQuestionNo <= 19) setCurrentQuestionNo(currentQuestionNo + 1)
  }

  const saveAnswer = (
    id = null,
    question,
    student,
    text,
    boolean,
    preferredCategories = null,
    attached_behaviors = null,
    behaviorRanges = null,
    situationBehaviors = null,
    distr = null,
    communicationMotives = null,
    behaviorReasons = null,
    ants = null,
    consqs = null,
    reinforcers = null,
    transitionTriggers = null,
    acts = null,
    myways = null,
    clusters = null,
  ) => {
    console.log("currentAnswer>>",currentAnswer,questionareAns?.id)
    setIsLoading(true)
    try {
      const variables={
        id: currentAnswer ? currentAnswer?.id : id,
        question,
        student,
        text,
        boolean,
        questionare: questionareAns?.id,
        preferredCategories,
        behaviors: attached_behaviors,
        behaviorRanges,
        situationBehaviors,
        distractions: distr,
        communicationMotives,
        behaviorReasons,
        antecedents: ants,
        consequences: consqs,
        reinforcers,
        transitionTriggers,
        activities: acts,
        myways,
        clusters,
      }
      console.log("variables for save answer>>>",variables);
      TherapistRequest.saveAnswer(variables)
      .then(res=>{
        console.log(">>>>>>save",res);
    setIsLoading(false)

        
      })
      // console.log(answerMutation)
      // refetchAnswers()
      return true
    } catch (err) {
      console.log("cureent Questionare error",err)
      setIsLoading(false)
    return false

    }
  }
  // console.log("richText>>",RichText);
  
  const renderQuestionaire = () => {
    return (
      <>
      
     {/* <Questions iiscaId={iiscaId} /> */}
     <View>
     
     </View>
     {isLoading && <LoadingIndicator />}
     {currentQuestionNo!== 1 && !isLoading && <View>
       <View>
         <Text style={styles.question}>{currentQuestion?.questionNo}{'. '}{currentQuestion?.text}</Text>
         <Tools
        currentQuestionNo={currentQuestionNo}
        currentAnswer={currentAnswer}
        updateMapping={updateMapping}
        getIISCAParams={getIISCAParams}
        studentQuestionare={studentQuestionare}
        studentId={selStudent}
        program={program}
      />
         {/* <TextInput
        defaultValue={editorContent}
        onChangeText={(text) => {
          setEditorContent(text)
        }}
      /> */}
      <View style={{height:500}}>
      <RichEditor
        ref={RichText}
          initialContentHTML={editorContent}
          style={styles.richEditor}
          onChange={(text) => {
            setEditorContent(text)
          }}
          editorInitializedCallback={editorInitializedCallback}
          editorStyle={{
            cssText: 'body{font-size: 15px;height:100px}',
            
          }}
          placeholder={"Start Writing Here"}
        />
        {/* <RichToolbar
        getEditor={()=>RichText}
        style={[styles.richBar]}
        editor={RichText}
        disabled={false}
        iconTint={"black"}
        selectedIconTint={"grey"}
        disabledIconTint={"black"}
        iconSize={20}
        
      /> */}
        </View>
       </View>
     </View>
  }

          </>
    )
  }

  return (
    <View style={{flex: 1}}>
      {currentQuestionNo !== 1 && <View
            style={{
              flexDirection: 'row-reverse',
            }}>
              {currentQuestionNo === 20 ? <TouchableOpacity
              onPress={() => {
                setStep()
              }}
              >
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'check'}
                  style={{...styles.arrowButtonText,color:Color.primary}}
                />
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
              onPress={() => {
                next()
              }}
              >
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity> }
            {currentQuestionNo!==2 &&<TouchableOpacity
              onPress={() => {
                prev()
              }}
              >
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>}

            
          </View>}
      {props.student && !isQuestionaireVisible  && currentQuestionNo === 1 ? renderForm() : renderQuestionaire()}
    </View>
  );
};

ParentQuestionaire.propTypes = {
  student: PropTypes.object,
  selStudent: PropTypes.string
}

export default ParentQuestionaire;

const styles = StyleSheet.create({
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
  question: {
    fontSize: 16,
    textAlign: 'justify',
    fontWeight: '700',
    color: '#45494E',
  },
  richEditor: {
    borderWidth: 2,
    borderColor: Color.gray,
    borderRadius: 5,
    marginVertical: 0,
  },
  richBar: {
    height: 50,
    backgroundColor: "#F5FCFF",
  },
});
