import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class TargetProgressLine extends Component {

    constructor(props) {
        super(props);
        this.state = {current: props.current, total: props.total};
    }

    render() {
        return (
                <View style={styles.targetView}>
                    <Text style={styles.targetProgress}></Text>
                    <Text style={styles.targetProgressColor}></Text>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    targetBlock: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#000000'
    },
    targetView: {
        width: '100%',
        backgroundColor: 'rgba(62, 123, 250, 0.05)',
        borderColor: 'rgba(62, 123, 250, 0.05)',
        //borderColor: 'black',
        borderWidth: 1,
        borderRadius: 4
    },
    targetProgress: {
        height: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(95, 95, 95, 0.1)',
    },
    targetProgressColor: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '15%',
        height: 1,
        borderWidth: 1,
        borderColor: '#3E7BFA'
    }
});

export default TargetProgressLine;
