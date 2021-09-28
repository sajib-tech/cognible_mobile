import React, { Component } from 'react';
import {
	Alert,
	ActivityIndicator,
	Dimensions,
	Text,
	View,
	TextInput,
	StyleSheet,
	Image,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	BackHandler, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PickerModal from "../../../components/PickerModal";
import * as Progress from 'react-native-progress';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TherapistRequest from '../../../constants/TherapistRequest';
import Styles from '../../../utility/Style.js';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import Button from '../../../components/Button';
import store from "../../../redux/store";
import ActionSheet from "react-native-actionsheet";
import DateHelper from '../../../helpers/DateHelper';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NavigationHeader from '../../../components/NavigationHeader';
import { setPeakPrograms, setToken } from '../../../redux/actions';
import { connect } from 'react-redux';
import { Container } from '../../../components/GridSystem';

class PeakReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			array: [],
			instruction: [],
			codes: '',
			peakSummary: '',
			peakSummaryEdgess: [],
			summary: {},
			factorScore: [],
			isLoading: false,
			issaved: false,
			assesor: '',
			filterDate: '',
			lastData: [],
			date1: [],
			date2: [],
			date3: [],
			selectedI: 0,
			typee: '',
			options: ['1-2.11 yrs', '3-4.11 yrs ', '5-6.11 yrs' , '7-8.11 yrs', '9-10.11 yrs', 'Cancel'],
			selectedOption: ['1-2.11 yrs', '3-4.11 yrs', '5-6.11 yrs', '7-8.11 yrs', '9-10.11 yrs'],
			//   {id: '1-2.11 yrs', label: '1-2.11 yrs'},
			//   {id: '3-4.11 yrs', label: '3-4.11 yrs'},
			//   {id: '5-6.11 yrs', label: '5-6.11 yrs'},
			//   {id: '7-8.11 yrs', label: '7-8.11 yrs'},
			//   {id: '9-10.11 yrs', label: '9-10.11 yrs'},
			// ],
			age: 2,
			selectedAgeInde: 0,
			peakrelational: [],
			androyears: [	{ id: "1-2.11 yrs", label: "1-2.11 yrs" },
			{ id: "3-4.11 yrs", label: "3-4.11 yrs" },
			{ id: "5-6.11 yrs", label: "5-6.11 yrs" },
			{ id: "7-8.11 yrs", label: "7-8.11 yrs" },
			{ id: "9-10.11 yrs", label: "9-10.11 yrs" }],
			dateStatus: -5,
			allFilterData: [],
			tab1: {
				backgroundColor: '#3371FF',
				color: '#ffffff'
			},
			tab2: {
				backgroundColor: '#bcbcbc',
				color: '#000000'
			},
			tab3: {
				backgroundColor: '#bcbcbc',
				color: '#000000'
			},
			active: "1",
			selectedYear: '1-2.11 yrs',
			peakFactor: [],
			peakFactor1: [
				{
					id: 1,
					title: "Foundational Learning",
					year: '2-3.11 yrs',
					v: '',
					code: 'FLS',
					dist: {
						first: 2,
						second: 30,
						third: 34,
						fourth: 34,
						fifth: 34
					}
				},
				{
					id: 2,
					title: "Perceptual Learning Skills",
					year: '',
					v: '',
					code: 'PLS',
					dist: {
						first: 0,
						second: 18,
						third: 21,
						fourth: 22,
						fifth: 22
					}
				},
				{
					id: 3,
					title: "Verbal Comprehension",
					year: '',
					v: '',
					code: 'VCS',
					dist: {
						first: 0,
						second: 19,
						third: 80,
						fourth: 94,
						fifth: 100
					}
				},
				{
					id: 4,
					title: "Verbal Reasoning, Memory, and Math Skills",
					year: '',
					v: '',
					code: 'VRM',
					dist: {
						first: 0,
						second: 0,
						third: 10,
						fourth: 22,
						fifth: 28
					}
				}
			],
			peakFactor2: [
				{
					id: 1,
					title: "Foundational Learning & Basic Social Skills",
					year: '2-3 yrs',
					v: '',
					code: 'FLS',
					dist: {
						first: 1,
						second: 20,
						third: 25,
						fourth: 26,
						fifth: 28,
						sixth: 29,
						seventh: 33,
						eigth: 33
					}
				},
				{
					id: 2,
					title: "Basic Verbal Comprehension, Memory and Advanced Social Skills",
					year: '',
					v: '',
					code: 'PLS',
					dist: {
						first: 1,
						second: 15,
						third: 24,
						fourth: 36,
						fifth: 55,
						sixth: 57,
						seventh: 58,
						eigth: 59
					}
				},
				{
					id: 3,
					title: "Advanced Verbal Comprehension, Basic Problem Solving, and Advanced Math Skills",
					year: '',
					v: '',
					code: 'VCS',
					dist: {
						first: 2,
						second: 4,
						third: 9,
						fourth: 13,
						fifth: 50,
						sixth: 53,
						seventh: 61,
						eigth: 63
					}
				},
				{
					id: 4,
					title: "Verbal Reasoning,Advanced Problem Solving,Advanced Reading and Writing Skills",
					year: '',
					v: '',
					code: 'VRM',
					dist: {
						first: 0,
						second: 0,
						third: 0,
						fourth: 0,
						fifth: 16,
						sixth: 20,
						seventh: 26,
						eigth: 29
					}
				}
			]

		};
	}
	componentDidMount() {
		const { type } = this.props.route.params;

		this.setState({ isLoading: true });

		TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
		this.getDOB();
		this.getPeakSummaryData();
		this.getPeakNormalTableReport();

		AsyncStorage.getItem('userName').then((res) => {
			this.setState({ assesor: res, typee: type, peakFactor: type == 'GENERALIZATION' ? this.state.peakFactor2 : this.state.peakFactor1 });
		})
	}

	getDOB() {
		const { student } = this.props.route.params;
		let variables = {
			studentId: student.node.id
		};

		TherapistRequest.GetClinicID(variables).then(result => {
			console.log("GetClinicID", result)
			let dateAge = result.data.student.dob;

			var birthdate = new Date(dateAge);
			var cur = new Date();
			var diff = cur - birthdate; // This is the difference in milliseconds
			var age = Math.floor(diff / 31557600000);

			this.setState({ age: age });
		}).catch(err => console.log("smmsmsms", err))
	}

	getAge(key, value) {
		let y = '';
		if (this.state.factorScore.length > 0) {
			console.log(this.state.factorScore);
			const arr = this.state.factorScore.forEach(element => {
				if (key === "1" && element?.node?.codeType === "FLS") {
					y = element?.node?.age;
				}
				if (key === "2" && element?.node?.codeType === "PLS") {
					y = element?.node?.age;
				}
				if (key === "3" && element?.node?.codeType === "VCS") {
					y = element?.node?.age;
				}
				if (key === "4" && element?.node?.codeType === "VRM") {
					y = element?.node?.age;
				}
			});
		}
		else {
			if (key === "1") {
				switch (value) {
					case 2:
						y = '1-2.11 yrs'
						break;
					case 30:
						y = '3-4.11 yrs'
						break;
					case 34:
						y = '5-6.11 yrs'
						break;
					default:
						break;
				}

			}
			if (key === "2") {
				switch (value) {
					case 0:
						y = '1-2.11 yrs'
						break;
					case 18:
						y = '3-4.11 yrs'
						break;
					case 21:
						y = '5-6.11 yrs'
						break;
					case 22:
						y = '7-8.11 yrs'
						break;
					default:
						break;
				}

			}
			if (key === "3") {
				switch (value) {
					case 0:
						y = '1-2.11 yrs'
						break;
					case 19:
						y = '3-4.11 yrs'
						break;
					case 80:
						y = '5-6.11 yrs'
						break;
					case 94:
						y = '7-8.11 yrs'
						break;
					case 100:
						y = '9-10.11 yrs'
						break;
					default:
						break;
				}


			}
			if (key === "4") {
				switch (value) {
					case 0:
						y = '1-2.11 yrs'
						break;
					case 10:
						y = '5-6.11 yrs'
						break;
					case 22:
						y = '7-8.11 yrs'
						break;
					case 28:
						y = '9-10.11 yrs'
						break;
					default:
						break;
				}

			}
		}
		return y;
	}

	getPeakNormalTableReport() {

		const { student, program, pk } = this.props.route.params;
		let variables = {
			pk: pk
		};

		TherapistRequest.peakTableReport(variables).then(result => {
			let report = result?.data?.peakReport;
			if (result?.data?.peakReport) {
				let j = 0;
				for (let i in report) {
					//  while (j <=3)
					// {
					this.setState(previousState => {

						console.log("peak factor table", JSON.stringify(previousState))

						const peakFactor = [...previousState.peakFactor];
						if (i == "fls") {

							peakFactor[0] = { ...peakFactor[0], v: report[i] };
							peakFactor[0] = { ...peakFactor[0], year: this.getAge("1", JSON.parse(report[i])?.age_score) }
							// break
						}
						if (i == "pls") {

							peakFactor[1] = { ...peakFactor[1], v: report[i] };
							peakFactor[1] = { ...peakFactor[1], year: this.getAge("2", JSON.parse(report[i])?.age_score) }
							// break
						}
						if (i == "vcs") {

							peakFactor[2] = { ...peakFactor[2], v: report[i] };
							peakFactor[2] = { ...peakFactor[2], year: this.getAge("3", JSON.parse(report[i])?.age_score) }
							// break
						}
						if (i == "vrm") {

							peakFactor[3] = { ...peakFactor[3], v: report[i] };
							peakFactor[3] = { ...peakFactor[3], year: this.getAge("4", JSON.parse(report[i]).age_score) }
							// break
						}


						return { peakFactor };
					});
					// j++;

					//  }
				}
			}
			this.setState({ isLoading: false });
		}).catch(err => console.log(err))
	}

	getCodes(lasts) {
		const { student, program, type, pk } = this.props.route.params;
		let variables = {
			type: type
		};
		let v = {
			pk: pk
		}

		TherapistRequest.getAllQuestionsCode(variables).then(result => {
			this.setState({ codes: result?.data?.peakGetCodes?.edges, instruction: result.data.peakGetCodes.edges })
			let tempCodes = result?.data?.peakGetCodes?.edges;
			let tempArray = [];
			let tempSubArray = [];
			tempCodes.forEach(e => {
				e.yes = '#ffffff'
				for (let m = 0; m < this.state.peakSummary?.length; m++) {
					if (e?.node?.code === this.state.peakSummary[m]?.node?.code) {
						e.yes = "#f7ff00";
					}
				}
				tempArray.push({ code: e?.node?.code, yes: e.yes });
			})
			let tar = [];
			const tar2 = [];

			const fq = this.state.peakSummary?.filter(e => e?.node?.code === '1A');
			if (fq?.length > 0) {
				tar2.push({ code: '1A', yes: '#f7ff00' });
			} else {
				tar2.push({ code: '1A', yes: '#ffffff' });
			}
			const sq = this.state.peakSummary?.filter(e => e?.node?.code === '1B');
			if (sq?.length > 0) {
				tar2.push({
					code: '1B', yes: '#f7ff00'
				});
			} else {
				tar2.push({ code: '1B', yes: '#ffffff' });
			}
			tar.push(tar2)
			var i = 2;
			var j = 2;
			while (i < tempArray.length) {
				let tmp = tempArray;
				let v = [];
				v = tmp.slice(i, i + j)
				tar.push(v);
				i = i + j;
				j = j + 2;
			}
			const t = lasts?.data?.lastFourRecords?.programs;
			t.forEach((ee, u) => {
				const ll = ee?.submitpeakresponsesSet?.edges[0]?.node?.yes?.edges?.forEach(ele => {
					tar.forEach((e) => {
						// const ss = ee?.submitpeakresponsesSet?.edges[0]?.node?.yes?.edges.filter(el => el.node.code === e?.node?.code);
						e.forEach(eee => {
							if (ele.node.code === eee.code) {
								if (u === 0 && eee.yes === "#ffffff") {
									eee.yes = '#1208E7'
								}

								if (u === 1 && eee.yes === "#ffffff") {
									eee.yes = '#0ACA07'
								}
								if (u === 2 && eee.yes === "#ffffff") {
									eee.yes = '#E4695A'
								}

							}
						})

					})
				})
			})

			this.setState({ array: tar, isLoading: false });
		});
	};
	getPeakSummaryData = () => {

		const { student, program, pk } = this.props.route.params;
		// const {name, notes} = this.state;
		let variables = {
			program: pk
		};
		let v = {
			pk: pk
		};
		let vv = {
			id: pk
		};
		TherapistRequest.factoreScoreDetatils(vv).then((res) => {

			console.error("therapist request final age", res)
			this.setState({ factorScore: res?.data?.peakProgram?.factorScores?.edges, selectedYear: res?.data?.peakProgram?.finalAge })
		})
		TherapistRequest.getPeakSummaryData(variables).then(result => {
			this.setState({
				summary: result?.data?.peakDataSummary,
			});
			TherapistRequest.peakReportLastFourData(v).then(res => {
				const s = res?.data?.lastFourRecords?.programs.forEach((element, index) => {
					if (index === 0) {
						element.color = '#1208E7'
					}
					if (index === 1) {
						element.color = '#0ACA07'
					}
					if (index === 2) {
						element.color = '#E4695A'
					}
				});
				this.setState({
					peakSummaryEdgess: result?.data?.
						peakDataSummary?.edges,
					peakSummary: result?.data?.
						peakDataSummary?.edges[0]?.node?.yes?.edges,
					lastData: res?.data?.lastFourRecords?.programs
				})
				this.getCodes(res);
			}).catch(err => {
				console.log(err);
			})

			//    Alert.alert(JSON.stringify(peakSummary))

		});
	};

	handleTab(type) {
		switch (type) {
			case "1":
				this.setState({
					tab1: {
						backgroundColor: '#3371ff',
						color: '#ffffff'
					},
					tab2: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					tab3: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					active: "1"
				})
				break;
			case "2":
				this.setState({
					tab2: {
						backgroundColor: '#3371ff',
						color: '#ffffff'
					},
					tab1: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					tab3: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					active: "2"
				})
				break;
			case "3":
				this.setState({
					tab3: {
						backgroundColor: '#3371ff',
						color: '#ffffff'
					},
					tab1: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					tab2: {
						backgroundColor: '#bcbcbc',
						color: '#000000'
					},
					active: "3"
				})
				break;
			default:
				break;
		}
	}
	submit() {
		console.error("submit called")
		let factor = [];
		this.state.peakFactor.forEach(e => {
			factor.push({ codeType: e.code, age: e.year })
		})
		const { student, program, pk } = this.props.route.params;
		const { name, notes } = this.state;
		let variables = {
			program: pk,
			finalAge: this?.state?.selectedYear == null ? "1-2 yrs" : this.state.selectedYear
		};
		let v = {
			program: pk,
			factorsAge: factor
		}

		console.log("variables", variables)
		console.log("v", v)
		TherapistRequest.peakTableReportFinalAgeSave(variables).then(res => {
			this.setState({ issaved: true })
			TherapistRequest.peakTableReportFactorsAgeSave(v).then(ress => {
				Alert.alert(
					'Report Saved',
					'Successfully ',
					[
						{
							text: 'OK',
							onPress: () => {
								this.setState({ issaved: false })
							},
						},
					],
					{ cancelable: false },
				);
			}).catch(error => console.log(error))
		}).catch(err => console.log("lslslsls", JSON.stringify(err)))
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
	getScoresContent() {
		const { summary } = this.state;
		return (
			<View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.boxView}>
						<Text
							style={{
								fontFamily: 'SF Pro Text',
								fontStyle: 'normal',
								fontWeight: '500',
								fontSize: 16,
								alignSelf: 'center'
							}}>
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

			</View>
		);
	}

	setFirstTriangleRows() {
		const { peakSummaryEdgess, array } = this.state;

		const temTriangleRows = array
		temTriangleRows.forEach((row) => {
			row.forEach(rowItem => {
				rowItem.yes = '#ffffff'
			})
		})
		const peakSummaryEdges = peakSummaryEdgess

		if (peakSummaryEdges.length > 0) {
			peakSummaryEdges[0].node?.yes.edges.map(ele => {
				temTriangleRows.forEach((row) => {
					row.forEach(rowItem => {
						if (ele.node.code === rowItem.code) {
							rowItem.yes = 'yellow'
						}
					})
				})
			})
			peakSummaryEdges[0].node?.no.edges.map(ele => {
				temTriangleRows.forEach((row) => {
					row.forEach(rowItem => {
						if (ele.node.code === rowItem.code) {
							rowItem.yes = 'red'
						}
					})
				})
			})
		}
		this.setState({ array: temTriangleRows })
	}

	filterMethod() {
		const { array, lastData, filterDate, dateStatus } = this.state;
		const filterData = lastData.filter(item => item.date == filterDate)
		const temTriangleRows = array
		const lastAssessments = lastData[dateStatus]
		temTriangleRows.forEach((row) => {
			row.forEach(rowItem => {
				rowItem.yes = '#ffffff'
			})
		})
		if (lastAssessments) {
			lastAssessments.submitpeakresponsesSet.edges[0]?.node.yes.edges.forEach(ele => {
				temTriangleRows.forEach((row) => {
					row.forEach(rowItem => {
						if (ele.node.code === rowItem.code) {
							rowItem.yes = 'yellow'
						}
					})
				})

			})
			lastAssessments.submitpeakresponsesSet?.edges[0]?.node?.no?.edges?.forEach(ele => {
				temTriangleRows.forEach((row) => {
					row.forEach(rowItem => {
						if (ele.node.code === rowItem.code) {
							rowItem.yes = 'red'
						}
					})
				})
			})
		}
		this.setState({ array: temTriangleRows })
	}

	renderTable() {
		const { student, program, outputDate } = this.props.route.params;
		const { instruction, peakFactor, options, androyears } = this.state;
		let percentagee = this.state.typee === 'GENERALIZATION' ? '10%' : '15%'
		let percentagrr = this.state.typee === 'GENERALIZATION' ? '100%' : '99%'
		let percentagss = this.state.typee === 'GENERALIZATION' ? '20%' : '25%'

		let age = null;
		let ageT = null;
		if (student.node.dob != '' && student.node.dob != null) {
			age = "(" + DateHelper.getAge(student.node.dob) + ")";
			ageT = DateHelper.getAge(student.node.dob)
		}

		var dtST = -5

		return (
			<>
				<View>
					<View style={{ height: 50, backgroundColor: '#2DB21B', width: '98%', borderColor: '#000', borderWidth: 1, alignSelf: 'center', justifyContent: 'center' }}>
						<Text style={{ alignSelf: 'center' }}>PEAK Relational Training System</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000', alignSelf: 'center', width: '98%' }}>
						<View style={{ width: '35%', backgroundColor: '#FFF', justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 10, padding: 3 }}>SELECT AGE RANGE OF CHILD </Text>
						</View>
						<View style={{ width: '35%', backgroundColor: '#FFF', justifyContent: 'center' }}>
						{ Platform.OS == 'android' ?
							<>

								{/*Platform.OS == 'android' ?*/}

								<PickerModal
									style={{ paddingLeft: 5, paddingRight: 5, height: 30, borderWidth:0,justifyContent:"center",flex:1}}
									textStyle={{fontSize:12, color: Color.black}}
									selectedValue={this.state.selectedYear || androyears[0].label}
									data={this.state.androyears}
									onValueChange={(itemValue, itemIndex) => {
										console.log("item value", itemValue)
										console.log("itemIndex", itemIndex)
										let peakrelational = this.state.peakrelational;
										peakrelational[0] = itemValue
										this.setState({ peakrelational, selectedYear: itemValue });
										console.log("pak relationsl", this.state.peakrelational)
									}}
								/>

								{/* <MaterialCommunityIcons
									style={{}}
									name="chevron-down"
									size={10}
								/> */}
							</>
							:
							<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>


								<ActionSheet
									ref={o => (this.ActionSheetrel = o)}
									title='Select Age'
									options={options}
									cancelButtonIndex={options.length - 1}
									onPress={(index) => {
										if (index != options.length - 1) {
											this.setState(previousState => {
												console.log("previous state", previousState)
												const peakrelational = [...previousState.peakrelational];
												peakrelational[this.state.selectedAgeInde] = { ...peakrelational[this.state.selectedAgeInde], year: options[index] };
												
												console.log("peak relational", peakrelational)
												return {  peakrelational };
											});
											this.setState({selectedYear: this.state.peakrelational[this.state.selectedAgeInde].year, year: options[index] })
										}

									}}
								/>

								<TouchableOpacity
									onPress={() => {
										// this.setState({ selectedI: i }, () => {
											this.ActionSheetrel.show();
										// })
									}}>
									<Text>{this.state.selectedYear || options[0]} </Text>
								</TouchableOpacity>


								<MaterialCommunityIcons
									style={{ marginLeft: 5 }}
									name="chevron-down"
									size={15}
									onPress={() => {
										// this.setState({ selectedI: i }, () => {
											this.ActionSheetrel.show();
										// })
									}}
								/>
							</View>
							
							}
						</View>

						{/* dropdown peak report */}
						<View style={{ width: '30%', backgroundColor: '#FFF', justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 9, padding: 2 }}>INSTRUCTIONS:  Student Scores, Typical Age Scores and Difference Scores
							will automatically calculate when Age Range of Child is input AND when Factor Scoring Grid is completed.  Use the information to
                      determine Approximate Age Equivalent and select from dropdown. </Text>
						</View>
					</View>
				</View>
				<View style={{ marginTop: 20 }}>
					<Text style={{ textAlign: 'center', fontSize: 12 }}>DIRECT TRAINING MODULE</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000', width: '99%', alignSelf: 'center' }}>
						<View style={{ padding: 2, backgroundColor: '#2DB21B', width: '30%', justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>PEAK FACTOR</Text>
						</View>
						<View style={{ padding: 2, backgroundColor: '#2DB21B', width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>SCORE</Text>
						</View>
						<View style={{ padding: 2, backgroundColor: '#2DB21B', width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>TYPICAL AGE SCORE</Text>
						</View>
						<View style={{ padding: 2, backgroundColor: '#2DB21B', width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>DIFFERENCE SCORE</Text>
						</View>
						<View style={{ padding: 2, backgroundColor: '#2DB21B', width: '25%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>APPROXIMATE AGE EQUIVALENT</Text>
						</View>
					</View>
					{this.state.peakFactor?.map((item, i) => (<View key={i} style={{ width: '99%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000' }}>
						<View style={{ padding: 2, backgroundColor: '#fff', width: '30%', justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item?.title}</Text>
						</View>
						<View style={{ padding: 2, width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item?.v === "" ? "" : JSON.parse(item?.v)?.score}</Text>
						</View>
						<View style={{ padding: 2, width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item?.v === "" ? "" : JSON.parse(item?.v)?.age_score}</Text>
						</View>
						<View style={{ padding: 2, width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item?.v === "" ? "" : JSON.parse(item?.v)?.difference}</Text>
						</View>

						{ Platform.OS == 'android' ?
							<View style={{ padding: 1, width: '30%', borderLeftColor: '#000', borderLeftWidth: 1, flexDirection: 'row' }}>

								{/*Platform.OS == 'android' ?*/}

								<PickerModal
									style={{ paddingLeft: 5, paddingRight: 5, height: 30, borderWidth:0,justifyContent:"center",flex:1}}
									textStyle={{fontSize:12, color: Color.black}}
									selectedValue={item?.year}
									data={[ 
										{ id: "1-2.11 yrs", label: "1-2.11 yrs" },
										{ id: "3-4.11 yrs", label: "3-4.11 yrs" },
										{ id: "5-6.11 yrs", label: "5-6.11 yrs" },
										{ id: "7-8.11 yrs", label: "7-8.11 yrs" },
										{ id: "9-10.11 yrs", label: "9-10.11 yrs" },
									]}
									onValueChange={(itemValue, itemIndex) => {
										let peakFactor = this.state.peakFactor;
										peakFactor[i].year = itemValue;
										this.setState({ peakFactor });
									}}
								/>

								<MaterialCommunityIcons
									style={{}}
									name="chevron-down"
									size={10}
								/>
							</View>
							:
							<View style={{ padding: 2, width: '30%', borderLeftColor: '#000', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, flexDirection: 'row' }}>


								<ActionSheet
									ref={o => (this.ActionSheet = o)}
									title='Select Age'
									options={options}
									cancelButtonIndex={options.length - 1}
									onPress={(index) => {
										if (index != options.length - 1) {
											this.setState(previousState => {
												const peakFactor = [...previousState.peakFactor];
												peakFactor[this.state.selectedI] = { ...peakFactor[this.state.selectedI], year: options[index] };
												return { peakFactor };
											});
										}

									}}
								/>

								<TouchableOpacity
									onPress={() => {
										this.setState({ selectedI: i }, () => {
											this.ActionSheet.show();
										})
									}}>
									<Text>{peakFactor[i].year} </Text>
								</TouchableOpacity>


								<MaterialCommunityIcons
									style={{ marginLeft: 5 }}
									name="chevron-down"
									size={15}
									onPress={() => {
										this.setState({ selectedI: i }, () => {
											this.ActionSheet.show();
										})
									}}
								/>
							</View>}


					</View>))}
					<View style={{ width: '99%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000' }}>
						<View style={{ padding: 2, backgroundColor: '#eee', width: '30%', justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'flex-end', fontSize: 12, fontWeight: 'bold', color: '#000', textAlign: 'right' }}>TOTAL SCORE</Text>
						</View>
						<View style={{ padding: 2, width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{this.state.peakFactor[0].v === "" ? 0 : JSON.parse(this.state.peakFactor[0].v)?.score +
									this.state.peakFactor[1].v === "" ? 0 : JSON.parse(this.state.peakFactor[1].v).score +
										this.state.peakFactor[2].v === "" ? 0 : JSON.parse(this.state.peakFactor[2].v).score +
											this.state.peakFactor[3].v === "" ? 0 : JSON.parse(this.state.peakFactor[3].v).score}
							</Text>
						</View>
						<View style={{ padding: 2, width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{this.state.peakFactor[0].v === "" ? 0 : JSON.parse(this.state.peakFactor[0].v)?.age_score +
									this.state.peakFactor[1].v === "" ? 0 : JSON.parse(this.state.peakFactor[1].v).age_score +
										this.state.peakFactor[2].v === "" ? 0 : JSON.parse(this.state.peakFactor[2].v).age_score +
											this.state.peakFactor[3].v === "" ? 0 : JSON.parse(this.state.peakFactor[3].v).age_score}
							</Text>
						</View>
						<View style={{ padding: 2, width: '15%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{this.state.peakFactor[0].v === "" ? 0 : JSON.parse(this.state.peakFactor[0].v)?.difference +
									this.state.peakFactor[1].v === "" ? 0 : JSON.parse(this.state.peakFactor[1].v).difference +
										this.state.peakFactor[2].v === "" ? 0 : JSON.parse(this.state.peakFactor[2].v).difference +
											this.state.peakFactor[3].v === "" ? 0 : JSON.parse(this.state.peakFactor[3].v).difference}
							</Text>
						</View>
						<View style={{ padding: 2, width: '25%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}></Text>
						</View>
					</View>
				</View>
				 <View style={{ marginTop: 20 }}>
					<Text style={{ textAlign: 'center', fontSize: 12 }}>TYPICAL AGE DISTRIBUTION ON PEAK FACTOR SCORE</Text>

					<View style={{ width: percentagrr, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000' }}>
						<View style={{ padding: 2, backgroundColor: '#2DB21B', width: percentagss, justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 14, color: '#fff', textAlign: 'center' }}>PEAK FACTOR</Text>
						</View>
						<View style={{ padding: 1, backgroundColor: '#2DB21B', width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>1 - 2.11 yrs</Text>
						</View>
						<View style={{ padding: 1, backgroundColor: '#2DB21B', width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>3 - 4.11 yrs</Text>
						</View>
						<View style={{ padding: 1, backgroundColor: '#2DB21B', width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>5 - 6.11 yrs</Text>
						</View>
						<View style={{ padding: 1, backgroundColor: '#2DB21B', width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>7 - 8.11 yrs</Text>
						</View>
						<View style={{ padding: 1, backgroundColor: '#2DB21B', width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>9 - 10.11 yrs</Text>
						</View>
						{this.state.typee === 'GENERALIZATION' &&
							<View style={{ padding: 1, backgroundColor: '#2DB21B', width: '10%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
								<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>11 - 12.11 yrs</Text>
							</View>}
						{this.state.typee === 'GENERALIZATION' &&
							<View style={{ padding: 1, backgroundColor: '#2DB21B', width: '10%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
								<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>13 - 14.11 yrs</Text>
							</View>}
						{this.state.typee === 'GENERALIZATION' &&
							<View style={{ padding: 1, backgroundColor: '#2DB21B', width: '10%', justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
								<Text style={{ alignSelf: 'center', fontSize: 12, color: '#fff', textAlign: 'center' }}>+15 yrs</Text>
							</View>}

					</View>
					{this.state.peakFactor.map((item, i) => (<View key={i} style={{ width: percentagrr, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000' }}>
						<View style={{ padding: 2, backgroundColor: '#fff', width: percentagss, justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.title}</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.first}</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.second}</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.third}</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.fourth}</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.fifth}</Text>
						</View>
						{this.state.typee === 'GENERALIZATION' &&
							<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
								<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.sixth}</Text>
							</View>}
						{this.state.typee === 'GENERALIZATION' &&
							<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
								<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.seventh}</Text>
							</View>}
						{this.state.typee === 'GENERALIZATION' &&
							<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
								<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center' }}>{item.dist.eigth}</Text>
							</View>}
					</View>))}
					<View style={{ width: percentagrr, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000' }}>
						<View style={{ padding: 2, backgroundColor: '#eee', width: percentagss, justifyContent: 'center' }}>
							<Text style={{ alignSelf: 'flex-end', fontSize: 14, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>TOTAL SCORE</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.first +
									this.state.peakFactor[1].dist.first +
									this.state.peakFactor[2].dist.first +
									this.state.peakFactor[3].dist.first
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.second +
									this.state.peakFactor[1].dist.second +
									this.state.peakFactor[2].dist.second +
									this.state.peakFactor[3].dist.second
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.third +
									this.state.peakFactor[1].dist.third +
									this.state.peakFactor[2].dist.third +
									this.state.peakFactor[3].dist.third
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.fourth +
									this.state.peakFactor[1].dist.fourth +
									this.state.peakFactor[2].dist.fourth +
									this.state.peakFactor[3].dist.fourth
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.fifth +
									this.state.peakFactor[1].dist.fifth +
									this.state.peakFactor[2].dist.fifth +
									this.state.peakFactor[3].dist.fifth
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.sixth +
									this.state.peakFactor[1].dist.sixth +
									this.state.peakFactor[2].dist.sixth +
									this.state.peakFactor[3].dist.sixth
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.seventh +
									this.state.peakFactor[1].dist.seventh +
									this.state.peakFactor[2].dist.seventh +
									this.state.peakFactor[3].dist.seventh
								}
							</Text>
						</View>
						<View style={{ padding: 2, width: percentagee, justifyContent: 'center', borderLeftColor: '#000', borderLeftWidth: 1 }}>
							<Text style={{ alignSelf: 'center', fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
								{
									this.state.peakFactor[0].dist.eigth +
									this.state.peakFactor[1].dist.eigth +
									this.state.peakFactor[2].dist.eigth +
									this.state.peakFactor[3].dist.eigth
								}
							</Text>
						</View>
					</View>
				</View> 
			</>
		);
	}

	render() {
		const { student, program, outputDate } = this.props.route.params;
		const { instruction, peakFactor, options } = this.state;
		let percentagee = this.state.typee === 'GENERALIZATION' ? '10%' : '15%'
		let percentagrr = this.state.typee === 'GENERALIZATION' ? '100%' : '99%'
		let percentagss = this.state.typee === 'GENERALIZATION' ? '20%' : '25%'

		let age = null;
		let ageT = null;
		if (student.node.dob != '' && student.node.dob != null) {
			age = "(" + DateHelper.getAge(student.node.dob) + ")";
			ageT = DateHelper.getAge(student.node.dob)
		}

		var dtST = -5
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					backPress={() => this.props.navigation.goBack()}
					title="PEAK Report"
				/>

				{this.state.isLoading && <LoadingIndicator />}

				{!this.state.isLoading && (
					<>
						<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5, marginTop: 5 }}>
							<TouchableOpacity style={{ backgroundColor: this.state.tab1.backgroundColor, height: 40, width: '30%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
								this.handleTab("1")
							}}>
								<Text style={{ fontSize: 15, color: this.state.tab1.color, alignSelf: 'center' }}>Triangle</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ backgroundColor: this.state.tab2.backgroundColor, height: 40, width: '30%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
								this.handleTab("2")
							}}>
								<Text style={{ fontSize: 15, color: this.state.tab2.color, alignSelf: 'center' }}>Table</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ backgroundColor: this.state.tab3.backgroundColor, height: 40, width: '30%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
								this.handleTab("3")
							}}>
								<Text style={{ fontSize: 15, color: this.state.tab3.color, alignSelf: 'center' }}>Result</Text>
							</TouchableOpacity>
						</View>
						{/* <Text style={{marginTop:50}}>{JSON.stringify(this.state.peakSummary)}</Text> */}

						{this.state.active === "1" && <ScrollView horizontal={true} >
							<View style={{ marginVertical: 30, alignSelf: 'center' }}>
								{this.state.array.map((item, i) => (
									<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
										{item.map((e, index) => (<TouchableOpacity style={{
											borderWidth: 1, borderColor: '#bcbcbc', height: 20, width: 25
											, justifyContent: 'center', backgroundColor: e.yes
										}} onPress={() => {
											Alert.alert(e.code, instruction[i].node.instructions)

										}}>
											<Text style={{ alignSelf: 'center', fontSize: 9 }}>{e.code}</Text>
										</TouchableOpacity>))}
									</View>
								))}
								<View style={{ alignSelf: 'center', marginTop: 10, borderRadius: 10, }}>
									<View
										style={{
											height: 25, borderColor: '#bcbcbc', borderWidth: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5,
											width: "85%", flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center'
										}}>
										<Text style={{ alignSelf: 'center', textAlign: 'center', width: '33.3%', color: '#000' }}>Assessor Name</Text>
										<Text style={{ alignSelf: 'center', width: '33.3%', color: '#000' }}>Assessment Date</Text>
										<TouchableOpacity style={{ backgroundColor: '#ffffff', width: '33.3%' }}>
											<Text style={{ alignSelf: 'center', color: '#000' }}>color</Text>
										</TouchableOpacity>
									</View>

									<TouchableOpacity
										style={{
											height: 25, borderColor: '#bcbcbc', borderWidth: 1, width: "85%",
											flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center'
										}} onPress={() => {
											dtST = 0,
												this.setState({
													dateStatus: 0, filterDate:
														moment(outputDate).format("YYYY-MM-DD")
												}, () => {
													this.setFirstTriangleRows()
												})

										}}>
										<Text style={{ width: '33.3%', textAlign: 'center' }}>{this.state.assesor}</Text>
										<Text style={{ width: '33.3%' }}>{moment(outputDate).format("YYYY-MM-DD")}</Text>
										<TouchableOpacity style={{ backgroundColor: '#f7ff00', width: '33.3%' }}>
										</TouchableOpacity>
									</TouchableOpacity>

									{this.state.lastData.map((item, i) => {
										return (
											<TouchableOpacity style={{
												height: 25, borderColor: '#bcbcbc', borderWidth: 1, width: "85%",
												flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center'
											}} onPress={() => {
												this.setState({ dateStatus: (i), filterDate: item?.date }, () => {
													this.filterMethod()
												})
											}}>
												<Text style={{ width: '33.3%', textAlign: 'center' }}>{item?.user?.firstName}</Text>
												<Text style={{ width: '33.3%' }}>{item?.date}</Text>

												<TouchableOpacity style={{ backgroundColor: item?.color, width: '33.3%' }}>
												</TouchableOpacity>
											</TouchableOpacity>
										)
									})}
								</View>
								<View style={{
									borderWidth: 1,
									borderRadius: 5,
									margin: 3,
									marginTop: 10,
									padding: 10,
									borderColor: '#bcbcbc',
									width: Dimensions.get('screen').width * 0.85, alignSelf: 'center'


								}}>
									<View style={{ flexDirection: 'row', left: '5%' }}>
										<Text style={{ fontWeight: 'bold' }}>{"Learner : "}</Text>
										<Text style={{ fontWeight: '300' }}>{student.node.firstname + " " + student.node.lastname} {age}</Text>
									</View>
								</View>
								<View style={{
									borderWidth: 1,
									borderRadius: 5,
									margin: 3,
									marginTop: 10,
									padding: 10,
									borderColor: '#bcbcbc',
									width: Dimensions.get('screen').width * 0.85, alignSelf: 'center',
									flexDirection: 'row',
									justifyContent: 'space-evenly'

								}}>
									<Text style={{ left: '5%', fontWeight: 'bold' }}>{"Location : " + student?.node?.clinicLocation?.location}</Text>
									<Text style={{ left: '5%', fontWeight: 'bold' }}>{"Instructor(s) : "}</Text>
								</View>
							</View>
						</ScrollView>}

						{this.state.active === "2" && (
							<Container>
								<ScrollView>
									{this.renderTable()}
								</ScrollView>
								<Button
									onPress={() => {
										this.submit();
									}}
									isLoading={this.state.issaved}
									style={{ marginVertical: 10 }}
									labelButton={this.state.issaved === false ? "Save Report" : "Please wait ..."}
								/>
							</Container>
						)}

						{this.state.active === "3" && (
							<Container>
								<ScrollView>
									{this.state.summary &&
										Object.keys(this.state.summary).length > 0 &&
										this.getScoresContent()}
								</ScrollView>
								<Button
									onPress={() => {
										this.gotoHome();
									}}
									style={{ marginVertical: 10 }}
									labelButton="Go to Suggested Targets"
								/>
							</Container>
						)}
					</>
				)}
			</SafeAreaView>
		);
	}


}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
		paddingTop: 20,
		
		//  paddingHorizontal: 20,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	ageE:{fontSize:12,fontWeight:'bold'},
	pageHeading: {
		fontSize: 18,
		fontWeight: '300',
		flex: 1,
		textAlign: 'center',
	},
	formContainer: {
		marginTop: 30,
	},
	inputContainer: {
		marginVertical: 10,
	},
	legend: {
		fontSize: 20,
		fontWeight: '700',
	},
	column: {
		flex: 1, flexDirection: 'column'
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#D5D5D5',
		borderRadius: 10,
		marginTop: 10,
		padding: 10,
	},
	colors: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	buttonFilled: {
		marginTop: 20,
		padding: 20,
		borderRadius: 10,
		backgroundColor: '#3E7BFA',
		marginBottom: 40,
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'center',
	},
	TextInputStyleClass: {
		borderWidth: 1,
		borderColor: Color.gray,
		borderRadius: 5,
		backgroundColor: "#FFFFFF",
		height: 110,
		marginVertical: 5,
		paddingHorizontal: 10,
		textAlignVertical: 'top'
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
		width: '100%',
		height: 100,
		flex: 1,
		//  flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.05)',
		borderWidth: 0.5,
		marginVertical: 10,
		padding: 10,
		elevation: 5
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

});

const mapDispatchToProps = dispatch => ({
	dispatchSetToken: data => dispatch(setToken(data)),
	dispatchSetPeakPrograms: data => dispatch(setPeakPrograms(data)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PeakReport);
