import React, { Component } from 'react';

import { Text, View, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
let screeningImg = require('../../android/img/screening-card.png');
let therapyImg = require('../../android/img/therapy.png');
let communityImg = require('../../android/img/community.png');
let doctorsImg = require('../../android/img/doctors.png');
import OrientationHelper from '../helpers/OrientationHelper';


class HomeCard extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        let imgFile = screeningImg;
        let { bgimage } = this.props;
        if (bgimage && bgimage === 'screening') {
            imgFile = screeningImg;
        } else if (bgimage && bgimage === 'therapy') {
            imgFile = therapyImg;
        } else if (bgimage && bgimage === 'community') {
            imgFile = communityImg;
        } else if (bgimage && bgimage === 'doctors') {
            imgFile = doctorsImg;
        }
        return (
            <View style={[styles.cardBlock, { backgroundColor: this.props.bgcolor }, { height: OrientationHelper.getDeviceOrientation() == 'landscape' ? 250 : 204 }]}>
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    {this.props.newFlag && (
                        <Text style={styles.newText}>NEW</Text>
                    )}
                    <Text style={styles.cardHeader}>{this.props.title}</Text>
                    {
                        this.props.comingSoon && (
                            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>({this.props.comingSoon})</Text>
                        )
                    }
                    <Text style={styles.cardDescr}>{this.props.descr}</Text>
                    {this.props.startText && (
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View><Text style={styles.cardStart}>{this.props.startText}</Text></View>
                            <View style={{ paddingTop: 20 }}>
                                <MaterialCommunityIcons name={'arrow-right'} color={'#ffffff'} size={24} />
                            </View>
                        </View>
                    )}

                </View>
                <View>
                    <Image style={styles.img} source={imgFile} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardBlock: {
        //backgroundColor: '#254056',
        // flex: 1,
        flexDirection: 'row',
        padding: 16,
        // margin: 16,
        marginTop: 0,
        borderRadius: 4,
        height: 204
    },
    cardHeader: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '600',
        fontStyle: 'normal'
    },
    cardDescr: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'normal',
        fontStyle: 'normal',
        marginTop: 8
    },
    cardStart: {
        color: '#FFF',
        fontSize: 19,
        fontWeight: '500',
        fontStyle: 'normal',
        marginTop: 16
    },
    arrow: {
        height: 15,
        width: 20,
        marginLeft: 10,
        marginTop: 22
    },
    img: {
        flex: 1,
        height: 190,
    },
    newText: {
        backgroundColor: '#FFF',
        color: '#48D1CC',
        height: 16,
        width: 46,
        marginBottom: 12,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '600',
        fontStyle: 'normal'
    }
});

export default HomeCard;
