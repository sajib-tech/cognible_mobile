/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, { Component, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View, Image, FlatList,
	Text, TextInput, Dimensions,
	StatusBar, TouchableOpacity, Alert
} from 'react-native';
import PreferredItemView from '../../components/PreferredItemView';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { client, refreshToken, getPreferredCategories, preferredItems } from '../../constants/index';
import store from '../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import { getStr } from "../../../locales/Locale";
import ParentRequest from '../../constants/ParentRequest';
import LoadingIndicator from '../../components/LoadingIndicator';
import { upperFirst } from 'lodash'


const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class PreferredItemsScreen extends Component {

	constructor(props) {
		super(props);

		this.params = this.props.route.params;
		console.log("Params", this.params);

		let studentId = store.getState().studentId;
		if (studentId == null || studentId == "") {
			studentId = this.params.student.node.id;
		}

		this.state = {
			isCategoryLoading: false,
			isContentLoading: false,
			categories: [],
			preferredItemsArray: [],
			therapyId: this.params.therapyId,
			studentId,
			selectedTabId: null,
		};
	}

	componentDidMount() {
		this.props.navigation.addListener('focus', () => {
			this.getData();
		});
	}

	getData() {
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

		this.setState({ isCategoryLoading: true });
		let variables = {
			student: this.state.studentId,
		};
		console.log("Vars", variables);
		ParentRequest.getPreferredCategories(variables).then((result) => {
			console.log("getPreferredCategories", result);
			let categories = result.data.preferredItemsCategory.edges;
			this.setState({
				categories,
				isCategoryLoading: false,
				selectedTabId: categories.length != 0 ? categories[0].node.id : null
			}, () => {
				this.getContent();
			});
		}).catch((err) => {
			console.log("Err", err);
			Alert.alert("Information", err.toString());
			this.setState({ isCategoryLoading: false });
		});
	}

	getContent() {
		this.setState({ isContentLoading: true });
		if (this.state.selectedTabId) {
			let variables = {
				studentId: this.state.studentId,
				programAreaId: this.state.therapyId,
				categoryId: this.state.selectedTabId
			};
			console.log("Vars", variables);
			ParentRequest.getPreferredItems(variables).then((result) => {
				console.log("getPreferredItems", result);
				let preferredItemsArray = result.data.preferredItems.edges;
				this.setState({ preferredItemsArray, isContentLoading: false });
			}).catch((err) => {
				console.log("Err", err);
				Alert.alert("Information", err.toString());
				this.setState({ isContentLoading: false });
			});
		}
	}

	render() {
		let { therapyId, categories, preferredItemsArray, selectedTabId, studentId } = this.state;
		console.log("categories>>",categories);
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<NavigationHeader
					backPress={() => {
						this.props.navigation.goBack();
					}}
					title={getStr('Therapy.PreferredItems')}
					enable={this.props.disableNavigation != true}
				/>

				{this.state.isCategoryLoading && <LoadingIndicator />}
				{!this.state.isCategoryLoading && (
					<Container enablePadding={this.props.disableNavigation != true}>
						<View style={{ height: 50, paddingTop: 10 }}>
							<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
								{ categories.length!==0 ?
									categories.map((el, index) => (
										<TouchableOpacity onPress={() => {
											this.setState({ selectedTabId: el.node.id }, () => {
												this.getContent();
											})
										}} key={index}>
											<Text style={[styles.tabView, (selectedTabId === el.node.id) ? styles.selectedTabView : ""]}>{upperFirst(el.node.name)}</Text>
										</TouchableOpacity>
									))
									:
									<View style={{ height: 500, justifyContent: 'center' }}>
										<NoData>No Item Available</NoData>
									</View>
								}
							</ScrollView>
						</View>
						{this.state.isContentLoading && <LoadingIndicator />}
						{!this.state.isContentLoading && (
							<ScrollView>
								{preferredItemsArray.length == 0 && (
									<View style={{ height: 500, justifyContent: 'center' }}>
										<NoData>No Item Available</NoData>
									</View>
								)}
								{preferredItemsArray && preferredItemsArray.map((elItem, itemIndex) => {
									return <PreferredItemView
										key={itemIndex}
										title={elItem.node.itemName}
										description={elItem.node?.description === null ? '' : elItem.node.description}
										itemId={elItem.node.id}
										getData={()=>this.getContent()}
										onPress={() => {
											this.props.navigation.navigate("PreferredItemNew", {
												categoryOptions: categories,
												programAreaId: therapyId,
												studentId: studentId,
												item: elItem
											})
										}} />
									})}
							</ScrollView>
						)}
						{
							(
								<Button labelButton={getStr('Therapy.NewItem')}
									style={{ marginBottom: 10 }}
									onPress={() => {
										this.props.navigation.navigate("PreferredItemNew", {
											categoryOptions: categories,
											programAreaId: therapyId,
											getData:this.getContent,
											studentId: studentId
										})
									}}
								/>
							)
						}
					</Container>
				)}
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
		paddingLeft: 15
	},
	backIconText: {
		fontSize: 20,
		fontWeight: 'normal',
		color: '#63686E',

	},
	headerTitle: {
		textAlign: 'center',
		width: '85%',
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
		paddingRight: 15
	},
	scrollView: {
		height: screenHeight - 100,

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
		position: 'absolute',
		bottom: 20
	},
	continueViewText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	},

	tabView: {
		padding: 5,
		marginLeft: 15,
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '500',
		fontSize: 16,
		color: 'rgba(95, 95, 95, 0.75)'
	},
	selectedTabView: {
		color: '#3E7BFA',
		borderBottomWidth: 2,
		borderBottomColor: '#3E7BFA',
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

export default connect(mapStateToProps, mapDispatchToProps)(PreferredItemsScreen);
