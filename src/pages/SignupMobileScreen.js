import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View, Image, Dimensions,
	Text, ActivityIndicator,
	StatusBar, TouchableOpacity, Alert, Platform,ImageBackground

} from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { signin, signin_success } from '../redux/actions/index';
import { getAuthResult } from '../redux/reducers/index';
import { ApolloProvider, Mutation } from 'react-apollo';
import { client, cogniableParentLogin } from '../constants/index';
import AppIntroSlider from 'react-native-app-intro-slider';
import Button from '../components/Button';
import { Container, Column, Row } from '../components/GridSystem';
import Color from '../utility/Color';
import OrientationHelper from '../helpers/OrientationHelper';
import DateHelper from "../helpers/DateHelper";

import moment from 'moment';
import StudentHelper from "../helpers/StudentHelper";
import { setLocale } from "../../locales/Locale";
import NavigationHeader from '../components/NavigationHeader';
import TextInput from '../components/TextInput';
import PickerModal from '../components/PickerModal';
import TherapistRequest from '../constants/TherapistRequest';
import BaseRequest from '../constants/BaseRequest';
import DateInput from '../components/DateInput';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class SignupMobileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'clinic',
			parentFirstName: '',
			parentLastName: '',
			parentEmail: '',
			parentDob: "2020-01-01",
			parentLevel: "Basic",
			parentLanguage: "UGFyZW50TGFuZ3VhZ2VzVHlwZTox",
			parentPassword: "",
			parentDefaultProgram: false,

			isSavingParent: false,

			clinicName: '',
			clinicEmail: '',
			clinicCountry: null,
			clinicPassword: '',
			clinicNoLearner: '',

			isSavingClinic: false,
			passwordShowIcon: 'eye',
			showPassword: true,

			languageList: [
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZTox", label: "English" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZToy", label: "Hindi" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZToz", label: "Kannada" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZTo0", label: "Marathi" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZTo1", label: "Bengali" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZTo2", label: "Malayalam" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZTo3", label: "Telugu" },
				{ id: "UGFyZW50TGFuZ3VhZ2VzVHlwZTo4", label: "Odiya" }
			],
			levelList: [
				{ id: "Basic", label: "Basic" },
				{ id: "Intermediate", label: "Intermediate" },
				{ id: "Advanced", label: "Advanced" },
			],
			countryList: [],
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.setState({ isLoading: true });

		BaseRequest.getCountryList().then(result => {
			console.log('result', result);
			let countryList = result.data.country.edges.map((item) => {
				return {
					id: item.node.id,
					label: item.node.name,
				};
			});
			this.setState({ countryList });
		}).catch(error => {
			console.log(error);
			Alert.alert("Error", error.toString());
			this.setState({ isLoading: false });
		});
	}

	registerParent() {
		this.setState({ isSavingParent: true });

		let { parentFirstName, parentLastName, parentEmail, parentDob, parentLevel, parentLanguage, parentPassword } = this.state;

		let vars = {
			firstname: parentFirstName,
			lastname: parentLastName,
			email: parentEmail,
			dob: parentDob,
			level: parentLevel,
			language: 'UGFyZW50TGFuZ3VhZ2VzVHlwZTox',
			password: parentPassword
		};

		console.log("Vars", vars);

		BaseRequest.parentSignUp(vars).then(result => {
			this.setState({ isSavingParent: false });
			Alert.alert(
				'Information',
				'You will be signed under CogniAble Clinic. For signing up under a different clinic or personalizing your plans please contact info@cogniable.tech',
				[
					{
						text: 'Sure', onPress: () => {
							this.props.navigation.goBack();
						}
					},
				],
				{ cancelable: false }
			);
		}).catch(error => {
			console.log(error.toString());
			console.log(JSON.parse(JSON.stringify(error)));
			if(error.toString() === 'Error: GraphQL error: This email is already registered!'){
				alert("This Email ID is already registerd with us. Please use Forgot Password to create new password.");
			}
			else{
				Alert.alert("Error", error.toString());
			}
			//Alert.alert("Error", error.toString());
			this.setState({ isSavingParent: false });
		});
	}

	registerClinic() {
		this.setState({ isSavingClinic: true });

		let { clinicName, clinicEmail, clinicCountry, clinicPassword, clinicNoLearner } = this.state;

		let vars = {
			name: clinicName,
			email: clinicEmail,
			country: clinicCountry,
			password: clinicPassword,
			no: parseInt(clinicNoLearner)
		};

		console.log("Vars", vars);

		BaseRequest.clinicSignUp(vars).then(result => {
			this.setState({ isSavingClinic: false });
			Alert.alert(
				'Information',
				'Thank you for registering as clinic.',
				[
					{
						text: 'Ok', onPress: () => {
							this.props.navigation.goBack();
						}
					},
				],
				{ cancelable: false }
			);
		}).catch(error => {
			console.log(JSON.parse(JSON.stringify(error)));
			Alert.alert("Error", error.toString());
			this.setState({ isSavingClinic: false });
		});
	}

	savePassword() {
		if (this.state.isReminderPassword) {
			AsyncStorage.setItem('userpass', JSON.stringify({
				email: this.state.email,
				password: this.state.password,
			})).then((res) => { }).catch((err) => { });
		} else {
			AsyncStorage.setItem('userpass', "").then((res) => { }).catch((err) => { });
		}
	}

	renderLoading() {
		if (this.state.loading) {
			return (
				<ActivityIndicator size="large" color="black" style={{ zIndex: 99999999, opacity: 0.8, height: screenHeight, position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }} />
			)
		} else {
			return null
		}
	}

	showHidePassword() {
		this.setState({ showPassword: !this.state.showPassword });
		this.setState({ passwordShowIcon: this.state.showPassword ? 'eye-off' : 'eye' });
	}

	register() {

	}

	renderImage() {
		return (
			<View style={{ marginHorizontal: -16 }}>
				<Image source={require('../../android/img/signin23.jpeg')} style={{ width: '100%', height: 300 }} />
			</View>
		);
	}

	renderSignupForm() {
		let { countryList, clinicName, clinicEmail, clinicCountry, clinicPassword, clinicNoLearner, isSavingClinic } = this.state;
		let { mode, parentFirstName, parentLastName, parentEmail, parentDob, parentLevel, parentLanguage, parentPassword, languageList, levelList, isSavingParent } = this.state;

		return (
			<>
				<ScrollView keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={false}
					contentInsetAdjustmentBehavior="automatic">

					<Row style={{ marginVertical: 10 }}>
						<Column>
							<Button labelButton='Clinic'
								theme={mode == 'clinic' ? 'primary' : 'secondary'}
								onPress={() => {
									this.setState({ mode: "clinic" })
								}} />
						</Column>
						<Column>
							<Button labelButton='Parent'
								theme={mode == 'parent' ? 'primary' : 'secondary'}
								onPress={() => {  Alert.alert(
									'',
									'Your account will be created under Learning Skills Academy,',
									[
									  {text: 'NO', onPress: () => alert('Contact Your Clinic Or Pediatrician to create your account')},
									  {text: 'YES', onPress: () => console.warn('cont.')},
									]
								  );
									this.setState({ mode: "parent" })
								}} />
						</Column>
					</Row>

					{mode == 'parent' && (
						<>
							<TextInput
								label='Learner First Name'
								error={this.state.parentFirstNameErrorMessage}
								placeholder={'First Name'}
								defaultValue={parentFirstName}
								onChangeText={(parentFirstName) => this.setState({ parentFirstName })}
							/>

							<TextInput
								label='Learner Last Name'
								error={this.state.parentLastNameErrorMessage}
								placeholder={'Last Name'}
								defaultValue={parentLastName}
								onChangeText={(parentLastName) => this.setState({ parentLastName })}
							/>

							<TextInput
								label='Email'
								error={this.state.parentEmailErrorMessage}
								placeholder={'Email'}
								defaultValue={parentEmail}
								onChangeText={(parentEmail) => this.setState({ parentEmail })}
							/>

							{/* <TextInput
								label='Password'
								error={this.state.parentPasswordErrorMessage}
								placeholder={'Password'}
								defaultValue={parentPassword}
								onChangeText={(parentPassword) => this.setState({ parentPassword })}
							/> */}
							<Text>Password</Text>
							<View style={styles.rown}>
									<TouchableOpacity 
										onPress={() => {
											this.showHidePassword();
										}}>
										<MaterialCommunityIcons style={styles.eye2} name={this.state.passwordShowIcon} color={'#ccc'} size={24} />
										<TextInput 
										error={this.state.parentPasswordErrorMessage}
										placeholder={'Password'}
										defaultValue={parentPassword}
										onChangeText={(parentPassword) => this.setState({ parentPassword })}
										secureTextEntry={this.state.showPassword}
										value={this.state.password}
										onChangeText={(passwordTxt) => {
											this.setState({ password: passwordTxt });
											this.setState({ loginErrorMessage: '' });
										}} />
									</TouchableOpacity>
									</View>
							<DateInput
								label='Date Of Birth'
								format='YYYY-MM-DD'
								displayFormat='dddd, DD MMM YYYY'
								value={parentDob}
								onChange={(parentDob) => {
									this.setState({ parentDob });
								}} />

							{/* <PickerModal
								label="Language"
								error={this.state.languageErrorMessage}
								selectedValue={parentLanguage}
								data={languageList}
								onValueChange={(itemValue, itemIndex) => {
									this.setState({ parentLanguage: itemValue });
								}}
							/> */}

							<PickerModal
								label="Level"
								error={this.state.levelErrorMessage}
								selectedValue={parentLevel}
								data={levelList}
								onValueChange={(itemValue, itemIndex) => {
									this.setState({ parentLevel: itemValue });
								}}
							/>
						</>
					)}

					{mode == 'clinic' && (
						<>
							<TextInput
								label='Clinic Name'
								error={this.state.clinicNameErrorMessage}
								placeholder={'First Name'}
								defaultValue={clinicName}
								onChangeText={(clinicName) => this.setState({ clinicName })}
							/>

							<TextInput
								label='Email'
								error={this.state.clinicEmailErrorMessage}
								placeholder={'Email'}
								defaultValue={clinicEmail}
								onChangeText={(clinicEmail) => this.setState({ clinicEmail })}
							/>
                                 <Text>Password</Text>
									<TouchableOpacity 
										onPress={() => {
											this.showHidePassword();
										}}>
										<MaterialCommunityIcons style={styles.eye2} name={this.state.passwordShowIcon} color={'#ccc'} size={24} />
										<TextInput 
										error={this.state.parentPasswordErrorMessage}
										placeholder={'Password'}
										defaultValue={parentPassword}
										onChangeText={(parentPassword) => this.setState({ parentPassword })}
										secureTextEntry={this.state.showPassword}
										value={this.state.password}
										onChangeText={(passwordTxt) => {
											this.setState({ password: passwordTxt });
											this.setState({ loginErrorMessage: '' });
										}} />
									</TouchableOpacity>
									

							<PickerModal
								label="Country"
								error={this.state.clinicCountryErrorMessage}
								selectedValue={clinicCountry}
								data={countryList}
								onValueChange={(clinicCountry, itemIndex) => {
									this.setState({ clinicCountry });
								}}
							/>

							<TextInput
								label='Number of Learner'
								error={this.state.clinicNoLearnerErrorMessage}
								placeholder={'Number'}
								defaultValue={clinicNoLearner}
								onChangeText={(clinicNoLearner) => this.setState({ clinicNoLearner })}
							/>
						</>
					)}
				</ScrollView>

				{mode == 'parent' && (
					<Button labelButton='Submit'
						style={{ marginTop: 10 }}
						isLoading={isSavingParent}
						onPress={() => {
							this.registerParent();
						}} />
				)}

				{mode == 'clinic' && (
					<Button labelButton='Submit'
						style={{ marginTop: 10 }}
						isLoading={isSavingClinic}
						onPress={() => {
							this.registerClinic();
						}} />
				)}

				<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 20 }} onPress={() => {
					this.props.navigation.goBack();
				}}>
					<Text style={{ color: Color.primary }}>Back</Text>
				</TouchableOpacity>
			</>
		);
	}

	_renderItem({ item }) {
		return (
			<View style={styles.slideStyle}>
				<Image source={item.image} style={{ width: '100%', height: screenHeight - 350 }} resizeMode='cover' />
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
				text: 'Cogniable provides ABA , occupational and special education programs for kids with autism which helps develop language , communication skills. Improve social skills , comprehension skills and academics.',
				image: require('../../android/img/walkthrough.jpeg'),
				backgroundColor: '#FFFFFF',
			},
			{
				key: 2,
				title: 'Early Screening can rehabilitate autism',
				text: 'Early screening  is your child’s best hope for the future. Early detection makes you one step closer to seek intervention at an initial phase.',
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
				<StatusBar backgroundColor={Color.primary} barStyle='light-content' />

				<NavigationHeader
					title='Sign Up'
					backPress={() => {
						this.props.navigation.goBack();
					}}
				/>

				{OrientationHelper.getDeviceOrientation() == 'portrait' && (
					<>
						<Container>
							{this.renderSignupForm()}
						</Container>
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
									{this.renderSignupForm()}
								</View>
							</Column>
						</Row>
					</Container>
				)}
				{this.renderLoading()}
			</SafeAreaView>

		);
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
		marginBottom: 16,

		height: 40
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
		marginBottom: 5,
		alignItems: 'center',

		height: 40
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
	eyeinput:{
		borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 15,
		color: Color.grayFill,
	},
	eye2:{
		position:'absolute',
		right:10,
		zIndex:10,
		top:20
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
export default connect(mapStateToProps, mapDispatchToProps)(SignupMobileScreen);