import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image, Dimensions,
    Text, TextInput, Alert,TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import {signin, signin_success, setToken, signout} from '../redux/actions/index';
import { getAuthResult } from '../redux/reducers/index';
import { ApolloProvider, Mutation } from 'react-apollo';
import {changePassword, client, forgetPassword} from '../constants/parent';
import AppIntroSlider from 'react-native-app-intro-slider';
import Button from '../components/Button';
import { Container, Column, Row } from '../components/GridSystem';
import Color from '../utility/Color';
import OrientationHelper from '../helpers/OrientationHelper';
import ParentRequest from '../constants/ParentRequest';
import NavigationHeader from "../components/NavigationHeader";
import {startSession} from "../constants";
import {getStr} from "../../locales/Locale";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            oldPassword: '',
            newPassword: '',
            passwordShowIcon: 'eye',
            showPassword: true,
            passwordShowIcon2: 'eye',
			showPassword2: true,
        };
    }

    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    }

    changeNewPassword() {
        this.setState({ loading: true });

        let variables = {
            current: this.state.oldPassword,
            new: this.state.newPassword,
        };

        client.mutate({
            mutation: changePassword,
            variables
        }).then((result) => {
            console.log("Res", result);
            this.setState({ loading: false });
            if(result.data.changeUserPassword.status){
                this.props.dispatchSignout();
            } else {
                Alert.alert(
                    'Change Password',
                    result.data.changeUserPassword.message,
                    [
                        { text: 'OK', onPress: () => { }, style: 'cancel' },
                    ],
                    { cancelable: false }
                );
            }

        }).catch((err) => {
            Alert.alert("Error", err.toString());
            this.setState({ loading: false });
        })
    }
    showHidePassword() {
		this.setState({ showPassword: !this.state.showPassword });
		this.setState({ passwordShowIcon: this.state.showPassword ? 'eye-off' : 'eye' });
    }
    showHidePassword2() {
		this.setState({ showPassword2: !this.state.showPassword2 });
		this.setState({ passwordShowIcon2: this.state.showPassword2 ? 'eye-off' : 'eye' });
	}

    renderImage() {
        return (
            <View style={{ marginHorizontal: -16 }}>

                {/*<Image source={require('../../android/img/image_9.png')} style={{ width: '100%', height: 300 }} />*/}
            </View>
        );
    }

    renderForm() {
        return (
            <>
                {/*<Text style={styles.title}>Forget Password</Text>*/}
                <View style={{
                    flex :1,
                    justifyContent: 'center',
                    marginTop : 30,
                    position: 'relative'
                }}>
                                      <TouchableOpacity 
                                      style={{
                                          position:'absolute',
                                         zIndex: 100,
                                         top: 5,
                                         elevation:3,
                                         right: 10,
                                        
                                      }}
										onPress={() => {
											this.showHidePassword();
										}}>
										<MaterialCommunityIcons style={{
                                            position: 'relative',
                                            zIndex: 100,
                                            
                                        }} name={this.state.passwordShowIcon} color={'#ccc'} size={24} />
										
									</TouchableOpacity>
                                    <TextInput style={[styles.input]}
										
										placeholder={getStr('Profile.Old_Password')}										
										onChangeText={(oldPassword) => this.setState({ oldPassword })}
										secureTextEntry={this.state.showPassword}
										value={this.state.oldPassword}
                                        onChangeText={(oldPassword) => {
                                            this.setState({ oldPassword });
										}} />
                                
                {/* <TextInput style={[styles.input]}
                           placeholder={getStr('Profile.Old_Password')}
                           value={this.state.oldPassword}
                           secureTextEntry
                           onChangeText={(oldPassword) => {
                               this.setState({ oldPassword });


                           }} /> */}
                           <View style={{
                               position: 'relative'
                           }}>
                                <TouchableOpacity 
                                      style={{
                                        position:'absolute',
                                        zIndex: 100,
                                        top: 5,
                                        elevation:3,
                                        right: 10,
                                        
                                      }}
										onPress={() => {
											this.showHidePassword2();
										}}>
										<MaterialCommunityIcons style={{
                                            position: 'relative',
                                            zIndex: 100,
                                            
                                        }} name={this.state.passwordShowIcon2} color={'#ccc'} size={24} />
										
									</TouchableOpacity>
                                    <TextInput style={[styles.input,{marginBottom :20}]}
										
										placeholder={getStr('Profile.New_Password')}										
										onChangeText={(oldPassword) => this.setState({ oldPassword })}
										secureTextEntry={this.state.showPassword2}
                                        value={this.state.newPassword}
                                        onChangeText={(newPassword) => {
                                            this.setState({ newPassword });
                                        }} />
                           </View>
                           
             
                {/* <TextInput style={[styles.input,{marginBottom :20}]}
                           placeholder={getStr('Profile.New_Password')}
                           value={this.state.newPassword}
                           secureTextEntry
                           onChangeText={(newPassword) => {
                               this.setState({ newPassword });
                           }} /> */}


                <Button labelButton={getStr('Profile.SAVE')}
                        // isLoading={this.state.loading}
                        // style={{ marginBottom: 10 }}
                        onPress={() => {
                            if (this.state.oldPassword.length > 0 && this.state.newPassword.length > 0){
                                Alert.alert(
                                    getStr('Profile.Change_Password'),
                                    'Are you sure want to change password ?',
                                    [
                                        { text: 'No', onPress: () => { }, style: 'cancel' },
                                        {
                                            text: 'Yes', onPress: () => {
                                                this.changeNewPassword();
                                            }
                                        },
                                    ],
                                    { cancelable: false }
                                );
                            }
                            else{
                                Alert.alert('Change Password', 'Please add Passwords');
                            }
                        //     this.forgetPassword();
                       }}
                                           />
                </View>

                {/*<Button labelButton='Back to Login'*/}
                {/*        theme='secondary'*/}
                {/*        onPress={() => {*/}
                {/*            this.props.navigation.goBack();*/}
                {/*        }} />*/}
            </>
        );
    }

    _renderItem({ item }) {
        return (
            <View style={styles.slideStyle}>
                <Image source={item.image} style={{ width: '100%', height: screenHeight - 250 }} resizeMode='cover' />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.text}</Text>
            </View>
        );
    }

    renderSlide() {
        const slides = [
            {
                key: 1,
                title: 'Autism Therapy at home',
                text: 'Cogniable provides ABA , occupational and special education programs for kids with autism which helps develop language , communication skills. Improve social skills , comprehension skills and academics',
                image: require('../../android/img/walkthrough.jpeg'),
                backgroundColor: '#FFFFFF',
            },
            {
                key: 2,
                title: 'Early Screening can rehabilitate autism',
                text: 'Early screening  is your child’s best hope for the future. Early detection makes you one step closer to seek intervention at an initial phase',
                image: require('../../android/img/walkthrough22.jpeg'),
                backgroundColor: '#FFFFFF',
            },
            {
                key: 3,
                title: 'Acceptance and Commitment',
                text: 'Therapy for children and parents to deal with anxiety , turbulence , inner emotional conflicts by accepting  issues ,hardships and commit to make necessary changes in behavior, regardless of what is going on.',
                image: require('../../android/img/walkthrough33.jpeg'),
                backgroundColor: '#FFFFFF',
            }
        ];

        return <AppIntroSlider renderItem={this._renderItem} data={slides}
                               activeDotStyle={{ backgroundColor: Color.primary, width: 40, height: 5 }}
                               dotStyle={{ width: 20, backgroundColor: Color.gray, height: 5 }}
            // dotStyle={{ backgroundColor: "#3E7BFA", opacity: 0.3 }}
        />
    }

    render() {
        //console.log("render, props : ", this.props);
        //console.log("render, authResult:", this.state.authResult);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white ,justifyContent :'center'}}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title={getStr('Profile.Change_Password')}
                />
                {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                    <>
                        <ScrollView contentInsetAdjustmentBehavior="automatic">
                            <Container>
                                {/*{this.renderImage()}*/}
                                {this.renderForm()}
                            </Container>
                        </ScrollView>
                    </>
                )}
                {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                    <Container>
                        <Text style={styles.title}>Sign In</Text>
                        <Row style={{ flex: 1 }}>
                            <Column style={{ flex: 2 }}>
                                {this.renderSlide()}
                            </Column>
                            <Column style={{ justifyContent: 'center' }}>
                                <View style={{ paddingBottom: 100 }}>
                                    {this.renderForm()}
                                </View>
                            </Column>
                        </Row>
                    </Container>
                )}
            </SafeAreaView>

        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    input: {
        fontSize: 18,
        color: '#10253C',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        backgroundColor: Color.white,
        borderRadius: 6,
        paddingHorizontal: 16,
        marginBottom: 16,

        height: 40
    },
    passwordInputWrapper: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        backgroundColor: Color.white,
        borderRadius: 6,
        paddingHorizontal: 16,
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center'
    },
    passwordInput: {
        flex: 1,
        fontSize: 18,
        color: '#10253C',
    },
    showHide: {
        width: 50,
        alignItems: "flex-end"
    },
    title: {
        fontSize: 18,
        color: Color.blackFont,
        textAlign: 'center',
        marginVertical: 10
    },
    slideStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    slideTitle: {
        fontSize: 18,
        color: Color.blackFont,
        marginVertical: 10
    },
    slideSubtitle: {
        fontSize: 15,
        color: Color.grayFill,
    },
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});
const mapDispatchToProps = (dispatch) => ({
    dispatchSignout: (data) => dispatch(signout(data)),
    dispatchSignin: (data) => dispatch(signin(data)),
    dispatchSetToken: (data) => dispatch(setToken(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
