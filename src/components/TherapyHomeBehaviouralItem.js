import React, {Component} from 'react';

import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../locales/Locale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Behavior from '../../android/img/behaviour.jpg';
import Abc from '../../android/img/abc.png';
import Meal from '../../android/img/meal.jpg';
import Mand from '../../android/img/mand.jpg';
import Medical from '../../android/img/medical.jpg';
import Toilet from '../../android/img/toilet.jpg';
import Color from '../utility/Color';

class TherapyHomeBehaviouralItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            description: props.description,
            imgPath: props.imgPath,
            callbackFunction: props.callbackFunction
        };
        this.sendData = this.sendData.bind(this);
    }
    sendData() {
         this.props.callbackFunction(this.state.title);
    }
    render(){
        let i = "";
        if(this.state.title === "Mand Data") {
            i = Mand;
        } else if(this.state.title === "Meal Data") {
            i = Meal;
        } else if(this.state.title === "Medical Data") {
            i = Medical;
        } else if(this.state.title === "Toilet Data") {
            i = Toilet;
        } else if(this.state.title === "Behavior Data") {
            i = Behavior;
        } else if(this.state.title === "ABC Data") {
            i = Abc;
        }
        return(
            <TouchableOpacity onPress={this.sendData} activeOpacity={0.8}>
                <View style={styles.behaviouralItem}>
                    <Image style={{width: '15%', height: 50, borderRadius: 6}} source={i} 
                        resizeMode='contain' />
                    <View style={{width: '70%',  marginLeft: 16, justifyContent:'center'}}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Text style={styles.description}>{this.state.description}</Text>
                    </View>
                    <MaterialCommunityIcons name={'arrow-right'} 
                        color={Color.blueFill}
                        size={25} />
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    behaviouralItem: {
        flex: 1, 
        flexDirection:'row', 
        padding: 20,
        margin: 3,
        marginBottom: 10,
        backgroundColor: '#FFFFFF', 
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    title: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 19, 
        color: '#45494E',
        paddingBottom: 0
    },
    description: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 13, 
        color: 'rgba(95, 95, 95, 0.75)'
    }
});
export default TherapyHomeBehaviouralItem;