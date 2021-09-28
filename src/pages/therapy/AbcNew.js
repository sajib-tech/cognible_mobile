import React, { Component, useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Overlay } from 'react-native-elements';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView, Alert,
	View, Image, Picker, ActivityIndicator,
	Text, TextInput, TouchableOpacity
} from 'react-native';
import { client, getFoodTypes, createFood, refreshToken, getFoodData } from '../../constants/index';
import { ApolloProvider, Mutation } from 'react-apollo';
import DateHelper from '../../helpers/DateHelper';
import store from '../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import TokenRefresher from '../../helpers/TokenRefresher';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import PickerModal from '../../components/PickerModal';
import ParentRequest from '../../constants/ParentRequest';
import moment from 'moment';
import Color from '../../utility/Color';
import Style from '../../utility/Style';
import DateInput from '../../components/DateInput';

class AbcNew extends Component {
	constructor(props) {
		super(props);
		this.state = {
			studentId: this.props.route.params.studentId,
			isLoading: false,
			isSaving: false,
			isAlertPresent: false,
			showDate: false,
			showTime: false,
			mealDate: moment().format("YYYY-MM-DD"),
			mealDateError: "",
			mealTime: moment().format("hh:mm A"),
			mealTimeError: "",
			mealTypeError: "",
			foodTypeError: "",
			mealDetailsError: "",
			foodTypeOptions: [{ label: "Select Food Type", value: "" }],
			foodTypeValue: 'Rm9vZFR5cGVUeXBlOjE=',
			mealTypeOptions: [
				{ id: "Breakfast", label: "Breakfast" },
				{ id: "Lunch", label: "Lunch" },
				{ id: "Snacks", label: "Snacks" },
				{ id: "Dinner", label: "Dinner" }],
			mealTypeValue: '',
			mealDetails: '',
			waterIntake: '',
			waterIntakeError: '',
			placeholderText: "What did child eat ?",
			date: moment().format("YYYY-MM-DD"),

			title: "New Meal"
		};
		this.isFormInValid = this.isFormInValid.bind(this);

		this.params = this.props.route.params.food;
		console.log("Params", this.params);
	}

	componentDidMount() {
		if (this.props.student && this.props.student.firstname) {
			let newText = this.state.placeholderText.replace('Child', this.props.student.firstname);
			this.setState({ placeholderText: newText });
		}

		//if edit mode
		if (this.params) {
			this.setState({
				foodTypeValue: this.params.node.foodType.id,
				mealTypeValue: this.params.node.mealType,

				mealDetails: this.params.node.mealName,
				waterIntake: parseInt(this.params.node.waterIntake.replace(/[^0-9]/g, '')) + "",

				mealDate: this.params.node.date,
				mealTime: this.params.node.mealTime,

				title: "Edit Meal"
			})
		}

		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		this.getFoodTypes();
	}

	getFoodTypes() {
		this.setState({ isLoading: true });

		ParentRequest.getFoodType().then((res) => {
			let foodTypeOptions = res.data.getFoodType.map((item) => {
				return {
					id: item.id,
					label: item.name
				};
			});

			console.log("foodTypeOptions", foodTypeOptions);

			this.setState({ isLoading: false, foodTypeOptions });
		}).catch((err) => {
			this.setState({ isLoading: false });
			Alert.alert("Information", err.toString());
		})
	}

	isFormInValid() {
		let isError = false;
		if (this.state.mealTypeValue === "") {
			this.setState({ mealTypeError: "Select Meal Type" });
			isError = true;
		} else {
			this.setState({ mealTypeError: "" });
		}

		if (this.state.foodTypeValue === "") {
			this.setState({ foodTypeError: "Select Food Type" });
			isError = true;
		} else {
			this.setState({ foodTypeError: "" });
		}

		if (this.state.mealDate === "Select Date") {
			this.setState({ mealDateError: "Select Date" });
			isError = true;
		} else {
			this.setState({ mealDateError: "" });
		}
		if (this.state.mealTime === "Select Time") {
			this.setState({ mealTimeError: "Select Time" });
			isError = true;
		} else {
			this.setState({ mealTimeError: "" });
		}

		if (this.state.waterIntake === "") {
			this.setState({ waterIntakeError: "Enter water Intake" });
			isError = true;
		} else {
			this.setState({ waterIntakeError: "" });
		}
		if (this.state.mealDetails === "") {
			this.setState({ mealDetailsError: "Please enter meal details" });
			isError = true;
		} else {
			this.setState({ mealDetailsError: "" });
		}
		return isError;
	}

