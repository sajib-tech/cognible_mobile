import React, {useState, useEffect} from 'react'

import {
  Text,
  View, 
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native'
import NavigationHeader from '../../../components/NavigationHeader'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Comment from './comment'
import gql from 'graphql-tag'
import { useQuery, useMutation,} from '@apollo/react-hooks'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler';

const COMMENT_QUERY = gql`
  query($id: ID!) {
    ticket(id: $id) {
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
    updateTicket(input: { pk: $id, comments: [$comment] }) {
      ticket {
        id
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
  }
`


const ViewSupportTicket = ({route, navigation}) => {

  const [commentData, setCommentData] = useState(null)

  const {
    ticketId,
    issueName,
    raiseBy,
    status,
    statuId,
    priority,
    priorityId,
    date,
    description,
    assign,
    assignId,
    serviceIssue,
    serviceIssueId
  } = route.params
  
  const {
    data: commentQueryData,
    error: commentQueryError,
    loading: commentQueryLoading,
    refetch
  } = useQuery(COMMENT_QUERY, {
    variables: {
      id: ticketId,
    },
    fetchPolicy: 'cache-and-network',
  })

  const ticketDate = moment(date).format('DD/MM/YYYY')

  const [
    updateComment,
    { data: updateCommentData, error: updateCommentError, loading: updateCommentLoading },
  ] = useMutation(UPDATE_COMMENT, {
    variables: {
      id: ticketId,
    },
  })

 

  useEffect(() => {
    refetch()
  }, [updateCommentData])

  const submitComment = () => {
    updateComment({
      variables: {
        id: ticketId,
        comment: commentData,
      },
    })
    setCommentData('')
  }

  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {<NavigationHeader
         backPress={() => navigation.goBack()}
         title="Support Ticket"
      />}
        <ScrollView style={ styles.container}>
        <View style={styles.containerDisplay}>
          <View>
          <View style={{alignItems: 'flex-end', paddingRight: 10}}>
              <TouchableOpacity
                onPress={ ()=> navigation.navigate('EditSupportTicket', {
                  ticketId: ticketId,
                  // issueName: issueName,
                  // raiseBy: raiseBy,
                  // status: status,
                  // priority: priority,
                  // date: date,
                  // description,
                  // assign,
                  // serviceIssue,
                  // statuId,
                  // priorityId,
                  // assignId,
                  // serviceIssueId
                })}
              >
                <FontAwesome5 name={'edit'} style={{fontSize: 20, paddingRight: 7, color: '#3E7BFA'}} />
              </TouchableOpacity>
            </View>
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <View style={{marginBottom: 30}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Issue Name</Text>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>{issueName}</Text>
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
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Raise By</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{raiseBy}</Text>     
            </View>
            <View style={{marginTop: 15}}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Priority</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{priority}</Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Status</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{status}</Text>     
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Date</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold', color: 'black'}}>{ticketDate}</Text>
            </View>
          </View>
          </View>
          </View>
          </View>
         
          <View style={{flexDirection: 'row', marginTop: 25, marginBottom: 15}}>
            <Text style={{fontFamily: 'bold', fontSize: 25}}>Comments</Text>
            <FontAwesome5 name={'sort-down'} style={{fontSize: 25, paddingLeft: 7}} />
          </View>
          <View>
          {commentQueryData?.ticket.comments.edges.length === 0 ? (
            <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
              <Text>No Comments to Show</Text>
            </View>
          ) : (
            commentQueryData?.ticket.comments.edges
              .slice(0)
              .reverse()
              .map(({ node: { id, time, comment, user: { username } } }) => (
                <Comment name={raiseBy} date={time} comment={comment}/>
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

export default ViewSupportTicket