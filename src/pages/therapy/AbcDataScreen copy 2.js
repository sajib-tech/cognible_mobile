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
	View,Dimensions,
	StyleSheet,
	TextInput,
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
import MultiSelectComponent from '../../components/MultiSelectComponent';
import store from '../../redux/store';
import Color from '../../utility/Color';
import { Row, Container, Column } from '../../components/GridSystem';
import PickerModal from '../../components/PickerModal';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload, setMedicalData } from '../../redux/actions/index';
import ParentRequest from '../../constants/ParentRequest';
import DateHelper from "../../helpers/DateHelper";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height

class AbcDataScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			studentId: '',
			antecedentArray: [],
			behaviourArray: [],
			consequenceArray: [],
			antecedentSelect: [],
			modalShow: false,
			popup: false,
			key: '',
			items: [],
			intensity: 'Select Intensity',
			response: 'Select Response',
			func: 'Select Function',
			frequency: 0,
			antecedent: false,
			behavior: false,
			consequence: false,
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

			showError: "",

			intensityTypeValue: 'Select Intensity',
			responseTypeValue: 'Select Response',
			functionTypeValue: 'Select Function',
			intensityOptions: [
				{ label: 'Severe', value: 'severe' },
				{ label: 'Moderate', value: 'moderate' },
				{ label: 'Mild Function', value: 'mild function' },
			],
			responseOptions: [
				{ label: 'Improve', value: 'improve' },
				{ label: 'No Change', value: 'no change' },
				{ label: 'Escalated', value: 'escalated' },
			],
			functionOptions: [
				{ label: 'Escape', value: 'escape' },
				{ label: 'Attention', value: 'attention' },
				{ label: 'Tangible', value: 'tangible' },
				{ label: 'Sensory', value: 'sensory' },
			],
			responseTypeError: '',
			intensityTypeError: '',
			functionTypeError: ''	
		};
	}

	componentDidMount() {
        //Call this on every page
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        let studentId = store.getState().studentId
        console.log(studentId);
		this.setState({studentId: studentId})
        this.getAbcData(studentId);
    }
	getAbcData(studentId) {
		this.setState({ isLoading: true});
        let variables = {
            studentId: studentId
        };
        console.log("------------------------------" + JSON.stringify(variables))
        ParentRequest.fetchAbcData(variables).then(abcData => {
            console.log("Data: "+JSON.stringify(abcData));
			this.setState({ isLoading: false});
			console.log(1)
			let antecedentArray = abcData.data.getAntecedent.edges.map(el => ({
				id: el.node.id,
				name: el.node.antecedentName,
			}));
			console.log(2)
			let behaviourArray = abcData.data.getBehaviour.edges.map(el => ({
				id: el.node.id,
				name: el.node.behaviorName,
			}));
			console.log(3)
			let consequenceArray = abcData.data.getConsequences.edges.map(el => ({
				id: el.node.id,
				name: el.node.consequenceName,
			}));
			console.log("antecedentArray:"+JSON.stringify(antecedentArray))
			this.setState({
				antecedentArray: antecedentArray,
				behaviourArray: behaviourArray,
				consequenceArray: consequenceArray
			})
            // if(medicalData.data.getMedication.edges.length === 0) {
            //     this.setState({ noDataText :"No data found"}); 
            // }
            // this.setState({medicalItems: medicalData.data.getMedication.edges, isLoading: false}); 
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
		this.setState({isLoading: true})
		let variables = {
			studentId: this.state.studentId,
			name: createItem
		};
		console.log(variables);
		ParentRequest.saveAntacedentItem(variables).then(newData => {
			this.setState({ popup: false })
			this.setState({isLoading: false})
			if(newData) {
				this.getAbcData(store.getState().studentId)
			}
		}).catch(error => {
			this.setState({ popup: false })
            console.log("Error: " + JSON.stringify(error));
            this.setState({ isLoading: false });
        });
	}

	saveBehaviourItem(createItem) {
		this.setState({isLoading: true})
		let variables = {
			studentId: this.state.studentId,
			name: createItem
		};
		ParentRequest.saveBehaviourItem(variables).then(newData => {
			this.setState({ popup: false })
			this.setState({isLoading: false})
			if(newData) {
				this.getAbcData(store.getState().studentId)
			}
		}).catch(error => {
			this.setState({ popup: false })
            console.log("Error: " + JSON.stringify(error));
            this.setState({ isLoading: false });
        });
	}

	saveConsequenceItem(createItem) {
		this.setState({isLoading: true})
		let variables = {
			studentId: this.state.studentId,
			name: createItem
		};
		ParentRequest.saveConsequenceItem(variables).then(newData => {
			this.setState({ popup: false })
			this.setState({isLoading: false})
			if(newData) {
				this.getAbcData(store.getState().studentId)
			}
		}).catch(error => {
			this.setState({ popup: false })
            console.log("Error: " + JSON.stringify(error));
            this.setState({ isLoading: false });
        });
	}
	onCreateItem = () => {
		this.setState({showError: ""});
		let { create, createItem } = this.state;
		if(createItem === "") {
			this.setState({showError: "Cant be empty"});
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

	renderCreateItem(){
		return(
			<Overlay width={300} height={250} style={{ width: '100', height: '100' }} isVisible
				onBackdropPress={() => this.setState({ popup: false })}>
				<View style={{ flex: 1 }}>
					<View style={ styles.createItemTitle }>
						<Text style={{ fontSize: 20, padding: 10 }}>Enter Items Name</Text>
					</View>
					<Text  style={{ textAlign: 'left', color: 'red' }}>{this.state.showError}</Text>
					<TextInput
						style={styles.createItemInput}
						placeholder="item name"
						onChangeText={text => this.setState({ createItem: text })}
					/>
					<Button labelButton='Submit' onPress={this.onCreateItem}/>
				</View>
			</Overlay>
		)
	}
	
	render() {
		let {isLoading, antecedentArray,antecedentSelect, behaviourArray,behaviourSelect, consequenceArray,consequenceSelect, modalShow, popup, key, items, selectedItems, intensity, response,frequency, func,intensityTypeValue, responseTypeValue } = this.state;

		console.log(antecedentArray)
		return(
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<NavigationHeader
					backPress={() => {
						this.props.navigation.goBack();
					}}
					title='ABC Data'
					enable={this.props.disableNavigation != true}
				/>

				<Container enablePadding={this.props.disableNavigation != true}>
					<ScrollView contentInsetAdjustmentBehavior="automatic">
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
										)[0].name
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
										)[0].name
										: 'Consequence'}
								</Text>
								<View style={styles.counterTextRightContainer}>
									<Text style={styles.counterTextRight}>
										{consequenceSelect.length}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
						
						<PickerModal
							label="Intensity"
							placeholder="Select Intensity Type"
							data={this.state.intensityOptions}
							onValueChange={(intensityTypeValue, itemIndex) => {
								this.setState({ intensityTypeValue });
								// if (intensityTypeValue === "") {
								// 	this.setState({ intensityTypeError: "Select Intensity Type" })
								// } else {
								// 	this.setState({ intensityTypeError: "" })
								// }
							}}
						/>
							
						<PickerModal
							label="Response"
							placeholder="Select Response Type"
							data={this.state.responseOptions}
							onValueChange={(responseTypeValue, itemIndex) => {
								this.setState({ responseTypeValue });
								// if (responseTypeValue === "") {
								// 	this.setState({ responseTypeError: "Select Response Type" })
								// } else {
								// 	this.setState({ responseTypeError: "" })
								// }
							}}
						/>
						<PickerModal
							label="Function"
							placeholder="Select Function Type"
							data={this.state.functionOptions}
							onValueChange={(func, itemIndex) => {
								this.setState({ func });
								// if (func === "") {
								// 	this.setState({ functionTypeError: "Select Function Type" })
								// } else {
								// 	this.setState({ functionTypeError: "" })
								// }
							}}
						/>
						<View style={styles.mainContainer}>
							<FontAwesome5 name={'chart-bar'} style={styles.mainIcon} />
							<Text style={styles.mainTextLeft}>Frequency</Text>
							<View style={styles.mainRightView}>
								<TouchableOpacity
									onPress={() =>
										frequency > 0
											? this.setState({ frequency: frequency - 1 })
											: null
									}>
									<FontAwesome5 name={'minus'} style={styles.mainIcon} />
								</TouchableOpacity>
								<Text style={styles.mainTextRight}>{frequency}</Text>
								<TouchableOpacity
									onPress={() => this.setState({ frequency: frequency + 1 })}>
									<FontAwesome5 name={'plus'} style={styles.mainIcon} />
								</TouchableOpacity>
							</View>
						</View>

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
					<Button labelButton='Continue'
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

	handleSubmit = () => {
		console.log('handle submit');
		let {
			intensityTypeValue,
			responseTypeValue,
			frequency,
			behaviourSelect,
			consequenceSelect,
			antecedentSelect,
		} = this.state;

		console.log('intensity', intensityTypeValue);
		console.log('response', responseTypeValue);
		console.log('frequency', frequency);
		console.log('behaviorSelect', behaviourSelect);
		console.log('consequenceSelect', consequenceSelect);
		console.log('antecedentSelect', antecedentSelect);

		let data = {
			studentId: this.state.studentId,
			intensity: intensityTypeValue,
			response: responseTypeValue,
			frequency: frequency,
			behaviors: behaviourSelect,
			consequences: consequenceSelect,
			antecedents: antecedentSelect,
			date: DateHelper.getTodayDate(),
			time: DateHelper.getTimeFromDatetime(new Date())
		};
		console.log(JSON.stringify(data))

		// ParentRequest.saveAbcData(data).then(savedAbcData => {
		// 	if(savedAbcData) {
		// 		Alert.alert("ABC Data", "Successfully added");
		// 	}
		// }).catch(error => {
		// 	this.setState({ popup: false })
        //     console.log("Error: " + JSON.stringify(error));
        //     this.setState({ isLoading: false });
		// 	Alert.alert("error"+error);
        // });
	};



}
const styles = StyleSheet.create({
	
	header: {
		flexDirection: 'row',
		height: 50,
		width: '100%',
	},
	backIcon: {
		fontSize: 50,
		fontWeight: 'normal',
		color: '#fff',
		width: '10%',
		paddingTop: 15,
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
	rightIcon: {
		fontSize: 50,
		fontWeight: 'normal',
		color: '#fff',
		width: '10%',
		paddingTop: 15,
		// marginRight: 10
	},

	//
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
		borderColor: '#fff',
	},

	continueView: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
	},
	continueViewText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	},
	mainContainer: {
		flex: 1,
		flexDirection: 'row',
		padding: 10,
		width: '100%',
		// borderWidth: 1,
		// borderColor:'red'
	},
	mainIcon: {
		width: 40,
		height: 30,
		color: '#45494E',
		marginTop: 10,
	},
	mainTextLeft: {
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: 'normal',
		color: '#45494E',
	},
	pickerStyleIntensity: {
		width: '50%',
		color: '#63686E',
		marginTop: -10,
		marginLeft: 55,
		borderRadius: 4,
		borderWidth: 0.2,
		borderColor: '#ccc'
	},
	pickerStyleResponse: {
		width: 120,
		color: '#63686E',
		marginTop: -10,
		marginLeft: 65,
	},
	pickerStyleFunction: {
		width: 120,
		color: '#63686E',
		marginTop: -10,
		marginLeft: 85,
	},
	mainPickerContiner: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	mainRightView: {
		flexDirection: 'row',
		marginLeft: 90,
	},
	mainTextRight: {
		marginLeft: 10,
		marginRight: 30,
		marginTop: 5,
		color: '#3E7BFA',
		fontSize: 16,
		fontWeight: 'normal',
		fontStyle: 'normal',
	},

	// mera code
	counterContainer: {
		flexDirection: 'row',
		padding: 10,
	},
	counterBtn: {
		borderRadius: 8,
		borderColor: 'blue',
		borderStyle: 'solid',
		borderWidth: 1.25,
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	counterBtnText: {
		color: '#3E7BFA',
		fontSize: 30,
	},
	counterDisplay: {
		borderRadius: 8,
		borderColor: '#D5D5D5',
		borderStyle: 'solid',
		borderWidth: 1.25,
		backgroundColor: '#ffffff',
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginLeft: 15,
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
		backgroundColor: '#D5D5D5',
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
		// padding: 15,
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: '#fcfcfc',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 4
	
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
