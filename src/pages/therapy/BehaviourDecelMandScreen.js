/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Overlay, Input } from 'react-native-elements';

import {
	Alert,
	Text,
	TextInput,
	View,
	StyleSheet,
	Image,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Picker,
	Dimensions,
	Modal,
} from 'react-native';
import { getStr } from '../../../locales/Locale';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Ionicons from 'react-native-vector-icons/Ionicons'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BehaviourDecelVideoCard from '../../components/BehaviourDecelVideoCard';
import { connect } from 'react-redux';
import ParentRequest from '../../constants/ParentRequest';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken } from '../../redux/actions/index';
import moment from 'moment/min/moment-with-locales';
import store from '../../redux/store';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import CalendarView from '../../components/CalendarView';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const KEYS_TO_FILTERS = ['node.measurments'];



class BehaviourDecelMandScreen extends Component {
	constructor(props) {
		super(props);

		this.params = this.props.route.params;
		console.log("Params behaviourdecelmandscreen 51", this.props);

		this.state = {
			student: this.params.student,
			studentId: this.params.studentId,
			isLoading: false,
			mandItems: [],
			dailyClicksData: [],
			noDataText: '',
			createItem: '',
			selectedDate: moment().format("YYYY-MM-DD"),
			newItemError: '',
			videoText: getStr('NewChanges.Learnabout'),
			isContentLoaded: false,
			searchText: '',

		};
	}

	componentDidMount() {
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		this.getData();
	}

	getData() {
		this.setState({ isLoading: true, mandItems: [] });
		let variables = {
			studentId: this.state.studentId,
			date: this.state.selectedDate
		};
		console.log("Vars", variables);
		ParentRequest.getMandPage(variables).then(mandData => {
			console.log("getMandPage", mandData);
			let mandItems = mandData.data.getClickData.edges;
			this.setState({ isLoading: false, isContentLoaded: true, mandItems });
		}).catch(error => {
			console.log("Mand data Error: ", error);
			this.setState({ isLoading: false, isContentLoaded: true });
			Alert.alert('Information', error.toString());
		});
	}

	asd___componentDidMount() {
		//Call this on every page
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		let { route } = this.props;
		let studentIdFromProps = "";
		let student = {};
		if (route && route.params) {
			console.log("-----------" + JSON.stringify(route.params))
			studentIdFromProps = route.params.studentId;
			student = route.params.student;
		} else if (this.props.studentId) {
			studentIdFromProps = this.props.studentId;
			student = this.props.student;
			console.log(JSON.stringify(this.props))
		}
		let studentId = studentIdFromProps;
		let selectedDate = this.state.selectedDate;
		let newText = this.state.videoText.replace('Child', student.firstname);
		this.setState({ studentId: studentId, student: student, videoText: newText });
		console.log(studentId + "," + selectedDate);
		this.getDailyClickData(studentId, selectedDate);
		// this.getMandData(studentId, selectedDate);
	}
	getDailyClickData(studentId, selectedDate) {
		this.setState({ isLoading: true, dailyClicksData: [] });
		let variables = {
			studentId: studentId
		};
		console.log("Vars", variables);
		ParentRequest.fetchDailyClicksData(variables).then(dailyClicksData => {
			console.log("fetchDailyClicksData", dailyClicksData);
			this.setState({ isLoading: false, isContentLoaded: true });
			// if(dailyClicksData.data.getClickData.edges === 0) {
			//     this.setState({ noDataText :"No data found"});
			// }
			this.setState({ dailyClicksData: dailyClicksData.data.getClickData.edges, isLoading: false });
			this.getMandData(studentId, selectedDate, dailyClicksData.data.getClickData.edges)
		}).catch(error => {
			console.log("Daily click Error: " + JSON.stringify(error));
			this.setState({ isLoading: false, isContentLoaded: true });
			Alert.alert('Information', error.toString());
		});
	}
	getMandData(studentId, selectedDate, dailyClicksData) {

		this.setState({ isLoading: true, mandItems: [] });
		let variables = {
			studentId: studentId,
			date: selectedDate
		};
		console.log("Vars", variables);
		ParentRequest.fetchMandData(variables).then(mandData => {
			console.log("fetchMandData", mandData);
			this.setState({ isLoading: false, isContentLoaded: true });
			console.log(1)
			this.processMandItems(dailyClicksData, mandData.data.getMandData.edges)
			console.log(2)
			// if(mandData.data.getMandData.edges.length === 0) {
			//     this.setState({ noDataText :"No data found"});
			// }
			// this.setState({mandItems: mandData.data.getMandData.edges, isLoading: false});
		}).catch(error => {
			console.log("Mand data Error: " + JSON.stringify(error));
			this.setState({ isLoading: false, isContentLoaded: true });
			Alert.alert('Information', error.toString());
		});
	}
	processMandItems(dailyClicksData, mandItems) {
		let tempMandItems = [];
		dailyClicksData.map(el => {
			let nodeData = null;
			mandItems.forEach(ele => {
				if (ele.node.dailyClick.id === el.node.id) {
					nodeData = {
						id: el.node.id,
						measurments: el.node.measurments,
						data: ele.node.data,
					};
				}
			});
			if (!nodeData) {
				nodeData = {
					id: el.node.id,
					measurments: el.node.measurments,
					data: 0,
				};
			}
			tempMandItems.push(nodeData)
			// return nodeData;
			// return {
			//   id: el.node.id,
			//   measurments: el.node.measurments,
			//   data: 0,
			// };
		});
		this.setState({ mandItems: tempMandItems });
	}

