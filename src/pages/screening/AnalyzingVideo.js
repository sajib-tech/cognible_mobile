
import React, {Component} from 'react';

import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class AnalyzingVideo extends Component {
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
                            <Text style={styles.headerTitle}>Analyzing Video</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', textAlign:'center', height: 300}}>
                        <FontAwesome5 name={'spinner'} style={{fontSize: 60}}/>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={styles.upcomingNext}>
                            Upcoming Next
                        </Text>
                        <View style={styles.assessmentView}>
                            <Text style={styles.step}>STEP 3 . 8 - 10 MIN</Text>
                            <Text style={styles.title}>Record a Video</Text>
                            <Text style={styles.description}>
                                Engage with Kunal as prescribed by the script while recording the whole activity
                            </Text>
                        </View>
                    </View>
                </ScrollView>
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

    assessmentView: {
        padding: 15,
        backgroundColor: '#FFFFFF', 
        borderRadius: 4,
        shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
    },
    upcomingNext: {
        fontFamily: 'SF Pro Text', 
        fontStyle: 'normal', 
        fontWeight: '500',
        fontSize: 16, 
        color: 'rgba(95, 95, 95, 0.75)', 
        paddingBottom: 20
    },
    step: {
        paddingBottom: 10, 
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 13,
        color: '#63686E'
    },
    title: {
        paddingBottom: 10, 
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 19,
        color:'#45494E'
    },
    description: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14, color:'rgba(95, 95, 95, 0.75)'
    }
});
export default AnalyzingVideo;