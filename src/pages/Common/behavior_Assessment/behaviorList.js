import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../../utility/Color';
import TherapistRequest from '../../../constants/TherapistRequest';
import NavigationHeader from '../../../components/NavigationHeader';
import moment from 'moment';

class BehaviorAssessmentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            assessmentsList: [],
            areas: []
        }
    }

    componentDidMount() {
        this.getAssessmentsList();
    }

    getAssessmentsList = () => {
        const { student } = this.props.route.params;
        let variables = {
            studentID: student.node.id
        };
        TherapistRequest.getAssessmentsListCogniable(variables).then(result => {
            //console.log("Assessments List", JSON.stringify(result.data.cogniableAssessAreas));
            console.log(JSON.stringify(result.data.getCogniableAssessments.edges));
            this.setState({
                assessmentsList: result.data.getCogniableAssessments.edges,
                areas: result.data.cogniableAssessAreas,
                isLoading: false
            })
        });
    }

    generateAssessmentsList = () => {
        const { assessmentsList, areas } = this.state;
        const { student, program } = this.props.route.params;
        let array = [];
        for(let x=assessmentsList.length - 1; x>=0; x--) {
            let date = moment(assessmentsList[x].node.date).format("MMMM DD, YYYY");
            if(assessmentsList[x].node.status === 'COMPLETED') {
                array.push(
                    <TouchableOpacity style={styles.assessContainer} onPress={() => this.props.navigation.navigate('AssessmentResultBehavior', {
                        student: student,
                        areas: areas,
                        pk: assessmentsList[x].node.id,
                        status: assessmentsList[x].node.status,
                        program: program
                    })}>
                        <Text style={styles.assessName}>{assessmentsList[x].node.name === null ? assessmentsList[x].node.id : assessmentsList[x].node.name}</Text>
                        <Text style={{color:Color.greenFill, fontWeight:'700', fontSize:13}}>COMPLETE</Text>
                        <Text style={styles.assessDate}>{date}</Text>
                    </TouchableOpacity>
                );
            } else {
                array.push(
                    <TouchableOpacity style={styles.assessContainer} onPress={() => this.props.navigation.navigate('QuestionsBehavior', {
                        student: student,
                        areas: areas,
                        pk: assessmentsList[x].node.id,
                        program: program
                    })}>
                        <Text style={styles.assessName}>{assessmentsList[x].node.name === null ? assessmentsList[x].node.id : assessmentsList[x].node.name}</Text>
                        <Text style={{color:Color.orange, fontWeight:'700', fontSize:13}}>IN PROGRESS</Text>
                        <Text style={styles.assessDate}>{date}</Text>
                    </TouchableOpacity>
                );
            }
        }
        return array;
    }

    startAssessment = () => {
        const { student } = this.props.route.params;
        const { areas } = this.state;
        let variables = {
            studentID: student.node.id
        };
        TherapistRequest.startCogniableAssessment(variables).then(result => {
            console.log(JSON.stringify(result));
            this.props.navigation.navigate('NewAssessmentBehavior', {
                student: student,
                pk: result.data.startCogniableAssess.details.id,
                areas: areas
            })
        });
    }

    render() {
        const { student, program } = this.props.route.params;
        const { isLoading, assessmentsList, areas } = this.state;
        return(
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    title="Behavioral Assessment"
                    backPress={() => this.props.navigation.goBack()}
                />
                <ScrollView style={{ marginHorizontal:10 }} showsVerticalScrollIndicator={false}>
                    {isLoading === false && assessmentsList.length > 0 && this.generateAssessmentsList()}
                    {isLoading === false && assessmentsList.length === 0 **
                        <View>
                            <View style={styles.instructionsHeader}>
                                <MaterialCommunityIcons
                                name='checkbox-marked-outline'
                                size={32}
                                color={Color.primary}
                                />
                                <Text style={styles.instructionsHeading}>Instructions</Text>
                            </View>
                            <Text>This is a short brief about the assessment & why it matters in two lines.</Text>
                        </View>
                    }
                    {isLoading && <ActivityIndicator />}
                </ScrollView>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('NewAssessmentBehavior', {
                    student: student,
                    areas: areas,
                    program: program
                })}  style={styles.buttonFilled}>
                    <Text style={styles.buttonText}>New Assessment</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#FFF',
        flex:1,
        paddingTop:20,
        paddingHorizontal:20
    },
    header: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    pageHeading: {
        fontSize:24,
        fontWeight:'700',
        flex:1,
        textAlign:'center'
    },
    instructionsHeader: {
        flexDirection:'row',
        marginTop:10
    },
    instructionsHeading: {
        marginLeft:5,
        flex:1,
        fontSize:24,
        color: Color.primary,
        fontWeight:'700'
    },
    buttonFilled: {
        padding:20,
        borderRadius:10,
        backgroundColor:'#3E7BFA',
        marginBottom:10,
        marginHorizontal:10
    },
    buttonText: {
        color:'#FFF',
        fontSize:16,
        fontWeight:'700',
        textAlign:'center'
    },
    assessContainer: {
        marginHorizontal:5,
        marginVertical:10,
        backgroundColor:'#FFF',
        borderColor:'#aaa',
        padding:20,
        borderRadius:10,
        shadowColor: '#111',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    assessName: {
        fontSize:16,
        fontWeight:'700'
    }
})

export default BehaviorAssessmentsList;
