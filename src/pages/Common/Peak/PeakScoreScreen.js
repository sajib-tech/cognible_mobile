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
import * as Progress from 'react-native-progress';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TherapistRequest from '../../../constants/TherapistRequest';
import Button from '../../../components/Button';
import LoadingIndicator from '../../../components/LoadingIndicator';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class PeakScoreScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			summary: {},
		};
	}

	componentDidMount() {
		const { program } = this.props.route.params;
		let variables;
		if (program.node) {
			variables = {
				program: program.node.id,
			};
		}
		else {
			variables = {
				program: program.id,
			};
		}

		console.log('Fetch peakscore details variables test 2 -->' + JSON.stringify(variables))
		TherapistRequest.peakScoreDetails(variables).then(result => {
			console.log('Fetch peakscore details result -->' + JSON.stringify(result))

			this.setState({
				summary: result.data.peakDataSummary,
				isLoading: false
			});
		}).catch(error => {
			console.log(JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}

	getPlaceholderForGraph() {
		return (
			<View style={styles.placeHolderView}>
				<Text
					style={{
						fontFamily: 'SF Pro Text',
						fontStyle: 'normal',
						fontWeight: '600',
						fontSize: 19,
						color: '#cccccc',
					}}>
					PLACEHOLDER FOR GRAPH
        		</Text>
			</View>
		);
	}

	getScoresContent() {
		const { summary } = this.state;
		return (
			<View>
				{this.getPlaceholderForGraph()}

				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL LINE ITEM
					</Text>
					<Text style={[styles.numberText, styles.no]}>{summary.total}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={1}
							width={null}
							color="#4BAEA0"
							borderColor="#4BAEA0"
						/>
					</View>
				</View>

				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL ATTENDEND
					</Text>
					<Text style={[styles.numberText, styles.no]}>{summary.totalAttended}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={summary.totalAttended / summary.total}
							width={null}
							color="#FF9C52"
							borderColor="#FF9C52"
						/>
					</View>
				</View>

				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL CORRECT
					</Text>
					<Text style={[styles.numberText, styles.no]}>{summary.totalCorrect}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={summary.totalCorrect / summary.total}
							width={null}
							color="#4BAEA0"
							borderColor="#4BAEA0"
						/>
					</View>
				</View>


				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL INCORRECT
					</Text>
					<Text style={[styles.numberText, styles.no]}>{summary.totalIncorrect}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={summary.totalIncorrect / summary.total}
							width={null}
							color="#FF9C52"
							borderColor="#FF9C52"
						/>
					</View>
				</View>


				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL NO RESPONSE
					</Text>
					<Text style={[styles.numberText, styles.no]}>{summary.totalNoResponse}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={summary.totalNoResponse / summary.total}
							width={null}
							color="#4BAEA0"
							borderColor="#4BAEA0"
						/>
					</View>
				</View>


				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL SUGGESTED TARGETS
					</Text>
					<Text style={[styles.numberText, styles.no]}>  {summary.totalSuggested ? summary.totalSuggested : 0}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={(summary.totalSuggested ? summary.totalSuggested : 0) / summary.total}
							width={null}
							color="#FF9C52"
							borderColor="#FF9C52"
						/>
					</View>
				</View>

				<View style={styles.boxView}>
					<Text style={styles.title}>
						TOTAL SKIPPED
					</Text>
					<Text style={[styles.numberText, styles.no]}>{summary.totalSkipped ? summary.totalSkipped : 0}</Text>
					<View style={styles.progress}>
						<Progress.Bar
							progress={(summary.totalSkipped ? summary.totalSkipped : 0) / summary.total}
							width={null}
							color="#4BAEA0"
							borderColor="#4BAEA0"
						/>
					</View>
				</View>
			</View>
		);
	}

	gotoHome() {
		let { navigation } = this.props;
		const { program, student, pk } = this.props.route.params;

		navigation.navigate('PeakSuggestedTargets', {
			program: program,
			student: student,
			pk: pk,
		});
	}

	renderMainContent() {
		const { summary } = this.state;
		return (
			<>
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					{summary && Object.keys(summary).length > 0 && this.getScoresContent()}
				</ScrollView>
				<View style={styles.continueView}>
					<Button style={{ marginBottom: 10 }}
						onPress={() => {
							this.gotoHome();
						}}
						labelButton="Go to Suggested Targets"
					/>
				</View>
			</>
		);
	}

	render() {
		let { isLoading } = this.state;
		return (
			<SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
				<NavigationHeader
					title="Peak Summary"
					backPress={() => {
						this.props.navigation.goBack();
					}}
				/>

				{isLoading && <LoadingIndicator />}

				{!isLoading && (
					<Container>
						{OrientationHelper.getDeviceOrientation() == 'portrait' && (
							<>{this.renderMainContent()}</>
						)}

						{OrientationHelper.getDeviceOrientation() == 'landscape' && (
							<Row style={{ flex: 1 }}>
								<Column style={{ flex: 2 }}>{this.renderMainContent()}</Column>
								<Column>
									{/* <SessionFeedbackScreen disableNavigation /> */}
								</Column>
							</Row>
						)}
					</Container>
				)}
			</SafeAreaView>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.white,
	},
	placeHolderView: {
		height: 240,
		width: '100%',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'rgba(0, 0, 0, 0.05)',
		backgroundColor: '#FAFAFA',
		marginTop: 10,
		marginBottom: 10,
	},
	boxView: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		backgroundColor: Color.white,
		marginHorizontal: 3,
		marginBottom: 16,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 5
	},
	title: {
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '500',
		fontSize: 16,
		alignSelf: 'center'
	},
	numberText: {
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '600',
		fontSize: 20,
		color: '#4BAEA0',
		alignSelf: 'center'
	},
	correct: {
		color: '#4BAEA0',
	},
	incorrect: {
		color: '#FF8080',
	},
	no: {
		color: '#63686E',
	},
	prompted: {
		color: '#FF9C52',
	},
	skipped: {
		color: '#4BAEA0',
		fontSize: 34,
	},
	progress: {
		paddingVertical: 10
	}
});
const mapStateToProps = state => ({
	authResult: getAuthResult(state),
});

const mapDispatchToProps = dispatch => ({
	dispatchSetToken: data => dispatch(setToken(data)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PeakScoreScreen);
