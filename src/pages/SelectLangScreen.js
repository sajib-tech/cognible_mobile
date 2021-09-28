import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View, Image, Dimensions,
	Text, TextInput, ActivityIndicator,
	StatusBar, TouchableOpacity, Alert, Platform
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { signin, signin_success } from '../redux/actions/index';
import { getAuthResult } from '../redux/reducers/index';
import { ApolloProvider, Mutation } from 'react-apollo';
import { client, cogniableParentLogin } from '../constants/index';
import Button from '../components/Button';
import { Container, Column, Row } from '../components/GridSystem';
import Color from '../utility/Color';
import OrientationHelper from '../helpers/OrientationHelper';
import { getStr, setLocale } from '../../locales/Locale';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class SelectLangScreen extends Component {
	constructor(props) {
		super(props);
		this.state = { pressed: false, language: 'english' };
		this.selectLang = this.selectLang.bind(this);
		this.showSignin = this.showSignin.bind(this);
	}

	renderImage() {
		return (
			<View style={{ marginHorizontal: -16 }}>
				<Image source={require('../../android/img/image_9.png')} style={{ width: '100%', height: 300 }} />
			</View>
		);
	}

	renderForm() {
		return (
			<>
				<Text style={{ fontSize: 18, color: Color.black, marginTop: 20 }}>Select Your Language</Text>
				<Row style={{ marginVertical: 20 }}>
					<Column>
						<Button labelButton={getStr('lang.english')}
							style={{ backgroundColor: Color.black }}
							onPress={() => {

							}} />
					</Column>
					{/* <Column>
						<Button labelButton={getStr('lang.hindi')}
							style={{ backgroundColor: "#ddd", borderWidth: 0 }}
							theme='secondary'
							onPress={() => {

							}} />

						<Text style={{ textAlign: 'center', color: Color.black, marginTop: 5 }}>Coming Soon</Text>
					</Column> */}
				</Row>
				<View style={{}}>
					<Button labelButton={getStr("lang.continue_btn")}
						onPress={() => this.showSignin()} />
				</View>
			</>
		);
	}

	_renderItem({ item }) {
		return (
			<View style={styles.slideStyle}>
				<Image source={item.image} style={{ width: '100%', height: screenHeight - 250 }} resizeMode='cover' />
				<Text style={styles.slideTitle}>{item.title}</Text>
				<Text style={styles.slideSubtitle}>{item.text}</Text>
			</View>
		);
	}

	renderSlide() {
		const slides = [
			{
				key: 1,
				title: 'Autism Therapy at home',
				text: 'Cogniable provides ABA , occupational and special education programs for kids with autism which helps develop language , communication skills. Improve social skills , comprehension skills and academics',
				image: require('../../android/img/walkthrough.jpeg'),
				backgroundColor: '#FFFFFF',
			},
			{
				key: 2,
				title: 'Early Screening can rehabilitate autism',
				text: 'Early screening  is your child’s best hope for the future. Early detection makes you one step closer to seek intervention at an initial phase',
				image: require('../../android/img/walkthrough22.jpeg'),
				backgroundColor: '#FFFFFF',
			},
			{
				key: 3,
				title: 'Acceptance and Commitment',
				text: 'Therapy for children and parents to deal with anxiety , turbulence , inner emotional conflicts by accepting  issues ,hardships and commit to make necessary changes in behavior, regardless of what is going on.',
				image: require('../../android/img/walkthrough33.jpeg'),
				backgroundColor: '#FFFFFF',
			}
		];

		return <AppIntroSlider renderItem={this._renderItem} data={slides}
			activeDotStyle={{ backgroundColor: Color.primary, width: 40, height: 5 }}
			dotStyle={{ width: 20, backgroundColor: Color.gray, height: 5 }}
		// dotStyle={{ backgroundColor: "#3E7BFA", opacity: 0.3 }}
		/>
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				{OrientationHelper.getDeviceOrientation() == 'portrait' && (
					<>
						<ScrollView contentInsetAdjustmentBehavior="automatic">
							<Container>
								{this.renderImage()}
								{this.renderForm()}
							</Container>
						</ScrollView>
					</>
				)}
				{OrientationHelper.getDeviceOrientation() == 'landscape' && (
					<Container>
						<Text style={styles.title}>Sign In</Text>
						<Row style={{ flex: 1 }}>
							<Column style={{ flex: 2 }}>
								{this.renderSlide()}
							</Column>
							<Column style={{ justifyContent: 'center' }}>
								<View style={{ paddingBottom: 100 }}>
									{this.renderForm()}
								</View>
							</Column>
						</Row>
					</Container>
				)}
			</SafeAreaView>

		);
	}

	selectLang(lang) {
		console.log("lang:" + lang);
		// if (lang === 'hindi') {
		// 	setLocale('ind');
		// }
		// if (lang === 'english') {
		// 	setLocale('en');
		// }
		this.props.changeLanguage(lang);
		this.setState({ language: lang });
	}

	showSignin() {
		let { navigation } = this.props;
		navigation.navigate("Signin2");
	}
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: '#ecf0f1',
	},
	input: {
		fontSize: 18,
		color: '#10253C',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		backgroundColor: Color.white,
		borderRadius: 6,
		paddingHorizontal: 16,
		marginBottom: 16
	},
	passwordInputWrapper: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		backgroundColor: Color.white,
		borderRadius: 6,
		paddingHorizontal: 16,
		flexDirection: 'row',
		marginBottom: 30,
		alignItems: 'center'
	},
	passwordInput: {
		flex: 1,
		fontSize: 18,
		color: '#10253C',
	},
	showHide: {
		width: 50,
		alignItems: "flex-end"
	},
	title: {
		fontSize: 18,
		color: Color.blackFont,
		textAlign: 'center',
		marginTop: 10
	},
	slideStyle: {
		flex: 1,

		justifyContent: 'center'
	},
	slideTitle: {
		fontSize: 18,
		color: Color.blackFont,
		marginVertical: 10
	},
	slideSubtitle: {
		fontSize: 15,
		color: Color.grayFill,
	},
});

const mapStateToProps = (state) => ({
	authResult: getAuthResult(state)
});
const mapDispatchToProps = (dispatch) => ({
	dispatchSignin: (data) => dispatch(signin(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(SelectLangScreen);
