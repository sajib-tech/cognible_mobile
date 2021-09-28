
import React, {Component} from 'react';

import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetProgress from '../../components/TargetProgress';

class QuestionInputText extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.wrapper}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.backIcon}>
                            <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
                            </Text>
                            <Text style={styles.headerTitle}>Preliminary Assessment</Text>
                        </View>
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.fName}>Full Name</Text>
                        <Text style={styles.hintView}>Enter full name of your child</Text>
                        <TextInput style={styles.input}></TextInput>
                    </View>
                    
                </ScrollView>
                <TargetProgress current={0} total={15} />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        padding: 10
    },
    header: {
        flexDirection: 'row',
        height: 50,
        width: '100%'
    },
    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '80%',
        fontSize: 22,
        paddingTop: 10,
        color: '#45494E'
    },
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        // marginRight: 10
    },

    inputView: {
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 100
    },
    fName: {
        color: '#45494E', 
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal', 
        fontWeight: '500', 
        fontSize: 20, 
        paddingBottom: 10
    },
    hintView: {
        color: 'rgba(95, 95, 95, 0.75)',
        fontFamily: 'SF Pro Text', 
        fontStyle: 'normal', 
        fontWeight: 'normal', 
        fontSize: 13, 
        paddingBottom: 10
    },
    input: {
        borderRadius:4, 
        color: '#FFFFFF', 
        borderWidth: 1.5, 
        borderColor: 'rgba(57, 62, 70, 0.1)'
    }   
});
export default QuestionInputText;
