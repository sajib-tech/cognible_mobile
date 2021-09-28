import React, { Component } from 'react';

import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Platform } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateHelper from '../helpers/DateHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Color from '../utility/Color';

class CalendarWeekView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dates: [],
			parentCallback: props.parentCallback,
			currentTime: moment().toDate()
		};
	}

	componentDidMount() {
		let selectedDate = this.props.selectedDate;
		let dateInWeek = [];
		if (selectedDate) {
			dateInWeek = this.getWeekFromDate(selectedDate);
		} else {
			dateInWeek = this.getWeekFromDate(moment().format("YYYY-MM-DD"));
		}

		this.setState({ dates: dateInWeek });
	}

	getWeekFromDate(selectedDate) {
		let dateList = [];

		let firstDate = moment(selectedDate).startOf('week').unix() * 1000;

		let oneDay = 24 * 3600 * 1000;

		for (let i = firstDate; i < firstDate + 7 * oneDay; i += oneDay) {
			let date = moment(i);

			let dateString = date.format("YYYY-MM-DD");

			dateList.push({
				date: dateString,
				dayName: date.format("dd"),
				dayOfMonth: date.format("DD")
			});
		}

		return dateList;
	}

	selectTheDate(date) {
		let dateInWeek = this.getWeekFromDate(date);

		this.setState({ dates: dateInWeek });

		this.props.parentCallback(date);
	}

	getDateView(dateObject, isSelected, index) {
		let textColor = styles.defaultTextColor;
		if (isSelected) {
			return (
				<TouchableOpacity key={index} style={styles.dateValue} activeOpacity={0.7} onPress={() => {
					this.selectTheDate(dateObject.date);
				}}>
					<View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
						<Image source={require("../../android/img/date-highlight.png")} style={{ width: 40, height: 40 }} />
					</View>
					<View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={textColor}>{dateObject.dayOfMonth}</Text>
					</View>
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity key={index} style={styles.dateValue} activeOpacity={0.7} onPress={() => {
					this.selectTheDate(dateObject.date);
				}}>
					<View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={textColor}>{dateObject.dayOfMonth}</Text>
					</View>
				</TouchableOpacity>
			);
		}
	}

	render() {
		let displayDate = null;
		if (this.props.selectedDate) {
			displayDate = moment(this.props.selectedDate).format("DD MMM YYYY");
		}

		let currentTime = this.state.currentTime;

		if (this.props.selectedDate) {
			currentTime = moment(this.props.selectedDate).toDate();
		}

		return (
			<>
				{this.props.selectedDate != null && <TouchableOpacity activeOpacity={0.9} style={styles.topBox} onPress={() => {
					this.setState({ show: true });
				}}>
					<Text style={styles.topBoxTitle}>Select Date: </Text>
					<View style={styles.topBoxWrapper}>
						<Text style={styles.topBoxDate}>{displayDate}</Text>
					</View>
				</TouchableOpacity>}
				<View style={styles.calendarBox}>
					<View style={styles.dayNames}>
						{this.state.dates.map((dateObject, index) =>
							<Text key={index} style={styles.dayName}>{dateObject.dayName}</Text>
						)}
					</View>
					<View style={styles.dates}>
						{this.state.dates.map((dateObject, index) => {
							let isSelected = false;
							if (this.props.selectedDate) {
								if (this.props.selectedDate == dateObject.date) {
									isSelected = true;
								}
							} else {
								if (moment().format("YYYY-MM-DD") == dateObject.date) {
									isSelected = true;
								}
							}
							return this.getDateView(dateObject, isSelected, index);
						})}
					</View>
				</View>

				{Platform.OS == 'android' && this.state.show && (
					<DateTimePicker
						testID="dateTimePicker"
						timeZoneOffsetInMinutes={0}
						value={currentTime}
						mode='date'
						is24Hour={true}
						display="default"
						onChange={(result) => {
							if (result.type == "set") {
								let time = result.nativeEvent.timestamp;
								this.setState({ currentTime: time, show: false });
								let selectedValue = moment(time).format("YYYY-MM-DD");
								this.selectTheDate(selectedValue);
							} else {
								this.setState({ show: false });
							}
						}}
					/>
				)}

				{Platform.OS == 'ios' && (
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.show}
						onRequestClose={() => {
							this.setState({ show: false });
						}} >
						<TouchableOpacity activeOpacity={0.9} onPress={() => {
							this.setState({ show: true })
						}} style={styles.modalRoot}>
							<View style={styles.modalContent}>
								<DateTimePicker
									testID="dateTimePicker"
									// timeZoneOffsetInMinutes={0}
									value={currentTime}
									mode='date'
									is24Hour={true}
									display="default"
									onChange={(result, selectedDate) => {
										console.log("selected", selectedDate);
										if (selectedDate) {
											this.setState({ currentTime: selectedDate });
											let selectedValue = moment(selectedDate).format("YYYY-MM-DD");
											this.selectTheDate(selectedValue);
										}
									}}
								/>
								<View style={{ height: 1, backgroundColor: Color.primary, marginVertical: 5 }} />
								<Row>
									<Column>
										<Button labelButton='Cancel' theme='secondary'
											onPress={() => {
												this.setState({ show: false });
											}} />
									</Column>
									<Column>
										<Button labelButton='Ok' theme='primary'
											onPress={() => {
												let time = this.state.currentTime;
												console.log("Selected Time", time);
												let selectedValue = moment(time).format("YYYY-MM-DD");
												this.selectTheDate(selectedValue);
												this.setState({ show: false });
											}} />
									</Column>
								</Row>
							</View>
						</TouchableOpacity>
					</Modal>
				)}
			</>
		);
	}
}
const styles = StyleSheet.create({
	topBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5
	},
	topBoxTitle: {
		textAlign: 'right',
		marginRight: 10,
		color: Color.blackFont,
		fontSize: 13,
		flex: 1
	},
	topBoxWrapper: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: Color.gray,
		paddingVertical: 5,
		paddingHorizontal: 10
	},
	topBoxDate: {
		color: Color.primary,
		fontSize: 13
	},
	calendarBox: {
		// borderWidth: 1,
		// borderColor: 'red'
	},
	dayNames: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
	},
	dates: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
	},
	dayName: {
		// borderWidth: 1,
		// borderColor: 'black',
		width: '14.2%',
		textAlign: 'center',
		padding: 5,
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '500',
		fontSize: 13,
	},
	dateValue: {
		width: '14.2%',
		height: 48,
		// padding: 10
		// textAlign: 'center',
		borderColor: 'black',
		// borderWidth: 1,
	},
	dateValueTouchable: {
		height: 46,
		// backgroundColor: '#3E7BFA',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
	},
	dateValueTouchableSelected: {
		backgroundColor: '#3E7BFA',
		// color: '#FFFFFF'
	},
	defaultTextColor: {
		color: Color.black,
		fontWeight: 'bold'
	},
	selectedTextColor: {
		color: '#FFFFFF',
	},

	dateSelected: {
		backgroundColor: '#3E7BFA',
		color: '#FFFFFF',
	},
	modalRoot: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.1)'
	},
	modalContent: {
		width: 300,
		padding: 16,
		borderRadius: 5,
		backgroundColor: Color.white
	},
});
export default CalendarWeekView;