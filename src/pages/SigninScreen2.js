import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, { Component } from 'react';
import { ApolloProvider, Mutation } from 'react-apollo';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import DeviceInfo from 'react-native-device-info';
import { CheckBox } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { database } from '../../index';
import { setLocale } from "../../locales/Locale";
import Button from '../components/Button';
import { Column, Container, Row } from '../components/GridSystem';
import { client, cogniableParentLogin } from '../constants/index';
import OrientationHelper from '../helpers/OrientationHelper';
import StudentHelper from "../helpers/StudentHelper";
import { signin } from '../redux/actions/index';
import { getAuthResult } from '../redux/reducers/index';
import Color from '../utility/Color';

// import BlogList from './BlogList';


const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class SigninScreen2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			email: '',
			password: '',
			pressed: false,
			emailTxt: '',
			pwdTxt: '',
			authResult: false,
			resultLogin: 'FAIL',
			loginErrorMessage: '',
			passwordShowIcon: 'eye',
			showPassword: true,
			isReminderPassword: false,
			isGenerating:false,
			isLoadedPost:false,
			postData:[]
		};
		this.showSignin = this.showSignin.bind(this);
	}

	componentDidMount() {
		//load from asyncstorage
		//
		this.fetchPost()
		AsyncStorage.getItem('userpass').then((result) => {
			if (result != null || result != '') {
				let data = JSON.parse(result);
				data.isReminderPassword = true
				this.setState(data);
			}
		}).catch((err) => { });
	}

	fetchPost = async () => {
		this.setState({ isLoadedPost: true });
	
		const updatePost = await database.write(async () => {
				  const post = database.get('posts').query().fetch()
				  post.then(res=>{
				    console.log("fetch>>>>",res);
					this.setState({
						postData:res
					})
				  })
				  const read=database.get('posts').query().fetchCount()
				  read.then(res=>{
					  
					  
				    console.log("res>>>",res);
		Alert.alert(`fetch ${res} records!`);

				  })
			}
			)
	
		this.setState({ isLoadedPost: false });
	  };

	generatePost = async () => {
		this.setState({ isGenerating: true });
	
		const updatePost = await database.write(async () => {
				  const postId = 'i1y8z2mllz9v6unm'
				  const post = database.get('posts').find(postId)
				  post.then(res=>{
				    res.update(()=>{
				      res.title='Testing with Title testing'
				      res.subtitle='Sub Title'
				    })
				  })
				await database.get('posts').create((post)=>{
				    post.title="Watermelon test mount new"
				  })
				  const read=database.get('posts').query().fetchCount()
				  read.then(res=>{
				    console.log("res>>>",res);
		Alert.alert(`Generated ${res} records!`);

				  })
			}
			)
	
		this.setState({ isGenerating: false });
	  };

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

	onClosePressed() {
		// this.setState({showVideoPlayer: false});
	}

	forgetPassword() {
		this.props.navigation.navigate("ForgetPassword");
	}

	renderImage() {
		return (
			<View style={{ marginHorizontal: -16 }}>
				<Image source={require('../../android/img/signin23.jpeg')} style={{ width: '100%', height: 300 }} />
			</View>
		);
	}

	renderLoginForm() {
		console.log(">>>>post Length>>>",this.state.postData.length);
		return (
			<>
				<ApolloProvider client={client}>
					<Mutation mutation={cogniableParentLogin}>
						{(loginMutation1, { data }) => (
							<View>

								{/* <Video source={{uri: "https://vimeo.com/347119375"}}   // Can be a URL or a local file.

                                  controls={true}                                     // Store reference
                                  onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                  onError={this.videoError}
                                  style={{height: 200}}/>
                                   */}
								{/* <VideoPlayer video={{uri: "https://vimeo.com/349171507/7bc5ffacc7"}} volume={0.5} onClosePressed={this.onClosePressed.bind(this)}/> */}
								<Text style={{ textAlign: 'center', color: 'red', paddingTop: 20 }}>
									{this.state.loginErrorMessage}
								</Text>
								<TextInput style={styles.input}
									placeholder="Email"
									value={this.state.email}
									onChangeText={(emailTxt) => {
										this.setState({ email: emailTxt });
										this.setState({ loginErrorMessage: '' });
									}} />
								<View style={styles.passwordInputWrapper}>
									<TextInput style={styles.passwordInput}
										placeholder="Password"
										secureTextEntry={this.state.showPassword}
										value={this.state.password}
										onChangeText={(passwordTxt) => {
											this.setState({ password: passwordTxt });
											this.setState({ loginErrorMessage: '' });
										}} />
									<TouchableOpacity style={styles.showHide}
										onPress={() => {
											this.showHidePassword();
										}}>
										<MaterialCommunityIcons name={this.state.passwordShowIcon} color={'#ccc'} size={24} />
									</TouchableOpacity>
								</View>

								<CheckBox
									containerStyle={{ margin: 0, borderWidth: 0, backgroundColor: Color.white, marginBottom: 20 }}
									title='Remember Password'
									checkedColor={Color.primary}
									checked={this.state.isReminderPassword}
									onPress={() => this.setState({ isReminderPassword: !this.state.isReminderPassword })}
								/>

								<View style={styles.continueView}>
									<Button labelButton='Sign In'
										loading={this.state.loading}
										onPress={() => {
											this.setState({ loginErrorMessage: '', loading: true }); // Hide error message , when signin button clicks

											// if (Platform.OS === "android") {
											//   console.log("Platform is android");
											//   NetInfo.fetch().then(state => {
											//     console.log("Connection type", state.type);
											//     console.log("Is connected?", state.isConnected);
											//     if(!state.isConnected){
											//       this.setState({loginErrorMessage: 'Please check your Internet connection to proceed further'});
											//        return;
											//     });
											//   }
											// }
											console.log(this.state.email);
											console.log(this.state.password);

											if (this.state.email === '' || this.state.password == '') {
												this.setState({ loginErrorMessage: 'Email or Password cannot be empty', loading: false });
												return;
											}

											loginMutation1({
												variables: {
													user: this.state.email.trim(),
													password: this.state.password.trim()
												}
											})
												.then(res => {
													console.log(res);
													// console.log(
													//   '​LoginScreen -> res.data',
													//   JSON.stringify(res.data)
													// );

													this.setState({
														resultLogin: 'SUCCESS',
													});
													return res.data;//.json();

												}).then(data => {
													console.log('​LoginScreen -> data:', data);
													AsyncStorage.setItem('usertype', data.tokenAuth.user.groups.edges[0].node.name);
													AsyncStorage.setItem('userName', data.tokenAuth.user.firstName);
													if (data.tokenAuth.user.groups.edges[0].node.name === 'parents') {
														let langData = data.tokenAuth.user.studentsSet.edges[0].node.language;
														let lanName = StudentHelper.getLanguageName(langData ? langData.name : null)
														console.log('Language', langData, lanName);
														setLocale(lanName);
														AsyncStorage.setItem("Language", lanName);
													}

													this.setState({ loading: false });

													// localStorage.setItem('user', JSON.stringify(data.data));
													// console.log("navigate to home page");
													let updatedData = data;
													updatedData.lastLoginDate = moment().format("YYYY-MM-DD HH:mm:ss");
													this.savePassword();

													this.props.navigation.navigate('SetPin', { data: updatedData });
												})
												.catch(err => {
													console.log('​LoginScreen -> err', err);
													console.log("show error info");
													this.setState({ loading: false });
													// Alert.alert(
													//     'Sign in Error',
													//     "Server error, please try again",
													//     [{
													//         text: 'OK', onPress: () => {
													//             console.log('OK Pressed');
													//             // this.goBack();
													//             // let {navigation} = this.props;
													//             // this.props.navigation.navigate('FamilyMembers');
													//         }
													//     }],
													//     { cancelable: false }
													// );
													this.showLoginError(JSON.stringify(err));
												});
										}} />

									<Button labelButton='Sign Up'
										style={{ marginTop: 10 }}
										theme='secondary'
										onPress={() => {
											this.selectSignupType('phone');
										}} />
									<Button labelButton='Generate'
										style={{ marginTop: 10 }}
										theme='secondary'
										onPress={() => {
											this.generatePost();
										}} />
										{
											!this.state.isLoadedPost && <>
											{
												this.state.postData && this.state.postData.map((item)=>{
													console.log("postData>>>",item);
													return <View><Text>{item.title}</Text></View>
												})
											}
											</>
										}
				
								</View>
							</View>
						)}
					</Mutation>
				</ApolloProvider>

				<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }} onPress={() => {
					this.forgetPassword();
				}}>
					<Text style={{ color: Color.primary }}>Forgot Password ?</Text>
				</TouchableOpacity>

				<Text style={{ textAlign: "center", marginTop: 20, color: Color.grayDarkFill, fontSize: 12 }}>App Version {DeviceInfo.getVersion()}</Text>
			</>
		);
	}

	renderFooter() {
		return (
			<>
				<View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 18 }}>
					<MaterialCommunityIcons name='shield-check-outline' color={Color.blackFont} size={18} />

					<Text style={{ color: Color.blackFont, fontSize: 14 }}>{' '}Your information is safe with us</Text>
				</View>
				<Row>
					<Column>
						<Button labelButton='Phone'
							theme='secondary'
							iconLeft={true}
							materialCommunityIconLeftName='phone-outline'
							onPress={() => {
								this.selectSignupType('phone')
							}} />
					</Column>
					<Column>
						<Button labelButton='Google'
							theme='secondary'
							iconLeft={true}
							materialCommunityIconLeftName='google'
							onPress={() => {
								this.selectSignupType('google')
							}} />
					</Column>
				</Row>
				<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 10 }} onPress={() => {
					this.showSignin();
				}}>
					<Text style={{ color: Color.blackFont }}>New here ? </Text>
					<Text style={{ color: Color.primary }}>Sign Up </Text>
				</TouchableOpacity>
				<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => {
					this.showSignin();
				}}>
					<Text style={{ color: Color.blackFont }}>Need Help ? </Text>
					<Text style={{ color: Color.primary }}>Contact Us </Text>
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
				{Platform.OS == 'android' && <StatusBar backgroundColor={Color.primary} barStyle='light-content' />}
				{Platform.OS == 'ios' && <StatusBar barStyle='dark-content' />}
				{OrientationHelper.getDeviceOrientation() == 'portrait' && (
					<>
						<ScrollView>
							<Container>
								{this.renderImage()}
								{this.renderLoginForm()}

								{/* {this.renderFooter()} */}
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
									{this.renderLoginForm()}
									{/* {this.renderFooter()} */}
								</View>
							</Column>
						</Row>
					</Container>
				)}
				{this.renderLoading()}
			</SafeAreaView>

		);
	}

	showLoginError(error) {
		console.log(error);
		console.log(typeof error);
		let errorObject = JSON.parse(error);
		console.log(errorObject);
		console.log(errorObject.graphQLErrors);
		console.log(errorObject.graphQLErrors[0].message);
		this.setState({ loginErrorMessage: errorObject.graphQLErrors[0].message });
		Alert.alert(
			'Sign in Error',
			errorObject.graphQLErrors[0].message,
			[{
				text: 'OK', onPress: () => {
					console.log('OK Pressed');
					// this.goBack();
					// let {navigation} = this.props;
					// this.props.navigation.navigate('FamilyMembers');
				}
			}],
			{ cancelable: false }
		);
		// this.state.loginErrorMessage = error;
	}

	selectSignupType(type) {
		let { navigation } = this.props;
		if (type === 'phone') {
			navigation.navigate('SignupMobile');
		} else if (type === 'google') {
			navigation.navigate('SignupEmail');
		}
	}
	showSignin() {
		let { navigation } = this.props;
		navigation.navigate('SignupEmail');
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
export default connect(mapStateToProps, mapDispatchToProps)(SigninScreen2);
