/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput, TouchableOpacity

} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'react-native-elements'

class AddFamilyMembersScreen extends Component {


    render() {


        return (

            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.wrapper}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.backIcon}>
                                <FontAwesome5 name={'chevron-left'} style={styles.backIconText} />
                            </Text>
                            <Text style={styles.headerTitle}>Family Members </Text>
                        </View>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.textTitle}>Add family member details & time spent with Kunal to allocate targets accrdingly. </Text>

                        <View style={styles.container} >
                            <View style={styles.Image} >
                                <Image style={styles.person} source={require('../../../android/img/blank.jpg')} />
                            </View>
                            <View style={styles.midData} ><Text style={styles.text1}>Father's Details</Text>
                            </View>
                            <View style={styles.last} >
                                <Image style={styles.img1} source={require('../../../android/img/blueArrow.jpg')} />
                            </View>
                        </View>

                        <View style={styles.container} >
                            <View style={styles.Image} >
                                <Image style={styles.person} source={require('../../../android/img/blank.jpg')} />
                            </View>
                            <View style={styles.midData} ><Text style={styles.text1}>Mother's Details</Text>
                            </View>
                            <View style={styles.last} >
                                <Image style={styles.img1} source={require('../../../android/img/blueArrow.jpg')} />
                            </View>
                        </View>
                        <View style={styles.container} >
                            <View style={styles.Image} >
                                <Image style={styles.person} source={require('../../../android/img/blank.jpg')} />
                            </View>
                            <View style={styles.midData} ><Text style={styles.text1}>Sibling Details</Text>
                            </View>
                            <View style={styles.last} >
                                <Image style={styles.img1} source={require('../../../android/img/blueArrow.jpg')} />
                            </View>
                        </View>
                        <View style={styles.container} >
                            <View style={styles.Image} >
                                <Image style={styles.person} source={require('../../../android/img/blank.jpg')} />
                            </View>
                            <View style={styles.midData} ><Text style={styles.text1}>Grand Parent's Details</Text>
                            </View>
                            <View style={styles.last} >
                                <Image style={styles.img1} source={require('../../../android/img/blueArrow.jpg')} />
                            </View>
                        </View>
                        <View style={styles.container} >
                            <View style={styles.Image} >
                                <Image style={styles.person} source={require('../../../android/img/blank.jpg')} />
                            </View>
                            <View style={styles.midData} ><Text style={styles.text1}>Other Member Detail</Text>
                            </View>
                            <View style={styles.last} >
                                <Image style={styles.img1} source={require('../../../android/img/blueArrow.jpg')} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.continueView}>
                        <TouchableOpacity style={styles.continueViewTouchable} activeOpacity={.5} >
                            <Text style={styles.continueViewText}> Continue </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10
    },

    header: {
        flexDirection: 'row',
        height: 50,
        width: '100%',

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
        color: '#63686E',

    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 22,
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#45494E'
    },
    textTitle: {
        fontSize: 16,
        //  fontWeight:'bold',
        textAlign: 'justify',
        color: '#63686E'
    },
    body: {
        marginLeft: 20,
        marginRight: 15,
        marginBottom: 200
    },
    person: {
        width: 60,
        height: 57,
        borderRadius: 5,
    },
    scrollView: {
        backgroundColor: '#ecf0f1',
    },
    container: {
        flex: 1, flexDirection: 'row', paddingTop: 10, backgroundColor: 'white', marginTop: 10, borderWidth: 3, borderRadius: 10, borderColor: '#DCDCDC',
    },
    img: { height: 50, width: 50, },
    img1: { height: 20, width: 20, margin: 20 },

    text2: { fontSize: 15, color: '#63686E' },
    last: { width: '10%', height: 80, },
    midData: { width: '65%', height: 80, padding: 7, },
    text1: { fontSize: 20, marginTop: 3 },
    Image: { width: '20%', height: 80, padding: 10, },
    continueViewTouchable: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    continueView: {
        width: '100%',
    },
    continueViewText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default AddFamilyMembersScreen;
