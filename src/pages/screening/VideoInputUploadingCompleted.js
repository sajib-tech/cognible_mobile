import React, {Component} from 'react';
import { Button } from 'react-native-elements';
import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class VideoInputUploadingCompleted extends Component{
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
                            <TouchableOpacity>
                                <Text style={styles.startText}>
                                    <FontAwesome5 name={'video'} style={{fontSize: 16,color: '#3E7BFA'}}/>  Start Recording
                                </Text>
                            </TouchableOpacity>
                            <Text style={{textAlign: 'center'}}>Or</Text>
                            <Text style={styles.uploadFromText}>Upload Video from Gallery</Text>
                        </View>
                        <View style={{paddingTop: 20}}>
                            <Text style={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontWeight: '500',fontSize: 16,  paddingBottom: 10}}>
                                Selected Videos (2)
                            </Text>
                            {/* First Video */}
                            <View style={styles.videoBox}>
                                <Image style={styles.imageView} source={require('../../../android/img/Image.png')}/>
                                <View style={{width: '65%'}}>
                                    <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                                        <Text style={styles.videoTitle}>
                                            Video-2.mp4
                                        </Text>
                                        <Text style={{width: '50%', textAlign: 'right'}}>
                                            <FontAwesome5 name={'trash'} style={{fontSize: 16,color: '#3E7BFA'}}/>
                                        </Text>
                                    </View>
                                    <View style={styles.uploadingView}>
                                        <Text style={styles.uploadingText}>Uploading...100%</Text>
                                        <Text style={styles.uploadingProgress}></Text>
                                        <Text style={styles.uploadingProgressColor}></Text>
                                    </View>
                                </View>
                            </View>
                            {/* Second Video */}
                            <View style={styles.videoBox}>
                                <Image style={styles.imageView} source={require('../../../android/img/Image.png')}/>
                                <View style={{width: '65%'}}>
                                    <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                                        <Text style={styles.videoTitle}>
                                            Video-1.mp4
                                        </Text>
                                        <Text style={{width: '50%', textAlign: 'right'}}>
                                            <FontAwesome5 name={'trash'} style={{fontSize: 16,color: '#3E7BFA'}}/>
                                        </Text>
                                    </View>
                                    <View style={styles.uploadingView}>
                                        <Text style={styles.uploadingText}>Uploading...100%</Text>
                                        <Text style={styles.uploadingProgress}></Text>
                                        <Text style={styles.uploadingProgressColor}></Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.continueView}>
                        <TouchableOpacity	style={styles.continueViewTouchable} activeOpacity={ .5 } onPress={ this.showSignin }>
                            <Text style={styles.continueViewText}>Submit</Text>  
                        </TouchableOpacity>
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

    videoBox: {
        flex: 1, 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 4, 
        padding: 5,
        marginBottom: 10,
        shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
    },
    imageView:{
        width: '35%', 
        height:90,
        borderColor: '#ccc', 
        borderWidth: 1
    },
    videoTitle: {
        width: '50%', 
        textAlign: 'left', 
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16
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
    },


    uploadingView: {
        width: '100%',
        //height: 40,
        paddingLeft: 12,
        paddingTop: 8,
        marginBottom: 10, 
        //borderColor: 'black',
        borderRadius: 4
    },
    uploadingText: {
        paddingBottom: 5, 
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 13,
        fontWeight: '500',
        fontStyle: 'normal'
    },
    uploadingProgress: {
        height: 2,
        width: '100%',
        borderWidth: 2,
        borderColor: 'rgba(95, 95, 95, 0.1)',
    },
    uploadingProgressColor: {
        position: 'absolute',
        top: 32,
        left: 12,
        width: '100%',
        height: 2,
        borderWidth: 2,
        borderColor: '#3E7BFA'
    },

    //
    continueViewTouchable:{
        marginTop:28,
        paddingTop:10,
        paddingBottom:10,
        marginLeft:12,
        marginRight:12,
        marginBottom:15,
        backgroundColor:'#1E90FF',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    continueView:{  
        width:'100%',
        // position: 'absolute',
        bottom: 0
    
    },
    continueViewText:{
        color:'#fff',
        fontSize: 20,
        textAlign:'center',
    }
});
export default VideoInputUploadingCompleted;