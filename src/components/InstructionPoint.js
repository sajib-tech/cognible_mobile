import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';

class InstructionPoint extends Component {

    constructor(props) {
        super(props);
        this.state = {sno: props.sno, descr: props.descr};
    }
    render() {
        return (
            <View style={[styles.descrBlock]}>
                <View style={[styles.snoView]} ><Text style={styles.sno}>{this.state.sno}</Text></View>
                <View style={[styles.descrView]} >
                    <Text style={styles.pointsDescr} >{this.state.descr}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    descrBlock: {
        flex: 1,
        flexDirection: 'row',
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

export default InstructionPoint;
