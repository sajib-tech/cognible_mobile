import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Styles from '../../../utility/Style';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width;

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import store from '../../../redux/store';
import WS from 'react-native-websocket';
import NavigationHeader from '../../../components/NavigationHeader';
import _ from 'lodash';
import ClinicRequest from '../../../constants/ClinicRequest';
import PickerModal from '../../../components/PickerModal';
import LoadingIndicator from '../../../components/LoadingIndicator';
import StudentHelper from '../../../helpers/StudentHelper';
import {getStr} from '../../../../locales/Locale';

class ParentTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tasks: [],

      unfilteredTasks: [],
      filterStatus: '',
      filterPriority: '',
      statuses: [
        {id: '', label: getStr("homeScreenAutism.All")},
        {id: 'VGFza1N0YXR1c1R5cGU6Mg==', label: getStr("TargetAllocate.Closed")},
        {id: 'VGFza1N0YXR1c1R5cGU6MQ==', label: getStr("TargetAllocate.Open")},
      ],
      priorities: [
        {id: '', label: getStr("homeScreenAutism.All")},
        {id: 'UHJpb3JpdHlUeXBlOjE=', label: getStr("TargetAllocate.High")},
        {id: 'UHJpb3JpdHlUeXBlOjM=', label: getStr("TargetAllocate.Medium")},
        {id: 'UHJpb3JpdHlUeXBlOjQ=', label: getStr("TargetAllocate.Low")},
      ],
    };
  }

  _refresh() {
    this.getData();
  }

  componentDidMount() {
    //Call this on every page
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();

    this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  getData() {
    this.setState({isLoading: true});

    TherapistRequest.getTaskList()
      .then((dashboardResult) => {
        console.log('DashboardResult', dashboardResult);
        let oldTasks = dashboardResult.data.tasks.edges;

        oldTasks = _.orderBy(oldTasks, ['node.createdAt'], ['desc']);

        console.log('StudentID', StudentHelper.getStudentId());
        let studentID = StudentHelper.getStudentId();

        let tasks = [];
        oldTasks.map((task, key) => {
          let exist = false;
          task.node.students.edges.map((student) => {
            // console.log("Comparing", student.node.id, studentID, student.node.id == studentID)
            if (student.node.id == studentID) {
              exist = true;
            }
          });

          if (exist) {
            tasks.push(task);
          }
        });

        this.setState({
          isLoading: false,
          tasks,
          unfilteredTasks: tasks,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false, isAttendanceLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  filterData() {
    let {filterStatus, filterPriority, unfilteredTasks} = this.state;
    let tasks = [];
    unfilteredTasks.forEach((task, key) => {
      let isFilterStatus = false;
      let isFilterPriority = false;

      //status exist
      if (filterStatus != '' && task.node?.status?.id == filterStatus) {
        isFilterStatus = true;
      } else if (filterStatus == '') {
        isFilterStatus = true;
      }

      if (filterPriority != '' && task.node?.priority?.id == filterPriority) {
        isFilterPriority = true;
      } else if (filterPriority == '') {
        isFilterPriority = true;
      }

      if (isFilterStatus && isFilterPriority) {
        tasks.push(task);
      }
    });
    this.setState({tasks});
  }

  closeTask(task) {
    let variables = {
      id: task.node.id,
      taskType: task.node.taskType.id,
      taskName: task.node.taskName,
      description: task.node.description,
      priority: task.node?.priority?.id,
      startDate: task.node.startDate,
      dueDate: task.node.dueDate,
    };
    console.log(JSON.stringify(variables));
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

  renderTask() {
    return (
      <>
        {this.state.tasks?.map((task, index) => {
          let priorityColor = Color.success;
          if (task?.node?.priority?.name == 'Super High') {
            priorityColor = Color.danger;
          } else if (task?.node?.priority?.name == 'High') {
            priorityColor = Color.warning;
          } else if (task?.node?.priority?.name == 'Medium') {
            priorityColor = Color.info;
          }
          let taskColor = Color.success;
          if (task?.node?.status?.colorCode == 'danger') {
            taskColor = Color.danger;
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.props.navigation.navigate('TaskNew', task);
              }}
              activeOpacity={0.9}
              style={styles.taskStyle}>
              <View style={Styles.column}>
                <Text style={styles.taskStyleTitle}>
                  {task?.node?.taskName}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[styles.taskStylePriority, {color: priorityColor}]}>
                    {task?.node?.priority?.name}
                  </Text>
                  <View style={{marginHorizontal: 5}}>
                    <Text>•</Text>
                  </View>
                  <Text style={[styles.taskStylePriority, {color: taskColor}]}>
                    {task?.node?.status?.taskStatus}
                  </Text>
                </View>
              </View>

              {task?.node?.status?.taskStatus == 'Open' && (
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
              )}

              {/* <View style={{ justifyContent: 'center' }}>
                                {assignWork.map((assign, key) => {
                                    return <Image source={{ uri: ImageHelper.getImage(assign.node.image) }} style={styles.assignThumbnail} key={index + '_' + key} />;
                                })}
                            </View> */}
            </TouchableOpacity>
          );
        })}

        {this.state.tasks.length == 0 && <NoData>No Task Available</NoData>}
      </>
    );
  }

  render() {
    let {
      isLoading,
      filterStatus,
      filterPriority,
      statuses,
      priorities,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          dotsPress={() => this.props.navigation.navigate('TaskNew')}
          materialCommunityIconsName="plus"
          title={getStr('TargetAllocate.TaskList')}
        />
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <Container>
            <Row style={{height: 90}}>
              <Column>
                <PickerModal
                  label={getStr('BegaviourData.Status')}
                  placeholder={getStr("homeScreenAutism.All")}
                  selectedValue={filterStatus}
                  data={statuses}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({filterStatus: itemValue}, () => {
                      this.filterData();
                    });
                  }}
                />
              </Column>
              <Column>
                <PickerModal
                  label={getStr('TargetAllocate.Priority')}
                  placeholder={getStr("homeScreenAutism.All")}
                  selectedValue={filterPriority}
                  data={priorities}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({filterPriority: itemValue}, () => {
                      this.filterData();
                    });
                  }}
                />
              </Column>
            </Row>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={this._refresh.bind(this)}
                />
              }>
              {this.renderTask()}
            </ScrollView>
          </Container>
        )}
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
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
  },
  bigImage: {
    width: 100,
    height: 120,
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
  contentBox: {
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
    width: width / 1.2,
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
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ParentTaskList);
