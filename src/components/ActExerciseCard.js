import React, { Component } from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Color from '../utility/Color';

class ActExerciseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => {
                this.props.onPress();
            }}>
                <Image source={this.props.image} style={styles.image} />

                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.description} numberOfLines={3}>{this.props.description}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Color.white,
        margin: 3,
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
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
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginRight: 10
    },
    title: {
        fontSize: 18,
        marginBottom: 5
    },
    description: {
        fontSize: 13,
        color: Color.grayDarkFill
    }
});
export default ActExerciseCard;