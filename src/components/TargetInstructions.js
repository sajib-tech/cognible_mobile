import React, { Component } from 'react';

import { Image, Text, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { getStr } from '../../locales/Locale';
import InstructionPoint from './InstructionPoint';
import Color from '../utility/Color';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

class TargetInstructions extends Component {

    constructor(props) {
        super(props);
        this.state = { data: props.data, description: props.description, isList: props.isList };
        // console.log("data = ", props.data);
        this.getPoints = this.getPoints.bind(this);
    }

    getPoints() {
        let points = [];
        let data = this.state.data;
        // console.log("data in method = ", data);
        // let data = [
        //     {sno: 1, descr: 'This is the first point about the session & how it should be done.'},
        //     {sno: 2, descr: 'Continuing with a second point and explaining what is to be done in the assessment.'},
        //     {sno: 3, descr: 'Keep steps short, two to three lines max otherwise it\'ll be confusing.'}
        // ];
        for (let x = 0; x < data.length; x++) {
            points.push(<InstructionPoint key={x} sno={data[x].sno} descr={data[x].descr} />);
        }
        return points;
    }
    render() {
        return (
            <View>
                {this.getPoints()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 10,
        marginHorizontal: 5
    },
    titleBlock: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        marginLeft: 5,
        fontSize: 20,
        color: '#1E90FF',
        textAlign: 'left'
        //  lineHeight: 35,
        // fontWeight:'bold'
    },
    description: {
        fontSize: 15,
        fontWeight: 'normal',
        marginTop: 15,
        color: 'rgba(95, 95, 95, 0.75)',
        letterSpacing: 0.1
    },
    descrBlock: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 10,
        //borderWidth: 1,
        //borderColor: '#000'
    },
    snoView: {
        //borderWidth: 1,
        //borderColor: '#000',
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: 'rgba(62, 123, 250, 0.05)'
    },
    sno: {
        fontSize: 17,
        fontWeight: 'normal',
        fontStyle: 'normal',
        paddingTop: 3,
        color: '#3E7BFA',
        borderRadius: 4,
        textAlign: 'center',
        justifyContent: 'center'
    },
    descrView: {
        flex: 1
    },
    pointsDescr: {
        fontSize: 14,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: 'rgba(95, 95, 95, 0.75)',
        letterSpacing: 0.1,
        paddingLeft: 12
    },
});

export default TargetInstructions;
