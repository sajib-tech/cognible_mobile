import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    Modal, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.firstUser.name', 'node.secondUser.name'];

import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import TherapistRequest from '../../../constants/TherapistRequest';
// import TherapistRequest from '../../../constants/TherapistRequest';
import Centrifuge from 'centrifuge';
import TokenRefresher from '../../../helpers/TokenRefresher';
import LoadingIndicator from '../../../components/LoadingIndicator';
import Button from '../../../components/Button';

import _ from 'lodash';

const width = Dimensions.get('window').width
class MessagesHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLoadingStaff: false,
            isShowStaff: false,
            searchMessage: '',
            messages: [],
            userLists: [],
            recents: [],
            staffs: [],
            students: [],

            modeList: 'staff',

            selectedMessage: null, //for tablet only
        }
    }

    _refresh() {
        this.setState({ searchMessage: '' }, () => {
            this.getData();
        });
    }

    componentDidMount() {
        //Call this on every page
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getData();
    }

    getData() {
        this.setState({ isLoading: true });

        TherapistRequest.getMessageList().then((result) => {
            console.log("Res", result);
            let id = store.getState().user.id;
            console.log("ID", id);
            let userLists = result.data.thread.edges;
            userLists = userLists.map((chat, key) => {
                let timestamp = 0;
                chat.node.chatmessageSet.edges.map((chatData)=>{
                    timestamp = moment(chatData.node.timestamp).valueOf();
                });
                chat.timestamp = timestamp;
                return chat;
            })
            //userLists = userLists.reverse();
            userLists = _.orderBy(userLists, ['timestamp'],['desc']);
            console.log(userLists);
            this.setState({ isLoading: false, userLists });
        }).catch((err) => {
            this.setState({ isLoading: false });
            Alert.alert("Information", "Cannot get message list\n" + err.toString());
        });
    }

    getStaffData() {
        this.setState({ isLoadingStaff: true });
        TherapistRequest.getStudentNewData().then((result) => {
            console.log("Staff", result);
            let staffs = result.data.staffs.edges;
            let students = result.data.students.edges;

            staffs = _.orderBy(staffs, ['node.name'], ['asc']);
            students = _.orderBy(students, ['node.firstname'], ['asc']);

            this.setState({ isLoadingStaff: false, staffs, students });
        }).catch((err) => {
            this.setState({ isLoadingStaff: false });
            Alert.alert("Information", "Cannot get staff & student data\n" + err.toString());
        });
    }

    searchUpdated(term) {
        this.setState({ searchMessage: term })
    }

    showMessage(item) {
        this.props.navigation.navigate('MessageDetail', {
            message: item,
            parent: this
        });
    }

    showStaffList() {
        this.setState({ isShowStaff: true });
        this.getStaffData();
    }

    renderModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isShowStaff}
                onRequestClose={() => {
                    this.setState({ isShowStaff: false })
                }} >
                <TouchableOpacity style={styles.modalRoot} activeOpacity={1} onPress={() => {
                    this.setState({ isShowStaff: false })
                }}>
                    <View style={styles.modalContent}>
                        <Row>
                            <Column>
                                <Button labelButton='Therapist'
                                    theme={this.state.modeList == 'staff' ? 'primary' : 'secondary'}
                                    onPress={() => {
                                        this.setState({ modeList: 'staff' });
                                    }} />
                            </Column>
                            <Column>
                                <Button labelButton='Student'
                                    theme={this.state.modeList == 'student' ? 'primary' : 'secondary'}
                                    onPress={() => {
                                        this.setState({ modeList: 'student' });
                                    }} />
                            </Column>
                        </Row>

                        {this.state.isLoadingStaff && (
                            <LoadingIndicator />
                        )}

                        {!this.state.isLoadingStaff && (
                            <ScrollView>
                                {this.state.modeList == "staff" && this.state.staffs.map((staff, key) => {
                                    return (
                                        <TouchableOpacity style={styles.itemListItem} key={key} activeOpacity={0.9} onPress={() => {
                                            this.setState({
                                                isShowStaff: false
                                            }, () => {
                                                let id = store.getState().user.id;
                                                this.props.navigation.navigate('MessageDetail', {
                                                    message: {
                                                        node: {
                                                            chatmessageSet: {
                                                                edges: [],
                                                            },
                                                            firstUser: {
                                                                id
                                                            },
                                                            secondUser: {
                                                                id: staff.node?.user?.id,
                                                                name: staff.node?.name
                                                            }
                                                        }
                                                    },
                                                    parent: this
                                                });
                                            });

                                        }}>
                                            <Text style={{ color: Color.black }}>{staff.node.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                                {this.state.modeList == "student" && this.state.students.map((staff, key) => {
                                    return (
                                        <TouchableOpacity style={styles.itemListItem} key={key} activeOpacity={0.9} onPress={() => {
                                            this.setState({
                                                isShowStaff: false
                                            }, () => {
                                                let id = store.getState().user.id;
                                                this.props.navigation.navigate('MessageDetail', {
                                                    message: {
                                                        node: {
                                                            chatmessageSet: {
                                                                edges: [],
                                                            },
                                                            firstUser: {
                                                                id
                                                            },
                                                            secondUser: {
                                                                id: staff.node.parent.id,
                                                                name: staff.node.firstname
                                                            }
                                                        }
                                                    },
                                                    parent: this
                                                });
                                            });

                                        }}>
                                            <Text style={{ color: Color.black }}>{staff.node.firstname}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    renderList() {
        let { userLists, searchMessage } = this.state
        const filteredMessages = userLists.filter(createFilter(searchMessage, KEYS_TO_FILTERS))

        return (
            <>
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    height: 40,
                    marginVertical: 8,
                    backgroundColor: Color.grayWhite
                }}>
                    <MaterialCommunityIcons
                        name='account-search-outline'
                        size={24}
                        color={Color.gray}
                    />
                    <SearchInput
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        style={styles.searchInput}
                        placeholder="Search Messages"
                    // clearIcon
                    />
                </View>

                <ScrollView keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._refresh.bind(this)}
                        />
                    }
                >
                    {filteredMessages.map((userList, index) => {
                        let last_message = "N/A";

                        let messageEdges = userList.node.chatmessageSet.edges;
                        if (messageEdges.length != 0) {
                            let lastMessageEdge = messageEdges[messageEdges.length - 1];
                            last_message = lastMessageEdge.node.message;
                        }

                        let labelName = userList.node.secondUser.name;
                        let currentId = store.getState().user.id;
                        if (currentId == userList.node.secondUser.id) {
                            labelName = userList.node.firstUser.name;
                        }

                        return (
                            <TouchableOpacity key={index} activeOpacity={0.9}
                                onPress={() => this.showMessage(userList)} key={'list' + index} style={styles.messageItem}>
                                <View style={styles.messageImageWrapper}>
                                    <Image style={styles.messageImage} source={{ uri: ImageHelper.getImage('') }} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 8, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.messageName}>{labelName}</Text>
                                        {/* {message.node.newCount.length != 0 && (
                                            <View style={styles.newCount}>
                                                <Text style={styles.textCount}>{message.node.newCount}</Text>
                                            </View>
                                        )} */}
                                    </View>
                                    <Text style={styles.messageSubject}>{last_message}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                    {userLists == null || userLists.length == 0 && (
                        <NoData>No Message Available</NoData>
                    )}
                </ScrollView>
            </>
        );
    }

    render() {


        return (
            <SafeAreaView style={styles.container}>
                <Container>
                    {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                        <>
                            <Row style={{ paddingTop: 30, paddingBottom: 10 }}>

                            </Row>
                            <Row style={{ paddingTop: 12, paddingBottom: 10 }}>
                                <Column>
                                    <Text style={styles.title}>Messages</Text>
                                </Column>
                                <Column>
                                    <TouchableOpacity style={styles.header} onPress={() => {
                                        this.showStaffList()
                                    }}>
                                        <MaterialCommunityIcons
                                            name='filter-variant'
                                            size={24}
                                            color={Color.primary}
                                        />
                                    </TouchableOpacity>
                                </Column>
                            </Row>
                            {this.renderList()}
                        </>
                    )}

                    {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                        <>
                            <Row style={{ paddingTop: 30, paddingBottom: 10 }}>
                                <Column>
                                    <Text style={styles.title}>Messages</Text>
                                </Column>
                                <Column>
                                    <TouchableOpacity style={styles.header} onPress={() => {
                                        this.showStaffList()
                                    }}>
                                        <MaterialCommunityIcons
                                            name='filter-variant'
                                            size={24}
                                            color={Color.primary}
                                        />
                                    </TouchableOpacity>
                                </Column>
                            </Row>
                            <Row style={{ flex: 1 }}>
                                <Column>
                                    {this.renderList()}
                                </Column>

                            </Row>
                        </>
                    )}

                    {this.renderModal()}
                </Container>
            </SafeAreaView >
        )
    }
}
const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end',
    },
    recentImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    messageImage: {
        width: 50,
        height: 50,
        borderRadius: 5
    },
    messageImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        backgroundColor: '#fff'
    },
    smallImage: {
        width: width / 15, height: width / 15, borderRadius: 2,
    },
    bigImage: {
        width: width / 3, height: width / 3.3,
        resizeMode: 'contain',
        // backgroundColor: 'red'
    },
    row: {
        flex: 1, flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    recentBox: {
        marginHorizontal: 8,
        alignItems: 'center'
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
    newCount: {
        backgroundColor: Color.primary, padding: 2,
        width: 16, height: 16, borderRadius: 4, justifyContent: 'center'
    },
    textCount: {
        color: Color.white, fontSize: 10, textAlign: 'center'
    }
    ,
    buttonStart: {
        flex: 1, backgroundColor: Color.primary, borderRadius: 8,
        alignItems: 'center', paddingVertical: 12
    },
    buttonStartText: {
        color: Color.white
    },
    buttonEnd: {
        flex: 1, borderColor: Color.primary, borderWidth: 1, borderRadius: 8,
        alignItems: 'center', paddingVertical: 12
    },
    buttonEndText: {
        color: Color.primary
    },
    line: {
        height: 1, width: width / 1.2, backgroundColor: Color.silver,
        marginVertical: 4
    },
    dot: {
        height: width / 55, width: width / 55, backgroundColor: Color.silver, borderRadius: width / 55,
        marginHorizontal: 8
    },
    messageItem: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center',
        padding: 10
    },
    messageName: {
        fontSize: 15,
        color: '#45494E',
        fontWeight: "500"
    },
    messageSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
    searchInput: {
        padding: 4,
        backgroundColor: Color.grayWhite,
    },
    modalRoot: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: 300,
        borderRadius: 5,
        backgroundColor: Color.white,
        padding: 5,
        height: '80%'
    },
    itemListItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    }
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesHome);
