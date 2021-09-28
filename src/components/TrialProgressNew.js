import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import OrientationHelper from '../helpers/OrientationHelper';
import Color from '../utility/Color';

class TrialProgressNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noOfBoxes: props.noOfBoxes,
            colorsArr: props.colorsArr,
            boxColorsArr: props.boxColorsArr,
            data: props.data
        };
    }

    getBox() {
        let boxArr = [];
        let { data } = this.state;
        // console.log("data = ", JSON.stringify(data));
        let percentage = 100 / data.length;
        // console.log("Percentage:"+percentage);
        for (let x = 0; x < data.length; x++) {
            let object = data[x];
            let style = null;

            if (object['result'] === 'positive') {
                style = styles.positive;
            } else if (object['result'] === 'negative') {
                style = styles.negative;
            } else if (object['result'] === 'nuetral') {
                style = styles.nuetral;
            }

            let borderLineStyle = null;
            if (this.props.currentNumber) {
                if (x == this.props.currentNumber - 1) {
                    borderLineStyle = { borderBottomWidth: 2, borderBottomColor: Color.primary };
                }
            }

            boxArr.push(<View key={x} style={[styles.progressBox, style, borderLineStyle]}></View>);
        }
        return boxArr;
    }
    render() {

        return (

            <View style={styles.trialProgress}>
                {this.getBox()}
            </View>

        );
    }
}

const barHeight = OrientationHelper.getDeviceOrientation() == 'portrait' ? 20 : 10;

const styles = StyleSheet.create({

    trialProgress: {
        height: barHeight,
        // paddingLeft: 5,
        // paddingRight: 10,
        flexDirection: 'row',
        marginRight: -3,
    },
    progressBox: {
        height: barHeight,
        flex: 1,
        marginRight: 3,
        borderRadius: 4,
        backgroundColor: '#F5F5F5'
    },
    positive: {
        backgroundColor: '#4BAEA0'
    },
    negative: {
        backgroundColor: '#FF9C52'
    },
    nuetral: {
        backgroundColor: '#FF8080'
    }
});

export default TrialProgressNew;
