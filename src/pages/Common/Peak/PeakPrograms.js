import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Image,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setPeakPrograms } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from '../../../components/Button';
import TherapistRequest from '../../../constants/TherapistRequest';
import CreateProgram from './CreateProgram';
import PeakScreen from './PeakScreen';
import moment from 'moment';
import LoadingIndicator from '../../../components/LoadingIndicator';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class PeakPrograms extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			peakPrograms1: [
				{ index: 0, title: 'PEAK-DT 8', trails: 11, targets: 22, type: 'DIRECT' },
				{
					index: 1,
					title: 'PEAK-DT 1',
					trails: 33,
					targets: 44,
					type: 'GENERALIZATION',
				},
				{
					index: 2,
					title: 'PEAK-DT 2',
					trails: 55,
					targets: 66,
					type: 'TRANSFORMATION',
				},
			],
			peakPrograms: [],
			showNewProgram: false,
			isPeaksLoaded: false,
			tab1: {
				backgroundColor: '#3371FF',
				color: '#ffffff',
			},
			tab2: {
				backgroundColor: '#bcbcbc',
				color: '#000000',
			},
			active: true,
			rightSideView: '',
		};
		this.props.dispatchSetPeakPrograms(this);
	}
	componentWillUnmount() {
		//remove from redux
		this.props.dispatchSetPeakPrograms(null);
	}
	_refresh() {
		this.setState({ isLoading: false });
		this.componentDidMount();
	}

	componentDidMount() {
		const { student, program } = this.props.route.params;
		this.setState({
			student: student,
		});
		this.props.navigation.addListener('focus', () => {
			TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
			this.fetchPeakPrograms();
		});
	}

	fetchPeakPrograms() {
		this.setState({ isLoading: true });
		let student = this.props.route.params.student;
		let variables = {
			studentId: student.node.id,
		};

		console.log('Fetch peak programs --->' + JSON.stringify(variables));
		TherapistRequest.getStudentPeakPrograms(variables)
			.then(peakPrograms => {
				console.log('peakPrograms--->', JSON.stringify(peakPrograms));
				this.setState({ peakPrograms: peakPrograms.data.peakPrograms.edges, isLoading: false });
				//   Alert.alert(JSON.stringify(peakPrograms))
			})
			.catch(error => {
				console.log(JSON.stringify(error));
				console.log(error, error.response);
				this.setState({ isLoading: false });

				Alert.alert('Information', error.toString());
			});
	}

	gotoNewProgram() {
		if (OrientationHelper.getDeviceOrientation() == 'portrait') {
			this.props.navigation.navigate('CreateProgram', {
				student: this.state.student,
			});
		} else if (OrientationHelper.getDeviceOrientation() == 'landscape') {
			// Alert.alert("a", "b");
			this.props.navigation.navigate('CreateProgram', {
				student: this.state.student,
			});
			console.log(OrientationHelper.getDeviceOrientation())
			// this.setState({ rightSideView: 'new' })
		}
	}

	gotoNextScreen(program) {
		let { student } = this.state;

		if (OrientationHelper.getDeviceOrientation() == 'portrait') {
			if (
				program.node.category === 'TRANSFORMATION' ||
				program.node.category === 'EQUIVALENCE'
			) {
				this.props.navigation.navigate('equivalanceOption', {
					student: student,
					category: program.node.category,
					program: program.node.id,
					selectedId: 0,
				});
			} else {
				this.props.navigation.navigate('PeakScreen', {
					student: student,
					category: program.node.category,
					programID: program.node.id,
					program: program,
				});
			}
		} else if (OrientationHelper.getDeviceOrientation() == 'landscape') {
			if (
				program.node.category === 'TRANSFORMATION' ||
				program.node.category === 'EQUIVALENCE'
			) {
				this.props.navigation.navigate('equivalenceOption', {
					student: student,
					category: program.node.category,
					program: program.node.id,
					selectedId: 0,
				});
			} else {
				this.props.navigation.navigate('PeakScreen', {
					student: student,
					category: program.node.category,
					programID: program.node.id,
					program: program,
				});
			}
		}
	}

	gotoResultScreen(programs) {
		let { student } = this.state;
		const { program } = this.props.route.params;
		
		if (OrientationHelper.getDeviceOrientation() == 'portrait') {
			this.props.navigation.navigate('PeakScoreScreen', {
				student: student,
				program: program,
				pk: programs.node.id,
			});
		} else if (OrientationHelper.getDeviceOrientation() == 'landscape') {
			// Alert.alert("a", "b");
			if (programs.node.category === 'DIRECT') {
				// this.setState({ rightSideView: 'detail' })
				this.props.navigation.navigate('PeakScoreScreen', {
					student: student,
					program: program,
					pk: programs.node.id,
				});
			} else if (programs.node.category === 'GENERALIZATION') {
				// this.props.navigation.navigate('PeakPrograms', {
				//     student: student
				// })
			}
		}
	}
	renderCompltedPeakPrograms() {
		let { peakPrograms, rightSideView, student } = this.state;

		let program = this.props.route.params.program;
		console.log(peakPrograms);
		let peakArray = [];
		let i = 0;
		for (let x = peakPrograms.length - 1; x >= 0; x--) {
			let outputDate = moment(peakPrograms[x].node.date).format(
				'MMMM DD, YYYY',
			);
			if (peakPrograms[x].node.status === 'COMPLETED') {

				console.log('We gor some completed peak programs')
				if (OrientationHelper.getDeviceOrientation() == 'portrait') {
					peakArray.push(
						<View key={i}>
							<TouchableOpacity
								onPress={() => {
									this.gotoResultScreen(peakPrograms[x]);
								}}>
								<View style={styles.programBox}>
									<View style={{ flexDirection: 'row' }}>
										<Text style={styles.title}>
											{peakPrograms[x].node.title}
										</Text>
										<Text style={styles.type}>
											{peakPrograms[x].node.category}
										</Text>
									</View>
									<Text
										style={{
											color: Color.greenFill,
											fontWeight: '700',
											fontSize: 13,
										}}>
										COMPLETE
                  					</Text>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										{/*<Text style={styles.targets}>{peakPrograms[x].node.targets.edges.length} Targets</Text>*/}
										{/*<View style={styles.dot} />*/}
										{/*<Text style={styles.trails}>0 Trials</Text>*/}
									</View>
									<Text style={{ marginVertical: 5 }}>{outputDate}</Text>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}>
										<TouchableOpacity
											style={{ marginHorizontal: 0, width: '49%' }}
											onPress={() => {
												this.props.navigation.navigate('PeakReport', {
													student: student,
													program: program,
													type: peakPrograms[x].node.category,
													outputDate: outputDate,
													pk: peakPrograms[x].node.id,
												});
											}}>
											<Text style={styles.type}>{'Report'}</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => {
												this.props.navigation.navigate('PeakSuggestedTargets', {
													student: student,
													program: program,
													pk: peakPrograms[x].node.id,
												});
											}}
											style={{ width: '49%' }}>
											<Text style={styles.type}>{'Suggest Target'}</Text>
										</TouchableOpacity>
									</View>
								</View>
							</TouchableOpacity>
						</View>,
					);
				} else {
					peakArray.push(
						<TouchableOpacity
							key={i}
							onPress={() => {
								// this.setState({
								//     student: student,
								//     category: peakPrograms[x].node.category,
								//     programID: peakPrograms[x].node.id,
								//     rightSideView:'detail'
								// })
								this.gotoResultScreen(peakPrograms[x]);
							}}>
							<View style={styles.programBox}>
								<View style={{ flexDirection: 'row' }}>
									<Text style={styles.title}>{peakPrograms[x].node.title}</Text>
									<Text style={styles.type}>
										{peakPrograms[x].node.category}
									</Text>
								</View>
								<Text
									style={{
										color: Color.greenFill,
										fontWeight: '700',
										fontSize: 13,
									}}>
									COMPLETE
                </Text>
								{/*<View style={{ flexDirection: 'row', alignItems: 'center' }}>*/}
								{/*    <Text style={styles.targets}>{peakPrograms[x].node.targets.edges.length} Targets</Text>*/}
								{/*    <View style={styles.dot} />*/}
								{/*    <Text style={styles.trails}>0 Trials</Text>*/}
								{/*</View>*/}
								<Text style={{ marginVertical: 5 }}>{outputDate}</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<TouchableOpacity
										style={{ marginHorizontal: 0, width: '49%' }}
										onPress={() => {
											this.props.navigation.navigate('PeakReport', {
												student: student,
												program: program,
												type: peakPrograms[x].node.category,
												outputDate: outputDate,
												pk: peakPrograms[x].node.id,
											});
										}}>
										<Text style={styles.type}>{'Report'}</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											this.props.navigation.navigate('PeakSuggestedTargets', {
												student: student,
												program: program,
												pk: peakPrograms[x].node.id,
											});

										}}
										style={{ width: '49%' }}>
										<Text style={styles.type}>{'Suggest Target'}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>,
					);
				}
			}
			i++;
		}
		return (
			<>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
					contentInsetAdjustmentBehavior="automatic"
					style={{ backgroundColor: '#FFFFFF' }}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isLoading}
							onRefresh={this._refresh.bind(this)}
						/>
					}>
					{peakArray}
				</ScrollView>
				{rightSideView != 'new' && (
					<Button
						style={{ marginBottom: 10 }}
						labelButton="Create PEAK Assessment"
						onPress={() => {
							this.gotoNewProgram();
						}}
					/>
				)}
			</>
		);
	}

	renderPeakPrograms() {
		let { peakPrograms, rightSideView, student } = this.state;

		let program = this.props.route.params.program;
		console.log(JSON.stringify(peakPrograms));
		let peakArray = [];
		let i = 0;

		//     this.setState(prevState => {
		//       this.state.peakPrograms.sort((a, b) => (b - a))
		//   });
		for (let x = 0; x <= peakPrograms.length - 1; x++) {
			let outputDate = moment(peakPrograms[x].node.date).format(
				'MMMM DD, YYYY',
			);
			if (peakPrograms[x].node.status === 'PROGRESS') {
				console.log('We gor some inprogress peak programs')

				console.error(" selected peak programs peakprograms 397", peakPrograms[x])

				if (OrientationHelper.getDeviceOrientation() == 'portrait') {
					peakArray.push(
						<TouchableOpacity
							activeOpacity={0.8}
							key={i}
							onPress={() => {
								this.gotoNextScreen(peakPrograms[x]);
								// this.gotoResultScreen(peakPrograms[x])
							}}>
							<View style={styles.programBox}>
								<View style={{ flexDirection: 'row' }}>
									<Text style={styles.title}>{peakPrograms[x].node.title}</Text>
									<Text style={styles.type}>
										{peakPrograms[x].node.category}
									</Text>
								</View>
								<Text
									style={{
										color: Color.orange,
										fontWeight: '700',
										fontSize: 13,
									}}>
									IN PROGRESS
                </Text>
								{/*<View style={{ flexDirection: 'row', alignItems: 'center' }}>*/}
								{/*    <Text style={styles.targets}>{peakPrograms[x].node.targets.edges.length} Targets</Text>*/}
								{/*    <View style={styles.dot} />*/}
								{/*    <Text style={styles.trails}>0 Trials</Text>*/}
								{/*</View>*/}
								<Text style={{ marginVertical: 5 }}>{outputDate}</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<TouchableOpacity
										style={{ marginHorizontal: 0, width: '49%' }}
										onPress={() => {
											if (peakPrograms[x].node.category === 'EQUIVALENCE') {
												this.props.navigation.navigate('EquiResult', {
													student: student,
													type: peakPrograms[x].node.category,
													pk: peakPrograms[x].node.id,
													PKIDGRAPH: peakPrograms[x].node.id,
												});
												// this.props.navigation.navigate('PeakReport', {
												//     student: student,
												//     program: program,
												//     type: peakPrograms[x].node.category,
												//     outputDate: outputDate,
												//     pk:peakPrograms[x].node.id
												// })
											} else {
												this.props.navigation.navigate('PeakReport', {
													student: student,
													program: program,
													type: peakPrograms[x].node.category,
													outputDate: outputDate,
													pk: peakPrograms[x].node.id,
												});
											}
										}}>
										<Text style={styles.type}>{'Report'}</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											if (peakPrograms[x].node.category === 'EQUIVALENCE') {
												this.props.navigation.navigate('PeakEquSuggesTarget', {
													student: student,
													program: program,
													pk: peakPrograms[x].node.id,
												});
											} else {
												this.props.navigation.navigate('PeakSuggestedTargets', {
													student: student,
													program: program,
													pk: peakPrograms[x].node.id,
												});
											}
										}}
										style={{ width: '49%' }}>
										<Text style={styles.type}>{'Suggested Target'}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>,
					);
				} else {
					peakArray.push(
						<TouchableOpacity
							key={i}
							onPress={() => {
								// this.setState({
								//     student: student,
								//     category: peakPrograms[x].node.category,
								//     programID: peakPrograms[x].node.id,
								//     rightSideView:'detail'
								// })
								this.gotoNextScreen(peakPrograms[x]);
							}}>
							<View style={styles.programBox}>
								<View style={{ flexDirection: 'row' }}>
									<Text style={styles.title}>{peakPrograms[x].node.title}</Text>
									<Text style={styles.type}>
										{peakPrograms[x].node.category}
									</Text>
								</View>
								<Text
									style={{
										color: Color.orange,
										fontWeight: '700',
										fontSize: 13,
									}}>
									IN PROGRESS
                </Text>
								{/*<View style={{ flexDirection: 'row', alignItems: 'center' }}>*/}
								{/*    <Text style={styles.targets}>{peakPrograms[x].node.targets.edges.length} Targets</Text>*/}
								{/*    <View style={styles.dot} />*/}
								{/*    <Text style={styles.trails}>0 Trials</Text>*/}
								{/*</View>*/}
								<Text style={{ marginVertical: 5 }}>{outputDate}</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<TouchableOpacity
										style={{ marginHorizontal: 0, width: '49%' }}
										onPress={() => {
											if (peakPrograms[x].node.category === 'EQUIVALENCE') {
												this.props.navigation.navigate('EquiResult', {
													student: student,
													type: peakPrograms[x].node.category,
													pk: peakPrograms[x].node.id,
													PKIDGRAPH: peakPrograms[x].node.id,
												});
											} else {
												this.props.navigation.navigate('PeakReport', {
													student: student,
													program: program,
													type: peakPrograms[x].node.category,
													outputDate: outputDate,
												});
											}
										}}>
										<Text style={styles.type}>{'Report'}</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											if (peakPrograms[x].node.category === 'EQUIVALANCE') {
												this.props.navigation.navigate('PeakEquSuggesTarget', {
													student: student,
													program: program,
													pk: peakPrograms[x].node.id,
												});
											} else {
												this.props.navigation.navigate('PeakSuggestedTargets', {
													student: student,
													program: program,
													pk: peakPrograms[x].node.id,
												});
											}
										}}
										style={{ width: '49%' }}>
										<Text style={styles.type}>{'Suggested Target'}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>,
					);
				}
			}

			i++;
		}
		peakArray.sort((a, b) => a - b);
		return (
			<>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
					contentInsetAdjustmentBehavior="automatic"
					style={{ backgroundColor: '#FFFFFF' }}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isLoading}
							onRefresh={this._refresh.bind(this)}
						/>
					}>
					{peakArray}
				</ScrollView>
				{rightSideView != 'new' && (
					<Button
						style={{ marginBottom: 10 }}
						labelButton="Create PEAK Assessment"
						onPress={() => {
							this.gotoNewProgram();
						}}
					/>
				)}
			</>
		);
	}
	handleTab(type) {
		switch (type) {
			case 'C':
				this.setState({
					tab1: {
						backgroundColor: '#3371ff',
						color: '#ffffff',
					},
					tab2: {
						backgroundColor: '#bcbcbc',
						color: '#000000',
					},
					active: true,
				});
				break;
			case 'I':
				this.setState({
					tab2: {
						backgroundColor: '#3371ff',
						color: '#ffffff',
					},
					tab1: {
						backgroundColor: '#bcbcbc',
						color: '#000000',
					},
					active: false,
				});
				break;
			default:
				break;
		}
	}

	render() {
		let { rightSideView } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					backPress={() => this.props.navigation.goBack()}
					title="PEAK Assessment"
				/>
				<Container>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingVertical: 5,
						}}>
						<TouchableOpacity
							style={{
								backgroundColor: this.state.tab1.backgroundColor,
								height: 40,
								width: '48%',
								justifyContent: 'center',
								borderRadius: 5,
							}}
							onPress={() => {
								this.handleTab('C');
							}}>
							<Text
								style={{
									fontSize: 18,
									color: this.state.tab1.color,
									alignSelf: 'center',
								}}>
								Completed
              			</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								backgroundColor: this.state.tab2.backgroundColor,
								height: 40,
								width: '48%',
								justifyContent: 'center',
								borderRadius: 5,
							}}
							onPress={() => {
								this.handleTab('I');
							}}>
							<Text
								style={{
									fontSize: 18,
									color: this.state.tab2.color,
									alignSelf: 'center',
								}}>
								InProgress
              				</Text>
						</TouchableOpacity>
					</View>

					{this.state.isLoading && <LoadingIndicator />}

					{!this.state.isLoading && (
						<>
							{OrientationHelper.getDeviceOrientation() == 'portrait' && (
								<>
									{this.state.active === true && this.renderCompltedPeakPrograms()}
									{this.state.active === false && this.renderPeakPrograms()}
								</>
							)}

							{OrientationHelper.getDeviceOrientation() == 'landscape' && (
								<>
									{this.state.active === true && (
										<Row style={{ flex: 1 }}>
											<Column style={{ flex: 1 }}>
												{this.renderCompltedPeakPrograms()}
											</Column>
										</Row>
									)}
									{this.state.active === false && (
										<Row style={{ flex: 1 }}>
											<Column style={{ flex: 1 }}>{this.renderPeakPrograms()}</Column>
											{/*<Column style={{ flex: 2 }}>*/}
											{/*    {rightSideView == 'new' && (*/}
											{/*        <CreateProgram disableNavigation*/}
											{/*            route={{ params: { student: this.state.student, isInLandscape: true } }} />*/}
											{/*    )}*/}

											{/*    {rightSideView == 'detail' && (*/}
											{/*        <PeakScreen disableNavigation*/}
											{/*            route={{ params: { student: this.state.student, category: this.state.category, programID: this.state.programID, isInLandscape: true } }} />*/}
											{/*    )}*/}
											{/*</Column>*/}
										</Row>
									)}
								</>
							)}

						</>
					)}
				</Container>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.white,
	},
	programBox: {
		margin: 3,
		marginTop: 10,
		padding: 16,
		borderRadius: 5,
		backgroundColor: Color.white,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	title: {
		flex: 1,
		textAlign: 'left',
		fontStyle: 'normal',
		fontWeight: '700',
		fontSize: 18,
		color: '#45494E',
	},
	type: {
		textAlign: 'center',
		color: '#3E7BFA',
		backgroundColor: 'rgba(62, 123, 250, 0.05)',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 6,
	},
	targets: {
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 13,
		color: 'rgba(95, 95, 95, 0.75)',
		paddingVertical: 10,
	},
	dot: {
		height: 5,
		width: 5,
		backgroundColor: Color.grayDarkFill,
		borderRadius: 5,
		marginHorizontal: 8,
	},
	trails: {
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 13,
		color: 'rgba(95, 95, 95, 0.75)',
		paddingVertical: 10,
	},
});
const mapStateToProps = state => ({
	authResult: getAuthResult(state),
});

const mapDispatchToProps = dispatch => ({
	dispatchSetToken: data => dispatch(setToken(data)),
	dispatchSetPeakPrograms: data => dispatch(setPeakPrograms(data)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PeakPrograms);
