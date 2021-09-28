import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import Color from '../utility/Color';
import NavigationHeader from '../components/NavigationHeader';
import OrientationHelper from '../helpers/OrientationHelper';
import ParentRequest from '../constants/ParentRequest';
import store from '../redux/store';
import {getAuthResult, getStudentId} from '../redux/reducers';
import {connect} from 'react-redux';
import moment from "moment";
import {getStr} from "../../locales/Locale";

const width = Dimensions.get('window').width;

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notifications: [],
    };
  }
  componentDidMount(){
    console.error("props notification screen 34", this.props.route.params)
    this.getNotificationList();
  }
  getNotificationList() {
    this.setState({isLoading: true});
    console.log('store data==', store.getState().user);

    let variables = {
      student: this.props.route.params.student.node ? this.props.route.params.student.node.parent.id : this.props.route.params.student.id,
      // student: "VXNlclR5cGU6MjAyNA==",
    };
    console.log('Notificationa==', variables);
    ParentRequest.fetchNotifications(variables)
      .then(profileData => {
        this.setState({isLoading: false});
        let notificationArray = [];
        let notifications = profileData.data.notification.edges;
        console.log('Notification==', JSON.stringify(notifications));
        for (let i = 0; i < notifications.length; i++) {
          let noti = notifications[i].node;
          notificationArray.push(noti);
        }
        console.log('Notification==', notificationArray);
        this.setState({notifications: notificationArray});
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error, error.response);
        //
        Alert.alert('Information', error.toString());
      });
  }

  markNotiAsRead = (noti) => {

    noti.read = true

    const variables = {
      pk: noti.id,
      read: noti.read
    }

    ParentRequest.markAsReadNoti(variables).then((res) => console.error("error", res) )

    console.error("usertype", store.getState().user.userType)

    if(noti.notifyType === "MEAL") {
      if(store.getState().user.userType.name === "parents") {
        this.props.navigation.navigate("BehaviourDecelMealScreen", {
          student: store.getState().user.student,
          studentId: store.getState().user.student.id
        })
      } else {
        this.props.navigation.navigate("BehaviourDecelMealScreen", {
          student: this.props.route.params?.student?.node ? this.props.route.params.student.node : this.props.route.params.student,
          studentId: this.props.route.params.student.node ? this.props.route.params.student.node.id : this.props.route.params.student.id
        })
      }
    } else if(noti.notifyType === "MEDICAL") {
      if(store.getState().user.userType.name === "parents") {
        this.props.navigation.navigate("BehaviourDecelMedicalScreen", {
          student: store.getState().user.student,
          studentId: store.getState().user.student.id
        })
      } else {
        this.props.navigation.navigate("BehaviourDecelMedicalScreen", {
          student: this.props.route.params?.student?.node ? this.props.route.params.student.node : this.props.route.params.student,
          studentId: this.props.route.params.student.node ? this.props.route.params.student.node.id : this.props.route.params.student.id
        })
      }
    } else if(noti.notifyType === "APPOINTMENT") {
      if(store.getState().user.userType.name === "parents") {
        this.props.navigation.navigate("Calendar",  {screen :"CalendarScreen"})
      } else if(store.getState().user.userType.name === "therapist") {
        this.props.navigation.navigate("Calendar", {screen :"CalendarHome"})
      } else if(store.getState().user.userType.name === "school_admin") {
        this.props.navigation.navigate("Calendar", {screen :"CalendarHome"})

      }
      
    } else if(noti.notifyType === "ABC") {
      if(store.getState().user.userType.name === "parents") {
        this.props.navigation.navigate("BehaviourDecelToiletScreen", {
          student: store.getState().user.student,
          studentId: store.getState().user.student.id
        })
      } else {
        this.props.navigation.navigate("BehaviourDecelToiletScreen", {
          student: this.props.route.params?.student?.node ? this.props.route.params.student.node : this.props.route.params.student,
          studentId: this.props.route.params.student.node ? this.props.route.params.student.node.id : this.props.route.params.student.id
        })
      }
    } else if(noti.notifyType === "BEHAVIOR") {
      if(store.getState().user.name === "parents") {
        this.props.navigation.navigate("BehaviourDecelDataScreen", {
          student: store.getState().user.student,
          studentId: store.getState().user.student.id
        })
      } else {
        this.props.navigation.navigate("BehaviourDecelDataScreen", {
          student: this.props.route.params?.student?.node ? this.props.route.params.student.node : this.props.route.params.student,
          studentId: this.props.route.params.student.node ? this.props.route.params.student.node.id : this.props.route.params.student.id
        })
      }
    }

  }

  renderNotification = () => {
    {
      return this.state.notifications.map((notification, key) => {
        console.log("received noti", notification)
        // // debugger;
        let currentTime = moment(notification.timestamp, 'YYYY-MM-DDTHH: mm: ss').format('YYYY-MM-DD');
        return (
          <View style={[styles.contentBox, {paddingHorizontal: 16}]} key={key}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => {
                console.log('123', notification);
                notification.read = true
                this.markNotiAsRead(notification)
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: "100%"}}>
              <View style={{width: 5, height: 5}} />
              <Text style={styles.textSmall}>{currentTime}</Text>
              {!notification.read ? <View style={{borderRadius: 5}}><Text style={{color: Color.primaryButton}}>New</Text></View> : <View style={{height: 5, width: 5}} />}
              </View>
              {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginRight: 20,
                  }}>
                  <Text
                    style={[styles.textSmall, {color: Color.primaryButton}]}>
                    {notification.title}
                  </Text>
                  <View style={styles.dot} />
                  <Text style={[styles.textSmall, {}]}>
                    {notification.description}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.line} />
            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
              <TouchableOpacity onPress={() => {
                notification.read = true
                this.markNotiAsRead(notification)
              }} style={{marginVertical: 4}}>
                <Text style={[styles.textSmall, {color: Color.primaryButton}]}>
                  {notification.title}
                </Text>
                <Text style={[styles.textSmall, {}]}>
                  {notification.description}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      });
    }
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={getStr('ExtraAdd.Notification')}
        />
        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.isLoading} />}
          style={{marginHorizontal: 10}}>
          {this.renderNotification()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  headerImage: {
    width: 32,
    height: 32,
    alignSelf: 'flex-end',
    borderRadius: 16,
  },
  // smallImage: {
  //   width: width / 15, height: width / 15, borderRadius: 2,
  // },
  bigImage: {
    width: 100,
    height: 120,
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  row: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentBox: {
    marginVertical: 12,
    marginHorizontal: 3,
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
    fontSize: 20,
  },
  textBig: {
    fontSize: 20,
  },
  textSmall: {
    fontSize: 15,
  },
  buttonStart: {
    backgroundColor: Color.primaryButton,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 10,
  },
  buttonStartText: {
    color: Color.white,
  },
  buttonEnd: {
    flex: 1,
    borderColor: Color.primaryButton,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonEndText: {
    color: Color.primaryButton,
  },
  line: {
    height: 1,
    width: width,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: Color.silver,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  card: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Color.purpleCard,
    borderRadius: 8,
  },

  taskStyle: {
    flexDirection: 'row',
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
    padding: 10,
    margin: 3,
    marginBottom: 10,
  },
  taskStyleTitle: {
    color: Color.black,
    fontSize: 14,
  },
  taskStylePriority: {
    color: Color.greenPie,
    fontSize: 12,
  },
  assignThumbnail: {
    width: 20,
    height: 20,
    borderRadius: 2,
  },

  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 5,
    margin: 3,
    marginBottom: 10,
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});

const mapStateToProps = state => ({
  authResult: getAuthResult(state),
  studentId: getStudentId(state),
});

//export default App;
export default connect(
  mapStateToProps,
  null,
)(NotificationScreen);
