import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getStr} from '../../../locales/Locale';
import {connect} from 'react-redux';
import DateHelper from '../../helpers/DateHelper';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import AddNewMeal from './AddNewMeal';
import ParentRequest from '../../constants/ParentRequest';
import NoData from '../../components/NoData';
import LoadingIndicator from '../../components/LoadingIndicator';
import moment from 'moment/min/moment-with-locales';
import CalendarView from '../../components/CalendarView';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class BehaviourDecelMealScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: DateHelper.getTodayDate(),
      weeks: DateHelper.getCurrentWeekDates(),
      isLoading: true,
      foodItems: [],
      studentId: props.route.params.studentId,
      student: props.route.params.student,
    };
  }

  componentDidMount() {

    console.error("params 49 behaviourdecelmealscreen", this.props)
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});

    let variables = {
      date: this.state.selectedDate,
      studentId: this.state.studentId,
    };

    console.log(variables);

    ParentRequest.getFoodData(variables)
      .then((res) => {
        console.log('getFoodData', res);

        let foodItems = res.data.getFood.edges;

        console.log('foodItems', foodItems);
        this.setState({isLoading: false, foodItems});
      })
      .catch((err) => {
        this.setState({isLoading: false});
        Alert.alert('Information', err.toString());
      });
  }

  callBackFromCalendar(selectedDate) {
    console.log(selectedDate);
    console.log(this.state.selectedDate);
    if (selectedDate != this.state.selectedDate) {
      this.setState({selectedDate}, () => {
        this.getData();
      });
    }
  }

  getMealVideoData() {
    let data = [{title: 'Text about meal data', videoDuration: '5 Min'}];
    return data;
  }

  getFoodItemCard(element, index) {
    let {studentId, student} = this.state;
    let foodType = element.node.foodType.name;
    let foodStyle = '';
    if (foodType === 'Junk Food') {
      foodStyle = eval('styles.junkFood');
    } else if (foodType === 'Balanced Meal') {
      foodStyle = eval('styles.balancedMeal');
    } else if (foodType === 'Nutritional Snacks') {
      foodStyle = eval('styles.nutritionalSnacks');
    }

    let water = element.node.waterIntake;
    water = water.replace(/\D/g, '');

    return (
      <TouchableOpacity
        style={styles.card}
        key={index}
        activeOpacity={0.9}
        onPress={() => {
          this.props.navigation.navigate('AddNewMeal', {
            food: element,
            studentId: studentId,
            student: student,
            parent: this,
          });
        }}>
        <Text style={styles.title}>{element.node.mealType}</Text>
        <Text style={styles.mealName}>{element.node.mealName}</Text>
        <Text style={styles.waterIntake}>Water {water} ml</Text>
        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Text style={{color: '#63686E', fontSize: 13, fontWeight: '500'}}>
            {/* {moment(element.node.date).format("DD MMM YYYY")} - {element.node.mealTime}</Text> */}
            {moment(element.node.date).format('DD MMM YYYY')} -{' '}
            {moment(element.node.mealTime, ['h:mm A']).format('hh:mm A')}
          </Text>
          <Text
            style={{
              top: -7,
              paddingLeft: 10,
              color: '#C4C4C4',
              fontSize: 18,
              fontWeight: '700',
            }}>
            .
          </Text>
          <Text style={[styles.intensity, foodStyle]}>
            {element.node.foodType != null ? element.node.foodType.name : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderList() {
    let {isLoading, studentId, student, foodItems, weeks} = this.state;

    let mealData = this.getMealVideoData()[0];

    if (isLoading) {
      // return <LoadingIndicator />;
    }

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <CalendarView
          dates={weeks}
          parentCallback={(date) => this.callBackFromCalendar(date)}
          selectedDate={this.state.selectedDate}
        />

        {/* <BehaviourDecelVideoCard
                    title={mealData.title}
                    videoDuration={mealData.videoDuration} /> */}
        {isLoading && <LoadingIndicator />}
        {foodItems.length == 0 && <NoData>No Meal Available</NoData>}

        {foodItems
          .slice(0)
          .reverse()
          .map((element, index) => {
            return this.getFoodItemCard(element, index);
          })}
      </ScrollView>
    );
  }

  render() {
    let {isLoading, studentId, student, foodItems, weeks} = this.state;

    let mealData = this.getMealVideoData()[0];

    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <NavigationHeader
          title={getStr('AutismTherapy.MealData')}
          backPress={() => this.props.navigation.goBack()}
        />

        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' &&
            this.renderList()}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <Row style={{flex: 1}}>
                <Column style={{flex: 2}}>{this.renderList()}</Column>
                <Column>
                  <AddNewMeal
                    disableNavigation
                    route={{
                      params: {
                        studentId: studentId,
                        student: student,
                        parent: this,
                      },
                    }}
                  />
                </Column>
              </Row>
            </>
          )}

          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <Button
              labelButton={getStr('AutismTherapy.NewMeal')}
              style={{marginBottom: 10}}
              onPress={() => {
                this.props.navigation.navigate('AddNewMeal', {
                  studentId: studentId,
                  student: student,
                  parent: this,
                });
              }}
            />
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
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    // marginRight: 10
  },

  //
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
    bottom: 20,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },

  card: {
    padding: 10,
    borderRadius: 8,
    margin: 3,
    marginVertical: 8,

    backgroundColor: '#fff',
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
    color: '#45494E',
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    paddingTop: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: 'normal',
  },
  intensity: {
    paddingLeft: 10,
    color: '#63686E',
    fontSize: 13,
    fontWeight: '500',
  },
  junkFood: {
    color: '#FF9C52',
  },
  balancedMeal: {
    color: '#4BAEA0',
  },
  nutritionalSnacks: {
    color: '#FF9C52',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourDecelMealScreen);
