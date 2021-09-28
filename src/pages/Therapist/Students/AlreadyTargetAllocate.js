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
	ActivityIndicator,
	Modal,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	Animated,
	Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import { therapistGetLongTermGoals } from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';
import TargetAllocateNew from './TargetAllocateNew.js';
import { getStr } from '../../../../locales/Locale';
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import SimpleModal from '../../../components/SimpleModal'

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const KEYS_TO_FILTERS = ['node.targetMain.targetName'];
class AlreadyTargetAllocate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			shortTermGoalId: '',
			targets: [],
			searchTarget: '',
			student: {},
			program: {},
			animation: new Animated.Value(0),
			domainList: [],
			showSearchFilter: false,
			isFilterOpened: false,
			domainDropdownList: [],
			targetAreaDropdownList: [],
			selectedDomain: '',
			selectedTargetArea: '',
			noDataText: '',
			alreadyAllocated: [],
			newPageParams: null,
			studentNew: {},
			isShowDomainModal: false,
			isChart: false,
			programs: [],
			selectedProgram: {}
		};
	}

	_refresh() {
		this.componentDidMount();
	}

	searchUpdated(term) {
		this.setState({ searchTarget: term });
	}

	componentDidMount() {
		console.log("props already allocated target 86", this.props)
		TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
		let program = this.props.route.params.program;
		let student = this.props.route.params.student;
		let shortTermGoalId = this.props.route.params.shortTermGoalId;
		let studentNew = this.props.route.params.studentNew;

		this.setState(
			{ student: student, program: program, shortTermGoalId: shortTermGoalId, studentNew: studentNew },
			() => {
				console.log('student Id in Alloctae new target x -->' + JSON.stringify(this.state.student))
				this.fetchTargets();
			},
		);
		this.getAlreadyAllocatedTargets();
	}

	getAlreadyAllocatedTargets() {
		const { student } = this.props.route.params;
		let v = {
			student: student
		}
		TherapistRequest.alreadyAllocatedTargetsForStudent(v).then(result => {
			console.log("Already-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*", result);
			this.setState({
				alreadyAllocated: result.data.targetAllocates.edges
			});
		}).catch(error => console.log(error));
	}

	fetchTargets() {
		console.log('student in already allocte -*/*/*/**/*/*/*/->' + JSON.stringify(this.state.student))
		this.setState({ isLoading: true, targets: [], noDataText: '' });
		let variables = {
			shortTerm: this.state.shortTermGoalId,
		};
		console.log("target allocation variablea===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-", variables)
		TherapistRequest.getAllocateTargets(variables).then(targetsData => {
			this.setState({ isLoading: false });

			let targets = targetsData ?.data ?.targetAllocates ?.edges;
			console.log("Targets/////////////////\\\\\\\\\\\\\\\\", targets);
			if (targets) {
				this.setState({ targets });
			}
		}).catch(error => {
			console.log('fetchTargets error:' + JSON.stringify(error));
			this.setState({ isLoading: false });
		});
	}

	getTargetView(target, index) {
		const { alreadyAllocated } = this.state;
		let backgroundColor = Color.white;
		let titleColor = Color.black;
		let subtitleColor = '#999';
		if (this.state.newPageParams) {
			// // debugger;
			if (target.node.id == this.state.newPageParams.target[0].node.id) {
				backgroundColor = Color.primary;
				titleColor = Color.white;
				subtitleColor = Color.white;
			}
		}
		for (let x = 0; x < alreadyAllocated.length; x++) {
			if (target ?.node ?.targetMain ?.targetName === alreadyAllocated[x].node.targetAllcatedDetails.targetName) {
				backgroundColor = Color.red;
				break;
			}
		}
		return (
			<TouchableOpacity
				style={[styles.card, { backgroundColor }]}
				key={index}
				onPress={() => {
					if (OrientationHelper.getDeviceOrientation() == 'portrait') {
						this.props.navigation.navigate('TargetStatusChange', {
							target: target,
							student: this.state.student,
							program: this.state.program,
							shortTermGoalId: this.state.shortTermGoalId,
							isAllocate: true,
						});
						//  Alert.alert(JSON.stringify(target?.node?.targetAllcatedDetails))
					} else {
						// this.setState({
						//   newPageParams: {
						//     target: target,
						//     student: this.state.student,
						//     program: this.state.program,
						//     shortTermGoalId: this.state.shortTermGoalId,
						//   },
						// });
						this.props.navigation.navigate('TargetStatusChange', {
							target: target,
							student: this.state.student,
							program: this.state.program,
							shortTermGoalId: this.state.shortTermGoalId,
							isAllocate: true,
						});
					}
				}}>
				{/* <Image
					style={styles.targetViewImage}
					source={require('../../../../android/img/Image.png')}
				/> */}
				{/* <Text>{JSON.stringify(target)}</Text> */}
				<Text style={[styles.targetViewTitle, { color: titleColor }]}>
					{target.node.targetAllcatedDetails.targetName}
				</Text>
				<Text style={[styles.targetViewDomain, { color: subtitleColor }]}>
					{target.node.targetStatus.statusName}
				</Text>
			</TouchableOpacity>
		);
	}

	showDomainFilterOption() {
		return (
			<>
				<View
					style={{
						marginVertical: 5,
						padding: 10,
						borderColor: '#ccc',
						borderWidth: 0.5,
					}}>
					<View style={{ marginBottom: 20 }}>
						<Text
							style={{
								width: '90%',
								fontWeight: 'bold',
								fontSize: 25,
								color: 'black',
							}}>
							{getStr('Therapy.SelectTargetAllocation')}
						</Text>
					</View>
					<View>
						<TouchableOpacity style={styles.targetVw} onPress={() => {
							this.props.navigation.navigate('TargetAllocate', {
								program: this.state.program,
								student: this.state.student,
								shortTermGoalId: this.state.shortTermGoalId,
								defaults: true,
							});
						}}>
							<Text
								style={{ width: '90%', textAlign: 'center', color: 'black' }}
							>
								{getStr('Therapy.ChoosefromLibrary')}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.targetVw, { marginTop: 10 }]}
							onPress={() => {
								// if (OrientationHelper.getDeviceOrientation() == 'portrait') {
								this.props.navigation.navigate('ManualTargetAllocationNew', {
									target: [],
									student: this.state.student,
									program: this.state.program,
									shortTermGoalId: this.state.shortTermGoalId,
									isAllocate: true,
									defaults: true,
								});
								// } else {
								//   this.setState({
								//     newPageParams: {
								//       target: this.state.targets,
								//       student: this.state.student,
								//       program: this.state.program,
								//       shortTermGoalId: this.state.shortTermGoalId,
								//     },
								//   });
								// }
							}}>
							<Text style={{ width: '90%', textAlign: 'center', color: 'black' }}>
								{getStr('Therapy.AddManually')}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.targetVw, { marginTop: 10 }]}
							onPress={() => {
								this.props.navigation.navigate('PeakEquSuggesTarget', {
									target: [],
									student: this.state.student,
									program: this.state.program,
									shortTermGoalId: this.state.shortTermGoalId,
									isAllocate: true,
									defaults: true,
								});
							}}>
							<Text style={{ width: '90%', textAlign: 'center', color: 'black' }}>
								Peak Equivalence Category
                  			</Text>
						</TouchableOpacity>
					</View>
				</View>
			</>
		);
	}

	renderList() {
		let { targets, noDataText } = this.state;
		const filteredTargets = targets.filter(
			createFilter(this.state.searchTarget, KEYS_TO_FILTERS),
		);
		filteredTargets.sort();

		return (
			<>
				{this.state.showSearchFilter && (
					<View style={styles.searchWrapper}>
						<MaterialCommunityIcons
							name="account-search-outline"
							size={24}
							color={Color.gray}
						/>
						<SearchInput
							onChangeText={term => {
								this.searchUpdated(term);
							}}
							style={styles.searchInput}
							placeholder="Search Targets"
						// clearIcon
						/>
					</View>
				)}

				{this.state.isLoading && <LoadingIndicator />}

				{!this.state.isLoading && (
					<ScrollView>
						{filteredTargets.length == 0 && <NoData>{noDataText}</NoData>}

						{filteredTargets.map((target, index) => {
							return this.getTargetView(target, index);
						})}
					</ScrollView>
				)}
			</>
		);
	}
