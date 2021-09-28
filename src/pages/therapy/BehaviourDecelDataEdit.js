import React, { Component } from 'react';
import Textarea from 'react-native-textarea';

import {
	Text,
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Modal,
	Alert,
	TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { Row, Container, Column } from '../../components/GridSystem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeader from '../../components/NavigationHeader';
import PickerModal from '../../components/PickerModal';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import ParentRequest from '../../constants/ParentRequest';
import { setToken } from '../../redux/actions';
import NumericStepper from '../../components/NumericStepper';
import DateHelper from '../../helpers/DateHelper';
import {getStr} from '../../../locales/Locale';

class BehaviourDecelDataEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isSaving: false,
			frequency: 0,
			time: 0,
			duration: "00:00",

			//irt: 1,
			environments: [],
			selectedIntensity: null,
			selectedEnvironment: null,
			frequencies: [],

			timerStart: false
		};

		this.behavior = this.props.route.params.behavior;
		console.log("behavior", this.behavior);
	}

	componentDidMount() {
		//console.log("behavior", this.behavior);
		if (this.behavior && this.behavior.node.duration) {
			let time = this.behavior.node.duration;

			if (time.indexOf(":") != -1) {
				time = DateHelper.convertClockToSecond(time);
			}

			//convert from miliseconds
			time = Math.floor(time / 1000);

			let frequency = 0;
			this.behavior.node.frequency.edges.forEach((item) => {
				frequency = item.node.count;
			})

			let duration = DateHelper.convertSecondToClock(time);
			this.setState({
				frequency, time, duration
			});
		}

		ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
		ParentRequest.getEnvironment().then((result) => {
			console.log("getEnvironment", result);
			let environments = result.data.getEnvironment.map((item) => {
				return {
					id: item.id,
					label: item.name,
				};
			});

			this.setState({ environments }, () => {
				if (this.behavior) {
					this.setState({
						selectedEnvironment: this.behavior.node.environment ? this.behavior.node.environment.id : null,
						selectedIntensity: this.behavior.node.intensity,
					//	irt: this.behavior.node.irt,
					})
				}
			});
		}).catch((err) => {
			console.log("Err", err)
		})
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	updateTimer() {
		let time = this.state.time;
		time++;
		let duration = DateHelper.convertSecondToClock(time);
		this.setState({ duration, time });
	}

	updateData() {
		this.setState({ isSaving: true });
		let variables = {
			id: this.behavior.node.id,
		//	irt: this.state.irt,
			intensity: this.state.selectedIntensity,
			environment: this.state.selectedEnvironment,
			duration: this.state.time * 1000,
			frequency: this.state.frequencies,
		};
		console.log("Var", variables);
		ParentRequest.updateDecel(variables).then((res) => {
			this.setState({ isSaving: false });
			Alert.alert("Information", "Behavior Updated Successfully");
			console.log("updateDecel", res);
			if (this.props.disableNavigation) {
				let parent = this.props.parent;
				if (parent) {
					parent.getData();
				}
			} else {
				this.props.navigation.goBack();
			}
		}).catch((err) => {
			let errObj = JSON.parse(JSON.stringify(err));
			console.log("err", errObj);
			Alert.alert("Information", err.toString());
			this.setState({ isSaving: false });
		})
	}

	updateFrequency() {
		let variables = {
			pk: this.behavior.node.id,
			time: this.state.time,
			count: this.state.frequency,
		};
		console.log("Var", variables);
		ParentRequest.updateDecelFrequency(variables).then((res) => {
			console.log("updateDecelFrequency", res);
			let parent = this.props.route.params.parent;
			if (parent) {
				parent.getData();
			}
		}).catch((err) => {
			console.log("err", err);
			Alert.alert("Information", err.toString());
		})
	}

	continueTimer() {
		Alert.alert(
			'Information',
			'Are you sure want to start timer ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						this.timer = setInterval(() => {
							//console.log("Time trigger");
							this.updateTimer();
						}, 1000);

						this.setState({ timerStart: true });
					}
				},
			],
			{ cancelable: false }
		);
	}

	renderContent() {
		let { frequency, irt, selectedEnvironment, environments, selectedIntensity } = this.state;
		return (
			<>
				<ScrollView>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>

						</View>
						<View style={styles.durationWrapper}>
		<Text>{getStr("TargetAllocate.Duration")}</Text>
							<Text style={styles.durationText}>{this.state.duration}</Text>
						</View>
						<View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
							{!this.state.timerStart && (
								<TouchableOpacity onPress={() => {
									this.continueTimer();
								}}>
									<MaterialCommunityIcons name='pencil' size={25} color={Color.primary} />
								</TouchableOpacity>
							)}
						</View>
					</View>


					<NumericStepper title={`${getStr("TargetAllocate.Frequency")}:`} value={frequency}
						style={{ marginBottom: 10 }}
						onDecrease={() => {
							frequency -= 1;
							if (frequency < 0) {
								frequency = 0;
							}
							this.setState({ frequency }, () => {
								this.updateFrequency()
							});
						}}
						onIncrease={() => {
							frequency += 1;
							this.setState({ frequency }, () => {
								this.updateFrequency()
							});
						}} />

					{/* <NumericStepper title='IRT :' value={irt}
						onDecrease={() => {
							irt -= 1;
							if (irt < 0) {
								irt = 0;
							}
							this.setState({ irt });
						}}
						onIncrease={() => {
							irt += 1;
							this.setState({ irt });
						}} /> */}

					<PickerModal
						label={getStr("TargetAllocate.Environment")}
						placeholder={getStr("TargetAllocate.Select")}
						selectedValue={selectedEnvironment}
						data={environments}
						onValueChange={(itemValue, itemIndex) => {
							this.setState({ selectedEnvironment: itemValue });
						}}
					/>

					<PickerModal
						label={getStr("NewChanges.Intensity")}
						placeholder={getStr("TargetAllocate.Select")}
						selectedValue={selectedIntensity}
						data={[
							{ id: 'severe', label: getStr("NewChanges.Severe") },
							{ id: 'moderate', label: getStr("NewChanges.Moderate") },
							{ id: 'mild function', label: getStr("NewChanges.MildFunction") },
						]}
						onValueChange={(itemValue, itemIndex) => {
							this.setState({ selectedIntensity: itemValue });
						}}
					/>
				</ScrollView>

				<Button labelButton={getStr("MedicalData.SaveData")}
					style={{ marginBottom: 10 }}
					isLoading={this.state.isSaving}
					onPress={() => {
						this.updateData()
					}}
				/>
			</>
		);
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					enable={this.props.disableNavigation != true}
					backPress={() => {
						this.props.navigation.goBack();
					}}
					title={getStr("TargetAllocate.EditBehaviorData")}
					disabledTitle
				/>

				<Container enablePadding={this.props.disableNavigation != true}>
					{this.state.isLoading && (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<ActivityIndicator color={Color.primary} />
						</View>
					)}
					{this.state.isLoading == false && this.renderContent()}
				</Container>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	durationWrapper: {
		height: 100,
		justifyContent: 'center',
		alignItems: 'center'
	},
	durationText: {
		fontSize: 30,
		color: Color.black
	},
});

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BehaviourDecelDataEdit);
