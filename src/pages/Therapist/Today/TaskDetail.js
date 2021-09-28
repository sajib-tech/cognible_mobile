
import 'react-native-gesture-handler';
import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Alert,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../../../utility/Style.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color from '../../../utility/Color';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader.js';

import store from '../../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult, getLeaveRequestList } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import moment from 'moment';
import { Row, Container, Column } from '../../../components/GridSystem';
import ClinicRequest from '../../../constants/ClinicRequest';
import PickerModal from '../../../components/PickerModal.js';
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Comment from '../../Common/Support_Ticket/comment'

const COMMENT_QUERY = gql`
  query($id: ID!) {
    task(id: $id) {
      comments {
        edges {
          node {
            id
            time
            comment
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`

const UPDATE_COMMENT = gql`
  mutation($id: ID!, $comment: String!) {
    updateTask(
      input: { task: { pk: $id }, deletedReminder: [], comments: [$comment], removeComments: [] }
    ) {
      task {
        id
        taskName
        description
        comments {
          edges {
            node {
              id
              comment
              time
              user {
                id
                username
              }
            }
          }
        }
      }
    }
  }
`


const RenderComment = ({taskID}) => {

    const [commentData, setCommentData] = useState(null)

    const { data: commentQueryData, loading: commentQueryLoading, refetch } = useQuery(
        COMMENT_QUERY,
        {
          variables: {
            id: taskID,
          },
          fetchPolicy: 'cache-and-network',
        },
      )

      const [
        updateComment,
        { data: updateCommentData, error: updateCommentError, loading: updateCommentLoading },
      ] = useMutation(UPDATE_COMMENT, {
        variables: {
          id: taskID,
        },
      })

      useEffect(() => {
        refetch()
      }, [updateCommentData])

      const submitComment = () => {
        updateComment({
          variables: {
            id: taskID,
            comment: commentData,
          },
        })
        setCommentData('')
      }

    return(
        <View>
            <ScrollView>
          {commentQueryData?.task.comments.edges.length === 0 ? (
            <Text style={{textAlign: 'center'}}>No Comments to Show</Text>
          ) : (
            commentQueryData?.task.comments.edges
              .slice(0)
              .reverse()
              .map(({ node: { id, time, comment, user: { username } } }) => (
                <Comment key={id} name={username} date={time} comment={comment}/>
              ))
          )}
          </ScrollView>
                <View style={styles.commentForm}>
                    <View>
                    <TextInput
                    style={styles.input}
                    onChangeText={(value)=> setCommentData(value)}
                    placeholder="Type comment"
                    defaultValue={commentData}
                    />
                    </View>
                    <TouchableOpacity
                    onPress={
                        ()=> submitComment()
                    }
                    >
                    <FontAwesome5 name={'paper-plane'} style={styles.sendIcon}/>
                    </TouchableOpacity>           
                    </View>
          </View>
    )
}

class TaskDetail extends Component {
    constructor(props) {
        super(props);

        this.params = props.route.params;
        console.log("Params", this.params);

        this.state = {
            isClosing: false,
            statuses: [],
            selectedStatus: null
        }
    }

    componentDidMount() {
        //Call this on every page
        ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);

