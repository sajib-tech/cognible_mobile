import React, { Component } from 'react';

import { Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { getStr } from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class ResultBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            resultStatus: props.resultStatus,
            resultDescription: props.resultDescription
        };
    }

    render() {
        return (
            <View style={styles.resultBox}>
                <View style={styles.title}>
                    <Image style={styles.image} source={require('../../../android/img/Img.png')} />
                    <View style={{ width: '65%', paddingLeft: 10 }}>
                        <Text style={styles.resultTitle}>
                            {this.state.title}
                        </Text>
                        <Text style={styles.resultStatus}>{this.state.resultStatus}</Text>
                    </View>
                    <Text style={[styles.positive, { fontSize: 13, height: 35, paddingLeft: 10, paddingRight: 10, paddingTop: 10 }]}> + 16%</Text>
                </View>
                <Text style={styles.description}>{this.state.resultDescription}</Text>
                <View style={styles.resultProgressView}>
                    <Text style={styles.resultProgress}></Text>
                    <Text style={styles.resultProgressColor}></Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    resultBox: {
        padding: 10,
        margin: 3,
        marginBottom: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    title: {
        flex: 1,
        flexDirection: 'row'
    },
    image: {
        width: '15%',
        height: 45,
        borderWidth: 1
    },
    resultTitle: {
        // paddingTop:5, 
        paddingBottom: 5,
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 19,
        color: '#45494E'
    },
    resultStatus: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        color: 'rgba(95, 95, 95, 0.75)'
    },
    description: {
        paddingTop: 5,
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 13,
        color: 'rgba(95, 95, 95, 0.75)'
    },
    resultProgressView: {
        width: '100%',
        marginTop: 8,
        borderColor: 'rgba(62, 123, 250, 0.05)',
        borderWidth: 1,
        borderRadius: 10
    },

    resultProgress: {
        height: 1,
        width: '100%',
        borderWidth: 2,
        borderColor: 'rgba(95, 95, 95, 0.1)',
        borderRadius: 5
    },
    resultProgressColor: {
        position: 'absolute',
        // width: '25%',
        height: 2,
        // borderWidth: 2,
        borderColor: '#3E7BFA',
        borderRadius: 5
    },
    positive: {
        color: '#4BAEA0',
        backgroundColor: 'rgba(75, 174, 160, 0.1)'
    },
    neutral: {
        color: '#FF9C52',
        backgroundColor: 'rgba(255, 128, 128, 0.1)'
    },
    negative: {
        color: '#FF8080'
    }
});
export default ResultBox;