	saveMeal() {
		if (this.isFormInValid()) {
			console.log("yes, form is Not valid")
			return;
		}

		this.setState({ isSaving: true });

		let queryParams = {
			studentId: this.state.studentId,
			foodType: this.state.foodTypeValue,
			mealType: this.state.mealTypeValue,
			mealName: this.state.mealDetails,
			date: this.state.mealDate,
			mealTime: this.state.mealTime,
			note: "Test Note",
			waterIntake: this.state.waterIntake + " ml",
		};



		let promise = null;

		if (this.params) {
			//update
			queryParams.id = this.params.node.id;
			// queryParams.studentId = this.params.node.studentId;
			console.log(queryParams);
			promise = ParentRequest.updateFoodData(queryParams);
		} else {
			//create
			console.log(queryParams);
			promise = ParentRequest.createFoodData(queryParams);
		}

		promise.then((result) => {
			this.setState({ isSaving: false });
			Alert.alert(
				this.state.title,
				'Successfully Saved',
				[{
					text: 'OK', onPress: () => {
						console.log('OK Pressed');
						if (this.props.disableNavigation) {

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
		}).catch((error) => {
			this.setState({ isSaving: false });
			Alert.alert("Information", error.toString());
		})
	}

	deleteMeal() {
		Alert.alert(
			'Information',
			'Are you sure want to delete this item ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						let variables = {
							id: this.params.node.id
						};
						ParentRequest.deleteFoodData(variables).then((result) => {
							Alert.alert("Information", "Delete meal successfully.");

							if (this.props.disableNavigation) {

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

	onDateChange(event, selectedValue) {
		if (selectedValue != undefined) {
			this.setState({ mealDate: DateHelper.getDateFromDatetime(selectedValue), showDate: false, mealDateError: "" });
		}
	}

	onTimeChange(event, selectedValue) {
		console.log(selectedValue);
		if (selectedValue != undefined) {
			this.setState({ mealTime: DateHelper.getTimeFromDatetime(selectedValue), showTime: false, mealTimeError: "" });
		}
	}

	onWaterTextChanged(text) {
		let newText = '';
		let numbers = '0123456789';

		for (var i = 0; i < text.length; i++) {
			if (numbers.indexOf(text[i]) > -1) {
				newText = newText + text[i];
			}
			else {
				// your call back function
				Alert.alert(
					'Water Intake',
					'Please enter numbers only',
					[{
						text: 'OK', onPress: () => {
							console.log('OK Pressed');
						}
					}],
					{ cancelable: false }
				);
			}
		}
		this.setState({ waterIntake: newText });
	}

	getMealTimePortrait() {
		return (
			<>
				<View style={{ flexDirection: 'row', marginTop: 10 }}>
					<Text style={{ width: '30%', fontWeight: 'bold' }}>Meal Date</Text>
					<Text style={{ width: '30%', fontWeight: 'bold', paddingLeft: 10 }}>Meal Time</Text>
					<Text style={{ width: '30%', fontWeight: 'bold', paddingLeft: 20 }}>Water Intake</Text>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<Text style={{ textAlign: 'left', color: 'red', width: '30%' }}>{this.state.mealDateError}</Text>
					<Text style={{ textAlign: 'left', color: 'red', width: '30%', paddingLeft: 10 }}>{this.state.mealTimeError}</Text>
					<Text style={{ textAlign: 'left', color: 'red', width: '30%', paddingLeft: 25 }}>{this.state.waterIntakeError}</Text>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.datetime}>
						<TouchableOpacity
							onPress={() => this.setState({ showDate: true })}>
							<Text style={{ padding: 10 }}>{this.state.mealDate}</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.datetime}>
						<TouchableOpacity
							style={styles.formInput}
							onPress={() => { this.setState({ showTime: true }) }}>
							<Text style={{ padding: 10 }}>{this.state.mealTime}</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.datetime}>
						<TextInput style={{ width: '80%', height: 40 }} placeholder="60" value={this.state.waterIntake} maxLength={4} keyboardType={'numeric'}
							onChangeText={(waterIntake) => {
								this.onWaterTextChanged(waterIntake);
							}} />
						<Text style={{ width: '20%', paddingTop: 10, textAlign: 'left' }}>ml</Text>
					</View>
				</View>
			</>
		)
	}
	getMealTimeLandscape() {
		return (
			<>
				{/* Date */}
				<Text style={{ width: '100%', fontWeight: 'bold' }}>Meal Date</Text>
				<Text style={{ textAlign: 'left', color: 'red', width: '100%' }}>
					{this.state.mealDateError}
				</Text>
				<View style={styles.datetimeLandscape}>
					<TouchableOpacity
						onPress={() => this.setState({ showDate: true })}>
						<Text style={{ padding: 10 }}>{this.state.mealDate}</Text>
					</TouchableOpacity>
				</View>

				{/* Time */}
				<Text style={{ width: '100%', fontWeight: 'bold' }}>Meal Time</Text>
				<Text style={{ textAlign: 'left', color: 'red', width: '100%' }}>{this.state.mealTimeError}</Text>
				<View style={styles.datetimeLandscape}>
					<TouchableOpacity
						style={styles.formInput}
						onPress={() => { this.setState({ showTime: true }) }}>
						<Text style={{ padding: 10 }}>{this.state.mealTime}</Text>
					</TouchableOpacity>
				</View>

				{/* Water intake */}
				<Text style={{ width: '100%', fontWeight: 'bold' }}>Water Intake</Text>
				<Text style={{ textAlign: 'left', color: 'red', width: '100%' }}>{this.state.waterIntakeError}</Text>
				<View style={styles.datetimeLandscapeWater}>
					<TextInput style={{ width: '90%', height: 40 }} placeholder="60" value={this.state.waterIntake} maxLength={4} keyboardType={'numeric'}
						onChangeText={(waterIntake) => {
							this.onWaterTextChanged(waterIntake);
						}} />
					<Text style={{ width: '10%', paddingTop: 10, textAlign: 'left' }}>ml</Text>
				</View>
			</>
		)
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
		let { addFoodItem, data } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					enable={this.props.disableNavigation != true}
					backPress={() => this.props.navigation.goBack()}
					title={this.state.title}
				/>

				<Container enablePadding={this.props.disableNavigation != true}>
					<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
						{/* { this.displayCurrentDateTime() } */}
						<PickerModal
							label="Select Meal"
							placeholder="Breakfast"
							error={this.state.mealTypeError}
							selectedValue={this.state.mealTypeValue}
							data={this.state.mealTypeOptions}
							onValueChange={(mealTypeValue, itemIndex) => {
								this.setState({ mealTypeValue });
								if (mealTypeValue === "") {
									this.setState({ mealTypeError: "Select Meal Type" })
								} else {
									this.setState({ mealTypeError: "" })
								}
								console.log(mealTypeValue)
							}}
						
						/>

						<PickerModal
							label="Food Type"
							error={this.state.foodTypeError}
							defaultValue={this.state.foodTypeValue}
							data={this.state.foodTypeOptions}
							onValueChange={(foodTypeValue, itemIndex) => {
								this.setState({ foodTypeValue });
								if (foodTypeValue === "") {
									this.setState({ foodTypeError: "Select Food Type" })
								} else {
									this.setState({ foodTypeError: "" })
								}
							}}
						/>

						<Text style={Style.grayText}>Meal Date</Text>
						<DateInput
							format='YYYY-MM-DD'
							displayFormat='dddd, DD MMM YYYY'
							value={this.state.mealDate}
							onChange={(mealDate) => {
								this.setState({ mealDate });
							}} />

						<Text style={Style.grayText}>Meal Time</Text>
						<DateInput
							mode='time'
							format='hh:mm A'
							displayFormat='hh:mm A'
							value={this.state.mealTime}
							onChange={(mealTime) => {
								this.setState({ mealTime });
							}} />

						<Text style={Style.grayText}>Water Intake</Text>
						{this.state.waterIntakeError != '' && <Text style={{ color: Color.danger }}>{this.state.waterIntakeError}</Text>}

						<View style={styles.datetimeLandscapeWater}>
							<TextInput style={{ flex: 1, height: 40 }}
								placeholder="60"
								value={this.state.waterIntake}
								maxLength={4}
								keyboardType={'numeric'}
								onChangeText={(waterIntake) => {
									this.onWaterTextChanged(waterIntake);
								}} />
							<Text style={{ color: Color.black }}>ml</Text>
						</View>

						<Text style={Style.grayText}>Meal Details</Text>
						{this.state.mealDetailsError != '' && <Text style={{ color: Color.danger }}>{this.state.mealDetailsError}</Text>}

						<TextInput
							style={styles.TextInputStyleClass}
							underlineColorAndroid="transparent"
							placeholder={this.state.placeholderText}
							placeholderTextColor={"#9E9E9E"}
							numberOfLines={10}
							value={this.state.mealDetails}
							onChangeText={(mealDetails) => {
								this.setState({ mealDetails });
							}}
						/>
					</ScrollView>
					<View style={{ paddingVertical: 5 }}>
						<Button labelButton='Save Meal'
							isLoading={this.state.isSaving}
							onPress={() => { this.saveMeal() }} />

					</View>
					{this.params && (
						<View style={{ marginBottom: 10 }}>
							<Button labelButton='Delete Meal'
								isLoading={this.state.isSaving}
								theme='danger'
								onPress={() => { this.deleteMeal() }} />
						</View>
					)}
				</Container>
			</SafeAreaView>
		)
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	header: {
		flexDirection: 'row',
		height: 50,
		width: '100%'
	},
	scrollView: {
		// height: '100%',
		backgroundColor: "#FFFFFF",
		paddingBottom: 50,
	},
	backIcon: {
		fontSize: 50,
		fontWeight: 'normal',
		color: '#fff',
		width: '10%',
		paddingTop: 15
	},
	backIconText: {
		fontSize: 20,
		fontWeight: 'normal',
		color: '#63686E'
	},
	headerTitle: {
		textAlign: 'center',
		width: '80%',
		fontSize: 22,
		paddingTop: 10,
		color: '#45494E'
	},
	rightIcon: {
		fontSize: 50,
		fontWeight: 'normal',
		color: '#fff',
		width: '10%',
		paddingTop: 15,
		// marginRight: 10
	},
	TextInputStyleClass: {
		borderWidth: 1,
		borderColor: Color.gray,
		borderRadius: 5,
		backgroundColor: "#FFFFFF",
		height: 110,
		marginVertical: 5,
		paddingHorizontal: 10,
		textAlignVertical: 'top'
	},
	datetime: {
		flexDirection: 'row',
		width: '30%',
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: '#DCDCDC',
		borderWidth: 1,
		// padding: 10, 
		marginRight: 10,
		height: 40
	},
	datetimeLandscape: {
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: '#DCDCDC',
		borderWidth: 1,
		// padding: 10, 
		marginRight: 10,
		height: 40
	},
	datetimeLandscapeWater: {
		flexDirection: 'row',
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: Color.gray,
		borderWidth: 1,
		alignItems: 'center',
		paddingHorizontal: 10,
		marginTop: 5,
		marginBottom: 10
	},
	waterInput: {
		flexDirection: 'row',
		width: '100%',
		borderRadius: 6,
		backgroundColor: '#FFFFFF',
		borderColor: '#DCDCDC',
		borderWidth: 1,
		// padding: 10, 
		marginRight: 20,
		height: 40
	},
	continueViewTouchable: {
		marginTop: 28,
		paddingTop: 10,
		paddingBottom: 10,
		marginLeft: 12,
		marginRight: 12,
		marginBottom: 15,
		backgroundColor: '#1E90FF',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff'
	},
	continueView: {
		width: '100%',
	},
	continueViewText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	}

});
const mapStateToProps = (state) => ({
	authResult: getAuthResult(state),
	authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
	dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbcNew);




