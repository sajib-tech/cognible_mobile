import React, {Component} from 'react';

import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {getStr} from '../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import store from '../redux/store';

const width = Dimensions.get('window').width;
class TherapyHomeMorningSessionVideoItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            description: props.description,
            domainName: props.domainName,
            targetName: props.targetName,
            dailyTrials: props.dailyTrials
        };
    }
    render(){
        return(
            <View style={styles.scrollViewItem}>
                <Image source={require('../../android/img/Image.png')}
                style={{width:249, height: 120, borderTopLeftRadius:8, borderTopRightRadius: 8}}/>
                <View  style={{padding: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#FF8080', fontSize: 12, width: '50%', textAlign: 'left'}}>{this.state.domainName}</Text>
                        <Text style={{color: '#FF8080', fontSize: 12, width: '50%', textAlign: 'right'}}>
                            <FontAwesome5 name={'heart'} style={{fontSize: 12}} />  </Text>
                    </View>
                    <Text  style={{color: '#63686E', fontSize: 18}}>{this.state.targetName}</Text>
                </View>
                <View style={styles.targetView}>
                    <Text style={styles.targetText}>{this.state.dailyTrials} Trials per day</Text>
                    <Text style={styles.targetProgress}></Text>
                    <Text style={styles.targetProgressColor}></Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    scrollViewItem: {
        backgroundColor: '#ffffff', 
        // height: 250, 
        width: 250,
        paddingBottom: 20,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        margin: 3,
        marginRight: 7
    },
    targetView: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    targetText: {
        paddingBottom: 10,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 12,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontFamily: 'SF Pro Text'
    },
    targetProgress: {
        height: 1,
        // width: '100%',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: 'rgba(95, 95, 95, 0.1)',
    },
    targetProgressColor: {
        position: 'absolute',
        top: 28,
        left: 12,
        width: '15%',
        borderRadius: 8,
        height: 1,
        borderWidth: 2,
        borderColor: '#3E7BFA'
    },
});
export default TherapyHomeMorningSessionVideoItem;