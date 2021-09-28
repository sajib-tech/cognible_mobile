import React,{Component} from 'react';

import {Text, Button, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import TargetCard from '../../components/TargetCard';
import TargetProgressLine from '../../components/TargetProgressLine';
import NavigationHeader from '../../components/NavigationHeader';
import {getStr} from "../../../locales/Locale";

class SessionTargetListScreen extends Component {

    constructor(props) {
        super(props);
        this.showSessionTarget = this.showSessionTarget.bind(this);
        this.showPreview = this.showPreview.bind(this);

    }

    getTargetCards() {
        const { route } = this.props;
		let pageTitle = route.params.pageTitle;
		let targetLength = 0;//(Object.keys(route.params.sessionData.node.targetAllocateSet.edges)).length;
		let sessionData = route.params.sessionData;
		// console.log("-----------"+JSON.stringify(sessionData))
		let fromPage = route.params.fromPage;
        let sessionNode = sessionData?.node;
        let targets = [];
        if (sessionNode) {
            targets = sessionNode?.targets.edges
        }
        let cardArr = [];
        for(let x=0; x<targets.length; x++) {
            let target = targets[x];
            let domainName = "";
            if(target.node.targetId && target.node.targetId.domain && target.node.targetId.domain.domain) {
                domainName = target.node.targetId.domain.domain;
            }
            cardArr.push(
                <TouchableOpacity  activeOpacity={.5} onPress={this.showPreview}>
                    <TargetCard langType={domainName}
                        title={target.node.targetAllcatedDetails.targetName}
                        trials={target.node.targetAllcatedDetails.DailyTrials+' Trials per day'} />
                </TouchableOpacity>
                );
        }
        return cardArr;
    }
    render() {

        return (
            <SafeAreaView>
                <NavigationHeader
                    title={getStr('NewChanges.SessionTarets')}
                    backPress={() => this.props.navigation.goBack()}
                />
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.wrapper}>
                        <View style={styles.targetList}>
                            {this.getTargetCards()}
                        </View>
                    </View>

                </ScrollView>
                <View style={styles.buttonView}>
                    <Button title={getStr('NewChanges.StartSession')} style={styles.startButton}
                        onPress={this.showPreview} />
                </View>
            </SafeAreaView>
        );
    }
    showSessionTarget() {
        let {navigation} = this.props;
        navigation.navigate('SessionPreview');
    }
    showPreview() {
        const { route } = this.props;
		let pageTitle = route.params.pageTitle;
		let sessionData = route.params.sessionData;
		let fromPage = route.params.fromPage;
        let data = {
            pageTitle: pageTitle,
            sessionData: sessionData,
            fromPage: "TherapyHome",
            student: route.params.student,
            studentId: route.params.studentId
        };
        let {navigation} = this.props;
        navigation.navigate('SessionPreview', data);
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FFFFFF',
    },
    targetList: {
        backgroundColor: '#FFFFFF',
    },
    buttonView: {
        width: '100%',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4,
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 50

    },
    startButton: {
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#3E7BF4',
        padding: 12,
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: '500',
        textAlign: 'center'
    }
});

export default SessionTargetListScreen;
