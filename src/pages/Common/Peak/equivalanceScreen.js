import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Styles from '../../../utility/Style.js';
import PickerModal from '../../../components/PickerModal';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken} from '../../../redux/actions/index';
import {connect} from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TherapistRequest from '../../../constants/TherapistRequest';
import Button from '../../../components/Button';
import DateInput from '../../../components/DateInput';
import store from '../../../redux/store';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class equivalanceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      pkID: '',
      firstName: '',
      lastName: '',
      isLoading: false,
      programTitle: '',
      selectedId: '',
      selectedIdData: '',
      setSelectedId: '',
      typePeak: '',
      programDate: moment().format('YYYY-MM-DD'),
      titleError: '',
      dateError: '',
      finalStatus: [],
      equivilanceData: [],
      equID: '',
      cateogries: [
        {id: 'Direct', label: 'Direct'},
        {id: 'Generalization', label: 'Generalization'},
        {id: 'Transformation', label: 'Transformation'},
        {id: 'Equivalance', label: 'Equivalance'},
      ],
      equivalance: [
        {id: ' Basic', label: 'Basic'},
        {id: 'Intermediate', label: 'Intermediate'},
        {id: 'Advanced', label: 'Advanced'},
      ],
      selectedCategory: '',
      selectedCategoryError: '',
      eqivalanceFlag: false,
      euivalanceCategory: '',
      notes: '',
      notesError: '',
      placeholderText: 'Notes',

      isInLandscape: false,
      scoreEquivalance: 0,
      scoreReflexivity: 0,
      scoreSymmetry: 0,
      scoreTransivity: 0,
      scoreEquivalanceReport: '',
      scoreReflexivityReport: '',
      scoreSymmetryReport: '',
      scoreTransivityReport: '',
      cateGory: '',
    };
  }

  _refresh() {
    this.setState({isLoading: false});
    this.componentDidMount();
  }

  componentDidMount() {
    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let category = this.props.route.params.category;
    let selectedID = this.props.route.params.selectedId;
    console.log('data_', JSON.stringify(student));
    this.fetchDataPeak();
    // this.getEquiResult(this.props.route.params.selectedId);
    let isInLandscape = false;

    if (this.props.route.params && this.props.route.params.isInLandscape) {
      isInLandscape = this.props.route.params.isInLandscape;
    }
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getEquiResult(this.props.route.params.selectedId);
    });
    this.setState(
      {
        student: student,
        cateGory: category,
        isInLandscape: isInLandscape,
        firstName: JSON.stringify(student.node.firstname),
        lastName: JSON.stringify(student.node.lastname),
        pkID: program,
        selectedId: selectedID,
      },
      () => {
        // this._unsubscribe = navigation.addListener('focus', () => {
        //   this.getEquiResult(selectedID);
        // });
      },
    );
    const {navigation} = this.props;

    console.log('sssssss', JSON.stringify(student.node));
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  fetchDataPeak() {
    TherapistRequest.getPeakData()
      .then((peakPrograms) => {
        console.log('PeakProgram', peakPrograms);
        this.setState({equivilanceData: peakPrograms.data.peakEquDomains});

        //   Alert.alert(JSON.stringify(peakPrograms))
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('Information', error.toString());
      });
  }

  Item(props) {
    const {item, index, selectedId, onPress} = props;
    return (
      <TouchableOpacity
        // style={{width:OrientationHelper.getDeviceOrientation() == 'landscape'? 120 :screenWidth / 3.33,}}
        style={{alignItems: 'center', justifyContent: 'center', paddingLeft: 3}}
        onPress={() => {
          onPress(index);
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={[
              styles.tabText,
              {
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 5,
                paddingRight: 5,
              },
            ]}>
            <Text
              style={{
                color: index == selectedId ? 'white' : 'black',
                textAlign: 'center',
                alignItems: 'center',
                fontSize: 17,
                paddingTop: 8,
                paddingBottom: 8,
                backgroundColor: index == selectedId ? '#3E7BFA' : 'lightgrey',
                borderRadius: 6,
                paddingLeft: index == 1 ? 5 : 15,
                paddingRight: index == 1 ? 5 : 15,
              }}>
              {item}
            </Text>
          </View>
        </View>
        {index == selectedId && (
          <View
            style={{
              borderRadius: 5,
              position: 'absolute',
              bottom: 0,
              width: 90,
              height: '5%',
              alignSelf: 'center',
              backgroundColor: 'white',
              // index === setSelectedId ? '#007ff6' : colors.secondaryColor,
            }}
          />
        )}
      </TouchableOpacity>
    );
  }

  getEquiResult(index) {
    this.setState(
      {
        typePeak:
          index == 0 ? 'Basic' : index == 1 ? 'Intermediate' : 'Advanced',
      },
      () => {
        let variables = {
          program: this.state.pkID,
          peakType: this.state.typePeak,
        };

        console.log('hhhdhdhdoo', index, this.state.typePeak);

        TherapistRequest.getStartPeakEqui(variables)
          .then((startpeak) => {
            console.log(
              'xggsgfg',
              startpeak.data.startPeakEquivalance.details.program.id,
            );

            this.setState(
              {equID: startpeak.data.startPeakEquivalance.details.id},
              () => {
                this.PeakEquiGraph(this.state.equID, this.state.typePeak);
              },
            );
          })
          .catch((error) => {
            this.setState({isLoading: false});

            // Alert.alert('Information', error.toString());
          });
      },
    );
  }

  startPeakEquivilance(index) {
    this.setState(
      {
        typePeak:
          this.state.selectedId == 0
            ? 'Basic'
            : this.state.selectedId == 1
            ? 'Intermediate'
            : 'Advanced',
      },
      () => {
        let variables = {
          program: this.state.pkID,
          peakType: this.state.typePeak,
        };

        TherapistRequest.getStartPeakEqui(variables)
          .then((startpeak) => {
            console.log('startpeak__', startpeak);

            this.setState(
              {equID: startpeak.data.startPeakEquivalance.details.id},
              () => {},
            );

            this.props.navigation.navigate('equiquestion', {
              id: this.state.equivilanceData[index].id,
              type: this.state.typePeak,
              student: this.props.route.params.student,
              pk: startpeak.data.startPeakEquivalance.details.program.id,
              equiID: startpeak.data.startPeakEquivalance.details.id,
              category: this.state.cateGory,
              selectedId: this.state.selectedId,
              PKIDGRAPH: this.state.pkID,
            });
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
            console.log(error, error.response);
            this.setState({isLoading: false});

            Alert.alert('Information', error.toString());
          });
      },
    );
  }

  PeakEquiGraph(equiID, typePeak) {
    let variables = {
      pk: equiID,
      peakType: typePeak,
    };
    let scoreTransivityReport = '',
      scoreEquivalanceReport = '',
      scoreReflexivityReport = '',
      scoreSymmetryReport = '';
    let status = [];
    TherapistRequest.getEquiGraph(variables)
      .then((peakGraph) => {
        console.error('PeakGraph', peakGraph);
        this.setState(
          {
            scoreReflexivity: peakGraph?.data?.peakEquData[0]?.totalReflexivity,
            scoreSymmetry: peakGraph?.data?.peakEquData[0]?.totalSymmetry,
            scoreTransivity: peakGraph?.data?.peakEquData[0]?.totalTransivity,
            scoreEquivalance: peakGraph?.data?.peakEquData[0]?.totalEquivalance,
          },
          () => {
            scoreReflexivityReport =
              this.state.scoreReflexivity == 4
                ? 'Completed'
                : this.state.scoreReflexivity == 0
                ? 'Pending'
                : 'In Progress';

            scoreSymmetryReport =
              this.state.scoreSymmetry == 4
                ? 'Completed'
                : this.state.scoreSymmetry == 0
                ? 'Pending'
                : 'In Progress';

            scoreTransivityReport =
              this.state.scoreTransivity == 4
                ? 'Completed'
                : this.state.scoreTransivity == 0
                ? 'Pending'
                : 'In Progress';

            scoreEquivalanceReport =
              this.state.scoreEquivalance == 4
                ? 'Completed'
                : this.state.scoreEquivalance == 0
                ? 'Pending'
                : 'In Progress';

            this.setState({finalStatus: []}, () => {
              status.push(scoreReflexivityReport);
              status.push(scoreSymmetryReport);
              status.push(scoreTransivityReport);
							status.push(scoreEquivalanceReport);
							
							
							console.log("refelxivity report 349 equavalance screen", status)
              this.setState({finalStatus: status});
            });
          },
        );

        //Adding Items To Array.

        // Showing the complete Array on Screen Using Alert.
        // Alert.alert(this.state.finalStatus.toString());
        console.log(
          'yhahakajkajakjak',
          this.state.scoreSymmetry,
          scoreSymmetryReport,
          scoreTransivityReport,
          scoreEquivalanceReport,
        );

        //   Alert.alert(JSON.stringify(peakPrograms))
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        console.log(error, error.response);
        this.setState({isLoading: false});
      });
  }

  ItemList(props) {
    const {item, index, scoreTransivityReport, selectedId, onPress} = props;

    // this.setState({report:scoreEquivalance == 0 ? "Pending":"Inprogress"})

    return (
      <TouchableOpacity
        style={{marginHorizontal: 1}}
        onPress={() => onPress(index)}>
        <View
          style={[
            styles.SquareShapeView,
            {marginTop: 1, flexDirection: 'row'},
          ]}>
          <Text
            style={[
              styles.questionTitle,
              {
                fontFamily: 'SF Pro Text',
                color: 'black',
                elevation: 10,
              },
            ]}>
            {props.item.name}
          </Text>
          <Text
            style={[
              styles.questionTitle,
              {
                fontFamily: 'SF Pro Text',
                elevation: 10,
                position: 'absolute',
                right: 20,
                top: 7,
                color:
                  scoreTransivityReport == 'Pending'
                    ? 'red'
                    : scoreTransivityReport == 'In Progress'
                    ? '#FF8080'
                    : '#4BAEA0',
              },
            ]}>
            {scoreTransivityReport}
          </Text>
          {/*<Text style={[styles.questionTitle, {marginLeft: 10, width: '90%'}]}>this.state.report</Text>*/}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let {isLoading, isInLandscape} = this.state;
    const {student} = this.props.route.params;
    const text = ['Basic', 'Intermediate', 'Advanced'];

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="Equivalance"
          enable={this.props.disableNavigation != true}
          disabledTitle={true}
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            style={{backgroundColor: '#FFFFFF'}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 8,
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 5,
                  fontFamily: 'SF Pro Text',
                }}>
                {'Learner : ' +
                  student.node.firstname +
                  ' ' +
                  student.node.lastname}
              </Text>

              <View>
                {/*<Text style={{marginRight:10,marginTop:4,fontSize:10}}>Age: 10 </Text>*/}
                {/*<Text style={{fontSize:10}}>Area: {question.area.name}</Text>*/}
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#eee',
                elevation: 12,
                borderRadius: 5,
                marginBottom: 20,
                marginTop: 10,
              }}>
              <Image
                style={styles.peakImage}
                source={require('../../../../android/img/peak.jpg')}
              />
            </View>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FlatList
                style={{marginTop: 15, width: 320}}
                bounces
                horizontal
                data={text}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <this.Item
                    item={item}
                    selectedId={this.state.selectedId}
                    index={index}
                    onPress={(index) => {
                      this.setState({selectedId: index});
                      this.getEquiResult(index);
                      {
                        // this.setState({finalStatus: []},() =>{
                        //
                        // });
                      }
                    }}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

            <FlatList
              style={{marginTop: 30}}
              bounces
              data={this.state.equivilanceData}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <this.ItemList
                  selectedId={this.state.selectedIdData}
                  item={item}
                  index={index}
                  scoreTransivityReport={this.state.finalStatus[index]}
                  onPress={(index) => {
                    this.setState({selectedIdData: index});
                    {
                      this.startPeakEquivilance(index);
                    }

                    // this.props.navigation.navigate('equiquestion', {
                    //     id: this.state.equivilanceData[index].id,
                    //     type: this.state.selectedId == 0 ? 'Basic' : this.state.selectedId == 1?
                    //         'Intermediate' : 'Advanced',
                    //     student: this.props.route.params.student,
                    //     pkID:this.state.pkID,
                    // })
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>

          {/*<Button*/}
          {/*    style={{ marginBottom: 10 }}*/}
          {/*    labelButton="Create Program"*/}
          {/*    onPress={() => {*/}

          {/*    }}*/}
          {/*/>*/}
        </Container>
        {isLoading && (
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  TextInputStyleClass: {
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    height: 110,
    marginVertical: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  SquareShapeView: {
    backgroundColor: Color.white,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation:
      OrientationHelper.getDeviceOrientation() == 'landscape' ? 5 : 0.5,
    borderWidth: 0.5,
    borderColor:
      OrientationHelper.getDeviceOrientation() == 'landscape'
        ? 'black'
        : 'lightgrey',
  },
  tabText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    width: '100%',
    marginBottom: 5,
    elevation: 10,
    justifyContent: 'center',
    color: 'lightgrey',
    alignItems:
      OrientationHelper.getDeviceOrientation() == 'landscape'
        ? 'stretch'
        : 'center',
  },

  peakImage: {
    width: '90%',
    height: OrientationHelper.getDeviceOrientation() == 'landscape' ? 350 : 200,
    borderRadius: 5,
    paddingVertical: 16,
    padding: 5,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(equivalanceOption);
