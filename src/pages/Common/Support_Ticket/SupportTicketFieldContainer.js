import React, {useEffect} from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import NoData from '../../../components/NoData'


const TICKET_QUERY = gql`
 query tickets($id: ID) {
  tickets(priority: $id) {
    edges {
      node {
        id
        subject
        description
        priority {
          id
          priority
        }
        service {
          id
          service
        }
        assignTo {
          id
          team
        }
        status {
          id
          status
        }
        createdBy {
          id
          username
          firstName
        }
        createdAt
      }
    }
  }
}
`

const DELETE_TICKET = gql`
  mutation($id: ID!) {
    deleteTicket(input: { pk: $id }) {
      status
    }
  }
`



const SupportTicketFieldContainer = (props) => {

  const { data: ticketQueryData, loading: ticketQueryLoading, error, refetch } = useQuery(TICKET_QUERY, {
    variables: {
      id: "UHJpb3JpdHlUeXBlOjE="
    },
    fetchPolicy: 'network-only'
  })

  const [
    deleteTicket,
    { data: deleteTicketData, error: deleteTicketError, loading: deleteTicketLoading },
  ] = useMutation(DELETE_TICKET)
  
  if(ticketQueryLoading){
    return <Text>Loading</Text>
  }
  if(error){
    return <Text>Error</Text>
  }
  console.log(ticketQueryData?.tickets.edges)
  return(
    <View>
      { ticketQueryData?.tickets.edges.length !== 0 ? (
        <FlatList
        data={ ticketQueryData?.tickets.edges }
        renderItem={({item}) => {
        // console.log(item.node.createdBy.id)
        return (
          <TouchableOpacity onPress={
                ()=> props.navigation.navigate('ViewSupportTicket', {
                    ticketId: item.node.id,
                    issueName: item.node.subject,
                    raiseBy: item.node.createdBy.firstName,
                    userId: item.node.createdBy.id,
                    status: item.node.status.status,
                    statuId: item.node.status.id,
                    priority: item.node.priority.priority,
                    priorityId: item.node.priority.id,
                    date: item.node.createdAt,
                    description: item.node.description,
                    assign: item.node.assignTo.team,
                    assignId: item.node.assignTo.id,
                    serviceIssue: item.node.service.service,
                    serviceIssueId: item.node.service.id
                  })
              }>
                <View style={styles.ticketfield}>
                    <View>
                        <Text style={{fontSize: 16, color: 'black'}}>{item.node.subject}</Text>
                        <Text style={{color: 'orange'}}>{item.node.priority.priority}</Text>
                    </View>
                    <View>
                    <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                        Alert.alert(
                            'Information',
                            'Are you sure want to close this ticket?',
                            [
                                { text: 'No', onPress: () => { } },
                                {
                                    text: 'Yes', onPress: () => {
                                      deleteTicket({
                                        variables: {
                                          id: item.node.id
                                        },
                                      })
                                      refetch()
                                    }
                                },
                            ],
                            { cancelable: false }
                          );
                        }}>
                        <MaterialCommunityIcons name='check-circle-outline' size={30} color='green' />
                    </TouchableOpacity>
                    </View>
                </View>
              </TouchableOpacity>
            )
        }}  
      />
      ) : (
        <NoData>No High Priority ticket Available</NoData>
      )}
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10
  },
  ticketfield: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      margin: 5,
      marginBottom: 10
  },
  addButton: {
      width: '100%',
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 8,
      borderColor: '#3E7BFA',
      borderWidth: 1.5,
      marginBottom: 10,
      marginTop: 20,
      justifyContent: 'center'
  },
  icon2: {
      color: '#3E7BFA',
      paddingLeft: 20,
      paddingTop: 15,
      paddingBottom: 15,
      fontSize: 20,
      fontWeight: 'bold',
      marginRight: 10
  },
  
})

export default SupportTicketFieldContainer