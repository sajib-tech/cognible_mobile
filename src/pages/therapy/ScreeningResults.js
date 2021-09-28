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
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';

const width = Dimensions.get('window').width

class ScreeningResults extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataResults: [
                { id: 0, title: 'Speech & Language', status: 'Waiting for result', image: require('../../../android/img/image_9.png'), description: 'Blablabla blablablabla blablabla blablabla blablabalbla', percentage: '0', color: Color.bluePie },
                { id: 1, title: 'Speech & Language', status: 'Waiting for result', image: require('../../../android/img/image_9.png'), description: 'Blablabla blablablabla blablabla blablabla blablabalbla', percentage: '90', color: Color.blueFill },
                { id: 2, title: 'Speech & Language', status: 'Waiting for result', image: require('../../../android/img/image_9.png'), description: 'Blablabla blablablabla blablabla blablabla blablabalbla', percentage: '70', color: Color.orange },
                { id: 3, title: 'Speech & Language', status: 'Waiting for result', image: require('../../../android/img/image_9.png'), description: 'Blablabla blablablabla blablabla blablabla blablabalbla', percentage: '80', color: Color.redFill },
                { id: 4, title: 'Speech & Language', status: 'Waiting for result', image: require('../../../android/img/image_9.png'), description: 'Blablabla blablablabla blablabla blablabla blablabalbla', percentage: '40', color: Color.success },
            ],
            isDue: false
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

    renderList() {
        let { dataResults, isDue } = this.state
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
                    <Column>
                        {!isDue && (
                            <View style={{ flex: 1, padding: 16, paddingBottom: 8, backgroundColor: Color.blueFill, borderRadius: 4 }}>
                                <Text style={Styles.veryBigWhiteTextBold}>Waiting for Results</Text>
                                <Text style={[Styles.smallWhiteText, { marginVertical: 8 }]}>We are autising for screening blablablaballa blablablaballa blablablaballa blablablaballa</Text>
                                <View style={[styles.line, { marginVertical: 8 }]} />
                                <TouchableOpacity style={[Styles.row, { alignItems: 'center' }]}>
                                    <Text style={[Styles.whiteText, { marginVertical: 8 }]}>Contact Your Pediatrician</Text>
                                    <MaterialCommunityIcons
                                        name="arrow-right"
                                        color={Color.white}
                                        size={20}
                                        style={{ marginLeft: 8 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        {isDue && (
                            <View style={{ flex: 1, padding: 16, paddingBottom: 8, backgroundColor: Color.redPie, borderRadius: 4 }}>
                                <View style={[Styles.row, { alignItems: 'center' }]}>
                                    <View style={{ alignItems: 'center', marginRight: 8 }}>
                                        <Text style={[Styles.veryBigWhiteTextBold, { fontSize: 32 }]}>44</Text>
                                        <Text style={[Styles.smallWhiteText, {}]}>Due at 100</Text>
                                    </View>
                                    <Column>
                                        <Text style={Styles.veryBigWhiteTextBold}>Kunai is at risk</Text>
                                        <Text style={[Styles.smallWhiteText, { marginVertical: 8 }]}>We are autising for screening blablablaballa blablablaballa blablablaballa blablablaballa</Text>
                                    </Column>
                                </View>
                                <View style={[styles.line, { marginVertical: 8 }]} />
                                <TouchableOpacity style={[Styles.row, { alignItems: 'center' }]}>
                                    <Text style={[Styles.whiteText, { marginVertical: 8 }]}>Contact Your Pediatrician</Text>
                                    <MaterialCommunityIcons
                                        name="arrow-right"
                                        color={Color.white}
                                        size={20}
                                        style={{ marginLeft: 8 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity style={[Styles.rowBetween, { marginVertical: 8 }]} onPress={() => this.setState({ isDue: !isDue })}>
                            <Text>{isDue ? 'Switch to waiting screen' : 'Switch to due screen'}</Text>
                            <MaterialCommunityIcons name="arrow-right" size={24} />
                        </TouchableOpacity>
                        <View style={[Styles.row, { paddingVertical: 8, alignItems: 'flex-start' }]}>
                            <MaterialCommunityIcons
                                name="format-quote-open"
                                color={Color.grayFill}
                                size={20}
                            />
                            <Text style={[Styles.whiteText, { flex: 1, fontSize: 12, color: Color.grayFill, marginHorizontal: 8, textAlignVertical: 'center' }]}>Two hours of partners blablablaballa blablablaballa blablablaballa </Text>
                            <MaterialCommunityIcons
                                name="format-quote-close"
                                color={Color.grayFill}
                                size={20}
                            />
                        </View>

                        {dataResults.map((result, index) => {
                            return (
                                <View key={index} style={{ flex: 1, marginTop: 8, borderWidth: 0.5, borderColor: Color.grayWhite }}>
                                    <View style={[Styles.row, { alignItems: 'center', marginVertical: 8 }]}>
                                        <Image source={result.image} style={{ width: 36, height: 36, resizeMode: 'cover' }} />

                                        <Column>
                                            <Text style={Styles.bigBlackTextBold}>{result.title}</Text>
                                            <Text style={Styles.smallGrayText}>{result.status}</Text>
                                        </Column>
                                    </View>
                                    <Text style={Styles.smallGrayText}>{result.description}</Text>
                                    <View style={{ width: '100%', height: 4, backgroundColor: Color.gray, marginVertical: 8 }}>
                                        <View style={{ width: result.percentage + '%', height: 4, backgroundColor: result.color }} />
                                    </View>
                                </View>
                            )
                        })}


                    </Column>
                </ScrollView>
            </>
        )
    }
    deleteSelected() {
        null
    }
    submit() {
        null
    }
    upload() {
        null
    }
    render() {
        let { isDue } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="Screening Results"
                    backPress={() => this.props.navigation.goBack()}
                    dotsPress={() => this.upload()}
                    materialCommunityIconsName="upload"
                />

                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <View style={[styles.line, { marginVertical: 10 }]} />

                            {this.renderList()}
                            {isDue && (
                                <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                                    <Button
                                        labelButton="Start Behavioural intervention"
                                        onPress={() => this.props.navigation.navigate('PreliminaryAssessment')}
                                        style={{ marginVertical: 10, backgroundColor: Color.blueFill }}
                                    />
                                </View>
                            )}
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <>
                            <Row style={{ flex: 1 }}>
                                <Column style={{ flex: 2 }}>

                                    <View style={[styles.line, { marginVertical: 16, marginTop: 24 }]} />

                                    {this.renderList()}
                                </Column>
                                {isDue && (
                                    <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                                        <Button
                                            labelButton="Start Behavioural intervention"
                                            onPress={() => this.props.navigation.navigate('PreliminaryAssessment')}
                                            style={{ marginVertical: 10, backgroundColor: Color.blueFill }}
                                        />
                                    </View>
                                )}
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
    videoInputView: {
        padding: 16,
        borderStyle: 'dashed',
        height: width / 2,
        borderWidth: 1,
        borderColor: Color.blueFill,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxBlue: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(62, 123, 250, 0.075)',
        borderRadius: 8,
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

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningResults);