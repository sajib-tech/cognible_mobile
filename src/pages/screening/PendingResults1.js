
import React, {Component} from 'react';

import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ResultBox from "../../components/screening/ResultBox";

class PendingResults1 extends Component {
    constructor(props){
        super(props);
        this.getResultData = this.getResultData.bind(this);
        this.getResultListView = this.getResultListView.bind(this);
    }
    getResultData() {
        let data = [
            {title: "Speech & Language",resultStatus: 'Waiting for reesults',resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.'},
            {title: "Gross Motor",resultStatus: 'Waiting for reesults',resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.'},
            {title: "Fine Motor",resultStatus: 'Waiting for reesults',resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.'},
            {title: "Cognitive",resultStatus: 'Waiting for reesults',resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.'},
            {title: "Cognitive",resultStatus: 'Waiting for reesults',resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.'},
        ];
        return data;
    }
    getResultListView() {
        let data = this.getResultData();
        let resList = [];
        for(let x=0;x<data.length;x++) {
            resList.push(
                <ResultBox
                    title={data[x].title}
                    resultStatus={data[x].resultStatus}
                    resultDescription={data[x].resultDescription} />
            );
        }
        return resList;
    }
    render() {
        return(
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.wrapper}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.backIcon}>
                            <FontAwesome5 name={'chevron-left'} style={styles.backIconText}/>
                            </Text>
                            <Text style={styles.headerTitle}>Screening Results</Text>
                            <Text style={styles.rightIcon}>
                            <FontAwesome5 name={'search'} style={styles.backIconText}/>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={{marginBottom: 20, padding: 20, borderRadius:4, backgroundColor: '#5F6CAF'}}>
                            <Text style={{fontFamily: 'SF Pro Text',fontStyle: 'normal',fontWeight: '600',
                                fontSize: 22, color: '#FFFFFF', paddingBottom: 5}}>Wating for Results</Text>
                            <Text style={{fontFamily: 'SF Pro Text',fontStyle: 'normal',fontWeight: 'normal',
                                fontSize: 13, color: '#FFFFFF', paddingBottom: 25}}>We are waiting for screening results and update here soon.</Text>
                            <View style={{marginBottom: 25, width: '100%', height: 1, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)'}}></View>
                            <Text style={{fontFamily: 'SF Pro Text',fontStyle: 'normal',fontWeight: '500',
                                fontSize: 16, color: '#FFFFFF', paddingBottom: 5}}>
                                Contact Your Pediatrician  <FontAwesome5 name={'arrow-right'} style={{paddingTop: 10, fontSize: 18}}/></Text>
                        </View>
                        {this.getResultListView()}

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
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        // marginRight: 10
    },
    // Body

    body: {
        padding: 20
    }
});
export default PendingResults1;