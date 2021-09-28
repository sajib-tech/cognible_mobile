
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
import Button from '../../../components/Button';


class CommunityBlogsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditPage: false
        }

        this.params = this.props.route.params;

        console.log(this.params);
    }

    componentDidMount() {

    }

    updateComment(comment) {
        this.setState({ commentText: comment.node.comment, currentCommentData: comment, showEditPage: true });
    }

    updateCommentProcess() {
        this.setState({ isUpdateComment: true });

        let variables = {
            pk: this.state.currentCommentData.node.id,
            comment: this.state.commentText
        };

        console.log("Vars", variables);

        ParentRequest.updateComment(variables).then(dataResult => {
            Alert.alert("Information", "Comment Updated");
            this.props.navigation.goBack();
        }).catch(error => {
            Alert.alert("Information", "Cannot Update comment");
            console.log(JSON.parse(JSON.stringify(error)));
        });
    }

    deleteComment(id, commentId) {
        Alert.alert(
            'Information',
            'Are you sure you want to delete this comment?',
            [
                { text: 'No', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        let variables = {
                            pk: id,
                            comment: commentId
                        };
                        ParentRequest.deleteComment(variables).then(dataResult => {
                            Alert.alert("Information", "Comment Deleted");
                            this.props.navigation.goBack();
                        }).catch(error => {
                            Alert.alert("Information", "Cannot delete comment");
                            console.log(JSON.parse(JSON.stringify(error)));
                        });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    renderComments() {
        let userId = store.getState().user.id;
        return this.params.node.comments.edges.map((comment, key) => {
            return (
                <View key={key} style={{ flexDirection: 'row' }}>
                    <View style={styles.inlineCommentAvatar}>
                        <Text style={styles.inlineCommentAvatarText}>{comment.node.user.name.substr(0, 1).toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={styles.inlineCommentWrapper}>
                            <Text style={styles.inlineCommentTitle}>{comment.node.user.name}</Text>
                            <Text style={styles.inlineCommentText}>{comment.node.comment}</Text>
                        </View>
                    </View>
                    <View style={{ width: 80, flexDirection: 'row' }}>
                        {comment.node.user.id == userId && (
                            <>
                                <TouchableOpacity style={styles.deleteButtonSmall} onPress={() => {
                                    this.updateComment(comment);
                                }}>
                                    <MaterialCommunityIcons name='pencil' size={20} color={Color.primary} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.deleteButtonSmall} onPress={() => {
                                    this.deleteComment(this.params.id, comment.node.id);
                                }}>
                                    <MaterialCommunityIcons name='trash-can' size={20} color={Color.danger} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            );
        });
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
                <NavigationHeader
                    title="Comments"
                    backPress={() => this.props.navigation.goBack()}
                />

                <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        {this.renderComments()}
                    </ScrollView>
                </Container>

                {this.state.showEditPage && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({ showEditPage: false });
                        }}
                        style={{
                            width: '100%', height: '100%', position: 'absolute',
                            backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
                        }}>
                        <TouchableOpacity activeOpacity={1} style={{
                            width: 300, borderRadius: 6,
                            backgroundColor: Color.white, padding: 10
                        }}>
                            <TextInput onChangeText={(commentText) => { this.setState({ commentText }) }}
                                value={this.state.commentText}
                                autoFocus={true}
                                label='Comment'
                            />
                            <Button labelButton='Update Comment'
                                isLoading={this.state.isUpdateComment}
                                onPress={() => {
                                    this.updateCommentProcess();
                                }} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    deleteButtonSmall: {
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: Color.white,
        justifyContent: 'center',
        alignItems: 'center',
		borderWidth: 1,
        borderColor: Color.gray,
        marginLeft: 10
    },

    /** Inline Comment */
    inlineCommentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Color.primaryTransparent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7
    },
    inlineCommentAvatarText: {

    },
    inlineCommentWrapper: {
        backgroundColor: Color.gray,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginBottom: 5,
        flex: 1,
    },
    inlineCommentTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Color.blackFont
    },
    inlineCommentText: {
        fontSize: 15,
        color: Color.blackFont
    }
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityBlogsDetail);