	callBackFromCalendar = (selectedDateFromCalendar) => {
		console.log(JSON.stringify(this.state));
		console.log(selectedDateFromCalendar + "==" + this.state.selectedDate);
		if (selectedDateFromCalendar === this.state.selectedDate) {
			console.log("reselected same date")
		} else {
			console.log("selectedDate:" + selectedDateFromCalendar);
		}
		let studentId = this.state.studentId;
		let selectedDate = this.state.selectedDate;
		this.setState({ isLoading: true, noDataText: "", selectedDate: selectedDateFromCalendar, mandItems: [] });
		console.log(studentId + "," + selectedDateFromCalendar);
		this.getDailyClickData(studentId, selectedDateFromCalendar);
	}

	getMedicalVideoData() {
		// let titleText = 'Learn about teaching Child to request items (Mand)';
		// titleText = titleText.replace('Child', this.state.student.firstname);
		// console.log("titleText: "+titleText)
		let data = [
			{
				title: this.state.videoText,
				videoDuration: '5 Min',
			},
		];
		return data;
	}

	updateMandCount(node, type) {
		let count = 0;
		if (node.node.dailyClickDataSet.edges.length != 0) {
			count = node.node.dailyClickDataSet.edges[0].node.data;
		}
		if (type === 'inc') {
			count += 1;
		} else if (type === 'dec') {
			if (count == 0) {
				return;
			}
			count -= 1;
		}

		let variables = {
			dailyClick: node.node.id,
			data: count,
			date: this.state.selectedDate,
		}
		if (this.props.isFromSession) {
			variables.sessionId = this.props.sessionId;
		}
		console.log("updateMandCount Vars", variables);
		ParentRequest.updateRecordMandData(variables).then(updatedData => {
			console.log("updatedData: " + JSON.stringify(updatedData));
			this.setState({ isLoading: false });
			this.getData();
		}).catch(error => {
			console.log("update Mand data Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
			Alert.alert('Information', error.toString());
		});
	}

	deleteMand(node) {
		Alert.alert(
			'Information',
			'Are you sure want to delete \'' + node.measurments + '\' ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						let variables = { id: node.id };
						ParentRequest.deleteMandData(variables).then((result) => {
							this.getData();
						}).catch((error) => {
							Alert.alert('Information', error.toString());
						});
					}
				},
			],
			{ cancelable: false }
		);
	}

	getMandItemRow(el, index) {
		let childName = "Child";
		let { student } = this.state;
		if (student && student.firstname) {
			childName = student.firstname;
		}

		let count = 0;
		if (el.node.dailyClickDataSet.edges.length != 0) {
			count = el.node.dailyClickDataSet.edges[0].node.data;
		}

		return (
			<View style={{ flex: 1, flexDirection: 'row', paddingTop: 20, alignItems: 'center' }} key={index}>
				<Text style={{ padding: 10, flex: 1, textAlign: 'left', color: '#393E46', fontSize: 16 }}>
					{childName}'s requests for {el.node.measurments}
				</Text>

				{/* <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {
					this.deleteMand(el);
				}}>
					<MaterialCommunityIcons name='trash-can-outline' size={20} color={Color.danger} />
				</TouchableOpacity> */}

				<View style={{ flexDirection: 'row', width: 90, alignItems: 'center' }}>
					<TouchableOpacity onPress={() => this.updateMandCount(el, 'dec')}>
						<MaterialCommunityIcons name='minus' color={Color.primary} size={25} />
					</TouchableOpacity>
					<Text style={{ padding: 10, color: '#393E46', fontSize: 16, textAlign: 'center', flex: 1 }}>
						{count}
					</Text>
					<TouchableOpacity onPress={() => this.updateMandCount(el, 'inc')}>
						<MaterialCommunityIcons name='plus' color={Color.primary} size={25} />
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
					if (this.props.isFromSession) {
						this.props.onGraphClick(el)
					} else {
						this.props.navigation.navigate("BehaviourDecelMandGraph", {
							mandData: el,
							studentId: this.state.studentId
						});
					}
				}}>
					<MaterialCommunityIcons name='chart-areaspline' color={Color.black} size={25} />
				</TouchableOpacity>
			</View>
		)
	}

	renderContent() {
		let { mandItems, isContentLoaded, isLoading } = this.state;
		const filteredMandItems = mandItems.filter(createFilter(this.state.searchText, KEYS_TO_FILTERS))
		console.log('Mand items check2-->' + JSON.stringify(mandItems));
		console.log('Filtered Mand length check --' + filteredMandItems);
		if (!isLoading) {
			return (
				<>
					<View style={styles.searchWrapper}>
						<Ionicons
							name='ios-search'
							size={24}
							color={Color.gray}
						/>
						<View style={styles.searchInputWrapper}>
							<SearchInput
								onChangeText={(searchText) => { this.setState({ searchText }) }}
								style={styles.searchInput}
								placeholder="Search Template"
							/>
						</View>
					</View>
					<ScrollView contentInsetAdjustmentBehavior="automatic"
						style={styles.scrollView}>

						{/* {!this.props.isFromSession && isContentLoaded && (
						<BehaviourDecelVideoCard
							title={this.getMedicalVideoData()[0].title}
							videoDuration={this.getMedicalVideoData()[0].videoDuration}
						/>
					)} */}
						{filteredMandItems.length == 0 && <NoData>No Mand Data Available</NoData>}

						{filteredMandItems.map((el, index) => (
							this.getMandItemRow(el, index)
						))}
					</ScrollView>
				</>
			);
		}
		return null;
	}

	renderNewMandForm() {
		return (
			<>
				<Text style={{ color: '#000', fontSize: 16, marginBottom: 5 }}>{getStr('NewMeal.NewMand')}</Text>

				<Text style={{ color: Color.grayFill, fontSize: 14 }}>
					{getStr('NewMeal.enterNem')}
					<Text style={{ color: 'red' }}>{this.state.newItemError}</Text>
				</Text>
				<TextInput style={styles.input}
					multiline={true}
					placeholder={getStr('NewMeal.ItemName')}
					defaultValue={this.state.createItem}
					onChangeText={(createItem) => this.setState({ createItem })}
				/>

				<Button labelButton={getStr('NewMeal.SaveMand')}
					onPress={() => {
						this.onCreateItem()
					}} />
			</>
		)
	}

	onCreateItem() {
		let { createItem, studentId } = this.state;
		if (createItem === '') {
			this.setState({ newItemError: " (cant be empty)" })
			return;
		}

		this.setState({ newItemError: "", popup: false, isLoading: true })

		let variables = {
			studentId: studentId,
			measurements: createItem
		};
		ParentRequest.createMandData(variables).then(createdData => {
			console.log("createdData: " + JSON.stringify(createdData));
			this.setState({ isLoading: false, createItem: '' });
			this.getData();
		}).catch(error => {
			console.log("Create Mand data Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	};

	render() {
		let { isLoading, popup } = this.state;
		return (
			<SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
				<NavigationHeader
					enable={this.props.disableNavigation != true}
					title={getStr('NewMeal.MandData')}
					backPress={() => this.props.navigation.goBack()}
				/>

				<Container enablePadding={this.props.disableNavigation != true}>
					{OrientationHelper.getDeviceOrientation() == 'portrait' && (
						<>
							<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
								{!this.props.isFromSession && (
									<CalendarView
										parentCallback={(selectedDate) => {
											this.setState({ selectedDate }, () => {
												this.getData();
											});
										}}
										selectedDate={this.state.selectedDate}
									/>
								)}

								{this.renderContent()}

							</ScrollView>
							{isLoading && (
								<ActivityIndicator size="large" color="black" style={{
									zIndex: 9999999,
									// backgroundColor: '#ccc',
									opacity: 0.9,
									position: 'absolute',
									top: 0, left: 0, right: 0, bottom: 0,
									height: screenHeight,
									justifyContent: "center"
								}} />
							)}
						</>
					)}

					{OrientationHelper.getDeviceOrientation() == 'landscape' && (
						<Row>
							<Column style={{ flex: 2 }}>
								{!this.props.isFromSession && (
									<CalendarView
										parentCallback={(selectedDate) => {
											this.setState({ selectedDate }, () => {
												this.getData();
											});
										}}
										selectedDate={this.state.selectedDate}
									/>
								)}
								{this.renderContent()}
							</Column>
							<Column>
								<Text style={{ color: '#000', fontSize: 16, marginBottom: 5 }}>{getStr('NewMeal.NEWMand')}</Text>

								<Text style={{ color: Color.grayFill, fontSize: 14 }}>Enter Item Name</Text>
								<TextInput style={styles.input}
									multiline={true}
									placeholder={getStr('NewMeal.ItemName')}
									defaultValue={this.state.createItem}
									onChangeText={(createItem) => this.setState({ createItem })}
								/>

								<Button labelButton={getStr('NewMeal.SaveMand')}
									onPress={() => {
										this.onCreateItem()
									}} />
							</Column>
						</Row>
					)}

					{(OrientationHelper.getDeviceOrientation() == 'portrait') && !isLoading && (
						<Button labelButton={getStr('NewMeal.NEWMand')}
							style={{ marginBottom: 10 }}
							onPress={() => {
								this.setState({ popup: true })
							}} />
					)}
				</Container>
				{popup && (
					<Overlay
						width={300}
						height={200}
						style={{ width: '100', height: '100' }}
						isVisible
						onBackdropPress={() => this.setState({ popup: false })}>
						{this.renderNewMandForm()}
					</Overlay>
				)}
			</SafeAreaView>
		);
	}
}
const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		height: 50,
		width: '100%',
		backgroundColor: '#FFFFFF',
	},
	backIcon: {
		fontSize: 50,
		fontWeight: 'normal',
		color: '#fff',
		width: '10%',
		paddingTop: 15,
		paddingLeft: 15,
	},
	backIconText: {
		fontSize: 20,
		fontWeight: 'normal',
		color: '#63686E',
	},
	headerTitle: {
		textAlign: 'center',
		width: '80%',
		fontSize: 22,
		paddingTop: 10,
		color: '#45494E',
	},

	//
	continueViewTouchable: {
		marginTop: 28,
		paddingTop: 10,
		paddingBottom: 20,
		marginLeft: 12,
		marginRight: 12,
		marginBottom: 15,
		backgroundColor: '#1E90FF',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff',
	},
	continueView: {
		width: '100%',
		position: 'absolute',
		bottom: 10,
		left: 20,
		paddingVertical: 5
	},
	continueViewFromSession: {
		width: '100%',
		position: 'absolute',
		bottom: 100,
		left: 20,
		paddingVertical: 5
	},
	continueViewText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	},
	counterContainer: {
		flexDirection: 'row',
		padding: 10,
		alignItems: 'center',
	},
	counterBtn: {
		borderRadius: 8,
		borderColor: 'blue',
		borderStyle: 'solid',
		borderWidth: 1.25,
		width: 36,
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
	},
	counterBtnText: {
		color: '#3E7BFA',
		fontSize: 20,
	},
	pickerStyleIntensity: {
		width: 150,
		color: '#63686E',
		marginLeft: 20,
	},
	formInput: {
		marginVertical: 10,
		borderWidth: 1.25,
		borderStyle: 'solid',
		borderColor: '#D5D5D5',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
		width: '100%',
		backgroundColor: '#ffffff',
	},
	formElement: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
		marginBottom: 30,
	},
	input: {
		marginVertical: 10,
		padding: 6,
		borderRadius: 6,
		borderColor: '#DCDCDC',
		borderWidth: 1,
		flexDirection: 'row'
	},
	searchInputWrapper: {
		flex: 1,
		marginLeft: 10,
	},
	searchInput: {

	},
	searchWrapper: {
		backgroundColor: '#eee',
		flexDirection: 'row',
		borderRadius: 5,
		marginVertical: 5,
		alignItems: 'center',
		paddingHorizontal: 10,
		height: 50
	},
});
const mapStateToProps = (state) => ({
	authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(BehaviourDecelMandScreen);
