
import React, {Component} from 'react';

import {Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetProgress from '../../components/TargetProgress';
import QuestionSelectOption from '../../components/screening/QuestionSelectOption';

class QuestionSelectOption4 extends Component {
    constructor(props) {
        super(props);
    }
    getQuestionData() {
        let data = [
            {index: "A", title: "Verbally fluent",descr: 'Describe what verbally fluent means in a line', selected: false},
            {index: "B", title: "Phrase speech",descr: 'Describe what verbally fluent means in a line', selected: false},
            {index: "C", title: "Single words",descr: 'Describe what verbally fluent means in a line',selected: false},
            {index: "D", title: "Little to no language",descr: 'Describe what verbally fluent means in a line',selected: false}
        ];
        return data;
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
                    <View style={{padding: 5}}>
                        <Text style={{fontFamily: 'SF Pro Text',fontStyle: 'normal',fontWeight: '500',fontSize: 20, color: '#45494E', paddingBottom: 10}}>How much language does kunal use for everyday activities?</Text>
                        <Image style={{borderColor: '#ccc', borderWidth: 1}} source={require('../../../android/img/Image.png')}/>
                        <View style={{paddingTop: 10}}>
                            <QuestionSelectOption 
                                index={this.getQuestionData()[0].index}  
                                title={this.getQuestionData()[0].title} 
                                description={this.getQuestionData()[0].descr}
                                selected={this.getQuestionData()[0].selected} />
                            <QuestionSelectOption 
                                index={this.getQuestionData()[1].index}  
                                title={this.getQuestionData()[1].title} 
                                description={this.getQuestionData()[1].descr}
                                selected={this.getQuestionData()[1].selected} />
                            <QuestionSelectOption 
                                index={this.getQuestionData()[2].index}  
                                title={this.getQuestionData()[2].title} 
                                description={this.getQuestionData()[2].descr}
                                selected={this.getQuestionData()[2].selected} />
                            <QuestionSelectOption 
                                index={this.getQuestionData()[3].index}  
                                title={this.getQuestionData()[3].title} 
                                description={this.getQuestionData()[3].descr}
                                selected={this.getQuestionData()[3].selected} />
                        </View>
                    </View>
                    <TargetProgress current={1} total={15} />
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

});
export default QuestionSelectOption4;