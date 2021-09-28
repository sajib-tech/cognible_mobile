/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View, ActivityIndicator,
	Text, Dimensions,
	StatusBar, TouchableOpacity, RefreshControl
} from 'react-native';

import { client, verifyToken, refreshToken, getTherapyProgramsQuery } from '../../constants/index';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TherapyListItem from '../../components/TherapyListItem';
import store from '../../redux/store';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import ParentRequest from '../../constants/ParentRequest';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import TherapyRoadMap from './TherapyRoadMap';
import { getStr } from "../../../locales/Locale";
import LoadingIndicator from '../../components/LoadingIndicator';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class TherapyProgramScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			noTherapyText: "",
			therapyPrograms: [],

			tabView: 'roadmap',
			tabViewTherapyId: null,
		}
		//console.log("props=", props);
		this.navigateToRoadMap = this.navigateToRoadMap.bind(this);

	}
	_refresh() {
		this.setState({ isLoading: false, noTherapyText: "" });
		this.componentDidMount();
	}

	componentDidMount() {
		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		this.getTherapyPrograms();
	}
	getTherapyPrograms() {
		// console.log("getTherapyPrograms() is called");
		this.setState({ isLoading: true });
		let variables = {
			studentId: store.getState().studentId
		};

		console.log("----------getTherapyPrograms--------------------" + JSON.stringify(variables))
		ParentRequest.fetchTherapyProgramsData(variables).then(programsData => {
			// console.log("programsData: "+JSON.stringify(programsData));
			this.setState({ isLoading: false });
			if (programsData.data.student && programsData.data.student.programArea && programsData.data.student.programArea.edges.length === 0) {
				this.setState({ noTherapyText: "No Therapy items found" });
			}
			if (programsData.data.student && programsData.data.student.programArea && programsData.data.student.programArea.edges) {
				console.log(programsData.data.student.programArea.edges.length)
				this.setState({ therapyPrograms: programsData.data.student.programArea.edges });
			}
		}).catch(error => {
			console.log("Error: " + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}
	getTherapyListData() {
		let data = [
			{ title: "ABA Therapy", descr: 'Describe behavior & language therapy in a couple of lines.' },
			{ title: "Special Education", descr: 'Describe behavior & language therapy in a couple of lines.' },
			{ title: "Occupational Therapy", descr: 'Describe behavior & language therapy in a couple of lines.' },
			{ title: "Physiotherapy", descr: 'Describe behavior & language therapy in a couple of lines.' },
			{ title: "Speech & Language", descr: 'Describe behavior & language therapy in a couple of lines.' }
		];
		return data;
	}

	navigateToRoadMap(id) {
		console.log("navigateToRoadMap() is called: " + id);
		if (OrientationHelper.getDeviceOrientation() == 'portrait') {
			let { navigation } = this.props;
			navigation.navigate('TherapyRoadMap', { therapyId: id, tabViewTherapyId: id, program: this.state.therapyPrograms });
		} else {
			this.setState({ tabViewTherapyId: id })
		}
	}

	renderList() {
		return (
			<>
				<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isLoading}
							onRefresh={this._refresh.bind(this)}
						/>
					}>
					{this.state.isLoading && (
						<View style={{ height: 300 }}>
							<LoadingIndicator />
						</View>
					)}

					{!this.state.isLoading && (
						<>
							{this.state.therapyPrograms.length == 0 && (
								<NoData>No Therapy Program Found.</NoData>
							)}
							{this.state.therapyPrograms.map((element, index) => (
								<TherapyListItem key={index}
									id={element.node.id}
									selected={element.node.id == this.state.tabViewTherapyId ? true : false}
									title={element.node.name}
									description={element.node.description}
									callBack={this.navigateToRoadMap} />
							))}
						</>
					)}
				</ScrollView>
			</>
		);
	}

	render() {
		let { isLoading } = this.state;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<Container>
					<View style={{ paddingTop: 30, paddingBottom: 10 }}>
						<Text style={styles.title}> {getStr('NewUpdated.Therapy')}</Text>
					</View>
					{OrientationHelper.getDeviceOrientation() == 'portrait' && this.renderList()}
					{OrientationHelper.getDeviceOrientation() == 'landscape' && (
						<Row style={{ flex: 1 }}>
							<Column>
								{this.renderList()}
							</Column>
							<Column style={{ flex: 2 }}>
								{this.state.tabViewTherapyId && (
									<TherapyRoadMap disableNavigation
										route={{ params: { therapyId: this.state.tabViewTherapyId } }}
										navigation={this.props.navigation} />
								)}
							</Column>
						</Row>
					)}
				</Container>
			</SafeAreaView>
		);
	}

};

const styles = StyleSheet.create({
	title: {
		fontSize: 28, fontWeight: 'bold'
	},
	header: {
		flexDirection: 'row',
		height: 50,
		width: '100%'
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
		paddingTop: 15
	}
});

const mapStateToProps = (state) => ({
	authResult: getAuthResult(state),
	authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(TherapyProgramScreen);
