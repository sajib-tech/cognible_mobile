import React, { Component } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from '../utility/Color.js';
import Styles from '../utility/Style.js';
import { borderRadius } from 'react-select/src/theme';

class Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // show: false
        }
    }

    getColorByTheme(theme) {
        if (theme == 'primary' || theme == null) {
            return {
                textStyle: {
                    color: Color.white,
                },
                buttonStyle: {
                    backgroundColor: Color.primary
                }
            };
        } else if (theme == 'secondary') {
            return {
                textStyle: {
                    color: Color.primary,
                },
                buttonStyle: {
                    backgroundColor: Color.white,
                    borderWidth: 1,
                    borderColor: Color.primary
                }
            };
        } else if (theme == 'danger') {
            return {
                textStyle: {
                    color: Color.danger,
                },
                buttonStyle: {
                    backgroundColor: Color.white,
                    borderWidth: 1,
                    borderColor: Color.danger
                }
            };
        } else if (theme == 'danger-block') {
            return {
                textStyle: {
                    color: Color.white,
                },
                buttonStyle: {
                    backgroundColor: Color.danger,
                    borderWidth: 1,
                    borderColor: Color.danger
                }
            };
        } else {
            return {
                textStyle: {
                    color: Color.white,
                },
                buttonStyle: {
                    backgroundColor: Color.primary
                }
            };
        }
    }

    render() {
        let isLoading = false;
        if (this.props.isLoading == true) {
            isLoading = true;
        }

        let { textStyle, buttonStyle } = this.getColorByTheme(this.props.theme);

        if (isLoading) {
            return (
                <View style={[styles.buttonStyle, buttonStyle, this.props.style, { opacity: 0.7 }]}>
                    <ActivityIndicator color={textStyle.color} size='large' />
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.buttonStyle, buttonStyle, this.props.style]}
                disabled={this.props.disabled}
                activeOpacity={0.9}
                onPress={this.props.onPress}>
                {this.props.iconLeft == true && (
                    <View style={[styles.icon, this.props.styleIconLeft]}>
                        {this.props.iconLeftName != null && (
                            <Ionicons name={this.props.iconLeftName}
                                color={textStyle.color}
                                size={this.props.iconSize != null ? this.props.iconSize : 20}
                            />
                        )}
                        {this.props.materialCommunityIconLeftName != null && (
                            <MaterialCommunityIcons name={this.props.materialCommunityIconLeftName}
                                color={textStyle.color}
                                size={this.props.iconSize != null ? this.props.iconSize : 20}
                            />
                        )}
                        {this.props.materialIconLeftName != null && (
                            <MaterialIcons name={this.props.materialIconLeftName}
                                color={textStyle.color}
                                size={this.props.iconSize != null ? this.props.iconSize : 20}
                            />
                        )}
                    </View>

                )}
                {this.props.labelButton != null && (
                    <Text style={[styles.textStyle, textStyle]}>{this.props.labelButton}</Text>
                )}
                {this.props.iconRight == true && (
                    <View style={styles.icon}>
                        {this.props.iconRightName != null && (
                            <Ionicons name={this.props.iconRightName}
                                color={textStyle.color}
                                size={this.props.iconSize != null ? this.props.iconSize : 20}
                            />
                        )}
                        {this.props.materialCommunityIconRightName != null && (
                            <MaterialCommunityIcons name={this.props.materialCommunityIconRightName}
                                color={textStyle.color}
                                size={this.props.iconSize != null ? this.props.iconSize : 20}
                            />
                        )}
                        {this.props.materialIconRightName != null && (
                            <MaterialIcons name={this.props.materialIconRightName}
                                color={textStyle.color}
                                size={this.props.iconSize != null ? this.props.iconSize : 20}
                            />
                        )}
                    </View>
                )}
            </TouchableOpacity>
        )
    }
}
const styles = {
    buttonStyle: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderRadius: 5
        // flex: 1,
        // flexDirection: 'row',
        // height: 40,
        // backgroundColor: Color.button,
        // // paddingHorizontal: 15,
        // padding: 10,
        // justifyContent: 'center', alignItems: 'center', marginVertical: 8,
        // elevation: 3, borderWidth: 1
    },
    icon: {
        width: 30, height: 30,
        // marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // alignItems: 'center'
    }
}


export default Button;