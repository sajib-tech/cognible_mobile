import React, { Component } from 'react';

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
} from 'react-native';
import BehaviourTemplateCard from '../../components/BehaviourTemplateCard';
import BehaviourRecordCard from '../../components/BehaviourRecordCard';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { setToken, setTokenPayload } from '../../redux/actions/index';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import ParentRequest from '../../constants/ParentRequest';
import LoadingIndicator from '../../components/LoadingIndicator';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import { getStr } from "../../../locales/Locale";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const KEYS_TO_FILTERS = ['node.behavior.behaviorName'];

class BehaviourDecelTemplateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			studentId: '',
			noDataText: '',
			templateItems: [],
			isFromRecord: false,
			searchText: '',
			childSessionId: ''
		}
	}

	componentDidMount() {
		console.error("props behaviourdecelmandscreen 53", this.props)
		this.getData();
	}

	getData() {
		console.log("BehaviorDecelTemplateScreen  componentDidMount() is called")
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		let { route } = this.props;
		let studentIdFromProps = "";
		if (route && route.params) {
			studentIdFromProps = route.params.studentId;
			if (route.params.isFromRecord) {
				this.setState({ isFromRecord: route.params.isFromRecord })
			}
		} else if (this.props.studentId) {
			studentIdFromProps = this.props.studentId;
		}
		let studentId = studentIdFromProps;
		console.log(studentId);
		let selectedDate = this.state.selectedDate;
		this.setState({ studentId: studentId, childSessionId: route.params.childSessionId });
		this.getTemplateData(studentId);
	}

	getTemplateData(studentId) {
		this.setState({ isLoading: true, templateItems: [] });
		let variables = {
			studentId: studentId
		};
		ParentRequest.fetchTemplatesData(variables).then(templatesData => {
			let templateItems = templatesData.data.getTemplate.edges;
			templateItems = templateItems.reverse();
			console.log("fetchTemplatesData", templateItems);
			this.setState({ templateItems, isLoading: false });
		}).catch(error => {
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });

		});
	}
	addNewTemplate() {
		if (OrientationHelper.getDeviceOrientation() == "portrait") {
			this.props.navigation.navigate('BehaviourNewTemplateScreen', {
				studentId: this.state.studentId,
				parent: this
			});
		} else {
			this.props.setScreenMode("add");
		}
	}
	updateTemplate(templateId, activity) {
		let variables = {
			id: templateId,
			isActive: activity
		}
		console.log('Input variables for update template data ' + JSON.stringify(variables))
		ParentRequest.updateTemplateActiveData(variables).then((updateData) => {
			console.log('output variables for update template data ' + JSON.stringify(updateData))
			let updatedId = updateData.data.updateTemplate.details.id;
			let isActive = updateData.data.updateTemplate.details.isActive;
			let index = this.state.templateItems.findIndex(el => el.node.id == updatedId);
			let upatedTemplates = [...this.state.templateItems]
			upatedTemplates[index].node.isActive = isActive;
			this.setState({ templateItems: upatedTemplates });
		})
	}

	editTemplate(template) {
		//// debugger;
		if (OrientationHelper.getDeviceOrientation() == "portrait") {
			if (!this.props.disableNavigation) {
				this.props.navigation.navigate('BehaviourNewTemplateScreen', {
					studentId: this.state.studentId,
					template,
					parent: this
				});
			}
			else {
				this.props.onEdit(template, this);
			}
		} else {
			this.props.setTemplate(template);
			this.props.setScreenMode("edit-template");
		}
	}
	deleteTemplate(templateId) {
		Alert.alert(
			'Information',
			'Are you sure ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {

						let variables = {
							id: templateId,
						};
						ParentRequest.deleteTemplate(variables).then((result) => {
							this.setState({
								isDeleting: false
							});

							if (OrientationHelper.getDeviceOrientation() == "portrait") {
								let parent = this.props.route.params.parent;
								this.props.navigation.goBack();

								setTimeout(() => {
									if (parent) {
										parent.getData();
									}
								}, 500);
							}
							else {
								let parent = this.props.route.params.parent;
								this.props.navigation.goBack();

								setTimeout(() => {
									if (parent) {
										parent.getData();
									}
								}, 500);

							}
						}).catch((error) => {
						})
					}
				},
			],
			{ cancelable: false }
		);

	}

	getTemplates() {
		let { templateItems, isFromRecord } = this.state;
		const filteredTemplates = templateItems.filter(createFilter(this.state.searchText, KEYS_TO_FILTERS))
		// filteredTemplates.sort();

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
				{filteredTemplates.length == 0 && <NoData>No Template Available</NoData>}
				{filteredTemplates.map((el, index) => {
					return (
						<>
							{OrientationHelper.getDeviceOrientation() == "portrait" &&
								<BehaviourRecordCard
									navigation={this.props.navigation}
									key={el.node.id}
									title={el.node.behavior.behaviorName}
									description={el.node.behaviorDescription}
									statusName={el.node.status.statusName}
									environments={el.node.environment.edges}
									isActive={el.node.isActive ? true : false}
									data={el.node}
									id={el.node.id}
									studentId={this.state.studentId}
									fromSession={this.props.isFromSession}
									onDelete={() => this.deleteTemplate(el.node.id)}
									onDeactivate={() => this.updateTemplate(el.node.id, false)}
									onActivate={() => this.updateTemplate(el.node.id, true)}
									childSessionId={this.state.childSessionId}
									onEdit={() => {
										this.editTemplate(el);
									}}
									onSaved={() => {
										if (!this.props.disableNavigation) {
											this.props.navigation.goBack();
										}
									}}
								/>}
							{OrientationHelper.getDeviceOrientation() == 'landscape' && <BehaviourTemplateCard
								navigation={this.props.navigation}
								key={index}
								title={el.node.behavior.behaviorName}
								description={el.node.behaviorDescription}
								statusName={el.node.status.statusName}
								environments={el.node.environment.edges}
								data={el.node}
								id={el.node.id}
								studentId={this.state.studentId}
								fromSession={this.props.isFromSession}
								onDelete={() => this.deleteTemplate(el.node.id)}
								onDeactivate={() => this.updateTemplate(el.node.id, false)}
								onActivate={() => this.updateTemplate(el.node.id, true)}
								isActive={el.node.isActive ? true : false}
								onEdit={() => {
									if (this.props.isFromSession) {
										this.props.onEdit(el, this)
									} else {
										this.editTemplate(el);
									}

								}}
								onSaved={() => {
									if (OrientationHelper.getDeviceOrientation() == "portrait") {
										this.props.navigation.goBack();
									} else {

									}
								}}
							/>}

						</>
					)
				})}
			</>
		);
	}

	render() {
		let { isLoading, templateItems, noDataText, isFromRecord } = this.state;


		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					enable={this.props.disableNavigation != true}
					backPress={() => this.props.navigation.goBack()}
					title={isFromRecord ? getStr('TargetAllocate.RecordBehaviour') : getStr('TargetAllocate.BehaviorTemplates')}
				/>

				{!isLoading && <Container enablePadding={this.props.disableNavigation != true}>
					<ScrollView contentInsetAdjustmentBehavior="automatic" >
						{this.getTemplates()}
					</ScrollView>

					{!this.props.isFromSession && !isFromRecord && (
						<Button labelButton="Create Template"
							style={{ marginBottom: 10 }}
							onPress={() => this.addNewTemplate()} />
					)}
				</Container>}

				{isLoading && <LoadingIndicator />}
			</SafeAreaView>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
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
	searchInputWrapper: {
		flex: 1,

		marginLeft: 10,
	},
	searchInput: {

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

export default gestureHandlerRootHOC(connect(mapStateToProps, mapDispatchToProps)(BehaviourDecelTemplateScreen));
