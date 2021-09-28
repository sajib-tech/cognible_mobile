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
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../../utility/Color.js';
import Styles from '../../../utility/Style.js';
const width = Dimensions.get('window').width;

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  signout,
  setProfile,
} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import _ from 'lodash';
import ImageHelper from '../../../helpers/ImageHelper.js';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import store from '../../../redux/store/index.js';
import ClinicStaffs from './ClinicStaffs.js';
import ClinicRequest from '../../../constants/ClinicRequest.js';
import Button from '../../../components/Button.js';
import ClinicTaskNew from './ClinicTaskNew.js';
import ClinicTaskDetails from './clinictaskDetails';
import ClinicStaffNew from './ClinicStaffNew.js';
import SupportTicketFieldContainer from '../../Common/Support_Ticket/SupportTicketFieldContainer';

class ClinicProfileHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      image: require('../../../../android/img/ravi.jpg'),
      staffs: [],
      tasks: [],
      schoolDetail: null,

      renderType: 'normal', // "task" & "staff"
      isEditingProfile: false,
      email: '',
      phone: '',
      tempEmail: '',
      tempPhone: '',
      isPeakType: false,
      userId: '',
    };
  }

  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetProfile(null);
  }

  _refresh() {
    this.componentDidMount();
    this.getData();
  }

  componentDidMount() {
    console.log('Redux_', store.getState());

    //save to redux for access inside LeaveRequestNew screen
    this.props.dispatchSetProfile(this);

    this.props.navigation.addListener('focus', () => {
      ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);
      this.getData();
    });
  }

  getData() {
    this.setState({isLoading: true});

    ClinicRequest.getProfileData()
      .then((profileData) => {
        console.log('getProfileData', profileData);
        console.log('last_login', profileData.data.schoolDetail);
        console.log('schoolDetail', profileData.data.schoolDetail);
        this.getPeakType(profileData.data.schoolDetail.user.id);

        this.setState({
          isLoading: false,
          staffs: profileData.data.schoolDetail.staffSet.edges,
          schoolDetail: profileData.data.schoolDetail,
          tasks: profileData.data.tasks.edges,
          email: profileData.data.schoolDetail.email,
          phone: profileData.data.schoolDetail.contactNo,
          userId: profileData.data.schoolDetail.user.id,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
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

  updateProfileInfo() {
    this.setState({isLoading: true});
    let variables = {
      phone: this.state.phone,
      email: this.state.email,
    };
    console.log('Variables', variables);
    ClinicRequest.updateProfileData(variables)
      .then((profileData) => {
        console.log('profileData():' + JSON.stringify(profileData));
        this.setState({isLoading: false, isEditingProfile: false});
        Alert.alert('Information', 'Successfully updated');
        // this.getProfileInfo();
        this.getData();
      })
      .catch((error) => {
        this.setState({isLoading: false, isEditingProfile: false});
        console.log('Error', error);

        Alert.alert('Information', error.toString());
      });
  }

  closeTask(task) {
    let variables = {
      id: task.node.id,
      taskType: task.node.taskType.id,
      taskName: task.node.taskName,
      description: task.node.description || "",
      priority: task.node?.priority?.id,
      startDate: task.node.startDate,
      dueDate: task.node.dueDate,
    };
    console.log(JSON.stringify(variables));
    debugger
    ClinicRequest.closeTask(variables)
      .then((profileData) => {
        Alert.alert('Information', 'Task successfully closed');
        this.getData();
      })
      .catch((error) => {
        console.log('Error', JSON.stringify(error));

        Alert.alert('Information', error.toString());
      });
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

  renderHeader() {
    let {schoolDetail} = this.state;
    if (schoolDetail) {
      return (
        <>
          <View style={{padding: 3}}>
            <TouchableOpacity onPress={() => null} style={styles.studentItem}>
              <Image
                style={styles.studentImage}
                source={{uri: ImageHelper.getImage('')}}
              />
              <View style={{flex: 1, marginHorizontal: 8}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  {schoolDetail.schoolName}
                </Text>
                <Text style={Styles.bigGrayText}>{schoolDetail.address}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return null;
  }

  renderStaff() {
    let {staffs} = this.state;
    // console.log("staffs==============================", staffs)
    let temp = staffs.filter((staff) => staff.node.isActive)
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (OrientationHelper.getDeviceOrientation() == 'portrait') {
              this.props.navigation.navigate('ClinicStaffs');
            } else {
              this.setState({renderType: 'staff'});
            }
          }}
          activeOpacity={0.9}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.sectionTitle}>Staff Management</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} />
        </TouchableOpacity>

        <View style={{padding: 3}}>
          {temp.map((staff, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => this.props.navigation.navigate('ClinicStaffs')}
                activeOpacity={0.9}
                style={styles.studentItem}>
                <View style={[styles.studentImage, {backgroundColor: '#ddd'}]}>
                  <Image
                    style={styles.studentImage}
                    source={{uri: ImageHelper.getImage(staff.node.image)}}
                  />
                </View>
                <View style={{marginHorizontal: 8, flex: 1}}>
                  <Text style={styles.text}>{staff.node.name}</Text>
                  {staff.node.userRole && (
                    <Text style={styles.studentSubject}>
                      {staff.node.userRole.name}
                    </Text>
                  )}
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={Color.grayFill}
                />
              </TouchableOpacity>
            );
          })}

          {staffs.length == 0 && <NoData>No Staff Available</NoData>}
        </View>
      </>
    );
  }

  renderProject() {
    let {tasks} = this.state;

    let button = (
      <View>
        {OrientationHelper.getDeviceOrientation() == 'landscape' &&
          this.renderPeakType()}
        <View
          activeOpacity={0.9}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.sectionTitle}>Task</Text>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ClinicTaskList');
            }}>
            <MaterialCommunityIcons name="arrow-right" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                this.props.navigation.navigate('ClinicTaskNew');
              } else if (
                OrientationHelper.getDeviceOrientation() == 'landscape'
              ) {
                this.props.navigation.navigate('ClinicTaskNew');
              } else {
                this.setState({renderType: 'task'});
              }
            }}>
            <MaterialCommunityIcons name="plus" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );

    if (this.state.renderType == 'task') {
      button = (
        <TouchableOpacity
          onPress={() => {
            this.setState({renderType: 'normal'});
          }}
          activeOpacity={0.9}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.sectionTitle}>Task</Text>
          <MaterialCommunityIcons name="close" size={20} />
        </TouchableOpacity>
      );
    }

    let content = (
      <View style={{padding: 3}}>
        {tasks.map((task, index) => {
          let assignWork = task.node.assignWork.edges;
          if (assignWork.length) {
            // console.log(assignWork)
          }
          let priorityColor = Color.success;
          if (task?.node?.priority?.name == 'Super High') {
            priorityColor = Color.danger;
          } else if (task?.node?.priority?.name == 'High') {
            priorityColor = Color.warning;
          } else if (task?.node?.priority?.name == 'Medium') {
            priorityColor = Color.info;
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.props.navigation.navigate('ClinicTaskDetails', {task});
              }}
              activeOpacity={0.9}
              style={styles.taskStyle}>
              <View style={Styles.column}>
                <Text style={styles.taskStyleTitle}>
                  {task?.node?.taskName}
                </Text>
                <Text
                  style={[styles.taskStylePriority, {color: priorityColor}]}>
                  {task?.node?.priority?.name}
                </Text>
              </View>

              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => {
                  Alert.alert(
                    'Information',
                    'Are you sure want to close this task?',
                    [
                      {text: 'No', onPress: () => {}, style: 'cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          this.closeTask(task);
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={30}
                  color={Color.success}
                />
              </TouchableOpacity>

              {/* <View style={{ justifyContent: 'center' }}>
                                {assignWork.map((assign, key) => {
                                    return <Image source={{ uri: ImageHelper.getImage(assign.node.image) }} style={styles.assignThumbnail} key={index + '_' + key} />;
                                })}
                            </View> */}
            </TouchableOpacity>
          );
        })}

        {tasks.length == 0 && <NoData>No Task Available</NoData>}
      </View>
    );
    return (
      <>
        {button}

        {OrientationHelper.getDeviceOrientation() == 'portrait' && content}
        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
          <ScrollView>{content}</ScrollView>
        )}
      </>
    );
  }

  renderPeakType = () => {
    const {isPeakType} = this.state;
    return (
      <View style={{padding: 3}}>
        <View onPress={() => null} style={styles.studentItem}>
          <Text style={styles.sectionTitle}>Peak Recording</Text>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              width: 130,
              alignItems: 'center',
              height: 35,
              borderColor: Color.primary,
              borderRadius: 5,
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
      </View>
    );
  };

  getProfileEditForm() {
    return (
      <>
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

          <Button
            theme="secondary"
            labelButton="Update Profile"
            onPress={() => {
              this.updateProfileInfo();
            }}
          />
        </View>
      </>
    );
  }

  renderPersonal() {
    let {
      schoolDetail,
      isEditingProfile,
      email,
      tempEmail,
      phone,
      tempPhone,
    } = this.state;
    // email = schoolDetail.email;
    // phone = schoolDetail.contactNo;
    if (schoolDetail) {
      return (
        <>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.9}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.sectionTitle}>School Detail</Text>
            <MaterialCommunityIcons
              name={isEditingProfile ? 'close' : 'account-edit'}
              size={26}
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
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginVertical: 8,
                }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={Color.grayFill}
                  style={{marginRight: 8}}
                />
                <View style={Styles.column}>
                  <Text style={Styles.grayText}>Email Address</Text>
                  <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                    {schoolDetail.email}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginVertical: 8,
                }}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={20}
                  color={Color.grayFill}
                  style={{marginRight: 8}}
                />
                <View style={Styles.column}>
                  <Text style={Styles.grayText}>Mobile Number</Text>
                  <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                    {schoolDetail.contactNo}
                  </Text>
                </View>
              </View>
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginVertical: 8,
            }}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={Color.grayFill}
              style={{marginRight: 8}}
            />
            <View style={Styles.column}>
              <Text style={Styles.grayText}>Last Login</Text>
              <Text style={[Styles.primaryText, {marginVertical: 4}]}>
                {moment(schoolDetail.user.lastLogin).format(
                  'MMM DD, YYYY, h:mm:ss a',
                )}
              </Text>
              {/* <Text style={[Styles.primaryText, { marginVertical: 4 }]}>{moment(store.getState().lastLoginDate).format("MMM DD, YYYY, h:mm:ss a")}</Text> */}
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('ChangePasswordScreen')
            }
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginVertical: 8,
            }}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={Color.grayFill}
              style={{marginRight: 8}}
            />
            <View style={Styles.column}>
              <Text style={Styles.primaryText}>Change Password</Text>
              {/*<Text style={[Styles.primaryText, { marginVertical: 4 }]}>{moment(schoolDetail.user.lastLogin).format("MMM DD, YYYY, hh:mm A")}</Text>*/}
            </View>
          </TouchableOpacity>
        </>
      );
    }
    return null;
  }

  renderSupportTicket() {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 35,
            paddingBottom: 15,
          }}>
          <Text style={styles.sectionTitle}>Support Ticket</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SupportTicket');
              }}>
              <MaterialCommunityIcons name="arrow-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddSupportTicket');
              }}>
              <MaterialCommunityIcons name="plus" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <SupportTicketFieldContainer navigation={this.props.navigation} />
        </View>
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
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
              <View style={{paddingTop: 30, paddingBottom: 10}}>
                <Text style={styles.title}>Profile</Text>
              </View>

              {this.renderHeader()}

              {this.renderStaff()}

              {this.renderProject()}

              {this.renderPeakType()}

              {this.renderSupportTicket()}

              {this.renderPersonal()}

              <Button
                style={{marginVertical: 8}}
                theme="secondary"
                labelButton="Sign Out"
                onPress={() => this.signOut()}
              />
            </ScrollView>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <View style={{paddingTop: 30, paddingBottom: 10}}>
                <Text style={styles.title}>Profile</Text>
              </View>
              <Row style={{flex: 1}}>
                <Column>
                  {this.renderHeader()}

                  {this.renderPersonal()}

                  <Button
                    style={{marginVertical: 8}}
                    theme="secondary"
                    labelButton="Sign Out"
                    onPress={() => this.signOut()}
                  />
                </Column>
                <Column>
                  {this.state.renderType == 'normal' && this.renderProject()}
                  {this.state.renderType == 'task' && this.renderProject()}

                  {this.state.renderType == 'staff' && (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({renderType: 'normal'});
                        }}
                        activeOpacity={0.9}
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.sectionTitle}>
                          Staff Management
                        </Text>
                        <MaterialCommunityIcons name="close" size={20} />
                      </TouchableOpacity>
                      <ClinicStaffs
                        disableNavigation
                        navigation={this.props.navigation}
                      />
                    </>
                  )}
                </Column>
                <Column>
                  {this.state.renderType == 'normal' && this.renderStaff()}
                  {this.state.renderType == 'task' && (
                    <ClinicTaskNew
                      disableNavigation
                      navigation={this.props.navigation}
                    />
                  )}
                  {this.state.renderType == 'staff' && (
                    <ClinicStaffNew
                      disableNavigation
                      navigation={this.props.navigation}
                    />
                  )}
                </Column>
              </Row>
            </>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
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
    marginBottom: 10,
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
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
  peakTypeStyle: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peakView: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 150,
    alignItems: 'center',
    height: 40,
    borderColor: Color.primary,
    borderRadius: 5,
  },
  supportTicketHeading: {
    fontSize: 20,
    color: '#45494E',
    fontWeight: '500',
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSignout: (data) => dispatch(signout(data)),
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
  dispatchSetProfile: (data) => dispatch(setProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClinicProfileHome);
