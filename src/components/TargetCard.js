import React, {Component} from 'react';

import {Text, View, StyleSheet, Image, Dimensions} from 'react-native';

import TargetProgressLine from './TargetProgressLine';

class TargetCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            image: '',
            langType: props.langType,
            trials: props.trials,
            favCount: props.favCount
        };
    }

    render() {
        return (
            <View style={styles.targetBlock}>
                <Image style={styles.cardImage} source={require('../../android/img/Image.png')} />
                <View style={styles.langTypeBlock}>
                    <Text style={styles.langTypeText}>{this.state.langType}</Text>
                    <Text style={styles.langTypeText}>{this.state.favCount}</Text>
                </View>
                <Text style={styles.title}>{this.state.title}</Text>
                <Text style={styles.trials}>{this.state.trials}</Text>
                {/* prgress bar */}
                <View style={styles.targetProgressLine}>
                    <TargetProgressLine />
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    targetBlock: {
       width:Dimensions.get('window').width,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
        //shadowColor: 'rgba(0, 0, 0, 0.84)',
        marginBottom: 12
    },
    cardImage: {
        height:300,
        width:Dimensions.get('window').width,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    langTypeBlock: {
        flexDirection: 'row',
        marginTop: 12,
        marginLeft: 12
    },
    langTypeText: {
        color: '#FF8080',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        width: '80%'
    },
    title: {
        fontStyle: 'normal',
        fontSize: 16,
        fontWeight: '500',
        color: '#344356',
        marginTop: 8,
        marginLeft: 12
    },
    trials: {
        fontStyle: 'normal',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 8,
        marginLeft: 12,
        color: 'rgba(95, 95, 95, 0.75)'
    },
    targetProgressLine: {
        padding: 12,
        paddingTop: 8
    }
});

export default TargetCard;
