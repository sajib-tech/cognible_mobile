import React, {Component} from 'react';

import {View, Text, FlatList, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
class GoalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            viewCount: props.viewCount,
            description: props.description,
            colorType: props.colorType
        };
    }

    render() {
        let {colorType} = this.state;
        let rstyle = '';
        if(colorType && colorType==='positive') {
            rstyle = eval('styles.positiveColor');
        } else if(colorType && colorType==='negative') {
            rstyle = eval('styles.negativeColor');
        } else if(colorType && colorType==='neutral') {
            rstyle = eval('styles.neutralColor');
        }
        return (
            <View style={[styles.goalView]}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Text style={[styles.viewCount, rstyle]}>{this.state.viewCount} Targets</Text>
                </View>
                <Text  style={styles.description}>{this.state.description}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    goalView: {
        padding: 20,
        width: '100%',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 6
    },
    title: {
        width: '80%',
        color: '#63686E',
        fontSize: 19,
        fontWeight: '500',
        fontStyle: 'normal'
    },
    viewCount:{
        paddingTop: 3,
        width: '20%',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        fontStyle: 'normal',
        backgroundColor: 'rgba(75, 174, 160, 0.1)'
    },
    description:{
        paddingTop: 10,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'normal'
    },
    positiveColor: {
        backgroundColor: 'rgba(75, 174, 160, 0.1)',
        color: '#4BAEA0'
    },
    negativeColor: {
        backgroundColor: 'rgba(255, 128, 128, 0.1)',
        color: '#FF8080'
    },
    neutralColor: {
        backgroundColor: 'rgba(255, 156, 82, 0.1)',
        color: '#FF9C52'
    }
});

export default GoalView;
