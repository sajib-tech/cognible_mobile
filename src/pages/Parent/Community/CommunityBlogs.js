
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    Dimensions, TouchableOpacity, Platform
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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class CommunityBlogs extends Component {
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
        ParentRequest.fetchBlogUpdates().then(result => {
            console.log("fetchBlogUpdates", result);
            let blogsData = result.data.communityBlogs.edges;
            blogsData = blogsData.reverse();
            this.setState({ isLoading: false, blogsData });
        }).catch(error => {
            console.log("Error: " + JSON.stringify(error));
            this.setState({ isLoading: false });
        });
    }

    renderUpdate() {
        return (
            <>
                {this.state.blogsData.length == 0 && <NoData>No Blog Available</NoData>}

                {this.state.blogsData.map((blog, index) => (
                    <CommunityCard
                        key={index}
                        idBlog={blog.node.id}
                        time={blog.node.time}
                        title={blog.node.title}
                        countText={blog.node.category.name}
                        comments={blog.node.comments.edges}
                        commentsCount={blog.node.comments.count}
                        likesCount={blog.node.likes.count}
                        cardType='latest'

                        onRefresh={() => {
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
                <NavigationHeader
                    title="Blogs"
                    backPress={() => this.props.navigation.goBack()}
                    materialCommunityIconsName='plus'
                    dotsPress={() => {
                        this.props.navigation.navigate('CommunityAddBlog');
                    }}
                />

                {this.state.isLoading && <LoadingIndicator />}
                {!this.state.isLoading && <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        {this.renderUpdate()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CommunityBlogs);
