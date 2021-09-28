import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Overlay } from 'react-native-elements';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image, Alert,
    Picker, ActivityIndicator, Dimensions,
    Text, TextInput, TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
// import Select from 'react-select';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'react-native-elements';
import { ApolloProvider, Mutation } from 'react-apollo';
import { client, getRelationships, updateFamilyMember, deleteFamilyMember, getFamilyMembers, getSessions, getFamilyMemberDetails } from '../../../constants/index';
import CogniableSelectDropdown from '../../../components/CogniableSelectDropdown';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult, getAuthTokenPayload } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import DateHelper from '../../../helpers/DateHelper';
import StudentHelper from '../../../helpers/StudentHelper';
import TokenRefresher from '../../../helpers/TokenRefresher';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import ImageHelper from '../../../helpers/ImageHelper';
import Color from '../../../utility/Color';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import ParentRequest from '../../../constants/ParentRequest';
import {getStr} from "../../../../locales/Locale";


const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class FamilyMemberDetailScreen extends Component {
    // const [ selectedValue, setSelectedValue ] = useState("java");
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            familyMember: {},
            sessions: [],
            isAlertPresent: false,
            memberName: '',
            familyRelaitionships: [],
            relationshipId: '',
            selectedOption: '',
            choosenIndex: 0,
            options: [{ label: "Relationship to child", id: "" }],
            value: '',
            morningHours: 0,
            afternoonHours: 0,
            eveningHours: 0,

            nameErrorMessage: '',
            relationErrorMessage: ''
        };
        this.showAddFamilyMember = this.showAddFamilyMember.bind(this);
        this.goBack = this.goBack.bind(this);
        // this.navigateBack = this.navigateBack.bind(this);
    }
    goBack() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        const value = this.state.options[0].id;
        this.setState({
            value
        });
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getFamilyRelationships();
    }
    getMemberDetails(memberId) {
        let variables = {
            id: memberId
        }
        ParentRequest.getFamilyMemberDetails(variables).then(memberDetailsData => {
            console.log("getFamilyMemberDetails():" + JSON.stringify(memberDetailsData));
            this.setState({ isLoading: false });
            if (memberDetailsData.data.familyMember) {
                console.log("family", memberDetailsData.data.familyMember);
                this.setState({
                    familyMember: memberDetailsData.data.familyMember,
                    memberName: memberDetailsData.data.familyMember.memberName,
                    value: memberDetailsData.data.familyMember.relationship.id
                });

                console.log("CurrentID", memberDetailsData.data.familyMember.relationship.id);

                this.setSessionHours(memberDetailsData.data.familyMember);
            }

        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error, error.response);

            // Alert.alert('Information', error.toString());
        });

    }
    showSuccessAlert(operation) {
        Alert.alert(
            'Family Member',
            'Successfully ' + operation,
            [{
                text: 'OK', onPress: () => {
                    console.log('OK Pressed');
                    // this.setState({isAlertPresent: false})
                    this.props.navigation.navigate('profile', { newData: true });
                }
            }],
            { cancelable: false }
        );
    }
    setSessionHours(familyMember) {
        console.log("setSessionHours is called")
        let timeSpentEdges = familyMember.timeSpent.edges;
        let timeSpentLength = timeSpentEdges.length;
        let sessions = this.state.sessions;
        let sessionsLength = sessions.length;
        for (let i = 0; i < timeSpentLength; i++) {
            console.log(timeSpentEdges[i].node.sessionName.id);
            let duration = timeSpentEdges[i].node.duration;
            let sessionName = this.getSessionTypeById(timeSpentEdges[i].node.sessionName.id);
            if (sessionName === "Morning") {
                this.setState({ morningHours: parseInt(duration.charAt(0)) });
            } else if (sessionName === "Afternoon") {
                this.setState({ afternoonHours: parseInt(duration.charAt(0)) });
            } else if (sessionName === "Evening") {
                this.setState({ eveningHours: parseInt(duration.charAt(0)) });
            }
        }
    }
    getSessionTypeById(sessionId) {
        let sessionName = "";
        let sessions = this.state.sessions;
        let sessionsLength = sessions.length;
        for (let j = 0; j < sessionsLength; j++) {
            // console.log(sessions[j])
            if (sessionId === sessions[j].id) {
                sessionName = sessions[j].name;
            }
        }
        return sessionName;
    }
    getSessions() {
        ParentRequest.getSessions().then(sessionsData => {
            console.log("getSessions():" + JSON.stringify(sessionsData));
            this.setState({ isLoading: false });
            if (sessionsData.data.sessionName) {
                this.setState({ sessions: sessionsData.data.sessionName });
                let { route } = this.props;
                let memberId = route.params.memberId;
                this.getMemberDetails(memberId);
            }

        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error, error.response);

            // Alert.alert('Information', error.toString());
        });
    }
    getFamilyRelationships() {
        this.setState({ isLoading: true });
        ParentRequest.getRelationships().then(relationshipData => {
            console.log("getRelationships():" + JSON.stringify(relationshipData));
            this.setState({ isLoading: false });
            let options = relationshipData.data.relationships.map(element => {
                return { label: element.name, id: element.id };
            });

            this.setState({ options });

            console.log("Options", options);

            this.getSessions();

        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error, error.response);

            Alert.alert('Information', error.toString());
        });
    }
    getSessionHours() {
        console.log(this.state.morningHours);
        let timeSpent = [];
        for (let i = 0; i < this.state.sessions.length; i++) {
            if (this.state.sessions[i].name === "Morning" && this.state.morningHours > 0) {
                let h = (this.state.morningHours > 1) ? "Hours" : "Hour";
                console.log(h);
                timeSpent.push({
                    session: this.state.sessions[i].id,
                    duration: this.state.morningHours + " " + h
                });
            } else if (this.state.sessions[i].name === "Afternoon" && this.state.afternoonHours > 0) {
                let h = (this.state.afternoonHours > 1) ? "Hours" : "Hour";
                timeSpent.push({
                    session: this.state.sessions[i].id,
                    duration: this.state.afternoonHours + " " + h
                });
            } else if (this.state.sessions[i].name === "Evening" && this.state.eveningHours > 0) {
                let h = (this.state.eveningHours > 1) ? "Hours" : "Hour";
                timeSpent.push({
                    session: this.state.sessions[i].id,
                    duration: this.state.eveningHours + " " + h
                });
            }
        }
        return timeSpent;
    }

    removeFamilyMember() {
        Alert.alert(
            'Confirmation',
            'Are you sure want to delete this member ?',
            [
                { text: 'No', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        console.log("id: " + this.state.familyMember.id)
                        let { deleteMemberFuntion, data } = this.props;
                        this.deleteFamilyMember();
                    }
                },
            ],
            { cancelable: false }
        );
    }

    deleteFamilyMember() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.setState({ isLoading: true });
        let variables = { memberId: this.state.familyMember.id };
        ParentRequest.deleteFamilyMember(variables).then(result => {
            this.setState({ isLoading: false });
            let parentScreen = store.getState().parentProfile;
			console.log("parentScreen: " + parentScreen)
			if (parentScreen) {
				parentScreen._refresh();
			}
            this.showSuccessAlert("Deleted");
        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error, error.response);

            Alert.alert('Information', error.toString());
        });
    }

    saveFamilyMember() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.setState({
            nameErrorMessage: '',
            relationErrorMessage: ''
        });

        let anyError = false;

        if (this.state.memberName == '') {
            this.setState({ nameErrorMessage: 'Please fill name' });
            anyError = true;
        }

        console.log("Val", this.state.value);

        if (this.state.value == '' || this.state.value == null) {
            this.setState({ relationErrorMessage: 'Please choose relationship' });
            anyError = true;
        }

        if (anyError) {
            return;
        }


        let timeSpentHours = this.getSessionHours();
        let queryParams = {
            memberId: this.state.familyMember.id,
            memberName: this.state.memberName,
            relationship: this.state.value,
            timeSpent: timeSpentHours
        };
        console.log(queryParams)
        this.setState({ isLoading: true });
        ParentRequest.updateFamilyMember(queryParams).then(result => {
            this.setState({ isLoading: false });
            let parentScreen = store.getState().parentProfile;
			console.log("parentScreen: " + parentScreen)
			if (parentScreen) {
				parentScreen._refresh();
			}
            this.showSuccessAlert("Updated");
        }).catch(error => {
			this.setState({ isLoading: false });
			console.log(error, error.response);

			Alert.alert('Information', error.toString());
		});
    }
    changeHours(type, changeType) {
        console.log(type);
        if (type === "M") {
            if (changeType === "I" && this.state.morningHours < 5) {
                this.setState({ morningHours: this.state.morningHours + 1 });
            } else if (changeType === "D" && this.state.morningHours > 0) {
                this.setState({ morningHours: this.state.morningHours - 1 });
            }
        } else if (type === "A") {
            if (changeType === "I" && this.state.afternoonHours < 5) {
                this.setState({ afternoonHours: this.state.afternoonHours + 1 });
            } else if (changeType === "D" && this.state.afternoonHours > 0) {
                this.setState({ afternoonHours: this.state.afternoonHours - 1 });
            }
        } else if (type === "E") {
            if (changeType === "I" && this.state.eveningHours < 5) {
                this.setState({ eveningHours: this.state.eveningHours + 1 });
            } else if (changeType === "D" && this.state.eveningHours > 0) {
                this.setState({ eveningHours: this.state.eveningHours - 1 });
            }
        }
    }
    render() {
        let {isLoading} = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title={getStr("Profile.FamilyMemberDetails")}
                />
                <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={styles.imageWrapper}>
                                <Image style={styles.image} source={{ uri: ImageHelper.getImage('') }} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10, paddingTop: 3 }}>
                                {this.state.nameErrorMessage != '' && <Text style={{ color: Color.danger }}>{this.state.nameErrorMessage}</Text>}
                                <TextInput style={styles.input}
                                    underlineColorAndroid="transparent"
                                    placeholder={"Name"}
                                    // placeholderTextColor={"black"}
                                    // placeholderFontWidth={"bold"}
                                    numberOfLines={1}
                                    value={this.state.memberName}
                                    onChangeText={(memberNameTxt) => {
                                        this.setState({ memberName: memberNameTxt });
                                    }}
                                />
                                <PickerModal
                                    error={this.state.relationErrorMessage}
                                    selectedValue={this.state.value}
                                    placeholder='Relationship to Child'
                                    data={this.state.options}
                                    onValueChange={(value, itemIndex) => {
                                        this.setState({ value })
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginBottom: 20 }} >
                            <Text style={{ fontSize: 19, color: '#45494E', fontWeight: '500' }}>{getStr("Profile.TimeSpentwith")} {StudentHelper.getStudentName()}</Text>
                            <Text style={{ marginTop: 4, color: '#888888', fontSize: 13 }}>{getStr("Profile.TimeDes")} {StudentHelper.getStudentName()} {getStr("Profile.TimeDess")}</Text>
                        </View>
                        {/* Morning Hours */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', width: '60%' }}>
                                <Image style={{ width: 30, height: 30, }} source={require('../../../../android/img/sunset.jpg')} />
                                <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E', paddingLeft: 12, flex: 1 }}>{getStr("NewChanges.Morning")}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '40%' }}>
                                <TouchableOpacity onPress={() => { this.changeHours('M', 'D') }}>
                                    <Text style={styles.hrButton}>
                                        <FontAwesome5 name={'minus'} style={styles.minusButtonText} />
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5, fontSize: 20 }}>
                                    {this.state.morningHours} {this.state.morningHours > 1 ? "hrs" : "hr"}
                                </Text>
                                <TouchableOpacity onPress={() => { this.changeHours('M', 'I') }}>
                                    <Text style={styles.hrButton}>
                                        <FontAwesome5 name={'plus'} style={styles.plusButtonText} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Afternoon Hours */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', width: '60%' }}>
                                <Image style={{ width: 30, height: 30, }} source={require('../../../../android/img/sun.jpg')} />
                                <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E', paddingLeft: 12, flex: 1 }}>{getStr("NewChanges.Afternoon")}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '40%' }}>
                                <TouchableOpacity onPress={() => { this.changeHours('A', 'D') }}>
                                    <Text style={styles.hrButton}>
                                        <FontAwesome5 name={'minus'} style={styles.minusButtonText} />
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5, fontSize: 20 }}>
                                    {this.state.afternoonHours} {this.state.afternoonHours > 1 ? "hrs" : "hr"}
                                </Text>
                                <TouchableOpacity onPress={() => { this.changeHours('A', 'I') }}>
                                    <Text style={styles.hrButton}>
                                        <FontAwesome5 name={'plus'} style={styles.plusButtonText} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Evening Hours */}
                        <View style={{ flexDirection: 'row', marginBottom: 50 }}>
                            <View style={{ flexDirection: 'row', width: '60%' }}>
                                <Image style={{ width: 30, height: 30, }} source={require('../../../../android/img/sunset.jpg')} />
                                <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E', paddingLeft: 12, flex: 1 }}>{getStr("NewChanges.Evening")}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '40%' }}>
                                <TouchableOpacity onPress={() => { this.changeHours('E', 'D') }}>
                                    <Text style={styles.hrButton}>
                                        <FontAwesome5 name={'minus'} style={styles.minusButtonText} />
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5, fontSize: 20 }}>
                                    {this.state.eveningHours} {this.state.eveningHours > 1 ? "hrs" : "hr"}
                                </Text>
                                <TouchableOpacity onPress={() => { this.changeHours('E', 'I') }}>
                                    <Text style={styles.hrButton}>
                                        <FontAwesome5 name={'plus'} style={styles.plusButtonText} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <Button labelButton={getStr("MedicalData.SaveData")}
                        isLoading={this.state.isSaving}
                        style={{ marginBottom: 10 }}
                        onPress={() => { this.saveFamilyMember() }}
                    />

                    <Button labelButton={getStr("MedicalData.DeleteThisMember")}
                        theme='secondary'
                        isLoading={this.state.isDeleting}
                        style={{ marginBottom: 10 }}
                        onPress={() => { this.removeFamilyMember() }}
                    />
                    {isLoading && (
                        <ActivityIndicator size="large" color="black" style={{
                            zIndex: 9999999,
                            // backgroundColor: '#ccc',
                            opacity: 0.9,
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            height: screenHeight,
                            justifyContent: "center"
                        }} />
                    )}
                </Container>
            </SafeAreaView>
        );
    }
    showAddFamilyMember() {
        let { navigation } = this.props;
        navigation.navigate("FamilyMemberDetails");
    }
};

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderColor: 'grey',
        height: 35
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 5
    },

    imageWrapper: {
        margin: 3,
        width: 110,
        height: 110,
        borderRadius: 5,
        backgroundColor: Color.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 5,
    },

    header: {
        flexDirection: 'row',
        height: 50,
        width: '100%'
    },
    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '15%',
        paddingTop: 15,
        paddingLeft: 15,
    },

    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    backIconText1: {
        fontSize: 15,
        fontWeight: 'normal',
        color: '#63686E',
        marginLeft: 190,
        marginTop: 10
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 22,
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#45494E'
    },

    body: {
        // marginLeft: 20,
        // marginRight: 15,
        // marginBottom: 230,
        // marginTop: 20
        margin: 10
    },
    person: {
        width: 50,
        height: 50,
        // paddingLeft: 5,
        // borderRadius: 2
    },
    scrollView: {
        backgroundColor: '#FFFFFF',
        height: screenHeight
    },

    deleteView: {
        width: '100%'
    },
    deleteViewTouchable: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        // marginLeft: 20,
        // marginRight: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3E7BFA'
    },
    deleteViewText: {
        color: '#3E7BFA',
        fontSize: 17,
        textAlign: 'center',
    },

    continueViewTouchable: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        // marginLeft: 20,
        // marginRight: 20,
        backgroundColor: '#3E7BFA',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    continueView: {
        width: '100%',
        marginBottom: 200
    },
    continueViewText: {
        color: '#fff',
        fontSize: 17,
        textAlign: 'center',
    },
    input: {
        borderColor: Color.gray,
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 5,
        height: 40
    },
    input1: {
        // flex: 1,
        flexDirection: 'row',
        marginLeft: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderRadius: 4
    },
    textInput: {
        paddingLeft: 16, paddingRight: 16,
        paddingTop: 8, paddingBottom: 9,
        fontSize: 18, flex: 1,
        height: 88,
        color: 'rgba(95, 95, 95, 0.75)',
        margin: 5,
        borderWidth: 2, borderColor: 'red'
    },
    dropdownIcon: {
        width: 40, height: 50, paddingTop: 20, paddingLeft: 12,
        //borderWidth: 2, borderColor: 'red'
    },
    mainContainer: {
        flex: 1, flexDirection: 'row', marginBottom: 40
    },
    hrButton: {
        justifyContent: 'center',
        width: 40,
        height: 40,
        // backgroundColor: '#3E7BFA',
        borderRadius: 4,
        // marginLeft: 8,
        paddingTop: 10,
        textAlign: 'center'
    },
    plusButtonText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#3E7BFA'
    },
    minusButtonText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },

    //
    relationPicker: {
        height: 50,
        width: 190,
        marginLeft: 16,
        borderColor: 'red',
        borderWidth: 5,
        // backgroundColor: '#ccc'
    }
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state),
    authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FamilyMemberDetailScreen);
