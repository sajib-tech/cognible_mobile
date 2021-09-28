import React, { Component } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Color from "../utility/Color";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class ResponseRating extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menus: [
                { value: 3, label: "Strongly Agree" },
                { value: 2, label: "Neutral" },
                { value: 1, label: "Strongly Disagree" },
            ]
        };
    }

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
            <View>
                {this.state.menus.map((menu, key) => {
                    if (value == menu.value) {
                        return (
                            <TouchableOpacity style={styles.listItemActive} activeOpacity={0.9} key={key} onPress={() => {
                                this.props.onChange(menu.value);
                            }}>
                                <Text style={styles.listTextActive}>{menu.label}</Text>
                            </TouchableOpacity>
                        );
                    } else {
                        return (
                            <TouchableOpacity style={styles.listItem} activeOpacity={0.9} key={key} onPress={() => {
                                this.props.onChange(menu.value);
                            }}>
                                <Text style={styles.listText}>{menu.label}</Text>
                            </TouchableOpacity>
                        );
                    }
                })}
            </View>
        );
    }
}

const styles = {
    listItem: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Color.gray,
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 10
    },
    listText: {
        color: Color.blackFont,
        fontSize: 16
    },
    listItemActive: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Color.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 10
    },
    listTextActive: {
        color: Color.primary,
        fontSize: 16
    }
};