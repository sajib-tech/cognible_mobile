
import React, { useState } from "react";

import { Overlay } from 'react-native-elements';
// import "./App.css";
import { useQuery } from '@apollo/react-hooks';
import { client, getFoodData} from '../constants';
import BehaviourDecelMealCard from '../components/BehaviourDecelMealCard'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ApolloProvider, Mutation } from 'react-apollo';
import DateHelper from '../helpers/DateHelper';
import CalendarView from '../components/CalendarView';
import {
  SafeAreaView,
  StyleSheet,Dimensions,
  ScrollView,
  View,TextInput,ActivityIndicator,
  Text, Button,TouchableOpacity,
  StatusBar,
} from 'react-native';
function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <View
      className="todo"
      style={{flexDirection: 'row', padding: 10 }}
    >
      <Text style={{color: todo.isCompleted ? "red" : ""}}>{todo.text}</Text>

      <View style={{flexDirection: 'row'}}>
      <TouchableOpacity	 activeOpacity={ .5 } onPress={ ()=> { completeTodo(index); } }>
           
         <Text style={{color:'blue', marginLeft: 10}}>Complete</Text>
       </TouchableOpacity>
       <TouchableOpacity	 activeOpacity={ .5 } onPress={ ()=> { removeTodo(index); } }>
           
         <Text style={{color:'blue', marginLeft: 10}}>X</Text>
       </TouchableOpacity>
      </View>
    </View>
  );
}
function MealItems(props, data) {
  console.log(props)
  console.log("data1---------------------------------------",JSON.stringify(props.data))
  let dataArray = props.data.getFood.edges;
  
  // return (
  //   <Text>Hello</Text>
  // )
  let mealList = dataArray.map(element => {
      if(element){
      // console.log("element:",JSON.stringify(element.node.id))
      return <BehaviourDecelMealCard 
          mealType={element.node.mealType}
          mealName={element.node.mealName}
          waterIntake={(element.node.waterIntake != null) ? element.node.waterIntake : ""}
          mealTime={element.node.mealTime}
          foodType={(element.node.foodType != null) ? element.node.foodType.name : ""}/>
      }
  })
  return mealList;
}
function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");
  const [name, setName] = useState('Sohad');
  console.log(typeof value)
  console.log(JSON.stringify(value))
  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };
  function handleNameChange(e) {
    console.log(e.target.value)
    setValue(e.target.value)
  }
  return (
    <View>
    <TextInput placeholder="Email" value={value} 
      onChangeText={(value) => {
        setValue(value )
        console.log(value)
      }}/>
      <TouchableOpacity	 activeOpacity={ .5 } onPress={ ()=> { 
          addTodo(value);
          setValue("")
        }}>
           
        <Text style={{color:'blue', marginLeft: 10, borderWidth: 1, borderColor: 'blue'}}> Save</Text>
       </TouchableOpacity>
    {/* <TextInput
        type="text"
        className="input"
        placeholder="Enter todo"
        value={value}
        onChange={handleNameChange}
      /> */}
    </View>
  );
}

const TodoApp = (props) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [selectedDate, setSelectedDate] = useState(DateHelper.getTodayDate());
  const [weeks, setWeeks] = useState(DateHelper.getCurrentWeekDates())
  const [showLoading , setShowLoading] = useState(true);
  // const [list, setList] = useState([]);
  const { loading, error, data, refetch } = useQuery(getFoodData, { 
          client,
          variables: {
              date: selectedDate
          }
  });
  if(loading){
  } else if(error) {
    console.log("error:"+JSON.stringify(error))
  } else {
    console.log("new Data came: "+JSON.stringify(data))
  }
  let mealList = [];
  if(data){
    let dataArray = data.getFood.edges;
    console.log("data1",dataArray.length)
    mealList = dataArray.map((element, index) => {
        if(element){
          return <BehaviourDecelMealCard 
            key={index}
            mealDate={element.node.date}
            mealType={element.node.mealType}
            mealName={element.node.mealName}
            waterIntake={(element.node.waterIntake != null) ? element.node.waterIntake : ""}
            mealTime={element.node.mealTime}
            foodType={(element.node.foodType != null) ? element.node.foodType.name : ""}/>
        }
    })
  }
  const callBackFromCalendar = (selectedDate) => {
    console.log("selectedDate:"+selectedDate);
    setSelectedDate("2020-04-"+selectedDate);
    refetch;
  }
  return (
    <View>
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
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <CalendarView dates={weeks} parentCallback={callBackFromCalendar}/>
          {mealList}
        </ScrollView>
      </SafeAreaView>
    </View>
  )

}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#ecf0f1',
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
        paddingTop: 15,
        paddingLeft: 15
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

    //
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
        // position: 'absolute',
        marginBottom: 100
    
    },
    continueViewText:{
        color:'#fff',
        fontSize: 20,
        textAlign:'center',
    }
});
export default TodoApp;