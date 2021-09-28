import React, {Component} from 'react';

import {
  Dimensions,
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Picker,
} from 'react-native';
import {getStr} from '../../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ResultBox from '../../../components/screening/ResultBox';
import {connect} from 'react-redux';
import store from '../../../redux/store';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import moment from 'moment';
import TherapistRequest from '../../../constants/TherapistRequest';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';
import Color from '../../../utility/Color';
import PickerModal from '../../../components/PickerModal';
import ProgressCircle from 'react-native-progress-circle';
import * as Progress from 'react-native-progress';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../../../utility/Style';
import {node} from 'prop-types';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const {width, height} = Dimensions.get('window');
class AssessmentResultCogniable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaErrorMessage: '',
      options: [
        {id: 'DELAYED', label: 'DELAYED', color: '#c28180'},
        {id: 'ONTRACK', label: 'ONTRACK', color: '#4BAEA0'},
        {id: 'ADVANCED', label: 'ADVANCED', color: '#4BAEA0'},
      ],
      selectedOption: [],
      areasData: [],
      areasResult: [],
      totalScore: '',
      status: '',
      id: '',
      index: 0,
      selectedl: '',
      modalPicker: false,
      ddd: [],
      selectedValue: '1 - 2 Yrs',
      array: [
        {
          title: 'ADLS',
          color: '#4BAEA0',
          subTitle: 'advanced',
          hike: '+10%',
          des:
            'They are set of activities necessary for normal self-care which includes movement in bed, transfers, locomotion, and feeding',
        },
        {
          title: 'Socialization & Emotional Development',
          color: '#4BAEA0',
          subTitle: 'onTrack',
          hike: '+10%',
          des:
            'Socialization and emotional development-socialization-emotional-development refers how a child decelops social and emotional skill across the lifespan',
        },
        {
          title: 'Play Skill',
          color: '#c28180',
          subTitle: 'delayed',
          hike: '+10%',
          des:
            'Play skill is voluntary engagement in self-motivated activities that are normally associated with pleasure and enjoyment.',
        },
        {
          title: 'Language & Communication',
          color: '#c28180',
          subTitle: 'delayed',
          hike: '+10%',
          des:
            'It is all the different ways a child understands and communicates spoken words',
        },
        {
          title: 'Cognitiion',
          color: '#c28180',
          subTitle: 'delayed',
          hike: '+10%',
          des:
            'It refers to the mental processes involved in gaining knowledge and comprehension.',
        },
      ],
    };
  }

  componentDidMount() {
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    const {status, pk} = this.props.route.params;
    //   if (status === 'COMPLETED' || status=='QUESTIONSCOMPLETED') {
    let variables = {
      pk: pk,
    };
    TherapistRequest.getAssessmentObjectCogniable(variables).then((result) => {
      console.log(
        result.data.getCogniableAssessDetail.assessmentAreas.edges,
        'cogniable Result',
      );
      result?.data?.getCogniableAssessDetail?.assessmentAreas?.edges?.forEach(
        (e) => {
          if (e?.node?.response === 'DELAYED') {
            e.node.color = '#c28180';
          } else if (e?.node?.response === 'ONTRACK') {
            e.node.color = '#4BAEA0';
          } else if (e?.node?.response === 'ADVANCED') {
            e.node.color = '#4BAEA0';
          }
        },
      );

      this.setState({
        totalScore: result.data.getCogniableAssessDetail.score,
        areasResult: result.data.getCogniableAssessDetail.assessmentAreas.edges,
      });
    });
    // }
    this.setState({
      status: status,
    });
  }

  updateAreas = (id, value) => {
    let {areasData} = this.state;
    let already = 0;
    for (let x = 0; x < areasData.length; x++) {
      if (areasData[x].area === id) {
        areasData[x].response = value;
        already = 1;
        break;
      }
    }
    if (already === 0) {
      areasData.push({
        area: id,
        response: value,
      });
    }
    this.setState({
      areasData,
    });
    console.log(areasData);
  };

  handleAreasResponse = () => {
    const {pk, student, areas, status} = this.props.route.params;
    const {areasData, totalScore} = this.state;
    for (let x = 0; x < areasData.length; x++) {
      let variables = {
        pk: pk,
        areaId: areasData[x].area,
        response: areasData[x].response,
      };
      TherapistRequest.recordAreaResponse(variables).then((result) => {
        console.log(JSON.stringify(result));
        Alert.alert(JSON.stringify(result));
        this.setState({ddd: result});
      });
    }
    let variables = {
      pk: pk,
      score: totalScore,
      status: 'Completed',
    };
    TherapistRequest.endAssessmentCogniable(variables).then((result) => {
      console.log(result);
      this.setState({
        status: 'COMPLETED',
      });
    });
  };

  renderResult() {
    const {pk, student, areas, program, statuss} = this.props.route.params;
    console.log(student, 'kkkkkkkkkkkkkkkkkkkkkkkkkk');
    const {
      options,
      selectedOption,
      totalScore,
      status,
      areasData,
      areasResult,
    } = this.state;
    let returnArray = [];

    return (
      <>
        <ScrollView style={{flex: 1}}>
          {areasResult?.map((item, i) => (
            <View
              key={i}
              style={{
                backgroundColor: '#FFF',
                elevation: 11,
                borderRadius: 10,
                shadowRadius: 10,
                paddingVertical: 20,
                paddingHorizontal: 10,
                marginVertical: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '25%'}}>
                  <Image
                    source={require('../../../../android/img/cog.jpg')}
                    style={{
                      width: '100%',
                      height: 40,
                      resizeMode: 'contain',
                      marginVertical: 8,
                      borderRadius: 8,
                    }}
                  />
                </View>
                <View style={{width: '70%', alignSelf: 'center'}}>
                  <Text
                    style={
                      ([Style.grayText], {fontSize: 16, fontWeight: 'bold'})
                    }>
                    {item?.node?.area?.name}
                  </Text>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                      this.setState({
                        modalPicker: statuss === true ? true : false,
                        index: i,
                        color: item.color,
                        id: item?.node?.id,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        flexWrap: 'wrap',
                        color: item?.node?.color,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}>
                      {item?.node?.response}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      color={item?.node?.color}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={({fontSize: 10, flexWrap: 'wrap'}, [Style.grayText])}>
                {item?.area?.description}
              </Text>

              <View style={styles.progress}>
                <Progress.Bar
                  progress={item?.node?.response == 'ONTRACK' ? 1.0 : 0.3}
                  width={null}
                  color={item?.node?.color}
                  borderColor={item?.node?.color}
                />
              </View>
              {/* <Text>{JSON.stringify(this.state.ddd)}</Text> */}
            </View>
          ))}
          <View style={{height: 60}}></View>
        </ScrollView>
        <View style={styles.continueView}>
          <Button
            onPress={() => {
              this.handleAreasResponse();
              this.props.navigation.navigate('CogniableSuggestedTargets', {
                pk: pk,
                program: program,
                student: student,
              });
            }}
            labelButton="Submit Suggested Targets"
          />
        </View>
      </>
    );
  }

  render() {
    const {status} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          title={getStr("TargetAllocate.CogniABleScore")}
          backPress={() => this.props.navigation.goBack()}
        />
        <Container>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            {status !== '' && this.renderResult()}
          </ScrollView>
        </Container>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalPicker}
          onRequestClose={() => this.setState({modalPicker: false})}>
          <TouchableOpacity
            onPress={() => this.setState({modalPicker: false})}
            activeOpacity={1}
            style={styles.modalRoot}>
            <View style={styles.modalContent}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                // style={{ flex:1, alignSelf:'center' }}
                keyboardShouldPersistTaps="handled">
                {this.state.options.length == 0 && (
                  <NoData>{getStr("TargetAllocate.Nodatafound")}</NoData>
                )}
                {this.state.options.map((item, index) => {
                  let styleModalItem = styles.modalItem;
                  if (this.state.options.length - 1 == index) {
                    styleModalItem = styles.modalItemNoBorder;
                  }
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.setState({
                          modalPicker: false,
                          selectedl: item.label,
                        });

                        this.setState((previousState) => {
                          const areasResult = [...previousState.areasResult];

                          areasResult[this.state.index] = {
                            ...areasResult[this.state.index],
                            node: {
                              ...areasResult[this.state.index].node,
                              response: item.label,
                              color: item.color,
                            },
                          };

                          return {areasResult};
                        });
                        this.updateAreas(
                          this.state.areasResult[this.state.index]?.node?.id,
                          item.label,
                        );
                      }}
                      style={styleModalItem}>
                      <Text style={styles.modalText}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  sidebarTitle: {
    fontSize: 16,
    marginVertical: 5,
    color: Color.black,
  },
  header: {
    flexDirection: 'row',
    height: 50,
    width: '95%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingLeft: 10,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 18,
    paddingTop: 10,
    color: '#45494E',
    fontWeight: 'bold',
  },
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingRight: 10,
  },
  scrollView: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 120,
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
  continueViewTouchable: {
    // margin: 16,
    // marginTop: 28,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 50,
    backgroundColor: '#3E7BFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E7BFA',
  },
  continueViewText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  progress: {
    marginTop: 10,
  },
  modalRoot: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    borderRadius: 5,
    backgroundColor: Color.white,
    padding: 10,
    maxHeight: height - 100,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  modalItemNoBorder: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  modalText: {
    color: Color.black,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetMedicalData: (data) => dispatch(setMedicalData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssessmentResultCogniable);
