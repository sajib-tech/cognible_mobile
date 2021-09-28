
import React, { Component } from 'react';

import { Dimensions, Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { getStr } from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ResultBox from "../../components/screening/ResultBox";
import { connect } from 'react-redux';
import store from '../../redux/store';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import moment from 'moment';
import ParentRequest from '../../constants/ParentRequest';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height


class AssessmentResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkText: ""
        };
        this.getResultData = this.getResultData.bind(this);
        this.getResultListView = this.getResultListView.bind(this);
    }
    componentDidMount() {
        let student = store.getState().user.student;
        // store.getState().user.student.firstname
        let linkText = "See " + student.firstname + "'s Program"
        this.setState({ linkText: linkText })
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    }

    getResultData() {
        let data = [
            { title: "Speech & Language", resultStatus: 'Advanced', resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.' },
            { title: "Gross Motor", resultStatus: 'On track', resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.' },
            { title: "Fine Motor", resultStatus: 'Delayed', resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.' },
            { title: "Cognitive", resultStatus: 'Delayed', resultDescription: 'Fine motor skill is the coordination of small muscles, in movements-usually involving the synchronisation of hands and fingers with eyes.' }
        ];
        return data;
    }
    getResultListView() {
        let data = this.getResultData();
        let resList = [];
        for (let x = 0; x < data.length; x++) {
            resList.push(
                <ResultBox
                    title={data[x].title}
                    resultStatus={data[x].resultStatus}
                    resultDescription={data[x].resultDescription} />
            );
        }
        if (OrientationHelper.getDeviceOrientation() == 'portrait') {
            return resList;
        } else {
            let res = _.chunk(resList, 2);
            res = res.map((item) => {
                let item1 = item[0];
                let item2 = item[1];
                return (
                    <Row>
                        <Column>{item1}</Column>
                        <Column>{item2}</Column>
                    </Row>
                );
            });
            return res;
        }
    }

    renderHeader() {
        return (
            <>
                <View style={{ marginTop: 10, marginBottom: 20, padding: 20, borderRadius: 4, backgroundColor: '#5F6CAF' }}>
                    <Text style={{
                        fontFamily: 'SF Pro Text', fontStyle: 'normal', fontWeight: '600',
                        fontSize: 22, color: '#FFFFFF', paddingBottom: 5
                    }}>Wating for Results</Text>
                    <Text style={{
                        fontFamily: 'SF Pro Text', fontStyle: 'normal', fontWeight: 'normal',
                        fontSize: 13, color: '#FFFFFF', paddingBottom: 25
                    }}>We are waiting for screening results and update here soon.</Text>
                    <View style={{ marginBottom: 25, width: '100%', height: 1, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' }}></View>
                    <Text style={{
                        fontFamily: 'SF Pro Text', fontStyle: 'normal', fontWeight: '500',
                        fontSize: 16, color: '#FFFFFF', paddingBottom: 5
                    }}>
                        Contact Your Pediatrician  <FontAwesome5 name={'arrow-right'} style={{ paddingTop: 10, fontSize: 18 }} /></Text>
                </View>
            </>
        );
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    title="CogniABle Score"
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <ScrollView contentInsetAdjustmentBehavior="automatic">
                                {this.renderHeader()}
                                {this.getResultListView()}
                            </ScrollView>
                            <Button labelButton={this.state.linkText}
                                style={{ marginBottom: 10 }}
                                onPress={() => {
                                    let { navigation, route } = this.props;
                                    let id = route.params.therapyId;
                                    navigation.navigate('UserProgram', { therapyId: id });
                                }} />
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row style={{ flex: 1 }}>
                            <Column style={{ flex: 2 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    {this.renderHeader()}
                                    {this.getResultListView()}
                                </ScrollView>
                            </Column>
                            <Column>
                                <Text style={styles.sidebarTitle}>Compared to last assessment...</Text>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    <NoData>No Data</NoData>
                                </ScrollView>

                                <Button labelButton={this.state.linkText}
                                    style={{ marginBottom: 10 }}
                                    onPress={() => {
                                        let { navigation, route } = this.props;
                                        let id = route.params.therapyId;
                                        navigation.navigate('UserProgram', { therapyId: id });
                                    }} />
                            </Column>
                        </Row>
                    )}

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

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentResults);