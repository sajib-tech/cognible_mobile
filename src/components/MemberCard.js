import React, {Component} from 'react';

import {Text, View, Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
class MemberCard extends Component {

    constructor(props) {
        super(props);
         this.state = {
            memberTitle: props.memberTitle
         };
    }
    render() {
        let {memberTitle} = this.state;
        let {data} = this.props;
        let name = data && data.name ? data.name : "";
        let relation = data && data.relation;
        let title = this.props.memberTitle;
        let image = require('../../android/img/blank.jpg');
        let arrowIcon = require('../../android/img/blueArrow.jpg');
        if(relation) {
            title = name;
            image = require("../../android/img/father.jpg");
            arrowIcon = require('../../android/img/correct.png');
        }
        return (
            <TouchableWithoutFeedback>
                <View style={styles.memberCard} >
                    <Text style={{width: '15%'}}>
                        <FontAwesome5 name={'user-plus'} style={{fontSize: 35}}/>
                    </Text>
                    <Text style={{width: '65%', marginLeft: 10, padding: 10, fontFamily: 'SF Pro Text',fontStyle: 'normal',fontWeight: 'normal',fontSize: 19}}>{this.state.memberTitle} Details</Text>
                    <Text style={{width: '15%', alignItems:'center', textAlign:'right', paddingTop: 15 }}>
                        <FontAwesome5 name={'arrow-right'} style={{fontSize: 20, color: '#3E7BFA'}}/>
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    memberCard:{
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 6,
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        marginBottom: 10,

        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1
    },
    cardBlock: {
        flex: 1, flexDirection: 'row',
        padding: 14, backgroundColor: '#FFF', marginBottom: 12,
        borderWidth: 1, borderRadius: 6, borderColor: 'rgba(0, 0, 0, 0.04)'
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: 5,
    },
    cardTitle: {
        flex: 1
    },
    title: { color: '#45494E', fontSize: 19, flex: 1, paddingLeft: 23 },
    subtitle: { color: '#45494E', fontSize: 13, flex: 1, paddingLeft: 23, paddingTop: 4 },
    img1: { height: 20, width: 20, marginTop: 8 }
});

export default MemberCard;
