import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Color from '../../utility/Color.js';
import Styles from '../../utility/Style.js';
import Button from '../../components/Button';
import ToggleSwitch from 'toggle-switch-react-native'
const width = Dimensions.get('window').width
class ClinicDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            image: require('../../../android/img/blue-heart.png'),
            staffManagement: [
                { id: 0, name: 'Dianne Nguyen', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Leave Request', statusId: 2 },
                { id: 1, name: 'Esther Williamson', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Submitted', statusId: 2 },
                { id: 2, name: 'Dianne Nguyen', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Leave Request', statusId: 2 },
                { id: 3, name: 'Esther Williamson', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Submitted', statusId: 2 },
            ],
            projectManagement: [
                {
                    id: 0, title: 'Peak Catalouge', description: 'Description, this is Description and Description', task: '100', completed: '67', high_priority: [
                        { image: require('../../../android/img/Img-1.png') },
                        { image: require('../../../android/img/Img-2.png') },
                        { image: require('../../../android/img/Img-3.png') },
                    ], value: 67
                },
            ],
        }
    }
    _refresh() {

    }
    componentDidMount() {

    }

    signOut() {
        null
    }

    render() {
        let { image, staffManagement, projectManagement } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._refresh.bind(this)}
                        />
                    }
                >

                    <Text style={[styles.title, { marginTop: 8 }]}>Athena Health</Text>
                    <TouchableOpacity onPress={() => null} style={styles.studentItem}>
                        <Image style={styles.studentImage} source={image} />
                        <View style={{ flex: 1, marginHorizontal: 8 }}>
                            <Text style={[styles.textBig, { fontSize: 18, fontWeight: 'bold' }]}>Athena Health</Text>
                            <Text style={Styles.bigGrayText}>Bengaluru, India - INR</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('StaffManagement')} style={[Styles.rowBetween, { marginVertical: 8 }]}>
                        <Text style={Styles.bigGrayTextBold}>Staff Management</Text>
                        <MaterialCommunityIcons
                            name='chevron-right'
                            size={28}
                            color={Color.grayFill}
                        />
                    </TouchableOpacity>
                    {staffManagement.map((staff, index) => {
                        if (index < 2) {
                            return (
                                <TouchableOpacity key={index} onPress={() => this.studentDetail(student)} style={styles.studentItem}>
                                    <Image style={styles.studentImage} source={staff.image} />
                                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                                        <Text style={styles.text}>{staff.name}</Text>

                                        <View style={[styles.row, { alignItems: 'center' }]}>
                                            <Text style={styles.studentSubject}>{staff.position}</Text>
                                            <View style={styles.dot} />
                                            <Text style={[styles.studentSubject, { color: staff.statusId == 2 ? Color.warning : Color.primary }]}>{staff.status}</Text>
                                        </View>
                                    </View>
                                    <MaterialCommunityIcons
                                        name='chevron-right'
                                        size={24}
                                        color={Color.grayFill}
                                    />
                                </TouchableOpacity>
                            )
                        }
                    })}
                    <TouchableOpacity style={[Styles.rowBetween, { marginVertical: 8 }]}>
                        <Text style={Styles.bigGrayTextBold}>Project Management</Text>
                        <MaterialCommunityIcons
                            name='chevron-right'
                            size={28}
                            color={Color.grayFill}
                        />
                    </TouchableOpacity>

                    {projectManagement.map((project, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => null}
                                style={{ flex: 1, borderRadius: 4, marginVertical: 4, padding: 8, paddingVertical: 12, }}
                            >
                                <View style={Styles.column}>
                                    <Text style={Styles.blackTextBold}>{project.title}</Text>
                                    <Text style={[Styles.blackText, { fontSize: 12, marginVertical: 8, }]}>{project.description}</Text>
                                </View>
                                <View style={Styles.rowBetween}>
                                    <Text style={[Styles.bigBlackText, { fontSize: 12 }]}>{project.completed + "/" + project.task + 'Tasks Completed'}</Text>
                                    <Text style={[Styles.bigBlackText, { fontSize: 12 }]}>{project.value + '%'}</Text>
                                </View>
                                <View style={{ height: 4, width: width / 1.16, backgroundColor: Color.gray, marginVertical: 8 }}>
                                    <View style={{ height: 4, width: (width / 1.16) / (project.value / 50), backgroundColor: Color.primary }} />
                                </View>
                                <View style={Styles.rowBetween}>
                                    <Text style={[Styles.blackTextBold, { fontSize: 13, padding: 4, backgroundColor: 'rgba(255,0,0,0.1)', color: Color.red }]}>{'HIGH PRIORITY'}</Text>
                                    <View style={{ flex: 1 }} />
                                    <View style={[Styles.row, { justifyContent: 'flex-end' }]}>
                                        {project.high_priority.map((hp, k) => {
                                            if (k < 4) {
                                                return (
                                                    <Image key={k} style={{ height: 24, width: 20, marginHorizontal: 1 }} source={hp.image} />
                                                )
                                            }
                                        })}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                    <TouchableOpacity style={[Styles.rowBetween, { marginVertical: 8 }]}>
                        <Text style={Styles.bigGrayTextBold}>Personal Details</Text>
                        <MaterialCommunityIcons
                            name='account-edit'
                            size={24}
                            color={Color.primary}
                        />
                    </TouchableOpacity>
                    <View style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
                        <MaterialCommunityIcons
                            name='email-outline'
                            size={20}
                            color={Color.grayFill}
                            style={{ marginRight: 8 }}
                        />
                        <View style={Styles.column}>
                            <Text style={Styles.grayText}>Email Address</Text>
                            <Text style={[Styles.primaryText, { marginVertical: 4 }]}>bengaluru@athena.com</Text>
                        </View>
                    </View>
                    <View style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
                        <MaterialCommunityIcons
                            name='phone-outline'
                            size={20}
                            color={Color.grayFill}
                            style={{ marginRight: 8 }}
                        />
                        <View style={Styles.column}>
                            <Text style={Styles.grayText}>Mobile Number</Text>
                            <Text style={[Styles.primaryText, { marginVertical: 4 }]}>+91 9191303042</Text>
                        </View>
                    </View>
                    <View style={[Styles.row, { alignItems: 'flex-start', marginVertical: 8 }]}>
                        <MaterialCommunityIcons
                            name='lock-outline'
                            size={20}
                            color={Color.grayFill}
                            style={{ marginRight: 8 }}
                        />
                        <View style={Styles.column}>
                            <Text style={Styles.grayText}>Password</Text>
                            <Text style={[Styles.primaryText, { marginVertical: 4 }]}>Last updated on Nov. 23, 2019</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }
}
const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    recentImage: {
        width: width / 11, height: width / 11,
        borderRadius: 20
    },
    studentImage: {
        width: 50, height: 50,
        borderRadius: 8
    },
    smallImage: {
        width: width / 15, height: width / 15, borderRadius: 2,
    },
    bigImage: {
        width: width / 3, height: width / 3.3,
        resizeMode: 'contain',
        // backgroundColor: 'red'
    },
    row: {
        flex: 1, flexDirection: 'row'
    },
    container: {
        flex: 1, paddingVertical: 4, paddingHorizontal: 16,
        backgroundColor: Color.white
    },
    recentBox: {
        marginHorizontal: 8, height: 60, alignItems: 'center'
    },
    title: {
        fontSize: 28, fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
    },
    textBig: {
        fontSize: 16
    },
    textSmall: {
        fontSize: 10,
    },
    newCount: {
        backgroundColor: Color.primary, padding: 2,
        width: 16, height: 16, borderRadius: 4, justifyContent: 'center'
    },
    textCount: {
        color: Color.white, fontSize: 10, textAlign: 'center'
    }
    ,
    line: {
        height: 1, width: width / 1.2, backgroundColor: Color.silver,
        marginVertical: 4
    },
    dot: {
        height: width / 55, width: width / 55, backgroundColor: Color.silver, borderRadius: width / 55,
        marginHorizontal: 8
    },
    studentItem: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center',
        padding: 10
    },
    studentSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
});
export default ClinicDashboard;