/*
.########.....###....########..########.##....##.########
.##.....##...##.##...##.....##.##.......###...##....##...
.##.....##..##...##..##.....##.##.......####..##....##...
.########..##.....##.########..######...##.##.##....##...
.##........#########.##...##...##.......##..####....##...
.##........##.....##.##....##..##.......##...###....##...
.##........##.....##.##.....##.########.##....##....##...
*/ 
	renderRightMenu() {
		var { navigate } = this.props.navigation;
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity
					// style={{ paddingHorizontal: 10 }}
					onPress={() => {
						{
							store.getState().user.userType.name == 'parents' ?
							this.setState({isChart: true})
								
								 : this.setState({ isFilterOpened: !this.state.isFilterOpened });
						}

					}}>
					<MaterialCommunityIcons
						name="plus"
						size={30}
						color={Color.primary}
					/>
				</TouchableOpacity>
				{/*)}*/}
			</View>
		);
	}

	renderAllocationtargetModal = () => {
		console.log("selected program", this.state.selectedProgram)
		return (
			<SimpleModal
      style={{width: 350, height: 200, justifyContent: 'space-around', alignItems: 'center'}}
      // containerStyle={{backgroundColor: 'blue'}}
        visible={this.state.isChart}
        onRequestClose={() => {
          this.setState({isChart: false});
        }}>
					<Text>Direct Target Allocation</Text>
					 <TouchableOpacity style={[styles.targetVw, { width: width * 0.68, marginRight: 5, backgroundColor: '#275BFE' }]}
					  onPress={() => {
							this.setState({isChart: false})
							this.props.navigation.navigate('TargetAllocate', {
									program: this.state.program,
									student: this ?.state ?.studentNew,
									shortTermGoalId: this ?.state ?.shortTermGoalId,
									defaults: false,
									fromParent: true,
									newPrograms: this.props.route.params.domain,
									studentNew: this.state.studentNew
								})
								// this.props.navigation.navigate('TargetAllocate', {
								// 	program: this.state.program,
								// 	student: this.state.student,
								// 	shortTermGoalId: shortTermGoals[0]?.id,
								// 	defaults: false,
								// });
          }}
					>
            <Text
              style={{ width: '90%', textAlign: 'center', color: '#fff' }}
            >
              {getStr('Therapy.ChoosefromLibrary')}
            </Text>
          </TouchableOpacity>
					<TouchableOpacity
            style={[styles.targetVw, { width: width * 0.68, marginRight: 5, backgroundColor: '#FF1A7A' }]}
            onPress={() => {
							this.setState({isChart: false})
								this.props.navigation.navigate('ManualTargetAllocationNew', {
									program: this ?.state ?.program,
									student: this ?.state ?.student,
									shortTermGoalId: this ?.state ?.shortTermGoalId,
									studentNew: this.state.studentNew,
									isAllocate: true,
									defaults: false
								})
            }}
						>
            <Text style={{ width: '90%', textAlign: 'center', color: '#fff' }}>
              {getStr('Therapy.AddManually')}
            </Text>
          </TouchableOpacity>
				</SimpleModal>
		)
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					backPress={() => this.props.navigation.goBack()}
					title={getStr('Therapy.AlreadyAllocateTarget')}
					customRightMenu={this.renderRightMenu()}
				/>

				<Container>
					{OrientationHelper.getDeviceOrientation() == 'portrait' && (
						<>
							{this.state.isFilterOpened && this.showDomainFilterOption()}
							{this.renderList()}
						</>
					)}
					{OrientationHelper.getDeviceOrientation() == 'landscape' && (
						<Row style={{ flex: 1 }}>
							<Column>
								{this.state.isFilterOpened && this.showDomainFilterOption()}
								{this.renderList()}
							</Column>
							<Column style={{ flex: 2, paddingTop: 10 }}>
								{this.state.newPageParams && (
									<TargetAllocateNew
										disableNavigation
										route={{ params: this.state.newPageParams }}
										navigation={this.props.navigation}
									/>
								)}
							</Column>
						</Row>
					)}
				</Container>
					{this.renderAllocationtargetModal()}
			</SafeAreaView>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.white,
	},
	searchWrapper: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		alignItems: 'center',
		height: 40,
		marginVertical: 10,
		backgroundColor: Color.grayWhite,
	},
	card: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		borderRadius: 5,
		margin: 3,
		marginTop: 10,
		padding: 10,
	},

	targetViewImage: {
		width: '100%',
		height: 200,
		borderRadius: 5,
	},
	targetViewTitle: {
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '500',
		fontSize: 14,
		color: '#45494E',
		paddingTop: 10,
	},
	targetViewDomain: {
		fontFamily: 'SF Pro Text',
		fontStyle: 'normal',
		fontWeight: '500',
		fontSize: 12,
		color: '#7480FF',
		paddingTop: 5,
	},
	modal: {
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.1)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: Color.white,
		width: 300,
	},
	targetVw: {
		height: 50,
		borderWidth: 1,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
const mapStateToProps = state => ({
	authResult: getAuthResult(state),

});

const mapDispatchToProps = dispatch => ({
	dispatchSetToken: data => dispatch(setToken(data)),
	dispatchSetTokenPayload: data => dispatch(setTokenPayload(data)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AlreadyTargetAllocate);
