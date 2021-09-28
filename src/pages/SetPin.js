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
	Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Color from '../utility/Color';
import Button from '../components/Button';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { getAuthResult } from "../redux/reducers";
import { signin } from "../redux/actions";
import { connect } from "react-redux";
import { Container } from '../components/GridSystem';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class SetPin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arrPin: [1, 2, 3, 4],
			code: '',
		};
	}
	renderImage() {
		return (
			<Image
				source={require('../../android/img/logo.png')}
				style={styles.imgStyle}
			/>
		);
	}
	renderTitle = () => {
		return (
			<View style={styles.titleVw}>
				<Text style={styles.topTitle}>Set PIN</Text>
				<Text style={{ fontSize: 15, color: Color.black, marginTop: 10 }}>
					Enter your login PIN
          		</Text>
			</View>
		);
	};
	setPin = () => {
		if (this.state.code.length === 4) {
			Keyboard.dismiss();
		}
	}
	renderPinView = () => {
		return (
			<View style={styles.pinOuterVw}>
				<View style={styles.pinInnerVw}>
					<SmoothPinCodeInput
						ref={this.pinInput}
						value={this.state.code}
						onTextChange={code => {
							this.setState({ code }, () => {
								console.log('code===', this.state.code);
							});
						}}
						onFulfill={this.setPin()}
						onBackspace={this._focusePrevInput}
					/>
				</View>
			</View>
		);
	};

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<Container style={{ flex: 1 }}>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						{this.renderImage()}
						{this.renderTitle()}
						{this.renderPinView()}

						<Button
							style={{ marginTop: 50 }}
							onPress={() => {
								if (this.state.code.length === 4) {
									console.log('pin data===', this.state.code);
									AsyncStorage.setItem('userpin', this.state.code);
									const updatedData = this.props.route.params.data;
									console.log('userData===', updatedData);
									AsyncStorage.setItem('userData', JSON.stringify(updatedData));
									this.props.dispatchSignin(updatedData);
								} else {
									Alert.alert(
										'Set Pin',
										'Please Set Correct Pin',
										[{ text: 'OK', onPress: () => { }, style: 'cancel' }],
										{ cancelable: false },
									);
								}
							}}
							labelButton="Set Pin"
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
	dispatchSignin: (data) => dispatch(signin(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(SetPin);
