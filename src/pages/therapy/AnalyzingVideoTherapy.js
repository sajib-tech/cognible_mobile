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

class AnalyzingVideoTherapy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRendering: true,
            appointments: [],
            autismsheets: [
                { node: { title: "Preliminary Assessment", description: { description: 'description description description' }, start: '8', end: '10', active: true, } },
                { node: { title: "Preliminary Assessment", description: { description: 'description description description' }, start: '8', end: '10', active: false, } },
                { node: { title: "Preliminary Assessment", description: { description: 'description description description' }, start: '8', end: '10', active: false, } },
            ]
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
                    {(this.state.autismsheets.length == 0) && (
                        <NoData>No Data Available</NoData>
                    )}


                    <Text style={[Styles.grayText, { marginVertical: 4, fontSize: 12 }]}>Upcoming Next</Text>
                    <View style={styles.wrapperStyle}>
                        {this.state.autismsheets.map((autismsheet, key) => {
                            let textColor = Color.blackFont;
                            if (textColor == null) {
                                textColor = '#000';
                            }
                            if (autismsheet.node.active == true && key != 0) {
                                let dotColor = Color.blueFill;
                                if (dotColor == null) {
                                    dotColor = '#7480FF';
                                }
                                return (
                                    <TouchableOpacity style={[styles.row, {}]} key={key}>
                                        <View>
                                            <View style={[styles.dotStyle, { backgroundColor: dotColor }]}></View>
                                            {key <= this.state.autismsheets.length && (
                                                <View style={[styles.connectionStyle, { backgroundColor: Color.noActiveBlueDot }]}></View>
                                            )}
                                        </View>
                                        <View style={{ flex: 1, padding: 8, marginBottom: 16, marginLeft: 8, borderRadius: 4, borderWidth: 0.5, borderColor: Color.gray }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={[styles.textStyle, { fontSize: 12, color: textColor }]}>{"STEP " + (key + 1)} </Text>
                                                <View style={styles.dot} />
                                                <Text style={[styles.textStyle, { fontSize: 12, color: textColor }]}> {autismsheet.node.start} - {autismsheet.node.end} MIN</Text>
                                            </View>
                                            <Text style={Styles.bigBlackText}>{autismsheet.node.title}</Text>
                                            <Text style={[Styles.grayText, { marginVertical: 4, fontSize: 12 }]}>{autismsheet.node.description.description}</Text>

                                            <View style={[Styles.row, { alignItems: 'center' }]}>
                                                <Text style={[Styles.primaryText, { marginVertical: 4, marginRight: 4 }]}>Start Assessment</Text>
                                                <MaterialCommunityIcons
                                                    name="arrow-right"
                                                    size={20}
                                                    color={Color.blueFill}
                                                />
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                );
                            } else {
                                let dotColor = null;
                                if (dotColor == null) {
                                    dotColor = Color.noActiveBlueDot;
                                }
                                return (
                                    <View style={[styles.row, { opacity: 0.4 }]} key={key}>
                                        <View>
                                            <View style={[styles.dotStyle, { backgroundColor: dotColor }]}></View>
                                            {key + 1 < this.state.autismsheets.length && (
                                                <View style={[styles.connectionStyle, { backgroundColor: Color.noActiveBlueDot }]}></View>
                                            )}
                                        </View>
                                        <View style={{ flex: 1, padding: 8, marginBottom: 16, marginLeft: 8, borderRadius: 4, borderWidth: 0.5, borderColor: Color.gray }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={[styles.textStyle, { fontSize: 12, color: textColor }]}>{"STEP " + (key + 1)} </Text>
                                                <View style={styles.dot} />
                                                <Text style={[styles.textStyle, { fontSize: 12, color: textColor }]}> {autismsheet.node.start} - {autismsheet.node.end} MIN</Text>
                                            </View>
                                            <Text style={Styles.bigBlackText}>{autismsheet.node.title}</Text>
                                            <Text style={[Styles.grayText, { marginVertical: 4 }]}>{autismsheet.node.description.description}</Text>
                                        </View>
                                    </View>
                                );
                            }
                        })}

                    </View>
                </ScrollView>
            </>
        )
    }

    render() {
        let { isRendering } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="Analyzing Video"
                    backPress={() => this.props.navigation.goBack()}
                />

                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <View style={[styles.line, { marginVertical: 10 }]} />
                            {isRendering && (
                                <View style={{ flex: 1, marginVertical: 32 }} >
                                    <BallIndicator size={64} color={Color.grayFill} />
                                </View>
                            )}
                            {this.renderList()}

                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <>
                            <Row style={{ flex: 1 }}>
                                <Column style={{ flex: 2 }}>

                                    <View style={[styles.line, { marginVertical: 16, marginTop: 24 }]} />

                                    {this.renderList()}
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalyzingVideoTherapy);