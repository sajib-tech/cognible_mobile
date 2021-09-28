import 'react-native-gesture-handler';
import React, {Component, useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Overlay} from 'react-native-elements';
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
  ActivityIndicator,
  Switch,
  Dimensions,
  RefreshControl,
} from 'react-native';
import store from '../../../redux/store';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ListItem} from 'react-native-elements';

import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import Button from '../../../components/Button';
import ToggleSwitch from 'toggle-switch-react-native';

import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';
import {Row, Container, Column} from '../../../components/GridSystem';

import {connect} from 'react-redux';
import {signout, setToken, setTokenPayload} from '../../../redux/actions/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import moment from 'moment';

import ClinicRequest from "../../../constants/ClinicRequest";
import SupportTicketFieldContainer from '../../Common/Support_Ticket/SupportTicketFieldContainer'



const width = Dimensions.get('window').width;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      familyMembers: [],
      studentProfile: {},
      accountSettings: {},
      isEditingProfile: false,
      email: '',
      phone: '',
      tempEmail: '',
      tempPhone: '',

      name: '',
      lastLogin: store.getState().lastLoginDate,

      medicalReminder: false,
      sessionReminder: false,
      recordingReminder: false,
      isPeakType: false,
      userId: '',
    };
    this.gotoNewFamilyMember = this.gotoNewFamilyMember.bind(this);
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();

    // let vars = {
    //     id: store.getState().user.id
    // };

    // console.log("Vars", vars);

    // TherapistRequest.getUser(vars).then((res) => {
    //     console.log("G", res);
    // }).catch((err) => {
    //     console.log("Err", err);
    // })
  }

  getData() {
    this.setState({isLoading: true});

    let qs = {
      userId: store.getState().user.id,
    };

    console.log(qs);

    TherapistRequest.getProfile(qs)
      .then((dashboardResult) => {
        console.log('DashboardResult', dashboardResult);
        // console.log(JSON.stringify(dashboardResult))

        let edges = dashboardResult.data.userSettings.edges;
        let medicalReminder = false;
        let recordingReminder = false;
        let sessionReminder = false;
        if (edges.length != 0) {
          sessionReminder = edges[0].node.sessionReminders;
          medicalReminder = edges[0].node.medicalReminders;
          recordingReminder = edges[0].node.dataRecordingReminders;
        }
        this.getPeakType(dashboardResult.data.users.id);
        this.setState({
          isLoading: false,
          name: dashboardResult.data.users.name,
          // lastLogin: dashboardResult.data.users.lastLogin,
          email: dashboardResult.data.users.email,
          phone: dashboardResult.data.users?.staffSet.edges[0]?.node?.contactNo,
          medicalReminder,
          recordingReminder,
          sessionReminder,
          userId: dashboardResult.data.users.id,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  getPeakType(userId) {
    this.setState({isLoading: true});
    let variables = {
      user: userId,
    };
    ClinicRequest.getProfileSetting(variables)
      .then((profileData) => {
        console.log('getPeakProfileData===', profileData);
        if (profileData.data.userSettings.edges.length > 0) {
          this.setState({
            isPeakType:
              profileData.data.userSettings.edges[0].node.peakAutomaticBlocks,
          });
        } else {
          this.setState({isPeakType: false});
        }
      })
      .catch((error) => {
        console.log('getPeakProfileError===', error);
        this.setState({isLoading: false});
      });
  }

  setPeakType() {
    let variables = {
      user: this.state.userId,
      peakAutomaticBlocks: this.state.isPeakType,
    };
    ClinicRequest.updateProfileSetting(variables)
      .then((profileData) => {
        console.log('getPeakProfileData===', profileData);
      })
      .catch((error) => {
        console.log('getPeakProfileError===', error);
      });
  }

  gotoNewFamilyMember() {
    let {navigation} = this.props;
    navigation.navigate('NewFamilyMember');
  }

  getView(familyMember, key) {
    return (
      <TouchableOpacity
        onPress={() => {
          //this.props.navigation.navigate('FamilyMemberDetails', { memberId: familyMember.id });
        }}
        style={{paddingHorizontal: 3}}
        activeOpacity={0.9}
        key={key}>
        <View style={styles.memberCard}>
          <Image
            style={{width: 50, height: 50, borderRadius: 5}}
            source={require('../../../../android/img/ravi.jpg')}
          />
          <View style={{paddingLeft: 8, justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'SF Pro Text',
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                color: '#3E7BFA',
              }}>
              {familyMember.memberName}
            </Text>
            <Text
              style={{
                fontFamily: 'SF Pro Text',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 14,
                color: '#45494E',
              }}>
              {familyMember.relationship.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  signOut() {
    Alert.alert(
      'Information',
      'Are you sure want to sign out ?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            this.props.dispatchSignout();
          },
        },
      ],
      {cancelable: false},
    );
  }

  updateProfileInfo() {
    let qs = {
      id: store.getState().user.staffSet.id,
      email: this.state.email,
      phone: this.state.phone,
    };

    console.log(qs);

    TherapistRequest.updateProfile(qs)
      .then((dashboardResult) => {
        Alert.alert('Information', 'Profile successfully updated.');
        this.setState({isEditingProfile: false});
      })
      .catch((err) => {
        Alert.alert('Information', err.toString());
      });
  }

  getProfileEditForm() {
    return (
      <View style={{borderWidth: 0.5, borderColor: '#cfcfcf', padding: 5}}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={this.state.email}
          onChangeText={(emailText) => {
            this.setState({email: emailText});
          }}
        />
        <Text>Phone number</Text>
        <TextInput
          style={styles.input}
          value={this.state.phone}
          maxLength={10}
          keyboardType={'numeric'}
          onChangeText={(phoneText) => {
            this.setState({phone: phoneText});
          }}
        />
        <Text
          style={{
            width: '100%',
            borderRadius: 4,
            color: '#FFFFFF',
            backgroundColor: '#3E7BFA',
            padding: 10,
            textAlign: 'center',
          }}
          onPress={() => {
            this.updateProfileInfo();
          }}>
          Update
        </Text>
      </View>
    );
  }

  updateReminder() {
    let params = {
      userId: store.getState().user.id,
      session: this.state.sessionReminder,
      medical: this.state.medicalReminder,
      recording: this.state.recordingReminder,
    };
    TherapistRequest.updateReminder(params)
      .then((res) => {
        console.log('RES', res);
      })
      .catch((err) => {
        console.log('Err', err);
      });
  }

  renderPeakType = () => {
    const {isPeakType} = this.state;
    return (
      <View activeOpacity={0.9} style={styles.profile}>
        <Text style={Styles.grayTextBold}>Peak Recording</Text>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            width: 130,
            alignItems: 'center',
            height: 35,
            borderColor: Color.primary,
            borderRadius: 5,
            position: 'absolute',
            right: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({isPeakType: true}, () => {
                this.setPeakType();
              });
            }}
            style={{
              alignItems: 'center',
              width: 64,
              height: 34,
              backgroundColor: isPeakType ? Color.primary : Color.white,
              justifyContent: 'center',
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: isPeakType ? Color.white : Color.primary,
                textAlign: 'center',
                textAlignVertical: 'center',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}>
              Automatic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({isPeakType: false}, () => {
                this.setPeakType();
              });
            }}
            style={{
              alignItems: 'center',
              width: 64,
              height: 34,
              justifyContent: 'center',
              backgroundColor: !isPeakType ? Color.primary : Color.white,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: !isPeakType ? Color.white : Color.primary,
                textAlign: 'center',
                textAlignVertical: 'center',
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSupportTicket(){
    return(
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 35, paddingBottom: 15 }}>
                <Text style={{flex: 1, fontSize: 16, marginVertical: 5, color: 'grey'}}>Support Ticket</Text>
                <View style={{ flexDirection: 'row',  }}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate("SupportTicket");
                    }}>
                        <MaterialCommunityIcons
                            name='arrow-right'
                            size={20}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('AddSupportTicket')
                    }}>
                        <MaterialCommunityIcons
                            name='plus'
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <SupportTicketFieldContainer navigation={this.props.navigation} />       
            </View>
        </>
    )
}

  render() {
    let members = [];

    let {
      name,
      email,
      phone,
      tempEmail,
      tempPhone,
      isEditingProfile,
      accountSettings,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Container>
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
            <Text style={styles.title}>Profile</Text>

            <View style={styles.profile}>
              <Image
                style={{width: 56, height: 56, borderRadius: 8}}
                source={require('../../../../android/img/Img-1.png')}
              />
              <View style={{flex: 1, marginHorizontal: 8}}>
                <Text
                  style={[styles.textBig, {fontSize: 18, fontWeight: 'bold'}]}>
                  {name}
                </Text>
                <Text style={Styles.bigGrayText}>N/A</Text>
              </View>
            </View>
            {this.renderSupportTicket()}

            <TouchableOpacity style={[Styles.rowBetween, {marginVertical: 8}]}>
              <Text style={Styles.bigGrayText}>Personal Details</Text>
              <MaterialCommunityIcons
                name="account-edit"
                size={24}
                color={Color.primary}
                onPress={() => {
                  if (isEditingProfile) {
                    this.setState({email: tempEmail, phone: tempPhone});
                  } else {
                    this.setState({tempEmail: email, tempPhone: phone});
                  }
                  this.setState({isEditingProfile: !isEditingProfile});
                }}
              />
            </TouchableOpacity>
            {isEditingProfile && this.getProfileEditForm()}
            {!isEditingProfile && (
              <>
                <View
                  style={[
                    Styles.row,
                    {alignItems: 'flex-start', marginVertical: 8},
                  ]}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={Color.grayFill}
                    style={{width: 20, marginRight: 8}}
                  />
                  <View style={Styles.column}>
                    <Text style={Styles.grayText}>Email Address</Text>
                    <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                      {this.state.email}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    Styles.row,
                    {alignItems: 'flex-start', marginVertical: 8},
                  ]}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={20}
                    color={Color.grayFill}
                    style={{width: 20, marginRight: 8}}
                  />
                  <View style={Styles.column}>
                    <Text style={Styles.grayText}>Mobile Number</Text>
                    <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                      +91 {this.state.phone}
                    </Text>
                  </View>
                </View>
              </>
            )}
            <View
              style={[
                Styles.row,
                {alignItems: 'flex-start', marginVertical: 8},
              ]}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={Color.grayFill}
                style={{width: 20, marginRight: 8}}
              />
              <View style={Styles.column}>
                <Text style={Styles.grayText}>Last Login Date</Text>
                <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                  Last login on{' '}
                  {moment(this.state.lastLogin).format('MMM DD, YYYY')}
                </Text>
              </View>
            </View>
            <View
              style={[
                Styles.row,
                {alignItems: 'flex-start', marginVertical: 8},
              ]}>
              <FontAwesome
                name="dollar"
                size={20}
                color={Color.grayFill}
                style={{width: 20, marginRight: 8}}
              />
              <View style={Styles.column}>
                <Text style={Styles.grayText}>Billing Details</Text>
                <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                  Currently on Basic plan
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ChangePasswordScreen')
              }
              style={[
                Styles.row,
                {alignItems: 'flex-start', marginVertical: 8},
              ]}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={Color.grayFill}
                style={{width: 20, marginRight: 8}}
              />
              <View style={Styles.column}>
                <Text style={Styles.primaryText}>Change Password</Text>
                {/*<Text style={[Styles.primaryText, { marginVertical: 4 }]}>Currently on Basic plan</Text>*/}
              </View>
            </TouchableOpacity>
            {/* Notifications */}
            <Text style={[Styles.bigGrayText, {marginTop: 8}]}>
              Notifications
            </Text>

            <View
              style={[
                Styles.row,
                {alignItems: 'flex-start', marginVertical: 8},
              ]}>
              <View style={Styles.column}>
                <Text style={Styles.grayTextBold}>Session Reminders</Text>
                <Text style={[Styles.grayText, {marginVertical: 4}]}>
                  Reminders for every session
                </Text>
              </View>
              <Switch
                trackColor={{false: Color.gray, true: Color.gray}}
                thumbColor={
                  this.state.sessionReminder
                    ? Color.primary
                    : Color.grayDarkFill
                }
                ios_backgroundColor={Color.gray}
                onValueChange={() => {
                  this.setState(
                    {sessionReminder: !this.state.sessionReminder},
                    () => {
                      this.updateReminder();
                    },
                  );
                }}
                value={this.state.sessionReminder}
              />
            </View>

            <View
              style={[
                Styles.row,
                {alignItems: 'flex-start', marginVertical: 8},
              ]}>
              <View style={Styles.column}>
                <Text style={Styles.grayTextBold}>Data Recording</Text>
                <Text style={[Styles.grayText, {marginVertical: 4}]}>
                  Reminders for Data Recording
                </Text>
              </View>
              <Switch
                trackColor={{false: Color.gray, true: Color.gray}}
                thumbColor={
                  this.state.recordingReminder
                    ? Color.primary
                    : Color.grayDarkFill
                }
                ios_backgroundColor={Color.gray}
                onValueChange={() => {
                  this.setState(
                    {recordingReminder: !this.state.recordingReminder},
                    () => {
                      this.updateReminder();
                    },
                  );
                }}
                value={this.state.recordingReminder}
              />
            </View>

            <View
              style={[
                Styles.row,
                {alignItems: 'flex-start', marginVertical: 8},
              ]}>
              <View style={Styles.column}>
                <Text style={Styles.grayTextBold}>Reminders for Medicine</Text>
                <Text style={[Styles.grayText, {marginVertical: 4}]}>
                  Reminders of Medical
                </Text>
              </View>
              <Switch
                trackColor={{false: Color.gray, true: Color.gray}}
                thumbColor={
                  this.state.medicalReminder
                    ? Color.primary
                    : Color.grayDarkFill
                }
                ios_backgroundColor={Color.gray}
                onValueChange={() => {
                  this.setState(
                    {medicalReminder: !this.state.medicalReminder},
                    () => {
                      this.updateReminder();
                    },
                  );
                }}
                value={this.state.medicalReminder}
              />
            </View>
            {this.renderPeakType()}
            {/* App Settings */}
            <Text style={[Styles.bigGrayText, {marginTop: 8}]}>
              App Settings
            </Text>

            <View style={[Styles.column, {marginVertical: 8}]}>
              <Text style={Styles.grayTextBold}>Get Help</Text>
              <Text style={[Styles.grayText, {marginVertical: 4}]}>
                Get in touch with a support representative
              </Text>
            </View>

            <View style={[Styles.column, {marginVertical: 8}]}>
              <Text style={Styles.grayTextBold}>Privacy &amp; Data</Text>
              <Text style={[Styles.grayText, {marginVertical: 4}]}>
                See how your data is handled
              </Text>
            </View>

            {/* <View style={[Styles.column, { marginVertical: 8 }]}>
                            <Text style={Styles.grayTextBold}>Language</Text>
                            <Text style={[Styles.grayText, { marginVertical: 4 }]}>{accountSettings.language}</Text>
                        </View> */}

            <Button
              style={{marginVertical: 8}}
              theme="secondary"
              labelButton="Sign Out"
              onPress={() => this.signOut()}
            />
            <Text
              style={[
                Styles.grayText,
                {marginVertical: 4, textAlign: 'center'},
              ]}>
              App Version 1.16
            </Text>
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Color.gray,
    // elevation:1,
  },
  header: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  recentImage: {
    width: width / 11,
    height: width / 11,
    borderRadius: 20,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
  },
  bigImage: {
    width: width / 3,
    height: width / 3.3,
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  recentBox: {
    marginHorizontal: 8,
    height: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingBottom: 10,
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
  newCount: {
    backgroundColor: Color.primary,
    padding: 2,
    width: 16,
    height: 16,
    borderRadius: 4,
    justifyContent: 'center',
  },
  textCount: {
    color: Color.white,
    fontSize: 10,
    textAlign: 'center',
  },
  help: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: Color.gray,
    padding: 16,
    borderRadius: 4,
    marginVertical: 8,
  },
  helpTitleBox: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  // Family members
  memberCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    backgroundColor: Color.white,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    padding: 6,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  continueViewTouchable: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    marginBottom: 20,
  },
  continueViewText: {
    color: '#3E7BFA',
    fontSize: 20,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSignout: (data) => dispatch(signout(data)),
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
