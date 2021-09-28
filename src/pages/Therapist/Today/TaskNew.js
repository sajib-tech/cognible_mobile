import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Alert,
    Text, TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';

import { Row, Container, Column } from '../../../components/GridSystem';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ClinicRequest from '../../../constants/ClinicRequest.js';
import DateInput from '../../../components/DateInput.js';
import TextInput from '../../../components/TextInput';
import MultiPickerModal from "../../../components/MultiPickerModal";
import { getStr } from "../../../../locales/Locale";

class TaskNew extends Component {
    constructor(props) {
        super(props)
        //set value in state for initial date
        this.state = {
            isLoading: false,
            isSaving: false,

            students: [],
            selectedStudent: [],

            staffs: [],
            selectedStaff: [],

            taskTypes: [],
            selectedTaskType: null,

            typeIndex: -1,
            types: 0,

            priorities: [],
            selectedPriority: null,

            statuses: [],
            selectedStatus: null,

            taskName: "",
            description: "",

            startDate: moment().format("YYYY-MM-DD"),
            Date: moment().format("YYYY-MM-DD"),
            dueDate: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm:ss"),
            taskDatetime: moment().format("YYYY-MM-DD HH:mm:ss"),

            showDatepicker: false,
            datepickerMode: 'date',
            timePickerType: 'start',

            date: new Date(),

            reminders: [
                { time: moment().format("HH:mm:ss"), frequency: [], timesError: "", frequencyError: "" },
            ],

            daysArray: [
                { id: "Sunday", label: "Sunday" },
                { id: "Monday", label: "Monday" },
                { id: "Tuesday", label: "Tuesday" },
                { id: "Wednesday", label: "Wednesday" },
                { id: "Thursday", label: "Thursday" },
                { id: "Friday", label: "Friday" },
                { id: "Saturday", label: "Saturday" },
            ],


            completionCount: 0,
            studentErrorMessage: '',
            staffErrorMessage: '',
            typeErrorMessage: '',
            priorityErrorMessage: '',
            statusErrorMessage: '',
            taskNameErrorMessage: '',
            descriptionErrorMessage: '',
        }

        this.params = this.props.route.params;
        console.log("Params", this.params);
    }

    _refresh() {
        this.componentDidMount()
    }

    componentDidMount() {
        //Call this on every page
        ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getData();
        if (this.params) {
            this.getCount();
        }
    }

    getData() {
        this.setState({ isLoading: true });
        ClinicRequest.getTaskInit().then(taskData => {
            console.log('gdgdgdgddghsjska', taskData);


            let priorities = taskData?.data?.priority.map((item) => {
                return {
                    id: item?.id != null ? item.id : '',
                    label: item?.name != 'undefined' ? item.name : '',
                };
            })

            let staffs = taskData.data.staffs.edges.map((item) => {
                return {
                    id: item.node.id,
                    label: item.node.name,
                };

            });

            let students = taskData.data.students.edges.map((item) => {
                return {
                    id: item.node.id,
                    label: item.node.firstname,
                };
            });

            let statuses = taskData?.data?.taskStatus.map((item) => {
                return {
                    id: item?.id,
                    label: item?.taskStatus,
                };
            })

            let taskTypes = taskData.data.taskType.map((item) => {
                return {
                    id: item.id,
                    label: item.taskType,
                };
            })
            console.log("TaskjgjgjgType", taskTypes, priorities,
                staffs,
                students,
                statuses);


            let selectedStaffs = []
            let selectedStudents = []
            let reminders = []
            console.log("this params===", this.params)

            if (this.params) {
                if (this.params.node.assignWork.edges.length != 0) {
                    this.params.node.assignWork.edges.map((item) => {
                        selectedStaffs.push(item.node.id)
                    });
                }
                if (this.params.node.students.edges.length != 0) {
                    this.params.node.students.edges.map((item) => {
                        selectedStudents.push(item.node.id)
                    });
                }
                if (this.params.node.remainders.edges.length != 0) {
                    this.params.node.remainders.edges.map((item) => {
                        reminders.push({
                            time: item.node.time, frequency: [],
                            timesError: "", frequencyError: ""
                        })

                    });
                }
            }

            this.setState({
                isLoading: false,
                priorities,
                staffs,
                students,
                statuses,
                taskTypes,
            }, () => {
                if (this.params) {
                    this.setState({
                        selectedStudent: this.params.node.students.edges.length != 0 ?
                            selectedStudents : [],
                        selectedPriority: this.params?.node?.priority?.id != null ? this.params?.node?.priority?.id : '',
                        selectedStaff: this.params.node.assignWork.edges.length != 0 ?
                            selectedStaffs : [],
                        selectedTaskType: this.params?.node?.taskType.id,
                        selectedStatus: this.params?.node?.status?.id != null ? this.params.node.status.id : '',
                        taskName: this?.params?.node?.taskName,
                        description: this.params.node.description,
                        reminders: this.params.node.remainders.edges.length != 0 ?
                            reminders : [
                                { time: moment().format("HH:mm:ss"), frequency: [], timesError: "", frequencyError: "" },
                            ],

                        // startDate: this.params.node.startDate,
                        // dueDate: this.params.node.dueDate,

                    });
                }

            });
        }).catch(error => {
            Alert.alert('Information', JSON.stringify(error));
            this.setState({ isLoading: false, isAttendanceLoading: false });
        });
    }

