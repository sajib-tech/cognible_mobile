import React, { Component } from 'react';

import { View, Text } from 'react-native';

class TimelineView extends Component {
    constructor(props) {
        super(props);


        this.state = {

        };
    }

    render() {
        let textColor = this.props.textColor;
        if (textColor == null) {
            textColor = '#000';
        }
        return (
            <View style={styles.wrapperStyle}>
                {this.props.texts.map((text, key) => {
                    if (key == 0) {
                        let dotColor = this.props.dotColor;
                        if (dotColor == null) {
                            dotColor = '#7480FF';
                        }
                        return (
                            <View style={styles.rowStyle} key={key}>
                                <View style={[styles.dotStyle, { backgroundColor: dotColor }]}></View>
                                <Text style={[styles.textStyle, { color: textColor }]}>{text}</Text>
                            </View>
                        );
                    } else {
                        let dotColor = this.props.dotColor2;
                        if (dotColor == null) {
                            dotColor = '#7480FF';
                        }
                        return (
                            <View key={key}>
                                <View style={[styles.connectionStyle, { backgroundColor: dotColor }]}></View>
                                <View style={styles.rowStyle}>
                                    <View style={[styles.dotStyle, { backgroundColor: dotColor }]}></View>
                                    <Text style={[styles.textStyle, { color: textColor }]}>{text}</Text>
                                </View>
                            </View>
                        );
                    }
                })}
            </View>
        );
    }
}

const styles = {
    wrapperStyle: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dotStyle: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    textStyle: {
        fontSize: 14,
        paddingLeft: 5
    },
    connectionStyle: {
        backgroundColor: 'red',
        width: 2,
        height: 20,
        marginVertical: -4,
        marginLeft: 5
    }
};

export default TimelineView;
