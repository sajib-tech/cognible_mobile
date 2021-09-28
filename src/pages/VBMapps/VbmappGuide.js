import React, {Component} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text, Button,
//   StatusBar,
// } from 'react-native';



import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Material from './Material'
import Example from './Example'
import Objective from './Objective'

// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import TherapyListItem from '../../components/TherapyListItem';
// // import HomeScreen from "../../src/pages/HomeScreen";
// import HomeScreen from "./HomeScreen";
// import SigninScreen from "./SigninScreen";
// import TherapyProgramScreen  from "../pages/therapy/TherapyProgramScreen";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VbmappToc from '../../components/vbmapps/VbmappToc';
const Tab = createBottomTabNavigator();
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selectedColor:'#FF9C52'
        }
      }
    render() {
		return (
            <Tab.Navigator 
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  if (route.name === 'Material') {
                    iconName = 'heart-outline';
                  } else if (route.name === 'Example') {
                    iconName = 'book-open-outline';
                  } else if (route.name === 'Objective') {
                    iconName = 'calendar-blank';
                  } 
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      color={color}
                      size={24}
                    />
                  );
                },
              })}>
                <Tab.Screen name="Material" 
                children={()=><Material prop={this.props} goBack={()=>this.props.navigation.goBack()}/>}
                 />
                <Tab.Screen name="Example" children={()=><Example prop={this.props} goBack={()=>this.props.navigation.goBack()} />} />
                <Tab.Screen name="Objective" children={()=><Objective prop={this.props} goBack={()=>this.props.navigation.goBack()}/>} />

                {/* <Tab.Screen name="Calendar" component={HomeScreen} />
                <Tab.Screen name="Profile" component={HomeScreen} /> */}
            </Tab.Navigator>
        )
    }
}
export default Home;