

import React, { Component } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View, Image,Picker ,
  Text, TextInput, TouchableOpacity
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Select from 'react-select';

import CogniableSelectDropdown from '../../components/CogniableSelectDropdown';
import { client, createFood} from '../../constants/index';
import store from '../../redux/store';
class SaveMeal extends Component {
  constructor() {
    super();
    this.state = {
      dropdownData: [],
      mealTypes: [
        {id: "Breakfast1", name: "Breakfast"},
        {id: "Lunch1", name: "Lunch"},
        {id: "Dinner1", name: "Dinner"}],
      foodTypes: [
        {"id": "Rm9vZFR5cGVUeXBlOjE=","name": "Junk Food"},
        {"id": "Rm9vZFR5cGVUeXBlOjI=","name": "Balanced Meal"},
        {"id": "Rm9vZFR5cGVUeXBlOjM=","name": "Nutritional Snacks"}]
    };
  }
  
  render() {
    return (
      <View style={{padding: 10}}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.backIcon}>
            <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
            </Text>
            <Text style={styles.headerTitle}>Meal Data</Text>
            <Text style={styles.rightIcon}>
            <FontAwesome5 name={'search'} style={styles.backIconText}/>
            </Text>
        </View>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          
          <Text style={{ marginTop: 30}}>Meal</Text>
          <CogniableSelectDropdown data={this.state.mealTypes} selectedLabel="Select Meal"/>
          
          <Text style={{ marginTop: 30}}>Food Type</Text>
          <CogniableSelectDropdown data={this.state.foodTypes} selectedLabel="Select Food Type"/>
          
          <Text style={{marginTop: 10 }}>Meal Details</Text>
          <TextInput
            style={styles.TextInputStyleClass}
            underlineColorAndroid="transparent"
            placeholder={"What did Kunal eat ?"}
            placeholderTextColor={"#9E9E9E"}
            numberOfLines={10}
          />
          
          <View style={styles.continueView}>
            <ApolloProvider client={client}>
              <Mutation mutation={createFood}>
                {(saveFood, { data }) => (
                <TouchableOpacity style={styles.continueViewTouchable} activeOpacity={.5} onPress={
                  () => {
                      let queryParams = {
                          studentId: store.getState().studentId,
                          date: "2020-04-06",
                          mealName: "Chapati",
                          mealTime: "11 AM",
                          note: "Test Note",
                          mealType: "Dinner",
                          waterIntake: "100 ml",
                          foodType: "Rm9vZFR5cGVUeXBlOjE="
                      };
                      saveFood({variables: queryParams})
                      .then(response => {
                          return response.data;
                      })
                      .then(data => {
                          console.log("AddNewMeal:"+JSON.stringify(data));
                      })
                      .catch(err => {
                          console.log('saveFood -> err', JSON.stringify(err));
                      });
                  }}>
                    <Text style={styles.continueViewText}>Save Meal</Text>
                  </TouchableOpacity>
                )}
              </Mutation>
            </ApolloProvider>
          </View>
        </ScrollView>
        
      </View>
    )
  }
};




const styles = StyleSheet.create({
 
  header: {
        flexDirection: 'row',
        height: 50,
        width: '100%'
    },
    scrollView: {
      // height: '100%',
      marginBottom: 50
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
        width: '80%',
        fontSize: 22,
        paddingTop: 10,
        color: '#45494E'
    },
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        // marginRight: 10
    },
    TextInputStyleClass: {
      borderWidth: 1,
      borderColor: '#bbb',
      borderRadius: 10,
      backgroundColor: "#FFFFFF",
      height: 110,
      textAlignVertical: 'top'
    },
    continueViewTouchable:{
        marginTop:28,
        paddingTop:10,
        paddingBottom:10,
        marginLeft:12,
        marginRight:12,
        marginBottom:15,
        backgroundColor:'#1E90FF',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    continueView:{  
        width:'100%',    
    },
    continueViewText:{
        color:'#fff',
        fontSize: 20,
        textAlign:'center',
    }

});
export default SaveMeal;



