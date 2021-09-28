import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Image, Text, TextInput, ActivityIndicator, Modal, RefreshControl, Dimensions, TouchableOpacity, Animated, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../utility/Style.js';
import Color from '../../utility/Color';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import NavigationHeader from '../../components/NavigationHeader.js';
import PickerModal from '../../components/PickerModal';
import store from '../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import NoData from '../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../helpers/ImageHelper';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import { therapistGetLongTermGoals } from '../../constants/therapist';
import TherapistRequest from '../../constants/TherapistRequest';
import { client, getAreasList, getMilestoneGroups, getQuestions } from '../../constants/therapist';
import LoadingIndicator from '../../components/LoadingIndicator.js';

const width = Dimensions.get('window').width
const screenHeight = Dimensions.get("window").height;
const KEYS_TO_FILTERS = ['node.targetMain.targetName'];

class VbmappSuggestedTargets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            shortTermGoalId: '',
            targets: [],
            searchTarget: '',
            student: {},
            program: {},
            animation: new Animated.Value(0),
            domainList: [],
            showSearchFilter: false,
            isFilterOpened: false,
            domainDropdownList: [],
            targetAreaDropdownList: [],
            selectedDomain: '',
            selectedTargetArea: '',
            noDataText: '',
            fetchedAllTargets: false,
            alreadyAllocated: [],
            newPageParams: null,
            isShowDomainModal: false,
            longTermGoals: [],
            shortTermGoals: []
        }
    }
    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        const { program } = this.props.route.params;
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getAlreadyAllocatedTargets();
        // this.getTargets();
        this.getTaarget()
    }

    searchUpdated(term) {
        this.setState({ searchTarget: term })
    }

    getTaarget() {
        this.setState({ isLoading: true });

        const { programID, master } = this.props.route.params;

        let variables = {
            area: programID,
            pk: master
        };
        TherapistRequest.GET_VBMAPP_TARGET(variables).then(result => {
            console.log("TargetOK")
            this.setState({ targets: result.data.vbmappTargetSuggest.targets, isLoading: false });
        }).catch(error => {
            console.log("error===", error);
            this.setState({ isLoading: false });
        });
    }

    getShortTermGoals() {
        const { student, program } = this.props.route.params;
        let variables = {
            student: student.node.id,
            program: program.id
        };
        let shortTerms = [];
        TherapistRequest.getStudentProgramLongTermGoals(variables).then(longTermGoalsData => {
            let longTermGoals = longTermGoalsData.data.programDetails.longtermgoalSet.edges;
            for (let x = 0; x < longTermGoals.length; x++) {
                let shortTermGoals = longTermGoals[x].node.shorttermgoalSet.edges;
                console.log(shortTermGoals[0]);
                for (let y = 0; y < shortTermGoals.length; y++) {
                    shortTerms.push({ id: shortTermGoals[y].node.id, label: shortTermGoals[y].node.goalName });
                }
            }
            this.setState({
                shortTermGoals: shortTerms
            })
        }).catch(error => {
            console.log(error);
        });
    }
    getAlreadyAllocatedTargets() {
        const { student } = this.props.route.params;
        let v = {
            student: student.node.id
        }
        TherapistRequest.alreadyAllocatedTargetsForStudent(v).then(result => {
            this.setState({
                alreadyAllocated: result.data.targetAllocates.edges
            });
        })
    }

    // getTargets() {
    //     const { master, testNo, student, program } = this.props.route.params;
    //     let tempTargets = [];
    //     this.setState({isLoading:true})
    //     client.query({
    //         query: getAreasList
    //     }).then(result => {
    //         let areas = result.data.vbmappAreas;
    //         for(let x=0;x<areas.length;x++) {
    //             console.log("fkfkfkmmsmmsms",areas[x].id)
    //             client.query({
    //                 query: getMilestoneGroups,
    //                 variables: {
    //                     areaID: areas[x].id
    //                 }
    //             }).then(result2 => {
    //                 let groups = result2.data.vbmappGroups.edges;
    //                 for(let y=0;y<groups.length;y++) {
    //                     client.mutate({
    //                         mutation: getQuestions,
    //                         variables: {
    //                             master: master,
    //                             studentID: student.node.id,
    //                             areaID: areas[x].id,
    //                             groupID: groups[y].node.id
    //                         }
    //                     }).then(result3 => {
    //                         console.log("kkkkKKKAKAKAKAKA",result3);
    //                         const questions = JSON.parse(result3.data.vbmappGetQuestions.questions);
    //                         for(let z=0;z<questions.length;z++) {
    //                             let pa = questions[z].previous_assess;
    //                             for(let a=0;a<pa.length;a++) {
    //                                 if(pa[a].test === testNo) {
    //                                     switch(areas[x].apiArea) {
    //                                         case 'milestones':
    //                                             if(pa[a].score !== '' && pa[a].score !== '1.0') {
    //                                                 let variables = {
    //                                                     level: questions[z].level,
    //                                                     question: questions[z].questionNum,
    //                                                     domain: groups[y].node.id
    //                                                 }
    //                                                 TherapistRequest.vbmappSuggestedTargets(variables).then(res => {
    //                                                     console.log(res);
    //                                                     let targets = res.data.vbmappSuggestTargets.edges;
    //                                                     for(let b=0;b<targets.length;b++) {
    //                                                         let tars = targets[b].node.vbmappTargets.edges;
    //                                                         for(let c=0;c<tars.length;c++){
    //                                                             tempTargets.push(tars[c]);
    //                                                         }
    //                                                     }
    //                                                     this.setState({
    //                                                         targets: tempTargets,isLoading:false
    //                                                     })
    //                                                 })
    //                                             }
    //                                             break;
    //
    //                                         case 'transitions':
    //                                             if(pa[a].score !== '' && pa[a].score !== '5.0') {
    //                                                 let variables = {
    //                                                     question: questions[z].questionNum,
    //                                                     domain: groups[y].node.id
    //                                                 }
    //                                                 TherapistRequest.vbmappSuggestedTargets(variables).then(res => {
    //                                                     let targets = res.data.vbmappSuggestTargets.edges;
    //                                                     for(let b=0;b<targets.length;b++) {
    //                                                         let tars = targets[b].node.vbmappTargets.edges;
    //                                                         for(let c=0;c<tars.length;c++){
    //                                                             tempTargets.push(tars[c]);
    //                                                         }
    //                                                     }
    //                                                     this.setState({
    //                                                         targets: tempTargets,isLoading:false
    //                                                     })
    //                                                 })
    //                                             }
    //                                             break;
    //
    //                                         case 'barriers':
    //                                             if(pa[a].score !== '' && pa[a].score !== '4.0') {
    //                                                 let variables = {
    //                                                     question: questions[z].questionNum,
    //                                                     domain: groups[y].node.id
    //                                                 }
    //                                                 TherapistRequest.vbmappSuggestedTargets(variables).then(res => {
    //                                                     let targets = res.data.vbmappSuggestTargets.edges;
    //                                                     for(let b=0;b<targets.length;b++) {
    //                                                         let tars = targets[b].node.vbmappTargets.edges;
    //                                                         for(let c=0;c<tars.length;c++){
    //                                                             tempTargets.push(tars[c]);
    //                                                         }
    //                                                     }
    //                                                     this.setState({
    //                                                         targets: tempTargets,isLoading:false
    //                                                     })
    //                                                 })
    //                                             }
    //                                             break;
    //
    //                                         case 'eesa':
    //                                             if(pa[a].score !== '' && pa[a].score !== '1.0') {
    //                                                 let variables = {
    //                                                     question: questions[z].questionNum,
    //                                                     domain: groups[y].node.id
    //                                                 }
    //                                                 TherapistRequest.vbmappSuggestedTargets(variables).then(res => {
    //                                                     let targets = res.data.vbmappSuggestTargets.edges;
    //                                                     for(let b=0;b<targets.length;b++) {
    //                                                         let tars = targets[b].node.vbmappTargets.edges;
    //                                                         for(let c=0;c<tars.length;c++){
    //                                                             tempTargets.push(tars[c]);
    //                                                         }
    //                                                     }
    //                                                     this.setState({
    //                                                         targets: tempTargets,isLoading:false
    //                                                     })
    //                                                 })
    //                                             }
    //                                             break;
    //
    //                                         default:
    //                                             break;
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }).catch(err => console.log(err));
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //     }).catch(err => console.log(err));
    // }

    getTargetView(target, index) {
        const { program, student } = this.props.route.params;
        const { alreadyAllocated } = this.state;
        let backgroundColor = Color.white;
        let titleColor = Color.black;
        let subtitleColor = '#999';
        if (this.state.newPageParams) {
            if (target.id == this.state.newPageParams.target.id) {
                backgroundColor = Color.primary;
                titleColor = Color.white;
                subtitleColor = Color.white;
            }
        }
        //console.log(alreadyAllocated[0].node);

        // for(let x=0;x<alreadyAllocated.length;x++) {
        //     if(target.node.targetMain.targetName === alreadyAllocated[x].node.targetAllcatedDetails.targetName) {
        //         backgroundColor = Color.red;
        //         break;
        //     }
        // }

        return (
            <TouchableOpacity style={[styles.card, { backgroundColor }]} key={index} onPress={() => {

                if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                    this.props.navigation.navigate('TargetAllocateNewAssess', {
                        target: target,
                        student: student,
                        program: program,
                        img: require('../../../android/img/vb-mapp.jpeg')
                    });
                } else {
                    // this.setState({
                    //     newPageParams: {
                    //         target: target,
                    //         student: student,
                    //  zz       program: program
                    //     }
                    // })
                    this.props.navigation.navigate('TargetAllocateNewAssess', {
                        target: target,
                        student: student,
                        program: program,
                        img: require('../../../android/img/vb-mapp.jpeg')
                    });
                }
            }}>
                {/*<Image style={styles.targetViewImage} source={require('../../../android/img/vb-mapp.jpeg')} />*/}
                <Text style={[styles.targetViewTitle, { color: titleColor }]}>{target.targetMain.targetName}</Text>
                <Text style={[styles.targetViewDomain, { color: subtitleColor }]}>{target.domain.domain}</Text>
            </TouchableOpacity>
        )
    }



    renderList() {
        let { targets, noDataText } = this.state;
        const filteredTargets = targets.filter(createFilter(this.state.searchTarget, KEYS_TO_FILTERS))
        filteredTargets.sort();

        return (
            <>
                {this.state.showSearchFilter && <View style={styles.searchWrapper}>
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
                </View>}
                <ScrollView keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic">
                    {targets.map((target, index) => {
                        return this.getTargetView(target, index)
                    })}
                    {this.state.targets.length == 0 && <NoData>No Target Available</NoData>}
                </ScrollView>
            </>
        );
    }

    renderShortTermList() {
        const { shortTermGoals, shortTermGoalName, shortTermGoalId } = this.state;
        return (
            <View>
                <PickerModal
                    label="Short Term Goal"
                    iconLeft='folder-open'
                    selectedValue={shortTermGoalId}
                    data={shortTermGoals}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ shortTermGoalId: itemValue });
                        this.getTargets(itemValue);
                    }}
                />
            </View>
        )
    }

    render() {
        const { alreadyAllocated } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="VBMapps Suggested Targets" />

                {this.state.isLoading && <LoadingIndicator />}

                {!this.state.isLoading && (
                    <Container>
                        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                            <>
                                <View>
                                    {this.renderList()}
                                </View>
                            </>
                        )}
                        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                            <Row style={{ flex: 1 }}>
                                <Column>
                                    {this.renderList()}
                                </Column>
                                <Column style={{ flex: 2, paddingTop: 10 }}>

                                </Column>
                            </Row>
                        )}
                    </Container>
                )}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    searchWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        height: 40,
        marginVertical: 10,
        backgroundColor: Color.grayWhite
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderRadius: 5,
        margin: 3,
        marginTop: 10,
        padding: 10
    },

    targetViewImage: {
        width: '100%',
        height: 200,
        borderRadius: 5
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
        paddingTop: 5
    },
    modal: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: Color.white,
        width: 300,
    }
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});
const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VbmappSuggestedTargets);
