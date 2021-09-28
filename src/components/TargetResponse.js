import React, { Component } from 'react';

import { View, Text, FlatList, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
class TargetResponse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            responseType: props.responseType,
            displayColor: props.displayColor,
            response: props.response,
            message: props.message,
            count: props.count,
            data: props.data,
            selected: props.selected,
            expandList: false,
            callbackFunction: props.callbackFunction,
            activeIndex: 0,
            indexChoosen: true
        };
        this.toggleResponse = this.toggleResponse.bind(this);
        this.selectIncorrectItem2 = this.selectIncorrectItem2.bind(this);
    }
    changeCount = (count) => {
        // console.log("changeCount is called:"+count);
        this.setState({ count: count });
    }
    changeSelected = (isSelected) => {
        // console.log("changeSelected is called:"+isSelected);
        this.setState({ selected: isSelected });
    }
    render() {
        let { responseType, selected, data, expandList, activeIndex, indexChoosen } = this.state;
        let rstyle = '';
        if (selected && responseType && responseType === 'correct') {
            rstyle = eval('styles.correct');
        } else if (selected && responseType && responseType === 'incorrect') {
            rstyle = eval('styles.incorrect');
        }
        return (
            // <View style={[styles.outsideBlock, rstyle]}>
            <TouchableWithoutFeedback onPress={this.toggleResponse}>
                <View style={[styles.responseBlock, rstyle]}>
                    <View style={styles.textBlock}>
                        <Text style={[styles.title, rstyle]}>{this.state.response} Response</Text>
                        <Text style={[styles.description, rstyle]}>{this.state.message} </Text>
                    </View>
                    <Text style={[styles.count, rstyle]}> {this.state.count} </Text>

                </View>
            </TouchableWithoutFeedback>
            // </View>
        );
    }
    toggleResponse() {
        let { selected, responseType, expandList } = this.state;
        if (responseType === 'correct') {
            this.setState({ selected: !selected });
            // (selected) ? this.state.count-- : this.state.count++;
            console.log(this.state.count);
            this.props.callbackFunction(responseType, expandList);
        } else if (responseType === 'incorrect') {
            this.setState({ expandList: !expandList });
            this.props.callbackFunction(responseType, expandList);
        }
    }
    selectIncorrectItem2 = (index) => {
        console.log("============" + index)
        let stateData = this.state.data;
        for (let i = 0; i < stateData.length; i++) {
            console.log("===============");
            console.log("Before:" + stateData[i].isSelected);
            stateData[i].isSelected = (i === index) ? true : false;
            console.log("After:" + stateData[i].isSelected);
            console.log("===============");
        }
        this.setState({ data: stateData });
    }
}

const styles = StyleSheet.create({
    outsideBlock: {
        marginTop: 20,
        padding: 15,
        // flexDirection: 'row',
        borderWidth: 1,
        borderColor: '1px solid rgba(0, 0, 0, 0.075)',
        borderRadius: 4
    },
    responseBlock: {
        // marginTop: 10,
        //padding: 15,
        flexDirection: 'row',
        //borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.075)',
        borderRadius: 4,
    },
    correct: {
        borderColor: '#4BAEA0',
        color: '#4BAEA0',
    },
    incorrect: {
        borderColor: '#FF9C52',
        color: '#FF9C52',
    },
    incorrectItemSelected: {
        borderColor: '#FF9C52',
        color: '#FF9C52',
    },
    textBlock: {
        flex: 1,
    },
    title: {
        fontSize: 19,
        color: '#45494E',
    },
    description: {
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: 'normal',
        color: '#63686E'
    },
    count: {
        fontSize: 17,
        fontWeight: '500',
        width: 32,
        height: 32,
        lineHeight: 32,
        color: 'rgba(95, 95, 95, 0.75)',
        borderRadius: 4,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(99, 104, 110, 0.05)'
    },
    itemView: {
        borderColor: '#ccc',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 4,
        padding: 16,
        marginBottom: 12
    },
    itemIcon: {
        fontSize: 16,
        marginTop: 2
    },
    itemText: {
        marginLeft: 12,
        color: '#63686E',
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal'
    }
});

export default TargetResponse;