    validateForm() {
        const { typeIndex } = this.state
        let anyError = false;

        this.setState({
            studentErrorMessage: '',
            staffErrorMessage: '',
            typeErrorMessage: '',
            priorityErrorMessage: '',
            statusErrorMessage: '',
            taskNameErrorMessage: '',
            descriptionErrorMessage: '',
        });

        if (typeIndex == 0 || typeIndex == 1 || typeIndex == 3) {

            if (this.state.selectedStudent == null) {
                this.setState({ studentErrorMessage: 'Please choose student' });
                anyError = true;
            }
        }


        if (typeIndex == 0 || typeIndex == 1 || typeIndex == 3) {
            if (this.state.selectedStaff == null) {
                this.setState({ staffErrorMessage: 'Please choose staff' });
                anyError = true;
            }
        }


        if (this.state.selectedTaskType == null) {
            this.setState({ typeErrorMessage: 'Please choose task type' });
            anyError = true;
        }

        if (typeIndex == 0 || typeIndex == 1 || typeIndex == 2) {

            if (this.state.selectedPriority == null) {
                this.setState({ priorityErrorMessage: 'Please choose priority' });
                anyError = true;
            }
        }

        if (typeIndex == 0 || typeIndex == 1 || typeIndex == 2) {

            if (this.state.selectedStatus == null) {
                this.setState({ statusErrorMessage: 'Please choose status' });
                anyError = true;
            }
        }

        if (this.state.taskName == '') {
            this.setState({ taskNameErrorMessage: 'Please fill task name' });
            anyError = true;
        }

        if (this.state.description == '') {
            this.setState({ descriptionErrorMessage: 'Please fill description' });
            anyError = true;
        }

        let reminders = this.state.reminders;

        // if (typeIndex == 0 || typeIndex == 1 || typeIndex == 2) {
        //
        //     reminders.forEach((reminder, key) => {
        //         if (reminder.time == "") {
        //             reminders[key].timesError = "Specify this value";
        //             anyError = true;
        //         }
        //         if (reminder.frequency == "") {
        //             reminders[key].frequencyError = "Specify this value";
        //             anyError = true;
        //         }
        //     });
        // }

        return anyError;
    }

