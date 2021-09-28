import React,{useState} from 'react'
import {
  Alert,
  Dimensions,
  SafeAreaView, 
  Container,
  StyleSheet,
  ScrollView, ActivityIndicator,
  View, Image,
  Text, Linking, TouchableOpacity, FlatList

} from 'react-native';
import NavigationHeader from '../../../components/NavigationHeader'
import TextInput from '../../../components/TextInput'
import Button from '../../../components/Button'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import moment from 'moment'

const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $title: String!
    $studentId: ID!
    $therapistId: ID!
    $note: String
    $purposeAssignment: String!
    $startDateAndTime: DateTime!
    $endDateAndTime: DateTime!
  ) {
    CreateAppointment(
      input: {
        appointment: {
          title: $title
          student: $studentId
          therapist: $therapistId
          note: $note
          purposeAssignment: $purposeAssignment
          start: $startDateAndTime
          end: $endDateAndTime
        }
      }
    ) {
      appointment {
        id
        therapist {
          id
          name
          surname
        }
        student {
          id
          firstname
          lastname
        }
        attendee {
          edges {
            node {
              id
              name
              surname
            }
          }
        }
        createdBy {
          id
          firstName
          lastName
        }
        appointmentStatus {
          id
          appointmentStatus
        }
        location {
          id
          location
        }
        purposeAssignment
        note
        title
        start
        end
        isApproved
      }
    }
  }
`

function combineDateAndTime(date, time) {
  const dateText = moment(date)
    .local()
    .utc()
    .format('YYYY-MM-DD')
  const timeText = moment(time)
    .local()
    .utc()
    .format('HH:mm:ssZ')
  return `${dateText}T${timeText}`
}

function dateTimeToDate(dateTime) {
  return moment(dateTime)
    .local()
    .utc()
    .format('YYYY-MM-DD')
}

function timeToUtc(time) {
  return moment(time)
    .local()
    .utc()
    .format('hh:mm a')
}

const BookAppointmentStep3 = ({route, navigation}) => {
  const { selectedTime, SelectedTherapistName, selectedDate, therapistId } = route.params;
  const [title, setTitle] = useState(' ')
  const [purpose, setPurpose] = useState(' ')
  const [note, setNote] = useState(' ')
  const [
    createAppointment,
    {
      data: createAppointmentData,
      error: createAppointmentError,
      loading: isCreateAppointmentLoading,
    },
  ] = useMutation(CREATE_APPOINTMENT)

  

  const studentID = useSelector(state => state.studentId)
  
  const submitAppointment = () => {
    if(!createAppointmentError){
      createAppointment({
        variables: {
          therapistId: therapistId,
          studentId: studentID, 
          title: title,
          purposeAssignment: purpose,
          note: note,
          startDateAndTime: combineDateAndTime(selectedDate, selectedTime),
          endDateAndTime: combineDateAndTime(
              selectedDate,
              selectedTime,
            ),
          
        },
      })
    }
    Alert.alert("Success", "Appointment created successfully, we will get back to you soon")
    navigation.pop(3)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {<NavigationHeader
      backPress={() => navigation.goBack()}
      title="Book Appointment"
      />}
    <ScrollView>
    <View style={{margin: 20}}>
        <View>
          <Text style={styles.heading}>Therapist: {SelectedTherapistName} </Text>
          <Text style={styles.heading}>Date: {selectedDate}</Text>
          <Text style={styles.heading}>Time: {selectedTime}</Text>
        </View>
        <View>
          <TextInput
          label="Title"
          placeholder={'Title'}
          onChangeText={(value) => {
            setTitle(value)
          }}
          />
          <TextInput
          label="Purpose"
          placeholder={'Purpose'}
          onChangeText={(value) => {
            setPurpose(value)
          }}
          />
          <TextInput
          label="Note"
          placeholder={'Note'}
          onChangeText={(value) => {
            setNote(value)
          }}
          />
        </View>
        </View>
    </ScrollView>
    <View style={{margin: 10}}>
    <Button
      labelButton="Book Appointment"
      onPress={() => submitAppointment()}
    />
    </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    paddingBottom: 5
  }
})


export default BookAppointmentStep3