        ClinicRequest.listStatus().then((result) => {
            console.log("listStatus", result);
            let statuses = result.data.taskStatus.map((item) => {
                return {
                    id: item.id,
                    label: item.taskStatus
                };
            });
            this.setState({ statuses, selectedStatus: this.params.node.status ?.id });
        }).catch((err) => {
            console.log("Err", err);
            Alert.alert("Information", "Cannot load status");
        });
    }

    updateTask() {
        let task = this.params;
        this.setState({ isClosing: true });

        let variables = {
            id: task.node.id,
            taskType: task.node.taskType ?.id,
            taskName: task.node.taskName,
            description: task.node.description,
            priority: task.node ?.priority ?.id ? task.node ?.priority ?.id : "UHJpb3JpdHlUeXBlOjM=",
            startDate: task.node.startDate ? task.node.startDate : moment().format("YYYY-MM-DD"),
            dueDate: task.node.dueDate ? task.node.dueDate : moment().format("YYYY-MM-DD"),
            status: this.state.selectedStatus
        }
        console.log("Vars", variables);
        ClinicRequest.updateTask(variables).then(profileData => {
            this.setState({ isClosing: false });
            Alert.alert(
                'Information',
                'Task successfully updated',
                [
                    {
                        text: 'Ok', onPress: () => {
                            this.props.navigation.goBack();
                            let parent = this.props.route ?.params ?.parent;
                            if (parent) {
                                parent.getData();
                            }
                        }
                    },
                ],
                { cancelable: false }
            );
        }).catch(error => {
            console.log("Error", JSON.stringify(error));

            Alert.alert('Information', error.toString());
            this.setState({ isClosing: false });
        });
    }

    closeTask() {
        let task = this.params;
        this.setState({ isClosing: true });

        let variables = {
            id: task.node.id,
            taskType: task.node.taskType.id,
            taskName: task.node.taskName,
            description: task.node.description,
            priority: task.node ?.priority ?.id,
            startDate: task.node.startDate,
            dueDate: task.node.dueDate
        }
        console.log(JSON.stringify(variables));
        ClinicRequest.closeTask(variables).then(profileData => {
            this.setState({ isClosing: false });
            Alert.alert(
                'Information',
                'Task successfully closed',
                [
                    {
                        text: 'Ok', onPress: () => {
                            this.props.navigation.goBack();
                        }
                    },
                ],
                { cancelable: false }
            );
        }).catch(error => {
            console.log("Error", JSON.stringify(error));

            Alert.alert('Information', error.toString());
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title="Task Detail"
                />

                <Container enablePadding={this.props.disableNavigation != true}>
                    <ScrollView keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior="automatic">
                        <Text style={styles.title}>Task Name</Text>
                        <Text style={styles.content}>{this.params ?.node ?.taskName}</Text>

                        <Text style={styles.title}>Description</Text>
                        <Text style={styles.content}>{this.params ?.node ?.description}</Text>

                        <Text style={styles.title}>Task Type</Text>
                        <Text style={styles.content}>{this.params ?.node ?.taskType ?.taskType}</Text>

                        <Text style={styles.title}>Priority</Text>
                        <Text style={styles.content}>{this.params ?.node ?.priority ?.name}</Text>

                        <Text style={styles.title}>Due Date</Text>
                        <Text style={styles.content}>{moment(this.params ?.node ?.dueDate).format("DD MMM YYYY")}</Text>

                        <PickerModal
                            label="Status"
                            selectedValue={this.state.selectedStatus}
                            data={this.state.statuses}
                            onValueChange={(selectedStatus, itemIndex) => {
                                this.setState({ selectedStatus });
                            }}
                        />
                        <Button
                        labelButton="Save Task"
                        // theme='danger-block'
                        onPress={() => {
                            this.updateTask();
                            // Alert.alert(
                            //     'Information',
                            //     'Are you sure want to close this task?',
                            //     [
                            //         { text: 'No', onPress: () => { }, style: 'cancel' },
                            //         {
                            //             text: 'Yes', onPress: () => {
                            //                 this.closeTask();
                            //             }
                            //         },
                            //     ],
                            //     { cancelable: false }
                            // );
                            }}
                            isLoading={this.state.isClosing}
                            style={{ marginVertical: 10}}
                            />
                        <View style={{flexDirection: 'row', marginTop: 25, marginBottom: 15}}>
                        <Text style={{ fontSize: 22}}>Comments</Text>
                        <FontAwesome5 name={'sort-down'} style={{fontSize: 22, paddingLeft: 7}} />
                        </View>
                        <RenderComment taskID={this.params ?.node ?.id} />
                    </ScrollView>
                </Container>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    input: {
        paddingLeft: 10,
        fontSize: 16
      },
    title: {
        fontSize: 12,
        color: Color.black,
        marginTop: 10
    },

    content: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.black,
    },
    commentForm: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#3E7BFA',
        borderRadius: 30,
        margin: 5,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 25
      },
      sendIcon: {
        color: '#3E7BFA',
        fontSize: 25,
        paddingRight: 12
      }
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
