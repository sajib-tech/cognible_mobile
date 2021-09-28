import React, {useEffect, useState} from 'react';
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
import {RichEditor} from 'react-native-pell-rich-editor';
import LoadingIndicator from '../../../components/LoadingIndicator.js';



import actions from '../../../redux/sagas/iisca/iisca.actions'

import Questions from './Questions'
import { getAssessmentDetails } from '../../../constants/parent';

const TaskAnalysis = (props) => {
  const { parentStudentQuestionare } = props

  const [gender, setGender] = useState([
    {id: 0, label: 'Male'},
    {id: 1, label: 'Female'},
  ]);
  const {iiscaId,selStudent,setStep,program} = props
  const [name, setName] = useState(props?.student?.firstname)
  const [date, setDate] = useState(new Date())
  const [respondant, setRespondant] = useState("")
  const [respondantRelation, setRespondantRelation] = useState("")
  const [selGender, setSelGender] = useState('')
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState({
    nameErr: '',
    respondantErr: '',
    respondantRelationErr: '',
    genderErr: ''
  })
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
  const [isLoading,setIsLoading]=useState(false)

  // answer states
  const [parentQuestionare, setParentQuestionare] = useState(null)

  //
  const [currentConditions, setCurrentConditions] = useState(null)
  const [currentWhoWhereMaterials, setCurrentWhoWhereMaterials] = useState(null)

  const dispatch = useDispatch()

  useEffect(()=>{

    getQuestionare()
    getQuestionareAnswer()

  },[])

  useEffect(() => {
    setParentQuestionare(parentStudentQuestionare)
    console.log(parentStudentQuestionare)
  }, [parentStudentQuestionare])
  


  const getQuestionare=()=>{

    const variable={
      name: 'task_analysis',
    }
    TherapistRequest.getQuestionareByName(variable)
    .then(res=>{
      console.log("resParent>>>",res.data.getQuestionareByName);
      setQuestionare(res.data.getQuestionareByName)
      setQuestionList(res.data.getQuestionareByName.questions.edges)
      setCurrentQuestionNo(1)
    })

  }

  

  const getQuestionareAnswer=()=>{
    const variable={
      iisca: iiscaId,
      name: 'task_analysis',
    }
    TherapistRequest.getQuestionareAnswer(variable)
    .then(res=>{
      console.log("resAnswer>>>>>>",res.data,iiscaId);
      setStudentQuestionare(res.data.getQuestionareAnswers)

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
      else{
        Alert.alert(
          'Error!',
          'Unable to save ans',
          [{
            text: 'OK', onPress: () => {
              console.log('OK Pressed');              
              setIsLoading(false)
              getQuestionare()

            }
          }],
        );
      }
     
    })
  }

  //   currentQuestionNo Change
  useEffect(() => {
    if (currentQuestionNo) {
      getQuestionareAnswer()

      // console.log("questionList>>>>",questionList)
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

  console.log("currentQuestionNo>>>",currentQuestionNo);

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
    if (mapping.conditions) {
      setCurrentConditions(mapping.conditions)
    }

    if (mapping.whoWhereMaterials) {
      setCurrentWhoWhereMaterials(mapping.whoWhereMaterials)
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
      currentConditions,
      currentWhoWhereMaterials,
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
      currentConditions,
      currentWhoWhereMaterials,
    )
    console.log("x>>>>",x);
    if (currentQuestionNo <= 7) setCurrentQuestionNo(currentQuestionNo + 1)
  }

  const saveAnswer = (
    id = null,
    question,
    student,
    text,
    boolean,
    reinforcerTasks,
    whoWhereMaterials,
  ) => {

    console.log("currentAnswer>>",currentAnswer,studentQuestionare?.id)
    try {
    setIsLoading(true)

      const variables={
        id: currentAnswer ? currentAnswer?.id : id,
        question,
          student,
          text,
          boolean,
          questionare: studentQuestionare?.id,
          reinforcerTasks,
          whoWhereMaterials,
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
      setIsLoading(false)

      console.log("cureent Questionare error",err)
    return false

    }
  }
console.log("editor Content>>>",editorContent);
  const renderQuestionaire = () => {
    return (
      <>
      
     {/* <Questions iiscaId={iiscaId} /> */}
     <View>
     
     </View>
     {isLoading && <LoadingIndicator />}
      {!isLoading && 
     <View>
       <View>
         <Text style={styles.question}>{currentQuestion?.questionNo}{'. '}{currentQuestion?.text}</Text>
         {/* <Tools
        currentQuestionNo={currentQuestionNo}
        currentAnswer={currentAnswer}
        updateMapping={updateMapping}
        getIISCAParams={getIISCAParams}
        studentQuestionare={studentQuestionare}
        studentId={selStudent}
        program={program}
      /> */}
         {/* <TextInput
        defaultValue={editorContent}
        onChangeText={(text) => {
          setEditorContent(text)
        }}
      /> */}
      <RichEditor
          initialContentHTML={editorContent}
          style={styles.richEditor}
          onChange={(text) => {
            setEditorContent(text)
          }}
          editorStyle={{
            cssText: 'body{font-size: 13px;height:100px}',
          }}
        />
       </View>
     </View>
  }

          </>
    )
  }

  return (
    <View style={{flex: 1}}>
      <View
            style={{
              flexDirection: 'row-reverse',
            }}>
              {currentQuestionNo === 8 ? <TouchableOpacity
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
            {currentQuestionNo!==1 &&<TouchableOpacity
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

            
          </View>
      { renderQuestionaire()}
    </View>
  );
};




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
    marginVertical: 5,
  },
});

export default TaskAnalysis;
