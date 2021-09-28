
import React, {Component} from 'react';

import {View, Text, FlatList, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class QuestionSelectOption extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            index: props.index,
            title: props.title,
            description: props.description,
            selected: props.selected
        };
    }
    render() {
       let {selected} = this.state;
        let rstyle = '';
        let cardBorder = '';n
        if(selected) {
            rstyle = eval('styles.selected');
            cardBorder = eval('styles.cardBorder');
        }
        return (
            <View style={[styles.card, cardBorder]}>
                <Text style={[styles.index, rstyle]}>{this.state.index}</Text>
                <View style={styles.questionInfo}>
                    <Text style={[styles.questionTitle, rstyle]}>{this.state.title}</Text>
                    <Text style={[styles.questionDescription, rstyle]}>{this.state.description}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        borderRadius: 4,
        flex: 1,
        padding: 20,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(0, 0, 0, 0.075)',
        borderWidth: 1,
        marginBottom: 5
    },
    cardBorder: {
        borderColor: '#3E7BFA',
    },
    index: {
        width: 42,
        height: 42,
        color: '#63686E',
        backgroundColor: 'rgba(238, 238, 238, 0.5)',
        borderRadius: 4,
        paddingTop: 10,
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 17,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    questionInfo: {
        paddingLeft: 15
    },
    questionTitle: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 19,
        color: '#45494E'
    },
    questionDescription: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 13,
        color: 'rgba(95, 95, 95, 0.75)'
    },
    selected: {
        color: '#3E7BFA'
    }
});
export default QuestionSelectOption;