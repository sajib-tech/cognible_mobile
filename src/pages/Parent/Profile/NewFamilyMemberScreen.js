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
import CogniableSelectDropdown from '../../../components/CogniableSelectDropdown';
import store from "../../../redux/store";
import { connect } from 'react-redux';
import { getAuthResult, getAuthTokenPayload } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import StudentHelper from '../../../helpers/StudentHelper'
import DateHelper from '../../../helpers/DateHelper';
import TokenRefresher from '../../../helpers/TokenRefresher';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import PickerModal from '../../../components/PickerModal';
import ImageHelper from '../../../helpers/ImageHelper';
import Color from '../../../utility/Color';
import Button from '../../../components/Button';
import ParentRequest from '../../../constants/ParentRequest';
import {getStr} from "../../../../locales/Locale";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class NewFamilyMemberScreen extends Component {
    // const [ selectedValue, setSelectedValue ] = useState("java");
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
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

        this.goBack = this.goBack.bind(this);
        // this.navigateBack = this.navigateBack.bind(this);
    }
    goBack() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        const value = this.state.options[0].value;
        this.setState({
            value
        });
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getFamilyRelationships();
        this.getSessions();
    }
    getSessions() {
        ParentRequest.getSessions().then(sessionsData => {
            console.log("getSessions():" + JSON.stringify(sessionsData));
            this.setState({ isLoading: false });
            if (sessionsData.data.sessionName) {
                this.setState({ sessions: sessionsData.data.sessionName });
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
            relationshipData.data.relationships.map(element => (
                this.state.options.push({ label: element.name, id: element.id })
            ))

        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error, error.response);

            Alert.alert('Information', error.toString());
        });
    }
    getSessionHours() {
        console.log("getSessionHours() is called:"+this.state.morningHours);
        console.log("getSessionHours() is called:"+this.state.sessions.length);
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
    saveFamilyMember() {

        this.setState({
            nameErrorMessage: '',
            relationErrorMessage: ''
        });

        let anyError = false;

        if (this.state.memberName == '') {
            this.setState({ nameErrorMessage: getStr("Profile.Pleasefillname")});
            anyError = true;
        }

        console.log("Val", this.state.value);

        if (this.state.value == '' || this.state.value == null) {
            this.setState({ relationErrorMessage: getStr("Profile.Pleasechooserelationship")});
            anyError = true;
        }

        if (anyError) {
            return;
        }
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

        let timeSpentHours = this.getSessionHours();
        let queryParams = {
            student: store.getState().studentId,
            memberName: this.state.memberName,
            relationship: this.state.value,
            timeSpent: timeSpentHours
        };
        console.log(queryParams)
        this.setState({ isLoading: true });
        ParentRequest.addFamilyMember(queryParams).then(result => {
            this.setState({ isLoading: false });
            let parentScreen = store.getState().parentProfile;
			console.log("parentScreen: " + parentScreen)
			if (parentScreen) {
				parentScreen._refresh();
			}
            Alert.alert(
                'New Family Member',
                'Successfully Added',
                [{
                    text: 'OK', onPress: () => {
                        console.log('OK Pressed');
                        // this.setState({isAlertPresent: false})
                        this.props.navigation.navigate('profile', { newData: true });
                    }
                }],
                { cancelable: false }
            );
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
                    title={getStr("Profile.NewFamilyMember")}
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
                                    placeholder={getStr("Therapy.Name")}
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
                                    placeholder={getStr("Profile.RelationshiptoChild")}
                                    data={this.state.options}
                                    onValueChange={(value, itemIndex) => {
                                        this.setState({ value })
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginBottom: 20 }} >
                            <Text style={{ fontSize: 19, color: '#45494E', fontWeight: '500' }}>{getStr("Profile.TimeSpentwith")} {StudentHelper.getStudentName()}</Text>
                            <Text style={{ marginTop: 4, color: '#888888', fontSize: 13 }}>{getStr("Profile.TimeDes")} {StudentHelper.getStudentName()}  {getStr("Profile.TimeDess")}</Text>
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
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
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
    continueViewTouchable: {
        marginTop: 10,
        paddingTop: 8,
        paddingBottom: 8,
        // marginLeft: 20,
        // marginRight: 20,
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    continueView: {
        width: '100%',

    },
    continueViewText: {
        color: '#fff',
        fontSize: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(NewFamilyMemberScreen);
