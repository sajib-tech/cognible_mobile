/* eslint-disable react-native/no-inline-styles */
import React, { Component, useState } from 'react';

//graphql
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Overlay, Input } from 'react-native-elements';
import {
	client,
	getMandData,
	recordMandData,
	createDailyClick,
	getDailyClick,
} from '../../constants';

import {
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
} from 'react-native';
import { getStr } from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BehaviourDecelVideoCard from '../../components/BehaviourDecelVideoCard';
import CalendarWeekView from '../../components/CalendarWeekView';
import DateHelper from '../../helpers/DateHelper';
import store from '../../redux/store';
import StudentHelper from '../../helpers/StudentHelper';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const BehaviourDecelMandScreen = props => {
	let datevalue = DateHelper.getTodayDate();
	let {route} = props;
	let studentIdFromProps = "";
	if(route && route.params) {
		studentIdFromProps = route.params.studentId;    
	} else if(props.studentId) {
		studentIdFromProps = props.studentId;    
	}
	const [date, setDate] = useState(datevalue);
	const [studentId, setStudentId] = useState(studentIdFromProps);
	const { loading, error, data, refetch: refetchMandData } = useQuery(
		getMandData,
		{
			client,
			variables: { studentId: studentId, date },
		},
	);
	const {
		loading: dailyClikLoading,
		error: dailyClickError,
		data: dailyClickData,
	} = useQuery(getDailyClick, {
		client,
		variables: { studentId: studentId },
	});
	const [
		recordMand,
		{ loading: mutationLoading, error: mutationError },
	] = useMutation(recordMandData, {
		client,
		refetchQueries: [
			{
				query: getMandData,
				variables: { studentId: studentId, date: datevalue },
			},
			{
				query: getDailyClick,
				variables: { studentId: studentId },
			},
		],
	});

	const [
		dailyClick,
		{ loading: clickLoading, error: clickError, data: clickData },
	] = useMutation(createDailyClick, {
		client,
	});
	let loadingData =
		loading || mutationLoading || clickLoading || dailyClikLoading;
	let errorData = error || mutationError || clickError || dailyClickError;
	return (
		<BehaviourDecelMandScreenP
			{...props}
			data={data}
			recordMand={recordMand}
			dailyClick={dailyClick}
			dailyClickData={dailyClickData}
			setDate={setDate}
			loadingData={loadingData}
			errorData={errorData}
			refetchMandData={refetchMandData}
			clickData={clickData}
			studentId={studentId}
		/>
	);
};
class BehaviourDecelMandScreenP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			modalShow: false,
			popup: false,
			selectedItem: '',
			selectedValue: '',
			createItem: '',
			data: 0,
			weekDates: DateHelper.getCurrentWeekDates(),
			currentDate: DateHelper.getTodayDate(),
		};
	}

	getMedicalVideoData() {
		let titleText = 'Learn about teaching {name} to request items (Mand)';
		titleText = titleText.replace('{name}', StudentHelper.getStudentName());
		let data = [
			{
				title: titleText,
				videoDuration: '5 Min',
			},
		];
		return data;
	}

	increment = node => {
		if (this.state.currentDate === DateHelper.getTodayDate()) {
			console.log('update kro');
			this.props.recordMand({
				variables: {
					dailyClick: node.id,
					data: node.data + 1,
					date: DateHelper.getTodayDate(),
				},
			});
		}
	};
	decrement = node => {
		if (this.state.currentDate === DateHelper.getTodayDate() && node.data > 0) {
			console.log('update kro');
			this.props.recordMand({
				variables: {
					dailyClick: node.id,
					data: node.data - 1,
					date: DateHelper.getTodayDate(),
				},
			});
		}
	};

	toggleFunction = () => {
		console.log('toggle Function');
		this.setState({ isVisible: true });
	};

	onCreateItem = () => {
		let { createItem } = this.state;
		console.log('created', {
			studentId: this.props.studentId,
			measurements: createItem,
		});
		this.props.dailyClick({
			variables: {
				studentId: this.props.studentId,
				measurements: createItem,
			},
		});
		this.setState({ popup: false, dataUpdate: true });
	};

	addClick = () => {
		let { measuringData, selectedItem } = this.state;
		let date = DateHelper.getTodayDate();
		const queryParams = {
			dailyClick: selectedItem,
			date,
			data: measuringData,
		};
		console.log('queryParams', queryParams);
		this.props.recordMand({
			variables: queryParams,
		});
		this.setState({ isVisible: false });
	};

	callBackFromCalendar = selectedDateFromCalendar => {
		console.log(selectedDateFromCalendar);
		this.props.setDate(selectedDateFromCalendar);
	};

	renderContent() {
		let { data, dailyClickData, loadingData, errorData, clickData } = this.props;
		let { popup, selectedItem, dataUpdate } = this.state;
		if (clickData && dataUpdate) {
			let dailyClick = clickData.createDailyClick.details.id;
			let date = DateHelper.getTodayDate();
			let queryParams = {
				dailyClick,
				date,
				data: 0,
			};
			this.setState({ dataUpdate: false });
			this.props.recordMand({
				variables: queryParams,
			});
		}
		// console.log('data:', data);
		let dataArray = data ? data.getMandData.edges : [];
		let dailyClickArray = dailyClickData
			? dailyClickData.getClickData.edges
			: [];
		let mixData = dailyClickArray.map(el => {
			let nodeData = null;
			dataArray.forEach(ele => {
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
			return nodeData;
			// return {
			//   id: el.node.id,
			//   measurments: el.node.measurments,
			//   data: 0,
			// };
		});
		console.log('mixData', mixData);
		// console.log('dailyClickData=>: ', dailyClickArray);
		let dailyClickPickerList = dailyClickArray.map(el => (
			<Picker.Item
				key={el.node.id}
				label={el.node.measurments}
				value={el.node.id}
			/>
		));
		let mandDataCounterList = mixData.map(el => (
			<View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
				<Text
					style={{
						width: '80%',
						textAlign: 'left',
						color: '#393E46',
						fontSize: 16,
					}}>
					{StudentHelper.getStudentName()} asks for a {el.measurments}
				</Text>

				<View style={{ flexDirection: 'row', width: '20%' }}>
					<TouchableOpacity onPress={() => this.decrement(el)}>
						<Text style={{ color: '#393E46', fontSize: 16, paddingRight: 20 }}>
							-
            </Text>
					</TouchableOpacity>
					<Text style={{ color: '#393E46', fontSize: 16, paddingRight: 20 }}>
						{el.data}
					</Text>
					<TouchableOpacity onPress={() => this.increment(el)}>
						<Text style={{ fontSize: 16, color: '#3E7BFA' }}>+</Text>
					</TouchableOpacity>
				</View>
			</View>
		));
		let { weekDates } = this.state;

		return (
			<>
				<ScrollView contentInsetAdjustmentBehavior="automatic"
					style={styles.scrollView}>
					{
						!this.props.isFromSession && (
							<CalendarWeekView
								dates={weekDates}
								parentCallback={this.callBackFromCalendar}
							/>	
						)
					}
					

					<View style={{ height: 10 }} />
					{/* <View>
						{this.state.isVisible ? (
							<TextInput>Input goes here..</TextInput>
						) : null}
						<Button title="Submit" onPress={this.props.dailyClick} />
						</View> */}

					{
						!this.props.isFromSession && (
							<BehaviourDecelVideoCard
								title={this.getMedicalVideoData()[0].title}
								videoDuration={this.getMedicalVideoData()[0].videoDuration}
							/>
						)
					}

					<View style={{ height: 10 }} />

					{/* {newMandData} */}
					{mandDataCounterList}
					<Overlay
						width={250}
						height={300}
						onBackdropPress={() => this.setState({ isVisible: false })}
						isVisible={this.state.isVisible}>
						<View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Text
									style={{
										fontSize: 24,
										fontWeight: 'bold',
										textAlign: 'center',
										padding: 10,
										marginVertical: 10,
									}}>
									Enter Mand Data
                  					</Text>
							</View>
							<View style={styles.counterContainer}>
								<TouchableOpacity
									style={styles.counterBtn}
									onPress={() => this.setState({ popup: true })}>
									<Text style={styles.counterBtnText}>+</Text>
								</TouchableOpacity>
								<View>
									<Picker
										style={styles.pickerStyleIntensity}
										selectedValue={selectedItem}
										onValueChange={itemValue =>
											this.setState({ selectedItem: itemValue })
										}>
										{dailyClickPickerList}
									</Picker>
								</View>
							</View>
							<View style={styles.formElement}>
								<Input
									placeholder="number of times"
									keyboardType="number-pad"
									onChangeText={text => this.setState({ measuringData: text })}
								/>
							</View>
							<Button title="Submit" onPress={this.addClick} />
						</View>
					</Overlay>

					<View
						style={{
							textAlign: 'center',
							justifyContent: 'center',
							height: 160,
							backgroundColor: '#FAFAFA',
						}}>
						<Text
							style={{
								width: '100%',
								textAlign: 'center',
								fontSize: 16,
								color: '#000000',
							}}>
							PLACEHOLDER FOR GRAPH
              				</Text>
					</View>
				</ScrollView>
				{popup && (
					<Overlay
						width={300}
						height={250}
						style={{ width: '100', height: '100' }}
						isVisible
						onBackdropPress={() => this.setState({ popup: false })}>
						<View style={{ flex: 1 }}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									borderBottomWidth: 0.3,
									borderBottomColor: 'grey',
								}}>
								<Text style={{ fontSize: 20, padding: 10 }}>
									Enter Items Name
								</Text>
							</View>
							<Input
								placeholder="item name"
								onChangeText={text => this.setState({ createItem: text })}
							/>
							<View style={{ flex: 1 }} />
							<Button labelButton="Submit" onPress={() => this.onCreateItem()} />
						</View>
					</Overlay>
				)}
				{loadingData && (
					<Overlay isVisible fullScreen>
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<ActivityIndicator size="large" color="blue" />
						</View>
					</Overlay>
				)}
				{errorData && (
					<Overlay isVisible fullScreen>
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Text>Error Occured !!</Text>
						</View>
					</Overlay>
				)}
			</>
		);
	}

	render() {
		return (
			<SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
				{
					!this.props.isFromSession && (
						<NavigationHeader
							title='Mand Data'
							backPress={() => this.props.navigation.goBack()}
						/>
					)
				}

				<Container>
					{OrientationHelper.getDeviceOrientation() == 'portrait' && (
						<>
							{this.renderContent()}
						</>
					)}

					{OrientationHelper.getDeviceOrientation() == 'landscape' && (
						<Row>
							<Column style={{ flex: 2 }}>
								{this.renderContent()}
							</Column>
							<Column>
								<Text style={{ color: '#000', fontSize: 16, marginBottom: 5 }}>New Mand</Text>

								<Text style={{ color: Color.grayFill, fontSize: 14 }}>Enter Item Name</Text>
								<TextInput style={styles.input}
									multiline={true}
									placeholder={'Item Name'}
									defaultValue={this.state.createItem}
									onChangeText={(createItem) => this.setState({ createItem })}
								/>

								<Button labelButton='Save Mand'
									onPress={() => {
										this.onCreateItem()
									}} />
							</Column>
						</Row>
					)}

					{OrientationHelper.getDeviceOrientation() == 'portrait' && (
						<View style={{ paddingVertical: 5 }}>
							<Button labelButton='New Mand Data'
								onPress={() => {
									this.setState({ popup: true })
								}} />
						</View>
					)}
				</Container>
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
		bottom: 20,
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
		elevation: 1,
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
});
export default BehaviourDecelMandScreen;
