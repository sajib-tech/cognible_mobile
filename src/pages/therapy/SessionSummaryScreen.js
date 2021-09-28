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
	View, Image, FlatList,
	Text, TextInput, Dimensions,
	StatusBar, TouchableOpacity, processColor
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { client, getSessionSummary, getTodaySessionsSummary, getWeekSessionsSummary, getSessionSummaryByStudent } from '../../constants/index';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import Color from '../../utility/Color';
import NavigationHeader from '../../components/NavigationHeader';
import { Container, Column, Row } from '../../components/GridSystem';
import Button from '../../components/Button';
import OrientationHelper from '../../helpers/OrientationHelper';
import SessionFeedbackScreen from './SessionFeedbackScreen';
import { BarChart } from "react-native-charts-wrapper";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class SessionSummaryScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fromPage: "",
			childSeesionId: '',
			sessionId: '',
			totalTarget: 0,
			correctCount: 0,
			incorrectCount: 0,
			promptCount: 0,
			noCount: 0,
			mandCount: 0,
			behaviourCount: 0,
			summaryTabs: [{ name: "Morning Session" }, { name: "This Week" }],
			currentTabIndex: 0,
			studentId: '',

			currentSessionData: {
				totalTrials: 0,
				totalTarget: 0,
				correctCount: 0,
				incorrectCount: 0,
				promptCount: 0,
				noCount: 0,
				mandCount: 0,
				behaviourCount: 0,
			},
			todaySessionData: {
				totalTrials: 0,
				totalTarget: 0,
				correctCount: 0,
				incorrectCount: 0,
				promptCount: 0,
				noCount: 0,
				mandCount: 0,
				behaviourCount: 0,
			},
			thisWeekSessionData: {
				totalTrials: 0,
				totalTarget: 0,
				correctCount: 0,
				incorrectCount: 0,
				promptCount: 0,
				noCount: 0,
				mandCount: 0,
				behaviourCount: 0,
			},
		};
		this.getPlaceholderForGraph = this.getPlaceholderForGraph.bind(this);
		this.renderBox = this.renderBox.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
	}

	selectTab(index) {
		this.setState({ currentTabIndex: index });
		if (index === 0) {
			this.fetchCurrentSessionSummary();
		} else if (index === 1) {
			this.fetchThisWeekSessionsSummary();
		}
	}

	getPlaceholderForGraph() {
		return (
			<View style={styles.placeHolderView}>
				<Text style={{
					fontFamily: 'SF Pro Text', fontStyle: 'normal', fontWeight: '600',
					fontSize: 19, color: '#cccccc'
				}}>PLACEHOLDER FOR GRAPH</Text>
			</View>
		)
	}

	renderBox(type, number, text, showPercentage) {
		let colorStyle = "";
		if (type == "Correct") {
			colorStyle = eval("styles.correct");
		} else if (type == "Incorrect") {
			colorStyle = eval("styles.incorrect");
		} else if (type == "No") {
			colorStyle = eval("styles.no");
		} else if (type == "Prompted") {
			colorStyle = eval("styles.prompted");
		} else if (type == "Mand") {
			colorStyle = eval("styles.mand");
		} else if (type == "Behaviours") {
			colorStyle = eval("styles.behaviours");
		}
		return (
			<View style={styles.boxView}>
				<Text style={[styles.numberText, colorStyle]}>{number}</Text>
				<View style={{ paddingLeft: 10, paddingTop: 5, width: '70%' }}>
					<Text style={{ fontFamily: 'SF Pro Text', fontStyle: 'normal', fontWeight: '500', fontSize: 16 }}>{type}</Text>
					<Text>{text}</Text>
				</View>
				{showPercentage && (<Text style={{ color: '#4BAEA0', paddingTop: 10, paddingLeft: 10, width: '20%', height: 35, backgroundColor: 'rgba(75, 174, 160, 0.1)' }}>+ 16%</Text>)}
			</View>
		)
	}

	componentDidMount() {
		let { route } = this.props;
		let sessId = route.params.sessionId;
		let childSeesionId = route.params.childSeesionId;
		console.log('Mahesh Session ID featch:' + route.params.childSeesionId)
		let pageTitle = route.params.pageTitle;
		let tabs = this.state.summaryTabs;
		tabs[0].name = pageTitle;

		this.setState({
			summaryTabs: tabs, 
			fromPage: route.params.fromPage,
			sessionId: sessId,
			childSeesionId: childSeesionId,
			pageTitle: pageTitle,
			studentId: route.params.studentId
		});

		TokenRefresher.refreshTokenIfNeeded(this.props.dispatchSetToken, this.props.dispatchSetTokenPayload)
			.then(() => {
				this.fetchCurrentSessionSummary(childSeesionId);
				this.fetchThisWeekSessionsSummary();
				this.fetchTodaySessionsSummary();
			}).catch((error) => {
				console.log("TokenRefresher Error: " + JSON.stringify(error));
				this.setState({ isLoading: false });
			});
	}

	processSessionInfo(data) {
		let totalTargets = data.summary.totalTarget;
		let edges = data.summary.edges;
		let edgesLength = edges.length;
		let trials = 0, correct = 0, incorrect = 0, prompt = 0, noCount = 0;

		for (let i = 0; i < edgesLength; i++) {
			let edge = edges[i];
			trials = trials + edge.node.sessionRecord.totalTrial;
			correct = correct + edge.node.sessionRecord.totalCorrect + (edge.node.peak ?.totalCorrect ? edge.node.peak.totalCorrect : 0);
			incorrect = incorrect + edge.node.sessionRecord.totalIncorrect + (edge.node.peak ?.totalError ? edge.node.peak.totalError : 0);
			prompt = prompt + edge.node.sessionRecord.totalPrompt + (edge.node.peak ?.totalPrompt ? edge.node.peak.totalPrompt : 0);
			noCount = noCount + edge.node.sessionRecord.totalNr ;
		}

		let sessionData = {
			totalTrials: trials,
			totalTarget: totalTargets,
			correctCount: correct,
			incorrectCount: incorrect,
			promptCount: prompt,
			noCount: isNaN(noCount) ? 0 : noCount,
			mandCount: isNaN(data.summary.mandCount) ? 0 : data.summary.mandCount,
			behaviourCount: isNaN(data.summary.behCount) ? 0 : data.summary.behCount,
		};
		return sessionData;
	}

	processWeeklyInfo(data) {
		let totalTargets = 0;
		let trials = 0, correct = 0, incorrect = 0, prompt = 0, noCount = 0;
		let summary = data.sessionSummary;
		summary.forEach((item) => {
			correct = correct + item.correctCount + item.peakCorrect,
				incorrect = incorrect + item.errorCount + item.peakError,
				prompt = prompt + item.promptCount + item.peakPrompt
			console.log("correct --->" + correct);
		})
		let sessionData = {
			totalTrials: trials,
			totalTarget: totalTargets,
			correctCount: correct,
			incorrectCount: incorrect,
			promptCount: prompt,
			noCount: isNaN(noCount) ? 0 : noCount,
			mandCount: 0,
			behaviourCount: 0,
		};
		console.log("In sessionData length -->" + JSON.stringify(sessionData))
		return sessionData;
	}

	fetchTodaySessionsSummary() {
		let { route } = this.props;
		client.query({
			query: getTodaySessionsSummary,
			variables: {
				ChildSession: route.params.childSeesionId,
				date: DateHelper.getTodayDate(),
			}
		})
			.then(result => {
				return result.data;
			}
			).then(data => {

				console.log("today session summary 231-*--*----*-*-*-*-*-*-*", data)
				if (data.summary) {
					let todaySessionData = this.processSessionInfo(data);
					// this.setState({ todaySessionData: todaySessionData });
				}
			}).catch(err => {
				console.log("========" + JSON.stringify(this.err));
			});
	}

	fetchThisWeekSessionsSummary() {
		console.log('This week summary xyz student id --->' + this.state.studentId)
		let { route } = this.props;
		let date = new Date();
		let weekStartDate = new Date(date.getTime() - (6 * 24 * 60 * 60 * 1000));
		let fromDate = DateHelper.getDateFromDatetime(weekStartDate);
		let params = {
			studentId: this.state.studentId,
			startDate: fromDate,
			endDate: DateHelper.getTodayDate(),
		}

		client.query({
			query: getSessionSummaryByStudent,
			variables: params
		})
			.then(result => {
				console.log("week getSessionSummary is ABC new xyz" + JSON.stringify(result))
				return result.data;
			}
			).then(data => {
				if (data) {
					let thisWeekSessionData = this.processWeeklyInfo(data);
					this.setState({ thisWeekSessionData: thisWeekSessionData });
				}
			}).catch(err => {
				console.log("========" + JSON.stringify(this.err));
			});
	}

	fetchCurrentSessionSummary() {
		let childSeesionId = this.state.childSeesionId;
		client.query({
			query: getSessionSummary,
			variables: {
				childSeesionId: childSeesionId,
			}
		})
			.then(result => {
				console.log("session summary result =======>", JSON.stringify(result))
				// this.fetchCurrentSessionSummary()
				return result.data;
			}
			).then(data => {
				if (data.summary) {
					let currentSessionData = this.processSessionInfo(data);
					console.log("data summary =-=-=-==-==-=-=-=-=-=-", JSON.stringify(currentSessionData))
					this.setState({ currentSessionData: currentSessionData });
				}
			}).catch(err => {
				console.log("getSessionSummary::err", JSON.parse(JSON.stringify(err)));
			});
	}

	gotoHome() {
		let { navigation } = this.props;
		navigation.navigate(this.state.fromPage);
	}

	getSessionContent(index) {
		let sessionInfo = {};
		if (index === 0) {
			sessionInfo = this.state.currentSessionData;
			console.log('daily session info new -->' + JSON.stringify(sessionInfo))
		} else if (index === 1) {
			sessionInfo = this.state.thisWeekSessionData;
			console.log('weekely session info xyzy --->' + JSON.stringify(sessionInfo))
		}


		return (
			<View>
				<View style={styles.placeHolderView}>
					<BarChart style={{ width: '100%', height: '90%' }}
						marker={{
							enabled: true,
							allowDecimals: false,
							backgroundTint: processColor('red'),
							markerColor: processColor('red'),
							textColor: processColor('white'),
						}}
						//xAxis={this.state.xAxis}
						xAxis={{
							granularityEnabled: true,
							granularity: 1,
							drawGridLines: false,
						}}
						yAxis={{
							left: { drawGridLines: false },
							right: { drawGridLines: false },

						}}
						data={
							{

								dataSets: [{
									values: [{ x: 0, y: sessionInfo.totalTrials }],
									label: 'Trials Completed',
									config: {
										color: processColor('#EE82EE'),
										barShadowColor: processColor('violet'),
									}
								}, {
									values: [{ x: 1, y: sessionInfo.correctCount }],
									label: 'Correct',
									config: {
										color: processColor('#4BAEA0'),
										barShadowColor: processColor('lightgrey'),
									}
								}, {
									values: [{ x: 2, y: sessionInfo.incorrectCount }],
									label: 'Incorrect',
									config: {
										color: processColor('#FF8080'),
										barShadowColor: processColor('lightgrey'),
									}
								}, {
									values: [{ x: 3, y: sessionInfo.noCount }],
									label: 'No',
									config: {
										color: processColor('#63686E'),
										barShadowColor: processColor('lightgrey'),
									}
								}, {
									values: [{ x: 4, y: sessionInfo.promptCount }],
									label: 'Prompted',
									config: {
										color: processColor('#FF9C52'),
										barShadowColor: processColor('lightgrey'),
									}
								}, {
									values: [{ x: 5, y: sessionInfo.mandCount }],
									label: 'Mand',
									config: {
										color: processColor('#5F6CAF'),
										barShadowColor: processColor('lightgrey'),
									}
								}, {
									values: [{ x: 6, y: sessionInfo.behaviourCount }],
									label: 'Behaviours',
									config: {
										color: processColor('#5F6CAF'),
										barShadowColor: processColor('lightgrey'),
									}
								}],
							}
						}
					/>
				</View>

				<Row style={{ marginBottom: 16 }}>
					<Column>
						{this.renderBox("Trials Completed",
							sessionInfo.totalTrials, "For " + sessionInfo.totalTarget + " Targets",
							false)}
					</Column>
				</Row>

				<Row style={{ marginBottom: 16 }}>
					<Column>
						{this.renderBox("Correct", sessionInfo.correctCount, "Responses", false)}
					</Column>
					<Column>
						{this.renderBox("Incorrect", sessionInfo.incorrectCount, "Responses", false)}
					</Column>
				</Row>

				<Row style={{ marginBottom: 16 }}>
					<Column>
						{this.renderBox("No", sessionInfo.noCount, "Responses", false)}
					</Column>
					<Column>
						{this.renderBox("Prompted", sessionInfo.promptCount, "Responses", false)}
					</Column>
				</Row>

				<Row style={{ marginBottom: 16 }}>
					<Column>
						{this.renderBox("Mand", sessionInfo.mandCount, "Recorded", false)}
					</Column>
					<Column>
						{this.renderBox("Behaviours", sessionInfo.behaviourCount, "Recorded", false)}
					</Column>
				</Row>
			</View>
		)
	}

	renderMainContent() {
		return (
			<>
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<View style={{ height: 16 }} />
					<ScrollView horizontal={true}>
						{this.state.summaryTabs.map((tab, index) => (
							<TouchableOpacity onPress={() => this.selectTab(index)} key={index}>
								<Text style={[styles.tabView, (this.state.currentTabIndex === index) ? styles.selectedTabView : ""]}>{tab.name}</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
					<View>
						{this.state.summaryTabs.map((el, index) => (
							((this.state.currentTabIndex == index) &&
								this.getSessionContent(index)
							)
						))}
					</View>
				</ScrollView>
				<View style={styles.continueView}>
					<Button onPress={() => { this.gotoHome() }}
						labelButton='Go to Home' />
				</View>
			</>
		);
	}

	render() {
		let { route } = this.props;
		console.log("child session id props",route.params.childSeesionId)
		return (
			<SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
				<NavigationHeader title='Session Summary'
					backPress={() => {
						this.gotoHome()
					}} />

				<Container>
					{OrientationHelper.getDeviceOrientation() == 'portrait' && (
						<>
							{this.renderMainContent()}
						</>
					)}

					{OrientationHelper.getDeviceOrientation() == 'landscape' && (
						<Row style={{ flex: 1 }}>
							<Column style={{ flex: 2 }}>
								{this.renderMainContent()}
							</Column>
							<Column>
								<SessionFeedbackScreen
									isFromTab={true}
									pageTitle={route.params.pageTitle}
									fromPage={route.params.fromPage}
									sessionId={route.params.sessionId}
									childSeesionId={route.params.childSeesionId}
									navigation={this.props.navigation}
									onOkPress={() => this.gotoHome()}
									 />
							</Column>
						</Row>
					)}
				</Container>
			</SafeAreaView>
		)
	}
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		height: 60,
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
	scrollView: {
		marginBottom: 120
	},
	tabView: {
		paddingBottom: 10,
		marginLeft: 15,
		marginRight: 15,
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
	},
	//    
	container: {
		flex: 1,
		marginBottom: 150
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
		marginVertical: 10
	},
	continueViewText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	},
	placeHolderView: {
		height: 240,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Color.white,
		marginTop: 10,
		marginBottom: 16
	},
	boxView: {
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#eee',
		borderRadius: 5,
		padding: 10
	},
	numberText: {
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '600',
		fontSize: 38,
		color: '#4BAEA0'
	},
	correct: {
		color: '#4BAEA0'
	},
	incorrect: {
		color: '#FF8080'
	},
	no: {
		color: '#63686E'
	},
	prompted: {
		color: '#FF9C52'
	},
	mand: {
		color: '#5F6CAF'
	},
	behaviours: {
		color: '#5F6CAF'
	},
});

const mapStateToProps = (state) => ({
	authResult: getAuthResult(state),
	authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
	dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SessionSummaryScreen);

