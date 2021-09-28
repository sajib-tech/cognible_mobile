import 'react-native-gesture-handler';
import React, {Component, createRef} from 'react';
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
} from 'react-native';
import Color from '../../../utility/Color';
import {Button} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.firstname', 'node.lastname'];

import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setStudentHome,
} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import TherapistRequest from '../../../constants/TherapistRequest';

const width = Dimensions.get('window').width;
class StudentsHome extends Component {
  constructor(props) {
    super(props);
    this.searchTextInput = createRef()
    this.state = {
      isLoading: false,
      searchStudent: '',
      students: [],
      recents: [],
      focusedSearch: false,

      selectedStudent: null, //for tablet only
    };
    //save to redux for access inside LeaveRequestNew screen
    this.props.dispatchSetStudentHome(this);

  }

  componentWillUnmount() {
    //remove from redux
    this.props.dispatchSetStudentHome(null);
  }

  _refresh() {
    this.setState({searchStudent: ''}, () => {
      this.getData();
    });
  }

  componentDidMount() {
    //Call this on every page
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});
    console.log('get data is called');
    TherapistRequest.getStudentList()
      .then((studentList) => {
        // console.log("--------studentList:"+JSON.stringify(studentList))
        let students = studentList.data.student_data.edges;
        let recents = studentList.data.recent_student.edges;

        // console.log('students', students);
        // console.log('recents', recents);

        const temp = students.filter((student) => student.node.isActive)
        const tempRecents = recents.filter((student) => student.node.isActive)

        console.log("tempstudents", JSON.stringify(temp))
        console.log("tempRecents", JSON.stringify(tempRecents))
        

        this.setState({
          isLoading: false,
          students: temp,
          recents: tempRecents,
          selectedStudent: recents.length != 0 ? recents[0] : null,
        });
      })
      .catch((error) => {
        console.log('================: ' + error);
        this.setState({isLoading: false, isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  searchUpdated(term) {
    this.setState({searchStudent: term});
  }

  showStudent(item) {
    // console.log(JSON.stringify(item));
    this.props.navigation.navigate('StudentDetail', item);
    // if (OrientationHelper.getDeviceOrientation() == 'portrait') {
    // } else {
    //     this.setState({ selectedStudent: item });
    // }
  }

  renderList() {
    console.log("refs", this.searchTextInput.current)
    let {recents, students} = this.state;
    const filteredStudents = students.filter(
      createFilter(this.state.searchStudent, KEYS_TO_FILTERS),
    );
    filteredStudents.sort();

    return (
      <>
        <View  
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            alignItems: 'center',
            height: 40,
            backgroundColor: Color.grayWhite,
            width: "100%",
          }}>
            <View style={{flexDirection: 'row',
            // paddingHorizontal: 16,
            alignItems: 'center',
            height: 40,
            backgroundColor: Color.grayWhite, width: "100%"}}>
          <MaterialCommunityIcons
            name="account-search-outline"
            size={24}
            color={Color.gray}
          />
          <SearchInput
            onChangeText={(term) => {
              this.searchUpdated(term);
            }}
            style={[styles.searchInput, {width: width - 100}]}
            placeholder="Search Learner"
            inputFocus={this.state.focusedSearch}
            // clearIcon
          />
          </View>
        </View>
        <Text style={[styles.text, {marginTop: 16}]}>Recents</Text>
        <View style={{height: 80, paddingVertical: 8}}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={{flexDirection: 'row'}}>
              {recents.map((student, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentBox}
                    onPress={() => {
                      this.showStudent(student);
                    }}>
                    <Image
                      style={styles.recentImage}
                      source={{uri: ImageHelper.getImage(student.node.image)}}
                    />
                    <Text style={styles.textSmall}>
                      {student.node.firstname} {student.node.lastname}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{paddingBottom: Dimensions.get('window').width * 0.55}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._refresh.bind(this)}
            />
          }>
          {filteredStudents.map((student, index) => {
            let location = 'N/A';
            if (
              student.node.clinicLocation &&
              student.node.clinicLocation.location
            ) {
              location = student.node.clinicLocation.location;
            }

            let firstname = student.node.firstname;
            let lastname = student.node.lastname;
            if (firstname == null) {
              firstname = '';
            }

            if (lastname == null || lastname == 'null') {
              lastname = '';
            }

            let completeName = (firstname + ' ' + lastname).trim();

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => this.showStudent(student)}
                key={'list' + index}
                style={styles.studentItem}>
                <View style={styles.studentImageWrapper}>
                  <Image
                    style={styles.studentImage}
                    source={{uri: ImageHelper.getImage(student.node.image)}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.studentName}>{completeName}</Text>
                    {/* {student.newCount.length != 0 && (
                                            <View style={styles.newCount}>
                                                <Text style={styles.textCount}>{student.newCount}</Text>
                                            </View>
                                        )} */}
                  </View>
                  <Text style={styles.studentSubject}>{location}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{height: 15}} />
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <View>
              <Row style={{paddingTop: 30, paddingBottom: 10}}>
                <Column>
                  <Text style={styles.title}>Learners</Text>
                </Column>
                <Column>
                  <TouchableOpacity
                    style={styles.header}
                    onPress={() => {
                      this.props.navigation.navigate('StudentNew');
                    }}>
                    <MaterialCommunityIcons
                      name="plus"
                      size={24}
                      color={Color.primary}
                    />
                  </TouchableOpacity>
                </Column>
              </Row>
              {this.renderList()}
            </View>
          )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            // <>
            //     <Row style={{ paddingTop: 30, paddingBottom: 10 }}>
            //         <Column>
            //             <Row>
            //                 <Column>
            //                     <Row>
            //                         <Column>
            //                             <Text style={styles.title}>Le</Text>
            //                         </Column>
            //                         <Column style={{ flex: 0 }}>
            //                             <TouchableOpacity style={styles.header} onPress={() => {
            //                                 this.props.navigation.navigate("StudentNew");
            //                             }}>
            //                                 <MaterialCommunityIcons
            //                                     name='plus'
            //                                     size={24}
            //                                     color={Color.primary}
            //                                 />
            //                             </TouchableOpacity>
            //                         </Column>
            //                     </Row>
            //                 </Column>
            //                 <Column style={{ flex: 2 }}></Column>
            //             </Row>
            //         </Column>
            //         {/* <Column style={{ flex: 2 }}>
            //             <TouchableOpacity style={styles.header} onPress={() => {
            //                 Alert.alert("Information", "Feature Not Implemented Yet");
            //             }}>
            //                 <MaterialCommunityIcons
            //                     name='filter-variant'
            //                     size={24}
            //                     color={Color.primary}
            //                 />
            //             </TouchableOpacity>
            //         </Column> */}
            //     </Row>
            //     <Row style={{ flex: 1 }}>
            //         <Column>
            //             {this.renderList()}
            //         </Column>
            //         <Column style={{ flex: 2 }}>
            //             {this.state.selectedStudent && <StudentDetail
            //                 navigation={this.props.navigation}
            //                 disableNavigation
            //                 route={{
            //                     params: this.state.selectedStudent
            //                 }} />}
            //         </Column>
            //     </Row>
            // </>

            <>
              <Row style={{paddingTop: 30, paddingBottom: 10}}>
                <Column>
                  <Text style={styles.title}>Learners</Text>
                </Column>
                <Column>
                  <TouchableOpacity
                    style={styles.header}
                    onPress={() => {
                      this.props.navigation.navigate('StudentNew');
                    }}>
                    <MaterialCommunityIcons
                      name="plus"
                      size={24}
                      color={Color.primary}
                    />
                  </TouchableOpacity>
                </Column>
              </Row>
              {this.renderList()}
            </>
          )}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
  },
  recentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  studentImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: '#fff',
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
    padding: 10,
  },
  studentName: {
    fontSize: 15,
    color: '#45494E',
    fontWeight: '500',
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  searchInput: {
    padding: 4,
    backgroundColor: Color.grayWhite,
    color: Color.blackFont,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
  dispatchSetStudentHome: (data) => dispatch(setStudentHome(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentsHome);
