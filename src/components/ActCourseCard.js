import React, { Component } from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Color from '../utility/Color';
import ActImageCollection from './ActImageCollection';

class ActCourseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        let images = ActImageCollection.getImage();

        this.image = images[this.props.index ? this.props.index : 0];
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => {
                this.props.onPress();
            }}>
                <Image source={this.image} style={styles.image} />

                <View style={{ marginTop: 10 }}></View>
                <View style={styles.wrapper}>
                    <View style={styles.box}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.description} numberOfLines={4}>{this.props.description}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        height: 200,
        marginBottom: 16,
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 5
    },
    wrapper: {
        flex: 1, marginHorizontal: 10,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    box: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
    },
    title: {
        fontSize: 23,
        color: Color.white,
        fontWeight: 'bold',
        marginBottom: 5
    },
    description: {
        fontSize: 13,
        color: Color.white
    }
});
export default ActCourseCard;