/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 import 'react-native-gesture-handler';
 import React, {useState} from 'react';
 import {
     Alert,
     SafeAreaView, 
     View,
     StyleSheet,
     ScrollView,
     Dimensions,
     Text

 } from 'react-native';
 import NavigationHeader from '../../../components/NavigationHeader'
 import TextInput from '../../../components/TextInput'
 import PickerModal from '../../../components/PickerModal'
 import Button from '../../../components/Button'
 import gql from 'graphql-tag'
 import { useMutation, useQuery } from '@apollo/react-hooks'
 import { GET_TICKET_DETAILS } from './query'
// const {
//     height, width,
//   } = Dimensions.get('window');


  const UPDATE_TICKET = gql`
  mutation(
    $id: ID!
    $subject: String!
    $description: String
    $priority: ID!
    $service: ID!
    $assign: ID!
    $status: ID!
  ) {
    updateTicket(
      input: {
        pk: $id
        subject: $subject
        description: $description
        priority: $priority
        service: $service
        assignTo: $assign
        status: $status
      }
    ) {
      ticket {
        id
        subject
        description
        createdAt
        priority {
          id
          priority
        }
        status {
          id
          status
        }
      }
    }
  }
`


 const EditSupportTicket = ({route, navigation}) => {

  const {
    ticketId,
    // issueName,
    // raiseBy,
    // status,
    // priority,
    // date,
    // description,
    // assign,
    // serviceIssue,
    // statuId,
    // priorityId,
    // assignId,
    // serviceIssueId
  } = route.params
  console.log(route.params)

  const assignData= [
    { id: "VGlja2V0QXNzaWduVHlwZTox", label: "Technical Team" },
    { id: "VGlja2V0QXNzaWduVHlwZToy", label: "Clinical Team" },
  ]
  const priorityData = [
    { id: "VGlja2V0UHJpb3JpdHlUeXBlOjE=", label: "High" },
    { id: "VGlja2V0UHJpb3JpdHlUeXBlOjI=", label: "Medium" },
    { id: "VGlja2V0UHJpb3JpdHlUeXBlOjM=", label: "Low" }
  ]
  const serviceIssueData = [
    { id: "VGlja2V0U2VydmljZVR5cGU6MQ==", label: "UI Issue " },
    { id: "VGlja2V0U2VydmljZVR5cGU6Mg==", label: "Technical Issue" },
  ]
  const statusData= [
    { id: "VGlja2V0U3RhdHVzVHlwZTox", label: "In Process" },
    { id: "VGlja2V0U3RhdHVzVHlwZToy", label: "Resolved" },
    { id: "VGlja2V0U3RhdHVzVHlwZToz", label: "Reopen" },
    { id: "VGlja2V0U3RhdHVzVHlwZTo0", label: "Closed" },
    { id: "VGlja2V0U3RhdHVzVHlwZTo1", label: "Pending Coustomer" },
  ]

  const { data, loading, error } = useQuery(GET_TICKET_DETAILS, {
    variables: {
      id: ticketId,
    },
    fetchPolicy: 'cache-and-network'
  })

  

  const [ticketIssue, setTicketIssue] = useState(data?.ticket.subject)
  const [ticketDescription, setTicketDescription] = useState(data?.ticket.description)
  const [ticketAssign, setTicketAssign] = useState(data?.ticket.assignTo.id)
  const [ticketPriority, setTicketPriority] = useState(data?.ticket.priority.id)
  const [ticketServiceIssue, setTicketServiceIssue] = useState(data?.ticket.service.id)
  const [ticketStatus, setTicketStatus] = useState(data?.ticket.status.id)
  
  const [
    updateTicket,
    { data: updateTicketData, error: updateTicketError, loading: updateTicketLoading },
  ] = useMutation(UPDATE_TICKET)

  


  const submitTicket = () => {
      if(!updateTicketError){
        updateTicket({
          variables: {
            id: ticketId,
            status: ticketStatus,
            subject: ticketIssue,
            description: ticketDescription,
            priority: ticketPriority,
            service: ticketServiceIssue,
            assign: ticketAssign,
          },
        })
      }
      Alert.alert("Success", "Ticket updated successfully!")
      navigation.pop(2)
    
  }

  if(loading){
    return <Text>Laoding</Text>
  }
 
     return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavigationHeader
        backPress={() => navigation.goBack()}
        title="Edit Support Ticket"
        />
        <ScrollView style={ styles.container}>
        <TextInput
        label="Issue Name"
        placeholder={'Issue Name'}
        defaultValue={data?.ticket.subject}
        onChangeText={(value) => {
          setTicketIssue(value)
          console.log(value)
        }}
        />
        <TextInput
        label="Description"
        placeholder={'Description'}
        defaultValue={data?.ticket.description}
        onChangeText={(value) => {
          setTicketDescription(value)
        }}
        />
                <PickerModal
                                label='Assign'
                                placeholder={data?.ticket.assignTo.team}
                                data={assignData}
                                onValueChange={(value) => {
                                  setTicketAssign(value)
                                  console.log('yhn dekh')
                                  console.log(value)
                                }}
                />

                <PickerModal
                label='Priority'
                placeholder={data?.ticket.priority.priority}
                data={priorityData}
                onValueChange={(value) => {
                  setTicketPriority(value)
                  console.log(value)
                }}
                />

                <PickerModal
                                label='Service Issue'
                                placeholder={data?.ticket.service.service}
                                data={serviceIssueData}
                                onValueChange={(value) => {
                                  setTicketServiceIssue(value)
                                    console.log(value)
                                }}
                />

                <PickerModal
                                label='Status'
                                placeholder={data?.ticket.status.status}
                                data={statusData}
                                onValueChange={(value) => {
                                  setTicketStatus(value)
                                }}
                />
        </ScrollView>
        <View style={{ marginLeft: 20, marginRight: 20}}>
                        <Button
                            labelButton="Edit Ticket"
                            onPress={() => submitTicket()}
                            isLoading='false'
                            style={{ marginVertical: 10 }}
                        />
                        </View>
     </SafeAreaView>
     )
 }

 const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20,
        // marginBottom: 10,
    },
    
})

 
 
 export default EditSupportTicket