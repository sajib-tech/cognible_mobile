import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Overlay } from 'react-native-elements';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	Switch,
	Dimensions,
	RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import store from '../../../redux/store';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import Button from '../../../components/Button';

import { getAuthResult, getAuthTokenPayload } from '../../../redux/reducers/index';
import ParentRequest from '../../../constants/ParentRequest';

import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';

import { connect } from 'react-redux';
import { setToken, signout, setParentProfile, languageChange } from '../../../redux/actions/index';
import { getStr, setLocale } from '../../../../locales/Locale';
import StudentHelper from '../../../helpers/StudentHelper';
import moment from 'moment';
import NoData from '../../../components/NoData';
// import { NavigationActions, StackActions } from "react-navigation";
import ClinicRequest from "../../../constants/ClinicRequest";
import DeviceInfo from 'react-native-device-info';
import {NavigationAction, StackActions, CommonActions} from '@react-navigation/native'


const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			familyMembers: [],
			languages: [],
			allLanguages: [],
			currentLanguage: '',
			languageId: '',
			noFamilyMembers: '',
			studentProfile: {},
			accountSettings: {},
			parentId: '',
			isEditingProfile: false,
			email: '',
			phone: '',
			tempEmail: '',
			tempPhone: '',
			clinicName: '',
			medicalReminder: false,
			sessionReminder: false,
			recordingReminder: false,
			isPeakType: false,
			userId: '',
		};
		this.gotoNewFamilyMember = this.gotoNewFamilyMember.bind(this);
		this.props.dispatchSetProfileData(this);
	}
	componentWillUnmount() {
		//remove from redux
		this.props.dispatchSetProfileData(null);
	}
	_refresh() {
		this.setState({ isLoading: false });
		this.componentDidMount();
	}

	componentDidMount() {
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		this.getFamilyMembersList();
		this.getProfileInfo();
		this.getLanguage();
	}

	componentWillMount() {

	}

	gotoCareAdvisor() {
		console.log('gotoCareAdvisor() is called');
		let { navigation } = this.props;
		navigation.navigate('CareAdvisorScreen');
	}

	gotoNewFamilyMember() {
		let { navigation } = this.props;
		navigation.navigate('NewFamilyMember');
	}

	getLanguage() {
		ParentRequest.getLanguage()
			.then(profiledata => {
				console.log(
					'getLanguageNewFinal' + JSON.stringify(profiledata.data.languages),
				);
				this.setState({ allLanguages: profiledata.data.languages });
				const alllanguages = [];
				profiledata.data.languages.map(item => {
					alllanguages.push(item.name);
				});
				this.setState({ languages: [...alllanguages, 'cancel'] });
			})
			.catch(err => {
				console.log('errorLanguage===', err);
			});
	}

	getProfileInfo() {
		let storeState = store.getState();

		this.setState({ isLoading: true });

		let variables = {
			studentId: storeState.user.student.id,
		};
		console.log('Vars', variables);
		ParentRequest.fetchUserProfile(variables)
			.then(profileData => {
console.error('fetchUserProfile', profileData);
				this.getPeakType(profileData.data.student.parent.id)
				this.setState({
					isLoading: false,
					studentProfile: profileData.data.student,
					email: profileData.data.student.email,
					phone: profileData.data.student.parentMobile ? profileData.data.student.parentMobile : "",
					parentId: profileData.data.student.parent.id,
					currentLanguage: profileData.data.student.language ? profileData.data.student.language.name : 'English',
					clinicName: profileData.data.student.school.schoolName,
					userId: profileData.data.student.parent.id
				});
				this.getAccountSettings(profileData.data.student.parent.id);
			})
			.catch(error => {
				this.setState({ isLoading: false });
				console.log(error, error.response);

				Alert.alert('Information', error.toString());
			});
	}

	getPeakType(userId) {
		this.setState({ isLoading: true });
		let variables = {
			user: userId,
		}
		ClinicRequest.getProfileSetting(variables).then(profileData => {
			console.log('getPeakProfileData===', profileData);
			if(profileData.data.userSettings.edges.length > 0){
				this.setState({isPeakType:profileData.data.userSettings.edges[0].node.peakAutomaticBlocks})
			} else {
				this.setState({isPeakType: false})
			}
		}).catch(error => {
			console.log('getPeakProfileError===',error);
			this.setState({ isLoading: false });
		});
	}

	setPeakType(){
		let variables = {
			user: this.state.userId,
			peakAutomaticBlocks: this.state.isPeakType
		}
		// // debugger;
		ClinicRequest.updateProfileSetting(variables).then(profileData => {
			// // debugger;
			console.log('getPeakProfileData===', profileData);
		}).catch(error => {
			// // debugger;
			console.log('getPeakProfileError===',error);

		});
	}

	getAccountSettings(parentId) {
		this.setState({ isLoading: true });
		let variables = {
			userId: parentId,
		};
		ParentRequest.fetchUserProfileSettings(variables)
			.then(accountSettingsData => {
				console.log(
					'getAccountSettings():' + JSON.stringify(accountSettingsData),
				);
				this.setState({ isLoading: false });
				if (accountSettingsData.data.userSettings.edges.length > 0) {
					this.setState({
						medicalReminder:
							accountSettingsData.data.userSettings.edges[0].node
								.medicalReminders,
						sessionReminder:
							accountSettingsData.data.userSettings.edges[0].node
								.sessionReminders,
						recordingReminder:
							accountSettingsData.data.userSettings.edges[0].node
								.dataRecordingReminders,
					});
				}
			})
			.catch(error => {
				this.setState({ isLoading: false });
				console.log(error, error.response);

				Alert.alert('Information', error.toString());
			});
	}

	getFamilyMembersList() {
		this.setState({ isLoading: true });
		let variables = {
			student: store.getState().studentId,
		};
		ParentRequest.fetchFamilyMembers(variables)
			.then(familyMembersData => {
				this.setState({ isLoading: false });
				console.log('getFamilyMembersList():', familyMembersData);
				if (familyMembersData.data.family.edges.length > 0) {
					let members =
						familyMembersData.data.family.edges[0].node.members.edges;
					this.setState({ familyMembers: members });
				} else {
					this.setState({ noFamilyMembers: 'No family members were added' });
				}
			})
			.catch(error => {
				this.setState({ isLoading: false });
				console.log(error, error.response);

				Alert.alert('Information', error.toString());
			});
	}

	getView(familyMember, key) {
		return (
			<TouchableOpacity
				onPress={() => {
					this.props.navigation.navigate('FamilyMemberDetails', {
						memberId: familyMember.id,
					});
				}}
				activeOpacity={0.9}
				key={key}>
				<View style={styles.memberCard}>
					<Image
						style={{ width: 50, height: 50, borderRadius: 6 }}
						source={require('../../../../android/img/ravi.jpg')}
					/>
					<View style={{ paddingLeft: 16 }}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								color: '#3E7BFA',
							}}>
							{familyMember.memberName}
						</Text>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: 'normal',
								fontSize: 14,
								color: '#45494E',
							}}>
							{familyMember.relationship.name}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	signOut() {
		Alert.alert(
			'Information',
			'Are you sure want to sign out ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes',
					onPress: () => {
						this.props.dispatchSignout();
					},
				},
			],
			{ cancelable: false },
		);
	}
	updateRecordingReminder(changedValue) {
		this.setState({ isLoading: true });
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		let variables = {
			userId: this.state.parentId,
			status: changedValue,
		};
		ParentRequest.updateDataRecordingReminder(variables)
			.then(recordingData => {
				console.log('recordingData():' + JSON.stringify(recordingData));
				this.setState({ isLoading: false });
			})
			.catch(error => {
				this.setState({ isLoading: false });
				console.log(error, error.response);

				Alert.alert('Information', error.toString());
			});
	}

	updateSessionReminder(changedValue) {
		this.setState({ isLoading: true });
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		let variables = {
			userId: this.state.parentId,
			status: changedValue,
		};
		ParentRequest.updateDataSessionReminder(variables)
			.then(sessionData => {
				console.log('sessionData():' + JSON.stringify(sessionData));
				this.setState({ isLoading: false });
			})
			.catch(error => {
				this.setState({ isLoading: false });
				console.log(error, error.response);

				Alert.alert('Information', error.toString());
			});
	}

	updateMedicalReminder(changedValue) {
		console.log('changedValue: ' + changedValue);
		this.setState({ isLoading: true });
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		let variables = {
			userId: this.state.parentId,
			status: changedValue,
		};
		ParentRequest.updateDataMedicalReminder(variables)
			.then(medicalData => {
				console.log('medicalData():' + JSON.stringify(medicalData));
				this.setState({ isLoading: false });
			})
			.catch(error => {
				this.setState({ isLoading: false });
				console.log(error, error.response);

				Alert.alert('Information', error.toString());
			});
	}
	updateProfileInfo() {
		console.log('abcd===');
		this.setState({ isLoading: true });
		let variables = {
			studentId: store.getState().studentId,
			language: this.state.languageId,
			phone: this.state.phone,
			email: this.state.email,
		};
		console.log('updateProfileInfo() variables:' + JSON.stringify(variables));
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		ParentRequest.updateUserProfileSettings(variables)
			.then(profileData => {
				console.log('profileData():' + JSON.stringify(profileData));
				this.setState({
					isLoading: false,
					isEditingProfile: false,
					currentLanguage: profileData.data.updateStudent.student.language.name,
				});
				const lanName = StudentHelper.getLanguageName(
					profileData.data.updateStudent.student.language.name,
				);
				Alert.alert('Information', 'Successfully updated');
				this.getProfileInfo();
				console.log('lName===', lanName);
				setLocale(lanName);
				AsyncStorage.setItem('Language', lanName.toString());
				this.props.dispatchLanguage();

				// const resetAction = CommonActions.reset({
				// 	index: 0,
				// 	actions: [NavigationActions.navigate({ routeName: 'GetPin' })],
				// });

				this.props.navigation.replace("GetPin")

				// this.props.navigation.dispatch(resetAction);
			})
			.catch(error => {
				this.setState({ isLoading: false, isEditingProfile: false });
				console.log('errorLanguage===', error);

				Alert.alert('Information', error.toString());
			});
	}

	getProfileEditForm() {
		return (
			<View style={{ borderWidth: 0.5, borderColor: '#cfcfcf', padding: 5 }}>
				<Text>{getStr('Profile.Email')}</Text>
				<TextInput
					style={styles.input}
					value={this.state.email}
					onChangeText={emailText => {
						this.setState({ email: emailText });
					}}
				/>
				<Text>{getStr('Profile.Phone_number')}</Text>
				<TextInput
					style={styles.input}
					value={this.state.phone}
					maxLength={10}
					keyboardType={'numeric'}
					onChangeText={phoneText => {
						this.setState({ phone: phoneText });
					}}
				/>
				<Text
					style={{
						width: '100%',
						borderRadius: 4,
						color: '#FFFFFF',
						backgroundColor: '#3E7BFA',
						padding: 10,
						textAlign: 'center',
					}}
					onPress={() => {
						this.updateProfileInfo();
					}}>
					{getStr('Profile.Update')}
				</Text>
			</View>
		);
	}

	renderProfile() {
		return (
			<>
				<View style={styles.profile}>
					<Image
						style={{ width: 56, height: 56, borderRadius: 8 }}
						source={require('../../../../android/img/Img-1.png')}
					/>
					<View style={{ flex: 1, marginHorizontal: 8 }}>
						<Text style={[styles.textBig, { fontSize: 18, fontWeight: 'bold' }]}>
							{store.getState().user.student.firstname}
						</Text>
						<Text style={Styles.bigGrayText}>{this.state.clinicName}</Text>
					</View>
				</View>
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.navigate('CareAdvisorScreen');
					}}>
					<View style={styles.help}>
						<View style={styles.helpTitleBox}>
							<Text
								style={{
									width: '70%',
									textAlign: 'left',
									fontFamily: 'SF Pro Text',
									fontStyle: 'normal',
									fontWeight: '500',
									fontSize: 18,
								}}>
								{getStr('Profile.Need_Help_?')}
							</Text>
							<Text style={{ width: '30%', textAlign: 'right' }}>
								<MaterialCommunityIcons
									name={'arrow-right'}
									size={20}
									color={Color.grayFill}
								/>
							</Text>
						</View>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: 'normal',
								fontSize: 16,
								color: 'rgba(95, 95, 95, 0.75)',
							}}>
							{getStr('Profile.Help_text')}
						</Text>
					</View>
				</TouchableOpacity>
			</>
		);
	}

	renderFamily() {
		let { isLoading, familyMembers, noFamilyMembers } = this.state;
		return (
			<View>
				<View
					style={{
						flexDirection: 'row',
						marginBottom: 5,
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<Text
						style={{
							width: '50%',
							textAlign: 'left',
							fontFamily: 'SF Pro Text',
							fontStyle: 'normal',
							fontWeight: '500',
							fontSize: 18,
						}}>
						{getStr('Profile.Family_Members')}
					</Text>
					<TouchableOpacity onPress={this.gotoNewFamilyMember}>
						<MaterialCommunityIcons
							name={'plus'}
							style={{ fontSize: 20 }}
							color={Color.primary}
						/>
					</TouchableOpacity>
				</View>
				{familyMembers.length === 0 && (
					<NoData>
						{noFamilyMembers}
					</NoData>
				)}
				{familyMembers &&
					familyMembers
						.slice(0)
						.reverse()
						.map((element, index) => this.getView(element.node, index))}
			</View>
		);
	}

	renderPersonalDetail() {
		let {
			isLoading,
			email,
			phone,
			tempEmail,
			tempPhone,
			isEditingProfile,
		} = this.state;
		return (
			<>
				<TouchableOpacity style={[Styles.rowBetween, { marginVertical: 8 }]}>
					<Text style={Styles.bigGrayText}>
						{getStr('Profile.Personal_Details')}
					</Text>
					<MaterialCommunityIcons
						name={isEditingProfile ? 'close' : 'account-edit'}
						size={24}
						color={Color.primary}
						onPress={() => {
							if (isEditingProfile) {
								this.setState({ email: tempEmail, phone: tempPhone });
							} else {
								this.setState({ tempEmail: email, tempPhone: phone });
							}
							this.setState({ isEditingProfile: !isEditingProfile });
						}}
					/>
				</TouchableOpacity>
				{isEditingProfile && this.getProfileEditForm()}
				{!isEditingProfile && (
					<>
						<View
							style={[
								Styles.row,
								{ alignItems: 'flex-start', marginVertical: 8 },
							]}>
							<MaterialCommunityIcons
								name="email-outline"
								size={20}
								color={Color.grayFill}
								style={{ width: 20, marginRight: 8 }}
							/>
							<View style={Styles.column}>
								<Text style={Styles.grayText}>
									{getStr('Profile.Email_Address')}
								</Text>
								<Text style={[Styles.primaryText, { marginVertical: 4 }]}>
									{this.state.email}
								</Text>
							</View>
						</View>
						<View
							style={[
								Styles.row,
								{ alignItems: 'flex-start', marginVertical: 8 },
							]}>
							<MaterialCommunityIcons
								name="phone-outline"
								size={20}
								color={Color.grayFill}
								style={{ width: 20, marginRight: 8 }}
							/>
							<View style={Styles.column}>
								<Text style={Styles.grayText}>
									{getStr('Profile.Mobile_Number')}
								</Text>
								<Text style={[Styles.primaryText, { marginVertical: 4 }]}>
									+91 {this.state.phone}
								</Text>
							</View>
						</View>
					</>
				)}
				<View
					style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
					<MaterialCommunityIcons
						name="lock-outline"
						size={20}
						color={Color.grayFill}
						style={{ width: 20, marginRight: 8 }}
					/>
					<View style={Styles.column}>
						<Text style={Styles.grayText}>
							{getStr('Profile.Last_Login_Date')}
						</Text>
						<Text style={[Styles.primaryText, { marginVertical: 4 }]}>
							{getStr('Profile.Last_login_on')} {moment(store.getState().lastLoginDate).format("MMM DD, YYYY")}
						</Text>
					</View>
				</View>
				<View
					style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
					<FontAwesome
						name="dollar"
						size={20}
						color={Color.grayFill}
						style={{ width: 20, marginRight: 8 }}
					/>
					<View style={Styles.column}>
						<Text style={Styles.grayText}>
							{getStr('Profile.Billing_Details')}
						</Text>
						<Text style={[Styles.primaryText, { marginVertical: 4 }]}>
							{getStr('Profile.currently')}
						</Text>
					</View>
				</View>
				<View
					style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
					<MaterialCommunityIcons
						name="lock-outline"
						size={20}
						color={Color.grayFill}
						style={{ width: 20, marginRight: 8 }}
					/>
					<TouchableOpacity
						onPress={() =>
							this.props.navigation.navigate('ChangePasswordScreen')
						}
						style={Styles.column}>
						<Text style={Styles.primaryText}>
							{getStr('Profile.Change_Password')}
						</Text>

						{/*<Text style={[Styles.primaryText, { marginVertical: 4 }]}>Currently on Basic plan</Text>*/}
					</TouchableOpacity>
				</View>
			</>
		);
	}

	renderSetting() {
		let {
			accountSettings,
			medicalReminder,
			sessionReminder,
			recordingReminder,
		} = this.state;
		return (
			<>
				<Text style={[Styles.bigGrayText, { marginTop: 8 }]}>
					{getStr('Profile.Notifications')}
				</Text>

				<View
					style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
					<View style={Styles.column}>
						<Text style={Styles.grayTextBold}>
							{getStr('Profile.Session_Reminders')}
						</Text>
						<Text style={[Styles.grayText, { marginVertical: 4 }]}>
							{getStr('Profile.Sinstructions')}
						</Text>
					</View>

					<Switch
						trackColor={{ false: Color.gray, true: Color.gray }}
						thumbColor={this.state.sessionReminder ? Color.primary : Color.grayDarkFill}
						ios_backgroundColor={Color.gray}
						onValueChange={() => {
							this.setState({ sessionReminder: !this.state.sessionReminder }, () => {
								this.updateSessionReminder(this.state.sessionReminder);
							});
						}}
						value={this.state.sessionReminder}
					/>
				</View>

				<View
					style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
					<View style={Styles.column}>
						<Text style={Styles.grayTextBold}>
							{getStr('Profile.Data_Recording')}
						</Text>
						<Text style={[Styles.grayText, { marginVertical: 4 }]}>
							{getStr('Profile.Dinstructions')}
						</Text>
					</View>

					<Switch
						trackColor={{ false: Color.gray, true: Color.gray }}
						thumbColor={this.state.recordingReminder ? Color.primary : Color.grayDarkFill}
						ios_backgroundColor={Color.gray}
						onValueChange={() => {
							this.setState({ recordingReminder: !this.state.recordingReminder }, () => {
								this.updateRecordingReminder(this.state.recordingReminder);
							});
						}}
						value={this.state.recordingReminder}
					/>
				</View>

				<View
					style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
					<View style={Styles.column}>
						<Text style={Styles.grayTextBold}>
							{getStr('Profile.Medical_Reminders')}
						</Text>
						<Text style={[Styles.grayText, { marginVertical: 4 }]}>
							{getStr('Profile.Minstructions')}
						</Text>
					</View>

					<Switch
						trackColor={{ false: Color.gray, true: Color.gray }}
						thumbColor={this.state.medicalReminder ? Color.primary : Color.grayDarkFill}
						ios_backgroundColor={Color.gray}
						onValueChange={() => {
							this.setState({ medicalReminder: !this.state.medicalReminder }, () => {
								this.updateMedicalReminder(this.state.medicalReminder);
							});
						}}
						value={this.state.medicalReminder}
					/>
				</View>
				{/* App Settings */}
				<Text style={[Styles.bigGrayText, { marginTop: 8 }]}>
					{getStr('Profile.App_Settings')}
				</Text>

				<TouchableOpacity
					style={[Styles.column, { marginVertical: 8 }]}
					activeOpacity={0.8}
					onPress={() => {
						this.props.navigation.navigate('CareAdvisorScreen');
					}}>
					<Text style={Styles.grayTextBold}>{getStr('Profile.Get_Help')}</Text>
					<Text style={[Styles.grayText, { marginVertical: 4 }]}>
						{getStr('Profile.Ginstructions')}
					</Text>
				</TouchableOpacity>

				<View style={[Styles.column, { marginVertical: 8 }]}>
					<Text style={Styles.grayTextBold}>
						{getStr('Profile.Privacy')} &amp; {getStr('Profile.Data')}
					</Text>
					<Text style={[Styles.grayText, { marginVertical: 4 }]}>
						{getStr('Profile.Pinstructions')}
					</Text>
				</View>

				<View style={[Styles.column, { marginVertical: 8 }]}>
					<Text style={Styles.grayTextBold}>{getStr('Profile.Language')}</Text>
					<ActionSheet
						ref={o => (this.ActionSheet = o)}
						title='Select Language'
						options={this.state.languages}
						cancelButtonIndex={this.state.languages.length - 1}
						onPress={index => {
							if (index !== this.state.languages.length - 1) {
								let selectedLanguage = this.state.allLanguages[index];
								console.log('selected language id===', selectedLanguage.name);
								this.setState({ languageId: selectedLanguage.id }, () => {
									this.updateProfileInfo();
								});
							}
						}}
					/>
					<TouchableOpacity
						onPress={() => {
							this.ActionSheet.show();
						}}>
						<Text style={[Styles.grayText, { marginVertical: 4 }]}>
							{this.state.currentLanguage}
						</Text>
					</TouchableOpacity>
				</View>

				<Button
					labelButton={getStr('Profile.SignOut')}
					onPress={() => this.signOut()}
					theme="secondary"
				/>
				<Text style={{ textAlign: 'center', marginVertical: 20, fontSize: 11 }}>App Version {DeviceInfo.getVersion()}</Text>
			</>
		);
	}

	renderPeakType = () => {
		const {isPeakType} = this.state
		return(
			<View >
				<View onPress={() => null} style={[styles.profile,{paddingHorizontal: 5}]}>
		<Text style={Styles.grayTextBold}>{getStr("TargetAllocate.PeakRecording")}</Text>
				<View style={{flexDirection:'row',
					borderWidth:1,
					width: 130,
					alignItems:'center',
					height:35,
					borderColor:Color.primary,
					borderRadius:5, position:'absolute', right:10   }}>
					<TouchableOpacity onPress={() => {
						this.setState({isPeakType: true}, () =>{
							this.setPeakType()
						})
					}}
									  style={{ alignItems:'center', width: 64, height:34,backgroundColor:isPeakType ?
											  Color.primary :  Color.white,
										  justifyContent:'center', borderTopLeftRadius: 5, borderBottomLeftRadius:5}}>
						<Text style={{fontSize:12,color:isPeakType ? Color.white : Color.primary,  textAlign:'center',
							textAlignVertical:'center',borderTopLeftRadius: 5, borderBottomLeftRadius:5}}>{getStr("TargetAllocate.Automatic")}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {
						this.setState({isPeakType: false}, () => {
							this.setPeakType()
						})
					}} style={{
						alignItems:'center', width: 64, height:34,
						justifyContent:'center',backgroundColor:!isPeakType ? Color.primary :  Color.white,
						borderTopRightRadius: 5, borderBottomRightRadius:5}}>
						<Text style={{fontSize:12,color:!isPeakType ? Color.white : Color.primary,
							textAlign:'center',
						textAlignVertical:'center',borderTopRightRadius: 5, borderBottomRightRadius:5}}>{getStr("TargetAllocate.Manual")}</Text>
					</TouchableOpacity>
				</View>
			</View>
			</View>
		)
	}

	render() {
		let { isLoading, familyMembers } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				<Container>
					{OrientationHelper.getDeviceOrientation() == 'portrait' && (
						<ScrollView
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
							contentInsetAdjustmentBehavior="automatic"
							refreshControl={
								<RefreshControl
									refreshing={this.state.isLoading}
									onRefresh={this._refresh.bind(this)}
								/>
							}>
							<View style={{ paddingTop: 30, paddingBottom: 10 }}>
								<Text style={styles.title}>{getStr('Profile.Profile')}</Text>
							</View>

							{this.renderProfile()}
							{this.renderFamily()}
							{this.renderPersonalDetail()}
							{this.renderPeakType()}
							{this.renderSetting()}

						</ScrollView>
					)}

					{OrientationHelper.getDeviceOrientation() == 'landscape' && (
						<>
							<View style={{ paddingTop: 30, paddingBottom: 10 }}>
								<Text style={styles.title}>{getStr('Profile.Profile')}</Text>
							</View>
							<Row style={{ flex: 1 }}>
								<Column>
									<ScrollView
										keyboardShouldPersistTaps="handled"
										showsVerticalScrollIndicator={false}
										contentInsetAdjustmentBehavior="automatic"
										refreshControl={
											<RefreshControl
												refreshing={this.state.isLoading}
												onRefresh={this._refresh.bind(this)}
											/>
										}>
										{this.renderProfile()}
										{this.renderPersonalDetail()}
										{this.renderPeakType()}
										{this.renderSetting()}

									</ScrollView>
								</Column>
								<Column style={{ flex: 2 }}>
									<ScrollView
										keyboardShouldPersistTaps="handled"
										showsVerticalScrollIndicator={false}
										contentInsetAdjustmentBehavior="automatic"
										refreshControl={
											<RefreshControl
												refreshing={this.state.isLoading}
												onRefresh={this._refresh.bind(this)}
											/>
										}>
										{this.renderFamily()}
									</ScrollView>
								</Column>
							</Row>
						</>
					)}
					{isLoading && (
						<ActivityIndicator
							size="large"
							color="black"
							style={{
								zIndex: 9999999,
								// backgroundColor: '#ccc',
								opacity: 0.9,
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								height: screenHeight,
								justifyContent: 'center',
							}}
						/>
					)}
				</Container>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	profile: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 4,
		marginVertical: 8,
		marginHorizontal: 3,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	header: {
		alignSelf: 'flex-end',
		borderRadius: 20,
		marginTop: 8,
	},
	recentImage: {
		width: width / 11,
		height: width / 11,
		borderRadius: 20,
	},
	studentImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
	},
	smallImage: {
		width: width / 15,
		height: width / 15,
		borderRadius: 2,
	},
	bigImage: {
		width: width / 3,
		height: width / 3.3,
		resizeMode: 'contain',
		// backgroundColor: 'red'
	},
	row: {
		flex: 1,
		flexDirection: 'row',
	},
	container: {
		flex: 1,
		backgroundColor: Color.white,
	},
	recentBox: {
		marginHorizontal: 8,
		height: 60,
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
	},
	text: {
		fontSize: 14,
	},
	textBig: {
		fontSize: 16,
	},
	textSmall: {
		fontSize: 10,
	},
	newCount: {
		backgroundColor: Color.primary,
		padding: 2,
		width: 16,
		height: 16,
		borderRadius: 4,
		justifyContent: 'center',
	},
	textCount: {
		color: Color.white,
		fontSize: 10,
		textAlign: 'center',
	},
	help: {
		flex: 1,
		padding: 16,
		borderRadius: 4,
		marginVertical: 8,
		marginHorizontal: 3,
		backgroundColor: '#fff',

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	helpTitleBox: {
		flexDirection: 'row',
		marginBottom: 5,
	},

	// Family members
	memberCard: {
		flex: 1,
		flexDirection: 'row',
		padding: 10,
		backgroundColor: 'rgba(62, 123, 250, 0.025)',
		borderRadius: 8,
		marginBottom: 10,
	},

	input: {
		marginTop: 10,
		marginBottom: 10,
		padding: 6,
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: '500',
		textAlign: 'left',
		color: '#10253C',
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: '#DCDCDC',
		borderWidth: 1,
		flex: 1,
		flexDirection: 'row',
	},

	continueViewTouchable: {
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 10,
		// marginLeft: 20,
		// marginRight: 20,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff',
	},
	continueView: {
		width: '100%',
		marginBottom: 20,
	},
	continueViewText: {
		color: '#3E7BFA',
		fontSize: 20,
		textAlign: 'center',
	},
});

const mapStateToProps = state => ({
	authResult: getAuthResult(state),
});

const mapDispatchToProps = dispatch => ({
	dispatchSetToken: data => dispatch(setToken(data)),
	dispatchSignout: data => dispatch(signout(data)),
	dispatchLanguage: data => dispatch(languageChange(data)),
	dispatchSetProfileData: data => dispatch(setParentProfile(data)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Profile);
