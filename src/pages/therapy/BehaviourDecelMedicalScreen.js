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
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import BehaviourDecelMedicalCard from '../../components/BehaviourDecelMedicalCard';
import BehaviourDecelVideoCard from '../../components/BehaviourDecelVideoCard';
import {getAuthResult} from '../../redux/reducers/index';
import {setToken, setMedicalData} from '../../redux/actions/index';
import moment from 'moment/min/moment-with-locales';
import DateHelper from '../../helpers/DateHelper';
import ParentRequest from '../../constants/ParentRequest';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import AddNewMedication from './AddNewMedication';
import LoadingIndicator from '../../components/LoadingIndicator';
import NoData from '../../components/NoData';
import {getStr} from '../../../locales/Locale';
import CalendarView from '../../components/CalendarView';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class BehaviourDecelMedicalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noDataText: '',
      medicalItems: [],
      selectedDate: DateHelper.getTodayDate(),
    };
    //save to redux for access inside LeaveRequestNew screen
    this.props.dispatchSetMedicalData(this);
  }

  componentWillUnmount() {
		//remove from redux
		
		console.error("props vehaviourdecelmedicalscreen 55", this.props)
    this.props.dispatchSetMedicalData(null);
  }

  _refresh() {
    this.getData();
  }

  componentDidMount() {
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    let studentId = this.props.route.params.studentId;
    let selectedDate = this.state.selectedDate;
    console.log(studentId + ',' + selectedDate);
    this.getMedicalData(studentId, selectedDate);
    // this.getMedicalData(variables);
  }

  getMedicalData(studentId, selectedDate) {
    this.setState({isLoading: true, medicalItems: []});
    let variables = {
      studentId: studentId,
      date: selectedDate,
    };
    console.log('stu', studentId);
    console.log('Vars', variables);
    ParentRequest.fetchMedicalData(variables)
      .then((medicalData) => {
        console.log('fetchMedicalData', medicalData);
        if (medicalData.data.getMedication.edges.length === 0) {
          this.setState({noDataText: 'No data found'});
        }
        this.setState({
          medicalItems: medicalData.data.getMedication.edges,
          isLoading: false,
        });
      })
      .catch((error) => {
        Alert.alert('Information', error.toString());
        console.log('Error: ', JSON.parse(JSON.stringify(error)));
        this.setState({isLoading: false});
      });
  }

  // callBackFromCalendar(selectedDate) {
  //     console.log("callBackFromCalendar", selectedDate);
  //     this.setState({ selectedDate }, () => {
  //         this.getData();
  //     });
  // }

  callBackFromCalendar(selectedDate) {
    console.log(selectedDate);
    console.log(this.state.selectedDate);
    if (selectedDate != this.state.selectedDate) {
      this.setState({selectedDate}, () => {
        this.getData();
      });
    }
  }

  getMedicalCard(element, index) {
    let studentId = this.props.route.params.studentId;
    return (
      <BehaviourDecelMedicalCard
        key={index}
        title={element.node.condition}
        description={element.node.note}
        time={element.node.startDate}
        time2={element.node.endDate}
        riskType={element.node.severity.name}
        onPress={() => {
          this.props.navigation.navigate('AddNewMedication', {
            studentId: studentId,
            medication: element,
            parent: this,
          });
        }}
      />
    );
  }

  getMedicalVideoData = () => {
    let data = [
      {title: getStr('MedicalData.textDescr'), videoDuration: '5 Min'},
    ];
    return data;
  };

  renderList() {
    let {isLoading, medicalItems, weeks} = this.state;
    let studentId = this.props.route.params.studentId;
    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic">
          <CalendarView
            dates={weeks}
            parentCallback={(date) => this.callBackFromCalendar(date)}
            selectedDate={this.state.selectedDate}
          />

          {/* <BehaviourDecelVideoCard
                    title={mealData.title}
                    videoDuration={mealData.videoDuration} /> */}
          {isLoading && <LoadingIndicator />}
          {medicalItems.length == 0 && (
            <NoData>{getStr('MedicalData.medicalData')}</NoData>
          )}
          {medicalItems
            .slice(0)
            .reverse()
            .map((element, index) => this.getMedicalCard(element, index))}
        </ScrollView>
        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
          <View style={{paddingVertical: 5}}>
            <Button
              labelButton={getStr('MedicalData.NewMedicalData')}
              onPress={() => {
                this.props.navigation.navigate('AddNewMedication', {
                  studentId: studentId,
                  parent: this,
                });
              }}
            />
          </View>
        )}
      </>
    );
  }

  render() {
    let {isLoading, medicalItems, noDataText} = this.state;
    let studentId = this.props.route.params.studentId;

    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <NavigationHeader
          title={getStr('AutismTherapy.MedicalData')}
          backPress={() => this.props.navigation.goBack()}
        />
        <Container>
          {/* {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <CalendarView parentCallback={(date) => this.callBackFromCalendar(date)}
                                selectedDate={this.state.selectedDate} />
                            {isLoading && <View style={{ flex: 1 }}><LoadingIndicator /></View>}
                            {!isLoading && this.renderList()}
                            <Text>{this.state.selectedDate}</Text>
                        </>
                    )} */}
          {OrientationHelper.getDeviceOrientation() == 'portrait' &&
            this.renderList()}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <Row style={{flex: 1}}>
              <Column style={{flex: 2}}>
                <CalendarView
                  parentCallback={(date) => this.callBackFromCalendar(date)}
                  selectedDate={this.state.selectedDate}
                />
                {isLoading && (
                  <View style={{flex: 1}}>
                    <LoadingIndicator />
                  </View>
                )}
                {!isLoading && this.renderList()}
              </Column>
              <Column>
                <AddNewMedication
                  disableNavigation
                  route={{
                    params: {
                      studentId: studentId,
                      parent: this,
                    },
                  }}
                />
              </Column>
            </Row>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    height: screenHeight - 100,
    paddingBottom: 100,
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
    width: '80%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
  },
  //
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 20,
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
    bottom: 20,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
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
)(BehaviourDecelMedicalScreen);
