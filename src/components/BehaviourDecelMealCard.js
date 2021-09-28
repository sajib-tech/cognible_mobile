import React, {Component} from 'react';

import {View, Text, FlatList, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class BehaviourDecelMealCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mealType: props.mealType,
            mealName: props.mealName,
            waterIntake: props.waterIntake,
            mealDate: props.mealDate,
            mealTime: props.mealTime,
            foodType: props.foodType
        };
    }
    render() {
        let {foodType} = this.state;
        let rstyle = '';
        if(foodType && foodType==='Junk Food') {
            rstyle = eval('styles.junkFood');
        } else if(foodType && foodType==='Balanced Meal') {
            rstyle = eval('styles.balancedMeal');
        } else if(foodType && foodType==='Nutritional Snacks') {
            rstyle = eval('styles.nutritionalSnacks');
        }
        return (
            <View style={styles.card}>
                <Text style={styles.title}>{this.state.mealType}</Text>
                <Text style={styles.mealName}>{this.state.mealName}</Text>
                <Text style={styles.waterIntake}>{this.state.waterIntake}</Text>
                <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <Text style={{color: '#63686E', fontSize: 13, fontWeight: '500'}}>
                    {this.state.mealDate} - {this.state.mealTime}</Text>
                    <Text style={{top: -7, paddingLeft: 10, color: '#C4C4C4', fontSize: 18, fontWeight: '700'}}>.</Text>
                    <Text style={[styles.intensity, rstyle]}>{this.state.foodType}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        padding: 10, 
        borderRadius: 8,
        margin: 5,
        flex: 1, 
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 0.5  
    },
    title: {
        color: '#45494E',
        fontSize: 16,
        fontWeight: '700'
    },
    description: {
        paddingTop: 10,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 13,
        fontWeight: 'normal'
    },
    intensity: {
        paddingLeft: 10,
        color: '#63686E',
        fontSize: 13,
        fontWeight: '500'
    },
    junkFood: {
        color: '#FF9C52'
    },
    balancedMeal: {
        color: '#4BAEA0'
    },
    nutritionalSnacks: {
        color: '#FF9C52'
    }
});
export default BehaviourDecelMealCard;
