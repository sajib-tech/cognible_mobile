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

class ScreeningVideo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRendering: true,
            appointments: [],
            selectedVideo: [
                { image: require('../../../android/img/image_9.png'), title: 'Video-2.mp4', progress: 100 },
                { image: require('../../../android/img/image_9.png'), title: 'Video-1.mp4', progress: 90 },
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
        let { selectedVideo } = this.state
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
                    <View style={{ padding: 8 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AnalyzingVideoTherapy')} style={styles.videoInputView}>
                            <View style={styles.boxBlue}>
                                <MaterialCommunityIcons name={'video-outline'} size={28} color={Color.blueFill} />
                                <Text style={[Styles.bigBlackText, { color: Color.blueFill, marginLeft: 8 }]}>Start Recording  </Text>
                            </View>
                            <Text style={[Styles.grayText, { textAlign: 'center', marginVertical: 16 }]}>Or</Text>

                            <Text style={[Styles.grayText, { textAlign: 'center', textDecorationLine: 'underline', }]}>Upload Video from Gallery</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[Styles.bigGrayText, { marginTop: 16 }]}>Selected Videos ({selectedVideo.length})</Text>
                    {selectedVideo.map((video, index) => {
                        return (
                            <View key={index} style={[Styles.row, { marginVertical: 16, borderBottomColor: Color.gray, borderBottomWidth: 1, paddingBottom: 8 }]}>
                                <Image source={video.image} style={{ width: width / 3.5, height: width / 5, resizeMode: 'contain' }} />
                                <Column>
                                    <TouchableOpacity onPress={() => this.deleteSelected()} style={[Styles.rowBetween, { flex: 0 }]}>
                                        <Text style={Styles.bigBlackText}>{video.title}</Text>
                                        <MaterialCommunityIcons
                                            name="trash-can-outline"
                                            size={24}
                                            color={Color.redFill}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[Styles.smallGrayText, { marginVertical: 4 }]}>Uploading.. {video.progress}%</Text>
                                    <View style={{ width: '100%', height: 4, backgroundColor: Color.gray, marginVertical: 8 }}>
                                        <View style={{ width: video.progress + '%', height: 4, backgroundColor: Color.blueFill }} />
                                    </View>
                                </Column>
                            </View>
                        )
                    })}
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
    render() {
        let { selectedVideo } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    title="Screening Video"
                    backPress={() => this.props.navigation.goBack()}
                />

                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <View style={[styles.line, { marginVertical: 10 }]} />

                            {this.renderList()}
                            {selectedVideo.length > 0 && (
                                <Button
                                    labelButton="Submit"
                                    onPress={() => this.submit()}
                                    style={{ marginVertical: 10, backgroundColor: Color.blueFill }}
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningVideo);