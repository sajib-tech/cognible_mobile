import React, { Component } from 'react';

import {Alert, Text, View, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TargetInstructions from '../../components/TargetInstructions';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import ParentRequest from '../../constants/ParentRequest';
import { connect } from 'react-redux';
import { setToken } from '../../redux/actions/index';
import Color from '../../utility/Color';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';

class AssessmentInstruction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
        this.navigateToCogniableAssessment = this.navigateToCogniableAssessment.bind(this);
    }
    _refresh() {
        this.setState({isLoading: false});
        this.componentDidMount();
    }

    componentDidMount() {
        console.log(JSON.stringify(this.props))
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    }
    getData() {
        let data = [
            { sno: 1, descr: 'This is the first point about the session & how it should be done.' },
            { sno: 2, descr: 'Continuing with a second point and explaining what is to be done in the assessment.' },
            { sno: 3, descr: 'Keep steps short, two to three lines max otherwise it\'ll be confusing.' },
            { sno: 4, descr: 'Make sure there are no more than four steps in the instructions.' }
        ];
        return data;
    }

    navigateToCogniableAssessment() {
        console.log("navigateToCogniableAssessment() is called");
        let {navigation, route} = this.props;
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        let variables = {
            studentId: route.params.studentId
        }
        ParentRequest.startCogniableAssessment(variables).then(cogniAssessmentStartData => {
			console.log('cogniAssessmentStartData', JSON.stringify(cogniAssessmentStartData));
			this.setState({ showLoading: false });
            if(cogniAssessmentStartData.data.startCogniableAssess.details.id) {
                let data = {
                    pk: cogniAssessmentStartData.data.startCogniableAssess.details.id,
                    therapyId: route.params.therapyId ,
                    studentId: route.params.studentId 
                }
                console.log(data)
                navigation.navigate('CogniableAssessment2', data);
            }
            
		}).catch(error => {
			this.setState({ showLoading: false });
			console.log("Error", JSON.parse(JSON.stringify(error)));
			this.setState({ isSaving: false });

			Alert.alert('Information', error.toString());
		});
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => {
                        this.props.navigation.goBack();
                    }}
                    title={getStr('program.cogniableAssessment')}
                />

                <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <Image source={require('../../../android/img/Image.png')}
                            style={styles.instructionImage} />
                            <Text>Instructions :</Text>

                        <TargetInstructions data={this.getData()} />
                    </ScrollView>
                    <Button labelButton={getStr("program.startAssessment_btn")}
                        style={{ marginBottom: 10 }}
                        onPress={() => {
                            this.navigateToCogniableAssessment()
                        }}
                    />
                </Container>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#FFF'
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
        width: '10%',
        paddingTop: 15,
        paddingLeft: 15
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 22,
        paddingTop: 10,
        color: '#45494E',
        fontWeight: 'bold'
    },
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15
    },
    instructionImage: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 10,
    },
    continueView: {
        width: '100%',
    },
    continueViewTouchable: {
        margin: 16,
        marginTop: 28,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 15,
        backgroundColor: '#3E7BFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3E7BFA'
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
    dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentInstruction);
