/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text, Button,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GoalView from '../../components/GoalView';
class TherapyAssessmentScreen extends Component {
	constructor(props) {
		super(props);
		//console.log("props=", props);
    
	}
	getGoalViewData() {
    let data = [
        {title: "Identifying body parts", viewCount: "4", descr: StudentHelper.getStudentName()+'{child_name} constantly requests Orange Juice during sessions. This appears to be their most preferred item and should only be used during programs they are having most difficulty with.'},
        {title: "Algebra", viewCount: "8", descr: '{child_name} constantly requests Orange Juice during sessions. This appears to be their most preferred item and should only be used during programs they are having most difficulty with.'},
        {title: "Identifying body parts", viewCount: "4", descr: '{child_name} constantly requests Orange Juice during sessions. This appears to be their most preferred item and should only be used during programs they are having most difficulty with.'},
        {title: "Identifying body parts", viewCount: "4", descr: '{child_name} constantly requests Orange Juice during sessions. This appears to be their most preferred item and should only be used during programs they are having most difficulty with.'}
    ];
    return data;
  }
	render() {
		return (
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.wrapper}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.backIcon}>
                                <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
                            </Text>
                            <Text style={styles.headerTitle}>Long Term Goals</Text>
                            <Text style={styles.rightIcon}>
                                <FontAwesome5 name={'search'} style={styles.backIconText}/>
                            </Text>
                        </View>
                        <GoalView title={this.getGoalViewData()[0].title} viewCount={this.getGoalViewData()[0].viewCount} description={this.getGoalViewData()[0].descr} colorType="positive" />
                        <GoalView title={this.getGoalViewData()[1].title} viewCount={this.getGoalViewData()[1].viewCount} description={this.getGoalViewData()[1].descr} colorType="negative" />
                        <GoalView title={this.getGoalViewData()[2].title} viewCount={this.getGoalViewData()[2].viewCount} description={this.getGoalViewData()[2].descr} colorType="neutral" />
                        <GoalView title={this.getGoalViewData()[3].title} viewCount={this.getGoalViewData()[3].viewCount} description={this.getGoalViewData()[3].descr} colorType="positive" />
                    </View>
                </ScrollView>
            </SafeAreaView>
		);
	}
	
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,    
    backgroundColor: '#FFFFFF',
    padding: 10
  },
  header: {
    flexDirection: 'row',
    height: 50,    
    width: '100%'
  },
  backIcon: {
    fontSize: 50, 
    fontWeight: 'normal', 
    color: '#fff',
    width: '10%',
    paddingTop: 15
  },
  backIconText: {
    fontSize: 20, 
    fontWeight: 'normal', 
    color: '#63686E'
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E'
  },
  rightIcon: {
    fontSize: 50, 
    fontWeight: 'normal', 
    color: '#fff',
    width: '10%',
    paddingTop: 15
  }
});

export default TherapyAssessmentScreen;
