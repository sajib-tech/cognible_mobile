
import React, { Component } from 'react';

import { Dimensions, Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getStr } from '../../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ResultBox from "../../../components/screening/ResultBox";
import { connect } from 'react-redux';
import store from '../../../redux/store';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import moment from 'moment';
import TherapistRequest from '../../../constants/TherapistRequest';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';
import Color from '../../../utility/Color';
import PickerModal from '../../../components/PickerModal';
import ProgressCircle from 'react-native-progress-circle'
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height


class AssessmentResultBehavior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areaErrorMessage:'',
            options: [
                { id: 'delayed', label: 'Delayed' },
                { id: 'onTrack', label: 'On Track' },
                { id: 'advanced', label: 'Advanced' }
            ],
            selectedOption:[],
            areasData:[],
            areasResult:[],
            totalScore:'',
            status:''
        };
    }

    componentDidMount() {
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        const { status, pk } = this.props.route.params;
        if(status === 'COMPLETED') {
            let variables = {
                pk: pk
            }
            TherapistRequest.getAssessmentObjectCogniable(variables).then(result => {
                console.log(JSON.stringify(result.data.getCogniableAssessDetail.assessmentAreas.edges));
                this.setState({
                    totalScore: result.data.getCogniableAssessDetail.score,
                    areasResult: result.data.getCogniableAssessDetail.assessmentAreas.edges
                })
            })
        }
        this.setState({
            status:status
        })
    }

    updateAreas = (id, value) => {
        let { areasData } = this.state;
        let already = 0;
        for(let x=0;x<areasData.length;x++) {
            if(areasData[x].area === id) {
                areasData[x].response = value;
                already = 1;
                break;
            }
        }
        if(already === 0) {
            areasData.push({
                "area": id,
                "response": value
            })
        }
        this.setState({
            areasData
        })
        console.log(areasData)
    }

    handleAreasResponse = () => {
        const { pk, student, areas, status } = this.props.route.params;
        const { areasData, totalScore } = this.state;
        for(let x=0;x<areasData.length;x++) {
            let variables = {
                pk: pk,
                areaId: areasData[x].area,
                response: areasData[x].response
            }
            TherapistRequest.recordAreaResponse(variables).then(result => {
                console.log(JSON.stringify(result));
            })
        }
        let variables = {
            pk: pk,
            score: totalScore,
            status: 'Completed'
        }
        TherapistRequest.endAssessmentCogniable(variables).then(result => {
            console.log(result);
            this.setState({
                status: 'COMPLETED'
            })
        })

    }
 
    renderResult() {
        const { pk, student, areas, program } = this.props.route.params;
        console.log(areas);
        const { options, selectedOption, totalScore, status, areasData, areasResult } = this.state;
        let returnArray = [];
        if(status !== 'COMPLETED') {
            console.log(areas);
            for(let x=0;x<areas.length;x++) {
                returnArray.push(
                    <View>
                        <PickerModal
                            label={areas[x].name}
                            error={this.state.areaErrorMessage}
                            selectedValue={ selectedOption[x] }
                            data={options}
                            onValueChange={(itemValue, itemIndex) => {
                                this.updateAreas(areas[x].id, itemValue);
                            }}
                        />
                    </View>
                )
            }
            returnArray.push(
                <>
                    <View>
                        <Text style={{ marginBottom:5 }}>Total Score</Text>
                        <TextInput 
                            keyboardType={'numeric'}
                            style={{ borderWidth:1, borderRadius:10, borderColor:'#DDD' }}
                            value={totalScore}
                            onChangeText={(totalScore) => this.setState({ totalScore })}
                        />
                    </View>
                    <TouchableOpacity onPress={this.handleAreasResponse} style={{marginTop:20, flex:1, alignItems:'center', backgroundColor:Color.blueFill, padding:15, borderRadius:10}}>
                        <Text style={{ fontSize:16,color:'#FFF' }}>Submit</Text>
                    </TouchableOpacity>
                </>
            )
        } else {
            return(
                <>
                    <ScrollView style={{ flex:1 }}>
                        <View style={{  borderWidth:1, borderColor:'#DDD', borderRadius:10, padding:10, marginVertical:20, flexDirection:'row' }}>
                            <View>
                                <ProgressCircle
                                    percent={totalScore}
                                    radius={40}
                                    borderWidth={8}
                                    color="#4BAEA0"
                                    shadowColor="#D4DCE7"
                                    bgColor="#fff">
                                    <Text style={{ fontSize: 18, color: '#344356' }}>{totalScore + '%'}</Text>
                                </ProgressCircle>
                            </View>
                            <View style={{flex:1, marginLeft:10 }}>
                                <Text style={{ fontSize:18, fontWeight:'700' }}>{student.node.firstname}'s Assessment Result</Text>
                                <Text style={{ fontSize:14, flexWrap:'wrap' }}>Don't let what you can't do stop you from doing what you can do.</Text>
                            </View>
                        </View>

                        {areasResult && areasResult.length === 0 && <ActivityIndicator />}
                        {areasResult && areasResult.length > 0 && areasResult.map(area => 
                            <View style={{ borderWidth:1, borderColor:'#DDD', borderRadius:10, padding:10, marginVertical:20, flexDirection:'row' }}>
                                <Text style={{ fontSize:14, fontWeight:'700', flex:1 }}>{area.node.area.name}</Text>
                                <Text style={{ color:Color.blueFill }}>{area.node.response}</Text>
                            </View>
                        )}
                        
                    </ScrollView>
                    <View style={styles.continueView}>
                        <Button onPress={() => this.props.navigation.navigate('BehaviorSuggestedTargets', {
                            pk: pk,
                            program: program,
                            student: student
                        })}
                            labelButton='Go to Suggested Targets' />
                    </View>
                </>
            )
        }
        return returnArray;
    }

    render() {
        const { status } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    title="Behavioral Score"
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        {status !== '' && this.renderResult()}
                    </ScrollView>
                </Container>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    sidebarTitle: {
        fontSize: 16,
        marginVertical: 5,
        color: Color.black
    },
    header: {
        flexDirection: 'row',
        height: 50,
        width: '95%',
    },
    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        paddingLeft: 10
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 18,
        paddingTop: 10,
        color: '#45494E',
        fontWeight: 'bold'
    },
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        paddingRight: 10
    },
    scrollView: {
        padding: 10,
        backgroundColor: "#FFFFFF",
        marginBottom: 120
    },
    continueView: {
        width: '100%',
        position: 'absolute',
        bottom: 10
    },
    continueViewTouchable: {
        // margin: 16,
        // marginTop: 28,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 50,
        backgroundColor: '#3E7BFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3E7BFA'
    },
    continueViewText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetMedicalData: (data) => dispatch(setMedicalData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentResultBehavior);