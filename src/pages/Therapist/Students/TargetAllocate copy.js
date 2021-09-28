import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,ActivityIndicator,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Alert,Animated
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import { Button, CheckBox, Overlay } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchInput, { createFilter } from 'react-native-search-filter';
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import {therapistGetLongTermGoals} from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';

const width = Dimensions.get('window').width
const screenHeight = Dimensions.get("window").height;
const KEYS_TO_FILTERS = ['node.targetMain.targetName'];
class TargetAllocate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(0),
            shortTermGoalId: '',
            targets: [],
            domainList: [],
            searchTarget: '',
            student: {},
            program: {},
            isFilterVisible: false
        }
    }
    _refresh() {
        this.componentDidMount();
    }
    searchUpdated(term) {
        this.setState({ searchTarget: term })
    }
    componentDidMount() {
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        let program = this.props.route.params.program;
        let student = this.props.route.params.student;
        let shortTermGoalId = this.props.route.params.shortTermGoalId;

        this.setState({student: student, program: program, shortTermGoalId: shortTermGoalId});
        console.log("*************"+JSON.stringify(program.domain.edges.length))
        let variables = {
            domain: firstDomain.node.id
        };
        console.log(variables)
        TherapistRequest.getTargetArea(variables).then(targetAreaData => {
            // console.log(JSON.stringify(targetAreaData)
            if(targetAreaData &&
                targetAreaData.data &&
                targetAreaData.data.targetArea &&
                targetAreaData.data.targetArea.edges &&
                targetAreaData.data.targetArea.edges.length > 0) {
                    let firstTarget = targetAreaData.data.targetArea.edges[0];
                    console.log(firstTarget.node.id)
                    console.log(firstDomain.node.id)
                    this.fetchTargets(firstDomain.node.id, firstTarget.node.id)
                }
        }).catch(error => {
            console.log(JSON.stringify(error));
            this.setState({ isLoading: false});
        });
    }
    fetchTargets(domain, targetArea){
        let variables = {
            domain: domain
        };
        console.log(variables);
        TherapistRequest.getTargetsByDomain(variables).then(targetsData => {
            console.log("targetsData: "+JSON.stringify(targetsData));
            if(targetsData &&
                targetsData.data &&
                targetsData.data.target &&
                targetsData.data.target.edges &&
                targetsData.data.target.edges.length > 0) {
                    this.setState({targets: targetsData.data.target.edges});
            }
        }).catch(error => {
            console.log("fetchTargets error:"+JSON.stringify(error));
            this.setState({ isLoading: false});
        });
    }
    componentDidMount1() {
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        let program = this.props.route.params.program;
        let student = this.props.route.params.student;
        let shortTermGoalId = this.props.route.params.shortTermGoalId;

        this.setState({student: student, program: program, shortTermGoalId: shortTermGoalId});
        console.log("*************"+JSON.stringify(program.domain.edges.length))
        if(program && program.domain && program.domain.edges && program.domain.edges.length > 0) {
             let tempArray = [];
            for (let index = 0; index < program.domain.edges.length; index++) {
                let d = program.domain.edges[index].node;
                d.isSelected = false;
                if(index === 0) {
                    d.isSelected = true;
                }
                tempArray.push(d);
            }
            console.log(JSON.stringify(tempArray));
            this.setState({domainList: tempArray});

            let firstDomain = program.domain.edges[0];
            this.fetchDomainTargetsData();

        }

    }
    fetchDomainTargetsData(){
        let domainList = this.fetchSelectedDomains();
        let variables = {
            domain: domainList
        };
        console.log("variables:"+JSON.stringify( variables))
        TherapistRequest.getTargetArea(variables).then(targetAreaData => {
            // console.log(JSON.stringify(targetAreaData)
            if(targetAreaData &&
                targetAreaData.data &&
                targetAreaData.data.targetArea &&
                targetAreaData.data.targetArea.edges &&
                targetAreaData.data.targetArea.edges.length > 0) {
                    console.log(targetAreaData.data.targetArea.edges.length)
                    console.log("variables:"+JSON.stringify(targetAreaData.data.targetArea.edges))
                    // let firstTarget = targetAreaData.data.targetArea.edges[0];
                    // console.log(firstTarget.node.id)
                    // console.log(firstDomain.node.id)
                    // this.fetchTargets(firstDomain.node.id, firstTarget.node.id)
                    this.fetchTargets(domainList, []);
                }
        }).catch(error => {
            console.log(JSON.stringify(error));
            this.setState({ isLoading: false});
        });
    }
    fetchSelectedDomains() {
        let selectedDomainIds = [];
        let dl = this.state.domainList;
        for (let index = 0; index < dl.length; index++) {
            const element = dl[index];
            if(element.isSelected) {
                selectedDomainIds.push(element.id)
            }
        }
        console.log(selectedDomainIds)
        return selectedDomainIds;
    }
    fetchTargets1(domainList, targetAreaList){
        let variables = {
            domain: domainList,
            targetArea: targetAreaList
        };
        console.log(variables);
        TherapistRequest.getTargets(variables).then(targetsData => {
            console.log("targetsData: "+JSON.stringify(targetsData.length));

            if(targetsData &&
                targetsData.data &&
                targetsData.data.target &&
                targetsData.data.target.edges &&
                targetsData.data.target.edges.length > 0) {
                    this.setState({targets: targetsData.data.target.edges});
            }
        }).catch(error => {
            console.log("fetchTargets error:"+JSON.stringify(error));
            this.setState({ isLoading: false});
        });
    }

    getTargetView(target, index) {
        return(
            <TouchableOpacity key={index} onPress={() => {
                    this.props.navigation.navigate('TargetAllocateNew', {
                        target: target,
                        student: this.state.student,
                        program: this.state.program,
                        shortTermGoalId: this.state.shortTermGoalId
                    });
                }}>
                <View style={styles.targetView}>
                    <Image style={{width: '100%'}} source={require('../../../../android/img/Image.png')}  />
                    <Text style={styles.targetViewTitle}>{target.node.targetMain.targetName}</Text>
                    <Text style={styles.targetViewDomain}>{target.node.domain.domain}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    showFilters(){
        console.log("showFilters() is called")
        // this.setState({isFilterVisible: true});
    }
    handleOpen = () => {
        console.log(JSON.stringify(this.state.domainList))
        Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        }).start();
    };
    handleClose = () => {
        // console.log(t)
        Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        }).start();
    };
    render() {
        let { targets } = this.state;
        const filteredTargets = targets.filter(createFilter(this.state.searchTarget, KEYS_TO_FILTERS))
        filteredTargets.sort();
        const backdrop = {
            transform: [
                {
                translateY: this.state.animation.interpolate({
                    inputRange: [0, 0.01],
                    outputRange: [screenHeight, 0],
                    extrapolate: "clamp",
                }),
                },
            ],
            opacity: this.state.animation.interpolate({
                inputRange: [0.01, 0.5],
                outputRange: [0, 1],
                extrapolate: "clamp",
            }),
        };

        const slideUp = {
            transform: [
                {
                translateY: this.state.animation.interpolate({
                    inputRange: [0.01, 1],
                    outputRange: [0, -1 * screenHeight],
                    extrapolate: "clamp",
                }),
                },
            ],
        };
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="Allocate Target"
                    materialCommunityIconsName="settings"
                    dotsPress={() => this.handleOpen() }
                />

                <Container>
                    <ScrollView keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 16,
                        alignItems: 'center',
                        height: 40,
                        marginBottom: 20,
                        backgroundColor: Color.grayWhite
                    }}>
                        <MaterialCommunityIcons
                            name='account-search-outline'
                            size={24}
                            color={Color.gray}
                        />
                        <SearchInput
                            onChangeText={(term) => { this.searchUpdated(term) }}
                            style={styles.searchInput}
                            placeholder="Search Targets"
                        // clearIcon
                        />
                    </View>
                    {
                        filteredTargets.map((target, index) => (
                            this.getTargetView(target, index)
                        ))
                    }
                </ScrollView>
                </Container>
                <Animated.View style={[StyleSheet.absoluteFill, styles.cover, backdrop]}>
                    <View style={[styles.sheet]}>
                    <Animated.View style={[styles.popup, slideUp]}>
                        <View  style={{flexDirection: 'row', paddingTop: 10}}>
                            <TouchableOpacity onPress= { () => this.handleClose()} style={{width: '20%'}}>
                                <MaterialCommunityIcons name={'chevron-down'} size={20} style={{textAlign:'left', paddingLeft: 10}}/>
                            </TouchableOpacity>
                            <Text style={{width: '30%' ,fontSize: 20, textAlign: 'center'}}>Filter</Text>
                            <Text style={{width: '50%' ,textAlign: 'right'}}>CLEAR ALL</Text>
                        </View>
                        <ScrollView keyboardShouldPersistTaps='handled'
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior="automatic"
                            style={{marginBottom: 50}}>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <View style={{width: '30%'}}>
                                    <Text style={styles.domainName}>Domain</Text>
                                    <Text style={styles.domainName}>Program</Text>
                                    <Text style={styles.domainName}>Language</Text>
                                    <Text style={styles.domainName}>Family</Text>
                                </View>
                                <View style={{width: '70%', padding: 10}}>
                                    <Text>You can select multiple domains to see relevant targets.</Text>
                                    {
                                        this.state.domainList.map((domain, index) => (
                                            <CheckBox
                                                key={index}
                                                title={domain.domain}
                                                checked={domain.isSelected}
                                                onPress={() => {
                                                    this.selectDomain(index)
                                                }}
                                            />
                                        ))
                                    }
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.continueView}>
                            <TouchableOpacity style={styles.continueViewTouchable} activeOpacity={.5} onPress={() => { this.applyFilters() }}>
                                <Text style={styles.continueViewText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                    </View>
                </Animated.View>
            </SafeAreaView>
        )
    }
    applyFilters() {
        this.handleClose();
        this.fetchDomainTargetsData();
    }
    selectDomain(index) {
        console.log(index);
        let domains = this.state.domainList;
        for(let i=0; i<domains.length; i++){
            if(index === i) {
                console.log(index);
                domains[i].isSelected = !(domains[i].isSelected);
            }
        }
        this.setState({domainList: domains});
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    targetView: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10
    },
    targetViewTitle: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 14,
        color: '#45494E',
        paddingTop: 10
    },
    targetViewDomain: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 12,
        color: '#7480FF',
        paddingTop: 10
    },
    // Popup
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  sheet: {
    position: "absolute",
    top: (Dimensions.get("window").height + 10),
    left: 0,
    right: 0,
    height: "90%",
    justifyContent: "flex-end",
    // paddingTop: 10,
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    // paddingTop: 10,
    borderRadius: 5,
    alignItems: "center",
    // justifyContent: "center",
    // minHeight: 330,
    height: '100%'
  },
  domainName: {
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 15,
    color: '#3E7BFA'
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 10,
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    //  marginBottom: 200

  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TargetAllocate);
