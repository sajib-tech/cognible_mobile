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

 } from 'react-native';
 import NavigationHeader from '../../../components/NavigationHeader'
 import TextInput from '../../../components/TextInput'
 import PickerModal from '../../../components/PickerModal'
 import Button from '../../../components/Button'
 import gql from 'graphql-tag'
 import { useMutation } from '@apollo/react-hooks'
 import { getStr } from '../../../../locales/Locale'

 
const {
    height, width,
  } = Dimensions.get('window');

  const CREATE_TICKET = gql`
  mutation createTicket(
    $issue: String!
    $description: String!
    $priority: ID!
    $service: ID!
    $assign: ID!
  ) {
    createTicket(
      input: {
        subject: $issue
        description: $description
        priority: $priority
        service: $service
        assignTo: $assign
      }
    ) {
      ticket {
        id
        subject
      }
    }
  }
`


 const AddSupportTicket = (props) => {

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

  const [issueName, setIssueName] = useState(' ')
  const [description, setDescription] = useState(' ')
  const [assign, setAssign] = useState(' ')
  const [priority, setPriority] = useState(' ')
  const [serviceIssue, setServiceIssue] = useState(' ')
  const [status, setStatus] = useState(' ')

  
  const [
    createTicket,
    { data: createTicketData, error: createTicketError, loading: createTicketLoading },
  ] = useMutation(CREATE_TICKET)



  const submitTicket = () => {
    if(!createTicketError){
      createTicket({
        variables: {
          issue: issueName,
          description: description,
          priority: priority,
          service: serviceIssue,
          assign: assign,
        },
      })
      Alert.alert("Success", "Ticket created successfully, we will get back to you soon")
      props.navigation.goBack()
    }
  }
 
     return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavigationHeader
        backPress={() => props.navigation.goBack()}
        title={getStr("TargetAllocate.AddSupportTicket")}
        />
        <ScrollView style={ styles.container}>
        <TextInput
        label={getStr("TargetAllocate.IssueName")}
        placeholder={'Issue Name'}
        onChangeText={(value) => {
          setIssueName(value)
          // console.log(value)
        }}
        />
        <TextInput
        label={getStr("TargetAllocate.Description")}
        placeholder={'Description'}
        onChangeText={(value) => {
          setDescription(value)
        }}
        />
                <PickerModal
                                label={getStr("TargetAllocate.Assign")}
                                placeholder="Select Assign"
                                data={assignData}
                                onValueChange={(value) => {
                                  setAssign(value)
                                  // console.log(value)
                                }}
                />

                <PickerModal
                label={getStr("TargetAllocate.Priority")}
                placeholder="Select Priority"
                data={priorityData}
                onValueChange={(value) => {
                  setPriority(value)
                  // console.log(value)
                }}
                />

                <PickerModal
                                label={getStr("TargetAllocate.ServiceIssue")}
                                placeholder="Select Service Issue"
                                data={serviceIssueData}
                                onValueChange={(value) => {
                                    setServiceIssue(value)
                                    console.log(value)
                                }}
                />

                {/*<PickerModal
                                label='Status'
                                placeholder="Select Status"
                                data={statusData}
                                onValueChange={(value) => {
                                    setStatus(value)
                                }}
                              />*/}
        </ScrollView>
        <View style={{ marginLeft: 20, marginRight: 20}}>
                        <Button
                            labelButton={getStr("TargetAllocate.CreateTicket")}
                            onPress={() => submitTicket()}
                            isLoading='false'
                            style={{ marginVertical: 10 }}
                            isLoading={createTicketLoading}
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

 
 
 export default AddSupportTicket