import React, { Component } from 'react';

import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class BehaviourDecelVideoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            videoDuration: props.videoDuration,
        };
    }
    render() {

        return (
            <View style={styles.videoCard}>
                <View style={styles.videoImageView}>
                    <FontAwesome5 name={'play-circle'} style={styles.videoPlay} />
                    <Image style={styles.videoImage} source={require('../../android/img/Image.png')} />
                </View>
                <View style={{ flex: 1, paddingLeft: 16, justifyContent: 'center' }}>
                    <Text style={styles.videoTitle}>{this.state.title}</Text>
                    <Text style={styles.videoDuration}>{this.state.videoDuration}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    videoCard: {
        flexDirection: 'row'
    },
    videoImageView: {
        width: '30%',
        backgroundColor: '#ccc',
        height: 63,
        borderRadius: 4
    },
    videoImage: {
        width: '100%',
        height: 62,
        borderRadius: 6
    },
    videoPlay: {
        position: 'absolute',
        left: 40,
        top: 25,
        fontSize: 26,
        color: '#fff',
        zIndex: 99999
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#63686E'
    },
    videoDuration: {
        fontSize: 12,
        paddingTop: 5,
        color: 'rgba(95, 95, 95, 0.75)'
    }
});
export default BehaviourDecelVideoCard;