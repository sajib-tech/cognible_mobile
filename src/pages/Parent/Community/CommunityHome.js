
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

class CommunityHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noDataText: '',
            popularGroups: [],
            blogsData: []
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
        this.setState({ isLoading: true, popularGroups: [] });
        ParentRequest.getCommunityHomeData().then(result => {
            console.log("getCommunityHomeData", result);
            let blogsData = result.data.communityBlogs.edges;
            blogsData = blogsData.reverse();
            console.log("BlogData", blogsData);
            let popularGroups = result.data.communityGroups;
            this.setState({ isLoading: false, blogsData, popularGroups });
        }).catch(error => {
            console.log("Error: " + JSON.stringify(error));
            this.setState({ isLoading: false });
        });
    }

    renderInput() {
        return (
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <View style={{ width: 40, height: 40, }} >
                    <Image source={require('../../../../android/img/Img.png')}
                        style={{ width: 40, height: 40, borderRadius: 200 / 2, borderColor: '#C8C8C8', borderWidth: 1 }}
                    />
                </View>
                <View style={styles.textInputWrapper}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.textInput} onPress={() => {
                        this.props.navigation.navigate("CommunityAddBlog");
                    }}>
                        <Text>{getStr('BegaviourData.WriteSomething')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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
                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 8 }}
                    onPress={() => {
                        this.props.navigation.navigate("CommunityGroups");
                    }}>
                    <Text style={styles.title}>{getStr('BegaviourData.PopularGroups')}</Text>
                    <MaterialCommunityIcons name='arrow-right' size={20} color={Color.blackFont} />
                </TouchableOpacity>

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

    renderUpdate() {
        return (
            <>
                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 8 }}
                    onPress={() => {
                        this.props.navigation.navigate("CommunityBlogs");
                    }}>
                    <Text style={styles.title}>{getStr('BegaviourData.LatestUpdates')}</Text>
                    <MaterialCommunityIcons name='arrow-right' size={20} color={Color.blackFont} />
                </TouchableOpacity>

                {this.state.blogsData.length == 0 && <NoData>No Blog Available</NoData>}

                {this.state.blogsData.map((blog, index) => (
                    <CommunityCard 
                        key={index}
                        idBlog={blog.node.id}
                        title={blog.node.title}
                        descr={blog.node.description}
                        countText={blog.node.category.name}
                        comments={blog.node.comments.edges}
                        commentsCount={blog.node.comments.count}
                        likesCount={blog.node.likes.count}
                        cardType='latest'

                        onRefresh={()=>{
                            this.getData();
                        }}
                        onViewMore={() => {
                            this.props.navigation.navigate("CommunityBlogsDetail", blog);
                        }}
                    />
                ))}
            </>
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
    isDeleteUser(group) {
        // alert("delet")
        this.getPopularGroups();

    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
                {CommunitySetting.isCanCreateGroup() &&
                    <NavigationHeader
                        title={getStr('BegaviourData.Community')}
                        backPress={() => this.props.navigation.goBack()}
                        materialCommunityIconsName='plus'
                        dotsPress={() => {
                            this.props.navigation.navigate('CommunityAddGroup');
                        }}
                    />}

                {!CommunitySetting.isCanCreateGroup() &&
                    <NavigationHeader
                        title={getStr('BegaviourData.Community')}
                        backPress={() => this.props.navigation.goBack()}
                    />}

                {this.state.isLoading && <LoadingIndicator />}
                {!this.state.isLoading && <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <ScrollView contentInsetAdjustmentBehavior="automatic">
                                {this.renderInput()}

                                {this.renderGroup()}
                                {this.renderUpdate()}
                            </ScrollView>
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <Row>
                            <Column style={{ flex: 2 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    {this.renderInput()}

                                    {this.renderUpdate()}
                                </ScrollView>
                            </Column>
                            <Column>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    {this.renderGroup()}
                                </ScrollView>
                            </Column>
                        </Row>
                    )}
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
        padding: 8,
        height: 70
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

export default connect(mapStateToProps, mapDispatchToProps)(CommunityHome);
