import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Picker,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.firstname', 'node.lastname'];
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import TextInput from '../../../components/TextInput';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import {therapistGetLongTermGoals} from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';
import Button from '../../../components/Button.js';
import DateInput from '../../../components/DateInput.js';


const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const [selectedValue, setSelectedValue] = 'In progress';
class ShortTermGoalNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      program: {},
      isLoading: false,
      showLoading: false,
      goalTitle: '',
      goalDescription: '',
      startDate: moment().toDate(),
      endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      minimumDate: moment().toDate(),
      isStartDateSelected: false,
      showStartDatepicker: false,
      showEndDatepicker: false,
      longTermGoals: [],
      assessments: [],
      selectedAssessment: '',

      responsibilities: [],
      selectedResponsibility: 'R29hbFJlc3BvbnNpYmlsaXR5VHlwZToz',

      goalStatus: [],
      selectedStatus: 'R29hbFN0YXR1c1R5cGU6Mg==',
      goalDropdownList: [],
      selectedGoalCategory: '',
      status: '',

      goalTitleError: '',
      startDateError: '',
      endDateError: '',
      categoryError: '',
      assessmentError: '',
      statusError: '',
      responsibilityError: '',
      descriptionError: '',
    };
  }
  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;

    
    this.setState({
      student: student,
      program: program,
    });
    //Call this on every page
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getLongTermGoals()
    this.getResponsibilityData();
    this.getAssessmentData();
    this.getStatusData();
  }

  getLongTermGoals = () => {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;

    console.log(student)
    console.log(program)

    const variables = {
      studentId: student.node.id,
      program: program.id
    }

    console.log("variables", variables)

    

    TherapistRequest.getFilteredLongTermGoals(variables).then((response) => {
      console.log("respone", response)

      const goalList = response?.data?.longTerm?.edges.map((goal) => {
        let name = goal.node.goalName;
        if (name.length > 25) {
          name = name.substring(0, 25) + '...';
        }
        console.log(name);
        return {
          id: goal.node.id,
          label: name,
        };
      });

      this.setState({goalDropdownList: goalList})
      
    }).catch((err) => {
      console.log(err)
    })
  }


  getResponsibilityData() {
    this.setState({isLoading: true});

    TherapistRequest.getGoalResponsibility()
      .then((responsibilityData) => {
        console.log('responsibilityData', JSON.stringify(responsibilityData));
        let respList = responsibilityData.data.goalResponsibility.map(
          (goal) => {
            return {
              id: goal.id,
              label: goal.name,
            };
          },
        );
        console.log(respList);
        this.setState({responsibilities: respList});
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  getStatusData() {
    this.setState({isLoading: true});

    TherapistRequest.getGoalStatus()
      .then((goalStatusData) => {
        console.log('goalStatusData', JSON.stringify(goalStatusData));
        let statusList = goalStatusData.data.goalStatus.map((goal) => {
          return {
            id: goal.id,
            label: goal.status,
          };
        });
        console.log(statusList);
        this.setState({goalStatus: statusList});
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  getAssessmentData() {
    this.setState({isLoading: true});

    TherapistRequest.getGoalAssessment()
      .then((goalAssessmentData) => {
        console.log('goalAssessmentData', JSON.stringify(goalAssessmentData));
        let assessments = goalAssessmentData.data.goalsAssessment.map((res) => {
          return {
            id: res.id,
            label: res.name,
          };
        });
        console.log(assessments);
        this.setState({assessments: assessments});
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }
  isFormInValid() {
    let isError = false;
    if (this.state.goalTitle === '') {
      this.setState({goalTitleError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({goalTitleError: ''});
    }
    if (this.state.startDate === 'Start Date') {
      this.setState({startDateError: 'Select start date'});
      isError = true;
    } else {
      this.setState({startDateError: ''});
    }
    if (this.state.endDate === 'End Date') {
      this.setState({endDateError: 'Select end date'});
      isError = true;
    } else {
      this.setState({endDateError: ''});
    }
    if (this.state.selectedGoalCategory === '') {
      this.setState({categoryError: 'Please select Category'});
      isError = true;
    } else {
      this.setState({categoryError: ''});
    }
    // if (this.state.selectedAssessment === "") {
    //     this.setState({ assessmentError: "Please select Assessment" });
    //     isError = true;
    // } else {
    //     this.setState({ assessmentError: "" });
    // }
    if (this.state.selectedStatus === '') {
      this.setState({statusError: 'Please select Status'});
      isError = true;
    } else {
      this.setState({statusError: ''});
    }
    if (this.state.selectedResponsibility === '') {
      this.setState({responsibilityError: 'Please select Responsibility'});
      isError = true;
    } else {
      this.setState({responsibilityError: ''});
    }
    if (this.state.goalDescription === '') {
      this.setState({descriptionError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({descriptionError: ''});
    }
    return isError;
  }

  addNewGoal(fromSave) {
    if (this.isFormInValid()) {
      return;
    }
    this.setState({showLoading: true});

    let {student, program} = this.state;
    let queryString = {
      longTerm: this.state.selectedGoalCategory,
      goalName: this.state.goalTitle,
      description: this.state.goalDescription,
      dateInitialted: moment(this.state.startDate).format('YYYY-MM-DD'),
      dateEnd: moment(this.state.endDate).format('YYYY-MM-DD'),
      assessment: this.state.selectedAssessment,
      responsibility: this.state.selectedResponsibility,
      goalStatus: this.state.selectedStatus,
    };
    console.log(queryString);
    TherapistRequest.createShortTerm(queryString)
      .then((shortTerm) => {
        console.log('shortTerm', JSON.stringify(shortTerm));
        debugger
        this.setState({showLoading: false});
        if (shortTerm.data.createShortTerm.details.id) {
          Alert.alert(
            'New Short Term Goal',
            'Successfully Added',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');

                  if(fromSave) {
                    this.props.route.params.newAdded()
                    this.props.navigation.goBack()
                  } else {
                    this.props.navigation.navigate('TargetAllocate', {
                      program: program,
                      student: student,
                      shortTermGoalId: shortTerm.data.createShortTerm.details.id,
                      defaults: true
                    });

                  }

                },
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        this.setState({showLoading: false});
        console.log(error, error.response);
        this.setState({isSaving: false});

        Alert.alert('Information', error.toString());
      });
  }
  render() {
    let {
      program,
      student,
      goalTitle,
      defaultstatus,
      goalDescription,
      showStartDatepicker,
      showEndDatepicker,
      startDate,
      endDate,
      minimumDate,
      isStartDateSelected,
      goalStatus,
      assessments,
      responsibilities,
      goalDropdownList,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title="New Short Term Goal"
          enable={this.props.disableNavigation != true}
        />
        <Container enablePadding={this.props.disableNavigation != true}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic">
            <TextInput
              label="Goal Title"
              error={this.state.goalTitleError}
              multiline={true}
              defaultValue={goalTitle}
              onChangeText={(goalTitle) => this.setState({goalTitle})}
            />

            <Text style={Styles.grayText}>Start & End Time</Text>
            {this.state.timeErrorMessage != '' && (
              <Text style={{color: Color.danger}}>
                {this.state.timeErrorMessage}
              </Text>
            )}
            <Row>
              <Column>
                <DateInput
                  format="YYYY-MM-DD"
                  displayFormat="DD MMM YYYY"
                  value={this.state.startDate}
                  onChange={(startDate) => {
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
              label="Long Term Goal"
              error={this.state.categoryError}
              placeholder="(Select Long Term Goal)"
              data={goalDropdownList}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedGoalCategory: itemValue});
              }}
            />

            {/* <Text style={{ textAlign: 'left', color: 'red' }}>{this.state.assessmentError}</Text>
                        <PickerModal
                            label="Assessment"
                            iconLeft='folder-open'
                            // selectedValue={selectedCategory}
                            data={assessments}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedAssessment: itemValue });
                            }}
                        /> */}
            <PickerModal
              label="Status"
              error={this.state.statusError}
              defaultValue={this.state.selectedStatus}
              placeholder="In Progress"
              data={goalStatus}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedStatus: itemValue});
              }}
            />

            <PickerModal
              label="Responsibility"
              error={this.state.responsibilityError}
              placeholder="Service Provider"
              defaultValue={this.state.selectedResponsibility}
              data={responsibilities}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedResponsibility: itemValue});
                console.log(responsibilities);
              }}
            />
            <TextInput
              style={{height: 150}}
              label="Description"
              multiline={true}
              placeholder={'Goal Description'}
              defaultValue={goalDescription}
              onChangeText={(goalDescription) =>
                this.setState({goalDescription})
              }
            />
          </ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Button
              labelButton="Save"
              style={{marginBottom: 10, flex: 0.5, marginRight: 10}}
              isLoading={this.state.showLoading}
              onPress={() => {
                this.addNewGoal(true);
              }}
            />
            <Button
              labelButton="Continue With Target Allocation"
              style={{marginBottom: 10, flex: 1}}
              isLoading={this.state.showLoading}
              onPress={() => {
                this.addNewGoal();
              }}
            />
          </View>
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
  },

  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  continueViewTouchable: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShortTermGoalNew);
