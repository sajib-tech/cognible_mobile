import 'react-native-gesture-handler';
import React, {Component, useEffect, useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {Overlay, CheckBox} from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  View,
  Image,
  Dimensions,
  Text,
  TextInput as DTextInput,
  Switch,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment/min/moment-with-locales';
import {client, getSeverityTypes} from '../../constants/index';
import DateHelper from '../../helpers/DateHelper';
import store from '../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../redux/reducers/index';
import {setToken} from '../../redux/actions/index';
import ParentRequest from '../../constants/ParentRequest';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import PickerModal from '../../components/PickerModal';
import Color from '../../utility/Color';
import DateInput from '../../components/DateInput';
import TextInput from '../../components/TextInput';
import {getStr} from '../../../locales/Locale';
import MultiPickerModal from '../../components/MultiPickerModal';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class AddNewMedication extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      showLoading: false,
      severityTypeOptions: [{label: 'Select Severity', value: ''}],
      severityTypeValue: '',
      severityTypeError: '',

      date: moment().format('YYYY-MM-DD'),
      medicalCondition: '',
      medicalConditionError: '',
      medicineDetails: '',
      medicineDetailsError: '',
      dosage: '',
      dosageError: '',
      howOftenTaken: '',
      howOftenTakenError: '',
      note: '',
      show: false,
      startDate: moment().format('YYYY-MM-DD'),
      isStartDateSelected: false,
      startDateError: '',
      endDate: moment().format('YYYY-MM-DD'),
      endDateError: '',
      displayedDate: moment(),

      reminders: [
        {
          time: moment().format('HH:mm:ss'),
          frequency: [],
          timesError: '',
          frequencyError: '',
        },
      ],

      drugs: [
        {
          drugName: '',
          times: '1',
          dosage: '1',
          drugNameError: '',
          timesError: '',
          dosageError: '',
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

      minimumDate: new Date(),
      date: moment().format('YYYY-MM-DD'),
    };
    console.log(JSON.stringify(this.state));
    this.saveNewMedical = this.saveNewMedical.bind(this);
    this.medication = this.props.route.params.medication;
  }

  componentDidMount() {
    console.log('Medication', this.medication);
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getSeverityType();
  }

  getSeverityType() {
    client
      .query({
        query: getSeverityTypes,
      })
      .then((result) => {
        return result.data;
      })
      .then((data) => {
        let severityTypeOptions = [];
        data.getSeverity.map((element) =>
          severityTypeOptions.push({label: element.name, value: element.id}),
        );

        if (this.medication) {
          let {node} = this.medication;
          this.setState({
            medicalCondition: node.condition,
            date: node.date,
            startDate: node.startDate,
            endDate: node.endDate,
            severityTypeValue: node.severity.id,
            severityTypeOptions,
            drugs: node.drug.edges.map((drug) => {
              return {
                drugName: drug.node.drugName,
                dosage: drug.node.dosage + '',
                times: drug.node.times + '',
              };
            }),
            note: node.note,
            reminders: node.remainders.edges.map((reminder) => {
              return {
                id: reminder.node.id,
                time: reminder.node.time,
                frequency: reminder.node.frequency.edges.map((freq) => {
                  return freq.node.name;
                }),
              };
            }),
            isReminder: node.remainders.edges.length != 0 ? true : false,
          });
        } else {
          this.setState({severityTypeOptions});
        }
      });
  }

  isFormInValid() {
    let isError = false;
    if (this.state.severityTypeValue === '') {
      this.setState({severityTypeError: getStr('MedicalData.SelectSeverity')});
      isError = true;
    } else {
      this.setState({severityTypeError: ''});
    }
    if (this.state.startDate === 'Start Date') {
      this.setState({startDateError: getStr('MedicalData.selectDate')});
      isError = true;
    } else {
      this.setState({startDateError: ''});
    }
    if (this.state.endDate === 'End Date') {
      this.setState({endDateError: getStr('MedicalData.Selectenddate')});
      isError = true;
    } else {
      this.setState({endDateError: ''});
    }
    if (this.state.medicalCondition === '') {
      this.setState({medicalConditionError: getStr('MedicalData.Pleaseenter')});
      isError = true;
    } else {
      this.setState({medicalConditionError: ''});
    }

    let drugs = this.state.drugs;
    drugs.forEach((drug, key) => {
      if (drug.drugName == '') {
        drugs[key].drugNameError = getStr('MedicalData.pleaseDetail');
        isError = true;
      }
      if (drug.dosage == '') {
        drugs[key].dosageError = getStr('MedicalData.SpecifyDosage');
        isError = true;
      }
      if (drug.times == '') {
        drugs[key].timesError = getStr('MedicalData.Specifythisvalue');
        isError = true;
      }
    });

    let reminders = this.state.reminders;
    if (this.state.isReminder) {
      reminders.forEach((reminder, key) => {
        if (reminder.time == '') {
          reminders[key].timesError = getStr('MedicalData.Specifythisvalue');
          isError = true;
        }
        if (reminder.frequency == '') {
          reminders[key].frequencyError = getStr(
            'MedicalData.Specifythisvalue',
          );
          isError = true;
        }
      });
    }

    console.log({isError});

    this.setState({drugs, reminders});

    return isError;
  }

  clearForm() {
    this.setState({
      medicalCondition: '',
      startDate: 'Start Date',
      endDate: 'End Date',
      severityTypeValue: '',
      medicineDetails: '',
      dosage: '',
      howOftenTaken: '',
      note: '',
      daysSelected1: 'Select days',
    });
  }

  saveNewMedical() {
    if (this.isFormInValid()) {
      console.log('yes, form is Not valid');
      return;
    }
    this.setState({showLoading: true});
    // let { addMedicalItem, data } = this.props
    let studentId = this.props.route.params.studentId;

    let queryParams = {
      studentId: studentId,
      date: this.state.date,
      condition: this.state.medicalCondition,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      note: this.state.note,
      severity: this.state.severityTypeValue,
      drug: this.state.drugs.map((drug) => {
        return {
          drugName: drug.drugName,
          times: parseInt(drug.times),
          dosage: drug.dosage,
        };
      }),
      lastObservedDate: moment().format('YYYY-MM-DD'),
    };

    if (this.state.isReminder) {
      // queryParams.remainders = this.state.reminders.map((item) => {
      // 	return {
      // 		time: item.time,
      // 		frequency: item.frequency.join(",")
      // 	};
      // });
      queryParams.remainders = this.state.reminders.map((item) => {
        if (this.medication) {
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
    }
    else{
      queryParams.remainders=[]
    }


    let promise = null;
    if (this.medication) {
      //update
      queryParams.id = this.medication.node.id;
      queryParams.lastObservedDate = moment().format('YYYY-MM-DD');
      promise = ParentRequest.updateMedical(queryParams);
    } else {
      promise = ParentRequest.addNewMedical(queryParams);
    }

    console.log('Vars', queryParams);

    promise
      .then((newMedicalData) => {
        console.log('SaveMedicalData', newMedicalData);
        this.setState({showLoading: false});

        Alert.alert(
          'Information',
          'Data Successfully Saved',
          [
            {
              text: getStr('MedicalData.OK'),
              onPress: () => {
                this.clearForm();
                if (this.props.disableNavigation) {
                } else {
                  this.props.navigation.goBack();
                }

                setTimeout(() => {
                  let parent = this.props.route.params.parent;
                  if (parent) {
                    parent.getData();
                  }
                }, 500);
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((error) => {
        console.log('Error', JSON.parse(JSON.stringify(error)));
        this.setState({isSaving: false, showLoading: false});

        Alert.alert('Information', error.toString());
      });
  }

  displayCurrentDateTime() {
    return (
      <View flexDirection="row">
        <View style={{width: '46%', marginRight: 20}}>
          <DateInput
            format="YYYY-MM-DD"
            displayFormat="DD MMM YYYY"
            value={this.state.date}
            onChange={(date) => {
              this.setState({date});
            }}
          />
        </View>
        <View style={{width: '46%', marginRight: 20}}>
          <DateInput
            format="HH:mm"
            mode="time"
            displayFormat="hh:mm A"
            value={this.state.time_start}
            onChange={(time_start) => {
              this.setState({time_start});
            }}
          />
        </View>
      </View>
    );
  }

  deleteMedical() {
    Alert.alert(
      'Information',
      'Are you sure want to delete this data ?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            let variables = {
              id: this.medication.node.id,
            };
            ParentRequest.deleteMedical(variables)
              .then((result) => {
                Alert.alert('Information', 'Delete medical data successfully.');

                if (this.props.disableNavigation) {
                } else {
                  this.props.navigation.goBack();
                }

                setTimeout(() => {
                  let parent = this.props.route.params.parent;
                  if (parent) {
                    parent.getData();
                  }
                }, 500);
              })
              .catch((error) => {
                Alert.alert('Information', error.toString());
              });
          },
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    const {isVisible1} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={
            this.medication
              ? getStr('NewUpdated.UpdateMedicalData')
              : getStr('MedicalData.NewMedicalData')
          }
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            {/*{this.displayCurrentDateTime()}*/}

            <TextInput
              label={getStr('MedicalData.MedicalCondition')}
              placeholder={getStr('MedicalData.MedicalCondition')}
              error={this.state.medicalConditionError}
              value={this.state.medicalCondition}
              onChangeText={(medicalCondition) => {
                this.setState({medicalCondition: medicalCondition});
              }}
            />

            <Text>{getStr('MedicalData.StartDate')}</Text>

            <Row>
              <Column>
                <DateInput
                  format="YYYY-MM-DD"
                  displayFormat="DD MMM YYYY"
                  value={this.state.startDate}
                  onChange={(startDate) => {
                    console.log('StartDate', startDate);
                    this.setState({startDate});
                  }}
                />
              </Column>
              <Column>
                <DateInput
                  format="YYYY-MM-DD"
                  displayFormat="DD MMM YYYY"
                  value={this.state.endDate}
                  onChange={(endDate) => {
                    this.setState({endDate});
                  }}
                />
              </Column>
            </Row>

            <PickerModal
              label={getStr('MedicalData.Severity')}
              placeholder={getStr('MedicalData.Severity')}
              error={this.state.severityTypeError}
              selectedValue={this.state.severityTypeValue}
              data={this.state.severityTypeOptions}
              idKey="value"
              labelKey="label"
              onValueChange={(severityTypeValue, itemIndex) => {
                this.setState({severityTypeValue});
                if (severityTypeValue === '') {
                  this.setState({severityTypeError: 'Select Severity Type'});
                } else {
                  this.setState({severityTypeError: ''});
                }
              }}
            />

            <TextInput
              label={getStr("TargetAllocate.Notes")}
              placeholder="Note"
              value={this.state.note}
              onChangeText={(note) => {
                this.setState({note});
              }}
            />

            {this.state.drugs.map((drug, key) => {
              return (
                <View key={key} style={{marginTop: 10}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{flex: 1}}>
                      {getStr('MedicalData.PrescriptionDrug')}
                    </Text>
                    {key == 0 && (
                      <Button
                        theme="secondary"
                        style={{height: 30}}
                        labelButton={
                          <MaterialCommunityIcons
                            name="plus"
                            size={30}
                            color={Color.primary}
                          />
                        }
                        onPress={() => {
                          let drugs = this.state.drugs;
                          drugs.push({
                            drugName: '',
                            times: '1',
                            dosage: '1',
                            drugNameError: '',
                            timesError: '',
                            dosageError: '',
                          });
                          this.setState({drugs});
                        }}
                      />
                    )}
                    {key != 0 && (
                      <Button
                        theme="secondary"
                        style={{height: 30}}
                        labelButton={
                          <MaterialCommunityIcons
                            name="minus"
                            size={30}
                            color={Color.primary}
                          />
                        }
                        onPress={() => {
                          let drugs = this.state.drugs;
                          drugs.pop();
                          this.setState({drugs});
                        }}
                      />
                    )}
                  </View>

                  {drug.drugNameError != '' && (
                    <Text style={{color: Color.danger}}>
                      {drug.drugNameError}
                    </Text>
                  )}

                  <TextInput
                    placeholder="Drug Name"
                    value={drug.drugName}
                    onChangeText={(medicineDetails) => {
                      let drugs = this.state.drugs;
                      drugs[key].drugName = medicineDetails;
                      this.setState({drugs});
                    }}
                  />

                  <View style={{marginTop: 10}}>
                    <Text>{getStr('MedicalData.Dosage')}</Text>
                    <View style={{flexDirection: 'row'}}>
                      {drug.dosageError != '' && (
                        <Text style={{color: Color.danger, flex: 1}}>
                          {drug.dosageError}
                        </Text>
                      )}
                      {drug.timesError != '' && (
                        <Text style={{color: Color.danger, flex: 1}}>
                          {drug.timesError}
                        </Text>
                      )}
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View style={styles.dosage1}>
                        <DTextInput
                          style={{width: '70%', height: 40}}
                          placeholder="60"
                          value={drug.dosage}
                          maxLength={4}
                          keyboardType={'numeric'}
                          onChangeText={(dosageText) => {
                            dosageText = dosageText.replace(/[^\w.]+/g, '');
                            let drugs = this.state.drugs;
                            drugs[key].dosage = dosageText;
                            this.setState({drugs});
                          }}
                        />
                        <Text
                          style={{
                            width: '30%',
                            paddingTop: 10,
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          mg
                        </Text>
                      </View>
                      <View style={styles.dosage1}>
                        <DTextInput
                          style={{width: '30%', height: 40}}
                          placeholder="2"
                          value={drug.times}
                          maxLength={4}
                          keyboardType={'numeric'}
                          onChangeText={(howOftenTaken) => {
                            howOftenTaken = howOftenTaken.replace(
                              /[^\w.]+/g,
                              '',
                            );
                            let drugs = this.state.drugs;
                            drugs[key].times = howOftenTaken;
                            this.setState({drugs});
                          }}
                        />
                        <Text
                          style={{
                            width: '70%',
                            paddingTop: 10,
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          times a day
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text style={styles.medicalTitle}>
                  {getStr('MedicalData.MedicalReminders')}
                </Text>
                <Text style={styles.medicalSubtitle}>
                  {getStr('MedicalData.MeediDes')}
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

            {this.state.showLoading && (
              <ActivityIndicator
                size="large"
                color="black"
                style={{
                  zIndex: 9999999,
                  // backgroundColor: '#ccc',
                  opacity: 0.9,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: screenHeight,
                  justifyContent: 'center',
                }}
              />
            )}
            {isVisible1 &&
              OrientationHelper.getDeviceOrientation() == 'portrait' &&
              this.overlayInPortrait()}
            {isVisible1 &&
              OrientationHelper.getDeviceOrientation() == 'landscape' &&
              this.overlayInLandscape()}
          </ScrollView>

          <Button
            labelButton={getStr('MedicalData.SaveData')}
            style={{marginBottom: 10}}
            onPress={this.saveNewMedical}
          />
          {this.medication && (
            <View style={{marginBottom: 10}}>
              <Button
                labelButton="Delete Medical Data"
                theme="danger"
                onPress={() => {
                  this.deleteMedical();
                }}
              />
            </View>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    // flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    // height: 1000
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
    paddingLeft: 15,
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
    fontWeight: 'bold',
    paddingTop: 10,
    color: '#45494E',
  },

  TextStyle: {
    marginTop: 24,
    marginBottom: 16,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    padding: 6,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  input1: {
    marginTop: 10,
    marginBottom: 10,

    fontSize: 15,
    fontStyle: 'normal',

    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },

  backIconText1: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#63686E',
  },
  dosage1: {
    flexDirection: 'row',
    width: '46%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    // padding: 10,
    marginRight: 20,
    height: 40,
    paddingHorizontal: 10,
  },
  dosage2: {
    flexDirection: 'row',
    width: '45%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    padding: 10,
    marginLeft: 10,
    height: 40,
    paddingHorizontal: 10,
  },
  reminderTime: {
    borderRadius: 5,
    backgroundColor: Color.white,
    borderColor: Color.gray,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 11,
    marginTop: 10,
  },
  reminderDays: {
    flexDirection: 'row',
    width: '55%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    padding: 10,
    marginLeft: 10,
    height: 40,
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 10,
    // marginLeft: 12,
    // marginRight: 12,
    // marginBottom: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    marginVertical: 10,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  medicalTitle: {
    fontSize: 16,
    color: Color.blackFont,
  },
  medicalSubtitle: {
    fontSize: 12,
    color: Color.grayDarkFill,
  },
  switch: {
    color: '#63686E',
    marginTop: 20,
    width: '80%',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlayLandscape: {
    // backgroundColor: 'red',
    width: screenWidth - 50,
    height: screenHeight - 50,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewMedication);
