import React, {Component} from 'react';

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
  Switch,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import PickerModal from '../../components/PickerModal';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Color from '../../utility/Color';
import ParentRequest from '../../constants/ParentRequest';
import {setToken} from '../../redux/actions';
import {getStr} from '../../../locales/Locale';
import MultiPickerModal from '../../components/MultiPickerModal';
import moment from 'moment/min/moment-with-locales';
import DateInput from '../../components/DateInput';

class BehaviourNewTemplateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,
      isSavingBehaviour: false,
      behaviourId: null,
      recordTypeId: null,
      behaviourDef: null,
      statusValue: null,
      antecedentManipulations: '',
      reactiveProcedures: '',

      errorBehaviourMessage: '',
      errorRecordingTypeMessage: '',
      errorStatusMessage: '',
      errorDescriptionMessage: '',
      errorEnvironmentMessage: '',
      errorMeasurementMessage: '',

      errorModalNameMessage: '',
      errorModalDescriptionMessage: '',

      behaviourNameList: [],
      statusList: [],
      environmentList: [],
      measurementList: [],
      behaviourDes: '',
      environmentValue: [],
      recordingValue: [],
      measurementValue: [],

      isShowModal: false,
      modalType: 'behaviour',
      dataText: '',
      descriptionText: '',
      isFromSession: false,

      reminders: [
        {
          time: moment().format('HH:mm:ss'),
          frequency: [],
          timesError: '',
          frequencyError: '',
        },
      ],

      daysArray: [
        {id: 'Sunday', label: 'Sunday'},
        {id: 'Monday', label: 'Monday'},
        {id: 'Tuesday', label: 'Tuesday'},
        {id: 'Wednesday', label: 'Wednesday'},
        {id: 'Thursday', label: 'Thursday'},
        {id: 'Friday', label: 'Friday'},
        {id: 'Saturday', label: 'Saturday'},
      ],

      isReminder: false,
      recordingOptions: [
        {id: 'FR', key: 'FR', label: 'Frequency And Rate'},
        {id: 'DR', key: 'DR', label: 'Duration'},
        {id: 'LT', key: 'LT', label: 'Latency'},
        {id: 'PI', key: 'PI', label: 'Partial Interval'},
        {id: 'WI', key: 'WI', label: 'Whole Interval'},
        {id: 'MT', key: 'MT', label: 'Momentary Time Sampling'},
      ],
    };

    this.studentId = this.props.route.params.studentId;
  }

  componentDidMount() {
    this.template = this.props.route.params.template;
    console.log('Template---------->', this.template);

    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.isFromSession
    ) {
      this.setState({isFromSession: this.props.route.params.isFromSession});
    }
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});

    // let variables = {
    // 	studentId: this.studentId
    // };

    // ParentRequest.fetchNewTemplateFields(variables).then((data) => {
    // 	console.log("fetchNewTemplateFields------->", data);

    // 	let behaviourNameList = data.data.getBehaviour.edges.map((item) => {
    // 		console.log("item==>",item.node.behaviorName);
    // 		return {
    // 			id: item.node.id,
    // 			label: item.node.behaviorName,
    // 		};
    // 	});

    // 	let statusList = data.data.getDecelStatus.map((item) => {
    // 		return {
    // 			id: item.id,
    // 			label: item.statusName,
    // 		};
    // 	});

    // 	let environmentList = data.data.getEnvironment.map((item) => {
    // 		return {
    // 			id: item.id,
    // 			label: item.name,
    // 		};
    // 	});

    // 	let measurementList = data.data.getBehaviourMeasurings.map((item) => {
    // 		return {
    // 			id: item.id,
    // 			label: item.measuringType,
    // 		};
    // 	});

    // 	let behaviourId = null;
    // 	let behaviourDef = null;
    // 	let behaviourDes = null;
    // 	let statusValue = null;
    // 	let environmentValue = [];
    // 	let measurementValue = [];
    // 	let antecedentManipulations = '';
    // 	let reactiveProcedures = '';
    // 	let isReminder = false;
    // 	let reminders = [];
    // 	let queryParams = {
    // 		studentId: this.studentId,
    // 		behaviorId: this.state.behaviourId,
    // 		behaviorType:this.state.recordingValue,
    // 		status: this.state.statusValue,
    // 		description: this.state.behaviourDes,
    // 		envs: this.state.environmentValue,
    // 		manipulations: this.state.antecedentManipulations,
    // 		procedures: this.state.reactiveProcedures,
    // 	};
    // 	console.log("template-------->",this.template);
    // 	if (this.template) {
    // 		behaviourId = this.template.node.behavior.id;
    // 		behaviourDef = this.template.node.behavior.behaviorName;
    // 		behaviourDes = this.template.node.behaviorDescription;
    // 		statusValue = this.template.node.status.id;
    // 		environmentValue = this.template.node.environment.edges.map((env) => {
    // 			return env.node.id;
    // 		});
    // 		measurementValue = this.template.node.measurments.edges.map((mes) => {
    // 			return mes.node.id;
    // 		});
    // 		antecedentManipulations = this.template.node.antecedentManipulations;
    // 		reactiveProcedures = this.template.node.reactiveProcedures;

    // 		isReminder = this.template.node.remainders.edges.length != 0 ? true : false,
    // 			reminders = this.template.node.remainders.edges.map((reminder) => {
    // 				return {
    // 					id: reminder.node.id,
    // 					time: reminder.node.time,
    // 					frequency: reminder.node.frequency.edges.map((freq) => {
    // 						return freq.node.name;
    // 					}),
    // 				}
    // 			});
    // 	} else {
    // 		console.log("inelse");
    // 		environmentValue = [];
    // 		measurementValue = ["RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ="];
    // 	}
    // 	console.log("--------->list",behaviourNameList);
    // 	this.setState({
    // 		behaviourNameList, statusList, environmentList, measurementList,
    // 		isLoading: false,
    // 		behaviourId, behaviourDef, behaviourDes, statusValue, environmentValue, measurementValue,
    // 		antecedentManipulations, reactiveProcedures,
    // 		isReminder, reminders
    // 	})
    // }).catch((error) => {
    // 	this.setState({ isLoading: false });
    // })
    let variables = {
      id: this.template,
    };
    let variablestudent = {
      studentId: this.studentId,
    };
    ParentRequest.getBehaviour(variablestudent).then((data) => {
      console.log('data===>', data.data.getBehaviour.edges);
      let behaviourNameList = data.data.getBehaviour.edges.map((item) => {
        console.log('item==>', item.node.behaviorName);
        return {
          id: item.node.id,
          label: item.node.behaviorName,
        };
      });
      this.setState({behaviourNameList}, () => console.log('list beh seted'));
    });
    ParentRequest.getDecelStatus(variablestudent).then((res) => {
      console.log('res===>', res.data);
      let statusList = res.data.getDecelStatus.map((item) => {
        return {
          id: item.id,
          label: item.statusName,
        };
      });
      this.setState({statusList}, () => console.log('Statuslist  seted'));
    });
    ParentRequest.getEnvironment().then((res) => {
      console.log('environment', res);
      let environmentList = res.data.getEnvironment.map((item) => {
        return {
          id: item.id,
          label: item.name,
        };
      });
      this.setState({
        environmentList,
      });
    });
    ParentRequest.getTemplateEnvironment({
      templates: this.template,
    }).then((resenv) => {
      let environ = resenv.data.getBehaviorTemplatesEnvironments.map((item) => {
        console.log('--->', item.environments);
        let env = item.environments.map((item) => {
          return item.id;
        });
        console.log('envid', ...env);
        return [...env];
      });
      console.log('resenv--------->', [].concat.apply([], environ));
      this.setState(
        {
          environmentValue: [].concat.apply([], environ),
        },
        () => console.log('env seted'),
      );
    });
    let behaviourId = null;
    let behaviorDef = null;
    let recordingValue = [];
    let statusValue = null;
    let behaviourDes = null;
    let antecedentManipulations = '';
    let reactiveProcedures = '';
    let isReminder = false;
    let reminders = [];

    ParentRequest.getBehaviorTemplateDetails(variables)
      .then((data) => {
        behaviourId = data.data.getBehaviorTemplateDetails.behavior.id;
        console.log(
          'fetchNewTemplatedetails------->',
          data.data.getBehaviorTemplateDetails.reminders,
        );
        behaviorDef =
          data.data.getBehaviorTemplateDetails.behavior.behaviorName;

        recordingValue = data.data.getBehaviorTemplateDetails.behaviorType;

        statusValue = data.data.getBehaviorTemplateDetails.status.id;
        behaviourDes = data.data.getBehaviorTemplateDetails.description;
        antecedentManipulations =
          data.data.getBehaviorTemplateDetails.antecedentManipulation;
        reactiveProcedures =
          data.data.getBehaviorTemplateDetails.reactiveProcedures;

        isReminder =
          data.data.getBehaviorTemplateDetails.reminders.edges.length != 0
            ? true
            : false;

        reminders = data.data.getBehaviorTemplateDetails.reminders.edges.map(
          (reminder) => {
            return {
              id: reminder.node.id,
              time: reminder.node.time,
              frequency: reminder.node.frequency.edges.map((freq) => {
                return freq.node.name;
              }),
            };
          },
        );
        recordingValue = JSON.parse(recordingValue.replace(/'/g, '"'));
        console.log('*****', recordingValue);
        this.setState(
          {
            behaviourId,
            recordingValue,
            statusValue,
            behaviourDes,
            antecedentManipulations,
            reactiveProcedures,
            isReminder,
            reminders,
            isLoading: false,
          },
          () => {
            console.log(
              'setted---->',
              behaviourId,
              recordingValue,
              statusValue,
              behaviourDes,
              antecedentManipulations,
              reactiveProcedures,
            );
          },
        );

        // let behaviourId = null;
        // let behaviourDef = null;
        // let behaviourDes = null;
        // let statusValue = null;
        // let environmentValue = [];
        // let measurementValue = [];
        // let antecedentManipulations = '';
        // let reactiveProcedures = '';
        // let isReminder = false;
        // let reminders = [];
        //
        // console.log("template-------->",this.template);
        //behaviourId = this.template.node.behavior.id;
        // 	behaviourDef = this.template.node.behavior.behaviorName;
        // 	behaviourDes = this.template.node.behaviorDescription;
        // 	statusValue = this.template.node.status.id;
        // 	environmentValue = this.template.node.environment.edges.map((env) => {
        // 		return env.node.id;
        // 	});
        // 	measurementValue = this.template.node.measurments.edges.map((mes) => {
        // 		return mes.node.id;
        // 	});
        // 	antecedentManipulations = this.template.node.antecedentManipulations;
        // 	reactiveProcedures = this.template.node.reactiveProcedures;

        // 	isReminder = this.template.node.remainders.edges.length != 0 ? true : false,
        // 		reminders = this.template.node.remainders.edges.map((reminder) => {
        // 			return {
        // 				id: reminder.node.id,
        // 				time: reminder.node.time,
        // 				frequency: reminder.node.frequency.edges.map((freq) => {
        // 					return freq.node.name;
        // 				}),
        // 			}
        // 		});
        // } else {
        // 	console.log("inelse");
        // 	environmentValue = [];
        // 	measurementValue = ["RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ="];
        // }
        // console.log("--------->list",behaviourNameList);
      })
      .catch((error) => {
        this.setState({isLoading: false});
      });
  }

  _handleEnvironment(id, index) {
    let environmentValue = this.state.environmentValue;
    environmentValue[index] = id;
    this.setState({environmentValue});
  }

  _handleMeasurement(id, index) {
    let measurementValue = this.state.measurementValue;
    measurementValue[index] = id;
    this.setState({measurementValue});
  }

  validateForm() {
    this.setState({
      errorBehaviourMessage: '',
      errorStatusMessage: '',
      errorDescriptionMessage: '',
      errorEnvironmentMessage: '',
      errorMeasurementMessage: '',
    });

    let anyError = false;
    if (this.state.behaviourId == null) {
      this.setState({
        errorBehaviourMessage: getStr('BegaviourData.Pleasechoose'),
      });
      anyError = true;
    }

    if (this.state.statusValue == null) {
      this.setState({errorStatusMessage: getStr('BegaviourData.PleaseStatus')});
      anyError = true;
    }

    // if (this.state.behaviourDes == '') {
    //   this.setState({errorDescriptionMessage: 'Please fill the description'});
    //   anyError = true;
    // }

    // if (this.state.environmentValue[0] == null) {
    //   this.setState({errorEnvironmentMessage: 'Please choose Environment'});
    //   anyError = true;
    // }

    /*if (this.state.measurementValue[0] == null) {
			this.setState({ errorMeasurementMessage: 'Please choose Measurement' });
			anyError = true;
		}*/

    return anyError;
  }

  saveTemplate() {
    console.log("Saving Template ....")
    console.log(this.validateForm())
    if (this.validateForm()) {
      return;
    }

    this.setState({isSaving: true});
    let queryParams = {
      studentId: this.studentId,
      behaviorId: this.state.behaviourId,
      behaviorType: this.state.recordingValue,
      status: this.state.statusValue,
      description: this.state.behaviourDes,
      // envs: this.state.environmentValue,
      manipulation: this.state.antecedentManipulations,
      procedures: this.state.reactiveProcedures,
    };
    console.log('reminder state----->', this.state.isReminder);
    if (this.state.isReminder) {
      queryParams.reminders = this.state.reminders.map((item) => {
        if (this.template) {
          return {
            id: item.id,
            time: moment(item.time, 'HH:mm:ss')
              .local()
              .utc()
              .format('HH:mm:ss'),
            frequency: item.frequency,
          };
        } else {
          return {
            time: moment(item.time, 'HH:mm:ss')
              .local()
              .utc()
              .format('HH:mm:ss'),
            frequency: item.frequency,
          };
        }
      });
    } else {
      queryParams.reminders = [];
    }

    let promise = null;
    if (this.template) {
      //Update template
      console.log('nodeid---->', this.template);
      queryParams.tempId = this.template;
      console.log('Params To update templete', queryParams);
      promise = ParentRequest.updateTemplate(queryParams);
    } else {
      //new template
      console.log('Params To create templete------>', queryParams);
      promise = ParentRequest.createNewTemplate(queryParams);
    }

    promise
      .then((data) => {
        Alert.alert('Information', 'New Template Successfully Saved.');

        this.setState({isSaving: false});

        if (OrientationHelper.getDeviceOrientation() == 'portrait') {
          let parent = this.props.route.params.parent;
          this.props.navigation.goBack();

          setTimeout(() => {
            if (parent) {
              parent.getData();
            }
          }, 500);
        } else {
          this.props.setScreenMode('list');
        }
      })
      .catch((err) => {
        console.log('Error', JSON.parse(JSON.stringify(err)));
        Alert.alert('Information', err.toString());
        this.setState({isSaving: false});
      });
  }

  showModal(modalType) {
    this.setState({
      isShowModal: true,
      modalType,
      dataText: '',
    });
  }

  saveBehaviour() {
    this.setState({
      errorModalNameMessage: '',
    });

    if (this.state.dataText == '') {
      this.setState({errorModalNameMessage: 'Please fill name'});
      return;
    }

    this.setState({isSavingBehaviour: true});

    let variables = {
      studentId: this.studentId,
      name: this.state.dataText,
    };
    ParentRequest.createBehaviourData(variables)
      .then((result) => {
        this.setState({
          isSavingBehaviour: false,
          isShowModal: false,
        });

        this.getData();
      })
      .catch((error) => {
        this.setState({
          isShowModal: false,
        });
      });
  }

  saveEnvironment() {
    this.setState({
      errorModalNameMessage: '',
      errorModalDescriptionMessage: '',
    });

    if (this.state.dataText == '') {
      this.setState({errorModalNameMessage: 'Please fill name'});
      return;
    }

    if (this.state.descriptionText == '') {
      this.setState({errorModalDescriptionMessage: 'Please fill description'});
      return;
    }

    this.setState({isSavingBehaviour: true});

    let variables = {
      studentId: this.studentId,
      name: this.state.dataText,
      description: this.state.descriptionText,
    };
    ParentRequest.createEnvironmentData(variables)
      .then((result) => {
        this.setState({
          isSavingBehaviour: false,
          isShowModal: false,
        });

        this.getData();
      })
      .catch((error) => {
        this.setState({
          isShowModal: false,
        });
      });
  }

  deleteTemplate() {
    Alert.alert(
      'Information',
      'Are you sure ?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            this.setState({isDeleting: true});

            let variables = {
              id: this.template,
            };
            ParentRequest.deleteTemplate(variables)
              .then((result) => {
                this.setState({
                  isDeleting: false,
                });

                if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                  let parent = this.props.route.params.parent;
                  this.props.navigation.goBack();

                  setTimeout(() => {
                    if (parent) {
                      parent.getData();
                    }
                  }, 500);
                } else {
                  this.props.setScreenMode('list');
                }
              })
              .catch((error) => {
                this.setState({
                  isDeleting: false,
                });
              });
          },
        },
      ],
      {cancelable: false},
    );
  }

  renderModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isShowModal}
        onRequestClose={() => {
          this.setState({isShowModal: false});
        }}>
        <TouchableOpacity
          style={styles.modalWrapper}
          activeOpacity={1}
          onPress={() => {
            this.setState({isShowModal: false});
          }}>
          <View style={styles.modalContent}>
            <TextInput
              label={'Enter ' + this.state.modalType + ' name :'}
              error={this.state.errorModalNameMessage}
              autoFocus={true}
              onChangeText={(dataText) => {
                this.setState({dataText});
              }}
              value={this.state.dataText}
            />

            {this.state.modalType == 'environment' && (
              <TextInput
                label="Description :"
                error={this.state.errorModalDescriptionMessage}
                onChangeText={(descriptionText) => {
                  this.setState({descriptionText});
                }}
                value={this.state.descriptionText}
              />
            )}

            <Button
              labelButton="Submit"
              isLoading={this.state.isSavingBehaviour}
              onPress={() => {
                if (this.state.modalType == 'environment') {
                  this.saveEnvironment();
                } else {
                  this.saveBehaviour();
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  renderContent() {
    console.log('------->recording--->', this.state.recordingValue);
    return (
      <>
        <ScrollView>
          <PickerModal
            label={getStr('BegaviourData.SelectBehaviorName')}
            error={this.state.errorBehaviourMessage}
            placeholder={getStr('BegaviourData.SelectBehaviorName')}
            selectedValue={this.state.behaviourId}
            data={this.state.behaviourNameList}
            // type='dropdown'
            onValueChange={(value, itemIndex) => {
              this.setState({
                behaviourId: value,
                behaviourDef: this.state.behaviourNameList[itemIndex].label,
              });
            }}
            onAdded={() => {
              this.showModal('behaviour');
            }}
          />

          <MultiPickerModal
            label={getStr('BegaviourData.SelectRecordingType')}
            error={this.state.errorRecordingTypeMessage}
            placeholder={getStr('BegaviourData.SelectRecordingType')}
            data={this.state.recordingOptions}
            value={this.state.recordingValue}
            onSelect={(values) => {
              console.log('Values', values);
              this.setState({recordingValue: values});
            }}
          />
          <PickerModal
            label={getStr('BegaviourData.Status')}
            error={this.state.errorStatusMessage}
            selectedValue={this.state.statusValue}
            placeholder={getStr('BegaviourData.SelectStatus')}
            data={this.state.statusList}
            onValueChange={(statusValue, itemIndex) => {
              this.setState({statusValue});
            }}
          />

          <TextInput
            label={getStr('BegaviourData.BehaviorDescription')}
            error={this.state.errorDescriptionMessage}
            placeholder={getStr('BegaviourData.BehaviorDescription')}
            multiline={true}
            onChangeText={(behaviourDes) => {
              this.setState({behaviourDes});
            }}
            value={this.state.behaviourDes}
          />

          <TextInput
            label={getStr('BegaviourData.AntecedentManipulation')}
            multiline={true}
            placeholder={getStr('BegaviourData.AntecedentManipulation')}
            onChangeText={(antecedentManipulations) => {
              this.setState({antecedentManipulations});
            }}
            value={this.state.antecedentManipulations}
          />

          <TextInput
            label={getStr('BegaviourData.ReactiveProcedure')}
            error={this.state.errorDescriptionMessage}
            placeholder={getStr('BegaviourData.ReactiveProcedure')}
            multiline={true}
            onChangeText={(reactiveProcedures) => {
              this.setState({reactiveProcedures});
            }}
            value={this.state.reactiveProcedures}
          />

          {/* <MultiPickerModal
            label={getStr('BegaviourData.Environments')}
            error={this.state.errorEnvironmentMessage}
            placeholder={getStr('NewChanges.SelectEnvironment')}
            data={this.state.environmentList}
            value={this.state.environmentValue}
            onSelect={(values) => {
              console.log('Values', values);
              this.setState({environmentValue: values});
            }}
            onAdded={() => {
              this.showModal('environment');
            }}
          /> */}

          {/*<MultiPickerModal
						label="Measurements"
						error={this.state.errorMeasurementMessage}
						placeholder={getStr('NewChanges.SelectMeasurement')}
						data={this.state.measurementList}
						value={this.state.measurementValue}
						onSelect={(values) => {
							console.log("Values", values);
							this.setState({ measurementValue: values });
						}}
					/>*/}

          {/* {this.state.environmentValue.map((environment, key) => {
						if (key == 0) {
							return (
								<PickerModal
									key={key}
									label={getStr('BegaviourData.Environments')}
									error={this.state.errorEnvironmentMessage}
									selectedValue={environment}
									placeholder={getStr('NewChanges.SelectEnvironment')}
									data={this.state.environmentList}
									// type='dropdown'
									onValueChange={(envVal, itemIndex) => {
										this._handleEnvironment(envVal, 0)
									}}
									onRemoved={() => {
										let environmentList = this.state.environmentList;
										environmentList.pop();
										this.setState({ environmentList })
									}}
									onAdded={() => {
										// let environmentList = this.state.environmentList;
										// environmentList.push(null);
										// this.setState({ environmentList })
										this.showModal('environment');
									}}
								/>
							);
						} else {
							return (
								<PickerModal
									key={key}
									selectedValue={environment}
									placeholder={getStr('NewChanges.SelectEnvironment')}
									data={this.state.environmentList}
									// type='dropdown'
									onValueChange={(envVal, itemIndex) => {
										this._handleEnvironment(envVal, key)
									}}
								/>
							);
						}
					})}

					{this.state.measurementValue.map((measurement, key) => {
						if (key == 0) {
							return (
								<PickerModal
									key={key}
									label="Measurements"
									error={this.state.errorMeasurementMessage}
									selectedValue={measurement}
									placeholder={getStr('NewChanges.SelectMeasurement')}
									data={this.state.measurementList}
									// type='dropdown'
									onValueChange={(envVal, itemIndex) => {
										this._handleMeasurement(envVal, 0)
									}}
									onRemoved={() => {
										let environmentList = this.state.environmentList;
										environmentList.pop();
										this.setState({ environmentList })
									}}
								// onAdded={() => {
								// 	let environmentList = this.state.environmentList;
								// 	environmentList.push(null);
								// 	this.setState({ environmentList })
								// }}
								/>
							);
						} else {
							return (
								<PickerModal
									key={key}
									selectedValue={measurement}
									placeholder='Select Measurement'
									data={this.state.measurementList}
									// type='dropdown'
									onValueChange={(envVal, itemIndex) => {
										this._handleMeasurement(envVal, key)
									}}
								/>
							);
						}
					})} */}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text style={styles.reminderTitle}>
                {getStr('TargetAllocate.Reminder')}
              </Text>
              <Text style={styles.reminderSubtitle}>
                {getStr('TargetAllocate.ReminderForBehaviourData')}
              </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Switch
                trackColor={{false: Color.gray, true: Color.gray}}
                thumbColor={
                  this.state.isReminder ? Color.primary : Color.grayDarkFill
                }
                ios_backgroundColor={Color.gray}
                onValueChange={() => {
                  this.setState({isReminder: !this.state.isReminder});
                }}
                value={this.state.isReminder}
              />
            </View>
          </View>

          {this.state.isReminder && (
            <>
              <Row>
                <Column></Column>
                <Column style={{flex: 0, width: 120}}>
                  <Button
                    theme="secondary"
                    style={{height: 42}}
                    labelButton="Add"
                    onPress={() => {
                      let reminders = this.state.reminders;
                      reminders.push({
                        time: moment().format('HH:mm:ss'),
                        frequency: [],
                        timesError: '',
                        frequencyError: '',
                      });
                      this.setState({reminders});
                    }}
                  />
                </Column>
              </Row>
              {this.state.reminders.map((reminder, key) => {
                return (
                  <View key={key}>
                    <Row>
                      <Column style={{flex: 0, width: 120}}>
                        {reminder.timesError != '' && (
                          <Text style={{color: Color.danger}}>
                            {reminder.timesError}
                          </Text>
                        )}
                      </Column>
                      <Column>
                        {reminder.frequencyError != '' && (
                          <Text style={{color: Color.danger}}>
                            {reminder.frequencyError}
                          </Text>
                        )}
                      </Column>
                      <Column style={{flex: 0, width: 50}}></Column>
                    </Row>
                    <Row>
                      <Column style={{flex: 0, width: 120}}>
                        <DateInput
                          mode="time"
                          format="HH:mm:ss"
                          displayFormat="hh:mm A"
                          value={reminder.time}
                          onChange={(time) => {
                            let reminders = this.state.reminders;
                            reminders[key].time = time;
                            this.setState({reminders});
                          }}
                        />
                      </Column>
                      <Column>
                        <MultiPickerModal
                          data={this.state.daysArray}
                          value={reminder.frequency}
                          onSelect={(values) => {
                            console.log('On select', values);
                            let reminders = this.state.reminders;
                            reminders[key].frequency = values;
                            this.setState({reminders});
                          }}
                        />
                      </Column>
                      <Column style={{flex: 0, width: 50}}>
                        <Button
                          theme="danger"
                          style={{height: 42, marginTop: 10}}
                          labelButton={
                            <MaterialCommunityIcons
                              name="minus"
                              size={30}
                              color={Color.danger}
                            />
                          }
                          onPress={() => {
                            let reminders = this.state.reminders;
                            reminders.splice(key, 1);
                            this.setState({reminders});
                          }}
                        />
                      </Column>
                    </Row>
                  </View>
                );
              })}
            </>
          )}

          <View style={{height: 30}} />
        </ScrollView>
        {OrientationHelper.getDeviceOrientation() == 'portrait' &&
          !this.template && (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                backgroundColor: '#fff',
                borderRadius: 50,
                alignSelf: 'center',
                margin: 10,
              }}
              isLoading={this.state.isSaving}
              onPress={() => {
                this.saveTemplate();
              }}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                color={Color.primary}
              />
            </TouchableOpacity>
          )}
        {OrientationHelper.getDeviceOrientation() == 'portrait' &&
          this.template && (
            <Button
              labelButton={getStr('BegaviourData.SaveTemplate')}
              style={{marginBottom: 10}}
              isLoading={this.state.isSaving}
              onPress={() => {
                this.saveTemplate();
              }}
            />
          )}
        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
          <Button
            labelButton={getStr('BegaviourData.SaveTemplate')}
            style={{marginBottom: 10}}
            isLoading={this.state.isSaving}
            onPress={() => {
              this.saveTemplate();
            }}
          />
        )}

        {this.template && (
          <Button
            labelButton={getStr('NewChanges.DeleteTemplate')}
            theme="danger"
            style={{marginBottom: 10}}
            isLoading={this.state.isDeleting}
            onPress={() => {
              this.deleteTemplate();
            }}
          />
        )}

        {this.renderModal()}
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {!this.state.isFromSession && (
          <NavigationHeader
            enable={this.props.disableNavigation != true}
            backPress={() => this.props.navigation.goBack()}
            title={
              this.template
                ? getStr('NewChanges.EditBehaviorTemplate')
                : getStr('NewChanges.NewBehaviorTemplate')
            }
            disabledTitle
          />
        )}

        <Container enablePadding={this.props.disableNavigation != true}>
          {this.state.isLoading && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
    flex: 1,
  },
  input: {
    width: 200,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  labelStyle: {
    color: Color.grayFill,
    fontSize: 14,
  },
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
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '80%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
  },
  rightIcon: {
    paddingVertical: 5,
    paddingHorizontal: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  textareaContainer: {
    height: 100,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    borderColor: Color.gray,
    borderWidth: 1,
  },
  textarea: {
    textAlignVertical: 'top',
    height: 90,
    fontSize: 14,
    color: '#333',
  },

  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Color.white,
    width: 300,
    borderRadius: 5,
    padding: 8,
  },
  modalTitle: {
    fontSize: 16,
    color: '#000',
  },
  modalInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.gray,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  reminderTitle: {
    fontSize: 15,
  },
  reminderSubtitle: {
    fontSize: 12,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourNewTemplateScreen);
