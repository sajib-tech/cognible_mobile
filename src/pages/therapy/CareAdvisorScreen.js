/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    ScrollView, ActivityIndicator,
    View, Image,
    Text, Linking, TextInput, TouchableOpacity, TouchableWithoutFeedback

} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import ParentRequest from '../../constants/ParentRequest';

import { connect } from 'react-redux';
import NavigationHeader from '../../components/NavigationHeader';
import FaqDropdown from '../../components/FaqDropdown';
import { Container } from '../../components/GridSystem';
import {getStr} from "../../../locales/Locale";
import OrientationHelper from '../../helpers/OrientationHelper.js'
// import SupportTicketField from '../Common/Support_Ticket/SupportTicketField'
import { TICKET_QUERY } from '../Common/Support_Ticket/query'
import { useQuery } from '@apollo/react-hooks'
import SupportTicketFieldContainer from '../Common/Support_Ticket/SupportTicketFieldContainer'
const width = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

class CareAdvisorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            contents: [
                {
                    question: getStr("CareAdvisor.que-1"),
                    answer: 'There is no blood test to diagnose autism spectrum disorder. A diagnosis is made based on behaviors. In oder to be diagoned with autism, an individual must display deficits in social communication and social interaction, and show restrictive and repetitive behaviors.',
                },
                {
                    question: getStr("CareAdvisor.que2"),
                    answer: 'There is no blood test to diagnose autism spectrum disorder. A diagnosis is made based on behaviors. In oder to be diagoned with autism, an individual must display deficits in social communication and social interaction, and show restrictive and repetitive behaviors.',
                },
                {
                    question: 'How can I find out if my/my childs case is genetic? Can we tell which side of the family the autism came from?',
                    answer: 'There is no blood test to diagnose autism spectrum disorder. A diagnosis is made based on behaviors. In oder to be diagoned with autism, an individual must display deficits in social communication and social interaction, and show restrictive and repetitive behaviors.',
                },
            ],
            faq: [],
            noFAQText: ''
        }
    }
    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getFAQ();
    }
    getFAQ() {
        this.setState({ isLoading: true });
        let variables = {

        }
        ParentRequest.fetchFAQ(variables).then(faqData => {
            this.setState({ isLoading: false });
            console.log("faqData():" + JSON.stringify(faqData));
            if (faqData.data.frequentlyAskedQuestions.length > 0) {
                this.setState({ faq: faqData.data.frequentlyAskedQuestions })
            } else {
                this.setState({ noFAQText: 'No FAQ found' });
            }

        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error, error.response);

            Alert.alert('Information', error.toString());
        });
    }

    startChat() {

    }

    startCall() {
        if (Linking.canOpenURL(`tel:7042020469`)) {
            Linking.openURL(`tel:7042020469`)
        } else {
            Alert.alert("Information", "Sorry, your device can't make a phone call");
        }
    }

    sendEmail() {
        Linking.openURL('mailto:info@cognable.tech');
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title={getStr("CareAdvisor.CareAdvisor")}
                />
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <Container>
                        <Text style={styles.text1}>{getStr("CareAdvisor.StartaConversation")}</Text>
                        <TouchableOpacity style={styles.conversationBox} activeOpacity={0.9} onPress={() => {
                            this.startChat();
                        }}>
                            <View style={{ width: '50%', flexDirection: 'row' }}>
                                <FontAwesome5 name={'location-arrow'} style={styles.conversationIcon} />
                                <Text style={{ color: '#FFFFFF', fontSize: 16, paddingLeft: 10, paddingRight: 10 }}>{getStr("NewChanges.Chatwithus")}</Text>
                            </View>
                            <Text style={{ width: '50%', fontSize: 16, textAlign: 'right', paddingRight: 10, color: '#FFFFFF' }}>ONLINE NOW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.conversationBox} activeOpacity={0.9} onPress={() => {
                            this.startCall();
                        }}>
                            <View style={{ width: '50%', flexDirection: 'row' }}>
                                <FontAwesome5 name={'phone'} style={styles.conversationIcon} />
                                <Text style={{ color: '#FFFFFF', fontSize: 16, paddingLeft: 10, paddingRight: 10 }}>{getStr("NewChanges.Callus")}</Text>
                            </View>
                            <Text style={{ width: '50%', fontSize: 16, textAlign: 'right', paddingRight: 10, color: '#FFFFFF' }}>8 AM - 8PM EST</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mailBox} activeOpacity={0.9} onPress={() => {
                            this.sendEmail();
                        }}>
                            <View style={{ flexDirection: 'row', width: '35%' }}>
                                <FontAwesome5 name={'envelope'} style={styles.icon2} />
                                <Text style={{ color: '#3E7BFA', paddingTop: 15, fontSize: 16, paddingLeft: 4 }} >{getStr("NewChanges.EmailUs")}</Text>
                            </View>
                            <Text style={{ textAlign: 'right', padding: 15, width: '65%' }} >{getStr("NewChanges.ResponsewithinDays")}</Text>
                        </TouchableOpacity>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 35, paddingBottom: 15 }}>
                    <Text style={ styles.supportTicketHeading }>{getStr("TargetAllocate.SupportTicket")}</Text>
                            <View style={{ flexDirection: 'row',  }}>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate("SupportTicket");
                                }}>
                                    <MaterialCommunityIcons
                                        name='arrow-right'
                                        size={20}
                                    />
                                </TouchableOpacity>
                
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('AddSupportTicket')
                                }}>
                                    <MaterialCommunityIcons
                                        name='plus'
                                        size={20}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                                <SupportTicketFieldContainer navigation={this.props.navigation}/>
                                
                        </View>




                        <Text style={styles.faqText}>{getStr("CareAdvisor.Frequentlyaskedquestions")}</Text>
                        {this.state.isLoading && (

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
                        {
                            (this.state.faq.length === 0) && (
                                <Text style={{ textAlign: 'center', paddingVertical: 20 }}>{this.state.noFAQText}</Text>
                            )
                        }
                        <View style={styles.container}>


                            <ScrollView style={{ alignSelf: 'stretch' }}>
                                {this.state.faq != null && this.state.faq.map((param, i) => {
                                    return (
                                        <FaqDropdown
                                            key={i}
                                            header={param.question}
                                            content={param.answer}
                                        />
                                    );
                                })}

                            </ScrollView>
                        </View>
                    </Container>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 50
    },

    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        paddingLeft: 15
    },

    backIconText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#63686E'
    },
    backIconText1: {
        fontSize: 15,
        fontWeight: 'normal',
        color: '#909090',
        paddingLeft: 10,
        paddingTop: 5
    },
    headerTitle: {
        textAlign: 'center',
        width: '80%',
        fontSize: 18,
        paddingTop: 10,
        color: '#45494E'
    },
    scrollView: {
        backgroundColor: '#FFFFFF',
        height: screenHeight
    },

    body: {
        marginLeft: 20,
        marginRight: 15,
        marginBottom: 10
    },
    conversationBox: {
        flexDirection: 'row', backgroundColor: '#3E7BFA', borderRadius: 8, paddingTop: 15, paddingBottom: 15, marginBottom: 10
    },
    conversationIcon: {
        color: '#FFFFFF', paddingLeft: 20, paddingTop: 5, paddingRight: 10
    },

    container1: {
        width: '100%',
        flexDirection: 'row',
        borderColor: 'red',
        borderWidth: 1
    },
    text2: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 17,
        lineHeight: 14,
        // color: '#FFFFFF'
    },
    mailBox: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#3E7BFA',
        borderWidth: 1.5,
        marginBottom: 10
    },
    icon1: {
        color: 'white',
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 20,
        fontWeight: 'normal',
        marginRight: 12
    },
    icon2: {
        color: '#3E7BFA',
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10
    },
    text1: {
        fontSize: 18,
        paddingBottom: 15,
        color: '#45494E',
        fontWeight: '500'
    },

    text3: {
        color: 'white',
        paddingTop: 15,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    text4: {
        color: 'blue',
        paddingTop: 15,
        fontSize: 20,
        paddingLeft: 4,

    },
    text5: {
        color: '#808080',
        paddingTop: 15,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    faqText: {
        fontSize: 20,
        marginTop: 35,
        paddingBottom: 15,
        color: '#45494E',
        fontWeight: '500'
    },
    supportTicketHeading: {
        fontSize: 20,
        color: '#45494E',
        fontWeight: '500'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 120
    },
    faqHeader: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTxt: {
        fontSize: 12,
        color: 'rgb(74,74,74)',
        marginRight: 60,
        flexWrap: 'wrap',
    },
    txt: {
        fontSize: 14,
    },
    dropDownItem: {
        // padding: 10,
        backgroundColor: 'rgba(62, 123, 250, 0.025)',
        borderRadius: 5,
        borderWidth: 0.9,
        borderColor: 'rgba(62, 123, 250, 0.1)',
        marginBottom: 10
    },
    dropDownItemTitle: {
        fontSize: 16,
        color: '#3E7BFA',
        width: '90%',
        paddingBottom: 10,
    }

});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSignout: (data) => dispatch(signout(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CareAdvisorScreen);
