import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import ActiveAssessmentCard from '../../components/vbmapps/activeAssessmentCard';
import PreviousAssessmentCard from '../../components/vbmapps/previousAssessmentCard';
import { client, getAssessmentsList } from '../../constants/therapist';
import store from '../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload, setVBMAPPSAssessments } from '../../redux/actions';
import TherapistRequest from '../../constants/TherapistRequest';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';
import Button from '../../components/Button';
import LoadingIndicator  from '../../components/LoadingIndicator';

class AssessmentsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			assessments: [],
			total:0,
			isLoading: false,
			lastAssessment: 0,
			loadingActiveAssessments: true,
			loadingPreviousAssessments: true,
			tab1: {
				backgroundColor: '#3371FF',
				color: '#ffffff'
			},
			tab2: {
				backgroundColor: '#bcbcbc',
				color: '#000000'
			},
			active: true,
		};

		this.props.dispatchSetVBMAPPSAssessments(this);
	}

	componentWillUnmount() {
		//remove from redux
		this.props.dispatchSetVBMAPPSAssessments(null);
	}
	_refresh() {
		console.log("_refresh() is called")
		this.componentDidMount();
	}

	componentDidMount() {
		TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
		this.getAssessments();
	}

	getAssessments() {
		const { student, program } = this.props.route.params;
		let variables = {
			studentID: student.node.id
		};
		console.log("assesment list vars", variables)
		TherapistRequest.getVBMAPPSAssessmentsList(variables).then(result => {
			console.log(">>>>>>>>>>>>assessments:",result.data.vbmappGetAssessments.edges.length, 'vb mapps  assesments');
			this.setState({
				assessments: result.data.vbmappGetAssessments.edges,
				lastAssessment: result.data.vbmappGetAssessments.edges[result.data.vbmappGetAssessments.edges.length - 1].node.testNo,
				loadingActiveAssessments: false,
				loadingPreviousAssessments: false,
				isLoading: false
			})
		}).catch(err => console.log(JSON.stringify(err)));
	}

	getActiveAssessment = () => {
		const { assessments } = this.state;
		const { student, program } = this.props.route.params;
		const completed = assessments[assessments.length - 1].milestone + assessments[assessments.length - 1].barriers + assessments[assessments.length - 1].eesa + assessments[assessments.length - 1].transition;
		const percentage = (completed / assessments[assessments.length - 1].total) * 100;
		console.log(completed,);
		console.log("llalalalaal>>>>>", completed);
		let resList = [];
		resList.push(
			<ActiveAssessmentCard
				navigation={this.props.navigation}
				student={student}
				master={assessments[assessments.length - 1].node.id}
				testNo={assessments[assessments.length - 1].node.testNo}
				timestamp={assessments[assessments.length - 1].node.date}
				milestones={assessments[assessments.length - 1].milestone}
				barriers={assessments[assessments.length - 1].barriers}
				transition={assessments[assessments.length - 1].transition}
				eesa={assessments[assessments.length - 1].eesa}
				percentage={completed}
				program={program}
			/>,
		);
		return resList;
	}

	getPreviousAssessments = () => {
		const { assessments } = this.state;
		const { student, program } = this.props.route.params;
		let resList = [];
		for (let x = assessments.length - 2; x >= 0; x--) {
			const completed = assessments[x].milestone + assessments[x].barriers + assessments[x].eesa + assessments[x].transition;
			let percentage = 0;
			if (completed > 0) {
				percentage = (completed * 100) / assessments[x].total;
			}

			console.log("lalaosososola", assessments[x].total)
			resList.push(
				<PreviousAssessmentCard
					navigation={this.props.navigation}
					student={student}
					program={program}
					master={assessments[x].node.id}
					testNo={assessments[x].node.testNo}
					timestamp={assessments[x].node.date}
					milestones={assessments[x].milestone}
					barriers={assessments[x].barriers}
					transition={assessments[x].transition}
					eesa={assessments[x].eesa}
					percentage={completed}
					program={program}
				/>
			);
		}
		return resList;
	}
	handleTab(type) {
		switch (type) {
			case "C":
				this.setState({
					tab1: {
						backgroundColor: '#3371ff',
						color: '#ffffff'
					},
					tab2: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					active: true
				})
				break;
			case "I":
				this.setState({
					tab2: {
						backgroundColor: '#3371ff',
						color: '#ffffff'
					},
					tab1: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					}, active: false
				})
				break;
			default:
				break;
		}
	}

	render() {
		const { assessments, loadingActiveAssessments, loadingPreviousAssessments, lastAssessment } = this.state;
		const { student, program } = this.props.route.params;
		console.log("abcbcbc", assessments.length);
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					backPress={() => this.props.navigation.goBack()}
					title="VB-Mapp"
				/>
				<Container>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
						<TouchableOpacity style={{ backgroundColor: this.state.tab1.backgroundColor, height: 40, width: '48%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
							this.handleTab("C")
						}}>
							<Text style={{ fontSize: 18, color: this.state.tab1.color, alignSelf: 'center' }}>Active</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ backgroundColor: this.state.tab2.backgroundColor, height: 40, width: '48%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
							this.handleTab("I")
						}}>
							<Text style={{ fontSize: 18, color: this.state.tab2.color, alignSelf: 'center' }}>Previous</Text>
						</TouchableOpacity>
					</View>
					{assessments && assessments.length===0 && <LoadingIndicator />}

					<ScrollView showsVerticalScrollIndicator={false} style={styles.assessmentsList}>
						{assessments && assessments.length > 0 ? this.state.isLoading == false : this.state.isLoading == true}
						{this.state.isLoading === false ? <View>
							{this.state.active === true && <View>
								{/*{loadingActiveAssessments===true ? <ActivityIndicator /> :*/}
								<View style={styles.activeAssessment}>
									{assessments && assessments.length > 0 &&
										<Text style={styles.heading}>Active Assessment</Text>}
									{assessments && assessments.length > 0 ? this.getActiveAssessment() : <Text>No Active Assessments</Text>}
									{/* <ActivityIndicator*/}
									{/*animating = {animating}*/}
									{/*color = '#bc2b78'*/}
									{/*size = "large"*/}
									{/*style = {styles.activityIndicator}/> */}
								</View>
								{/*}*/}
							</View>}

							{this.state.active === false && <View>
								{loadingPreviousAssessments === true && this.state.active === true ? <ActivityIndicator /> :
									<View style={styles.previousAssessments}>
										{assessments && assessments.length > 0 &&
											<Text style={styles.heading}>Previous Assessments</Text>}
										{assessments && assessments.length > 0 ? this.getPreviousAssessments() : <Text>No Previous Assessments</Text>}
									</View>}

							</View>}
						</View> : <Text style={{ alignSelf: 'center', marginTop: '45%' }}>Loading ...</Text>}
					</ScrollView>
					<Button labelButton='New Assessment'
						style={{ marginVertical: 10 }}
						onPress={() => {
							this.props.navigation.navigate('NewAssessment', {
								assessmentNumber: lastAssessment + 1,
								student: student
							})
						}}
					/>
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	pageHeading: {
		fontSize: 24,
		fontWeight: '700',
		flex: 1,
		textAlign: 'center'
	},
	activeAssessment: {
		marginTop: 10,
		paddingHorizontal: 5
	},
	previousAssessments: {
		marginTop: 10,
		paddingHorizontal: 5
	},
	heading: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 10
	},
	buttonFilled: {
		padding: 20,
		borderRadius: 10,
		backgroundColor: '#3E7BFA',
		marginBottom: 10
	},
	buttonText: {
		color: '#FFF',
		fontSize: 14,
		fontWeight: '700',
		textAlign: 'center'
	},
	assessmentsList: {
		marginBottom: 20
	}
})

const mapStateToProps = (state) => ({
	authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
	dispatchSetVBMAPPSAssessments: (data) => dispatch(setVBMAPPSAssessments(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentsList);
