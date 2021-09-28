import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    SafeAreaView,
    Image,
    Text,
    TextInput,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Color from '../utility/Color';
import Button from '../components/Button';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { getAuthResult } from "../redux/reducers";
import { getpin, signout } from "../redux/actions";
import { connect } from "react-redux";
import { Container } from '../components/GridSystem';
import { setLocale } from "../../locales/Locale";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class GetPin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrPin: [1, 2, 3, 4],
            code: '',
        };
    }
    renderImage() {
        return (
            <View>
                <Image
                    source={require('../../android/img/logo.png')}
                    style={styles.imgStyle}
                />
            </View>
        );
    }
    renderTitle = () => {
        return (
            <View style={styles.titleVw}>
                <Text style={{ fontSize: 15, color: Color.black, marginTop: 10 }}>
                    Enter your login PIN
                </Text>
            </View>
        );
    };
    renderPinView = () => {
        return (
            <View style={styles.pinOuterVw}>
                <View style={styles.pinInnerVw}>
                    <SmoothPinCodeInput
                        autoFocus={true}
                        ref={this.pinInput}
                        value={this.state.code}
                        onTextChange={code => {
                            this.setState({ code }, () => {
                                console.log('code===', this.state.code);
                                this.checkPin();
                            });
                        }}
                        onFulfill={this._checkCode}
                        onBackspace={this._focusePrevInput}
                    />
                </View>
            </View>
        );
    };

    checkPin() {
        if (this.state.code.length === 4) {
            AsyncStorage.getItem('userpin')
                .then(result => {
                    if (result != null || result != '') {
                        let data = JSON.parse(result);
                        console.log("userpin==", data, this.state.code)
                        if (data.toString() !== this.state.code.toString()) {
                            Alert.alert(
                                'Set Pin',
                                'Please Set Correct Pin',
                                [{ text: 'OK', onPress: () => { }, style: 'cancel' }],
                                { cancelable: false },
                            );
                        } else {
                            console.log("usertype==", result)
                            AsyncStorage.getItem('userData')
                                .then(resulta => {
                                    console.log("usertype sarthak==", JSON.parse(resulta).tokenAuth)

                                    if (JSON.parse(resulta).tokenAuth.user.groups.edges[0].node.name === 'parents') {
                                        AsyncStorage.getItem('Language')
                                            .then(result => {
                                                console.log("get language Name===", result)
                                                setLocale(result.toString());
                                                if (resulta != null || resulta != '') {
                                                    this.props.dispatchSignin({ userData: JSON.parse(resulta) });
                                                }
                                            })
                                    } else {
                                        if (resulta != null || resulta != '') {
                                            setLocale('en')
                                            this.props.dispatchSignin({ userData: JSON.parse(resulta) });
                                        }
                                    }
                                }).catch(err => { })
                        }
                    }
                })
                .catch(err => { });
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <Container style={{ justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        {this.renderImage()}
                        {this.renderTitle()}
                        {this.renderPinView()}
                    </View>
                    <View style={styles.continueView}>
                        <Button
                            disabled={this.state.code.length != 4}
                            style={{ opacity: this.state.code.length != 4 ? 0.4 : 1 }}
                            onPress={() => {
                                this.checkPin()
                            }}
                            labelButton="Enter Pin"
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            theme='danger'
                            onPress={() => {
                                this.props.dispatchSignout();
                            }}
                            labelButton="Log Out"
                        />
                    </View>
                </Container>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    imgStyle: {
        width: screenWidth - 50,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 0,
    },
    titleVw: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Color.black,
        marginTop: 30,
    },
    subTitle: {
        fontSize: 15,
        color: Color.black,
        marginTop: 10,
    },
    pinOuterVw: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
        width: '100%',
        paddingHorizontal: 30,
    },
    pinInnerVw: {
        height: 60,
        flexDirection: 'row',
    },
    pinVw: {
        width: '20%',
        height: '100%',
        marginHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    pinText: {
        height: '100%',
        width: '100%',
        fontSize: 20,
    },
    continueView: {
        marginTop: 100,
    },
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});
const mapDispatchToProps = (dispatch) => ({
    dispatchSignin: (data) => dispatch(getpin(data)),
    dispatchSignout: data => dispatch(signout(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GetPin);
