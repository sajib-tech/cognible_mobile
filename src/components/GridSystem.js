import React, { Component } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OrientationHelper from '../helpers/OrientationHelper';

class Container extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let additionalStyle = {};
        if (this.props.enablePadding == false) {
            additionalStyle.paddingHorizontal = 0;
        }
        return <View style={[styles.container, this.props.style, additionalStyle]}>
            {Platform.OS == 'ios' && (
                <>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            enabled
                            keyboardVerticalOffset={100}
                        >
                            {this.props.children}
                        </KeyboardAvoidingView>
                    )}
                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={"height"}
                            enabled
                            keyboardVerticalOffset={120}
                        >
                            {this.props.children}
                        </KeyboardAvoidingView>
                    )}
                </>
            )}

            {Platform.OS == 'android' && this.props.children}
        </View>;
    }
}

class Row extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <View style={[styles.row, this.props.style]}>{this.props.children}</View>;
    }
}

class Column extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <View style={[styles.column, this.props.style]}>{this.props.children}</View>;
    }
}

const styles = {
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    row: {
        marginHorizontal: -8,
        flexDirection: 'row'
    },
    column: {
        marginHorizontal: 8,
        flex: 1
    }
}


export { Container, Row, Column };
