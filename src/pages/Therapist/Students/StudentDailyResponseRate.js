import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Modal,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Color from '../../../utility/Color';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import {Row, Container, Column} from '../../../components/GridSystem';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import ClinicRequest from '../../../constants/ClinicRequest';
import PickerModal from '../../../components/PickerModal';
import DateInput from '../../../components/DateInput';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NoData from '../../../components/NoData';
import {getStr} from '../../../../locales/Locale';
import {groupBy} from 'lodash';

const screenWidth = Dimensions.get('window').width;

class StudentDailyResponseRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      responseRates: [],
      peakBlockWise: [],
      peakEquivalence: [],
      labels: [],
      chartVals: [],
      chartFre: [],
      chartDur: [],
      chartRate:[],

      graphPieData: null,
      graphBarData: null,
      title: '',
      targetStatus: [],
      types: [],
      selectedTargetStatus: null,
      selectedTypes: null,
      start_date: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      isReady: false,
      isGraphShow: false,
      selectedTab: 'frequency',
      tarType: '',
      mode: 'pie',
    };
  }
  _refresh() {}
  componentDidMount() {
    let student = this.props.route.params;
    this.setState({student: student});
    ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getGraphData();
  }

  getGraphData() {
    let student = this.props.route.params;

    this.setState({isReady: false});

    ClinicRequest.getDailyResponseData()
      .then((result) => {
        let targetStatus = result.data.targetStatus.map((item) => {
          return {
            id: item.id,
            label: item.statusName,
          };
        });

        let types = result.data.types.map((item) => {
          return {
            id: item.id,
            label: item.typeTar,
          };
        });

        this.setState({isReady: true, targetStatus, types});

        this.getGraphInfo();
      })
      .catch((error) => {
        console.log(error);
        this.setState({isReady: true});
      });
  }

  getGraphInfo() {
    let student = this.props.route.params;
    this.setState({isLoading: true});
    this.setState({isGraphShow: false, graphData: null});
    const variables1 = {
      student: student.node.id,
      start: this.state.start_date,
      end: this.state.end_date,
      sessionName: '',
    };
    ClinicRequest.peakBlockWise(variables1).then((res) => {
      this.setState({
        peakBlockWise: res.data.peakBlockWiseReport,
      });
    });
    const variables2 = {
      student: student.node.id,
      start: this.state.start_date,
      end: this.state.end_date,
      sessionName: '',
      equivalence: true,
    };
    ClinicRequest.peakEquivalence(variables2).then((res) => {
      this.setState({
        peakEquivalence: res.data.peakBlockWiseReport,
      });
    });

    let variables = {
      student_id: student.node.id,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    };

    console.log('Vars', variables);
    ClinicRequest.getDailyResponseInfo(variables)
      .then((result) => {
        let responseRates = result.data.responseRate;

        this.setState({isGraphShow: false, isLoading: false, responseRates});
      })
      .catch((error) => {
        console.log(error);
        this.setState({isGraphShow: false, isLoading: false});
      });
  }

  showGraph(responseRate) {
    let labels = [];
    let chartVals = [];
    let chartDur = [];
    let chartFre = [];
    let chartRate=[];
    let today=moment(this.state.end_date).add(1, 'days');
    let time = moment(today).subtract(7, 'days');
    let x = 0;
    let day = time.format('YYYY-MM-DD');
    let title = '';

    for (let i = time; x < 7; x++) {
      labels.push(moment(day).format('DD'));
      if (responseRate.targetType !== 'Behavior Recording') {
        if (responseRate[day] !== undefined && responseRate[day] !== null) {
          chartVals.push(responseRate[day]);
        } else {
          chartVals.push(0);
        }
      } else if (responseRate.targetType === 'Behavior Recording') {
        if (responseRate[day] !== undefined && responseRate[day] !== null) {
          console.log("response rate>>>",responseRate);
          chartDur.push(responseRate[day][0].toFixed(0));
          chartFre.push(responseRate[day][1]);
          chartRate.push(responseRate[day][2]==='Infinity'? 0:responseRate[day][2].toFixed(3))
        } else {
          chartDur.push(0);
          chartFre.push(0);
          chartRate.push(0);
        }
      }

      // if (day == responseRate.sessionDate && responseRate.sessionRecord.length != 0) {
      //     chartVals.push(responseRate.sessionRecord[0].perSd);
      // } else {
      //     chartVals.push(0);
      // }
      day = time.add(1, 'day').format('YYYY-MM-DD');
    }
    title = responseRate.target;
    // if(responseRate.targetType==='Behavior Recording'){
    //     title=`${responseRate.target} ${this.state.selectedTab}`
    // }
    // console.log("chartDur",chartDur, chartFre);
    this.setState({
      labels,
      chartVals,
      chartFre,
      chartDur,
      chartRate,
      isGraphShow: true,
      title,
      tarType: responseRate.targetType,
    });
  }

  renderModal() {
    let linedata = {};
    if (
      this.state.tarType === 'Behavior Recording' &&
      this.state.selectedTab === 'frequency'
    ) {
      linedata = {
        labels: this.state.labels,
        datasets: [
          {
            data: this.state.chartFre,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `#000000`,
          },
        ],
        // legend: [this.state.title],
      };
    }
   else if (
      this.state.tarType === 'Behavior Recording' &&
      this.state.selectedTab === 'rate'
    ) {
      linedata = {
        labels: this.state.labels,
        datasets: [
          {
            data: this.state.chartRate,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `#000000`,
          },
        ],
        // legend: [this.state.title],
      };
    } else if (
      this.state.tarType === 'Behavior Recording' &&
      this.state.selectedTab === 'duration'
    ) {
      linedata = {
        labels: this.state.labels,
        datasets: [
          {
            data: this.state.chartDur,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `#000000`,
          },
        ],
        // legend: [this.state.title],
      };
    } else {
      linedata = {
        labels: this.state.labels,
        datasets: [
          {
            data: this.state.chartVals,
            strokeWidth: 3, // optional
            color: (opacity = 1) => `#000000`,
          },
        ],
        // legend: [this.state.title],
      };
    }
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isGraphShow}
        onRequestClose={() => {
          this.setState({isGraphShow: false});
        }}>
        <TouchableOpacity
          style={styles.modalWrapper}
          activeOpacity={1}
          onPress={() => {
            this.setState({isGraphShow: false});
          }}>
          <View style={styles.modalContent}>
            <>
              {this.state.tarType === 'Behavior Recording' && (
                <View style={{height: 50, paddingTop: 10}}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedTab: 'frequency'}, () => {
                          console.log('selected tab>>', this.state.selectedTab);
                        });
                      }}>
                      <Text
                        style={[
                          styles.tabView,
                          this.state.selectedTab === 'frequency'
                            ? styles.selectedTabView
                            : '',
                        ]}>
                        Frequency
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedTab: 'rate'}, () => {
                          console.log('selected tab>>', this.state.selectedTab);
                        });
                      }}>
                      <Text
                        style={[
                          styles.tabView,
                          this.state.selectedTab === 'rate'
                            ? styles.selectedTabView
                            : '',
                        ]}>
                        Rate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedTab: 'duration'}, () => {
                          console.log('selected tab>>', this.state.selectedTab);
                        });
                      }}>
                      <Text
                        style={[
                          styles.tabView,
                          this.state.selectedTab === 'duration'
                            ? styles.selectedTabView
                            : '',
                        ]}>
                        Duration(sec)
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}
              <View style={{width:'100%',flexDirection:'row',justifyContent:'center',padding:5,margin:5}}>
             
              <Text style={{...styles.modalTitle,alignItems:'center',paddingTop:5}}>
              <MaterialCommunityIcons
                      name="record"
                      size={20}
                      color={Color.black}
                    />{this.state.title}</Text>

              </View>
              {this.state.selectedTab === 'frequency' && (
                <LineChart
                  data={linedata}
                  width={Dimensions.get('window').width - 40} // from react-native
                  height={220}
                  yAxisLabel={''}
                  withInnerLines={false}
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `#000000`,
                    style: {
                      borderRadius: 0,
                    },
                    useShadowColorFromDataset: false,
                  }}
                  // bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 0,
                  }}
                />
              )}
              {this.state.selectedTab === 'rate' &&  this.state.tarType === 'Behavior Recording' && (
                <LineChart
                  data={linedata}
                  width={Dimensions.get('window').width - 40} // from react-native
                  height={220}
                  yAxisLabel={''}
                  withInnerLines={false}
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `#000000`,
                    style: {
                      borderRadius: 0,
                    },
                    useShadowColorFromDataset: false,
                  }}
                  // bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 0,
                  }}
                />
              )}
              {this.state.selectedTab === 'duration' &&
                this.state.tarType === 'Behavior Recording' && (
                  <>

                    <BarChart
                      data={linedata}
                      width={Dimensions.get('window').width - 50} // from react-native
                      height={220}
                      yAxisLabel={''}
                      chartConfig={{
                        backgroundColor: 'white',
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `#000000`,
                        style: {
                          borderRadius: 0,
                        },
                        useShadowColorFromDataset: false,
                      }}
                      withInnerLines={false}
                      showValuesOnTopOfBars={true}
                      showBarTops={true}
                      // bezier
                      style={{
                        marginVertical: 8,
                        borderRadius: 0,
                      }}
                    />
                  </>
                )}
            </>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  render() {
    let {
      labels,
      chartVals,
      title,
      peakBlockWise,
      peakEquivalence,
      responseRates,
    } = this.state;

    const linedata = {
      labels: labels,
      datasets: [
        {
          data: chartVals,
          strokeWidth: 2, // optional
        },
      ],
    };

    let tempPeakStimulus = [];
    const tempBlockId = [];
    this.state.peakBlockWise.map((item) => {
      tempPeakStimulus.push({
        date: item.date,
        blocks: item.blocks,
        target: item.target?.targetAllcatedDetails.targetName,
        peakType: item.target?.peakType,
        baseline: item.target?.baselineDate,
        master: item.target?.masterDate,
        therapy: item.target?.intherapyDate,
        inmaintainence: item.target?.inmaintainenceDate,
        allocate: item.target?.targetAllcatedDetails.dateBaseline,
      });
    });
    tempPeakStimulus = tempPeakStimulus.filter(
      (item) => item.peakType !== 'EQUIVALENCE',
    );
    tempPeakStimulus = tempPeakStimulus.filter((item) => {
      if (item.blocks?.length > 0) {
        const tempBlock = item.blocks[0].id;
        for (let i = 0; i < tempBlockId.length; i += 1) {
          if (tempBlockId[i] === tempBlock) {
            return false;
          }
        }
        tempBlockId.push(tempBlock);
      }
      return true;
    });

    const groupedData = groupBy(responseRates, 'targetName');
    const peakGroup = groupBy(tempPeakStimulus, 'target');

    const keys = Object.keys(groupedData);
    const tempData = [];
    keys.map((target, index) => {
      if (groupedData[target].length > 0) {
        tempData.push({
          target,
          key: target,
          parent: true,
          children: [],
          // baseline: peakGroup[target] ? peakGroup[target][0].baseline : '',
          // master: peakGroup[target] ? peakGroup[target][0].master : '',
          // therapy: peakGroup[target] ? peakGroup[target][0].therapy : '',
          // inmaintainence: peakGroup[target] ? peakGroup[target][0].inmaintainence : '',
        });
        const lastIdx = tempData.length - 1;
        groupedData[target]?.map((data) => {
          tempData[lastIdx] = {
            ...tempData[lastIdx],
            targetStatusName: data.targetStatusName,
            targetType: data.targetType,

            [`${data.sessionDate}`]:
              data.targetType === 'Peak' ? data.perPeakCorrect : data.perTar,
          };
          if (data.targetType === 'Peak') {
            target = target.trim();
            const childrenObj = [];

            for (let k = 0; k < peakGroup[target]?.length; k += 1) {
              if (peakGroup[target][k].date === data.sessionDate) {
                peakGroup[target][k].blocks?.map((blockItem) => {
                  blockItem.trial?.edges.map((trialObj) => {
                    let stimulusIdx = -1;
                    let stimulusExist = false;
                    for (let w = 0; w < childrenObj.length; w += 1) {
                      if (childrenObj[w].sd === trialObj?.node.sd.sd) {
                        stimulusExist = true;
                        stimulusIdx = w;
                      }
                    }
                    if (stimulusExist) {
                      childrenObj[stimulusIdx].trialCount += 1;
                      childrenObj[stimulusIdx].marks +=
                        trialObj?.node.marks === 10 ? 1 : 0;
                    } else {
                      childrenObj.push({
                        key: trialObj?.node.id,
                        sd: trialObj?.node.sd.sd,
                        targetStatusName:
                          trialObj?.node.sd.sdstepsmasterySet?.edges[0].node
                            .status.statusName,
                        trialCount: 1,
                        marks: trialObj?.node.marks === 10 ? 1 : 0,
                      });
                    }
                  });
                });
              }
            }
            childrenObj.map((cc) => {
              let childIndex = -1;
              let childExist = false;
              for (
                let bb = 0;
                bb < tempData[lastIdx].children.length;
                bb += 1
              ) {
                if (cc.sd === tempData[lastIdx].children[bb].target) {
                  childExist = true;
                  childIndex = bb;
                }
              }
              if (childExist) {
                tempData[lastIdx].children[childIndex] = {
                  ...tempData[lastIdx].children[childIndex],
                  [`${data.sessionDate}`]: Number(
                    Number((cc.marks / cc.trialCount) * 100).toFixed(0),
                  ),
                };
              } else {
                tempData[lastIdx].children.push({
                  key: cc.key,
                  target: cc.sd,
                  type: 'sd',
                  targetStatusName: cc.targetStatusName,
                  parentTarget: target,
                  [`${data.sessionDate}`]: Number(
                    Number((cc.marks / cc.trialCount) * 100).toFixed(0),
                  ),
                });
              }
            });
          }
          if (data.targetType === 'Behavior Recording') {
            const {behRecording} = data;
            if (behRecording && behRecording.length > 0) {
              const temDue = [];
              for (let i = 0; i < behRecording.length; i++) {
                const ele = behRecording[i];
                const temDuration = ele.end - ele.start;
                temDue.push(temDuration);
              }
              const temTotalDuration = temDue.reduce((a, b) => a + b, 0);
              const temFrequency = behRecording.length;
              tempData[lastIdx] = {
                ...tempData[lastIdx],
                [`${data.sessionDate}`]: [
                  temTotalDuration / 1000,
                  temFrequency,
                  (temFrequency*1000/temTotalDuration)
                ],
              };
            }
          }
          if (data.sessionRecord?.length > 0) {
            const sessionRecord = data.sessionRecord;
            sessionRecord.map((sessionData) => {
              let type = 'sd';
              if (sessionData.sd && sessionData.sd !== '') {
                type = 'sd';
              } else if (sessionData.step && sessionData.step !== '') {
                type = 'step';
              }
              let isExist = false;
              let childIdx = -1;

              for (let i = 0; i < tempData[lastIdx].children.length; i += 1) {
                if (
                  tempData[lastIdx].children[i].target === sessionData[type]
                ) {
                  isExist = true;
                  childIdx = i;
                  break;
                }
              }
              if (isExist) {
                tempData[lastIdx].children[childIdx] = {
                  ...tempData[lastIdx].children[childIdx],
                  [`${data.sessionDate}`]:
                    type === 'sd' ? sessionData.perSd : sessionData.perStep,
                };
              } else {
                tempData[lastIdx].children.push({
                  target: sessionData[type],
                  key: Math.random(),
                  targetStatusName: data.targetStatusName,
                  type,
                  parentTarget: target,
                  [`${data.sessionDate}`]:
                    type === 'sd' ? sessionData.perSd : sessionData.perStep,
                });
              }
            });
          }
          //   tempData.map(item => {
          //       console.log("item>>>",item.children.length);
          //     if (item.children.length === 0) {
          //       delete item.children
          //     }
          //   })
          //   console.log("tempdata***>>>>",tempData);
        });
      }
    });
    let filterData = tempData;

    if (this.state.selectedTypes) {
      filterData = filterData.filter(
        (item) => item.targetType === this.state.selectedTypes,
      );
    }
    if (this.state.selectedTargetStatus) {
      filterData = filterData.filter(
        (item) => item.targetStatusName === this.state.selectedTargetStatus,
      );
    }
    if (!this.state.targetStatus || !this.state.selectedTargetStatus) {
      filterData = filterData;
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={getStr('ExtraAdd.DailyResponseRate')}
          disabledTitle={true}
        />

        {!this.state.isReady && <LoadingIndicator />}

        {this.state.isReady && (
          <Container enablePadding={this.props.disableNavigation != true}>
            <ScrollView>
              <Row>
                <Column>
                  <DateInput
                    label={getStr('ExtraAdd.StartDate')}
                    format="YYYY-MM-DD"
                    displayFormat="DD MMM YYYY"
                    value={this.state.start_date}
                    onChange={(start_date) => {
                      this.setState({start_date}, () => {
                        this.getGraphInfo();
                      });
                    }}
                  />
                </Column>
                <Column>
                  <DateInput
                    label={getStr('ExtraAdd.EndDate')}
                    format="YYYY-MM-DD"
                    displayFormat="DD MMM YYYY"
                    value={this.state.end_date}
                    onChange={(end_date) => {
                      this.setState({end_date}, () => {
                        this.getGraphInfo();
                      });
                    }}
                  />
                </Column>
              </Row>
              <PickerModal
                label={getStr('ExtraAdd.TargetStatus')}
                placeholder={getStr('ExtraAdd.SelectTarget')}
                selectedValue={this.state.selectedTargetStatus}
                data={this.state.targetStatus}
                onValueChange={(itemValue, itemIndex) => {
                  const status = this.state.targetStatus.filter(
                    (item) => item.id === itemValue,
                  );
                  this.setState({selectedTargetStatus: status[0].label}, () => {
                    this.getGraphInfo();
                  });
                }}
              />
              <PickerModal
                label={getStr('ExtraAdd.Types')}
                placeholder={getStr('ExtraAdd.SelectType')}
                selectedValue={this.state.selectedTypes}
                data={this.state.types}
                onValueChange={(itemValue, itemIndex) => {
                  const type = this.state.types.filter(
                    (item) => item.id === itemValue,
                  );
                  this.setState({selectedTypes: type[0].label}, () => {
                    this.getGraphInfo();
                  });
                }}
              />

              {/* <View style={{ height: 1, backgroundColor: Color.gray, marginBottom: 20 }} /> */}

              {this.state.isLoading && <LoadingIndicator />}

              {/* {this.state.isGraphShow && (
                                <>
                                <Text style={{...styles.listTitle,textAlign:'center'}}>{title}</Text>
                                <LineChart
                                    data={linedata}
                                    width={Dimensions.get('window').width - 32} // from react-native
                                    height={220}
                                    yAxisLabel={''}
                                    withInnerLines={false}
                                    chartConfig={{
                                        backgroundColor: 'white',
                                        backgroundGradientFrom: 'white',
                                        backgroundGradientTo: 'white',
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                           </> )} */}

              {/* <View style={{ height: 1, backgroundColor: Color.gray, marginBottom: 20 }} /> */}

              {filterData.length == 0 && (
                <NoData>No Response Rate Available</NoData>
              )}

              {filterData.map((responseRate, key) => {
                return (
                  <View style={styles.card}>
                    <TouchableOpacity style={styles.list} key={key}>
                      <Text style={{...styles.listTitle, color: '#3f72af'}}>
                        {responseRate.target}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        key={key}
                        onPress={() => {
                          this.showGraph(responseRate);
                        }}>
                        <MaterialCommunityIcons
                          name="chart-line"
                          color={Color.primary}
                          size={20}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    <View>
                      {responseRate.children.length !== 0 &&
                        responseRate.children.map((child) => {
                          return (
                            <TouchableOpacity style={styles.list}>
                              <Text
                                style={{
                                  ...styles.listTitle,
                                  color:
                                    child.type === 'sd' ? '#F080B8' : '#F0B880',
                                }}>
                                {child.target}
                              </Text>
                              <TouchableOpacity
                                activeOpacity={0.9}
                                key={key}
                                onPress={() => {
                                  this.showGraph(child);
                                }}>
                                <MaterialCommunityIcons
                                  name="chart-line"
                                  color={Color.primary}
                                  size={20}
                                />
                              </TouchableOpacity>
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  </View>
                );
              })}
              {this.renderModal()}
            </ScrollView>
          </Container>
        )}
      </SafeAreaView>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: Color.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  list: {
    flexDirection: 'row',
    // borderRadius: 5,
    // shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 1,
    // },
    // shadowOpacity: 0.20,
    // shadowRadius: 1.41,

    // elevation: 2,
    backgroundColor: Color.white,
    padding: 10,
    alignItems: 'center',
    margin: 3,
    marginVertical: 1,
  },
  listTitle: {
    flex: 1,
    color: Color.black,
    fontSize: 16,
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
    width: '95%',
    borderRadius: 5,
    padding: 0,
    height: '50%',
  },
  modalTitle: {
    fontSize: 16,
    color: '#000',
  },
  tabView: {
    padding: 5,
    marginLeft: 15,
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  selectedTabView: {
    color: '#3E7BFA',
    borderBottomWidth: 2,
    borderBottomColor: '#3E7BFA',
  },
};

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudentDailyResponseRate);
