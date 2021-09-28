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
import Color from '../../utility/Color.js';
import Header from '../../components/Header';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['name', 'subject'];

const width = Dimensions.get('window').width
class StaffManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            searchStaffManagement: '',
            staffs: [
                { id: 0, name: 'Dianne Nguyen', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Leave Request', statusId: 2 },
                { id: 1, name: 'Esther Williamson', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Submitted', statusId: 2 },
                { id: 2, name: 'Dianne Nguyen', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Leave Request', statusId: 2 },
                { id: 3, name: 'Esther Williamson', image: require('../../../android/img/doctors.png'), position: 'Therapist', status: 'Pending Submitted', statusId: 2 },
            ],

        }
    }
    _refresh() {

    }
    componentDidMount() {

    }
    searchUpdated(term) {
        this.setState({ searchStaffManagement: term })
    }
    studentDetail(item) {
        this.props.navigation.navigate('StaffManagementDetails', item)
    }
    render() {
        let { staffs } = this.state
        const filteredStaffManagements = staffs.filter(createFilter(this.state.searchStaffManagement, KEYS_TO_FILTERS))
        filteredStaffManagements.sort()

        return (
            <SafeAreaView style={styles.container}>
                <Header
                    title={"Staff Management"}
                    backPress={() => this.props.navigation.goBack()}
                    materialCommunityIconsName={'plus'}
                    dotsPress={() => null}
                />
                <View style={[styles.row, { paddingHorizontal: 16, alignItems: 'center', maxHeight: 40, backgroundColor: Color.grayWhite }]}>
                    <MaterialCommunityIcons
                        name='account-search-outline'
                        size={24}
                        color={Color.gray}
                    />
                    <SearchInput
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        style={styles.searchInput}
                        placeholder="Search Employee"
                    // clearIcon
                    />
                </View>
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._refresh.bind(this)}
                        />
                    }
                >
                    {filteredStaffManagements.map((staff, index) => {
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
                    })}

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
        width: width / 10, height: width / 10,
        borderRadius: 4
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
    buttonStart: {
        flex: 1, backgroundColor: Color.primary, borderRadius: 8,
        alignItems: 'center', paddingVertical: 12
    },
    buttonStartText: {
        color: Color.white
    },
    buttonEnd: {
        flex: 1, borderColor: Color.primary, borderWidth: 1, borderRadius: 8,
        alignItems: 'center', paddingVertical: 12
    },
    buttonEndText: {
        color: Color.primary
    },
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
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
    },
    studentSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
    searchInput: {
        padding: 4, width: width / 1.4,
        backgroundColor: Color.grayWhite,
    }
});
export default StaffManagement;
