import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,Alert,
    Picker,
    Text, TextInput, TouchableOpacity, Button

} from 'react-native';
// import Select from 'react-select';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'react-native-elements';
import { ApolloProvider, Mutation } from 'react-apollo';
import { client, addFamilyMember} from '../../constants/index';
import store from '../../redux/store';
class NewFamilyMemberScreen extends Component {
    // const [ selectedValue, setSelectedValue ] = useState("java");
    constructor(props) {
        super(props);
        this.state = {
            memberName: '',
            relationshipId: '',
            selectedOption: '',
            choosenIndex: 0,
            options : [],
            value: ''
        };
        this.showAddFamilyMember = this.showAddFamilyMember.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        let {route} = this.props;
        let options = route.params.options.map(element => {
            // this.state.options.push(element)
            return {
                label: element.name, 
                id: element.id
            };
        });

        const value = this.state.options[0].value;
        this.setState({
            value, options
        });
    }
    render() {
        return (
            <View>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.backIcon} onPress={this.goBack}>
                        <FontAwesome5 name={'chevron-left'} style={styles.backIconText} />
                    </Text>
                    <Text style={styles.headerTitle}>New Family Member  </Text>
                </View>
                <SafeAreaView>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                        <View style={styles.wrapper}>
                            <View style={styles.body}>
                                
                                <View style={{ flex: 1, flexDirection: 'row',height: 88}}>
                                    {/* <View style={{ width: 60, height: 60 }} > */}
                                        {/* <Image style={{width: '25%'}} source={require('../../../android/img/blank.jpg')} /> */}
                                    {/* </View> */}
                                    <View style={{width: '25%', backgroundColor: '#ccc'}}>
                                    </View>
                                    <View style={{width: '75%'}}>
                                        <View style={{width: '100%',padding: 5}}>
                                            <TextInput style={{borderWidth: 1, borderColor: 'grey', height: 35}}        
                                                underlineColorAndroid="transparent"
                                                placeholder={"Name"} 
                                                placeholderTextColor={"black"} 
                                                placeholderFontWidth={"bold"} 
                                                numberOfLines={1} 
                                                value={this.state.memberName} 
                                                onChangeText={(memberNameTxt) => { 
                                                    this.setState({ memberName: memberNameTxt });
                                                }}
                                            />
                                        </View>
                                        <View style={{width: '100%', padding: 5}}>
                                            <PickerModal
                                                error={this.state.categoryErrorMessage}
                                                selectedValue={this.state.value}
                                                data={this.state.options}
                                                onValueChange={(value, itemIndex) => {
                                                    this.setState({ value });
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1, paddingTop: 10, marginTop: 32, marginBottom: 20 }} >
                                    <Text style={{ fontSize: 19, color: '#45494E', fontWeight: '500' }}>Time Spend with Child</Text>
                                    <Text style={{ marginTop: 4, color: '#888888', fontSize: 13 }}>How much time do you spend with child daily?</Text>
                                </View>

                                <View style={styles.mainContainer} >
                                    <Image style={{ width: 30, height: 30, }} source={require('../../../android/img/sunset.jpg')} />
                                    <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E', paddingLeft: 12, flex: 1 }}>Morning</Text>
                                    <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E' }}> --  1 hr </Text>
                                    <Image style={{ width: 25, height: 25, borderRadius: 20, marginLeft: 20 }} source={require('../../../android/img/plus2.png')} />
                                </View>

                                <View style={styles.mainContainer} >
                                    <Image style={{ width: 30, height: 30, }} source={require('../../../android/img/sun.jpg')} />
                                    <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E', paddingLeft: 12, flex: 1 }}>Afternoon</Text>
                                    <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E' }}> --  2 hrs </Text>
                                    <Image style={{ width: 25, height: 25, borderRadius: 20, marginLeft: 20 }} source={require('../../../android/img/plus2.png')} />
                                </View>

                                <View style={styles.mainContainer} >
                                    <Image style={{ width: 30, height: 30, }} source={require('../../../android/img/sunset.jpg')} />
                                    <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E', paddingLeft: 12, flex: 1 }}>Evening</Text>
                                    <Text style={{ fontSize: 19, fontWeight: '500', color: '#63686E' }}> --  4 hrs </Text>
                                    <Image style={{ width: 25, height: 25, borderRadius: 20, marginLeft: 20 }} source={require('../../../android/img/plus2.png')} />
                                </View>
                                <ApolloProvider client={client}>
                                    <Mutation mutation={addFamilyMember}>
                                        {(familyMember, { data }) => (
                                        <View style={styles.continueView}>
                                            <TouchableOpacity style={styles.continueViewTouchable} activeOpacity={.5} onPress={() => {

                                                    if(this.state.memberName == '') {
                                                        // return;
                                                    }
                                                    let queryParams = {
                                                        student: store.getState().studentId, 
                                                        memberName: this.state.memberName,
                                                        relationship: this.state.relationshipId,
                                                        session: "Afternoon",
                                                        duration: "1 Hours"
                                                    };
                                                    console.log("queryParams:"+JSON.stringify(queryParams));
                                                    familyMember({variables: queryParams})
                                                    .then(res => {
                                                        console.log(
                                                            'addFamilyMemberEvent -> res.data',
                                                            JSON.stringify(res.data)
                                                        );
                                                        return res.data;
                                                    })
                                                    .then(data => {
                                                        Alert.alert(
                                                            'New Family Member',
                                                            'Successfully Added',
                                                            [{
                                                                text: 'OK', onPress: () => {
                                                                    console.log('OK Pressed');
                                                                    // let {navigation} = this.props;
                                                                    this.props.navigation.navigate('FamilyMembers');
                                                                }
                                                            }],
                                                            { cancelable: false }
                                                        );
                                                    })
                                                    .catch(error => {
                                                        Alert.alert(
                                                            'Error',
                                                            error.networkError.name + ", Please try again later",
                                                            [{
                                                                text: 'OK', onPress: () => {
                                                                    console.log('OK Pressed');
                                                                    // let {navigation} = this.props;
                                                                    // this.props.navigation.navigate('FamilyMembers');
                                                                }
                                                            }],
                                                            { cancelable: false }
                                                        );
                                                        console.log("Error:"+error.networkError.name);
                                                        console.log("Error:"+error.networkError.response.status);
                                                        console.log('addFamilyMemberEvent -> err', JSON.stringify(error));
                                                    });
                                                }} >
                                                <Text style={styles.continueViewText}> Save Data </Text>
                                            </TouchableOpacity>
                                        </View>
                                        )}
                                    </Mutation>
                                </ApolloProvider>
                            </View>  
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
    showAddFamilyMember() {
        let {navigation} = this.props;
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
        margin:10
    },
    person: {
        width: 50,
        height: 50,
        // paddingLeft: 5,
        // borderRadius: 2
    },
    scrollView: {
        backgroundColor: '#ecf0f1',
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
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 8,
        height: 40,
        borderColor: '#DCDCDC',
        backgroundColor: '#F8F8F8',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 5

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

export default NewFamilyMemberScreen;
