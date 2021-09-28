import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Appointment from './Appointment'
import BookAppointmentStep2 from './BookAppointmentStep2'
import BookAppointmentStep3 from './BookAppointmentStep3'

const BookParentAppointmentStack = () => {
  const Stack = createStackNavigator()
  return(
      <Stack.Navigator initialRouteName={Appointment} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Appointment" component={Appointment} />
          <Stack.Screen name="BookAppointmentStep2" component={BookAppointmentStep2} />
          <Stack.Screen name="BookAppointmentStep3" component={BookAppointmentStep3} />
      </Stack.Navigator>
  )
}

export default BookParentAppointmentStack