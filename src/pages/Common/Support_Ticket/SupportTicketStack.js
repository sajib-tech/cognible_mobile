import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SupportTicket from './SupportTicket'
import AddSupportTicket from './AddSupportTicket'
import ViewSupportTicket from './ViewSupportTicket'
import EditSupportTicket from './EditSupportTicket'

const SupportTicketStack = () => {
    const Stack = createStackNavigator()
    return(
        <Stack.Navigator initialRouteName={SupportTicket} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SupportTicket" component={SupportTicket} />
            <Stack.Screen name="ViewSupportTicket" component={ViewSupportTicket} />
            <Stack.Screen name="EditSupportTicket" component={EditSupportTicket} />
        </Stack.Navigator>
    )
}

export default SupportTicketStack