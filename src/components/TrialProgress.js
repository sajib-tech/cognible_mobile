import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';

class TrialProgress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noOfBoxes: props.noOfBoxes,
            colorsArr: props.colorsArr,
            boxColorsArr: props.boxColorsArr
        };
    }

    getBox() {
        let boxArr = [];
        let {boxColorsArr} = this.state;
        //console.log("boxColors = ", boxColorsArr);
        for(let x=0;x<8;x++) {
            let style = (boxColorsArr && boxColorsArr.length>x) ? eval("styles."+boxColorsArr[x]) : '';
            boxArr.push(<Text style={[styles.progressBox, style]}>{x}</Text>);
            //boxArr.push(<Text style={[styles.progressBox, '']}></Text>);
        }
        return boxArr;
    }
    render() {
        
        return (

                <View style={styles.trialProgress}>
                    { this.getBox() }                    
                </View>

        );
    }
}

const styles = StyleSheet.create({
    
    trialProgress: {
        height: 20,
        
        flexDirection: 'row',
    },
    progressBox: {
        height: 12,
        width: 40,
        marginRight: 3,
        borderRadius: 2,
        backgroundColor: '#F5F5F5'
    },
    green: {
        backgroundColor: '#4BAEA0'
    },
    orange: {
        backgroundColor: '#FF9752'
    },
    grey: {
        backgroundColor: '#DADADA'
    },
    red: {
        backgroundColor: 'red'
    }
});

export default TrialProgress;
