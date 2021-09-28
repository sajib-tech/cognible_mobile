import React, {Component} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text, Button,
//   StatusBar,
// } from 'react-native';




// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import TherapyListItem from '../../components/TherapyListItem';
// // import HomeScreen from "../../src/pages/HomeScreen";
import HomeScreen from "./HomeScreen";
import SigninScreen from "./SigninScreen";
import TherapyProgramScreen  from "../pages/therapy/TherapyProgramScreen";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
class Home extends Component {
    render() {
		return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Therapy" component={TherapyProgramScreen} />
                <Tab.Screen name="Calendar" component={HomeScreen} />
                <Tab.Screen name="Profile" component={HomeScreen} />
            </Tab.Navigator>
        )
    }
}
export default Home;