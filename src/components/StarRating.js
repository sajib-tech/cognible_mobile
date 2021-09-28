import React, { Component } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Color from "../utility/Color";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class StarRating extends Component {
    render() {
        let value = this.props.value;
        if (value == null) {
            value = 0;
        }
        let size = this.props.size;
        if (size == null) {
            size = 30;
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((item, key) => {
                    return (
                        <TouchableOpacity activeOpacity={0.9} key={key} onPress={() => {
                            this.props.onChange(item);
                        }}>
                            {item <= value && <MaterialIcons name='star' size={size} color={Color.yellow} />}
                            {item > value && <MaterialIcons name='star' size={size} color={Color.gray} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

const styles = {
    modalRoot: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    modalContent: {
        width: 300,
        padding: 16,
        borderRadius: 5,
        backgroundColor: Color.white
    },
};