    saveTask() {
        if (this.validateForm()) {
            return;
        }
        let {
            selectedStudent,
            selectedStaff,
            selectedTaskType,
            selectedPriority,
            selectedStatus,
            taskName,
            description,
            startDate,
            dueDate,
            time,
            Date,
            taskDatetime,
            reminders,
        } = this.state

        let queryString = {
            taskType: selectedTaskType,
            taskName,
            description,
            priority: selectedPriority != null ? selectedPriority : '',
            status: selectedStatus != null ? selectedStatus : '',
            startDate,
            dueDate,
            Date,
            time,
            taskDatetime: moment(Date + " " + time, "YYYY-MM-DDTHH:mm:ssZ").local().utc().format("YYYY-MM-DDTHH:mm:ssZ"),
            assignWork: selectedStaff,
            students: selectedStudent,

        };
        this.setState({ isSaving: true });

        queryString.remainders = reminders.map((item) => {
            return {
                time: moment(item.time, "HH:mm:ss").local().utc().format("HH:mm:ss"),
                frequency: item.frequency
            };
        });


        // return;
        console.log("yyffdggdgdgd", queryString);


        let promise = null;
        if (this.params) {
            queryString.id = this.params.node.id;
            promise = ClinicRequest.taskUpdate(queryString);
            this.saveCount(this.params.node.id)
        } else {
            promise = ClinicRequest.taskNew(queryString);
        }

        promise.then(dataResult => {
            console.log(dataResult);
            if (this.params) {
                this.saveCount(this.params.node.id)
            } else {
                this.saveCount(dataResult.data.createTask.task.id)
            }

            // this.saveCount('abcd')
            this.setState({
                isSaving: false,

                selectedStudent: [],
                selectedStaff: [],
                selectedTaskType: null,
                selectedPriority: "",
                selectedStatus: null,

                taskName: "",
                description: "",
            });

            if (this.params) {
                Alert.alert('Information', 'Task Updated Succesfully.');
            } else {
                Alert.alert('Information', 'New Task Created Succesfully.');
            }

            if (this.props.disableNavigation) {

            } else {
                this.props.navigation.goBack();
            }

            //refresh list screen
            let parentScreen = store.getState().profile;
            if (parentScreen) {
                parentScreen._refresh();
            }
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isSaving: false });

            Alert.alert('Information', JSON.stringify(error));
        });
    }
    saveCount(id) {
        let queryString = {
            taskId: id,
            countData: this.state.completionCount,
        };
        ClinicRequest.saveCount(queryString)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log('counter success', JSON.stringify(data));
                // Alert.alert('counter Sucess',);
            })
            .catch(err => {
                // Alert.alert('counter error', JSON.stringify(err));
                console.log('saveSessionRecord -> err', JSON.stringify(err));
            });
    }

    getCount() {
        let queryString = {
            taskId: this.params.node.id
        };
        ClinicRequest.getCount(queryString)
            .then(response => {
                return response.data;
            })
            .then(getdata => {
                if (getdata.taskCount[0].count >= 0) {
                    this.setState({ completionCount: getdata.taskCount[0].count })
                }
                console.log('ttthhggggg', getdata.taskCount[0].count);
            })
            .catch(err => {
                // Alert.alert('counter error', JSON.stringify(err));
                console.log('saveSessionRecord -> err', JSON.stringify(err));
            });
    }
    changeTaskCompletion(changeType) {
        if (changeType === 'I') {
            this.setState({ completionCount: this.state.completionCount + 1 });
        } else if (changeType === 'D' && this.state.completionCount > 0) {
            this.setState({ completionCount: this.state.completionCount - 1 });
        }
    }

    render() {
        let {
            students,
            selectedStudent,
            staffs,
            selectedStaff,
            taskTypes,
            selectedTaskType,
            priorities,
            selectedPriority,
            statuses,
            selectedStatus,
            taskName,
            description,
            startDate,
            dueDate,
            Date,
            time,
            completionCount,
        } = this.state;

        const [genralType] = [{ title: 'Task Name', key: 'textInput' },
        { title: 'Task Summary', key: 'textInput' },
        { title: 'Staff', key: 'text' },
        { title: 'Student', key: 'text' },
        { title: 'Date', key: 'date' },
        { title: 'Time', key: 'date' },
        { title: 'Priority', key: 'text' },
        { title: 'Status', key: 'text' },
        { title: 'Start Date', key: 'date' },
        { title: 'end Date', key: 'date' },
        { title: 'Reminder', key: 'date' },
        { title: 'Task Completion', key: 'date' },]

        const [theraphyType] = [{ title: 'Task Name', key: 'textInput' },
        { title: 'Task Summary', key: 'textInput' },
        { title: 'Staff', key: 'text' },
        { title: 'Student', key: 'text' },
        { title: 'Date', key: 'date' },
        { title: 'Time', key: 'date' },
        { title: 'Priority', key: 'text' },
        { title: 'Status', key: 'text' },
        { title: 'Start Date', key: 'date' },
        { title: 'end Date', key: 'date' },
        { title: 'Reminder', key: 'date' },
        { title: 'Task Completion', key: 'date' },]

        const [ReminderType] = [{ title: 'Task Name', key: 'textInput' },
        { title: 'Task Summary', key: 'textInput' },
        { title: 'Staff', key: 'text' },
        { title: 'Priority', key: 'text' },
        { title: 'Status', key: 'text' },
        { title: 'Start Date', key: 'date' },
        { title: 'end Date', key: 'date' },
        { title: 'Reminder', key: 'date' },
        { title: 'Task Completion', key: 'date' },]

        const [noteType] = [{ title: 'Task Name', key: 'textInput' },
        { title: 'Task Summary', key: 'textInput' },
        { title: 'Staff', key: 'text' },
        { title: 'Student', key: 'text' },
        { title: 'Date', key: 'date' },
        { title: 'Time', key: 'date' },]

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title={this.params ? "Edit Task" : "New Task"}
                // disabledTitle
                />

                {!this.state.isLoading && (
                    <Container enablePadding={this.props.disableNavigation != true}>
                        <ScrollView keyboardShouldPersistTaps='handled'
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior="automatic"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isLoading}
                                    onRefresh={this._refresh.bind(this)}
                                />
                            }
                        >

                            <PickerModal
                                label='Type'
                                error={this.state.typeErrorMessage}
                                placeholder="Select Type"
                                selectedValue={selectedTaskType}
                                data={taskTypes}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        selectedTaskType: itemValue,
                                        typeIndex: itemIndex,
                                    });
                                }}
                            />

                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2 ||
                                this.state.typeIndex == 3) && (
                                    <TextInput
                                        label="Task Name"
                                        placeholder={'Task Name'}
                                        error={this.state.taskNameErrorMessage}
                                        defaultValue={taskName}
                                        onChangeText={(taskName) => {
                                            this.setState({ taskName, taskNameErrorMessage: '' })
                                        }}
                                    />
                                )}


                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2 ||
                                this.state.typeIndex == 3) && (
                                    <TextInput
                                        label="Task Summary"
                                        placeholder={'Task Summary'}
                                        error={this.state.descriptionErrorMessage}
                                        defaultValue={description}
                                        onChangeText={(description) => {
                                            this.setState({ description, descriptionErrorMessage: '' })
                                        }}
                                    />
                                )}

                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 3) &&

                                // <PickerModal
                                //     label='Staff'
                                //     error={this.state.staffErrorMessage}
                                //     placeholder="Select Staff"
                                //     selectedValue={selectedStaff}
                                //     data={staffs}
                                //     onValueChange={(itemValue, itemIndex) => {
                                //         this.setState({selectedStaff: itemValue});
                                //     }}
                                // />

                                <MultiPickerModal
                                    label='Staff'
                                    error={this.state.staffErrorMessage}
                                    value={selectedStaff}
                                    data={staffs}
                                    onSelect={(values) => {
                                        console.log("On select Student", values);
                                        this.setState({ selectedStaff: values });
                                    }}
                                />

                            }


                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 3) &&
                                // <PickerModal
                                //     label='Student'
                                //     error={this.state.studentErrorMessage}
                                //     placeholder="Select Student"
                                //     selectedValue={selectedStudent}
                                //     data={students}
                                //     onValueChange={(itemValue, itemIndex) => {
                                //         console.log("Changed", itemValue);
                                //         this.setState({selectedStudent: itemValue});
                                //     }}
                                // />
                                <MultiPickerModal
                                    label='Learner'
                                    error={this.state.studentErrorMessage}
                                    placeholder='Select Learner'
                                    value={selectedStudent}
                                    data={students}
                                    onSelect={(values) => {
                                        console.log("On select Student", values);
                                        this.setState({ selectedStudent: values })

                                    }}
                                />
                            }





                            {/*{(this.state.typeIndex == 0 ||*/}
                            {/*    this.state.typeIndex == 1 ||*/}
                            {/*    this.state.typeIndex == 3 )&&*/}
                            {/*<View>*/}

                            {/*    <Text style={Styles.grayText}>Date</Text>*/}
                            {/*    <DateInput*/}
                            {/*        format='YYYY-MM-DD'*/}
                            {/*        displayFormat='dddd, DD MMM YYYY'*/}
                            {/*        value={Date}*/}
                            {/*        onChange={(Date) => {*/}
                            {/*            this.setState({Date});*/}
                            {/*        }}/>*/}
                            {/*</View>}*/}

                            {/*{(this.state.typeIndex == 0 ||*/}
                            {/*    this.state.typeIndex == 1 ||*/}
                            {/*    this.state.typeIndex == 3) &&*/}
                            {/*<View>*/}

                            {/*    <Text style={Styles.grayText}>Time</Text>*/}
                            {/*    <DateInput*/}
                            {/*        mode='time'*/}
                            {/*        format='HH:mm:ss'*/}
                            {/*        displayFormat='hh:mm A'*/}
                            {/*        value={time}*/}
                            {/*        onChange={(time) => {*/}
                            {/*            this.setState({time});*/}
                            {/*        }}/>*/}
                            {/*</View>}*/}




                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2) &&
                                <PickerModal
                                    label='Priority'
                                    error={this.state.priorityErrorMessage}
                                    placeholder="Select Priority"
                                    selectedValue={selectedPriority}
                                    data={priorities}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({
                                            selectedPriority: itemValue,
                                            priorityErrorMessage: ''
                                        });
                                    }}
                                />}
                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2) &&
                                <PickerModal
                                    label='Status'
                                    error={this.state.statusErrorMessage}
                                    placeholder="Select Status"
                                    selectedValue={selectedStatus}
                                    data={statuses}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({
                                            selectedStatus: itemValue,
                                            statusErrorMessage: ''
                                        });
                                    }}
                                />}



                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2) &&
                                <View>

                                    <Text style={Styles.grayText}>Start Date</Text>
                                    <DateInput
                                        format='YYYY-MM-DD'
                                        displayFormat='dddd, DD MMM YYYY'
                                        value={startDate}
                                        onChange={(startDate) => {
                                            this.setState({ startDate });
                                        }} />
                                </View>}

                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2) &&

                                <View>

                                    <Text style={Styles.grayText}>End Date</Text>
                                    <DateInput
                                        format='YYYY-MM-DD'
                                        displayFormat='dddd, DD MMM YYYY'
                                        value={dueDate}
                                        onChange={(dueDate) => {
                                            this.setState({ dueDate });
                                        }} />
                                </View>}

                            {(this.state.typeIndex == 0 ||
                                this.state.typeIndex == 1 ||
                                this.state.typeIndex == 2) &&
                                <View>

                                    <Text style={Styles.grayText}>Reminder</Text>
                                    {/*<DateInput*/}
                                    {/*    mode='time'*/}
                                    {/*    format='HH:mm:ss'*/}
                                    {/*    displayFormat='hh:mm A'*/}
                                    {/*    value={time}*/}
                                    {/*    onChange={(time) => {*/}
                                    {/*        this.setState({time});*/}
                                    {/*    }}/>*/}

                                    <>
                                        <Row>
                                            <Column>

                                            </Column>
                                            <Column style={{ flex: 0, width: 120 }}>
                                                <Button
                                                    theme='secondary'
                                                    style={{ height: 42 }}
                                                    labelButton="Add"
                                                    onPress={() => {
                                                        let reminders = this.state.reminders;
                                                        reminders.push({ time: moment().format("HH:mm:ss"), frequency: [], timesError: "", frequencyError: "" },);
                                                        this.setState({ reminders });
                                                    }}
                                                />
                                            </Column>
                                        </Row>
                                        {this.state.reminders.map((reminder, key) => {
                                            return (
                                                <View key={key}>
                                                    <Row>
                                                        <Column style={{ flex: 0, width: 150, }}>
                                                            {reminder.timesError != "" && <Text style={{ color: Color.danger }}>{reminder.timesError}</Text>}
                                                        </Column>
                                                        <Column>
                                                            {reminder.frequencyError != "" && <Text style={{ color: Color.danger }}>{reminder.frequencyError}</Text>}
                                                        </Column>
                                                        <Column style={{ flex: 0, width: 50 }}>
                                                        </Column>
                                                    </Row>
                                                    <Row>
                                                        <Column style={{ flex: 0, width: 150 }}>
                                                            <DateInput
                                                                mode='time'
                                                                format='HH:mm:ss'
                                                                displayFormat='hh:mm A'
                                                                value={reminder.time}
                                                                onChange={(time) => {
                                                                    let reminders = this.state.reminders;
                                                                    reminders[key].time = time;
                                                                    this.setState({ reminders });
                                                                }} />
                                                        </Column>
                                                        <Column>
                                                            <MultiPickerModal data={this.state.daysArray}
                                                                value={reminder.frequency}
                                                                onSelect={(values) => {
                                                                    console.log("On select", values);
                                                                    let reminders = this.state.reminders;
                                                                    reminders[key].frequency = values;
                                                                    this.setState({ reminders });
                                                                }} />
                                                        </Column>
                                                        <Column style={{ flex: 0, width: 50 }}>
                                                            {this.state.reminders.length > 1 &&

                                                                <Button
                                                                    theme='danger'
                                                                    style={{ height: 42, marginTop: 10 }}
                                                                    labelButton={<MaterialCommunityIcons name='minus' size={30} color={Color.danger} />}
                                                                    onPress={() => {
                                                                        let reminders = this.state.reminders;
                                                                        reminders.splice(key, 1);
                                                                        this.setState({ reminders });
                                                                    }}
                                                                />}
                                                        </Column>
                                                    </Row>
                                                </View>
                                            );
                                        })}

                                    </>

                                    <View style={{ borderWidth: 1, borderColor: '#bcbcbc', padding: 5, borderRadius: 5 }}>
                                        {/* Daily Trails */}
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: '500',
                                                        color: '#63686E',
                                                        paddingTop: 12,
                                                        flex: 1,
                                                    }}>
                                                    Task Completion
                                                <Text style={{ textAlign: 'left', color: 'red' }}>
                                                        {/*{this.state.dailyTrialsError}*/}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.changeTaskCompletion('D');
                                                    }}>
                                                    <Text style={styles.hrButton}>
                                                        <MaterialCommunityIcons
                                                            name="minus"
                                                            size={14}
                                                            color={Color.black}
                                                            style={styles.minusButtonText}
                                                        />
                                                    </Text>
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        paddingLeft: 10,
                                                        paddingRight: 10,
                                                        paddingTop: 5,
                                                        fontSize: 14,
                                                    }}>
                                                    {completionCount}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.changeTaskCompletion('I');
                                                    }}>
                                                    <Text style={styles.hrButton}>
                                                        <MaterialCommunityIcons
                                                            name="plus"
                                                            size={24}
                                                            color={Color.black}
                                                            style={styles.plusButtonText}
                                                        />
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>


                                </View>}
                        </ScrollView>
                        <Button
                            labelButton="Save Task"
                            onPress={() => this.saveTask()}
                            isLoading={this.state.isSaving}
                            style={{ marginVertical: 10 }}
                        />
                    </Container>
                )}

                {this.state.isLoading && <ActivityIndicator color={Color.primary} />}
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
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
        paddingTop: 15
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 22,
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#45494E'
    },

    TextStyle: {
        marginTop: 24,
        marginBottom: 16,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
    input: {
        marginVertical: 10,
        padding: 6,
        borderRadius: 6,
        borderColor: '#DCDCDC',
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row'
    },
    input1: {
        marginTop: 10,
        marginBottom: 10,

        fontSize: 15,
        fontStyle: 'normal',

        textAlign: 'left',
        color: '#10253C',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        borderColor: '#DCDCDC',
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row', paddingLeft: 15
    },

    backIconText1: {
        fontSize: 15,
        fontWeight: 'normal',
        color: '#63686E',

    },
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
        borderColor: '#fff'
    },
    continueView: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        marginTop: 500

    },
    continueViewText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
    text1: {
        marginLeft: 10, marginRight: 19
    },
    hrButton: {
        justifyContent: 'center',
        width: 25,
        height: 25,
        // backgroundColor: '#3E7BFA',
        borderRadius: 4,
        // marginLeft: 8,
        paddingTop: 8,
        textAlign: 'center',
    },
    plusButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3E7BFA',
    },
    minusButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#63686E',
    },

});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskNew);
