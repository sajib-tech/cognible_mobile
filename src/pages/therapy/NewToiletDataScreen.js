import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Overlay, CheckBox } from 'react-native-elements';
import {
	SafeAreaView,
	StyleSheet,
	ActivityIndicator, Alert,
	ScrollView,
	View, Image, Dimensions,
	Text, TextInput, TouchableOpacity, Switch
} from 'react-native';
import moment from 'moment/min/moment-with-locales';
import store from "../../redux/store";
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import TokenRefresher from '../../helpers/TokenRefresher';
import ParentRequest from '../../constants/ParentRequest';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import PickerModal from '../../components/PickerModal';
import Color from '../../utility/Color';
import DateInput from '../../components/DateInput';
import LoadingIndicator from '../../components/LoadingIndicator';
import { getStr } from "../../../locales/Locale";
import MultiPickerModal from '../../components/MultiPickerModal';
import BehaviourDecelToiletCard from '../../components/BehaviourDecelToiletCard';
import GraphqlErrorProcessor from '../../helpers/GraphqlErrorProcessor';


const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class NewToiletDataScreen extends Component {
	constructor(props) {
		super(props)
		//set value in state for initial date
		this.state = {
			showLoading: false,
			studentId: '',
			urination: true,
			bowel: true,
			prompted: true,
			lastWater: '',
			lastWaterTime: moment().format("HH:mm:ss"),
			show: false,
			lastWaterError: '',
			lastWaterTimeError: '',

			reminders: [
				{ time: moment().format("HH:mm:ss"), frequency: [], timesError: "", frequencyError: "" },
			],

			urinations: [
				{ time: moment().format("HH:mm:ss"), status: 1 },
			],

			daysArray: [
				{ id: "Sunday", label: "Sunday" },
				{ id: "Monday", label: "Monday" },
				{ id: "Tuesday", label: "Tuesday" },
				{ id: "Wednesday", label: "Wednesday" },
				{ id: "Thursday", label: "Thursday" },
				{ id: "Friday", label: "Friday" },
				{ id: "Saturday", label: "Saturday" },
			],
			toiletDataItems: [],
			isAdd: false,

			isReminder: false,

			date: moment().format("YYYY-MM-DD"),

			title: getStr('NewToiletData.NewToiletData'),
		}

		if (this.props.route) {
			this.toilet = this.props.route.params.toilet;
			console.log("Params", this.toilet);
		}

		console.log("Props route", this.props.route);

		this.saveToiletData = this.saveToiletData.bind(this);
	}

	componentDidMount() {
		console.error("props newtoiletdaqtascreen 91", this.props)
		if (this.toilet) {
			console.log('List of toilet data coming -->' + JSON.stringify(this.toilet))

			this.setState({
				title: "Edit Toilet Data",
				urination: this.toilet.node.urination,
				bowel: this.toilet.node.bowel,
				prompted: this.toilet.node.prompted,
				lastWater: parseInt(this.toilet.node.lastWater.replace(/[^0-9]/g, '')) + "",
				date: this.toilet.node.date,
				lastWaterTime: this.toilet.node.lastWaterTime,
				isReminder: this.toilet.node.reminders.edges.length != 0 ? true : false,
				reminders: this.toilet.node.reminders.edges.map((reminder) => {
					return {
						id: reminder.node.id,
						time: reminder.node.time,
						status: 1,
						frequency: reminder.node.frequency.edges.map((freq) => {
							return freq.node.name;
						}),
					}
				}),
				urinations: this.toilet.node.urinationRecords.edges.map((urination) => {
					console.log('List of urinations coming -->' + JSON.stringify(urination))

					return {
						id: urination.node.id,
						time: urination.node.time,
						status: urination.node.status,
					}
				}),
			});
		}
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
	}

	isFormInValid() {
		let isError = false;
		if (this.state.lastWater === "") {
			this.setState({ lastWaterError: getStr('NewToiletData.waterError') });
			isError = true;
		} else {
			this.setState({ lastWaterError: "" });
		}
		if (this.state.lastWaterTime === "") {
			this.setState({ lastWaterTimeError: getStr('NewToiletData.waterErrOOr') });
			isError = true;
		} else {
			this.setState({ lastWaterTimeError: "" });
		}

		let reminders = this.state.reminders;
		if (this.state.isReminder) {
			reminders.forEach((reminder, key) => {
				if (reminder.time == "") {
					reminders[key].timesError = getStr("MedicalData.Specifythisvalue");
					isError = true;
				}
				if (reminder.frequency == "") {
					reminders[key].frequencyError = getStr("MedicalData.Specifythisvalue");
					isError = true;
				}
			});
		}

		this.setState({ reminders });

		return isError;
	}

	saveToiletData() {
		if (this.isFormInValid()) {
			console.log("yes, form is Not valid")
			return;
		}

		this.setState({ showLoading: true });
		let { route } = this.props;
		let studentId = "";
		if (route && route.params) {
			studentId = this.props.route.params.studentId;
		} else if (this.props.studentId) {
			studentId = this.props.studentId;
		}
		const time = this.state.urinations.map(item => {
			if (item.time) {
				return item.time
			}
		})

		// let studentId = this.props.route.params.studentId || this.props.studentId;
		let variables = {
			studentId: studentId,
			urination: this.state.urination,
			bowel: this.state.bowel,
			prompted: this.state.prompted,
			lastWater: this.state.lastWater,
			lastWaterTime: this.state.lastWaterTime,
			time: time[0],
			date: moment().format('YYYY-MM-DD'),
			// sessionId: this
		};

		if (this.state.isReminder) {
			variables.reminders = this.state.reminders.map((item) => {
				if (this.toilet) {
					let dt = {
						time: item.time,
						frequency: item.frequency
					};
					// if (item.id) {
					// 	dt.id = item.id;
					// }
					return dt;
				} else {
					return {
						time: item.time,
						frequency: item.frequency
					};
				}
			});
		}
		else{
			variables.reminders=[]
		}
	  

		variables.urinationRecord = this.state.urinations.map((item) => {
			let dt = {
				time: item.time,
				status: item.status
			};
			if (item.id) {
				dt.id = item.id;
			}
			return dt;
		});

		if (this.props ?.isFromSession) {
			variables.sessionId = this.props ?.sessionId;
		}
		let promise = null;
		if (this.toilet) {
			variables.id = this.toilet ?.node ?.id;
			console.log("Vars before updatedata-->", JSON.stringify(variables));
			promise = ParentRequest.updateToiletInfo(variables);
		} else {
			console.log("Vars before save data 2-->", JSON.stringify(variables));
			promise = ParentRequest.saveToiletInfo(variables);
		}

		promise.then(newToiletData => {
			console.log('After SaveToilet---', JSON.stringify(newToiletData));
			this.setState({ showLoading: false, isAdd: false });
			Alert.alert(
				'Information',
				"Data Successfully Saved",
				[{
					text: 'OK', onPress: () => {
						if (this.props.disableNavigation) {
							if (this.props.isFromSession) {
								this.props.navigation.goBack();
							}
						} else {
							this.props.navigation.goBack();
						}

						setTimeout(() => {
							let parent = this.props.route.params.parent;
							if (parent) {
								parent.getData();
							}
						}, 500);
					}
				}],
				{ cancelable: false }
			);
		}).catch(error => {
			this.setState({ showLoading: false, isSaving: false, isAdd: false });
			console.log("Error", GraphqlErrorProcessor.process(error));

			Alert.alert('Information', GraphqlErrorProcessor.process(error));
		});
	}

	deleteToilet() {
		Alert.alert(
			'Information',
			'Are you sure want to delete this data ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						let variables = {
							id: this.toilet.node.id
						};
						ParentRequest.deleteToiletInfo(variables).then((result) => {
							Alert.alert("Information", "Delete toilet data successfully.");

							if (this.props.disableNavigation) {
								if (this.props.isFromSession) {
									this.props.navigation.goBack();
								}
							} else {
								this.props.navigation.goBack();
							}

							setTimeout(() => {
								let parent = this.props.route.params.parent;
								if (parent) {
									parent.getData();
								}
							}, 500);
						}).catch((error) => {
							Alert.alert("Information", error.toString());
						});
					}
				},
			],
			{ cancelable: false }
		);
	}

	displayCurrentDateTime() {
		return (
			<View flexDirection="row">
				<View style={{ width: '46%', marginRight: 20 }}>
					<DateInput
						format='YYYY-MM-DD'
						displayFormat='DD MMM YYYY'
						value={this.state.date}
						onChange={(date) => {
							this.setState({ date });
						}} />
				</View>
				<View style={{ width: '46%', marginRight: 20 }}>
					<DateInput
						format='HH:mm'
						mode='time'
						displayFormat='hh:mm A'
						value={this.state.time_start}
						onChange={(time_start) => {
							this.setState({ time_start });
						}} />
				</View>
			</View>
		)
	}

	render() {
		const { showLoading, lastWater, isAdd } = this.state;
		let isNew = this.props.route.params.isNew;
		let rstyle = '';
		if (this.props.isFromSession && OrientationHelper.getDeviceOrientation() == 'portrait') {
			rstyle = styles.scrollViewHeightPortrait;
		} else if (this.props.isFromSession && OrientationHelper.getDeviceOrientation() == 'landscape') {
			rstyle = styles.scrollViewHeight;
		}
		return (
			<SafeAreaView style={styles.container}>
				{!this.props.isFromSession && (
					<NavigationHeader
						enable={this.props.disableNavigation != true}
						backPress={() => this.props.navigation.goBack()}
						title={this.state.title}
					/>
				)}

				<Container enablePadding={this.props.disableNavigation != true}>
					<ScrollView contentInsetAdjustmentBehavior="automatic" style={[rstyle]}>
						{/* {this.displayCurrentDateTime()} */}

						<Text style={styles.sectionTitle}>{getStr('NewToiletData.Urination')}</Text>
						<Row style={{ marginVertical: 10 }}>
							<Column>
								<Button labelButton={getStr('NewChanges.yes')}
									theme={this.state.urination ? 'primary' : 'secondary'}
									onPress={() => this.setState({ urination: true })} />
							</Column>
							<Column>
								<Button labelButton={getStr('NewChanges.no')}
									theme={this.state.urination ? 'secondary' : 'primary'}
									onPress={() => this.setState({ urination: false })} />
							</Column>
						</Row>

						<Text style={styles.sectionTitle}>{getStr('NewToiletData.BowelMovement')}</Text>
						<Row style={{ marginVertical: 10 }}>
							<Column>
								<Button labelButton={getStr('NewChanges.yes')}
									theme={this.state.bowel ? 'primary' : 'secondary'}
									onPress={() => this.setState({ bowel: true })} />
							</Column>
							<Column>
								<Button labelButton={getStr('NewChanges.no')}
									theme={this.state.bowel ? 'secondary' : 'primary'}
									onPress={() => this.setState({ bowel: false })} />
							</Column>
						</Row>

						<Text style={styles.sectionTitle}>{getStr('NewToiletData.PromptedtoReq')}</Text>
						<Row style={{ marginVertical: 10 }}>
							<Column>
								<Button labelButton={getStr('NewChanges.yes')}
									theme={this.state.prompted ? 'primary' : 'secondary'}
									onPress={() => this.setState({ prompted: true })} />
							</Column>
							<Column>
								<Button labelButton={getStr('NewChanges.no')}
									theme={this.state.prompted ? 'secondary' : 'primary'}
									onPress={() => this.setState({ prompted: false })} />
							</Column>
						</Row>

						<Text style={styles.sectionTitle}>{getStr('NewToiletData.waterIntake')}</Text>
						{this.state.lastWaterError != '' && <Text style={{ color: Color.danger }}>{this.state.lastWaterError}</Text>}
						<TextInput
							style={styles.formInput}
							maxLength={4}
							keyboardType={'numeric'}
							value={lastWater}
							onChangeText={lastWater =>
								this.setState({ lastWater: lastWater })
							}
						/>

						<Text style={styles.sectionTitle}>{getStr('NewToiletData.waterTime')}</Text>
						{this.state.lastWaterTimeError != '' && <Text style={{ color: Color.danger }}>{this.state.lastWaterTimeError}</Text>}

						<DateInput
							format='HH:mm:ss'
							displayFormat='HH:mm:ss'
							mode='time'
							value={this.state.lastWaterTime}
							onChange={(lastWaterTime) => {
								this.setState({ lastWaterTime });
							}} />

						<Row>
							<Column>

							</Column>
							<Column style={{ flex: 0, width: 120 }}>
								<Button
									theme='secondary'
									style={{ height: 42 }}
									labelButton="Add"
									onPress={() => {
										let urinations = this.state.urinations;
										urinations.push({ time: moment().format("HH:mm:ss"), status: 1 });
										this.setState({ urinations });
									}}
								/>
							</Column>
						</Row>

						{this.state.urinations.map((urination, key) => {
							return (
								<View key={key}>
									{/* <Row>
													<Column style={{ flex: 0, width: 120 }}>
														{urination.timesError != "" && <Text style={{ color: Color.danger }}>{urination.timesError}</Text>}
													</Column>
													<Column>
														{urination.frequencyError != "" && <Text style={{ color: Color.danger }}>{urination.frequencyError}</Text>}
													</Column>
													<Column style={{ flex: 0, width: 50 }}>
													</Column>
												</Row> */}
									<Row>
										<Column style={{ flex: 0, width: 120 }}>
											<DateInput
												label={getStr("TargetAllocate.UrinationTime")}
												mode='time'
												format='HH:mm:ss'
												displayFormat='hh:mm A'
												value={urination.time}
												onChange={(time) => {
													let urinations = this.state.urinations;
													urinations[key].time = time;
													this.setState({ urinations });
												}} />
										</Column>
										<Column>
											<PickerModal
												label={getStr("NewChanges.Response")}
												selectedValue={urination.status}
												data={[
													{ id: 1, label: 'Negative' },
													{ id: 2, label: 'Positive' },
												]}
												onValueChange={(itemValue, itemIndex) => {
													let urinations = this.state.urinations;
													urinations[key].status = itemValue;
													this.setState({ urinations });
												}}
											/>
										</Column>
										<Column style={{ flex: 0, width: 50, paddingTop: 20 }}>
											<Button
												theme='danger'
												style={{ height: 42, marginTop: 10 }}
												labelButton={<MaterialCommunityIcons name='minus' size={30} color={Color.danger} />}
												onPress={() => {
													let urinations = this.state.urinations;
													urinations.splice(key, 1);
													this.setState({ urinations });
												}}
											/>
										</Column>
									</Row>

								</View>
							);
						})}

						<Row style={{ marginVertical: 10 }}>
							<Column>
								<Text style={styles.text1}>{getStr('NewToiletData.ToiletReminders')}</Text>
								<Text style={styles.text1}>{getStr('NewToiletData.REminderMsg')}</Text>
							</Column>
							<Column style={{ flex: 0 }}>
								<Switch
									trackColor={{ false: Color.gray, true: Color.gray }}
									thumbColor={this.state.isReminder ? Color.primary : Color.grayDarkFill}
									ios_backgroundColor={Color.gray}
									onValueChange={() => {
										this.setState({ isReminder: !this.state.isReminder });
									}}
									value={this.state.isReminder}
								/>
							</Column>
						</Row>

						{this.state.isReminder && (
							<>
								<Row>
									<Column>

									</Column>
									<Column style={{ flex: 0, width: 120 }}>
										<Button
											theme='secondary'
											style={{ height: 42 }}
											labelButton="Add"
											onPress={() => {
												let reminders = this.state.reminders;
												reminders.push({ time: moment().format("HH:mm:ss"), frequency: [], status: 1, timesError: "", frequencyError: "" });
												this.setState({ reminders });
											}}
										/>
									</Column>
								</Row>
								{this.state.reminders.map((reminder, key) => {
									return (
										<View key={key}>
											<Row>
												<Column style={{ flex: 0, width: 120 }}>
													{reminder.timesError != "" && <Text style={{ color: Color.danger }}>{reminder.timesError}</Text>}
												</Column>
												<Column>
													{reminder.frequencyError != "" && <Text style={{ color: Color.danger }}>{reminder.frequencyError}</Text>}
												</Column>
												<Column style={{ flex: 0, width: 50 }}>
												</Column>
											</Row>
											<Row>
												<Column style={{ flex: 0, width: 120 }}>
													<DateInput
														label='Reminder Time'
														mode='time'
														format='HH:mm:ss'
														displayFormat='hh:mm A'
														value={reminder.time}
														onChange={(time) => {
															let reminders = this.state.reminders;
															reminders[key].time = time;
															this.setState({ reminders });
														}} />
												</Column>
												<Column>
													<MultiPickerModal
														label='Reminder Days'
														data={this.state.daysArray}
														value={reminder.frequency}
														onSelect={(values) => {
															console.log("On select", values);
															let reminders = this.state.reminders;
															reminders[key].frequency = values;
															this.setState({ reminders });
														}} />
												</Column>
												<Column style={{ flex: 0, width: 50 }}>
													<Button
														theme='danger'
														style={{ height: 42, marginTop: 10 }}
														labelButton={<MaterialCommunityIcons name='minus' size={30} color={Color.danger} />}
														onPress={() => {
															let reminders = this.state.reminders;
															reminders.splice(key, 1);
															this.setState({ reminders });
														}}
													/>
												</Column>
											</Row>
										</View>
									);
								})}
							</>
						)}

						<View style={{ height: 30 }} />
					</ScrollView>
					<Button labelButton={getStr('MedicalData.SaveData')}
						isLoading={showLoading}
						style={{ marginBottom: 10 }}
						onPress={() => {
							this.saveToiletData();
						}} />
					{isAdd &&
						<Button labelButton='Cancel'
							theme='secondary'
							style={{ marginBottom: 10 }}
							onPress={() => {
								this.setState({ isAdd: false })
							}} />}

					{this.toilet && (
						<View style={{ marginBottom: 10 }}>
							<Button labelButton='Delete Toilet Data'
								theme='danger'
								onPress={() => { this.deleteToilet() }} />
						</View>
					)}
				</Container>
			</SafeAreaView>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	scrollViewHeight: {
		height: screenWidth + 250,
		marginBottom: 10,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	scrollViewHeightPortrait: {
		// height: 500,
		marginBottom: 0,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	continueViewTouchable: {
		// marginTop: 28,
		paddingTop: 10,
		paddingBottom: 10,
		// marginLeft: 12,
		// marginRight: 12,
		// marginBottom: 15,
		backgroundColor: '#1E90FF',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff'
	},
	continueView: {
		marginVertical: 10
	},
	continueViewText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	formContainer: {
		paddingVertical: 10,
	},
	formElement: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	formButton: {
		marginTop: 10,
		borderWidth: 1.25,
		borderStyle: 'solid',
		borderColor: '#D5D5D5',
		elevation: 1,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		width: 150,
		backgroundColor: '#ffffff',
	},
	formInput: {
		borderWidth: 1,
		borderColor: '#D5D5D5',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		height: 45,
		paddingHorizontal: 16,
		backgroundColor: '#ffffff',
		marginVertical: 10,
	},
	overlayLandscape: {
		// backgroundColor: 'red',
		width: screenWidth - 50,
		height: screenHeight - 50
	},
	reminderTime: {
		flexDirection: 'row',
		width: '36%',
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: '#DCDCDC',
		borderWidth: 1,
		// padding: 10,
		marginRight: 10,
		height: 40
	},
	reminderDays: {
		flexDirection: 'row',
		width: '55%',
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: '#DCDCDC',
		borderWidth: 1,
		padding: 10,
		marginLeft: 10,
		height: 40
	},
	text1: {
		color: Color.blackFont,
		fontSize: 14
	},
	sectionTitle: {
		fontSize: 14,
		marginTop: 10,
		color: Color.blackFont
	},
	daysWrapper: {
		borderColor: Color.gray,
		borderWidth: 1,
		borderRadius: 5,
		marginVertical: 10,
		height: 43,
		paddingHorizontal: 10,
		justifyContent: 'center',
	}
});
const mapStateToProps = (state) => ({
	authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewToiletDataScreen);