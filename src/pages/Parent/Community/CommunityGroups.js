
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    Dimensions, TouchableOpacity, Platform, Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import moment from 'moment';
import DateHelper from '../../../helpers/DateHelper';
import ParentRequest from '../../../constants/ParentRequest';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import NavigationHeader from '../../../components/NavigationHeader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CommunityCard from '../../../components/CommunityCard';
import NoData from '../../../components/NoData';
import Color from '../../../utility/Color';
import { getStr } from "../../../../locales/Locale";
import Icon from "react-native-vector-icons/Entypo";
import LoadingIndicator from '../../../components/LoadingIndicator';
import store from '../../../redux/store';
import CommunitySetting from './CommunitySetting';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class CommunityGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noDataText: '',
            popularGroups: [],
        }
    }

    componentDidMount() {
        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
        const { navigation } = this.props;
        navigation.addListener('focus', () => {
            this.getData();
        });
    }

    getData() {
        this.setState({ isLoading: true });
        ParentRequest.fetchPopularGroupsData().then(result => {
            console.log("fetchPopularGroupsData", result);
            let popularGroups = result.data.communityGroups;
            this.setState({ isLoading: false, popularGroups });
        }).catch(error => {
            console.log("Error: ", error);
            this.setState({ isLoading: false });
        });
    }

    deleteGroup(group) {
        Alert.alert(
            'Information',
            'Are you sure want to delete this group ?',
            [
                { text: 'No', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        ParentRequest.deleteGroup({ pk: group.id }).then((res) => {
                            this.getData();
                            Alert.alert("Information", "Group successfully deleted.");
                        }).catch((err) => {
                            Alert.alert("Information", "Cannot delete group.\n" + err.toString());
                        })
                    }
                },
            ],
            { cancelable: false }
        );
    }

    renderGroup() {
        return (
            <>
                {this.state.popularGroups.length == 0 && <NoData>No Group Available</NoData>}

                {this.state.popularGroups.map((group, index) => (
                    <CommunityCard
                        key={index}
                        idBlog={group.id}
                        title={group.name}
                        countText={group.user.edges.length + ' Parents'}
                        descr={group.description}
                        navigate={this.props.navigation}
                        status='leave'
                        statusName='group'
                        showUpdateButton={CommunitySetting.isCanCreateGroup()}

                        onDeletePress={() => {
                            this.deleteGroup(group);
                        }}
                        onEditPress={() => {
                            this.props.navigation.navigate("CommunityAddGroup", group);
                        }}
                        onAddPress={() => {
                            this.props.navigation.navigate("CommunityAddBlog");
                        }}
                    />
                ))}
            </>
        );
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
                {CommunitySetting.isCanCreateGroup() &&
                    <NavigationHeader
                        title="Groups"
                        backPress={() => this.props.navigation.goBack()}
                        materialCommunityIconsName='plus'
                        dotsPress={() => {
                            this.props.navigation.navigate('CommunityAddGroup');
                        }}
                    />}

                {!CommunitySetting.isCanCreateGroup() &&
                    <NavigationHeader
                        title="Groups"
                        backPress={() => this.props.navigation.goBack()}
                    />}

                {this.state.isLoading && <LoadingIndicator />}
                {!this.state.isLoading && <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        {this.renderGroup()}
                    </ScrollView>
                </Container>}
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        color: Color.blackFont,
        flex: 1
    },
    textInputWrapper: {
        flex: 1,
    },
    textInput: {
        borderRadius: 8,
        marginLeft: 12,
        backgroundColor: "#FAFAFA",
        borderColor: Color.gray,
        borderWidth: 1,
        padding: 8
    },

    header: {
        flexDirection: 'row',
        height: 50,
        width: '100%',

    },
    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15
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
        fontWeight: 'bold',
        paddingTop: 10,
        color: '#45494E'
    },
    person: { width: 40, height: 35, borderRadius: 5 },
    item: {

        marginBottom: 10,
        width: '90%',
        borderRadius: 2,
        marginLeft: 20,

    },
    textNote: {

        backgroundColor: 'white',
        margin: 10,
        paddingBottom: 10,
        borderRadius: 10
    },
    circleImageLayout: {

        borderRadius: 200 / 2
    },
    TextInputStyleClass: {
        borderRadius: 8,
        marginLeft: 12,
        backgroundColor: "#FAFAFA",
        borderColor: 'rgba(0,0,0,0.05)'
    },
    TextStyle: {
        marginTop: 24,
        marginBottom: 16,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: 'normal'
    }

});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityGroups);
