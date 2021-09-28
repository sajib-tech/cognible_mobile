import React, {Component} from 'react';
import { Button } from 'react-native-elements';
import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class VideoInput extends Component{
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
                            <Text style={styles.headerTitle}>Screening Video</Text>
                        </View>
                    </View>
                    <View style={{padding: 5}}>
                        <View style={styles.videoInputView}>
                            <Text style={styles.startText}>
                                <FontAwesome5 name={'video'} style={{fontSize: 16,color: '#3E7BFA'}}/>  Start Recording
                            </Text>
                            <Text style={{textAlign: 'center'}}>Or</Text>
                            <Text style={styles.uploadFromText}>Upload Video from Gallery</Text>
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


    videoInputView: {
        padding:25, 
        borderStyle: 'dashed', 
        height: 240,
        borderWidth: 1,
        borderRadius: 1 
    },
    startText: {
        marginLeft:30,
        marginTop:30,
        marginRight:30,
        marginBottom:20,
        padding:20, 
        textAlign: 'center', 
        backgroundColor: 'rgba(62, 123, 250, 0.075)', 
        borderRadius: 8, 
        color: '#3E7BFA',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 19
    },
    uploadFromText: {
        textDecorationLine: 'underline', 
        color: 'rgba(95, 95, 95, 0.75)',
        paddingTop:20, 
        textAlign: 'center', 
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16
    }
});
export default VideoInput;