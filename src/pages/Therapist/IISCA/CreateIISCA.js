import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import NavigationHeader from '../../../components/NavigationHeader';
import {getStr} from '../../../../locales/Locale';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateInput from '../../../components/DateInput.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import moment from 'moment';
import NoData from '../../../components/NoData';

import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../../utility/Color';
import LoadingIndicator from '../../../components/LoadingIndicator';

const CreateIISCA = (props) => {
  console.log('props>>', props);
  const [student, setStudent] = useState(props.route.params.student);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [titleError,setTitleError]=useState('')
  const [title,setTitle]=useState()
  const [note,setNotes]=useState('')

  const handleNewAssessment=()=>{
console.log("handle new>>>>>>");
    if(!title){
        setTitleError('Assessment Title is Required')
        return
    }
    else{
        setTitleError('')
        const variables={
            studentId:student.node.id,
            title,
            note,
            date
        }
        console.log("variables>>>>",variables);
        TherapistRequest.createIISCAProgram(variables)
        .then(res=>{
            console.log("response>>>",res.data);
            Alert.alert(
				title,
				'Successfully Saved',
				[{
					text: 'OK', onPress: () => {
						console.log('OK Pressed');
						
							props.navigation.goBack();
                            props.route.params.getData()
						
					}
				}],
			);
        })

    }

  }

  
  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        title={`New IISCA Assessment`}
        backPress={() => props.navigation.goBack()}
      />
      <Container>
        
      <ScrollView>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.legend}>Assessment Title</Text>
                {titleError != '' && <Text style={{ color: Color.danger }}>{titleError}</Text>}
                
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text)=>setTitle(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <DateInput
          label="Date"
          //error={this.state.dateErrorMessage}
          format="YYYY-MM-DD"
          displayFormat="dddd, DD MMM YYYY"
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
        />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.legend}>Notes</Text>
                <TextInput
                  style={{...styles.textInput,height:60}}
                  numberOfLines={10}
                  onChangeText={(text)=>setNotes(text)}

                />
              </View>
              
              <TouchableOpacity onPress={()=>handleNewAssessment()}  style={styles.buttonFilled}>
                <Text style={styles.buttonText}>Create Assessment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </Container>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  formContainer: {
    marginTop:30
  },
  inputContainer: {
    marginVertical:10
  },
  legend: {
    fontSize:16,
    fontWeight:'700'
  },
  textInput: {
    borderWidth:1,
    borderColor:'#D5D5D5',
    borderRadius:10,
    height:40,
    paddingLeft:10
  },
  buttonFilled: {
    marginTop:20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3E7BFA',
    marginBottom: 40
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetPeakPrograms: (data) => dispatch(setPeakPrograms(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateIISCA);
