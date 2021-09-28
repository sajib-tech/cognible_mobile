/* eslint-disable react-native/no-inline-styles */
import React, { Component, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//graphql
import { useQuery } from '@apollo/react-hooks';
import { ApolloProvider, Mutation } from 'react-apollo';
import { Overlay, Input } from 'react-native-elements';
import Textarea from 'react-native-textarea';
import {
	client,
	getNewTemplateFields,
	createNewTemplate,
	getTemplateData,
	getBehaviourData,
	createBehaviour,
} from '../../constants';

import {
	Text,
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
	Alert,
	TextInput,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import store from '../../redux/store';

import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import PickerModal from '../../components/PickerModal';
import Button from '../../components/Button';
import Color from '../../utility/Color';

const BehaviourNewTemplateScreen = props => {
	console.log("-------" + JSON.stringify(props))
	const [studentId, setStudentId] = useState(props.route.params.studentId);
	const [state, updateState] = useState(0);
	console.log('state updated', state);
	const { loading, error, data, refetch } = useQuery(getNewTemplateFields, { client, variables: { studentId: studentId } });
	console.log('Inside Behaviour New Template Screen..');
	console.log('data', data);
	if (loading) {
		return (
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
		);
	} else if (error) {
		return (
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
		);
	}
	return (
		<BehaviourNewTemplateScreenP
			{...props}
			data={data}
			stateData={state}
			updateState={updateState}
			refetch={refetch}
			studentId={studentId}
		/>
	);
};

class BehaviourNewTemplateScreenP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSaving: false,
			behaviourName: '',
			behaviourDef: '',
			statusValue: '',
			behaviourDes: '',
			environmentValue: [],
			measurementValue: [],
			behaviourArray: props.data && props.data.getBehaviour.edges,
			isAddEnvTripState: 0,
			isMesurementEnvTripState: 0,
			behaviorModal: false,
			createItem: '',
		};

		this._handleChange = this._handleChange.bind(this);
		this._handleEnvironment = this._handleEnvironment.bind(this);
		this._handleMeasurement = this._handleMeasurement.bind(this);
		this.addEnvDropDown = this.addEnvDropDown.bind(this);
		this.addMeasurementDropDown = this.addMeasurementDropDown.bind(this);
	}

	addEnvDropDown = () => {
		let temp = 1;
		let value = this.state.isAddEnvTripState;
		let result = temp + value;

		this.setState({
			isAddEnvTripState: result,
		});
	};

	addMeasurementDropDown = () => {
		let temp = 1;
		let value = this.state.isMesurementEnvTripState;
		let result = temp + value;

		this.setState({
			isMesurementEnvTripState: result,
		});
	};

	_handleChange = behaviourID => {
		var def;
		let tempArray = this.state.behaviourArray;

		for (var i = 0; i < tempArray.length; i++) {
			if (tempArray[i].node.id === behaviourID) {
				def = tempArray[i].node.definition;
			}
		}

		this.setState({
			behaviourName: behaviourID,
			behaviourDef: def,
		});
	};

	_handleEnvironment = id => {
		let tempArray = this.state.environmentValue;
		let temp = 0;

		if (tempArray.length == 0) {
			tempArray.push(id);
		} else {
			for (var i = 0; i < tempArray.length; i++) {
				if (tempArray[i] == id) {
					temp = temp + 1;
				}
			}

			if (temp == 0) {
				tempArray.push(id);
			}
		}

		this.setState({
			environmentValue: tempArray,
		});
	};

	_handleMeasurement = id => {
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!Handle measurements!!!!!!!!!!!!!")
		let tempArray = this.state.measurementValue;
		let temp = 0;

		if (tempArray.length == 0) {
			tempArray.push(id);
		} else {
			for (var i = 0; i < tempArray.length; i++) {
				if (tempArray[i] == id) {
					temp = temp + 1;
				}
			}

			if (temp == 0) {
				tempArray.push(id);
			}
		}

		console.log('selected measurements--->' + tempArray);
		this.setState({
			measurementValue: tempArray,
		});
	};

	saveTemplate(createTemplate, data) {
		this.setState({ isSaving: true });
		let queryParams = {
			studentId: this.props.studentId,
			behaviorId: this.state.behaviourName,
			statusId: this.state.statusValue,
			behaviordef: this.state.behaviourDef,
			behaviordes: this.state.behaviourDes,
			measurements: this.state.measurementValue,
			environments: this.state.environmentValue,
		};
		console.log('Query PArams');
		console.log(queryParams);
		createTemplate({ variables: queryParams })
			.then(response => {
				return response.data;
			})
			.then(data => {
				this.setState({ isSaving: false });
				Alert.alert('Information', 'New Template Successfully Updated.');

				if (OrientationHelper.getDeviceOrientation() == "portrait") {
					this.props.navigation.navigate('BehaviourDecelTemplateScreen', { newData: true });
				} else {
					this.props.setScreenMode("list");
				}
			})
			.catch(err => {
				this.setState({ isSaving: false });
				console.log(
					'CreateTemplate -> err',
					JSON.stringify(err),
				);
			});
	}

	render() {
		//console.log("Inside BehaviourDecelTemplateScreenP");
		let { data } = this.props;

		//console.log(data);

		var behaviourName = [];
		var behaviorData = [];
		var statusData = [];
		var environmentData = [];
		var measurementData = [];

		for (var i = 0; i < data.getBehaviour.edges.length; i++) {
			behaviourName.push(data.getBehaviour.edges[i].node);
		}

		for (i = 0; i < behaviourName.length; i++) {
			behaviorData.push({
				value: behaviourName[i].behaviorName,
				data: behaviourName[i].id,
			});
		}

		for (i = 0; i < data.getDecelStatus.length; i++) {
			statusData.push({
				value: data.getDecelStatus[i].statusName,
				data: data.getDecelStatus[i].id,
			});
		}

		for (i = 0; i < data.getEnvironment.length; i++) {
			environmentData.push({
				value: data.getEnvironment[i].name,
				data: data.getEnvironment[i].id,
			});
		}

		for (i = 0; i < data.getBehaviourMeasurings.length; i++) {
			measurementData.push({
				value: data.getBehaviourMeasurings[i].measuringType,
				data: data.getBehaviourMeasurings[i].id,
			});
		}

		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					enable={this.props.disableNavigation != true}
					backPress={() => this.props.navigation.goBack()}
					title={"New Behaviour Template"}
					disabledTitle
				/>

				<Container enablePadding={this.props.disableNavigation != true}>
					<KeyboardAwareScrollView>
						<PickerModal
							label="Select Behaviour Name"
							placeholder='Select Behaviour Name'
							selectedValue={this.state.behaviourName}
							data={behaviorData}
							idKey='data'
							labelKey='value'
							type='dropdown'
							onValueChange={(value, itemIndex) => {
								this._handleChange(value);
							}}
							onAdded={() => {
								this.setState({ behaviorModal: true })
							}}
						/>

						<PickerModal
							label="Status"
							selectedValue={this.state.statusValue}
							placeholder='Select Status'
							data={statusData}
							idKey='data'
							labelKey='value'
							type='dropdown'
							onValueChange={(statusValue, itemIndex) => {
								this.setState({ statusValue })
							}}
							onAdded={() => {
								this.setState({ behaviorModal: true })
							}}
						/>

						<Text style={styles.labelStyle}>Behaviour Description</Text>
						<Textarea
							containerStyle={styles.textareaContainer}
							style={styles.textarea}
							onChangeText={behaviourDes => this.setState({ behaviourDes })}
							defaultValue={this.state.behaviourDes}
							maxLength={120}
							placeholder={'Describe the behaviour'}
							placeholderTextColor={'#c7c7c7'}
							underlineColorAndroid={'transparent'}
						/>

						<PickerModal
							label="Environments"
							selectedValue={this.state.statusValue}
							placeholder='Select Environment'
							data={environmentData}
							idKey='data'
							labelKey='value'
							type='dropdown'
							onValueChange={(envVal, itemIndex) => {
								this._handleEnvironment(envVal)
							}}
							onAdded={() => {
								this.addEnvDropDown()
							}}
						/>

						{Array.from(Array(this.state.isAddEnvTripState)).map((el, index) => (
							<PickerModal
								key={index}
								data={environmentData}
								placeholder='Select Environment'
								idKey='data'
								labelKey='value'
								type='dropdown'
								onValueChange={(envVal, itemIndex) => {
									this._handleEnvironment(envVal)
								}}
							/>
						))}


						<PickerModal
							label="Measurements"
							placeholder='Select Measurement'
							data={measurementData}
							idKey='data'
							labelKey='value'
							type='dropdown'
							onValueChange={(measVal, itemIndex) => {
								this._handleMeasurement(measVal)
							}}
							onAdded={() => {
								this.addMeasurementDropDown()
							}}
						/>

						{Array.from(Array(this.state.isMesurementEnvTripState)).map((el, index) => (
							<PickerModal
								placeholder='Select Measurement'
								key={'m' + index}
								data={measurementData}
								idKey='data'
								labelKey='value'
								type='dropdown'
								onValueChange={(envVal, itemIndex) => {
									this._handleMeasurement(envVal)
								}}
							/>
						))}

						<View style={{ paddingTop: 10 }} />

						{this.state.behaviorModal && (
							<ApolloProvider client={client}>
								<Mutation
									mutation={createBehaviour}
									refetchQueries={[{
										query: getNewTemplateFields, variables: {
											student: this.props.studentId
										}
									}]}>
									{createBehaviourData => (
										<Overlay
											width={300}
											height={250}
											style={{ width: '100', height: '100' }}
											isVisible
											onBackdropPress={() =>
												this.setState({ behaviorModal: false })
											}>
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
												<TextInput
													style={{
														padding: 15,
														marginTop: 30,
														marginBottom: 20,
														backgroundColor: '#fcfcfc',
													}}
													placeholder="item name"
													onChangeText={text => this.setState({ createItem: text })}
												/>
												<Button labelButton="Submit"
													onPress={() => {
														let name = this.state.createItem;
														createBehaviourData({
															variables: {
																name,
																studentId: this.props.studentId
															},
														});
														this.props.refetch();
														this.props.updateState(this.props.stateData + 1);
														this.setState({ behaviorModal: false });
													}}
												/>
											</View>
										</Overlay>
									)}
								</Mutation>
							</ApolloProvider>
						)}
						<ApolloProvider client={client}>
							<Mutation mutation={createNewTemplate}
								refetchQueries={() => {
									console.log("refetchQueries of behaviour templates")
									return [{
										query: getTemplateData,
										variables: {
											studentId: this.props.studentId
										}
									}];
								}}>
								{(createTemplate, { data }) => (
									<Button labelButton="Save Template"
										isLoading={this.state.isSaving}
										onPress={() => {
											this.saveTemplate(createTemplate, data);
										}}
									/>
								)}
							</Mutation>
						</ApolloProvider>
					</KeyboardAwareScrollView>
				</Container>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	input: {
		width: 200,
		borderBottomColor: 'red',
		borderBottomWidth: 1,
	},
	labelStyle: {
		color: Color.grayFill,
		fontSize: 14,
	},
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
		paddingVertical: 5,
		paddingHorizontal: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
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
	textareaContainer: {
		height: 100,
		padding: 5,
		backgroundColor: '#fff',
		borderRadius: 5,
		marginVertical: 10,
		borderColor: Color.gray,
		borderWidth: 1,
	},
	textarea: {
		textAlignVertical: 'top',
		height: 90,
		fontSize: 14,
		color: '#333',
	},
});

export default BehaviourNewTemplateScreen;
