import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    BackHandler, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchInput, { createFilter } from 'react-native-search-filter';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';

const KEYS_TO_FILTERS = ['name', 'subject'];
import moment from 'moment';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import ImageHelper from '../../../helpers/ImageHelper';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import WS from 'react-native-websocket'
import _ from 'lodash';
import TherapistRequest from '../../../constants/TherapistRequest';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers';
import { setToken, setTokenPayload } from '../../../redux/actions';
import store from '../../../redux/store';

const width = Dimensions.get('window').width
class MessageDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLoaded: false,
            messages: [],
            text: '',
        }
        this.params = this.props.route.params.message;
        this.generatedId = 9999;
        console.log("Params", this.params);

        this.currentId = store.getState().user.id;

        let firstId = this.params.node.firstUser.id;
        let secondId = this.params.node.secondUser.id;

        if(firstId == this.currentId){
            console.log("Case 1");
            this.firstId = firstId;
            this.secondId = secondId;
            this.title = this.params.node.secondUser.name;
        }else{
            console.log("Case 2");
            this.firstId = secondId;
            this.secondId = firstId;
            this.title = this.params.node.firstUser.name;
        }
    }

    _refresh() {

    }

    componentDidMount() {
        let messages = this.params.node.chatmessageSet.edges.map((chatItem) => {
            return {
                _id: chatItem.node.id,
                text: chatItem.node.message,
                createdAt: moment(chatItem.node.timestamp).toDate(),
                createdAtFormat: moment(chatItem.node.timestamp).format("YYYY-MM-DD HH:mm:ss"),
                user: {
                    _id: chatItem.node.user.id,
                    name: chatItem.node.user.name,
                    avatar: ImageHelper.getImage(''),
                },
            };
        });

        messages = _.orderBy(messages, ['createdAtFormat'], ['desc']);

        // messages.forEach(element => {
        //     console.log(element.createdAtFormat);
        // });

        this.setState({ title: this.params.node.secondUser.name });

        this.onBackPress = () => {
            this.goBack();
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getMessage();
    }

    getMessage() {
        this.setState({ isLoading: true });
        let params = {
            id: this.secondId
        };
        TherapistRequest.getSecondUserMessageList(params).then((result) => {
            console.log("getSecondUserMessageList", result);
            let messages = [];
            if (result.data.userthread) {
                messages = result.data.userthread.chatmessageSet.edges;
                messages = messages.map((chatItem) => {
                    return {
                        _id: chatItem.node.id,
                        text: chatItem.node.message,
                        createdAt: moment(chatItem.node.timestamp).toDate(),
                        createdAtFormat: moment(chatItem.node.timestamp).format("YYYY-MM-DD HH:mm:ss"),
                        user: {
                            _id: chatItem.node.user.id,
                            name: chatItem.node.user.name,
                            avatar: ImageHelper.getImage(''),
                        },
                    };
                });
            }

            console.log("New Message", messages);

            messages = _.orderBy(messages, ['createdAtFormat'], ['desc']);

            this.setState({ messages, isLoading: false, isLoaded: true });
        }).catch((err) => {
            Alert.alert("Information", "Cannot get message list\n" + err.toString());
            this.setState({ isLoading: false });
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    sendMessage(msgs) {
        console.log(msgs[0]);

        if (this.ws) {
            let mess_dict = JSON.stringify({ 'message': msgs[0].text });
            try {
                this.ws.send(mess_dict);
            } catch (err) {
                Alert.alert("Information", "Cannot Send Message\n" + err.toString());
            }
        }
    }

    appendMessage(obj) {
        let messages = this.state.messages;
        messages.unshift({
            _id: this.generatedId,
            text: obj.message,
            createdAt: moment().toDate(),
            createdAtFormat: moment().format("YYYY-MM-DD HH:mm:ss"),
            user: {
                _id: obj.user_id,
                avatar: ImageHelper.getImage(''),
            },
        });

        this.generatedId++;

        this.setState({ messages });
    }

    goBack() {
        this.props.navigation.goBack();

        setTimeout(() => {
            let parent = this.props.route.params.parent;
            if (parent) {
                parent.getData();
            }
        }, 500);
    }

    searchActive() {

    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                textStyle={{
                    left: {
                        color: Color.white
                    },
                    right: {
                        color: Color.blackFont
                    },
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: Color.primary,
                    },
                    right: {
                        backgroundColor: Color.gray,
                    },
                }}
            />
        );
    }

    render() {
        let url = "wss://application.cogniable.us/ws/chat/" + this.firstId + "/" + this.secondId;

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.goBack()}
                    title={this.title}
                    disabledTitle={true}
                />

                <Container enablePadding={this.props.disableNavigation != true}>
                    <View style={{ flex: 1 }}>
                        {this.state.isLoading && <LoadingIndicator />}
                        {!this.state.isLoading && <GiftedChat
                            messages={this.state.messages}
                            onSend={messages => this.sendMessage(messages)}
                            user={{
                                _id: this.currentId
                            }}
                            renderBubble={this.renderBubble}
                            timeTextStyle={{ left: { color: Color.white }, right: { color: Color.blackFont } }}
                        />}
                    </View>

                    {this.state.isLoaded && <WS
                        ref={ref => { this.ws = ref }}
                        url={url}
                        onOpen={() => {
                            console.log('Open!');
                            // this.ws.send("How are you ?");
                        }}
                        onMessage={(msg) => {
                            let data = msg.data;
                            console.log("OnMessage Triggered", data);

                            //parsing to JSON
                            let obj = JSON.parse(data);

                            //append the message
                            this.appendMessage(obj);

                            console.log("onMessage", data);
                        }}
                        onError={(err) => {
                            console.log("onError", err.message, url);
                        }}
                        onClose={(err) => {
                            console.log("onClose", err);
                        }}
                        reconnect // Will try to reconnect onClose
                    />}

                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput style={[Styles.input, { flex: 1 }]}
                            multiline={true}
                            placeholder={'Type text here'}
                            defaultValue={text}
                            onChangeText={(text) => this.setState({ text })}
                        />
                        <TouchableOpacity onPress={() => this.sendMessage()}
                            style={{ marginHorizontal: 6, backgroundColor: Color.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <MaterialCommunityIcons
                                name='send'
                                color={Color.white}
                                size={24}
                            />
                        </TouchableOpacity>
                    </View> */}
                </Container>
            </SafeAreaView >
        )
    }
}
const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end', borderRadius: 20, marginTop: 8,
    },
    recentImage: {
        width: width / 11, height: width / 11,
        borderRadius: 20
    },
    messageImage: {
        width: width / 1.4,
        height: width / 3,
        resizeMode: 'cover'
    },
    userImage: {
        width: 32,
        height: 32,
        borderRadius: 8,
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
        marginHorizontal: 8, height: 60, alignItems: 'center'
    },
    title: {
        fontSize: 28, fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
    },
    textBig: {
        fontSize: 16,
        color: '#000'
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
        paddingBottom: 10
    },
    messageSubject: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)'
    },
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetail);