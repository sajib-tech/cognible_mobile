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
	View,
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
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';

const AbcDataScreen = props => {
	const [studentId, setStudentId] = useState(store.getState().studentId);
	const [update, setUpdate] = useState(1);
	const { loading, error, data, refetch } = useQuery(getAbcData, {
		client,
		variables: { studentId: studentId },
		fetchPolicy: 'no-cache',
	});
	const [
		recordAbcdata,
		{ loading: mutationLoading, error: mutationError, data: mutationData },
	] = useMutation(newAbcdata, { client, variables: { studentId: studentId } });
	const [
		addBehavior,
		{ loading: behaviorLoading, error: behaviorError, data: behaviorData },
	] = useMutation(createBehaviour, {
		client,
		variables: { studentId: studentId },
		refetchQueries: [{ query: getAbcData, variables: { studentId: studentId } }],
	});
	const [
		addConsequence,
		{
			loading: consequenceLoading,
			error: consequenceError,
			data: consequenceData,
		},
	] = useMutation(createConsequence, {
		client,
		variables: {
			studentId: studentId
		},
		refetchQueries: [{ query: getAbcData, variables: { studentId: studentId } }],
	});
	const [
		addAntecedent,
		{ loading: antecedentLoading, error: antecedentError, data: antecedentData },
	] = useMutation(createAntecedent, {
		client,
		variables: {
			studentId: studentId
		},
		refetchQueries: [{ query: getAbcData, variables: { studentId: studentId } }],
	});
	console.log('state updatedtoday', update);
	if (
		loading ||
		mutationLoading ||
		behaviorLoading ||
		consequenceLoading ||
		antecedentLoading
	) {
		return (
			<Overlay isVisible fullScreen>
				<ActivityIndicator size="large" color="blue" />
			</Overlay>
		);
	} else if (
		error ||
		mutationError ||
		behaviorError ||
		antecedentError ||
		consequenceError
	) {
		return <Text>Error</Text>;
	} else {
		console.log('data count', data.getAntecedent.edges.length);
		return (
			<AbcDataScreenP
				{...props}
				data={data}
				mutationData={mutationData}
				recordAbcdata={recordAbcdata}
				behaviorData={behaviorData}
				consequenceData={consequenceData}
				antecedentData={antecedentData}
				addBehavior={addBehavior}
				addConsequence={addConsequence}
				addAntecedent={addAntecedent}
				setUpdate={setUpdate}
				refetch={refetch}
			/>
		);
	}
};

class AbcDataScreenP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			intensity: 'Select Intensity',
			response: 'Select Response',
			func: 'Select Function',
			frequency: 0,
			antecedent: false,
			behavior: false,
			consequence: false,
			items: [],
			behaviourSelect: [],
			consequenceSelect: [],
			antecedentSelect: [],
			key: '',
			selectedItems: [],
			modalShow: false,
			isVisible: true,
			popup: false,
			create: '',
			createItem: '',
			behaviorCreate: '',
			antecedentCreate: '',
			consequenceCreate: '',
		};
	}

	items = [
		{
			id: '92iijs7yta',
			name: 'Ondo',
		},
		{
			id: 'a0s0a8ssbsd',
			name: 'Ogun',
		},
		{
			id: '16hbajsabsd',
			name: 'Calabar',
		},
		{
			id: 'nahs75a5sg',
			name: 'Lagos',
		},
		{
			id: '667atsas',
			name: 'Maiduguri',
		},
		{
			id: 'hsyasajs',
			name: 'Anambra',
		},
		{
			id: 'djsjudksjd',
			name: 'Benue',
		},
		{
			id: 'sdhyaysdj',
			name: 'Kaduna',
		},
		{
			id: 'suudydjsjd',
			name: 'Abuja',
		},
	];


	modalHide = () => this.setState({ modalShow: false });
	modalShow = (items, selectedItems, key) =>
		this.setState({ modalShow: true, items, selectedItems, key });
	selectItems = (items, selector) => {
		console.log('selected items', selector);
		this.setState({ [selector]: items, modalShow: false, selectedItems: [] });
	};
	handleSubmit = () => {
		console.log('handle submit');
		let {
			intensity,
			response,
			frequency,
			behaviourSelect,
			consequenceSelect,
			antecedentSelect,
		} = this.state;

		console.log('intensity', intensity);
		console.log('response', response);
		console.log('frequency', frequency);
		console.log('behaviourSelect', behaviourSelect);
		console.log('consequenceSelect', consequenceSelect);
		console.log('antecedentSelect', antecedentSelect);

		let { recordAbcdata } = this.props;
		let data = {
			intensity: intensity,
			response: response,
			frequency: frequency,
			behaviors: behaviourSelect,
			consequences: consequenceSelect,
			antecedents: antecedentSelect,
		};
		console.log(JSON.stringify(data))
		recordAbcdata({
			variables: data,
		});
	};
	onCreateItem = () => {
		let { create, createItem } = this.state;
		console.log('onCreateItem', create, createItem);
		switch (create) {
			case 'behaviorCreate': {
				this.props.addBehavior({ variables: { name: createItem } });
				this.props.setUpdate(5);
				break;
			}
			case 'antecedentCreate': {
				console.log('antecedent');
				this.props.addAntecedent({ variables: { name: createItem } });
				this.props.refetch();
				this.props.setUpdate(6);
				break;
			}
			case 'consequenceCreate': {
				this.props.addConsequence({ variables: { name: createItem } });
				this.props.refetch();
				this.props.setUpdate(7);
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
		console.log('mutationData', this.props.mutationData);
		if (this.props.mutationData) {
			Alert.alert('Data Updated successfully');
			this.props.navigation.goBack();
		}

		const {
			intensity,
			response,
			func,
			frequency,
			selectedItems,
			antecedent,
			behaviour,
			consequence,
			modalShow,
			items,
			key,
			antecedentSelect,
			behaviourSelect,
			consequenceSelect,
			popup,
			create,
			createItem,
			behaviorCreate,
		} = this.state;
		let { data, antecedentData } = this.props;
		let antecedentArray = data.getAntecedent.edges.map(el => ({
			id: el.node.id,
			name: el.node.antecedentName,
		}));
		let behaviourArray = data.getBehaviour.edges.map(el => ({
			id: el.node.id,
			name: el.node.behaviorName,
		}));
		let consequenceArray = data.getConsequences.edges.map(el => ({
			id: el.node.id,
			name: el.node.consequenceName,
		}));
		console.log('antecedent create', antecedentData);

		return (
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
										: 'Behaviour'}
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
						<View style={styles.mainContainer}>
							<FontAwesome5 name={'chart-bar'} style={styles.mainIcon} />
							<Text style={styles.mainTextLeft}>Intensity</Text>
							<Picker
								style={styles.pickerStyleIntensity}
								selectedValue={intensity}
								onValueChange={itemValue =>
									this.setState({ intensity: itemValue })
								}>
								<Picker.Item label="Severe" value="severe" />
								<Picker.Item label="Moderate" value="moderate" />
								<Picker.Item label="Mild Function" value="mild function" />
							</Picker>
						</View>
						<View style={styles.mainContainer}>
							<FontAwesome5 name={'user'} style={styles.mainIcon} />
							<Text style={styles.mainTextLeft}>Response</Text>
							<Picker
								style={styles.pickerStyleResponse}
								selectedValue={response}
								onValueChange={itemValue =>
									this.setState({ response: itemValue })
								}>
								<Picker.Item label="Improve" value="improve" />
								<Picker.Item label="No Change" value="no change" />
								<Picker.Item label="Escalated" value="escalated" />
							</Picker>
						</View>
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
						<View style={styles.mainContainer}>
							<FontAwesome5 name={'wrench'} style={styles.mainIcon} />
							<Text style={styles.mainTextLeft}>Function</Text>
							<Picker
								style={styles.pickerStyleFunction}
								selectedValue={func}
								onValueChange={itemValue => this.setState({ func: itemValue })}>
								<Picker.Item label="Escape" value="escape" />
								<Picker.Item label="Attention" value="attention" />
								<Picker.Item label="Tangible" value="tangible" />
								<Picker.Item label="Sensory" value="sensory" />
							</Picker>
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

						{/*<Text>
                            <FontAwesome5 name={'chart-bar'} style={styles.backIconText} />
                            <Text h1>Intensity  </Text>
                        </Text>
                        <Text>
                            <FontAwesome5 name={'user'} style={styles.backIconText} />
                            <Text h1>Response</Text>
                        </Text>
                        <Text>
                            <FontAwesome5 name={'chart-bar'} style={styles.backIconText} />
                            <Text>Frequency</Text>
                        </Text>
                        <Text>
                            <FontAwesome5 name={'wrench'} style={styles.backIconText} />
                            <Text>Function</Text>
                        </Text>
                        */}
					</ScrollView>
					<Button labelButton='Continue'
						style={{ marginBottom: 10 }}
						onPress={() => {
							this.handleSubmit();
						}}
					/>
				</Container>
			</SafeAreaView>
		);
	}
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
		padding: 20,
		width: '100%',
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
		width: 120,
		color: '#63686E',
		marginTop: -10,
		marginLeft: 55,
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
		padding: 15,
		marginTop: 30,
		marginBottom: 20,
		backgroundColor: '#fcfcfc',
	}
});
export default AbcDataScreen;
