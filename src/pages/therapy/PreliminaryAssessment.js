import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity, Modal,
} from 'react-native';
import Color from '../../utility/Color';
import Styles from '../../utility/Style';
import DateHelper from '../../helpers/DateHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TimelineView from '../../components/TimelineView';
import Button from '../../components/Button';
import NavigationHeader from '../../components/NavigationHeader';

import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import TokenRefresher from '../../helpers/TokenRefresher';
import NoData from '../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../helpers/OrientationHelper';
import { Row, Container, Column } from '../../components/GridSystem';
import TherapistRequest from '../../constants/TherapistRequest';

const width = Dimensions.get('window').width

class WorkLogList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSaving: false,
            fullname: '',
            question: 3,
            choiceAnswers: [
                { id: 0, option: 'A', title: 'title title', description: 'title description description' },
                { id: 1, option: 'B', title: 'title title', description: 'title description description' },
                { id: 2, option: 'C', title: 'title title', description: 'title description description' },
                { id: 3, option: 'D', title: 'title title', description: 'title description description' },
            ],
            selectedAnswer: null
        }
    }

    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        //Call this on every page
        // TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        // this.getData();
    }

    getData() {
        this.setState({ isLoading: true });

        console.log("Fetching ", this.state.selectedDate);

        TherapistRequest.getWorklogList({ date: this.state.selectedDate }).then(dataResult => {
            console.log('Appointment', dataResult.data.autismsheet.edges.length, dataResult.data.upcoming_appointment.edges.length);
            console.log(dataResult);

            this.setState({
                isLoading: false,
                appointments: dataResult.data.upcoming_appointment.edges,
                autismsheets: dataResult.data.autismsheet.edges
            });
        }).catch(error => {
            console.log(error, error.response);
            this.setState({ isLoading: false });
        });
    }

    renderAssessment() {
        let { fullname, question, choiceAnswers, selectedAnswer } = this.state
        return (
            <>
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._refresh.bind(this)}
                        />
                    }
                >
                    <Row>
                        <Column >
                            {question == 1 && (
                                <View style={{ marginTop: width / 2 }}>
                                    <Text style={Styles.bigBlackText}>Full Name</Text>
                                    <Text style={[Styles.grayText, { fontSize: 12 }]}>Enter Full Name of your child</Text>
                                    <TextInput style={Styles.input}
                                        multiline={true}
                                        placeholder={'Full Name'}
                                        defaultValue={fullname}
                                        onChangeText={(fullname) => this.setState({ fullname })}
                                    />
                                </View>
                            )}
                            {question == 2 && (
                                <View style={{ marginTop: width / 2 }}>
                                    <Text style={Styles.bigBlackText}>Gender</Text>
                                    <Text style={[Styles.grayText, { fontSize: 12, marginBottom: 8 }]}>Select Kunai's Gender</Text>
                                    <View style={Styles.rowBetween}>
                                        <TouchableOpacity style={{ width: width / 2.3, height: width / 2.3, backgroundColor: '#F5F8FF', justifyContent: 'center', alignItems: 'center', paddingVertical: 32 }}>
                                            <MaterialCommunityIcons
                                                name='gender-male'
                                                size={48}
                                                color={Color.blueFill}
                                            />
                                            <Text style={[Styles.grayText, { fontSize: 12, color: Color.blueFill }]}>MALE</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ width: width / 2.3, height: width / 2.3, backgroundColor: '#FFF8F9', justifyContent: 'center', alignItems: 'center', paddingVertical: 32 }}>
                                            <MaterialCommunityIcons
                                                name='gender-female'
                                                size={48}
                                                color={'#FA98AF'}
                                            />
                                            <Text style={[Styles.grayText, { fontSize: 12, color: '#FA98AF' }]}>MALE</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            )}
                            {question == 3 && (
                                <>
                                    <Text style={[Styles.bigBlackText, { fontSize: 18 }]}>How much language does Kunal use for everyday activities ?</Text>
                                    <Image source={require('../../../android/img/image_9.png')} style={{ width: width, height: width / 2, resizeMode: 'cover', marginVertical: 8 }} />
                                    {choiceAnswers.map((choice, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => this.selectedAnswer(choice)} key={index} style={[Styles.rowBetween, { marginVertical: 8, padding: 16, borderColor: selectedAnswer == choice.id ? Color.blueFill : Color.gray, borderWidth: selectedAnswer == choice.id ? 1 : 0.5 }]}>
                                                <View style={{ width: width / 12, height: width / 12, backgroundColor: Color.grayWhite, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={[Styles.blackTextBold, { color: selectedAnswer == choice.id ? Color.blueFill : Color.black }]}>{choice.option}</Text>
                                                </View>
                                                <Column>
                                                    <Text style={[Styles.blackTextBold, { fontSize: 18, color: selectedAnswer == choice.id ? Color.blueFill : Color.black }]}>{choice.title}</Text>
                                                    <Text style={[Styles.grayText, { fontSize: 12, color: selectedAnswer == choice.id ? Color.blueFill : Color.grayFill }]}>{choice.description}</Text>
                                                </Column>
                                            </TouchableOpacity>
                                        )
                                    })}
                                    {selectedAnswer != null && (
                                        <Button
                                            labelButton="Submit Assessment"
                                            onPress={() => this.submitAssessment()}
                                            isLoading={this.state.isSaving}
                                            style={{ marginVertical: 10 }}
                                        />
                                    )}
                                </>
                            )}
                        </Column>
                    </Row>
                </ScrollView>
            </>
        )
    }
    selectedAnswer(data) {
        this.setState({ selectedAnswer: data.id })
    }
    submitAssessment() {
        null
    }
    render() {
        let { question, selectedAnswer } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="Preliminary Assessment"
                    backPress={() => this.props.navigation.goBack()}
                />

                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <View style={[styles.line, { marginVertical: 10, }]} />

                            {this.renderAssessment()}
                            {selectedAnswer == null && (
                                <View style={{ position: 'absolute', bottom: 8, left: 16, right: 16 }}>
                                    <View style={Styles.rowBetween}>
                                        <View style={{ flex: 1, backgroundColor: Color.grayWhite, height: 40, padding: 8 }}>
                                            <Text style={{ color: Color.blueFill }}>{question - 1} 0f 15 Answered</Text>
                                            <View style={{ width: '100%', height: 2, backgroundColor: Color.gray }}>
                                                <View style={{ width: question == 1 ? 0 : (100 / 15) * question - 1 + '%', height: 2, backgroundColor: Color.blueFill }} />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            disabled={question == 1 ? true : false}
                                            onPress={() => this.setState({ question: question - 1 })}
                                            style={{ marginLeft: 8, backgroundColor: question != 1 ? Color.blueFill : Color.grayWhite, height: 40, padding: 8 }}>
                                            <MaterialCommunityIcons
                                                name="chevron-up"
                                                color={question != 1 ? Color.white : Color.gray}
                                                size={24}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => this.setState({ question: question + 1 })}
                                            style={{ marginLeft: 8, backgroundColor: Color.blueFill, height: 40, padding: 8 }}>
                                            <MaterialCommunityIcons
                                                name="chevron-down"
                                                color={Color.white}
                                                size={24}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <>
                            <Row style={{ flex: 1 }}>
                                <Column style={{ flex: 2 }}>

                                    <View style={[styles.line, { marginVertical: 16, marginTop: 24 }]} />

                                    {this.renderAssessment()}
                                </Column>
                                <Column>
                                </Column>
                            </Row>
                        </>
                    )}
                </Container>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    wrapperStyle: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dotStyle: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    textStyle: {
        fontSize: 14,
        // paddingLeft: 5
    },
    connectionStyle: {
        backgroundColor: 'red',
        width: 2,
        flex: 1,
        // marginVertical: -4,
        marginLeft: 5
    },
    header: {
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    headerImage: {
        width: width / 12, height: width / 12,
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    smallImage: {
        width: width / 15, height: width / 15, borderRadius: 2,
    },
    row: {
        flex: 1, flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    contentBox: {
        flex: 1, marginVertical: 12, marginHorizontal: 2, paddingVertical: 8, borderRadius: 8,
        backgroundColor: Color.white, elevation: 2
    },
    title: {
        fontSize: 28, fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
    },
    textBig: {
        fontSize: 16
    },
    textSmall: {
        fontSize: 10,
    },
    studentItem: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center',
        // borderBottomWidth: 0.5,
        // borderColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 8,
        // padding: 10
    },
    studentSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
    studentImage: {
        width: width / 10, height: width / 10,
        borderRadius: 4
    },
    line: {
        height: 1, width: '100%', backgroundColor: Color.silver,
    },
    dot: {
        height: width / 55, width: width / 55, backgroundColor: Color.silver, borderRadius: width / 55,
        marginHorizontal: 8
    },

});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkLogList);