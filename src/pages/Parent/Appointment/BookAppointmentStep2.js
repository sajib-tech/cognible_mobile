import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView, 
    Container,
    StyleSheet,
    ScrollView, ActivityIndicator,
    View, Image,
    Text, Linking, TextInput, TouchableOpacity, FlatList, Pressable

} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import NavigationHeader from '../../../components/NavigationHeader'
import CalendarView from '../../../components/CalendarView'
import DateHelper from '../../../helpers/DateHelper'
import Button from '../../../components/Button'
import LoadingIndicator from '../../../components/LoadingIndicator'


const GET_SLOT = gql`
query($id: ID!, $form: Date, $to: Date ){
  getAppointmentSlots(therapist:$id, start:$form, end:$to){
      staff{
          id
      }
      data{
          date
          slots{
              time
              isAvailable
          }
      }
  }
}
`



function BookAppointmentStep2({route, navigation}) {
  const { therapistId, therapistName } = route.params;
  const [weekDates, setWeekDates] = useState(DateHelper.getCurrentWeekDates())
  const [selectedDate, setSelectedDate] = useState(DateHelper.getTodayDate().toString())
  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(null)


  const { data: slotListData, loading: slotListLoading, error, refetch } = useQuery(GET_SLOT, {
    variables: {
      id: therapistId,
      form:  `${selectedDate}`,
      to: `${selectedDate}`,
    },
  })

  const callBackFromCalendar = (selectedDate) => {
    console.log('step2',selectedDate);
    setSelectedDate(selectedDate)
    // refetch()
}

if(slotListLoading){
  return <LoadingIndicator />
}

console.log('slotListData', JSON.parse(JSON.stringify(slotListData.getAppointmentSlots[0].data[0].slots)))
console.log('selectedDate', selectedDate.toString())
const slotArray = slotListData.getAppointmentSlots[0].data[0].slots
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {<NavigationHeader
      backPress={() => navigation.goBack()}
      title="Choose Slot"
      />}
      <View style={{margin: 15, marginBottom: 0}}>
        <CalendarView dates={weekDates} parentCallback={callBackFromCalendar} />
        </View>
      <ScrollView>
        <View style={{ alignItems: 'center', marginTop: 20}}>
        <FlatList
        data={slotArray}
        extraData={time}
        renderItem={(item) => {
          console.log('ite', item)
          return(
            <View>
            <Pressable
            disabled={item?.item.isAvailable === true ? false : true}
            onPress={() => {
             setTime(item?.item.time)
            }}
            style={
                  (item?.item.time === time) ? {
                    backgroundColor: '#0800FF',
                    borderWidth: 2,
                    width: 100,
                    height: 50,
                    padding: 18,
                    margin: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                  } : {
                    borderColor: '#0800FF',
                    borderWidth: 2,
                    width: 100,
                    height: 50,
                    padding: 20,
                    margin: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
              }
            >
            <Text style={(item?.item.time === time)? {color: 'white', fontWeight: 'bold'} : {color: '#0800FF' }}>{item?.item.time}</Text>
            </Pressable>
            </View>
          ) 
        }}
        keyExtractor={item => item.id}
        numColumns={3}
      />
      </View>
      </ScrollView>
      
      {time!== null && (
        <View style={{margin: 5}}>
        <Button
              labelButton="Next"
              onPress={()=> navigation.navigate('BookAppointmentStep3', {
                selectedTime: time,
                SelectedTherapistName: therapistName,
                selectedDate,
                therapistId
              })}
        />
        </View>
      )}
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6
  },
  item: {
    width: '50%'
  }
})

export default BookAppointmentStep2
