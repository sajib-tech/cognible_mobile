import React, { Component } from "react";
import { View, Text, TextInput as DefaultTextInput } from "react-native";
import Color from "../utility/Color";

export default class TextInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let disabledInput = null;
        if (this.props.editable == false) {
            disabledInput = {
                backgroundColor: Color.gray
            };
        }
        return (
            <View style={styles.wrapper}>
                {this.props.label != null && <Text style={styles.label}>{this.props.label}</Text>}
                {(this.props.error != "" && this.props.error != null) && (
                    <Text style={styles.errorText}>{this.props.error}</Text>
                )}
                <DefaultTextInput
                    {...this.props}
                    textAlignVertical='center'
                    style={[styles.input, disabledInput, this.props.style]}
                />
            </View>
        );
    }
}

const styles = {
    wrapper: {
        marginTop: 5,
        marginBottom: 15,
    },
    label: {
        color: Color.grayFill,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 15,
        color: Color.grayFill
    },
    errorText: {
        color: Color.danger
    },
};