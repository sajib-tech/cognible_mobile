import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Alert,
    TextInput,
    Text, TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NavigationHeader from '../../../components/NavigationHeader'
import Comment from '../../Common/Support_Ticket/comment'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

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

const ClinicTaskDetails = ({ route, navigation}) => {

  const { task } = route.params
  const [commentData, setCommentData] = useState(null)

  const { data: commentQueryData, loading: commentQueryLoading, refetch } = useQuery(
    COMMENT_QUERY,
    {
      variables: {
        id: task.node.id,
      },
      fetchPolicy: 'cache-and-network',
    },
  )

  const [
    updateComment,
    { data: updateCommentData, error: updateCommentError, loading: updateCommentLoading },
  ] = useMutation(UPDATE_COMMENT, {
    variables: {
      id: task.node.id,
    },
  })

  useEffect(() => {
    refetch()
  }, [updateCommentData])

  const submitComment = () => {
    updateComment({
      variables: {
        id: task.node.id,
        comment: commentData,
      },
    })
    setCommentData('')
  }

  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {<NavigationHeader
         backPress={() => navigation.goBack()}
         title="Task Details"
      />}
        <ScrollView style={ styles.container}>
        <View style={styles.containerDisplay}>
          <View>
          <View style={{alignItems: 'flex-end', paddingRight: 10}}>
              <TouchableOpacity
                onPress={ ()=> navigation.navigate('ClinicTaskNew', task) }
              >
                <FontAwesome5 name={'edit'} style={{fontSize: 20, paddingRight: 7, color: '#3E7BFA'}} />
              </TouchableOpacity>
            </View>
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <View style={{marginBottom: 30}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Task Name</Text>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>{task.node.taskName}</Text>
            </View>
            <View
              style={{
                        borderColor: 'lightgrey',
                        borderBottomWidth: 3,
                        borderRadius: 20,
                        width: '80%'
                    }}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20}}>
          <View>
            <View>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Task Type</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{task.node.taskType.taskType}</Text>     
            </View>
            <View style={{marginTop: 15}}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Priority</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{task.node?.priority?.name}</Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Start Date</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{task.node.startDate}</Text>     
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Due Date</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{task.node.dueDate}</Text>
            </View>
          </View>
          </View>
          </View>
          </View>
         
          <View style={{flexDirection: 'row', marginTop: 25, marginBottom: 15}}>
            <Text style={{fontWeight: 'bold', fontSize: 25}}>Comments</Text>
            <FontAwesome5 name={'sort-down'} style={{fontSize: 25, paddingLeft: 7}} />
          </View>
          <View>
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
          </View>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      marginTop: 30
  },
  containerDisplay: {
    backgroundColor: 'white', 
    height: 300, 
    justifyContent: 'center',
    shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius: 5,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 5
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
    marginRight: 7
  },
  input: {
    paddingLeft: 10,
    fontSize: 16
  },
  sendIcon: {
    color: '#3E7BFA',
    fontSize: 25,
    paddingRight: 12
  }
})

export default ClinicTaskDetails