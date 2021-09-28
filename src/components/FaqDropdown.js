import React, { Component } from 'react';
import {
    View,
    Animated,
    TouchableOpacity,
    Text
} from 'react-native';
import Color from '../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class FaqDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
        }
    }

    componentDidMount() {

    }

    toggle() {
        this.setState({ isShow: !this.state.isShow });
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity activeOpacity={0.9} style={styles.header} onPress={() => {
                    this.toggle();
                }}>
                    <Text style={styles.headerText}>{this.props.header}</Text>
                    {!this.state.isShow && <MaterialCommunityIcons name='chevron-down' size={20} color={Color.black} />}
                    {this.state.isShow && <MaterialCommunityIcons name='chevron-up' size={20} color={Color.black} />}
                </TouchableOpacity>
                {this.state.isShow && (
                    <View style={styles.content}>
                        <View style={styles.line} />
                        <Text style={styles.contentText}>{this.props.content}</Text>
                    </View>
                )}
            </View>
        )
    }
}

const styles = {
    wrapper: {
        borderWidth: 1,
        borderColor: Color.primary,
        borderRadius: 5,
        marginBottom: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        color: Color.black
    },
    content: {
        paddingHorizontal: 10,
        paddingBottom: 8
    },
    contentText: {
        fontSize: 14,
        color: Color.blackFont
    },
    line: {
        height: 1,
        backgroundColor: Color.gray,
        marginBottom: 10
    }
};

export default FaqDropdown;