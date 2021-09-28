import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../../utility/Color';
import TherapistRequest from '../../../constants/TherapistRequest';
import NavigationHeader from '../../../components/NavigationHeader';
import moment from 'moment';
import Button from '../../../components/Button';
import {Container} from '../../../components/GridSystem';
import { getStr } from '../../../../locales/Locale';

class CogniableAssessmentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      assessmentsList: [],
      areas: [],
      tab1: {
        backgroundColor: '#3371FF',
        color: '#ffffff',
      },
      tab2: {
        backgroundColor: '#bcbcbc',
        color: '#000000',
      },
      active: true,
    };
  }

  componentDidMount() {
    this.getAssessmentsList();
  }

  getAssessmentsList = () => {
    const {student} = this.props.route.params;
    let variables = {
      studentID: student?.node.id,
    };
    TherapistRequest.getAssessmentsListCogniable(variables).then((result) => {
      console.log('Assessments List', result.data);
      console.log(JSON.stringify(result.data.getCogniableAssessments.edges));
      this.setState({
        assessmentsList: result.data.getCogniableAssessments.edges,
        areas: result.data.cogniableAssessAreas,
        isLoading: false,
      });
    }).catch((err) => {
      console.log("err", err.error)
      alert(err.message)
      this.props.navigation.goBack()
    })
  };

  generateCompletedAssessmentList = () => {
    const {assessmentsList, areas} = this.state;
    const {student, program} = this.props.route.params;
    let array = [];
    for (let x = assessmentsList.length - 1; x >= 0; x--) {
      let date = moment(assessmentsList[x].node.date).format('MMMM DD, YYYY');
      if (
        assessmentsList[x].node.status === 'COMPLETED' ||
        assessmentsList[x].node.status === 'QUESTIONSCOMPLETED'
      ) {
        array.push(
          <View style={styles.assessContainer2}>
            <TouchableOpacity
              style={styles.assessContainer}
              onPress={() => {
                this.props.navigation.navigate('AssessmentResultCogniable', {
                  student: student,
                  areas: areas,
                  pk: assessmentsList[x].node.id,
                  status: assessmentsList[x].node.status,
                  program: program,
                });
              }}>
              <Text style={styles.assessName}>
                {assessmentsList[x].node.name === null
                  ? assessmentsList[x].node.id
                  : assessmentsList[x].node.name}
              </Text>
              <Text
                style={{
                  color: Color.greenFill,
                  fontWeight: '700',
                  fontSize: 13,
                }}>
                {getStr("homeScreenAutism.Complete")}
              </Text>
              <Text style={styles.assessDate}>{date}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                style={{marginHorizontal: 0, width: '49%'}}
                onPress={() => {
                  this.props.navigation.navigate('CogniableReport', {
                    student: student,
                    areas: areas,
                    pk: assessmentsList[x].node.id,
                    status: assessmentsList[x].node.status,
                    program: program,
                    statuss: false,
                  });
                }}>
                <Text style={styles.type}>{getStr("TargetAllocate.Report")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: '49%'}}
                onPress={() =>
                  this.props.navigation.navigate('CogniableSuggestedTargets', {
                    pk: assessmentsList[x].node.id,
                    program: program,
                    student: student,
                  })
                }>
                <Text style={styles.type}>{getStr("TargetAllocate.SuggestedTarget")}</Text>
              </TouchableOpacity>
            </View>
          </View>,
        );
      }
    }
    return array;
  };
  generateAssessmentsList = () => {
    const {assessmentsList, areas} = this.state;
    const {student, program} = this.props.route.params;
    let array = [];
    for (let x = assessmentsList.length - 1; x >= 0; x--) {
      let date = moment(assessmentsList[x].node.date).format('MMMM DD, YYYY');
      if (assessmentsList[x].node.status === 'PROGRESS') {
        array.push(
          <View style={styles.assessContainer2}>
            <TouchableOpacity
              style={styles.assessContainer}
              onPress={() =>
                this.props.navigation.navigate('QuestionsCogniable', {
                  student: student,
                  areas: areas,
                  pk: assessmentsList[x].node.id,
                  program: program,
                })
              }>
              <Text style={styles.assessName}>
                {assessmentsList[x].node.name === null
                  ? assessmentsList[x].node.id
                  : assessmentsList[x].node.name}
              </Text>
              <Text
                style={{color: Color.orange, fontWeight: '700', fontSize: 13}}>
                {/* IN PROGRESS */}
								{getStr("homeScreenAutism.InProgress")}
              </Text>
              <Text style={styles.assessDate}>{date}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                style={{marginHorizontal: 0, width: '49%'}}
                // onPress={() => {
                //     this.props.navigation.navigate('CogniableReport', {
                //         student: student,
                //         areas: areas,
                //         pk: assessmentsList[x].node.id,
                //         status: assessmentsList[x].node.status,
                //         program: program,
                //         statuss:true
                //     })
                // }}>

                onPress={() =>
                  this.props.navigation.navigate('QuestionsCogniable', {
                    student: student,
                    areas: areas,
                    pk: assessmentsList[x].node.id,
                    program: program,
                  })
                }>
                <Text style={styles.type}>{getStr("TargetAllocate.Resume")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: '49%'}}
                onPress={() =>
                  this.props.navigation.navigate('CogniableSuggestedTargets', {
                    pk: assessmentsList[x].node.id,
                    program: program,
                    student: student,
                  })
                }>
                <Text style={styles.type}>{getStr("TargetAllocate.SuggestedTarget")}</Text>
              </TouchableOpacity>
            </View>
          </View>,
        );
      }
    }
    return array;
  };

  startAssessment = () => {
    const {student} = this.props.route.params;
    const {areas} = this.state;
    let variables = {
      studentID: student.node.id,
    };
    TherapistRequest.startCogniableAssessment(variables).then((result) => {
      console.log(JSON.stringify(result));
      this.props.navigation.navigate('NewAssessmentCogniable', {
        student: student,
        pk: result.data.startCogniableAssess.details.id,
        areas: areas,
      });
    });
  };

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
    const {student, program} = this.props.route.params;
    const {isLoading, assessmentsList, areas} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          title={getStr("TargetAllocate.CogniableAssesment")}
          backPress={() => this.props.navigation.goBack()}
        />
        <Container>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
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
                {/* Completed */}
								{getStr("TargetAllocate.Completed")}
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
                {/* InProgress */}
								{getStr("homeScreenAutism.InProgress")}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading === false &&
              assessmentsList.length > 0 &&
              this.state.active === false &&
              this.generateAssessmentsList()}
            {isLoading === false &&
              assessmentsList.length > 0 &&
              this.state.active === true &&
              this.generateCompletedAssessmentList()}

            {isLoading === false &&
              assessmentsList.length ===
                0 **
                (
                  <View>
                    <View style={styles.instructionsHeader}>
                      <MaterialCommunityIcons
                        name="checkbox-marked-outline"
                        size={32}
                        color={Color.primary}
                      />
                      <Text style={styles.instructionsHeading}>
                        {/* Instructions */}
												{getStr("sessionPreview.instructions")}
                      </Text>
                    </View>
                    <Text>
                      {getStr("sessionPreview.Instructionbrief")}
                    </Text>
                  </View>
                )}
            {isLoading && (
              <Text style={{alignSelf: 'center', marginTop: '45%'}}>
                Loading ...
              </Text>
            )}
          </ScrollView>

          <Button
            labelButton={getStr("homeScreenAutism.NewAssesment")}
            style={{marginBottom: 10}}
            onPress={() => {
              this.props.navigation.navigate('NewAssessmentCogniable', {
                student: student,
                areas: areas,
                program: program,
              });
            }}
          />
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeading: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  instructionsHeader: {
    flexDirection: 'row',
    marginTop: 10,
  },
  instructionsHeading: {
    marginLeft: 5,
    flex: 1,
    fontSize: 24,
    color: Color.primary,
    fontWeight: '700',
  },
  buttonFilled: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3E7BFA',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  type: {
    textAlign: 'center',
    color: '#3E7BFA',
    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  assessContainer: {},
  assessContainer2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: Color.white,
    borderRadius: 5,
    marginHorizontal: 3,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  assessName: {
    fontSize: 16,
    fontWeight: '700',
  },
  suggest: {
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
});

export default CogniableAssessmentsList;
