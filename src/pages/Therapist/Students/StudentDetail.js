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
  Alert,
  Switch,
  FlatList,
} from 'react-native';
import HomeCard from '../../../components/HomeCard';
import {getStr} from '../../../../locales/Locale';
import moment from 'moment';
import Collapsible from 'react-native-collapsible';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SearchInput, {createFilter} from 'react-native-search-filter';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';

const KEYS_TO_FILTERS = ['name', 'subject'];

import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import ProgressBar from './components/ProgressBar';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import NoData from '../../../components/NoData';
import DeviceInfo from 'react-native-device-info';
import ParentRequest from '../../../constants/ParentRequest';
import store from '../../../redux/store';
import {GET_LONG_GOALS_DETAILS} from '../../../constants/therapist';

const width = Dimensions.get('window').width;

const prgClr = [
  '#7CB5EC',
  '#F9A437',
  '#B3B2B2',
  '#4CBB9A',
  '#90ED7D',
  '#E2C033',
  '#BF4E99',
  '#91C7BA',
];

const goalsClr = ['#4CBB9A', '#F9A437', '#90ED7D', '#BF4E99'];

class StudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      programs: [],
      student: {},
      unreadCount: 0,

      dataRecording: [
        {
          id: 0,
          title: 'Meal Data',
          description: 'Breakfast, Lunch & Dinner',
          image: require('../../../../android/img/meal.jpg'),
        },
        {
          id: 1,
          title: 'Mand Data',
          description: 'Record child ability to request items or activities',
          image: require('../../../../android/img/mand.jpg'),
        },
        {
          id: 2,
          title: 'Medical Data',
          description:
            'Record of any other medical related treatment and medicine intake',
          image: require('../../../../android/img/medical.jpg'),
        },
        {
          id: 3,
          title: 'Toilet Data',
          description:
            'Record to improve the independency and self care through one of life’s most valuable skill',
          image: require('../../../../android/img/toilet.jpg'),
        },
        {
          id: 4,
          title: 'Behavior Data',
          description:
            'Record to analyze the intensity  and function of behavior',
          image: require('../../../../android/img/behaviour.jpg'),
        },
        // { id: 5, title: 'Abc Data', description: 'Record using Antecedent, Behavior, Consequences', image: require("../../../../android/img/abc.png") },
      ],
      showContactModal: false,
      showProgramModal: false,
      programLongTerm: [],
      selectedProgramIndex: 0,
      isDomain: true,
      totalPrograms: 0,
      isCollapsed: false,
      selectedProgram: null,
      longTermProgramDetails: [],
      isLoadingData: false,
    };
  }
  _refresh() {}
  componentDidMount() {
    console.error('props student detail 282', store.getState().user);
    let student = this.props.route.params;
    console.log('Student_', student);
    this.setState({student: student});
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.props.navigation.addListener('focus', () => {
      this.fetchStudentPrograms(student);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log({ prevProps, prevState, snapshot });
    let prevStudent = prevProps.route.params;
    let currentStudent = this.props.route.params;
    if (prevStudent.node.id != currentStudent.node.id) {
      console.log({
        prevStudent,
        currentStudent,
      });

      this.setState({student: currentStudent});
      this.fetchStudentPrograms(currentStudent);
    }
  }

  fetchStudentPrograms(student) {
    this.setState({isLoading: true});
    let variables = {
      studentId: student?.node?.id,
    };
    console.log(variables);
    TherapistRequest.getStudentPrograms(variables)
      .then((studentPrograms) => {
        console.log('getStudentPrograms', JSON.stringify(studentPrograms));
        if (
          studentPrograms &&
          studentPrograms.data &&
          studentPrograms.data.studentProgramArea
        ) {
          this.setState(
            {
              programs: studentPrograms.data.studentProgramArea,
              isLoading: false,
              student: student,
            },
            () => {
              this.getNotificationList(student);
            },
          );
        }
        // this.setState({responsibilities: respList});
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }

  getNotificationList(student) {
    this.setState({isLoading: true});
    // console.log('store data==', store.getState().user.student.id);
    // console.log('sarthak==', store.getState().user.id);

    let variables = {
      student: student?.node?.parent?.id,
      // student: 'VXNlclR5cGU6MTk4',
    };
    console.log('Notificationa==', variables);
    ParentRequest.fetchNotifications(variables)
      .then((profileData) => {
        this.setState({isLoading: false});
        let notificationArray = [];
        this.setState({unreadCount: 0});
        let notifications = profileData.data.notification.edges;
        console.error('profiledata', profileData);
        console.error('Notification==', notifications);
        for (let i = 0; i < notifications.length; i++) {
          let noti = notifications[i].node;
          notificationArray.push(noti);
          if (noti?.read === false) {
            this.setState({unreadCount: this.state.unreadCount + 1});
          }
        }
        console.log('Notification==', notificationArray);
        this.setState({notifications: notificationArray});
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.log(error, error.response);
        //
        Alert.alert('Information', error.toString());
      });
  }

  searchUpdated(term) {
    this.setState({searchStudent: term});
  }

  studentDetail() {}

  bookAppointment() {
    let parent = this.props.navigation.dangerouslyGetParent();
    parent.navigate('Calendar');

    let student = this.props.route.params;

    setTimeout(() => {
      parent.navigate('AppointmentNew', {
        studentId: student.node.id,
        selectedDate: moment().format('YYYY-MM-DD'),
      });
    }, 100);
  }

  gotoDataRecordingScreen(title) {
    let {navigation} = this.props;
    let student = this.props.route.params;
    let navLinkTitle = '';
    console.log('TherapyHomeBehavioralItem : ' + title);
    // this.setState({showCorrectResponse: isExpanded});
    if (title === 'Meal Data') {
      navLinkTitle = 'BehaviourDecelMealScreen';
    } else if (title === 'Medical Data') {
      navLinkTitle = 'BehaviourDecelMedicalScreen';
    } else if (title === 'Mand Data') {
      navLinkTitle = 'BehaviourDecelMandScreen';
    } else if (title === 'Toilet Data') {
      navLinkTitle = 'BehaviourDecelToiletScreen';
    } else if (title === 'Behavior Data') {
      navLinkTitle = 'BehaviourDecelDataScreen';
    } else if (title === 'Abc Data') {
      navLinkTitle = 'AbcList';
    }
    navigation.navigate(navLinkTitle, {
      studentId: student.node.id,
      student: student.node,
    });
  }
  showProgramDetail(program) {
    let student = this.props.route.params;
    this.props.navigation.navigate('StudentMenuDetail', {student, program});
  }

  getProgramArea = (program, index) => {
    console.log('programs', program);

    let student = this.props.route.params;
    let tempData = [];

    let variables = {
      student: student?.node?.id,
      program: program?.id,
    };

    console.log('variables', variables);

    this.setState({isLoadingData: true});

    TherapistRequest.therapistGetLongTermGoals(variables).then((res) => {
      console.log('response goals', res);

      this.setState({isLoadingData: false});

      this.setState({totalPrograms: res?.data?.longTerm?.edges.length});

      res?.data?.longTerm?.edges.forEach(({node}) => {
        let exist = false;
        let idx = -1;

        for (let i = 0; i < tempData.length; i += 1) {
          if (tempData[i].status === node?.goalStatus?.status) {
            exist = true;
            idx = i;
          }
        }
        if (exist) {
          tempData[idx].data += 1;
        } else {
          tempData.push({
            status: node?.goalStatus?.status,
            id: node.goalStatus.id,
            data: 1,
            isCollapsed: true,
            details: [],
            isLoading: false,
          });
        }
      });
      this.setState({programLongTerm: tempData});
    });
  };

  getLongGoalsDetails = (goalStatusId, goalStatus, goalIndex) => {
    let student = this.props.route.params;
    const {selectedProgram, isDomain, programLongTerm} = this.state;

    let filterType = isDomain ? 'd' : 's';

    let variables = {
      program: selectedProgram ? selectedProgram?.id : null,
      goalStatus: goalStatusId,
      student: student?.node?.id,
    };

    // this.setState({selectedProgram: {...selectedProgram, isLoading: true}});

    let tempPrograms = programLongTerm;

    tempPrograms[goalIndex].isLoading = true;

    this.setState({programLongTerm: tempPrograms});

    TherapistRequest.getlongTermsDetails(variables).then((res) => {
      console.log('long terms details', res);

      const tempRty = [];

      res?.data?.longTerm.edges.forEach(({node}) => {
        console.log(node, 'node node');
        const tempData = [];
        node.shorttermgoalSet?.edges.forEach(({node: st}) => {
          st.targetAllocateSet?.edges.forEach(({node: tt}) => {
            let exist = false;
            let idx = -1;

            let dm;

            if (filterType === 'd') {
              dm =
                tt.manualAllocateDomain?.domain?.domain ||
                tt.targetId?.domain?.domain;
              dm = dm || 'None';
            } else {
              dm = tt.targetStatus.statusName;
            }

            for (let i = 0; i < tempData.length; i += 1) {
              if (tempData[i].text === dm) {
                exist = true;
                idx = i;
              }
            }

            if (exist) {
              tempData[idx].value += 1;
            } else {
              tempData.push({
                text: dm,
                key: tt.targetStatus?.id,
                value: 1,
              });
            }
          });
        });

        tempRty.push({
          key: Math.random(),
          tt: tempData,
          goalName: node.goalName,
          dateInitialted: node.dateInitialted,
          dateEnd: node.dateEnd,
          goalStatus: goalStatus,
        });
      });

      let tempPrograms = this.state.programLongTerm;

      tempPrograms[goalIndex].details = tempRty;
      tempPrograms[goalIndex].isLoading = false;

      this.setState({programLongTerm: tempPrograms});
    });
  };

  renderProfile() {
    let student = this.props.route.params;
    console.log('student===', student);
    let location = 'N/A';
    if (student.node.clinicLocation && student.node.clinicLocation.location) {
      location = student.node.clinicLocation.location;
    }

    let phoneNumber = student.node.mobileno;
    console.log('phoneNumber', phoneNumber);
    if (phoneNumber == null || phoneNumber == '') {
      phoneNumber = null;
    }

    let caseManagerEmail = 'N/A';
    let caseManagerPhone = 'N/A';
    let category = 'N/A';

    if (student.node.caseManager) {
      caseManagerEmail = student.node.caseManager.name;
      caseManagerPhone = student.node.caseManager.contactNo;
    }

    if (student.node.category) {
      category = student.node.category.category;
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => this.studentDetail()}
          key={student.node.id}
          style={styles.studentItem}>
          <Image
            style={styles.studentImage}
            source={{uri: ImageHelper.getImage(student.node.image)}}
          />
          <View
            style={{
              marginHorizontal: 8,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Text style={styles.textBig}>
              {student.node.firstname + ' ' + student.node.lastname}
            </Text>
            <Text style={[styles.textBig, {color: '#0090e4'}]}>
              ({category})
            </Text>
            <Text style={[styles.textBig, {color: '#0090e4'}]}>
              ({category})
            </Text>
            {/*<Text style={styles.studentSubject}>{location}</Text>*/}
          </View>
        </TouchableOpacity>
        <View style={{marginVertical: 10}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text>Case Manager:</Text>
            <Text style={{marginLeft: 5, color: '#0090e4'}}>
              {caseManagerEmail}
            </Text>
          </View>
          <View style={{height: 5}} />
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text>Phone Number:</Text>
            <Text style={{marginLeft: 5, color: '#0090e4'}}>
              {caseManagerPhone}
            </Text>
          </View>
        </View>
        <View style={Styles.rowBetween}>
          <View style={{flex: 1}}>
            <Button
              labelButton="Contact Learner"
              onPress={() => {
                this.setState({showContactModal: true});
              }}
              iconRight={true}
              materialCommunityIconRightName="chevron-down"
            />
          </View>
          <View style={{width: 5}} />
          <View style={{flex: 1}}>
            <Button
              theme="secondary"
              labelButton="Book Appointment"
              onPress={() => {
                this.bookAppointment();
              }}
              // iconRightt={true}
              // iconLeftName="md-eye"
            />
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showContactModal}
          onRequestClose={() => {
            this.setState({showContactModal: false});
          }}>
          <TouchableOpacity
            style={styles.modalRoot}
            activeOpacity={1}
            onPress={() => {
              this.setState({showContactModal: false});
            }}>
            <View style={styles.modalContent}>
              {phoneNumber == '' && (
                <View style={{flexDirection: 'row'}}>
                  <AntDesign name="warning" size={20} color={Color.primary} />
                  <Text style={{marginLeft: 10, color: Color.primary}}>
                    No Contact Available
                  </Text>
                </View>
              )}
              {phoneNumber != '' && (
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (Linking.canOpenURL('tel:' + phoneNumber)) {
                      Linking.openURL('tel:' + phoneNumber);
                    } else {
                      Alert.alert(
                        'Information',
                        "Sorry, your device can't make a phone call",
                      );
                    }
                  }}>
                  <AntDesign name="phone" size={20} color={Color.primary} />
                  <Text style={{marginLeft: 10, color: Color.primary}}>
                    Call This Learner
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  renderMenuDetail() {
    let {programs, isLoading} = this.state;
    let student = this.props.route.params;
    console.log('pass', student);
    console.log('program__', programs);

    if (isLoading) {
      return (
        <View style={{paddingVertical: 50}}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      );
    }

    if (programs.length == 0) {
      return (
        <View style={{paddingVertical: 50}}>
          <NoData>This Student Has No Programs</NoData>
        </View>
      );
    }

    return programs.map((program, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.setState({selectedProgramIndex: index}, () => {
            this.showProgramDetail(program)
          })  
        }
          style={{
            flex: 1,
            borderRadius: 4,
            marginVertical: 4,
            padding: 8,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: Color.gray,
            width: width * 0.68,
            marginHorizontal: program.length == index || index == 0 ? 0 : 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={Styles.bigPrimaryText}>{program.name}</Text>
            <TouchableOpacity
              onPress={() =>
                this.setState(
                  {showProgramModal: true, selectedProgram: program, selectedProgramIndex: index},
                  () => {
                    this.getProgramArea(program, index);
                  },
                )
              }>
              <MaterialCommunityIcons
                name="eye-outline"
                size={25}
                color={Color.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={[Styles.grayText, {fontSize: 12, marginVertical: 8}]}>
            {program.description}
          </Text>
          <View
            style={{
              height: 4,
              width: '100%',
              backgroundColor: Color.gray,
              marginVertical: 8,
            }}>
            <View
              style={{height: 4, width: '30%', backgroundColor: Color.primary}}
            />
          </View>
        </TouchableOpacity>
      );
    });
  }

  renderDataRecording() {
    let {dataRecording} = this.state;
    let student = this.props.route.params;
    let studentName = student.node.firstname;
    return (
      <>
        <Text style={[styles.textBig, {marginVertical: 8}]}>Daily Vitals</Text>
        {dataRecording.map((menu, index) => {
          let description = menu.description.replace('{name}', studentName);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => this.gotoDataRecordingScreen(menu.title)}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                borderRadius: 4,
                marginVertical: 4,
                padding: 8,
                borderWidth: 1,
                borderColor: Color.gray,
              }}>
              <Image
                style={{width: 32, height: 32}}
                source={menu.image}
                resizeMode="cover"
              />

              <View style={{flex: 1, marginHorizontal: 8}}>
                <Text style={Styles.bigPrimaryFontText}>{menu.title}</Text>
                <Text style={[Styles.smallGrayText, {fontSize: 12}]}>
                  {description}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={'arrow-right'}
                color={Color.primary}
                size={24}
              />
            </TouchableOpacity>
          );
        })}
      </>
    );
  }

  renderGraphList() {
    let student = this.props.route.params;
    let studentName = student.node.firstname;
    return (
      <View style={{marginBottom: 30}}>
        <Text style={[styles.textBig, {marginVertical: 8}]}>
          Learner Graphs
          {/* >>>>>>> dixitU */}
        </Text>
        {/* <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('StudentProgressOverview', student);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderRadius: 4,
            marginVertical: 4,
            padding: 8,
            borderWidth: 1,
            borderColor: Color.gray,
          }}>
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={30}
            color={Color.black}
          />

          <View style={{flex: 1, marginHorizontal: 8}}>
            <Text style={Styles.bigPrimaryFontText}>Progress Overview</Text>
            <Text style={[Styles.smallGrayText, {fontSize: 12}]}>
              Click here to see graphs
            </Text>
          </View>
          <MaterialCommunityIcons
            name={'arrow-right'}
            color={Color.primary}
            size={24}
          />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('StudentDailyResponseRate', student);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderRadius: 4,
            marginVertical: 4,
            padding: 8,
            borderWidth: 1,
            borderColor: Color.gray,
          }}>
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={30}
            color={Color.black}
          />

          <View style={{flex: 1, marginHorizontal: 8}}>
            <Text style={Styles.bigPrimaryFontText}>Daily Response Rate</Text>
            <Text style={[Styles.smallGrayText, {fontSize: 12}]}>
              Click here to see graphs
            </Text>
          </View>
          <MaterialCommunityIcons
            name={'arrow-right'}
            color={Color.primary}
            size={24}
          />
        </TouchableOpacity>

        {DeviceInfo.isTablet() ? (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('CelerationGraphPanel', student);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 4,
              marginVertical: 4,
              padding: 8,
              borderWidth: 1,
              borderColor: Color.gray,
            }}>
            <MaterialCommunityIcons
              name="chart-line-variant"
              size={30}
              color={Color.black}
            />

            <View style={{flex: 1, marginHorizontal: 8}}>
              <Text style={Styles.bigPrimaryFontText}>Celeration Graph</Text>
              <Text style={[Styles.smallGrayText, {fontSize: 12}]}>
                Click here to see celeration graph
              </Text>
            </View>
            <MaterialCommunityIcons
              name={'arrow-right'}
              color={Color.primary}
              size={24}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  getDate = (dateIn, dateEnd) => {
    const startDate = moment(dateIn);
    const endDate = moment(dateEnd);

    const years = endDate.diff(startDate, 'year');
    startDate.add(years, 'years');

    const months = endDate.diff(startDate, 'months');
    startDate.add(months, 'months');

    const days = endDate.diff(startDate, 'days');

    const duration = `${years > 0 ? `, ${years} Year` : ''} ${
      months > 0 ? `${months} Months` : ''
    } ${days > 0 ? `${days} Days` : ''}`;

    const date =
      `${moment(dateIn).format('MMMM DD YYYY')} - ${endDate.format(
        'MMMM DD YYYY',
      )}` + `${duration === '  ' || duration === ' ' ? ' ' : `, ${duration}`}`;

    return date;
  };

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

  showAutismScreening() {
    let {navigation} = this.props;
    navigation.navigate('ScreeningList', {
      student: this.state.student,
      fromParent: false,
    });
  }

  renderProgramModal = () => {
    const {
      showProgramModal,
      programLongTerm,
      programs,
      selectedProgramIndex,
      isDomain,
      totalPrograms,
      isCollapsed,
      longTermProgramDetails,
      isLoadingData,
    } = this.state;

    let tempGoals = programLongTerm;

    console.log(selectedProgramIndex)

    console.log(programs[selectedProgramIndex])

    

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={showProgramModal}
        onRequestClose={() => {
          this.setState({showProgramModal: false});
        }}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View>
              <Text style={{fontSize: 20}}>Programs</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({showProgramModal: false})}>
              <MaterialCommunityIcons
                name="close"
                size={25}
                color={Color.primary}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginVertical: 10,
            }}>
            <View style={{borderLeftWidth: 7, borderLeftColor: "#4CBB9A", paddingLeft: 7}}>
              <Text
                style={{
                  fontSize: 16,
                }}>{`${totalPrograms} Goals - ${programs[selectedProgramIndex]?.name}`}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              {
                <Text
                  style={{
                    color: !isDomain ? Color.primary : '#000',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  S
                </Text>
              }
              <Switch
                value={isDomain}
                onValueChange={() =>
                  this.setState({isDomain: !isDomain}, () => {
                    tempGoals.map((goal) => {
                      goal.isCollapsed = true;
                    });

                    this.setState({programLongTerm: tempGoals});
                  })
                }
                trackColor={Color.primary}
                style={{marginHorizontal: 7}}
              />
              {
                <Text
                  style={{
                    color: isDomain ? Color.primary : '#000',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  D
                </Text>
              }
            </View>
          </View>
          <ScrollView
            style={{
              paddingHorizontal: 15,
            }}>
            {isLoadingData && <ActivityIndicator color={Color.primary} />}
            {!isLoadingData &&
              tempGoals.map((program, index) => {
                console.log('renderProgam', program);
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        tempGoals[index].isCollapsed = !program.isCollapsed;
                        this.setState({programLongTerm: tempGoals}, () => {
                          this.getLongGoalsDetails(
                            program.id,
                            program.status,
                            index,
                          );
                        });
                      }}
                      style={{
                        borderLeftColor: prgClr[index],
                        borderLeftWidth: 7,
                        borderRightWidth: 7,
                        borderRightColor: prgClr[index],
                        marginVertical: 7,
                        borderColor: prgClr[index],
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        flexDirection: 'row',
                        shadowOffset: {
                          height: 2,
                          width: 0,
                        },
                        shadowOpacity: 0.7,
                        shadowRadius: 2,
                        shadowColor: 'grey',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderTopLeftRadius: 10,
                        borderBottomRightRadius: 10
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                        }}>{`${program.data} ${program.status}`}</Text>
                      {program.isCollapsed ? (
                        <MaterialCommunityIcons
                          name="chevron-down"
                          size={25}
                          color={prgClr[index]}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="chevron-up"
                          size={25}
                          color={prgClr[index]}
                        />
                      )}
                    </TouchableOpacity>
                    <Collapsible
                      collapsed={program.isCollapsed}
                      style={{paddingHorizontal: 7}}>
                      {program.isLoading && (
                        <View style={{height: 50}}>
                          <ActivityIndicator
                            color={Color.primary}
                            size="small"
                          />
                        </View>
                      )}
                      {!program.isLoading &&
                        program &&
                        program?.details.length > 0 &&
                        program?.details.map((detail, index) => {
                          return (
                            <View
                              style={{
                                padding: 10,
                                borderWidth: 0.6,
                                borderColor: 'grey',
                                marginBottom: 7,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <MaterialCommunityIcons
                                  name="file-document-outline"
                                  size={30}
                                  color={Color.primary}
                                />

                                <View>
                                  <View>
                                    <Text>{detail?.goalName || ''}</Text>
                                  </View>
                                  <View>
                                    <Text>
                                      {this.getDate(
                                        detail?.dateInitialted,
                                        detail?.dateEnd,
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              <View>
                                {detail.tt.length > 0 ? (
                                  <ProgressBar targetData={detail.tt} />
                                ) : (
                                  <View style={{paddingVertical: 7}}>
                                    <Text style={{margin: 7}}>
                                      No Target Found
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          );
                        })}
                    </Collapsible>
                  </>
                );
              })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={'Learner Detail'}
          disabledTitle={true}
          dotsPress={() =>
            this.props.navigation.navigate('NotificationScreen', {
              student: this.state.student,
            })
          }
          materialCommunityIconsName="bell-circle"
          isNotification={true}
          unreadCount={this.state.unreadCount}
        />

        <Container enablePadding={this.props.disableNavigation != true}>
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
              {this.renderProfile()}

              <ScrollView horizontal={true}>
                {this.renderMenuDetail()}
              </ScrollView>
              {/* {this.renderMenuDetail()} */}

              {this.renderDataRecording()}

              {this.renderGraphList()}
              {this.renderAutism()}
            </ScrollView>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            // <Row>
            //     <Column>
            //         <ScrollView keyboardShouldPersistTaps='handled'
            //             showsVerticalScrollIndicator={false}
            //             contentInsetAdjustmentBehavior="automatic">
            //             {this.renderProfile()}
            //             {this.renderMenuDetail()}
            //         </ScrollView>
            //     </Column>
            //     <Column>
            //         <ScrollView keyboardShouldPersistTaps='handled'
            //             showsVerticalScrollIndicator={false}
            //             contentInsetAdjustmentBehavior="automatic">
            //             {this.renderDataRecording()}
            //             {this.renderGraphList()}
            //         </ScrollView>
            //     </Column>
            // </Row>
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
              {this.renderProfile()}

              {/* // {this.renderMenuDetail()} */}
              <ScrollView horizontal={true}>
                {this.renderMenuDetail()}
              </ScrollView>

              {this.renderDataRecording()}

              {this.renderGraphList()}
            </ScrollView>
          )}
        </Container>
        {this.renderProgramModal()}
      </SafeAreaView>
    );
  }
  // >>>>>>> dixitU
}
const styles = StyleSheet.create({
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
    width: 60,
    height: 60,
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
  },
  text: {
    fontSize: 14,
  },
  textBig: {
    fontSize: 16,
    color: '#000',
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
  buttonStart: {
    flex: 1,
    backgroundColor: Color.primary,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonStartText: {
    color: Color.white,
  },
  buttonEnd: {
    flex: 1,
    borderColor: Color.primary,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonEndText: {
    color: Color.primary,
  },
  line: {
    height: 1,
    width: width / 1.2,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  dot: {
    height: width / 55,
    width: width / 55,
    backgroundColor: Color.silver,
    borderRadius: width / 55,
    marginHorizontal: 8,
  },
  studentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  modalRoot: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: Color.white,
    borderRadius: 5,
    padding: 16,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);
