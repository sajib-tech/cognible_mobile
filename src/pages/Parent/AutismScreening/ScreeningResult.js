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
  Alert,
} from 'react-native';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import DateHelper from '../../../helpers/DateHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TimelineView from '../../../components/TimelineView';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import ImageHelper from '../../../helpers/ImageHelper';
import store from '../../../redux/store';
import StudentHelper from '../../../helpers/StudentHelper';
import {getStr} from '../../../../locales/Locale';

const width = Dimensions.get('window').width;

class ScreeningResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,
      areas: [],
      score: '0',
      isScoreShow: false,
      isAreaListShow: false,
      areaStatusList: [
        {id: 1, label: 'Advanced', value: 'advanced', color: Color.success},
        {id: 2, label: 'OnTrack', value: 'onTrack', color: Color.warning},
        {id: 3, label: 'Delayed', value: 'delayed', color: Color.danger},
      ],
      isSubmitted: false,
      selectedAreaIndex: 0,
      icons: ['volume-high', 'human-handsup', 'thumb-up', 'brain', 'run'],
      titles: [
        getStr('homeScreenAutism.ScreeningResultDescription.Title0'),
        getStr('homeScreenAutism.ScreeningResultDescription.Title1'),
        getStr('homeScreenAutism.ScreeningResultDescription.Title2'),
        getStr('homeScreenAutism.ScreeningResultDescription.Title3'),
        getStr('homeScreenAutism.ScreeningResultDescription.Title4'),
      ],
      descriptions: [
        getStr('homeScreenAutism.ScreeningResultDescription.Description0'),
        getStr('homeScreenAutism.ScreeningResultDescription.Description1'),
        getStr('homeScreenAutism.ScreeningResultDescription.Description2'),
        getStr('homeScreenAutism.ScreeningResultDescription.Description3'),
        getStr('homeScreenAutism.ScreeningResultDescription.Description4'),
      ],
    };

    // console.log(this.props.navigation);
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    //Call this on every page
    this.setState({isLoading: true})
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.apiTimer = setTimeout(() => {
      this.getData();
    }, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.apiTimer)
  }

  getData() {
    this.setState({isLoading: true});

    // const variables = {
    //   pk: store.getState().user.userType.id,
    //   test: false
    // }

    // ParentRequest.getScreeningResult(variables).then((res) => console.log("res", res))

    ParentRequest.screeningGetAssessArea()
      .then((dataResult) => {
        console.log('screeningGetAssessArea', dataResult);

        let areas = dataResult.data.preAssessAreas.map((item, key) => {
          return {
            id: item.id,
            name: this.state.titles[key],
            description: this.state.descriptions[key],
            status: 'Pending',
            statusColor: Color.success,
            percentage: 100,
            icon: this.state.icons[key],
          };
        });

        this.setState(
          {
            isLoading: false,
            areas,
          },
          () => {
            this.getResultData();
          },
        );
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  getResultData() {
    let parent = store.getState().autismScreening;
    if (parent) {
      let dataScreening = parent.state.dataScreening;
      console.log('Data Screening from Home', dataScreening);
      if (dataScreening) {
        let submittedAreas = dataScreening.assessmentAreas.edges;
        this.setState({
          score: dataScreening.score + '',
          isSubmitted:
            submittedAreas && submittedAreas.length != 0 ? true : false,
        });
        if (submittedAreas && submittedAreas.length != 0) {
          let areas = this.state.areas;

          submittedAreas.forEach((item) => {
            let response = item.node.response;
            areas.forEach((area, index) => {
              if (area.id == item.node.area.id) {
                this.state.areaStatusList.forEach((stat) => {
                  if (stat.value.toLowerCase() == response.toLowerCase()) {
                    areas[index].statusColor = stat.color;
                    // console.log("Warna", stat.color);
                  }
                });
                areas[index].status = response;
              }
            });
          });

          this.setState({areas});
          console.log(areas);
        } else {
            Alert.alert(
              'Information',
              'You can see the result update after 24 hours.',
            );
        }
      }
    }

    // let userId = store.getState().user.id;

    // ParentRequest.screeningGetStatus({ userId }).then(dataResult => {
    //     console.log("Data Screening", dataResult);
    //     if (dataResult.data.getScreeningAssessStatus.details) {
    //         let submittedAreas = dataResult.data.getScreeningAssessStatus.details.assessmentAreas.edges;
    //         this.setState({
    //             score: dataResult.data.getScreeningAssessStatus.details.score + "",
    //             isSubmitted: (submittedAreas && submittedAreas.length != 0) ? true : false
    //          });
    //         if (submittedAreas && submittedAreas.length != 0) {
    //             let areas = this.state.areas;

    //             submittedAreas.forEach((item) => {
    //                 let response = item.node.response;
    //                 areas.forEach((area, index) => {
    //                     if (area.id == item.node.area.id) {
    //                         this.state.areaStatusList.forEach((stat) => {
    //                             if (stat.value.toLowerCase() == response.toLowerCase()) {
    //                                 areas[index].statusColor = stat.color;
    //                                 // console.log("Warna", stat.color);
    //                             }
    //                         })
    //                         areas[index].status = response;
    //                     }
    //                 });
    //             });

    //             this.setState({ areas });
    //             console.log(areas);
    //         }
    //     }
    // }).catch((err) => {
    //     console.log("ERR", err);
    // })
  }

  recordAssessResult(area, response) {
    // let assessmentId = "UHJlbGltaW5hcnlBc3Nlc3NtZW50VHlwZTo3OQ==";
    let assessmentId = store.getState().assessmentData;

    let variables = {
      score: parseInt(this.state.score),
      pk: assessmentId,
      area,
      response,
    };
    return ParentRequest.screeningRecordAssessResult(variables);
  }

  finish() {
    if (this.props.disableNavigation) {
      let parentScreen = store.getState().autismScreening;
      if (parentScreen) {
        parentScreen.props.navigation.goBack();
      }
    } else {
      this.props.navigation.popToTop();
    }
  }

  async submit() {
    this.setState({isSaving: true});

    let areas = this.state.areas;
    for (let i = 0; i < areas.length; i++) {
      let area = areas[i];

      try {
        let data = await this.recordAssessResult(area.id, area.status);
        console.log(data);
      } catch (err) {
        this.setState({isSaving: false});
        Alert.alert('Information', err.toString() + '\nNum: ' + i);
        return;
      }
    }

    this.setState({isSaving: false});

    Alert.alert(
      'Information',
      'Successfully Submit Result',
      [
        {
          text: 'Ok',
          onPress: () => {
            this.finish();
          },
        },
      ],
      {cancelable: false},
    );
  }

  renderModal() {
    return (
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isScoreShow}
          onRequestClose={() => {
            this.setState({isScoreShow: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setState({isScoreShow: false});
            }}
            style={styles.modalFull}>
            <View style={styles.modalCentered}>
              <Text
                style={{fontSize: 16, color: Color.blackFont, marginBottom: 5}}>
                Enter score (1-100) :
              </Text>
              <TextInput
                style={styles.input}
                placeholder={'Score'}
                defaultValue={this.state.score}
                keyboardType="numeric"
                onChangeText={(score) => this.setState({score})}
              />
              <View style={{height: 10}} />
              <Button
                labelButton="Close"
                onPress={() => {
                  this.setState({isScoreShow: false});
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isAreaListShow}
          onRequestClose={() => {
            this.setState({isAreaListShow: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setState({isAreaListShow: false});
            }}
            style={styles.modalFull}>
            <View style={styles.modalCentered}>
              {this.state.areaStatusList.map((item) => {
                return (
                  <TouchableOpacity
                    style={{marginVertical: 8, paddingHorizontal: 10}}
                    activeOpacity={0.9}
                    key={item.id}
                    onPress={() => {
                      let areas = this.state.areas;
                      areas[this.state.selectedAreaIndex].status = item.value;
                      areas[this.state.selectedAreaIndex].statusColor =
                        item.color;
                      this.setState({areas, isAreaListShow: false});
                    }}>
                    <Text style={{fontSize: 18, color: item.color}}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  renderSubmitButton() {
    // if (this.state.isSubmitted == false) {
    //     return (
    //         <Button
    //             isLoading={this.state.isSaving}
    //             labelButton='Submit Result'
    //             onPress={() => {
    //                 this.submit()
    //             }}
    //             style={{ marginBottom: 10 }} />
    //     );
    // }
    return null;
  }

  renderList() {
    let {score} = this.state;

    let scoreInt = parseInt(score);
    if (isNaN(scoreInt)) {
      scoreInt = 0;
    }

    // let studentName = StudentHelper.getStudentName();
    let studentName = " child ";

    let headerBackground = '#FF8080';
    let headerText = studentName + ' is at risk';
    let headerSubtitle = '';
    if (scoreInt < 40) {
      headerBackground = '#FF8080';
      headerText = studentName + ' is at risk';
      headerSubtitle =
        'Initial screening result shows sign of disruptive behavior.';
    } else if (scoreInt < 70) {
      headerBackground = '#FF9C52';
      headerText = studentName + ' is on track';
      headerSubtitle = '';
    } else {
      headerBackground = '#4BAEA0';
      headerText = studentName + ' is doing great';
      headerSubtitle = '';
    }

    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._refresh.bind(this)}
            />
          }>
          {scoreInt == 0 && (
            <TouchableOpacity
              style={styles.header}
              activeOpacity={0.8}
              onPress={() => {
                //this.setState({ isScoreShow: true });
              }}>
              <Text style={Styles.veryBigWhiteTextBold}>
                {getStr('NewUpdated.WaitingforResults')}
              </Text>
              <Text style={[Styles.smallWhiteText, {marginVertical: 8}]}>
                {getStr('NewUpdated.waitDes')}
              </Text>
              <View style={[styles.line, {marginVertical: 8, opacity: 0.4}]} />
              <View style={[Styles.row, {alignItems: 'center'}]}>
                <Text style={[Styles.whiteText, {marginVertical: 8}]}>
                  {getStr('NewUpdated.ContactYourPedistrician')}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  color={Color.white}
                  size={20}
                  style={{marginLeft: 8}}
                />
              </View>
            </TouchableOpacity>
          )}

          {scoreInt != 0 && (
            <TouchableOpacity
              style={[styles.header, {backgroundColor: headerBackground}]}
              activeOpacity={0.8}
              onPress={() => {
                //this.setState({ isScoreShow: true });
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.scoreWraper}>
                  <Text style={styles.scoreValue}>{scoreInt}</Text>
                  <Text style={styles.scoreDesc}>Out of 100</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={Styles.veryBigWhiteTextBold}>{headerText}</Text>
                  <Text style={[Styles.smallWhiteText, {marginVertical: 8}]}>
                    {getStr('NewUpdated.waitDes')}
                  </Text>
                </View>
              </View>
              <View style={[styles.line, {marginVertical: 8, opacity: 0.4}]} />
              <View style={[Styles.row, {alignItems: 'center'}]}>
                <Text style={[Styles.whiteText, {marginVertical: 8}]}>
                  {getStr('NewUpdated.ContactYourPedistrician')}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  color={Color.white}
                  size={20}
                  style={{marginLeft: 8}}
                />
              </View>
            </TouchableOpacity>
          )}

          <View
            style={[
              Styles.row,
              {paddingVertical: 8, alignItems: 'flex-start'},
            ]}>
            <MaterialCommunityIcons
              name="format-quote-open"
              color={Color.grayFill}
              size={20}
            />
            <Text
              style={[
                Styles.whiteText,
                {
                  flex: 1,
                  fontSize: 12,
                  color: Color.grayFill,
                  marginHorizontal: 8,
                  textAlignVertical: 'center',
                },
              ]}>
             {getStr('homeScreenAutism.ScreeningDesc') +
               "child" +
                getStr('homeScreenAutism.ScreenDesc')}
            </Text>
            <MaterialCommunityIcons
              name="format-quote-close"
              color={Color.grayFill}
              size={20}
            />
          </View>

          {this.state.areas.map((result, index) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={styles.card}
                onPress={() => {
                  //this.setState({ selectedAreaIndex: index, isAreaListShow: true });
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.imageWrapper}>
                    <MaterialCommunityIcons
                      name={result.icon}
                      size={20}
                      color={Color.white}
                    />
                  </View>

                  <View style={{flex: 1}}>
                    <Text style={Styles.bigBlackTextBold}>{result.name}</Text>
                    <Text style={{color: result.statusColor, fontSize: 10}}>
                      {result.status}
                    </Text>
                  </View>
                </View>
                <Text style={{fontSize: 14, marginTop: 5}}>
                  {result.description}
                </Text>
                <View
                  style={{
                    height: 3,
                    backgroundColor: Color.gray,
                    marginVertical: 5,
                  }}>
                  <View
                    style={{
                      width: result.percentage + '%',
                      height: 3,
                      backgroundColor: result.color,
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {scoreInt != 0 && (
          <>
            {OrientationHelper.getDeviceOrientation() == 'portrait' &&
              this.renderSubmitButton()}
            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <Row>
                <Column></Column>
                <Column>{this.renderSubmitButton()}</Column>
              </Row>
            )}
          </>
        )}
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={"Video Assesment Result"}
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              {this.renderList()}
              {this.renderModal()}
            </>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              {this.renderList()}
              {this.renderModal()}
            </>
          )}
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
    marginVertical: 8,
    padding: 16,
    paddingBottom: 8,
    backgroundColor: Color.blueFill,
    borderRadius: 4,
  },
  card: {
    // marginTop: 8,
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  imageWrapper: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: Color.primaryButton,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFull: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCentered: {
    width: 300,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  input: {
    padding: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
  },
  scoreWraper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scoreValue: {
    fontSize: 40,
    color: Color.white,
    marginBottom: -10,
    marginTop: -5,
  },
  scoreDesc: {
    fontSize: 16,
    color: Color.white,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
  },

  contentBox: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  textBig: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 10,
  },
  videoInputView: {
    padding: 16,
    borderStyle: 'dashed',
    height: width / 2,
    borderWidth: 1,
    borderColor: Color.blueFill,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxBlue: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(62, 123, 250, 0.075)',
    borderRadius: 8,
  },

  line: {
    height: 1,
    width: '100%',
    backgroundColor: Color.silver,
  },
  dot: {
    height: width / 55,
    width: width / 55,
    backgroundColor: Color.silver,
    borderRadius: width / 55,
    marginHorizontal: 8,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningResult);
