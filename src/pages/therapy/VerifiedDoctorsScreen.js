
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView, ActivityIndicator,
    View, Image, FlatList,
    Text, TextInput, Dimensions,
    RefreshControl, TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, List, ListItem, Button, Icon, Input } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { client, verifyToken, refreshToken, getDoctorsListQuery } from '../../constants/index';
import { node } from 'prop-types';
import { connect } from 'react-redux';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import Color from '../../utility/Color';
import NavigationHeader from '../../components/NavigationHeader';
import OrientationHelper from '../../helpers/OrientationHelper';
import { Row, Container, Column } from '../../components/GridSystem';
import NoData from '../../components/NoData';
import ImageHelper from '../../helpers/ImageHelper';
import {getStr} from "../../../locales/Locale";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const list = [
    {
        name: 'Dr. Evan ',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Forts, Gurgaon " 4.8 KM'
    },
    {
        name: 'Dr.Beth Cooper',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Forts, Gurgaon " 4.8 KM'
    },
    {
        name: 'Dr. Marjorie Russell',
        avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbrZiVd4ny9ZVhvvQj-IgPNl3vMftzNtenpZuq7iNXzqqf-qJA',
        subtitle: 'Forts, Gurgaon " 4.8 KM'
    },
    {
        name: 'Dr. Bessie Jones',
        avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRRimyM2xMhIYl_PmpbeSlABEGOUcm4N8kmYKOvR2pnQH0CLt1n',
        subtitle: 'Forts, Gurgaon " 4.8 KM'
    },
    {
        name: 'Dr. Wynn Fisher',
        avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQWv4udXw1Qzy7OF_U7i9AUFSdX6SgVbEXO6qrW3sGDc3c_GWwk',
        subtitle: 'Forts, Gurgaon " 4.8 KM'
    },
    {
        name: 'Dr. Victoria Watson',
        avatar_url: 'https://kenh14cdn.com/2019/2/24/3561716420480213454575853861059020806684672n-15510057259571546306615.jpg',
        subtitle: 'Forts, Gurgaon " 4.8 KM'
    }
]




class VerifiedDoctorsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            loading: true,
            doctorsList: [],
            noDataText: ""
        }
    }

    _refresh() {
        this.componentDidMount();
    }

    componentDidMount() {
        TokenRefresher.refreshTokenIfNeeded(this.props.dispatchSetToken, this.props.dispatchSetTokenPayload)
            .then(() => {
                this.getDoctorsList();
            }).catch((error) => {
                console.log("TokenRefresher Error: " + JSON.stringify(error));
                this.setState({ showLoading: false });
            });
    }

    getDoctorsList() {
        this.setState({ showLoading: true });
        client.query({
            query: getDoctorsListQuery
        }).then(result => {
            this.setState({ showLoading: false });
            console.log('getDoctorsListQuery', result);
            if (result.data.getDoctors.edges.length > 0) {
                this.setState({ doctorsList: result.data.getDoctors.edges })
            } else {
                this.setState({ noDataText: "No data found" })
            }

        }).catch(error => {
            this.setState({ showLoading: false });
            console.log("Error :Doctors list-------:" + JSON.stringify(error));
        });
    }

    renderList() {
        const { doctorsList, noDataText, showLoading } = this.state;
        return (
            <>
                {doctorsList.length == 0 && (
                    <NoData>No Doctor Available</NoData>
                )}

                {doctorsList.map((doctor, i) => (
                    <TouchableOpacity activeOpacity={0.8} key={i} onPress={() => { }}
                        style={styles.card}>
                        <Image source={{ uri: ImageHelper.getImage('') }} style={styles.image} />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{doctor.node.name}</Text>
                            <Text style={styles.cardSubtitle}>{doctor.node.location}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </>
        );
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
                <NavigationHeader
                    title={getStr('BegaviourData.VerifiedDoctors')}
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>

                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <ScrollView contentInsetAdjustmentBehavior="automatic"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.showLoading}
                                    onRefresh={this._refresh.bind(this)}
                                />
                            }>
                            {this.renderList()}
                        </ScrollView>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row>
                            <Column style={{ flex: 2 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic" refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.showLoading}
                                        onRefresh={this._refresh.bind(this)}
                                    />
                                }>
                                    {this.renderList()}
                                </ScrollView>
                            </Column>
                            <Column>
                            </Column>
                        </Row>

                    )}

                </Container>
            </SafeAreaView >
        );
    }
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: Color.gray,
        backgroundColor: Color.white,
        padding: 10,
        flexDirection: 'row',
        marginTop: 10,
        borderRadius: 5
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardContent: {
        marginLeft: 10,
        flex: 1,

    },
    cardTitle: {
        fontSize: 18,
        color: Color.blackFont,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#999',
    }

});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state),
    authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedDoctorsScreen);

