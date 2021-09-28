import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from '../utility/Color';
import Styles from '../utility/Style';

class NoData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // show: false
        }
    }
    render() {
        return (
            <View style={styles.wrapper}>
                <MaterialCommunityIcons name='information-outline' size={30} color={Color.primary} />
                <Text style={styles.text}>{this.props.children}</Text>
            </View>
        )
    }
}
const styles = {
    wrapper: {
        alignItems: 'center',
        paddingVertical: 10
    },
    text: {
        fontSize: 14
    }
}


export default NoData;