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
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import WS from 'react-native-websocket';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import {
  getLanguage,
  getAuthResult,
  getAuthToken,
  getAuthTokenPayload,
  getStudentId,
} from '../../redux/reducers/index';
import HomeCard from '../../components/HomeCard';
import {
  client,
  getCountries,
  verifyToken,
  refreshToken,
} from '../../constants/index';
import {gql} from 'apollo-boost';
import StudentHelper from '../../helpers/StudentHelper';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import store from '../../redux/store';
// import createStore from '../../redux';
import Color from '../../utility/Color';
import OrientationHelper from '../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../components/GridSystem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStr} from '../../../locales/Locale';
import ParentRequest from '../../constants/ParentRequest';
import TherapistRequest from '../../constants/TherapistRequest';

let doctorsImg = require('../../../android/img/doctors.png');

class HomeScreening extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caseManger: '',
      caseNumber: 0,
      email: '',
      firstNamme: '',
      unreadCount: 0,
      notifications: [],
    };
    this.showAutismScreening = this.showAutismScreening.bind(this);
    this.showTherapyHome = this.showTherapyHome.bind(this);
    this.showCommunity = this.showCommunity.bind(this);
    this.showDoctors = this.showDoctors.bind(this);
    // console.log("HomeScreening: props"+JSON.stringify(this.props));
    // console.log("---------------------"+JSON.stringify(store.getState()));
    console.log('sarthak', this.props);
  }
  componentDidMount() {
    console.log('props homescreening 71', this.props);

    console.error('store data', store.getState());
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

    this.props.navigation.addListener('focus', () => {
      // this.setState({unreadCount: 0})
      this.getCaseMangerValue();
    });
  }
  componentWillMount() {
    // this.getCaseMangerValue()
  }

  showAutismScreening() {
    let {navigation} = this.props;
    navigation.navigate('ScreeningList', {
      fromParent: true,
    });
  }

  showDoctors() {
    let {navigation} = this.props;
    navigation.navigate('VerifiedDoctors');
  }

  showCommunity() {
    let {navigation} = this.props;
    navigation.navigate('ParentCommunity');
  }

  showTherapyHome() {
    let {navigation} = this.props;
    navigation.navigate('TherapyHome');
  }

  renderAutism() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showAutismScreening();
        }}
        activeOpacity={0.8}
        style={styles.card}>
        <HomeCard
          title={getStr('homeScreenAutism.AutismScreening')}
          descr={getStr('homeScreenAutism.description')}
          // startText="Start Screening"
          startText={getStr('homeScreenAutism.startScreening')}
          bgcolor="#254056"
          bgimage={'screening'}
        />
      </TouchableOpacity>
    );
  }

  renderTherapy() {
    let studentName = StudentHelper.getStudentName();
    let desciption = getStr('homeScreenAutism.therapyDescription');
    desciption = desciption.replace('{name}', studentName);
    return (
      <TouchableOpacity
        onPress={() => {
          this.showTherapyHome();
        }}
        activeOpacity={0.8}
        style={styles.card}>
        <HomeCard
          title={getStr('homeScreenAutism.AutismTherapy')}
          descr={desciption}
          // startText="Start Therapy"
          startText={getStr('homeScreenAutism.startTherapy')}
          bgcolor="#D7A185"
          bgimage={'therapy'}
        />
      </TouchableOpacity>
    );
  }

  renderCommunity() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showCommunity();
        }}
        activeOpacity={0.8}
        style={styles.card}>
        <HomeCard
          title={getStr('homeScreenAutism.ParentCommunity')}
          descr={getStr('homeScreenAutism.parentDesription')}
          newFlag={true}
          bgcolor="#0095B6"
          bgimage={'community'}
        />
      </TouchableOpacity>
    );
  }

  getCaseMangerValue() {
    // console.log("getTherapyPrograms() is called");
    this.setState({isLoading: true});
    let variables = {
      studentId: store.getState().user.student.id,
    };
    let firstName = {
      firstNaame: store.getState().user.student.firstname,
    };

    console.log(
      '----------SAMMM--------------------' +
        JSON.stringify(variables) +
        JSON.stringify(firstName),
    );
    this.setState({firstNamme: firstName});
    ParentRequest.fetchTherapyProgramsData(variables)
      .then((programsData) => {
        console.log('QWERRTT ' + programsData);

        this.setState({
          caseManger: programsData.data.student.caseManager.name,
          caseNumber: programsData.data.student.caseManager.contactNo,
          email: programsData.data.student.caseManager.email,
        });
        AsyncStorage.setItem('CaseManager', this.state.caseManger);
        AsyncStorage.setItem('CaseManagerPhoneNumber', this.state.caseNumber);
        AsyncStorage.setItem('CaseManageremail', this.state.email);
        this.getNotificationList();
      })
      .catch((error) => {
        AsyncStorage.getItem('CaseManager').then((result) => {
          console.log('SSSSSSSSS: ' + result);
          this.setState({caseManger: result});
        });
        AsyncStorage.getItem('CaseManagerPhoneNumber').then((result) => {
          console.log('SSSSSSSSS: ' + result);
          this.setState({caseNumber: result});
        });
        AsyncStorage.getItem('CaseManageremail').then((result) => {
          console.log('SSSSSSSSS: ' + result);
          this.setState({email: result});
        });
        console.log('ErrorSSD: ' + JSON.stringify(error));
        this.setState({isLoading: false}, () => {});
      });
  }

  getNotificationList(student) {
    this.setState({isLoading: true});
    // console.log('store data==', store.getState().user.student.id);
    // console.log('sarthak==', store.getState().user.id);

    let variables = {
      student: store.getState().user.id,
      // student: 'VXNlclR5cGU6MjI2MQ==',
    };
    console.log('Notificationa==', variables);
    ParentRequest.fetchNotifications(variables)
      .then((profileData) => {
        console.error('notification called');
        this.setState({isLoading: false});
        let notificationArray = [];
        let notifications = profileData?.data?.notification?.edges;
        console.error('profiledata', profileData);
        console.error('Notification==', notifications);
        this.setState({unreadCount: 0});
        for (let i = 0; i < notifications.length; i++) {
          let noti = notifications[i]?.node;
          notificationArray.push(noti);
          if (noti?.read === false) {
            this.setState({unreadCount: this.state.unreadCount + 1});
          } else {
            // this.setState({unreadCount: 0})
          }
        }
        console.log('Notification==', notificationArray);
        this.setState({notifications: notificationArray});
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.log(error, error.response);
        //
        Alert.alert('Information noti', error.toString());
      });
  }
  //U3R1ZGVudFR5cGU6NjQ5
  renderDoctor() {
    let imgFile = doctorsImg;

    return (
      // <TouchableOpacity onPress={() => { this.showDoctors() }} activeOpacity={0.8}
      //                   style={styles.card}>
      //     <HomeCard title={getStr('NewData.CaseManger')+this.state.caseManger}
      //               descr={this.state.caseNumber+this.state.email+getStr('NewData.descrii')+this.state.caseManger+getStr('NewData.descrii1')}
      //         // startText="Start Screening"
      //         newFlag={false}
      //               bgcolor="#EC3ADA"
      //               bgimage={'screening'} />
      //
      //
      //
      // </TouchableOpacity>

      <View
        style={[
          styles.cardBlock,
          {
            flexDirection: 'row',
            backgroundColor: '#EC3ADA',
            marginBottom: 20,
            borderRadius: 5,
          },
        ]}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={[
              styles.cardHeader,
              {color: '#FFFFFF', fontSize: 22, marginLeft: 14, marginTop: 3},
            ]}>
            {getStr('NewData.CaseManger')}
          </Text>

          <Text
            style={[
              styles.cardDescr,
              {
                color: '#FFFFFF',
                marginTop: 8,
                marginLeft: 16,
                marginBottom: 10,
              },
            ]}>
            {getStr('NewData.descrii') +
              store.getState().user.student.firstname +
              getStr('NewData.descrii1') +
              this.state.caseManger +
              getStr('NewData.descrii2')}
          </Text>
          {this.props.startText && (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View>
                <Text style={styles.cardStart}>{this.props.startText}</Text>
              </View>
              <View style={{paddingTop: 20}}>
                <MaterialCommunityIcons
                  name={'arrow-right'}
                  color={'#ffffff'}
                  size={24}
                />
              </View>
            </View>
          )}

          {/*<View style={{ flex: 1, flexDirection:'row' }}>*/}
          {/*    <Text style = {{color:'white',marginLeft:14}}>{getStr('NewData.Name')}</Text>*/}
          {/*    <Text style={{ color:'white',fontWeight:'bold'}}> {this.state.caseManger.length == 0 ? "N/A" : this.state.caseManger}</Text>*/}
          {/*</View>*/}
          <View style={{flexDirection: 'row', marginLeft: 18}}>
            <MaterialCommunityIcons
              name={'phone'}
              color={'#ffffff'}
              size={20}
            />
            {/*<Text style = {{color:'white',marginLeft:14}}>{getStr('NewData.PhoneNumber')}</Text>*/}
            <Text style={{color: 'white', fontWeight: 'normal', marginLeft: 5}}>
              {' '}
              {this.state.caseNumber}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              fontWeight: 'normal',
              marginTop: 5,
              marginLeft: 18,
            }}>
            <MaterialCommunityIcons
              name={'email'}
              color={'#ffffff'}
              size={20}
            />
            {/*<Text style = {{color:'white',marginLeft:14,}}>{getStr('NewData.Email')}</Text>*/}
            <Text style={{color: 'white', marginLeft: 10}}>
              {this.state.email}
            </Text>
          </View>
        </View>
        <View>
          <Image
            style={[styles.img, {marginTop: 15, marginEnd: 8}]}
            source={imgFile}
          />
        </View>
      </View>
    );
  }

  render() {
    let url =
      'wss://application.cogniable.us/ws/notification/' +
      store.getState().user.id;

    console.log('url_notification====', url);
    return (
      <SafeAreaView style={{backgroundColor: Color.white, flex: 1}}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Container>
            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 30,
                    marginBottom: 15,
                  }}>
                  <Text
                    style={{fontSize: 28, fontWeight: 'bold', width: '90%'}}>
                    {getStr('AutismTherapy.Home')}
                  </Text>

                  <View style={{position: 'absolute', right: 10}}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('NotificationScreen', {
                            student: {id: store.getState().user.id},
                            studentId: store.getState().user.id,
                          })
                        }>
                        <MaterialCommunityIcons
                          name="bell-circle"
                          size={35}
                          style={{alignSelf: 'flex-end'}}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 22,
                          width: 22,
                          backgroundColor: 'red',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 11,
                          marginLeft: -7,
                        }}>
                        {this.state.unreadCount < 99 ? (
                          <Text style={{color: 'white', fontWeight: 'bold'}}>
                            {this.state.unreadCount}
                            {/* 123 */}
                          </Text>
                        ) : (
                          <Text style={{color: 'white', fontWeight: 'bold'}}>
                            99+
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                {/*<View style={{color:'yellow'}}>*/}
                {/*    <View style={{ flex: 1, flexDirection:'row' }}>*/}
                {/*        <Text style = {{color:'black'}}>{getStr('NewData.CaseManger')}</Text>*/}
                {/*        <Text style={{marginLeft:5, color:'#0090e4',fontWeight:'bold'}}>{this.state.caseManger.length == 0 ? "N/A" : this.state.caseManger}</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}
                {/*<View style={{color:'yellow',marginBottom:5}}>*/}
                {/*    <View style={{ flex: 1, flexDirection:'row' }}>*/}
                {/*        <Text style = {{color:'black'}}>{getStr('NewData.PhoneNumber')}</Text>*/}
                {/*        <Text style={{marginLeft:5, color:'#0090e4',fontWeight:'bold'}}>{this.state.caseNumber.length == 0 ? "N/A" : this.state.caseNumber }</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}

                {this.renderAutism()}
                {this.renderTherapy()}

                {this.renderDoctor()}
                {this.renderCommunity()}
                {/*{this.getCaseMangerValue()}*/}
              </>
            )}

            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 30,
                    marginBottom: 15,
                  }}>
                  <Text
                    style={{fontSize: 28, fontWeight: 'bold', width: '90%'}}>
                    {getStr('AutismTherapy.Home')}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('NotificationScreen')
                    }>
                    <MaterialCommunityIcons
                      name="bell-circle"
                      size={30}
                      style={{alignSelf: 'flex-end'}}
                    />
                  </TouchableOpacity>
                </View>
                {/*<View style={{color:'yellow'}}>*/}
                {/*    <View style={{ flex: 1, flexDirection:'row' }}>*/}
                {/*        <Text style = {{color:'black'}}>{getStr('NewData.CaseManger')}</Text>*/}
                {/*        <Text style={{marginLeft:5, color:'#0090e4',fontWeight:'bold'}}>{this.state.caseManger.length == 0 ? "N/A" : this.state.caseManger}</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}
                {/*<View style={{color:'yellow',marginBottom:5}}>*/}
                {/*    <View style={{ flex: 1, flexDirection:'row' }}>*/}
                {/*        <Text style = {{color:'black'}}>{getStr('NewData.PhoneNumber')}</Text>*/}
                {/*        <Text style={{marginLeft:5, color:'#0090e4',fontWeight:'bold'}}>{this.state.caseNumber.length == 0 ? "N/A" : this.state.caseNumber }</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}

                {this.renderAutism()}
                {this.renderTherapy()}

                {this.renderDoctor()}
                {this.renderCommunity()}
                {/*{this.getCaseMangerValue()}*/}
              </>
              // <>
              //     <Row>
              //         <Column>
              //             <Text style={styles.title}>Home</Text>
              //         </Column>
              //     </Row>
              //     <Row>
              //         <Column>
              //             {this.renderAutism()}
              //             {this.renderCommunity()}
              //         </Column>
              //         <Column>
              //             {this.renderTherapy()}
              //             {this.renderDoctor()}
              //         </Column>
              //     </Row>
              // </>
            )}
            <WS
              ref={(ref) => {
                this.ws = ref;
              }}
              url={url}
              onOpen={() => {
                console.log('Open!');
                // this.ws.send("How are you ?");
              }}
              onMessage={(msg) => {
                let data = msg.data;
                console.log('OnMessage Triggered', data);
              }}
              onError={(err) => {
                // console.log("onError", err.message, url);
              }}
              onClose={(err) => {
                console.log('onClose', err);
              }}
              reconnect // Will try to reconnect onClose
            />
          </Container>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  card: {
    marginBottom: 16,
  },
});
const mapStateToProps = (state) => ({
  lang: getLanguage(state),
  authResult: getAuthResult(state),
  getAuthToken: getAuthToken(state),
  studentId: getStudentId(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreening);
