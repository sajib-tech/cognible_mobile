import React, { Component, useState } from 'react';
//graphql
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
	client,
	getAbcData,
	newAbcdata,
	createBehaviour,
	createAntecedent,
	createConsequence,
} from '../../constants/index';

import {
	Text,
	View, Dimensions,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Picker,
	Alert,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { getStr } from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiSelectComponent from '../../components/MultiSelectComponent';
import store from '../../redux/store';
import Color from '../../utility/Color';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload, setMedicalData } from '../../redux/actions/index';
import ParentRequest from '../../constants/ParentRequest';
import PickerModal from '../../components/PickerModal';
import moment from 'moment';
import DateInput from '../../components/DateInput';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height

class AbcDataScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSaving: false,
			studentId: '',
			antecedentArray: [],
			behaviourArray: [],
			consequenceArray: [],
			antecedentSelect: [],
			modalShow: false,
			popup: false,
			key: '',
			items: [],
			intensity: null,
			response: null,
			func: null,
			frequency: 0,
			antecedent: false,
			behavior: false,
			consequence: false,
			notes: "",
			environments: [],
			selectedEnvironment: null,
			behaviourSelect: [],
			consequenceSelect: [],
			antecedentSelect: [],
			selectedItems: [],
			isVisible: true,
			create: '',
			createItem: '',
			behaviorCreate: '',
			antecedentCreate: '',
			consequenceCreate: '',

			date: moment().format("YYYY-MM-DD"),
			time: moment().format("HH:mm a"),

			showError: "",
			notesErrorMessage: "",
			environmentErrorMessage: "",
			date: moment().format("YYYY-MM-DD"),
			time: moment().format("hh:mm A"),

			intensityErrorMessage: '',
			responseErrorMessage: '',
			functionErrorMessage: '',
		};

		this.abcData = null;
		if (this.props.route.params && this.props.route.params.abcData) {
			this.abcData = this.props.route.params.abcData;
			console.log("ABC", this.abcData);
		}
	}

	componentDidMount() {
		//Call this on every page
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		let studentId = store.getState().studentId;
		if (studentId == null || studentId == "") {
			studentId = this.props.route.params.studentId;
		}
		console.log("StudentID", studentId);
		this.setState({ studentId: studentId })
		this.getAbcData(studentId);
	}

	getAbcData(studentId) {
		this.setState({ isLoading: true });
		console.error("studentid", studentId)
		let variables = {
			studentId: studentId
		};
		ParentRequest.fetchAbcData(variables).then(abcData => {
			console.log("fetchAbcData ===============================>", abcData);
			this.setState({ isLoading: false });
			// console.log(1)
			let antecedentArray = abcData.data.getAntecedent.edges.map(el => ({
				id: el?.node?.id,
				name: el?.node?.antecedentName,
			}));
			// console.log(2)
			let behaviourArray = abcData.data.getBehaviour.edges.map(el => ({
				id: el?.node?.id,
				name: el?.node?.behaviorName,
			}));
			// console.log(3)
			let consequenceArray = abcData.data.getConsequences.edges.map(el => ({
				id: el?.node?.id,
				name: el?.node?.consequenceName,
			}));
			let environments = abcData.data.getEnvironment.map((env) => {
				return {
					id: env?.id,
					label: env?.name
				};
			})
			// console.log("antecedentArray:" + JSON.stringify(antecedentArray))
			this.setState({
				antecedentArray: antecedentArray,
				behaviourArray: behaviourArray,
				consequenceArray: consequenceArray,
				environments
			})
			// if(medicalData.data.getMedication.edges.length === 0) {
			//     this.setState({ noDataText :"No data found"});
			// }
			// this.setState({medicalItems: medicalData.data.getMedication.edges, isLoading: false});

			if (this.abcData) {
				console.log("ABC DATA", this.abcData);
				
				this.setState({
					intensity: this.abcData.node.Intensiy,
					response: this.abcData.node.response,
					frequency: this.abcData.node.frequency,
					behaviourSelect: this.abcData.node.behavior.edges.map((item) => {
						return item.node.id;
					}),
					consequenceSelect: this.abcData.node.consequences.edges.map((item) => {
						return item.node.id;
					}),
					antecedentSelect: this.abcData.node.antecedent.edges.map((item) => {
						return item.node.id;
					}),
					selectedEnvironment: this.abcData.node.environments?.id,
					date: this.abcData.node.date,
					time: this.abcData.node.time,
					notes: this.abcData.node.Notes,
					func: this.abcData.node.function,
				});
			}
		}).catch(error => {
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}
	modalHide = () => this.setState({ modalShow: false });
	modalShow = (items, selectedItems, key) =>
		this.setState({ modalShow: true, items, selectedItems, key });
	selectItems = (items, selector) => {
		console.log('selected items', selector);
		this.setState({ [selector]: items, modalShow: false, selectedItems: [] });
	};

	saveAntacedentItem(createItem) {
		this.setState({ isLoading: true })
		let variables = {
			studentId: this.state.studentId,
			name: createItem
		};
		console.log(variables);
		ParentRequest.saveAntacedentItem(variables).then(newData => {
			this.setState({ popup: false })
			this.setState({ isLoading: false })
			if (newData) {
				this.getAbcData(store.getState().studentId)
			}
		}).catch(error => {
			this.setState({ popup: false })
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}

	saveBehaviourItem(createItem) {
		this.setState({ isLoading: true })
		let variables = {
			studentId: this.state.studentId,
			name: createItem
		};
		ParentRequest.saveBehaviourItem(variables).then(newData => {
			this.setState({ popup: false })
			this.setState({ isLoading: false })
			if (newData) {
				this.getAbcData(store.getState().studentId)
			}
		}).catch(error => {
			this.setState({ popup: false })
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}

	saveConsequenceItem(createItem) {
		this.setState({ isLoading: true })
		let variables = {
			studentId: this.state.studentId,
			name: createItem
		};
		ParentRequest.saveConsequenceItem(variables).then(newData => {
			this.setState({ popup: false })
			this.setState({ isLoading: false })
			if (newData) {
				this.getAbcData(store.getState().studentId)
			}
		}).catch(error => {
			this.setState({ popup: false })
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}
	onCreateItem = () => {
		this.setState({ showError: "" });
		let { create, createItem } = this.state;
		if (createItem === "") {
			this.setState({ showError: "Cant be empty" });
			return;
		}
		console.log('onCreateItem', create, createItem);
		switch (create) {
			case 'behaviorCreate': {
				// this.props.addBehavior({ variables: { name: createItem } });
				// this.props.setUpdate(5);
				this.saveBehaviourItem(createItem)
				break;
			}
			case 'antecedentCreate': {
				console.log('antecedent');
				// this.props.addAntecedent({ variables: { name: createItem } });
				// this.props.refetch();
				// this.props.setUpdate(6);
				this.saveAntacedentItem(createItem);
				break;
			}
			case 'consequenceCreate': {
				// this.props.addConsequence({ variables: { name: createItem } });
				// this.props.refetch();
				// this.props.setUpdate(7);
				this.saveConsequenceItem(createItem)
				break;
			}
			default:
				console.log('error hai bhai error hai');
		}
	};

	validateForm() {
		let error = false;

		let {
			intensity,
			response,
			func,
			behaviourSelect,
			consequenceSelect,
			antecedentSelect,
		} = this.state;

		if (intensity == null) {
			this.setState({ intensityErrorMessage: "Please fill this data" });
			error = true;
		}

		if (response == null) {
			this.setState({ responseErrorMessage: "Please fill this data" });
			error = true;
		}

		if (func == null) {
			this.setState({ functionErrorMessage: "Please fill this data" });
			error = true;
		}

		return error;
	}

	handleSubmit = () => {
		if (this.validateForm()) {
			return;
		}

		this.setState({ isSaving: true });

		console.log('handle submit');
		let {
			intensity,
			response,
			frequency,
			behaviourSelect,
			consequenceSelect,
			antecedentSelect,
		} = this.state;

		let data = {
			studentId: this.state.studentId,
			intensity: intensity,
			response: response,
			frequency: frequency,
			behaviors: behaviourSelect,
			consequences: consequenceSelect,
			antecedents: antecedentSelect,
			date: this.state.date,
			time: this.state.time,
			environment: this.state.selectedEnvironment,
			notes: this.state.notes,
			function: this.state.func
		};
		console.log("Variables", data);

		let promise = null;

		if (this.abcData) {
			data.id = this.abcData.node.id;
			promise = ParentRequest.updateAbcData(data);
		} else {
			promise = ParentRequest.newAbcData(data);
		}

		promise.then(savedAbcData => {
			this.setState({ isSaving: false });
			if (savedAbcData) {
				Alert.alert("ABC Data", "Successfully Saved");
				if (this.props.disableNavigation) {

				} else {
					this.props.navigation.goBack();
				}
			}
		}).catch(error => {
			this.setState({ popup: false, isSaving: false })
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
			Alert.alert("Information", error.toString());
		});
	};

	renderCreateItem() {
		return (
			<Overlay width={300} height={200} isVisible
				onBackdropPress={() => this.setState({ popup: false })}>
				<View style={{ flex: 1 }}>
					<TextInput
						label={getStr('NewChanges.EnterItemsName')}
						error={this.state.showError}
						placeholder={getStr('NewMeal.ItemName')}
						onChangeText={text => this.setState({ createItem: text })}
					/>
				</View>
				<Button labelButton={getStr('NewChanges.Submit')} onPress={this.onCreateItem} />
			</Overlay>
		)
	}

	render() {
		let { isLoading, antecedentArray, antecedentSelect, behaviourArray, behaviourSelect, consequenceArray, consequenceSelect,
			modalShow, popup, key, items, selectedItems, intensity, response, frequency, func,
			notes, environments, selectedEnvironment
		} = this.state;

		console.log(antecedentArray)
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<NavigationHeader
					backPress={() => {
						this.props.navigation.goBack();
					}}
					title={getStr('Therapy.ABCData')}
					enable={this.props.disableNavigation != true}
				/>

				<Container enablePadding={this.props.disableNavigation != true}>
					<ScrollView contentInsetAdjustmentBehavior="automatic">
						<Text style={styles.grayText}>Date & Time</Text>
						<Row>
							<Column>
								<DateInput
									format='YYYY-MM-DD'
									mode='date'
									displayFormat='MMM DD, YYYY'
									value={this.state.date}
									onChange={(date) => {
										this.setState({ date });
									}} />
							</Column>
							<Column>
								<DateInput
									format='hh:mm A'
									mode='time'
									displayFormat='hh:mm A'
									value={this.state.time}
									onChange={(time) => {
										this.setState({ time });
									}} />
							</Column>
						</Row>

						<View style={styles.counterContainer}>
							<TouchableOpacity
								style={styles.counterBtn}
								onPress={() =>
									this.setState({ popup: true, create: 'antecedentCreate' })
								}>
								<Text style={styles.counterBtnText}>+</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.counterDisplay}
								onPress={() =>
									this.modalShow(
										antecedentArray,
										antecedentSelect,
										'antecedentSelect',
									)
								}>
								<Text style={styles.counterTextLeft}>
									{antecedentSelect.length > 0
										? antecedentArray.filter(
											el => el.id == antecedentSelect[0],
										)[0]?.name
										: 'Antecedent'}
								</Text>
								<View style={styles.counterTextRightContainer}>
									<Text style={styles.counterTextRight}>
										{antecedentSelect.length}
									</Text>
								</View>
							</TouchableOpacity>
						</View>

						<View style={styles.counterContainer}>
							<TouchableOpacity
								style={styles.counterBtn}
								onPress={() =>
									this.setState({ popup: true, create: 'behaviorCreate' })
								}>
								<Text style={styles.counterBtnText}>+</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.counterDisplay}
								onPress={() =>
									this.modalShow(
										behaviourArray,
										behaviourSelect,
										'behaviourSelect',
									)
								}>
								<Text style={styles.counterTextLeft}>
									{behaviourSelect.length > 0
										? behaviourArray?.filter(
											el => el?.id == behaviourSelect[0],
										)[0]?.name
										: 'Behavior'}
								</Text>
								<View style={styles.counterTextRightContainer}>
									<Text style={styles.counterTextRight}>
										{behaviourSelect.length}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.counterContainer}>
							<TouchableOpacity
								style={styles.counterBtn}
								onPress={() =>
									this.setState({ popup: true, create: 'consequenceCreate' })
								}>
								<Text style={styles.counterBtnText}>+</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.counterDisplay}
								onPress={() =>
									this.modalShow(
										consequenceArray,
										consequenceSelect,
										'consequenceSelect',
									)
								}>
								<Text style={styles.counterTextLeft}>
									{consequenceSelect.length > 0
										? consequenceArray.filter(
											el => el.id == consequenceSelect[0],
										)[0]?.name
										: 'Consequence'}
								</Text>
								<View style={styles.counterTextRightContainer}>
									<Text style={styles.counterTextRight}>
										{consequenceSelect.length}
									</Text>
								</View>
							</TouchableOpacity>
						</View>

						{this.state.intensityErrorMessage != "" && <Text style={styles.errorMessage}>{this.state.intensityErrorMessage}</Text>}
						<View style={styles.card}>
							<View style={styles.cardIcon}>
								<MaterialCommunityIcons name='chart-bar' color='#45494E' size={20} />
							</View>
							<Text style={styles.cardTitle}>{getStr('NewChanges.Intensity')}</Text>
							<View style={{ flex: 6 }}>
								<PickerModal
									style={styles.pickerStyle}
									textStyle={styles.pickerTextStyle}
									placeholder='Select Intensity'
									selectedValue={intensity}
									data={[
										{ id: "Severe", label: getStr('NewChanges.Severe') },
										{ id: "Moderate", label: getStr('NewChanges.Moderate') },
										{ id: "Mild Function", label: getStr('NewChanges.MildFunction') },
									]}
									onValueChange={(itemValue, itemIndex) => {
										this.setState({ intensity: itemValue });
									}}
								/>
							</View>
						</View>

						{this.state.responseErrorMessage != "" && <Text style={styles.errorMessage}>{this.state.responseErrorMessage}</Text>}
						<View style={styles.card}>
							<View style={styles.cardIcon}>
								<MaterialCommunityIcons name='human-greeting' color='#45494E' size={20} />
							</View>
							<Text style={styles.cardTitle}>{getStr('NewChanges.Response')}</Text>
							<View style={{ flex: 6 }}>
								<PickerModal
									style={styles.pickerStyle}
									textStyle={styles.pickerTextStyle}
									placeholder='Select Response '
									selectedValue={response}
									data={[
										{ id: "Improve", label: getStr('NewChanges.Improve') },
										{ id: "No Change", label: getStr('NewChanges.NoChange') },
										{ id: "Escalated", label: getStr('NewChanges.Escalated') },
									]}
									onValueChange={(itemValue, itemIndex) => {
										this.setState({ response: itemValue });
									}}
								/>
							</View>
						</View>
						<View style={styles.card}>
							<View style={styles.cardIcon}>
								<MaterialCommunityIcons name='numeric' color='#45494E' size={20} />
							</View>
							<Text style={styles.cardTitle}>{getStr('NewChanges.Frequency')}</Text>
							<View style={{ flex: 4, marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
								<TouchableOpacity style={{ width: 50, height: 40, justifyContent: 'center', alignItems: 'center' }}
									onPress={() =>
										frequency > 0
											? this.setState({ frequency: frequency - 1 })
											: null
									}>
									<MaterialCommunityIcons name={'minus'} size={20} color='#45494E' />
								</TouchableOpacity>
								<Text style={{ flex: 1, textAlign: 'center', fontSize: 20, color: Color.primary }}>{frequency}</Text>
								<TouchableOpacity style={{ width: 50, height: 40, justifyContent: 'center', alignItems: 'center' }}
									onPress={() => this.setState({ frequency: frequency + 1 })}>
									<MaterialCommunityIcons name={'plus'} size={20} color='#45494E' />
								</TouchableOpacity>
							</View>
						</View>

						{this.state.functionErrorMessage != "" && <Text style={styles.errorMessage}>{this.state.functionErrorMessage}</Text>}
						<View style={styles.card}>
							<View style={styles.cardIcon}>
								<MaterialCommunityIcons name='wrench' color='#45494E' size={20} />
							</View>
							<Text style={styles.cardTitle}>{getStr('NewChanges.Function')}</Text>
							<View style={{ flex: 6 }}>
								<PickerModal
									style={styles.pickerStyle}
									textStyle={styles.pickerTextStyle}
									placeholder='Select Function'
									selectedValue={func}
									data={[
										{ id: "Escape", label: getStr('NewChanges.Escape') },
										{ id: "Attention", label: getStr('NewChanges.Attention') },
										{ id: "Tangible", label: getStr('NewChanges.Tangible') },
										{ id: "Sensory", label: getStr('NewChanges.Sensory') },
									]}
									onValueChange={(itemValue, itemIndex) => {
										this.setState({ func: itemValue });
									}}
								/>
							</View>
						</View>

						<PickerModal
							label={getStr("TargetAllocate.Environment")}
							placeholder="Select Environment"
							error={this.state.environmentErrorMessage}
							selectedValue={selectedEnvironment}
							data={environments}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({ selectedEnvironment: itemValue });
							}}
						/>

						<TextInput
							label={getStr("TargetAllocate.Notes")}
							error={this.state.notesErrorMessage}
							multiline={true}
							placeholder={'Notes'}
							defaultValue={notes}
							onChangeText={(notes) => this.setState({ notes })}
						/>

						{modalShow && (
							<MultiSelectComponent
								selector={key}
								isVisible={modalShow}
								items={items}
								selectedItems={selectedItems}
								modalHide={this.modalHide}
								selectItems={this.selectItems}
							/>
						)}
						{popup && (
							this.renderCreateItem()
						)}
					</ScrollView>
					<Button labelButton={getStr('lang.continue_btn')}
						isLoading={this.state.isSaving}
						style={{ marginBottom: 10 }}
						onPress={() => {
							this.handleSubmit();
						}}
					/>
				</Container>
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
			</SafeAreaView>
		)
	}
}
const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		flexDirection: 'row',
		padding: 10,
		width: '100%',
	},
	pickerStyle: {
		borderWidth: 0
	},
	pickerTextStyle: {
		textAlign: 'right'
	},

	errorMessage: {
		color: Color.danger,
		marginTop: 10
	},

	card: {
		backgroundColor: Color.white,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.18,
		shadowRadius: 1.00,

		elevation: 1,
		paddingVertical: 0,
		paddingLeft: 15,
		paddingRight: 10,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 3,
		marginVertical: 5
	},

	cardIcon: {
		width: 35,
	},

	cardTitle: {
		flex: 5,
		fontSize: 16,
		fontWeight: 'bold',
		color: "#45494E"
	},

	input: {
		marginVertical: 10,
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 6,
		borderColor: Color.gray,
		borderWidth: 1,
		flex: 1,
		flexDirection: 'row'
	},

	// mera code
	counterContainer: {
		flexDirection: 'row',
		marginVertical: 5,
	},
	counterBtn: {
		borderRadius: 8,
		borderColor: Color.primary,
		borderWidth: 1,
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	counterBtnText: {
		color: Color.primary,
		fontSize: 30,
	},
	counterDisplay: {
		borderRadius: 8,
		borderColor: Color.gray,
		borderWidth: 1,
		backgroundColor: '#ffffff',
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginLeft: 10,
	},
	counterTextLeft: {
		fontSize: 16,
		fontWeight: 'normal',
		fontStyle: 'normal',
		marginLeft: 10,
	},
	counterTextRightContainer: {
		borderRadius: 8,
		height: 36,
		width: 36,
		marginHorizontal: 5,
		backgroundColor: 'rgba(62, 123, 250, 0.05)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	counterTextRight: {
		color: 'blue',
		fontSize: 17,
		fontWeight: 'normal',
		fontStyle: 'normal',
	},

	createItemTitle: {
		flexDirection: 'row',
		justifyContent: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: 'grey',
	},
	createItemInput: {
		borderColor: Color.gray,
		borderWidth: 1,
		borderRadius: 5,
		marginVertical: 10,
		paddingHorizontal: 10,
	}
});
const mapStateToProps = (state) => ({
	authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
	dispatchSetMedicalData: (data) => dispatch(setMedicalData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbcDataScreen);
