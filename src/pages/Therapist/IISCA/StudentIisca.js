import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from 'react-apollo';
import {useSelector, useDispatch} from 'react-redux';

import NavigationHeader from '../../../components/NavigationHeader';
import TextInput from '../../../components/TextInput';
import DateInput from '../../../components/DateInput.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import TherapistRequest from '../../../constants/TherapistRequest';

import Color from '../../../utility/Color';
import Styles from '../../../utility/Style.js';

import {GET_QUESTIONARE} from './Query';

import ParentQuestionaire from './ParentQuestionaire';
import Interventionplan from './Interventionplan';
import Revision from './Revision';
import TaskAnalysis from './TaskAnalysis';
import DataTaking from './DataTaking';

import actions from '../../../redux/sagas/iisca/iisca.actions';

// step indicator config

const labels = [
  'Parent Questionaire',
  'Task Analysis',
  'Data Taking',
  'Intervention Plan',
];

const indicatorStyles = {
  stepStrokeCurrentColor: Color.primary,
  stepStrokeUnFinishedColor: Color.white,
  stepIndicatorUnFinishedColor: Color.grayWhite,
  stepStrokeCurrentColor: Color.primary,
  separatorUnFinishedColor: Color.grayWhite,
  stepIndicatorFinishedColor: Color.primary,
  separatorFinishedColor: Color.primary,
  currentStepLabelColor: Color.primary,
  labelColor: Color.gray,
};

const StudentIisca = (props) => {
  const {student,iiscaId,program} = props.route.params;
  const navigation = useNavigation();
  console.log("iiscaId>>>",program);

  // states
  const [currentPos, setCurrentPos] = useState(0);
  const [selStudent, setSelStudent] = useState(student.node.id);
  const [parentStudentQuestionare, setParentStudentQuestionare] = useState()
  const [title,setTitle]=useState('')
  const [isTimer,setIsTimer]=useState(false)

  const userType = useSelector((state) => state.user.userType);
  const isLoading = useSelector((state) => state.iisca.loading);

  const dispatch = useDispatch();

  console.log('student id', student);

  useEffect(() => {
    dispatch({
      type: actions.LOAD_DATA,
    });
    getIISCAParams()
  }, []);

  useEffect(() => {
    dispatch({
      type: actions.LOAD_QUESTION_1_DATA,
      payload: {
        id: 'UXVlc3Rpb25hcmVUeXBlOjE=',
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: actions.LOAD_QUESTION_2_DATA,
      payload: {
        id: 'UXVlc3Rpb25hcmVUeXBlOjI=',
      },
    });
  }, []);

  const getIISCAParams=()=>{
    const variables = {
      studentId: selStudent,
    };
    TherapistRequest.getIISCAPrograms(variables)
      .then((res) => {
        if(res.data.IISCAPrograms){
        console.log('response*********>>', res.data.IISCAPrograms.edges);
          const name=res.data.IISCAPrograms.edges.find(({node})=>node.id===iiscaId)
          setTitle(name?.node?.title)
          console.log("name>>>",name.node);
        }
        setIiscaProgram(res.data.IISCAPrograms.edges);
      })
      .catch((err) => {
      });
  }
  /*
  .########..########.##....##.########..########.########.
  .##.....##.##.......###...##.##.....##.##.......##.....##
  .##.....##.##.......####..##.##.....##.##.......##.....##
  .########..######...##.##.##.##.....##.######...########.
  .##...##...##.......##..####.##.....##.##.......##...##..
  .##....##..##.......##...###.##.....##.##.......##....##.
  .##.....##.########.##....##.########..########.##.....##
  */

  const renderParentQuestioner = () => {
    return (
      <ParentQuestionaire student={student?.node} selStudent={selStudent} iiscaId={iiscaId} setStep={()=>setCurrentPos(pos=>pos+1)} program={program} 
      onChangeParent={data => setParentStudentQuestionare(data)}
      />
    );
  };

  const renderTaskAnalysis = () => {
    return <TaskAnalysis student={student?.node} selStudent={selStudent} iiscaId={iiscaId} setStep={()=>setCurrentPos(pos=>pos+1)} program={program}  
    parentStudentQuestionare={parentStudentQuestionare}
    />;
  };

  const renderDataTaking = () => {
    return <DataTaking studentId={selStudent} currentPos={currentPos} setTimer={(val)=>setIsTimer(val)}/>;
  };

  const renderInterventionPlan = () => {
    return <Interventionplan />;
  };

  const renderRevision = () => {
    return <Revision />;
  };

  console.log("currentPosition>>>",currentPos);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        backPress={() => navigation.goBack()}
        // dotsPress={() => this.setState({ modalShow: true })}
        title={`${student.node.firstname}'s ${title} IISCA`}
      />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
        <View style={{marginTop:10}}>
          <View style={{
            flexDirection:'row-reverse',
            marginBottom:10
            
          }}>
            {currentPos !== 3 && <Button style={{...styles.button,backgroundColor: isTimer ? 'grey' : Color.primary}}  disabled={isTimer} onPress={()=>setCurrentPos(pos=>pos+1)} labelButton="Next step" /> }
           {currentPos !== 0 && <Button style={{...styles.button,backgroundColor: isTimer ? 'grey' : Color.primary}}  disabled={isTimer} onPress={()=>setCurrentPos(pos=>pos-1)} labelButton="Prev step" /> }
          </View>
          <StepIndicator
            customStyles={indicatorStyles}
            currentPosition={currentPos}
            labels={labels}
            stepCount={4}
          />
          </View>

          <View style={[styles.container, {padding: 10}]}>
            {currentPos === 0
              ? renderParentQuestioner()
              : currentPos === 1
              ? renderTaskAnalysis()
              : currentPos === 2
              ? renderDataTaking()
              : renderInterventionPlan()
              }
          </View>
          </>
      )}
    </SafeAreaView>
  );
};

export default StudentIisca;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  button:{
    color:'#fff',
    width:'20%',
    height:'100%',
    marginRight:5,
    paddingVertical:2,
    paddingBottom:2,
  }
});
